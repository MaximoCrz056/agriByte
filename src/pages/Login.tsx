import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginWithSupabase } from "@/lib/utils/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SNavbar from "@/components/SNavbar";
import Footer from "@/components/Footer";

// Define form validation schema

const loginSchema = z.object({
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();

  // Initialize form with validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Estado para manejar errores de autenticación
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await loginWithSupabase(data.username, data.password);
      console.log("Resultado del login:", result); // Para depuración

      // Guardar el token en localStorage
      localStorage.setItem("token", result.token);
      //Guardar el usuario en localStorage con id, username y role
      localStorage.setItem("user", JSON.stringify(result.user));

      console.log("Rol del usuario:", result.user.role); // Para depuración

      // Redirigir al dashboard
      if (result.user.role === "farmer") {
        console.log("Redirigiendo a dashboard-farmer");
        navigate("/dashboard-farmer");
      } else if (result.user.role === "admin") {
        console.log("Redirigiendo a dashboard");
        navigate("/dashboard");
      } else {
        console.log("Redirigiendo a not-auth");
        navigate("/not-auth");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SNavbar />
      <div className="flex-1 flex items-center justify-center my-40">
        <div className="max-w-md w-full px-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
            <p className="text-muted-foreground mt-2">
              Ingresa tus credenciales para acceder
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="usuario123" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input placeholder="******" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mt-2">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
