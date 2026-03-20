"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAppStore } from "@/store/appStore";
import { calculateAge } from "@/lib/utils";
import { MOCK_TICKETS } from "@/lib/mockData";

const CITIES = [
  "Ciudad de México", "Guadalajara", "Monterrey", "Puebla",
  "Tijuana", "Cancún", "Mérida", "León", "Querétaro", "Otro",
];

export default function RegistroPage() {
  const router = useRouter();
  const { setUser, loadMockTickets } = useAppStore();

  const [form, setForm] = useState({ name: "", birthdate: "", city: "" });
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Ingresa tu nombre completo.";
    if (!form.birthdate) e.birthdate = "Ingresa tu fecha de nacimiento.";
    else if (calculateAge(form.birthdate) < 18)
      e.birthdate = "Solo para mayores de 18 años.";
    if (!form.city) e.city = "Selecciona tu ciudad.";
    if (!accepted) e.terms = "Debes aceptar los términos para continuar.";
    return e;
  }

  async function requestLocation(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) { resolve(true); return; }
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        { timeout: 5000 }
      );
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    const hasLocation = await requestLocation();
    if (!hasLocation) {
      setLocationError("Activa tu ubicación para continuar.");
      setLoading(false);
      return;
    }

    await new Promise((r) => setTimeout(r, 600));
    const phone = sessionStorage.getItem("yunus_phone") ?? "0000000000";
    setUser({
      id: `u_${Date.now()}`,
      phone,
      name: form.name,
      birthdate: form.birthdate,
      city: form.city,
      createdAt: new Date().toISOString(),
    });
    loadMockTickets();
    router.push("/app-shell/chat");
  }

  return (
    <main className="min-h-screen flex flex-col bg-white px-6 pt-14 pb-16 max-w-[430px] mx-auto overflow-y-auto">
      <button onClick={() => router.back()} className="text-gray-400 font-mono text-xs mb-10 self-start">
        ← Atrás
      </button>

      <div className="mb-8">
        <h2 className="font-serif text-4xl text-gray-900 leading-tight mb-2">
          Crea tu <em>perfil.</em>
        </h2>
        <p className="text-sm text-gray-400">
          Solo lo necesitamos una vez.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Nombre completo"
          type="text"
          placeholder="Como aparece en tu ID"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
        />
        <Input
          label="Fecha de nacimiento"
          type="date"
          value={form.birthdate}
          onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
          error={errors.birthdate}
        />

        <div className="w-full space-y-1.5">
          <label className="block text-[11px] font-mono uppercase tracking-widest text-gray-400">
            Ciudad de residencia
          </label>
          <select
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full px-4 py-3.5 border border-gray-200 rounded-lg font-sans text-[15px] text-gray-900 bg-white outline-none focus:border-navy transition-colors appearance-none"
          >
            <option value="">Selecciona tu ciudad</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
        </div>

        {/* Terms */}
        <label className="flex gap-3 items-start cursor-pointer">
          <div
            onClick={() => setAccepted(!accepted)}
            className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
              accepted ? "bg-navy border-navy" : "border-gray-300"
            }`}
          >
            {accepted && (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </div>
          <span className="text-xs text-gray-500 leading-relaxed">
            Acepto los{" "}
            <span className="underline text-navy">Términos y Condiciones</span>{" "}
            y la creación de mi perfil financiero para evaluar mi plan de pagos.
          </span>
        </label>
        {errors.terms && <p className="text-xs text-red-500 -mt-2">{errors.terms}</p>}

        {locationError && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700 font-sans">
            📍 {locationError}
          </div>
        )}

        <Button type="submit" loading={loading}>
          Crear mi cuenta →
        </Button>
      </form>
    </main>
  );
}
