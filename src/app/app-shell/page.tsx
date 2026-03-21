"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AppShellRoot() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/app-shell/chat");
  }, [router]);
  return null;
}