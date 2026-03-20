import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-sans font-medium rounded-lg transition-all active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-navy text-white hover:bg-navy-800",
    secondary: "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200",
    ghost: "border border-navy text-navy hover:bg-navy hover:text-white",
    danger: "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-3.5 text-sm w-full",
    lg: "px-6 py-4 text-base w-full",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
