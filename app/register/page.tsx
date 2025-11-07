"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [nombre, setNombre] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  // 🔄 Verificar si ya hay usuario logueado → redirigir
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        router.push("/user");
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-10">Verificando sesión...</p>;
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    // 1️⃣ Registrar en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setMessage("❌ Error: " + authError.message);
      return;
    }

    const userId = authData.user?.id;
    if (!userId) {
      setMessage("⚠️ No se pudo obtener el ID del usuario.");
      return;
    }

    // 2️⃣ Insertar en tabla 'estudiantes'
    const { error: insertError } = await supabase
      .from("estudiantes")
      .insert([
        {
          id: userId,
          nombre,
          correo: email,
          telefono,
        },
      ]);

    if (insertError) {
      setMessage("⚠️ Usuario creado, pero error al guardar datos: " + insertError.message);
      return;
    }

    setMessage("✅ Registro exitoso. Revisa tu correo para confirmar.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-md p-6">
        {/* Título */}
        <h1 className="text-xl font-bold text-center mb-6">Registro de estudiante</h1>

        {/* Formulario */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Nombre */}
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Correo */}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Teléfono */}
          <input
            type="tel"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Contraseña */}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200 font-medium"
          >
            Registrarse
          </button>
        </form>

        {/* Mensaje */}
        {message && (
          <p className={`mt-4 text-center text-sm ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        {/* Enlace a login */}
        <p className="mt-4 text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-600 underline hover:text-blue-800"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
}