"use client";
import { useState, useRef, useEffect } from "react";
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
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fermer le dropdown si on clique ailleurs
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

  // Filtrer les options selon la recherche
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Option sélectionnée actuelle
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
      // Focus sur l'input quand on ouvre
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div ref={selectRef} className="relative">
        {/* Trigger du select */}
        <div
          onClick={toggleOpen}
          className={cn(
            "w-full px-3 py-2 border-2 border-slate-300 rounded-lg bg-white cursor-pointer flex items-center justify-between",
            "hover:border-teal-400 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20",
            "transition-all duration-200",
            disabled && "opacity-50 cursor-not-allowed bg-slate-50",
            isOpen && "border-teal-500 ring-2 ring-teal-500/20 shadow-md",
            className
          )}
        >
          {/* Input de recherche ou valeur sélectionnée */}
          {isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Rechercher..."
              className="w-full outline-none bg-transparent text-slate-700 placeholder-slate-400"
              disabled={disabled}
            />
          ) : (
            <span
              className={cn(
                "truncate font-medium",
                !selectedOption && "text-slate-400",
                selectedOption && "text-slate-700"
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

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-teal-200 rounded-lg shadow-xl max-h-64 overflow-hidden">
            {/* Zone de scroll */}
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-300 scrollbar-track-slate-100">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-slate-500 bg-slate-50">
                  Aucun résultat trouvé pour "{searchTerm}"
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.id || option.value}
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
          </div>
        )}
      </div>
    </div>
  );
}
