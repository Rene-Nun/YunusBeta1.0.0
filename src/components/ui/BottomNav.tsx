"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopNav() {
  const pathname = usePathname();
  const isChat = pathname.startsWith("/app-shell/chat");

  if (!isChat) return null;

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 pointer-events-none">
      <div className="flex items-center justify-between px-5 pt-12 pointer-events-auto">

        {/* Bóveda — izquierda */}
        <Link href="/app-shell/boveda">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 shadow-md">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span className="font-mono text-[10px] text-gray-400 tracking-wide">Bóveda</span>
          </div>
        </Link>

        {/* Marketplace — derecha */}
        <Link href="/app-shell/marketplace">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 shadow-md">
            <span className="font-mono text-[10px] text-gray-400 tracking-wide">Marketplace</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
        </Link>

      </div>
    </div>
  );
}

export function BottomNav() {
  return null;
}