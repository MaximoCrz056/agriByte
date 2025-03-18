import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import CreateGreenhouseForm from "./FormGreenH";
import { X } from "lucide-react";

const ManageGreenhouses = () => {
  const [greenhouses, setGreenhouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateGreenhouseForm, setShowCreateGreenhouseForm] =
    useState(false);
  const [users, setUsers] = useState([]); // Estado para almacenar los usuarios

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error al obtener usuarios");
        const data = await response.json();
        setUsers(data); // Guardamos los usuarios en el estado
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

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
        setGreenhouses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGreenhouses();
  }, []);

  const handleCreateGreenhouse = (newGreenhouse) => {
    setGreenhouses([newGreenhouse, ...greenhouses]);
    setShowCreateGreenhouseForm(false); // Ocultar el formulario después de crear el invernadero
  };

  const handleDeleteGreenhouse = async (greenhouseId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/greenhouses/${greenhouseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al eliminar invernadero");

      setGreenhouses(
        greenhouses.filter((greenhouse) => greenhouse.id !== greenhouseId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const getUserEmailById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.email : "Usuario no encontrado"; // Devolver el correo del usuario
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto my-10">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6 gap-4">
          <Link to="/dashboard">
            <Button variant="outline" size="lg" className="rounded-full px-6">
              Regresar
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center sm:text-left">
            Gestión de Invernaderos
          </h1>
          <Button
            onClick={() => setShowCreateGreenhouseForm(true)}
            className="rounded-full px-6 py-2"
          >
            Crear Invernadero
          </Button>
        </div>

        {showCreateGreenhouseForm && (
          <div className="relative">
            <CreateGreenhouseForm onCreateGreenhouse={handleCreateGreenhouse} />
            <button
              onClick={() => setShowCreateGreenhouseForm(false)}
              className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} /> {/* Ícono de cerrar */}
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center text-lg text-gray-500">Cargando...</div>
        ) : error ? (
          <div className="text-center text-lg text-red-500">{error}</div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden my-10">
            <ul className="divide-y divide-gray-200">
              {greenhouses.map((greenhouse) => (
                <li
                  key={greenhouse.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-gray-100 transition duration-200"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">ID: {greenhouse.id}</p>
                    <p className="text-lg font-medium text-gray-900">
                      {greenhouse.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Ubicación: {greenhouse.location.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Propietario: {getUserEmailById(greenhouse.user_id)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Creado el: {greenhouse.created_at}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteGreenhouse(greenhouse.id)}
                    className="bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition duration-150"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageGreenhouses;
