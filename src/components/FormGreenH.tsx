import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

const CreateGreenhouseForm = ({ onCreateGreenhouse }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [user_id, setUser_id] = useState("");
  const [users, setUsers] = useState([]); // Cambié 'user' por 'users' para manejar una lista de usuarios
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error al obtener usuarios");
        const data = await response.json();

        // Filtramos los usuarios con rol 'farmer'
        const farmerUsers = data.filter((user) => user.role === "farmer");
        setUsers(farmerUsers);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !location || !user_id) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await fetch("http://localhost:5000/api/greenhouses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          location,
          user_id,
        }),
      });

      if (!response.ok) throw new Error("Error al crear el invernadero");

      const newGreenhouse = await response.json();
      onCreateGreenhouse(newGreenhouse);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Crear Invernadero</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Nombre del invernadero"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Ubicación</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecciona una ubicación</option>
            <option value="mexico">México</option>
            <option value="mexico-city">Ciudad de México</option>
            <option value="guadalajara">Guadalajara</option>
            <option value="oaxaca">Oaxaca</option>
            <option value="chiapas">Chiapas</option>
            <option value="tabasco">Tabasco</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">ID del usuario</label>
          <select
            value={user_id}
            onChange={(e) => setUser_id(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Seleccione un usuario</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.id} - {user.email}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="default"
            disabled={loading}
            className="px-6 py-3 rounded-md"
          >
            {loading ? "Creando..." : "Crear Usuario"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateGreenhouseForm;
