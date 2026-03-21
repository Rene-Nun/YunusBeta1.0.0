"use client";
import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { Ticket, TicketStatus } from "@/types";
import { formatMXN } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

const STATUS_LABELS: Record<TicketStatus, { label: string; color: string }> = {
  pending_payment: { label: "Enganche pendiente", color: "text-amber-600 bg-amber-50 border-amber-200" },
  validating:      { label: "Validando pago",     color: "text-blue-600 bg-blue-50 border-blue-200" },
  active:          { label: "Boleto activo",       color: "text-green-600 bg-green-50 border-green-200" },
  reselling:       { label: "En reventa",          color: "text-purple-600 bg-purple-50 border-purple-200" },
  sold:            { label: "Vendido",             color: "text-gray-400 bg-gray-50 border-gray-200" },
};

function ProgressBar({ paid, total }: { paid: number; total: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total + 1 }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i === 0
              ? paid >= 0 ? "bg-navy" : "bg-gray-200"
              : i <= paid ? "bg-green-500" : "bg-gray-100"
          }`}
        />
      ))}
    </div>
  );
}

function TicketCard({ ticket }: { ticket: Ticket }) {
  const { updateTicketStatus } = useAppStore();
  const [payModal, setPayModal] = useState(false);
  const [reventaModal, setReventaModal] = useState(false);
  const [reventaConfirm, setReventaConfirm] = useState(false);
  const [noticeLoading, setNoticeLoading] = useState(false);
  const [noticeError, setNoticeError] = useState("");
  const [noticeSent, setNoticeSent] = useState(false);

  const statusInfo = STATUS_LABELS[ticket.status];

  async function handleNotice() {
    setNoticeLoading(true);
    setNoticeError("");
    await new Promise((r) => setTimeout(r, 1000));
    // Simulate 10% network error
    if (Math.random() < 0.1) {
      setNoticeError("No pudimos registrar tu aviso. Intenta de nuevo.");
      setNoticeLoading(false);
      return;
    }
    updateTicketStatus(ticket.id, "validating");
    setNoticeSent(true);
    setNoticeLoading(false);
    setTimeout(() => setPayModal(false), 1500);
  }

  function handleReventa() {
    if (!reventaConfirm) { setReventaConfirm(true); return; }
    updateTicketStatus(ticket.id, "reselling");
    setReventaModal(false);
    setReventaConfirm(false);
  }

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {/* Ticket header */}
        <div className="bg-navy px-5 py-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-serif text-base text-white leading-tight">
              {ticket.match.teams}
            </h3>
            <span className="font-mono text-[9px] text-slate-400 bg-white/10 px-2 py-0.5 rounded ml-2 flex-shrink-0">
              {ticket.match.category}
            </span>
          </div>
          <p className="font-mono text-[10px] text-slate-400">
            📍 {ticket.match.venue} · {ticket.match.date}
          </p>
        </div>

        {/* Status & progress */}
        <div className="px-5 py-4 border-b border-gray-50">
          <div className="flex justify-between items-center mb-3">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            <span className="font-mono text-[10px] text-gray-400">
              {ticket.installmentsPaid}/{ticket.installmentsTotal} quinc.
            </span>
          </div>
          <ProgressBar paid={ticket.installmentsPaid} total={ticket.installmentsTotal} />
        </div>

        {/* Financials */}
        <div className="px-5 py-3 flex gap-4 text-center border-b border-gray-50">
          <div className="flex-1">
            <p className="font-mono text-[8px] text-gray-300 uppercase tracking-wide">Total</p>
            <p className="font-sans text-sm font-semibold text-gray-900">{formatMXN(ticket.totalPrice)}</p>
          </div>
          <div className="flex-1">
            <p className="font-mono text-[8px] text-amber-500 uppercase tracking-wide">Anticipo</p>
            <p className="font-sans text-sm font-semibold text-amber-600">{formatMXN(ticket.downPayment)}</p>
          </div>
          <div className="flex-1">
            <p className="font-mono text-[8px] text-green-500 uppercase tracking-wide">Quincena</p>
            <p className="font-sans text-sm font-semibold text-green-600">{formatMXN(ticket.installmentAmount)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 flex gap-2">
          {ticket.status === "pending_payment" && (
            <button
              onClick={() => setPayModal(true)}
              className="flex-1 bg-navy text-white text-xs font-sans font-medium py-2.5 rounded-lg active:scale-[.98] transition-transform"
            >
              Pagar Enganche →
            </button>
          )}
          {ticket.status === "validating" && (
            <div className="flex-1 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-mono text-center py-2.5 rounded-lg">
              Validando tu pago...
            </div>
          )}
          {ticket.status === "active" && (
            <div className="flex-1 bg-green-50 border border-green-100 text-green-600 text-xs font-mono text-center py-2.5 rounded-lg">
              ✓ Boleto activo
            </div>
          )}
          {(ticket.status === "pending_payment" || ticket.status === "active") && (
            <button
              onClick={() => setReventaModal(true)}
              className="px-4 py-2.5 border border-gray-200 text-gray-400 text-xs font-sans rounded-lg active:scale-[.98] transition-transform"
            >
              Revender
            </button>
          )}
        </div>
      </div>

      {/* Pay Modal */}
      <Modal open={payModal} onClose={() => setPayModal(false)} title="Instrucciones de pago">
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <p className="font-mono text-[10px] text-gray-400 uppercase tracking-wide">Transferencia SPEI</p>
            <p className="font-sans text-sm text-gray-700">Banco: <strong>STP</strong></p>
            <div className="flex items-center justify-between">
              <p className="font-mono text-sm text-gray-900">CLABE: <strong>646180524700001234</strong></p>
            </div>
            <p className="font-sans text-sm text-gray-700">
              Monto exacto: <strong className="text-amber-600">{formatMXN(ticket.downPayment)}</strong>
            </p>
            <p className="font-sans text-sm text-gray-700">Concepto: <strong>YUNUS-{ticket.id.toUpperCase()}</strong></p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <p className="font-mono text-[10px] text-gray-400 uppercase tracking-wide">Pago en Oxxo</p>
            <p className="font-sans text-sm text-gray-500">
              Referencia de pago: <strong className="text-gray-900 font-mono">YUN-{ticket.id.slice(-6).toUpperCase()}</strong>
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <p className="text-xs text-amber-700 leading-relaxed">
              ⏱ Tu boleto se reflejará en tu Bóveda una vez que el anticipo esté confirmado (1-24 hrs hábiles).
            </p>
          </div>

          {noticeError && (
            <p className="text-xs text-red-500 font-sans">{noticeError}</p>
          )}

          {noticeSent ? (
            <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-green-600 font-sans">✓ Aviso enviado. Estamos validando tu pago.</p>
            </div>
          ) : (
            <Button variant="secondary" loading={noticeLoading} onClick={handleNotice}>
              Ya transferí · Avisar pago
            </Button>
          )}
        </div>
      </Modal>

      {/* Reventa Modal */}
      <Modal open={reventaModal} onClose={() => { setReventaModal(false); setReventaConfirm(false); }}>
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <span className="text-lg">⚠️</span>
            </div>
            <h3 className="font-serif text-xl text-gray-900">
              {reventaConfirm ? "¿Confirmas la reventa?" : "Revender boleto"}
            </h3>
          </div>

          {!reventaConfirm ? (
            <>
              <p className="text-sm text-gray-500 leading-relaxed">
                Al revender, Yunus publicará tu boleto en el Marketplace. Con el precio de venta se cubrirá tu deuda pendiente más una <strong className="text-gray-700">comisión del 6%</strong> por el servicio. El resto te lo regresamos a tu cuenta.
              </p>
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-xs text-red-600 font-sans">
                  Esta acción no se puede deshacer una vez que el boleto esté en el mercado.
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed font-sans">
              Confirma que entiendes que se aplicará el <strong>6% de comisión</strong> sobre el precio de venta y que el proceso puede tomar hasta 48 hrs.
            </p>
          )}

          <Button variant="danger" onClick={handleReventa}>
            {reventaConfirm ? "Sí, quiero revender" : "Continuar con reventa"}
          </Button>
          <Button variant="secondary" onClick={() => { setReventaModal(false); setReventaConfirm(false); }}>
            Cancelar
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default function BovedaPage() {
  const { user, tickets, logout } = useAppStore();

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 pt-6 pb-5 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-mono text-[10px] text-gray-300 uppercase tracking-widest mb-1">
              Bóveda
            </p>
            <h2 className="font-serif text-3xl text-gray-900 leading-none">
              Hola, <em>{user?.name?.split(" ")[0] ?? "usuario"}.</em>
            </h2>
          </div>
          <button onClick={logout} className="font-mono text-[10px] text-gray-300 mt-1">
            Salir
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5 space-y-4">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <span className="text-2xl">🎫</span>
            </div>
            <h3 className="font-serif text-xl text-gray-700 mb-2">Tu bóveda está vacía.</h3>
            <p className="text-sm text-gray-400 font-sans leading-relaxed">
              Usa el Chat para pedir tu primer boleto del Mundial 2026.
            </p>
          </div>
        ) : (
          <>
            <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest px-1">
              {tickets.length} {tickets.length === 1 ? "boleto" : "boletos"}
            </p>
            {tickets.map((t) => (
              <TicketCard key={t.id} ticket={t} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
