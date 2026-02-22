"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-xs font-medium text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-primary",
            "placeholder:text-text-secondary/50",
            "focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20",
            "transition-all",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
