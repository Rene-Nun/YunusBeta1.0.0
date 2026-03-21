"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/store/appStore";
import { BottomNav } from "@/components/ui/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
    } else if (pathname === "/app-shell" || pathname === "/app-shell/") {
      router.replace("/app-shell/chat");
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden pb-[65px]">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}