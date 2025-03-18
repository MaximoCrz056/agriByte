import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import CreateDeviceForm from "./FormDevices";
import { X } from "lucide-react";

const ManageDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDeviceForm, setShowCreateDeviceForm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await fetch("http://localhost:5000/api/devices", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener dispositivos");
        const data = await response.json();
        setDevices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);

  const handleCreateDevice = (newDevice) => {
    setDevices((prevDevices) => [newDevice, ...prevDevices]);
    setShowCreateDeviceForm(false);
  };

  const handleDeleteDevice = async (deviceId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `http://localhost:5000/api/devices/${deviceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al eliminar dispositivo");
      setDevices((prevDevices) =>
        prevDevices.filter((device) => device.id !== deviceId)
      );
    } catch (err) {
      setError(err.message);
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
            Gestión de Dispositivos
          </h1>
          <Button
            onClick={() => setShowCreateDeviceForm(true)}
            className="rounded-full px-6 py-2"
          >
            Crear Dispositivo
          </Button>
        </div>

        {showCreateDeviceForm && (
          <div className="relative bg-transparent p-4 rounded-lg">
            <CreateDeviceForm onCreateDevice={handleCreateDevice} />
            <button
              onClick={() => setShowCreateDeviceForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
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
              {devices.map((device) => (
                <li
                  key={device.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-gray-100 transition duration-200"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">ID: {device.id}</p>
                    <p className="text-lg font-medium text-gray-900">
                      {device.sensor_type}
                    </p>
                    <p className="text-sm text-gray-500">
                      Creado el: {new Date(device.created_at).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Ubicación: {device.location}
                    </p>
                    <p className="text-sm text-gray-500">
                      Greenhouse ID: {device.greenhouse_id}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteDevice(device.id)}
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

export default ManageDevices;
