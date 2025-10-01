import React, { useState } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/lib/utils/supabaseClient";
import type { Greenhouse } from "@/lib/types";

interface CreateFarmerGreenhouseFormProps {
  onCreateGreenhouse: (greenhouse: Greenhouse) => void;
  onCancel: () => void;
}

const CreateFarmerGreenhouseForm: React.FC<CreateFarmerGreenhouseFormProps> = ({
  onCreateGreenhouse,
  onCancel,
}) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !location) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      setLoading(true);

      // Obtener el user_id del usuario autenticado desde el localStorage
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        throw new Error("No se encontró la información del usuario");
      }

      const user = JSON.parse(userStr);
      if (!user.id) {
        throw new Error("No se pudo obtener el ID del usuario");
      }

      // Crear nuevo invernadero en Supabase
      const { data: newGreenhouse, error: supaError } = await supabase
        .from("greenhouses")
        .insert([
          {
            name,
            location,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (supaError) {
        throw new Error(`Error al crear el invernadero: ${supaError.message}`);
      }

      if (!newGreenhouse) {
        throw new Error("No se pudo crear el invernadero");
      }

      onCreateGreenhouse(newGreenhouse);
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "Error al crear el invernadero"
      );
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
