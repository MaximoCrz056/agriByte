import { supabase } from "./supabaseClient";

// Crea un usuario y su invernadero asociado en Supabase
export async function createUserWithGreenhouse({
    user,
    greenhouse
}: {
    user: { username: string; password: string; role?: string };
    greenhouse: { name: string; location?: string };
}) {
    // 1. Crear usuario
    const { data: userData, error: userError } = await supabase
        .from("users")
        .insert([{
            username: user.username,
            password_hash: user.password, // Nota: en producción deberías hashear la contraseña
            role: user.role || 'farmer'
        }])
        .select()
        .single();

    if (userError) throw userError;

    // 2. Crear invernadero asociado
    const { data: greenhouseData, error: greenhouseError } = await supabase
        .from("greenhouses")
        .insert([{
            ...greenhouse,
            user_id: userData.id
        }])
        .select()
        .single();

    if (greenhouseError) throw greenhouseError;

    return { user: userData, greenhouse: greenhouseData };
}