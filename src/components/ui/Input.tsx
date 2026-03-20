import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-[11px] font-mono uppercase tracking-widest text-gray-400">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3.5 border rounded-lg font-sans text-[15px] text-gray-900 bg-white outline-none transition-colors placeholder:text-gray-300",
          error
            ? "border-red-400 focus:border-red-500"
            : "border-gray-200 focus:border-navy",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 font-sans">{error}</p>
      )}
    </div>
  )
);
Input.displayName = "Input";
