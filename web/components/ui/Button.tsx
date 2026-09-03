import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "gold" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: "bg-[#174A7C] hover:bg-[#123B63] text-white shadow-sm border border-transparent active:scale-[0.98]",
    secondary: "bg-[#0D2B4D] hover:bg-[#07192C] text-white shadow-sm border border-transparent active:scale-[0.98]",
    success: "bg-[#1EA362] hover:bg-[#17824E] text-white shadow-sm border border-transparent active:scale-[0.98]",
    gold: "bg-[#C89C2E] hover:bg-[#A68021] text-white shadow-sm border border-transparent active:scale-[0.98]",
    outline: "bg-white hover:bg-[#F7F9FB] text-[#0D2B4D] border border-[#E6E9EF] shadow-sm active:scale-[0.98]",
    ghost: "bg-transparent hover:bg-[#EBF3FA] text-[#174A7C]",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5",
    md: "px-4 py-2.5 text-sm font-semibold rounded-xl gap-2",
    lg: "px-6 py-3.5 text-base font-semibold rounded-xl gap-2.5",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-sans transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
}
