"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function Badge({ children, color, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full",
        className
      )}
      style={
        color
          ? {
              backgroundColor: `${color}20`,
              color: color,
              borderColor: `${color}40`,
              borderWidth: 1,
            }
          : undefined
      }
    >
      {children}
    </span>
  );
}
