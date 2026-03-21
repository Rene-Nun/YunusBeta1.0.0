"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAppStore } from "@/store/appStore";
import { calculateAge } from "@/lib/utils";
import { MOCK_TICKETS } from "@/lib/mockData";

const CIUDADES_MX = [
  "Acapulco","Aguascalientes","Campeche","Cancún","Celaya","Chetumal",
  "Chihuahua","Chilpancingo","Ciudad de México","Ciudad Juárez","Ciudad Obregón",
  "Ciudad Victoria","Coatzacoalcos","Colima","Cuernavaca","Culiacán","Durango",
  "Ensenada","Fresnillo","Guadalajara","Guanajuato","Guaymas","Hermosillo",
  "Irapuato","Jalapa","La Paz","León","Los Cabos","Los Mochis","Manzanillo",
  "Matamoros","Mazatlán","Mérida","Mexicali","Monterrey","Morelia","Nogales",
  "Nuevo Laredo","Oaxaca","Pachuca","Piedras Negras","Playa del Carmen","Puebla",
  "Puerto Vallarta","Querétaro","Reynosa","Saltillo","San Cristóbal de las Casas",
  "San Luis Potosí","Tampico","Tapachula","Tepic","Tijuana","Tlaxcala","Toluca",
  "Torreón","Tuxtla Gutiérrez","Uruapan","Veracruz","Villahermosa","Xalapa",
  "Zacatecas","Zamora","Zihuatanejo",
];

const SALARIOS = [
  "Menos de $5,000","$5,000 – $10,000","$10,000 – $20,000",
  "$20,000 – $35,000","$35,000 – $50,000","Más de $50,000",
];

export default function RegistroPage() {
  const router = useRouter();
  const { setUser, loadMockTickets } = useAppStore();

  const [form, setForm] = useState({ name: "", birthdate: "", city: "", salary: "" });
  const [cityInput, setCityInput] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  function handleCityInput(val: string) {
    setCityInput(val);
    setForm({ ...form, city: val });
    if (val.length >= 3) {
      const filtered = CIUDADES_MX.filter((c) =>
        c.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 6);
      setCitySuggestions(filtered);
    } else {
      setCitySuggestions([]);
    }
  }

  function selectCity(city: string) {
    setCityInput(city);
    setForm({ ...form, city });
    setCitySuggestions([]);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Ingresa tu nombre completo.";
    if (!form.birthdate) e.birthdate = "Ingresa tu fecha de nacimiento.";
    else if (calculateAge(form.birthdate) < 18)
      e.birthdate = "Solo para mayores de 18 años.";
    if (!form.city) e.city = "Selecciona tu ciudad.";
    if (!form.salary) e.salary = "Selecciona tu rango de salario.";
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
        <p className="text-sm text-gray-400">Solo lo necesitamos una vez.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nombre */}
        <Input
          label="Nombre completo"
          type="text"
          placeholder="Como aparece en tu ID"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
        />

                {/* Fecha de nacimiento */}
        <div className="w-full space-y-1.5">
          <label className="block text-[11px] font-mono uppercase tracking-widest text-gray-400">
            Fecha de nacimiento
          </label>
          <div className="flex gap-2">
            <select
              value={form.birthdate.split("-")[2] || ""}
              onChange={(e) => {
                const parts = form.birthdate.split("-");
                setForm({ ...form, birthdate: `${parts[0] || "2000"}-${parts[1] || "01"}-${e.target.value}` });
              }}
              className="flex-1 px-3 py-3.5 border border-gray-200 rounded-lg font-sans text-[14px] text-gray-900 bg-white outline-none focus:border-navy appearance-none"
            >
              <option value="">Día</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={String(d).padStart(2, "0")}>{d}</option>
              ))}
            </select>
            <select
              value={form.birthdate.split("-")[1] || ""}
              onChange={(e) => {
                const parts = form.birthdate.split("-");
                setForm({ ...form, birthdate: `${parts[0] || "2000"}-${e.target.value}-${parts[2] || "01"}` });
              }}
              className="flex-[1.4] px-3 py-3.5 border border-gray-200 rounded-lg font-sans text-[14px] text-gray-900 bg-white outline-none focus:border-navy appearance-none"
            >
              <option value="">Mes</option>
              {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map((m, i) => (
                <option key={m} value={String(i + 1).padStart(2, "0")}>{m}</option>
              ))}
            </select>
            <select
              value={form.birthdate.split("-")[0] || ""}
              onChange={(e) => {
                const parts = form.birthdate.split("-");
                setForm({ ...form, birthdate: `${e.target.value}-${parts[1] || "01"}-${parts[2] || "01"}` });
              }}
              className="flex-[1.2] px-3 py-3.5 border border-gray-200 rounded-lg font-sans text-[14px] text-gray-900 bg-white outline-none focus:border-navy appearance-none"
            >
              <option value="">Año</option>
              {Array.from({ length: 82 }, (_, i) => new Date().getFullYear() - 17 - i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          {errors.birthdate && <p className="text-xs text-red-500">{errors.birthdate}</p>}
        </div>
        {/* Ciudad con buscador */}
        <div className="w-full space-y-1.5 relative">
          <label className="block text-[11px] font-mono uppercase tracking-widest text-gray-400">
            Ciudad de residencia
          </label>
          <input
            type="text"
            value={cityInput}
            onChange={(e) => handleCityInput(e.target.value)}
            placeholder="Escribe tu ciudad..."
            className="w-full px-4 py-3.5 border border-gray-200 rounded-lg font-sans text-[15px] text-gray-900 bg-white outline-none focus:border-navy transition-colors"
          />
          {citySuggestions.length > 0 && (
            <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden top-full mt-1">
              {citySuggestions.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => selectCity(city)}
                  className="w-full text-left px-4 py-3 text-sm font-sans text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                >
                  {city}
                </button>
              ))}
            </div>
          )}
          {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
        </div>

                {/* Salario mensual */}
        <div className="w-full space-y-1.5">
          <label className="block text-[11px] font-mono uppercase tracking-widest text-gray-400">
            Salario mensual
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-sans text-[15px]">$</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
              className="w-full pl-8 pr-16 py-3.5 border border-gray-200 rounded-lg font-sans text-[15px] text-gray-900 bg-white outline-none focus:border-navy transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-[11px]">MXN</span>
          </div>
          {errors.salary && <p className="text-xs text-red-500">{errors.salary}</p>}
        </div>

        {/* Términos */}
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
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700">
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