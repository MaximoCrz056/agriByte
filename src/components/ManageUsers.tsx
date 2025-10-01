import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import CreateUserForm from "./FormUsers"; // Asegúrate de importar el formulario
import { X } from "lucide-react"; // Importar el ícono de "X"
import { supabase } from "@/lib/utils/supabaseClient";
import type { User } from "@/lib/types";

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: usersData, error: supaError } = await supabase
          .from("users")
          .select("*")
          .neq("role", "admin");

        if (supaError) {
          throw new Error(`Error al obtener usuarios: ${supaError.message}`);
        }

        setUsers(usersData || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al obtener usuarios"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = (newUser) => {
    setUsers([newUser, ...users]);
    setShowCreateUserForm(false); // Ocultar el formulario después de crear el usuario
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);

      if (deleteError) {
        throw new Error(`Error al eliminar usuario: ${deleteError.message}`);
      }

      setUsers(users.filter((user) => user.id !== userId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar usuario"
      );
    }
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
            Gestión de Usuarios
          </h1>
          <Button
            onClick={() => setShowCreateUserForm(true)}
            className="rounded-full px-6 py-2"
          >
            Crear Usuario
          </Button>
        </div>

        {showCreateUserForm && (
          <div className="relative">
            <CreateUserForm onCreateUser={handleCreateUser} />
            {/* Ícono de cerrar el formulario */}
            <button
              onClick={() => setShowCreateUserForm(false)}
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
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-gray-100 transition duration-200"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">ID: {user.id}</p>
                    <p className="text-lg font-medium text-gray-900">
                      {user.username}
                    </p>
                    <p className="text-sm text-gray-500">Rol: {user.role}</p>
                    <p className="text-sm text-gray-500">
                      Creado el: {user.created_at}
                    </p>
                    <p className="text-sm text-gray-500">
                      Fecha de creación:{" "}
                      {new Date(user.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
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

export default ManageUsers;
