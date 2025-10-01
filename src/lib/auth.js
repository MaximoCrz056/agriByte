export const getUserRole = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    const user = JSON.parse(userStr);
    console.log("Usuario desde localStorage:", user); // Para depuración
    return user.role || null;
  } catch (error) {
    console.error("Error al obtener rol del usuario:", error);
    return null;
  }
};

export const getUserId = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    const user = JSON.parse(userStr);
    return user.id || null;
  } catch (error) {
    console.error("Error al obtener ID del usuario:", error);
    return null;
  }
};
