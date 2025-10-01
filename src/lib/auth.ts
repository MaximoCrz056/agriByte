import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const supabaseUrl = "https://urfzvyfmnjfotibyuvaj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZnp2eWZtbmpmb3RpYnl1dmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNTYwMTMsImV4cCI6MjA3NDgzMjAxM30.3JcY99R-zn5EqsaOHIZ1ZF_7aFC5DWOZdZOqI2wVv-M";

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función de login
export const loginWithSupabase = async (username: string, password: string) => {
    // 1. Buscar el usuario por username
    const { data: users, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

    if (userError) {
        throw new Error("Usuario no encontrado");
    }

    // 2. Verificar la contraseña
    // Nota: En producción, deberías usar bcrypt o similar para comparar contraseñas hasheadas
    if (users.password_hash !== password) {
        throw new Error("Contraseña incorrecta");
    }

    // 3. Crear sesión con Supabase (opcional, para usar auth de Supabase en el futuro)
    // const { data: session, error: sessionError } = await supabase.auth.signInWithPassword({
    //   email: users.email,
    //   password: password,
    // });

    return {
        user: {
            id: users.id,
            username: users.username,
            role: users.role
        },
        token: "dummy-token" // En una implementación real, usarías un JWT o el token de sesión de Supabase
    };
};