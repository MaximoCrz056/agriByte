import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import CreateGreenhouseForm from "./FormGreenH";
import { X } from "lucide-react";
import { supabase } from "@/lib/utils/supabaseClient";
import type { Greenhouse, User } from "@/lib/types";

const ManageGreenhouses = () => {
  const [greenhouses, setGreenhouses] = useState<Greenhouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateGreenhouseForm, setShowCreateGreenhouseForm] =
    useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener usuarios
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("*");

        if (usersError) {
          throw new Error(`Error al obtener usuarios: ${usersError.message}`);
        }

        // Obtener invernaderos
        const { data: greenhousesData, error: greenhousesError } =
          await supabase.from("greenhouses").select("*");

        if (greenhousesError) {
          throw new Error(
            `Error al obtener invernaderos: ${greenhousesError.message}`
          );
        }

        setUsers(usersData || []);
        setGreenhouses(greenhousesData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al obtener datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateGreenhouse = (newGreenhouse) => {
    setGreenhouses([newGreenhouse, ...greenhouses]);
    setShowCreateGreenhouseForm(false); // Ocultar el formulario después de crear el invernadero
  };

  const handleDeleteGreenhouse = async (greenhouseId: number) => {
    try {
      const { error: deleteError } = await supabase
        .from("greenhouses")
        .delete()
        .eq("id", greenhouseId);

      if (deleteError) {
        throw new Error(
          `Error al eliminar invernadero: ${deleteError.message}`
        );
      }

      setGreenhouses(
        greenhouses.filter((greenhouse) => greenhouse.id !== greenhouseId)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar invernadero"
      );
    }
  };

  const getUsernameById = (userId: number) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.username : "Usuario no encontrado";
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
                      Propietario: {getUsernameById(greenhouse.user_id)}
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
