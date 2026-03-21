"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopNav() {
  const pathname = usePathname();
  const isChat = pathname.startsWith("/app-shell/chat");

  if (!isChat) return null;

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#0f172a] border-b border-white/5">
      <div className="flex items-center justify-between px-5 pt-12 pb-3">

        <Link href="/app-shell/boveda">
          <span className="font-mono text-xs text-slate-400 hover:text-white transition-colors">
            Bóveda
          </span>
        </Link>

        <div />

        <Link href="/app-shell/marketplace">
          <span className="font-mono text-xs text-slate-400 hover:text-white transition-colors">
            Marketplace
          </span>
        </Link>

      </div>
    </div>
  );
}

export function BottomNav() {
  return null;
}