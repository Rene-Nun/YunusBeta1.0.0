// ─────────────────────────────────────────────────────────────────────────────
// Capa de Supabase — actualmente en modo MOCK
// Para activar Supabase real:
//   1. Crea proyecto en supabase.com
//   2. Copia URL y anon key a .env.local
//   3. Cambia NEXT_PUBLIC_MOCK_MODE=false
//   4. Corre el schema SQL de /supabase/schema.sql en el editor de Supabase
// ─────────────────────────────────────────────────────────────────────────────

const isMock = process.env.NEXT_PUBLIC_MOCK_MODE !== "false";

let supabase: ReturnType<typeof import("@supabase/supabase-js").createClient> | null = null;

if (!isMock) {
  const { createClient } = require("@supabase/supabase-js");
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export { supabase, isMock };
