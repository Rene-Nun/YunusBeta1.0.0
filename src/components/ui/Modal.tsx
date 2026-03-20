"use client";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-10 shadow-2xl",
          "animate-in slide-in-from-bottom duration-300",
          className
        )}
      >
        {title && (
          <h3 className="font-serif text-xl mb-4 text-gray-900">{title}</h3>
        )}
        {children}
      </div>
    </div>
  );
}
