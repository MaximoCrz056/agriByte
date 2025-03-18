import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserRole } from "@/lib/auth"; // Importa la función

export default function ProtectedRoute({ adminOnly = false, farmerOnly = false }) {
  const token = localStorage.getItem("token");
  const role = getUserRole(); // Obtener el rol del token

  if (!token) {
    return <Navigate to="/login" replace />; // Si no hay token, redirige al login
  }

  if (adminOnly && role !== "admin") {
    //Cerra sesión y redirige al inicio
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/not-auth" replace />; // Si no es admin, redirige al inicio
  }

  if (farmerOnly && role !== "farmer") {
    //Cerra sesión y redirige al inicio
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/not-auth" replace />; // Si no es farmer, redirige al inicio
  }

  return <Outlet />; // Si todo está bien, renderiza la ruta protegida
}
