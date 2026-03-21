"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import { ChatMessage, QuoteCard as QuoteCardType } from "@/types";
import { MATCHES, calcDownPayment, calcInstallment } from "@/lib/mockData";
import { formatMXN } from "@/lib/utils";

const MUNDIAL_KEYWORDS = [
  "partido", "boleto", "mexico", "méxico", "mundial", "sede", "azteca",
  "akron", "bbva", "cdmx", "gdl", "mty", "guadalajara", "monterrey",
  "korea", "tunez", "túnez", "colombia", "uruguay", "españa", "sudafrica",
  "sudáfrica", "uzbekistan", "uzbekistán", "japón", "japon", "round",
  "fase", "final", "quiero", "ir", "juego",
];

function isWorldCupRelated(text: string) {
  const lower = text.toLowerCase();
  return MUNDIAL_KEYWORDS.some((kw) => lower.includes(kw));
}

function findMatch(text: string) {
  const lower = text.toLowerCase();
  return MATCHES.find(
    (m) =>
      m.price > 0 &&
      (m.teams.toLowerCase().split(/[\s·]+/).some((w) => lower.includes(w)) ||
        m.city.toLowerCase().split(/[\s,]+/).some((w) => w.length > 3 && lower.includes(w)))
  );
}

function QuoteCard({ card, onPay }: { card: QuoteCardType; onPay: () => void }) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-700 mt-2 max-w-[280px]">
      <div className="bg-[#0f172a] px-4 py-3">
        <div className="flex justify-between items-center mb-0.5">
          <span className="font-serif text-sm text-white">{card.match.teams}</span>
          <span className="font-mono text-[9px] text-slate-400 bg-white/10 px-1.5 py-0.5 rounded">
            {card.match.category}
          </span>
        </div>
        <div className="font-mono text-[10px] text-slate-400">
          📍 {card.match.venue} · {card.match.date}
        </div>
      </div>
      <div className="bg-slate-800 px-4 py-2.5 flex border-t border-white/5">
        <div className="flex-1 text-center">
          <div className="font-mono text-[8px] text-slate-500 mb-0.5">Total</div>
          <div className="font-mono text-[11px] text-white font-semibold">{formatMXN(card.totalPrice)}</div>
        </div>
        <div className="flex-1 text-center border-x border-white/5">
          <div className="font-mono text-[8px] text-amber-400 mb-0.5">Anticipo 15%</div>
          <div className="font-mono text-[11px] text-amber-400 font-semibold">{formatMXN(card.downPayment)}</div>
        </div>
        <div className="flex-1 text-center">
          <div className="font-mono text-[8px] text-green-400 mb-0.5">{card.installmentsTotal}x Quinc.</div>
          <div className="font-mono text-[11px] text-green-400 font-semibold">{formatMXN(card.installmentAmount)}</div>
        </div>
      </div>
      <div className="bg-slate-800 px-4 pb-3 border-t border-white/5">
        <div className="flex gap-1 my-2">
          <div className="h-1 flex-1 bg-green-400 rounded-full" />
          {Array.from({ length: card.installmentsTotal - 1 }).map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-white/10 rounded-full" />
          ))}
        </div>
        <div className="font-mono text-[9px] text-slate-500">{formatMXN(card.installmentAmount)}/quincena</div>
      </div>
      <div className="bg-slate-800 px-4 pb-4 border-t border-white/5">
        <button
          onClick={onPay}
          className="w-full bg-white text-[#0f172a] rounded-lg py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-[.98] transition-transform"
        >
          💳 Pagar Enganche ({formatMXN(card.downPayment)})
        </button>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { user, messages, addMessage, addTicket } = useAppStore();
  const [input, setInput] = useState("");
  const [paidCards, setPaidCards] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        id: "greeting",
        role: "agent",
        content: `¡Hola${user?.name ? `, ${user.name.split(" ")[0]}` : ""}! 👋 Soy Yunus. Dime a qué partido del Mundial 2026 quieres ir y estructuro tu plan de pagos en segundos.`,
        timestamp: new Date(),
      });
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;
    setInput("");

    addMessage({ id: `m_${Date.now()}`, role: "user", content: text, timestamp: new Date() });
    addMessage({ id: `thinking_${Date.now()}`, role: "agent", content: "__thinking__", timestamp: new Date() });

    await new Promise((r) => setTimeout(r, 2500));

    if (!isWorldCupRelated(text)) {
      addMessage({
        id: `r_${Date.now()}`, role: "agent",
        content: "Solo estructuro planes del Mundial 2026. ¿A qué partido deseas ir? Puedes decirme la sede, los equipos o la fecha.",
        timestamp: new Date(),
      });
      return;
    }

    const match = findMatch(text) ?? MATCHES.filter((m) => m.price > 0)[Math.floor(Math.random() * 8)];
    addMessage({
      id: `r_${Date.now()}`, role: "agent",
      content: "¡Encontré algo perfecto para ti! 🏆 Aquí está tu plan de acceso:",
      card: { match, totalPrice: match.price, downPayment: calcDownPayment(match.price), installmentAmount: calcInstallment(match.price), installmentsTotal: 5 },
      timestamp: new Date(),
    });
  }

  function handlePay(msg: ChatMessage) {
    if (!msg.card) return;
    setPaidCards((prev) => { const next = new Set<string>(prev); next.add(msg.id); return next; });
    addTicket({
      id: `t_${Date.now()}`, matchId: msg.card.match.id, match: msg.card.match,
      status: "pending_payment", totalPrice: msg.card.totalPrice, downPayment: msg.card.downPayment,
      installmentAmount: msg.card.installmentAmount, installmentsTotal: msg.card.installmentsTotal,
      installmentsPaid: 0, purchasedAt: new Date().toISOString(),
    });
    addMessage({ id: `pay_${Date.now()}`, role: "agent", content: "¡Perfecto! Tu boleto está en tu Bóveda esperando el enganche. 🎫", timestamp: new Date() });
  }

  const visibleMessages = messages.filter((m) => !m.id.startsWith("thinking_"));

  return (
    <div className="flex flex-col h-full" style={{ background: "#0f172a" }}>

      {/* ── HEADER ÚNICO ── */}
      <div className="flex-shrink-0" style={{ background: "#0f172a" }}>
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/5">

          {/* Botón Bóveda */}
          <Link href="/app-shell/boveda">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
          </Link>

          {/* Centro — Yunus */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
              <span className="font-serif text-[10px] text-white">Y</span>
            </div>
            <div>
              <p className="font-sans text-xs text-white font-medium leading-none">Yunus</p>
              <p className="font-mono text-[9px] text-slate-500 leading-none mt-0.5">Agente · Mundial 2026</p>
            </div>
          </div>

          {/* Botón Marketplace */}
          <Link href="/app-shell/marketplace">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center active:bg-white/20 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
          </Link>

        </div>
      </div>


      {/* ── MENSAJES ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {visibleMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "agent" && (
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                <span className="font-serif text-[10px] text-white">Y</span>
              </div>
            )}
            <div className="max-w-[78%]">
              {msg.content === "__thinking__" ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                  <p className="font-mono text-[9px] text-slate-400 uppercase tracking-widest mb-2">Yunus está procesando</p>
                  {["⚡ Analizando inventario...", "🔍 Cruzando con tu perfil...", "✅ Estructurando plan..."].map((s, i) => (
                    <p key={i} className="font-mono text-[10px] text-slate-500 mb-1 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>{s}</p>
                  ))}
                </div>
              ) : (
                <>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${msg.role === "user" ? "bg-white text-[#0f172a] rounded-tr-sm font-sans" : "border border-white/10 text-slate-200 rounded-tl-sm font-sans"}`}
                    style={msg.role === "agent" ? { background: "rgba(255,255,255,0.06)" } : {}}
                  >
                    {msg.content}
                  </div>
                  {msg.card && !paidCards.has(msg.id) && <QuoteCard card={msg.card} onPay={() => handlePay(msg)} />}
                  {msg.card && paidCards.has(msg.id) && (
                    <div className="mt-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl max-w-[280px]">
                      <p className="font-mono text-[10px] text-green-400">✓ Boleto movido a tu Bóveda</p>
                    </div>
                  )}
                </>
              )}
              <p className="font-mono text-[9px] text-slate-600 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── INPUT ── */}
      <div className="px-4 py-3 border-t border-white/5 flex-shrink-0" style={{ background: "#0f172a" }}>
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Escribe tu destino soñado..."
            className="flex-1 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-slate-200 placeholder:text-slate-600 font-sans outline-none transition-colors"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-xl bg-white flex items-center justify-center disabled:opacity-30 active:scale-95 transition-transform flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
            </svg>
          </button>
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {["México en CDMX", "Partido en GDL", "Final del Mundial"].map((s) => (
            <button key={s} onClick={() => setInput(s)}
              className="text-[10px] font-mono text-slate-500 rounded-lg px-2.5 py-1 active:bg-white/5 transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}