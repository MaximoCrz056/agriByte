import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

const CreateDeviceForm = ({ onCreateDevice }) => {
  const [sensor_type, setSensorType] = useState("");
  const [location, setLocation] = useState("");
  const [greenhouse_id, setGreenhouse_id] = useState("");
  const [greenhouses, setGreenhouses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchGreenhouses = async () => {
      try {
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
      }
    };

    fetchGreenhouses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sensor_type || !location || !greenhouse_id) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await fetch("http://localhost:5000/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sensor_type,
          location,
          greenhouse_id,
        }),
      });

      if (!response.ok) throw new Error("Error al crear el dispositivo");

      const newDevice = await response.json();
      onCreateDevice(newDevice);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Crear Nuevo Dispositivo
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Dispositivo
            </label>
            <select
              value={sensor_type}
              onChange={(e) => setSensorType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Seleccione un tipo de dispositivo</option>
              <option value="temperatura">Temperatura</option>
              <option value="humedad">Humedad</option>
              <option value="luz">Luz</option>
              <option value="esp32">ESP32</option>
            </select>
          </div>
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invernadero
            </label>
            <select
              value={greenhouse_id}
              onChange={(e) => {
                const selectedGreenhouse = greenhouses.find(
                  (greenhouse) => greenhouse.id === e.target.value
                );
                setGreenhouse_id(selectedGreenhouse?.id || "");
                setLocation(selectedGreenhouse?.name || "");
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Seleccione un invernadero</option>
              {greenhouses.map((greenhouse) => (
                <option key={greenhouse.id} value={greenhouse.id}>
                  {greenhouse.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <div className="flex justify-between items-center">
          <Button
            type="submit"
            variant="default"
            disabled={loading}
            className="px-6 py-3 rounded-md"
          >
            {loading ? "Creando..." : "Crear Dispositivo"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateDeviceForm;
