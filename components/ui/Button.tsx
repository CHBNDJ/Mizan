import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium",
          "bg-teal-500 text-white",
          "hover:shadow-xl hover:shadow-teal-500/25",
          "focus:outline-none",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-sm",
          "px-4 py-2",
          "cursor-pointer",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
