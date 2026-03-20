"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { MOCK_OTP } from "@/lib/mockData";

export default function OTPPage() {
  const router = useRouter();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const phone = typeof window !== "undefined" ? sessionStorage.getItem("yunus_phone") : "";

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  function handleChange(i: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  }

  async function handleVerify() {
    const code = digits.join("");
    if (code.length < 6) return;
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    if (code !== MOCK_OTP) {
      setError("Código incorrecto. Intenta de nuevo.");
      setDigits(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
      setLoading(false);
      return;
    }
    router.push("/auth/registro");
  }

  return (
    <main className="min-h-screen flex flex-col bg-white px-6 pt-16 pb-12 max-w-[430px] mx-auto">
      <button
        onClick={() => router.back()}
        className="text-gray-400 font-mono text-xs mb-10 self-start flex items-center gap-1"
      >
        ← Atrás
      </button>

      <div className="mb-10">
        <h2 className="font-serif text-4xl text-gray-900 leading-tight mb-3">
          Verifica tu <em>número.</em>
        </h2>
        <p className="text-sm text-gray-400 font-sans">
          Enviamos un código a{" "}
          <span className="font-mono text-gray-700">{phone ? `+52 ${phone}` : "tu celular"}</span>
        </p>
        <p className="text-xs text-gray-300 font-mono mt-1">
          Código de prueba: <span className="text-gray-500">123456</span>
        </p>
      </div>

      {/* OTP inputs */}
      <div className="flex gap-2 mb-6">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-11 h-11 text-center text-xl font-mono text-gray-900 border-2 rounded-xl outline-none transition-colors border-gray-200 focus:border-navy"
          />
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-500 font-sans mb-4">{error}</p>
      )}

      <Button
        onClick={handleVerify}
        loading={loading}
        disabled={digits.join("").length < 6}
      >
        Verificar
      </Button>

      <button className="mt-4 text-xs text-gray-300 font-mono text-center">
        ¿No recibiste el código? Reenviar
      </button>
    </main>
  );
}