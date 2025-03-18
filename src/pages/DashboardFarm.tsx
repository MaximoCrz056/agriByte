import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SNavbar from "@/components/SNavbar";
import { User, Sprout } from "lucide-react"; // Importar los íconos

export default function DashboardFarm() {
  const navigate = useNavigate();
  const [greenhouses, setGreenhouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGreenhouses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("http://localhost:5000/api/greenhouses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error al obtener invernaderos");

        const data = await response.json();

        // Obtener el user_id del usuario autenticado desde el localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user ? user.id : null;

        // Filtrar los invernaderos donde el user_id coincida con el id del usuario autenticado
        const userGreenhouses = data.filter(
          (greenhouse) => greenhouse.user_id === userId
        );

        setGreenhouses(userGreenhouses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGreenhouses();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-accent/5 to-transparent"></div>
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      <SNavbar />
      <div className="flex-1 my-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Bienvenido a tu dashboard</h1>
            <Sprout size={48} />
            <Button
              variant="destructive"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/");
              }}
            >
              Cerrar Sesión
            </Button>
          </div>

          {loading ? (
            <div className="text-center">Cargando invernaderos...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Tus Invernaderos</h2>
              {greenhouses.length === 0 ? (
                <p>No tienes invernaderos asociados.</p>
              ) : (
                <ul>
                  {greenhouses.map((greenhouse) => (
                    <li
                      key={greenhouse.id}
                      className="mb-4 p-4 border border-gray-200 rounded-lg bg-card"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="text-xl font-medium">
                            {greenhouse.name}
                          </p>
                          <p className="text-gray-500">
                            Ubicación: {greenhouse.location.toUpperCase()}
                          </p>
                          <p className="text-gray-500">
                            Creado el: {greenhouse.created_at}
                          </p>
                        </div>
                        <Button
                          variant="default"
                          onClick={() => {
                            /* Redirigir o ver detalles del invernadero */
                          }}
                        >
                          Ingresar
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
