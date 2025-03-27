import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { getUserRole, getUserId } from "@/lib/auth"; // Obtener rol y ID del usuario
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function ProtectedRoute({
  adminOnly = false,
  farmerOnly = false,
  greenhouseProtection = false,
}) {
  const token = localStorage.getItem("token");
  const role = getUserRole(); // Obtener el rol del usuario
  const userId = getUserId(); // Obtener el ID del usuario autenticado
  const { id } = useParams(); // Obtener ID del invernadero de la URL (si existe)
  const [loading, setLoading] = useState(greenhouseProtection);
  const [isAuthorized, setIsAuthorized] = useState(!greenhouseProtection);

  useEffect(() => {
    // Si se requiere protección de invernadero y hay un ID de invernadero
    if (greenhouseProtection && id && userId) {
      const checkGreenhouseOwnership = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/greenhouses/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (!response.ok) throw new Error("Error al verificar propiedad del invernadero");
          
          const greenhouse = await response.json();
          
          // Verificar si el usuario es el propietario del invernadero
          if (greenhouse.user_id === userId) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } catch (error) {
          console.error("Error al verificar propiedad:", error);
          setIsAuthorized(false);
        } finally {
          setLoading(false);
        }
      };
      
      checkGreenhouseOwnership();
    }
  }, [greenhouseProtection, id, userId, token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && role !== "admin") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/not-auth" replace />;
  }

  if (farmerOnly && role !== "farmer") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/not-auth" replace />;
  }

  return <Outlet />;
}
