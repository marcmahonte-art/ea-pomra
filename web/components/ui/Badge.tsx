import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "success" | "warning" | "error" | "gold" | "outline" | "neutral";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-[#EBF3FA] text-[#174A7C] border border-[#D5E5F5]",
    success: "bg-[#E8F6EF] text-[#1EA362] border border-[#C5EBDA]",
    warning: "bg-[#FEF7EC] text-[#B86E00] border border-[#FDE5C5]",
    error: "bg-[#FDECEC] text-[#D9383A] border border-[#FAC6C6]",
    gold: "bg-[#FBF6EA] text-[#9A741A] border border-[#F4E4BC]",
    outline: "bg-white text-[#5B6776] border border-[#E6E9EF]",
    neutral: "bg-[#F0F3F7] text-[#0D2B4D] border border-[#E6E9EF]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium rounded-full",
    md: "px-2.5 py-1 text-xs font-semibold rounded-full",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
