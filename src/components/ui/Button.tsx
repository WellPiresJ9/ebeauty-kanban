"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
          variant === "primary" &&
            "bg-accent hover:bg-accent-light text-white",
          variant === "secondary" &&
            "bg-background hover:bg-surface-hover text-text-primary border border-border",
          variant === "ghost" &&
            "bg-transparent hover:bg-surface-hover text-text-secondary hover:text-text-primary",
          variant === "danger" &&
            "bg-danger/20 hover:bg-danger/30 text-danger border border-danger/30",
          variant === "success" &&
            "bg-success/20 hover:bg-success/30 text-success border border-success/30",
          size === "sm" && "text-xs px-3 py-1.5",
          size === "md" && "text-sm px-4 py-2",
          size === "lg" && "text-base px-6 py-2.5",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
