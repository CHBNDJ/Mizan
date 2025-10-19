"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { cn } from "@/lib/utils";

// Context pour gérer l'état du dropdown
const DropdownContext = createContext<
  | {
      isOpen: boolean;
      setIsOpen: (open: boolean) => void;
    }
  | undefined
>(undefined);

const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("useDropdown must be used within a DropdownMenu");
  }
  return context;
};

// Composant racine
export const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
};

// Trigger (bouton qui ouvre le dropdown)
export const DropdownMenuTrigger = ({
  children,
  asChild = false,
  className,
}: {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}) => {
  const { isOpen, setIsOpen } = useDropdown();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref: triggerRef,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      "aria-expanded": isOpen,
      "aria-haspopup": "menu",
      className: cn(className, (children.props as any).className),
    } as any);
  }

  return (
    <button
      ref={triggerRef}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      className={cn("focus:outline-none", className)}
    >
      {children}
    </button>
  );
};

// Content (le menu déroulant) - Version améliorée
export const DropdownMenuContent = ({
  children,
  align = "center",
  className,
  sameWidth = false,
}: {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
  sameWidth?: boolean;
}) => {
  const { isOpen, setIsOpen } = useDropdown();
  const contentRef = useRef<HTMLDivElement>(null);
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (sameWidth && isOpen) {
      const trigger = document.querySelector(
        '[aria-expanded="true"]'
      ) as HTMLElement;
      if (trigger) {
        setTriggerWidth(trigger.offsetWidth);
      }
    }
  }, [isOpen, sameWidth]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        const trigger = document.querySelector('[aria-expanded="true"]');
        if (trigger && !trigger.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute top-full mt-2 z-50 overflow-hidden rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-sm py-2 text-slate-950 shadow-xl",
        "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200",
        alignmentClasses[align],
        className
      )}
      style={
        sameWidth && triggerWidth
          ? { width: triggerWidth }
          : { minWidth: "160px" }
      }
      role="menu"
      aria-orientation="vertical"
    >
      {children}
    </div>
  );
};

// Item (élément du menu) - Version simplifiée
export const DropdownMenuItem = ({
  children,
  asChild = false,
  className,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const { setIsOpen } = useDropdown();

  const handleClick = () => {
    if (!disabled) {
      onClick?.();
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      className: cn(
        "relative flex cursor-pointer select-none items-center px-3 py-2 text-sm font-medium outline-none transition-none",
        "text-slate-700",
        disabled && "pointer-events-none opacity-50",
        className,
        (children.props as any).className
      ),
      role: "menuitem",
      tabIndex: disabled ? -1 : 0,
    } as any);
  }

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative flex cursor-pointer select-none items-center px-3 py-2 text-sm font-medium outline-none transition-none",
        "text-slate-700",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </div>
  );
};
