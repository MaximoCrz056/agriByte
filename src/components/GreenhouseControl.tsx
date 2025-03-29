import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sprout, Thermometer, Droplets, ArrowLeft } from "lucide-react";
import SNavbar from "./SNavbar";
import mqtt from "mqtt";
import { apiGet } from "@/lib/apiUtils";
import { ENDPOINTS } from "@/lib/config";

export default function GreenhouseControl() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [greenhouse, setGreenhouse] = useState(null);
  const [sensorData, setSensorData] = useState({
    temperatura: "---",
    humedad: "---",
    humedad_suelo: "---",
    humedad_suelo_porcentaje: "---",
    estado_calefaccion: "---",
    estado_servo: "---",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const [mqttClient, setMqttClient] = useState(null);
  const [lightStatus, setLightStatus] = useState("Desconocido");
  const [servoStatus, setServoStatus] = useState("Desconocido");
  const [connectionStatus, setConnectionStatus] = useState("Desconectado");

  useEffect(() => {
    // Configuración MQTT con credenciales
    const options = {
      username: "hivemq.webclient.1742277525146",
      password: "NkO.?p1,2e0VrAB$6abK",
      protocol: "wss",
      clientId: `greenhouse_web_${Math.random().toString(16).substr(2, 8)}`,
      reconnectPeriod: 5000,
    };

    // Conectar a MQTT
    const client = mqtt.connect(
      "wss://6a2e20f80d0345088d4d4b7f8a0e3097.s1.eu.hivemq.cloud:8884/mqtt",
      options
    );

    client.on("connect", () => {
      console.log(`Conectado a MQTT para invernadero ${id}`);
      setConnectionStatus("Conectado");

      // Suscribirse a múltiples temas MQTT
      client.subscribe(`greenhouse/luces`, (err) => {
        if (!err) console.log(`Suscripción a luces exitosa`);
      });

      // Suscribirse a múltiples temas MQTT
      client.subscribe(`greenhouse/servo`, (err) => {
        if (!err) console.log(`Suscripción a servo exitosa`);
      });

      client.subscribe(`greenhouse/sensores`, (err) => {
        if (!err) console.log(`Suscripción a sensores exitosa`);
      });

      client.subscribe(`greenhouse/luces/estado`, (err) => {
        if (!err) console.log(`Suscripción a estado de luces exitosa`);
      });

      client.subscribe(`greenhouse/servo/estado`, (err) => {
        if (!err) console.log(`Suscripción a estado del servo exitosa`);
      });

      console.log(`Solicitando estado actual de las luces...`);
      client.publish(`greenhouse/luces/request`, "STATUS", { qos: 1 });

      console.log(`Solicitando estado actual del servo...`);
      client.publish(`greenhouse/servo/request`, "STATUS", { qos: 1 });
    });

    client.on("message", (topic, message) => {
      const messageStr = message.toString();
      console.log(`Mensaje recibido en ${topic}: ${messageStr}`);

      if (topic === `greenhouse/luces` || topic === `greenhouse/luces/estado`) {
        setLightStatus(messageStr);
      } else if (topic === `greenhouse/servo` || topic === `greenhouse/servo/estado`) {
        setServoStatus(messageStr);
      } else if (topic === `greenhouse/sensores`) {
        try {
          const data = JSON.parse(messageStr);
          console.log("Datos de sensores recibidos:", data); // Log sensor data
          setSensorData(data);
        } catch (e) {
          console.error("Error al parsear datos de sensores:", e);
        }
      }
    });

    client.on("error", (err) => {
      console.error("Error MQTT:", err);
      setError("Error de conexión MQTT: " + err.message);
      setConnectionStatus("Error");
    });

    client.on("close", () => {
      console.log("Conexión MQTT cerrada");
      setConnectionStatus("Desconectado");
    });

    client.on("offline", () => {
      console.log("Cliente MQTT offline");
      setConnectionStatus("Sin conexión");
    });

    // Guardar cliente
    setMqttClient(client);

    return () => {
      if (client) {
        console.log("Cerrando conexión MQTT");
        client.end();
      }
    };
  }, [id]);

  // Obtener datos del invernadero específico (desde la API)
  useEffect(() => {
    if (!id) return;

    const fetchGreenhouseData = async () => {
      try {
        const response = await apiGet(`${ENDPOINTS.GREENHOUSES}/${id}`);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGreenhouseData();
  }, [id]);

  const handleControlAction = async (action) => {
    setIsActionInProgress(true);
    try {
      if (mqttClient && mqttClient.connected) {
        let topic;
        let message;

        switch (action) {
          case "turn_on_lights":
            topic = `greenhouse/luces`;
            message = "ON";
            break;
          case "turn_off_lights":
            topic = `greenhouse/luces`;
            message = "OFF";
            break;
          case "turn_on_servo": // New case for servo
            topic = `greenhouse/servo`;
            message = "ON";
            break;
          case "turn_off_servo": // New case for servo
            topic = `greenhouse/servo`;
            message = "OFF";
            break;
          default:
            break;
        }

        mqttClient.publish(topic, message, { qos: 1 }, (err) => {
          if (err) {
            console.error(`Error al publicar en ${topic}:`, err);
            setError(`Error al enviar comando: ${err.message}`);
          } else {
            console.log(`Mensaje "${message}" publicado en ${topic}`);
          }
        });
      } else {
        throw new Error("No hay conexión MQTT activa");
      }
    } catch (err) {
      console.error("Error al realizar acción:", err);
      setError("Error al enviar comando: " + err.message);
    } finally {
      setIsActionInProgress(false);
    }
  };

  const refreshStatus = () => {
    if (mqttClient && mqttClient.connected) {
      console.log(`Solicitando estado actual del invernadero...`);
      mqttClient.publish(`greenhouse/luces/request`, "STATUS", { qos: 1 });
      mqttClient.publish(`greenhouse/servo/request`, "STATUS", { qos: 1 });
    } else {
      setError("No hay conexión MQTT activa");
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-accent/20 to-transparent"></div>
        <div className="absolute top-1/4 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <SNavbar />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center my-20 mx-4 sm:mx-10">
        <Button variant="outline" onClick={() => navigate("/dashboard-farmer")}>
          <ArrowLeft className="mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left mt-4 sm:mt-0">
          Control del Invernadero
        </h1>
        <div className="mt-4 sm:mt-0">
          <Sprout size={90} className="mx-auto sm:mx-0 text-primary" />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 p-4 mb-4 bg-red-50 rounded text-center sm:text-left">
          {error}
          <Button
            variant="outline"
            size="sm"
            className="ml-4"
            onClick={() => setError(null)}
          >
            Cerrar
          </Button>
        </div>
      )}

      {/* Connection Status */}
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between items-center">
        <div className="text-sm">
          Estado de conexión:
          <span
            className={`font-bold ml-2 ${
              connectionStatus === "Conectado"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {connectionStatus}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshStatus}
          disabled={connectionStatus !== "Conectado"}
          className="mt-2 sm:mt-0"
        >
          Actualizar Estado
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center p-10">
          Cargando información del invernadero...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Greenhouse Info & Light Control */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">
              {greenhouse?.name || "Invernadero"}
            </h2>
            <p className="text-gray-500 text-center sm:text-left">
              Ubicación:{" "}
              {greenhouse?.location?.toUpperCase() || "No especificada"}
            </p>

            <div className="mt-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">
                Control de Luces
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <p className="text-center sm:text-left">
                  Estado actual:{" "}
                  <span
                    className={`font-bold ${
                      lightStatus === "ON" ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    {lightStatus === "ON" ? "Encendidas" : "Apagadas"}
                  </span>
                </p>
                <div className="flex gap-2 justify-center sm:justify-start">
                  <Button
                    onClick={() => handleControlAction("turn_on_lights")}
                    variant="default"
                    disabled={
                      isActionInProgress ||
                      lightStatus === "ON" ||
                      connectionStatus !== "Conectado"
                    }
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Encender
                  </Button>
                  <Button
                    onClick={() => handleControlAction("turn_off_lights")}
                    variant="outline"
                    disabled={
                      isActionInProgress ||
                      lightStatus === "OFF" ||
                      connectionStatus !== "Conectado"
                    }
                  >
                    Apagar
                  </Button>
                </div>
              </div>
            </div>

            {/* Servo Motor Control - Moved to its own section with consistent styling */}
            <div className="mt-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">
                Control del Servomotor
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <p className="text-center sm:text-left">
                  Estado actual:{" "}
                  <span
                    className={`font-bold ${
                      servoStatus === "ON" ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    {servoStatus === "ON" ? "Activado" : "Desactivado"}
                  </span>
                </p>
                <div className="flex gap-2 justify-center sm:justify-start">
                  <Button
                    onClick={() => handleControlAction("turn_on_servo")}
                    variant="default"
                    disabled={
                      isActionInProgress ||
                      servoStatus === "ON" ||
                      connectionStatus !== "Conectado"
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Activar
                  </Button>
                  <Button
                    onClick={() => handleControlAction("turn_off_servo")}
                    variant="outline"
                    disabled={
                      isActionInProgress ||
                      servoStatus === "OFF" ||
                      connectionStatus !== "Conectado"
                    }
                  >
                    Desactivar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sensor Data */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold mb-6 text-center sm:text-left">
              Datos de Sensores
            </h3>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <Thermometer className="text-red-500 mr-4" size={32} />
                <div>
                  <p className="text-sm text-gray-500">Temperatura</p>
                  <p className="text-xl font-bold">
                    {sensorData.temperatura}°C
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <Droplets className="text-blue-500 mr-4" size={32} />
                <div>
                  <p className="text-sm text-gray-500">Humedad</p>
                  <p className="text-xl font-bold">{sensorData.humedad}%</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <Droplets className="text-green-500 mr-4" size={32} />
                <div>
                  <p className="text-sm text-gray-500">
                    Humedad del Suelo
                  </p>
                  <p className="text-xl font-bold">
                    {sensorData.humedad_suelo}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <Droplets className="text-green-500 mr-4" size={32} />
                <div>
                  <p className="text-sm text-gray-500">Humedad del Suelo (%)</p>
                  <p className="text-xl font-bold">
                    {sensorData.humedad_suelo_porcentaje}%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <Sprout className="text-blue-500 mr-4" size={32} />
                <div>
                  <p className="text-sm text-gray-500">Estado del Servomotor</p>
                  <p className="text-xl font-bold">
                    {servoStatus === "ON" ? "Activado" : "Desactivado"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
