import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Ticket, ChatMessage } from "@/types";
import { MOCK_TICKETS } from "@/lib/mockData";

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;

  // Tickets in vault
  tickets: Ticket[];

  // Chat
  messages: ChatMessage[];

  // Actions
  setUser: (user: User) => void;
  logout: () => void;
  addTicket: (ticket: Ticket) => void;
  updateTicketStatus: (ticketId: string, status: Ticket["status"]) => void;
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
  loadMockTickets: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      tickets: [],
      messages: [],

      setUser: (user) =>
        set({ user, isAuthenticated: true }),

      logout: () =>
        set({ user: null, isAuthenticated: false, tickets: [], messages: [] }),

      addTicket: (ticket) =>
        set((s) => ({ tickets: [...s.tickets, ticket] })),

      updateTicketStatus: (ticketId, status) =>
        set((s) => ({
          tickets: s.tickets.map((t) =>
            t.id === ticketId ? { ...t, status } : t
          ),
        })),

      addMessage: (msg) =>
        set((s) => ({ messages: [...s.messages, msg] })),

      clearMessages: () => set({ messages: [] }),

      loadMockTickets: () => set({ tickets: MOCK_TICKETS }),
    }),
    {
      name: "yunus-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        tickets: state.tickets,
      }),
    }
  )
);
