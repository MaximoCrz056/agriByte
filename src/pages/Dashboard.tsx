import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SNavbar from "@/components/SNavbar";
import { User, Sprout } from "lucide-react"; // Importar los íconos

export default function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [greenhouses, setGreenhouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetching users and greenhouses
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const usersResponse = await fetch("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const greenhousesResponse = await fetch(
          "http://localhost:5000/api/greenhouses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!usersResponse.ok || !greenhousesResponse.ok) {
          throw new Error("Error al obtener datos.");
        }

        const usersData = await usersResponse.json();
        const greenhousesData = await greenhousesResponse.json();

        setUsers(usersData);
        setGreenhouses(greenhousesData);
      } catch (err) {
        setError(
          err.message || "Hubo un problema al conectar con el servidor."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

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
            <h1 className="text-3xl font-bold">Dashboard</h1>
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
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-destructive/15 text-destructive p-4 rounded-md">
              {error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-8">
                {/* Cards for users and greenhouses */}
                <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <User className="mr-2" /> Usuarios
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/manage-users")}
                  >
                    Gestionar Usuarios
                  </Button>
                </div>

                <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Sprout className="mr-2" /> Invernaderos
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/manage-greenhouses")}
                  >
                    Gestionar Invernaderos
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
