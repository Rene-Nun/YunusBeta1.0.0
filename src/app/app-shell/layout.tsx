"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/appStore";
import { BottomNav } from "@/components/ui/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/auth");
  }, [isAuthenticated, router]);

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
