"use client";
import { useState } from "react";
import { MATCHES, calcDownPayment, calcInstallment } from "@/lib/mockData";
import { formatMXN } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";


// Simulated resale listings — a subset of matches at slight markup
const RESALE_LISTINGS = [
  { id: "r1", match: MATCHES[4], price: 21000, seller: "Usuario anónimo", daysLeft: 12 },
  { id: "r2", match: MATCHES[9], price: 15500, seller: "Usuario anónimo", daysLeft: 8  },
  { id: "r3", match: MATCHES[7], price: 20000, seller: "Usuario anónimo", daysLeft: 5  },
];

function ResaleCard({
  listing,
  onBuy,
}: {
  listing: (typeof RESALE_LISTINGS)[0];
  onBuy: (listing: (typeof RESALE_LISTINGS)[0]) => void;
}) {
  const dp = calcDownPayment(listing.price);
  const inst = calcInstallment(listing.price);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-navy px-5 py-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-serif text-base text-white leading-tight">
            {listing.match.teams}
          </h3>
          <span className="font-mono text-[9px] text-slate-400 bg-white/10 px-2 py-0.5 rounded ml-2 flex-shrink-0">
            {listing.match.category}
          </span>
        </div>
        <p className="font-mono text-[10px] text-slate-400">
          📍 {listing.match.venue} · {listing.match.date}
        </p>
      </div>

      <div className="px-5 py-3 flex gap-4 text-center border-b border-gray-50">
        <div className="flex-1">
          <p className="font-mono text-[8px] text-gray-300 uppercase tracking-wide">Precio</p>
          <p className="font-sans text-sm font-semibold text-gray-900">{formatMXN(listing.price)}</p>
        </div>
        <div className="flex-1">
          <p className="font-mono text-[8px] text-amber-500 uppercase tracking-wide">Anticipo</p>
          <p className="font-sans text-sm font-semibold text-amber-600">{formatMXN(dp)}</p>
        </div>
        <div className="flex-1">
          <p className="font-mono text-[8px] text-green-500 uppercase tracking-wide">Quincena</p>
          <p className="font-sans text-sm font-semibold text-green-600">{formatMXN(inst)}</p>
        </div>
      </div>

      <div className="px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-[9px]">👤</span>
          </div>
          <span className="font-mono text-[10px] text-gray-400">{listing.seller}</span>
          <span className="font-mono text-[9px] text-gray-300">· {listing.daysLeft}d</span>
        </div>
        <button
          onClick={() => onBuy(listing)}
          className="bg-navy text-white text-xs font-sans font-medium px-4 py-2 rounded-lg active:scale-[.98] transition-transform"
        >
          Adquirir →
        </button>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const { addTicket } = useAppStore();
  const [selected, setSelected] = useState<(typeof RESALE_LISTINGS)[0] | null>(null);
  const [purchased, setPurchased] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const available = RESALE_LISTINGS.filter((l) => !purchased.has(l.id));

  async function handleConfirm() {
    if (!selected) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    addTicket({
      id: `t_mkt_${Date.now()}`,
      matchId: selected.match.id,
      match: selected.match,
      status: "pending_payment",
      totalPrice: selected.price,
      downPayment: calcDownPayment(selected.price),
      installmentAmount: calcInstallment(selected.price),
      installmentsTotal: 5,
      installmentsPaid: 0,
      purchasedAt: new Date().toISOString(),
    });
    setPurchased((prev) => { const next = new Set<string>(prev); next.add(selected.id); return next; });
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSelected(null);
      setSuccess(false);
    }, 1800);
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 pt-14 pb-5 border-b border-gray-100">
        <p className="font-mono text-[10px] text-gray-300 uppercase tracking-widest mb-1">
          Marketplace
        </p>
        <h2 className="font-serif text-3xl text-gray-900 leading-none">
          Boletos de <em>oportunidad.</em>
        </h2>
        <p className="text-xs text-gray-400 font-sans mt-1.5">
          Boletos en reventa verificados por Yunus.
        </p>
      </div>

      <div className="px-4 py-5 space-y-4">
        {available.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <span className="text-2xl">🏟️</span>
            </div>
            <h3 className="font-serif text-xl text-gray-700 mb-2">El mercado está limpio.</h3>
            <p className="text-sm text-gray-400 font-sans leading-relaxed">
              Aún no hay boletos de oportunidad disponibles.{" "}
              <span className="text-navy">Regresa más tarde.</span>
            </p>
          </div>
        ) : (
          <>
            <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest px-1">
              {available.length} {available.length === 1 ? "boleto disponible" : "boletos disponibles"}
            </p>
            {available.map((l) => (
              <ResaleCard key={l.id} listing={l} onBuy={setSelected} />
            ))}
            <div className="bg-gray-100 rounded-2xl px-4 py-4 mt-2">
              <p className="font-mono text-[9px] text-gray-400 uppercase tracking-widest mb-1">
                ¿Cómo funciona?
              </p>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                Todos los boletos son verificados por Yunus. Al adquirir uno, pagas el 15% de enganche y el resto en quincenas. Yunus garantiza la autenticidad del boleto antes de transferírtelo.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Confirm Modal */}
      <Modal
        open={!!selected && !success}
        onClose={() => setSelected(null)}
        title="Confirmar adquisición"
      >
        {selected && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-serif text-base text-gray-900 mb-0.5">{selected.match.teams}</p>
              <p className="font-mono text-[10px] text-gray-400">
                {selected.match.venue} · {selected.match.date}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 text-center">
                <p className="font-mono text-[8px] text-gray-400 uppercase mb-0.5">Total</p>
                <p className="font-sans text-sm font-semibold text-gray-900">
                  {formatMXN(selected.price)}
                </p>
              </div>
              <div className="flex-1 bg-amber-50 rounded-xl px-3 py-2.5 text-center">
                <p className="font-mono text-[8px] text-amber-500 uppercase mb-0.5">Pagas hoy</p>
                <p className="font-sans text-sm font-semibold text-amber-600">
                  {formatMXN(calcDownPayment(selected.price))}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              El boleto pasará a tu Bóveda una vez confirmado el enganche. Las instrucciones de pago estarán disponibles ahí.
            </p>
            <Button loading={loading} onClick={handleConfirm}>
              Confirmar y ver instrucciones →
            </Button>
            <Button variant="secondary" onClick={() => setSelected(null)}>
              Cancelar
            </Button>
          </div>
        )}
      </Modal>

      {/* Success toast */}
      {success && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-navy text-white px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-2 font-sans text-sm animate-bounce">
          <span>✓</span> Boleto agregado a tu Bóveda
        </div>
      )}
    </div>
  );
}