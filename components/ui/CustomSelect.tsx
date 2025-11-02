"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Option, CustomSelectProps } from "@/types";

export function CustomSelect({
  options,
  placeholder = "Sélectionner...",
  value,
  onChange,
  className,
  label,
  disabled = false,
  size = "default",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateDropdownPosition = () => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      window.addEventListener("scroll", updateDropdownPosition, true);
      window.addEventListener("resize", updateDropdownPosition);
    }

    return () => {
      window.removeEventListener("scroll", updateDropdownPosition, true);
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [isOpen]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (selectedValue: string) => {
    onChange?.(selectedValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    if (!isOpen) setIsOpen(true);
  };

  const toggleOpen = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}

      <div ref={selectRef} className="relative">
        <div
          onClick={toggleOpen}
          className={cn(
            "w-full px-3 py-2 border border-slate-300 rounded-lg bg-white cursor-pointer flex items-center justify-between",
            "hover:border-2 hover:border-teal-300",
            "focus-within:border-2 focus-within:border-teal-300 focus-within:ring-2 focus-within:ring-teal-500/20",
            "transition-all duration-200",
            "outline-none",
            disabled && "opacity-50 cursor-not-allowed bg-slate-50",
            isOpen &&
              "border-2 border-teal-300 ring-2 ring-teal-500/20 shadow-md",
            className
          )}
        >
          {isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Rechercher..."
              className={cn(
                "w-full outline-none bg-transparent placeholder-slate-400",
                size === "large"
                  ? "text-base text-slate-700"
                  : "text-sm text-slate-700"
              )}
              disabled={disabled}
            />
          ) : (
            <span
              className={cn(
                "truncate",
                size === "large" ? "text-base" : "text-sm",
                !selectedOption && "text-slate-400 font-normal",
                selectedOption && "text-slate-700 font-normal"
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          )}

          <ChevronDown
            className={cn(
              "w-5 h-5 text-slate-400 transition-all duration-200 ml-2 flex-shrink-0",
              isOpen && "rotate-180 text-teal-500",
              !isOpen && "hover:text-slate-600"
            )}
          />
        </div>

        {isOpen &&
          !disabled &&
          typeof window !== "undefined" &&
          createPortal(
            <div
              className="bg-white border-2 border-teal-200 rounded-lg shadow-2xl max-h-64 overflow-hidden"
              style={{
                position: "fixed",
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                zIndex: 999999,
              }}
            >
              <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-300 scrollbar-track-slate-100">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-slate-500 bg-slate-50">
                    Aucun résultat trouvé pour "{searchTerm}"
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <div
                      key={`${option.value}-${index}`}
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "px-4 py-3 text-sm cursor-pointer flex items-center justify-between",
                        "hover:bg-teal-50 active:bg-teal-100 transition-colors duration-150",
                        "border-b border-slate-100 last:border-b-0",
                        value === option.value &&
                          "bg-teal-100 text-teal-800 font-medium"
                      )}
                    >
                      <span className="truncate text-slate-700">
                        {option.label}
                      </span>
                      {value === option.value && (
                        <Check className="w-4 h-4 text-teal-600 ml-2 flex-shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>,
            document.body
          )}
      </div>
    </div>
  );
}
