import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "401 Error: User is not authenticated as Admin. Access denied.",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">401</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Parece que no tienes permisos para acceder a esta página</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
