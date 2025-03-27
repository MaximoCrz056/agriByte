export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar el payload del JWT
    return payload.role || null; // Retornar el rol si existe
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};

export const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar el payload del JWT
    return payload.user_id || null; // Retornar el ID del usuario si existe
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};
