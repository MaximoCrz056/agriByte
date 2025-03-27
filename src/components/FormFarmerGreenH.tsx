import React, { useState } from "react";
import { Button } from "./ui/button";

const CreateFarmerGreenhouseForm = ({ onCreateGreenhouse, onCancel }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !location) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se encontró token de autenticación");
        return;
      }
      
      // Obtener el user_id del usuario autenticado desde el localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user ? user.id : null;
      
      if (!userId) {
        setError("No se pudo obtener la información del usuario");
        return;
      }

      const response = await fetch("http://localhost:5000/api/greenhouses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          location,
          user_id: userId, // Usar el ID del usuario autenticado
        }),
      });

      if (!response.ok) throw new Error("Error al crear el invernadero");

      const newGreenhouse = await response.json();
      onCreateGreenhouse(newGreenhouse);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Crear Nuevo Invernadero</h2>
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
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="px-4 py-2 rounded-md"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={loading}
            className="px-4 py-2 rounded-md"
          >
            {loading ? "Creando..." : "Crear Invernadero"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateFarmerGreenhouseForm;