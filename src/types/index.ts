export type TicketStatus =
  | "pending_payment"
  | "validating"
  | "active"
  | "reselling"
  | "sold";

export interface Match {
  id: string;
  teams: string;
  date: string;
  venue: string;
  city: string;
  stage: string;
  price: number;
  category: string;
}

export interface Ticket {
  id: string;
  matchId: string;
  match: Match;
  status: TicketStatus;
  totalPrice: number;
  downPayment: number;
  installmentAmount: number;
  installmentsTotal: number;
  installmentsPaid: number;
  purchasedAt: string;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  birthdate: string;
  city: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  card?: QuoteCard;
  timestamp: Date;
}

export interface QuoteCard {
  match: Match;
  totalPrice: number;
  downPayment: number;
  installmentAmount: number;
  installmentsTotal: number;
}
