import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const supabaseUrl = "https://urfzvyfmnjfotibyuvaj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZnp2eWZtbmpmb3RpYnl1dmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNTYwMTMsImV4cCI6MjA3NDgzMjAxM30.3JcY99R-zn5EqsaOHIZ1ZF_7aFC5DWOZdZOqI2wVv-M";

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Interfaces
interface LoginResponse {
    user: {
        id: number;
        username: string;
        role: string;
    };
    token: string;
}

// Función de login
export async function loginWithSupabase(username: string, password: string): Promise<LoginResponse> {
    console.log("Intentando login con usuario:", username);

    // 1. Buscar el usuario por username
    const { data: users, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

    console.log("Datos del usuario encontrado:", users); // Para depuración

    if (userError) {
        console.error("Error al buscar usuario:", userError); // Para depuración
        throw new Error("Usuario no encontrado");
    }

    // 2. Verificar la contraseña
    // Nota: En producción, deberías usar bcrypt o similar para comparar contraseñas hasheadas
    if (users.password_hash !== password) {
        throw new Error("Contraseña incorrecta");
    }

    const response = {
        user: {
            id: users.id,
            username: users.username,
            role: users.role.toLowerCase() // Asegurarnos de que el rol esté en minúsculas
        },
        token: "dummy-token"
    };

    console.log("Respuesta de login:", response); // Para depuración
    return response;
}