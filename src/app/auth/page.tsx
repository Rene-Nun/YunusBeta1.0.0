"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { validateMexicanPhone } from "@/lib/utils";

export default function AuthPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const clean = phone.replace(/\D/g, "");
    if (!validateMexicanPhone(clean)) {
      setError("Número inválido. Ingresa 10 dígitos.");
      return;
    }
    setLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    // In mock mode, always proceed
    sessionStorage.setItem("yunus_phone", clean);
    router.push("/auth/otp");
  }

  return (
    <main className="min-h-screen flex flex-col justify-between bg-white px-6 pt-10 pb-12 max-w-[430px] mx-auto">
      <div>
        {/* Logo area */}
        <div className="mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[3px] text-gray-300 mb-3">
            Bienvenido a
          </p>
          <h1 className="font-serif text-5xl text-gray-900 leading-none">
            Yunus<em className="text-gray-300">.</em>
          </h1>
          <p className="mt-4 text-sm text-gray-400 font-sans leading-relaxed">
            Tu lugar en el <em className="font-serif text-gray-600 text-base">Mundial 2026.</em>{" "}
            Págalo en quincenas.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Número de celular"
            type="tel"
            placeholder="55 1234 5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={error}
            maxLength={10}
            inputMode="numeric"
            autoFocus
          />
          <Button type="submit" loading={loading}>
            Continuar →
          </Button>
        </form>

        <p className="mt-4 text-[11px] text-gray-300 font-mono text-center leading-relaxed">
          Te enviaremos un código de verificación.
          <br />
          Solo México · +52
        </p>
      </div>

      <p className="text-[10px] text-gray-200 font-mono text-center">
        Al continuar aceptas los Términos de Uso y Aviso de Privacidad de Yunus.
      </p>
    </main>
  );
}
