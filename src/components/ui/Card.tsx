import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-white border border-gray-100 rounded-2xl p-4 shadow-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
}
