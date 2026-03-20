import { Match, Ticket } from "@/types";

export const MATCHES: Match[] = [
  { id: "m1",  teams: "México vs Sudáfrica",      date: "11 Jun 2026", venue: "Estadio Azteca",    city: "CDMX",        stage: "Fase de grupos", price: 0,     category: "Cat 2" },
  { id: "m2",  teams: "Korea vs TBA",             date: "11 Jun 2026", venue: "Estadio Akron",     city: "Guadalajara", stage: "Fase de grupos", price: 6000,  category: "Cat 2" },
  { id: "m3",  teams: "Túnez vs TBA",             date: "14 Jun 2026", venue: "Estadio BBVA",      city: "Monterrey",   stage: "Fase de grupos", price: 3000,  category: "Cat 3" },
  { id: "m4",  teams: "Uzbekistán vs Colombia",   date: "17 Jun 2026", venue: "Estadio Azteca",    city: "CDMX",        stage: "Fase de grupos", price: 9000,  category: "Cat 2" },
  { id: "m5",  teams: "México vs Korea",          date: "18 Jun 2026", venue: "Estadio Akron",     city: "Guadalajara", stage: "Fase de grupos", price: 19000, category: "Cat 2" },
  { id: "m6",  teams: "Túnez vs Japón",           date: "20 Jun 2026", venue: "Estadio BBVA",      city: "Monterrey",   stage: "Fase de grupos", price: 4000,  category: "Cat 3" },
  { id: "m7",  teams: "Colombia vs TBA",          date: "23 Jun 2026", venue: "Estadio Akron",     city: "Guadalajara", stage: "Fase de grupos", price: 10000, category: "Cat 2" },
  { id: "m8",  teams: "México vs TBA",            date: "24 Jun 2026", venue: "Estadio Azteca",    city: "CDMX",        stage: "Fase de grupos", price: 19000, category: "Cat 1" },
  { id: "m9",  teams: "Sudáfrica vs Korea",       date: "24 Jun 2026", venue: "Estadio BBVA",      city: "Monterrey",   stage: "Fase de grupos", price: 3000,  category: "Cat 3" },
  { id: "m10", teams: "Uruguay vs España",        date: "26 Jun 2026", venue: "Estadio Akron",     city: "Guadalajara", stage: "Fase de grupos", price: 14000, category: "Cat 2" },
  { id: "m11", teams: "Round of 32 · 1F vs 2C",  date: "29 Jun 2026", venue: "Estadio BBVA",      city: "Monterrey",   stage: "Round of 32",    price: 7000,  category: "Cat 2" },
  { id: "m12", teams: "Round of 32 · 1A vs 3C",  date: "30 Jun 2026", venue: "Estadio Azteca",    city: "CDMX",        stage: "Round of 32",    price: 10000, category: "Cat 2" },
  { id: "m13", teams: "Round of 16 · W79 vs W80",date: "5 Jul 2026",  venue: "Estadio Azteca",    city: "CDMX",        stage: "Round of 16",    price: 13000, category: "Cat 1" },
];

export function calcDownPayment(price: number) {
  return Math.round(price * 0.15);
}

export function calcInstallment(price: number, n = 5) {
  return Math.round((price * 0.85) / n / 10) * 10;
}

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "t1",
    matchId: "m7",
    match: MATCHES[6],
    status: "pending_payment",
    totalPrice: 10000,
    downPayment: 1500,
    installmentAmount: 1700,
    installmentsTotal: 5,
    installmentsPaid: 0,
    purchasedAt: new Date().toISOString(),
  },
];

// OTP simulado — cualquier número acepta el código 123456
export const MOCK_OTP = "123456";
