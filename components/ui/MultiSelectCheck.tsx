"use client";
import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MultiSelectWithCheckboxesProps } from "@/types";

export function MultiSelectWithCheckboxes({
  placeholder,
  options,
  value,
  onChange,
  className = "",
  label,
  placeholderClassName = "text-slate-400 font-medium",
  disabled = false,
}: MultiSelectWithCheckboxesProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (optionValue: string) => {
    if (disabled) return;

    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeItem = (optionValue: string) => {
    if (disabled) return;
    onChange(value.filter((v) => v !== optionValue));
  };

  const handleMainClick = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className={`relative ${className}`}>
        {/* ✅ Input principal avec MÊME style que CustomSelect */}
        <div
          className={cn(
            "w-full px-3 py-2 border border-slate-300 rounded-lg bg-white flex items-center justify-between",
            "transition-all duration-200 h-12 max-h-12",
            "outline-none",
            // ✅ Styles conditionnels selon disabled
            disabled
              ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-200"
              : cn(
                  "cursor-pointer",
                  "hover:border-2 hover:border-teal-300", // ✅ MÊME hover
                  "focus-within:border-2 focus-within:border-teal-300 focus-within:ring-2 focus-within:ring-teal-500/20" // ✅ MÊME focus
                ),
            !disabled &&
              isOpen &&
              "border-2 border-teal-300 ring-2 ring-teal-500/20 shadow-md" // ✅ MÊME état ouvert
          )}
          onClick={handleMainClick}
        >
          <div className="flex-1 flex items-center gap-1 overflow-hidden">
            {value.length === 0 ? (
              <span className={placeholderClassName}>{placeholder}</span>
            ) : (
              <div className="flex items-center gap-1 overflow-hidden">
                {value.slice(0, 1).map((selectedValue) => {
                  const option = options.find(
                    (opt) => opt.value === selectedValue
                  );
                  return (
                    <span
                      key={selectedValue}
                      className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap"
                    >
                      {option?.label}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(selectedValue);
                        }}
                        disabled={disabled}
                        className={cn(
                          "rounded-full p-0.5 transition-colors duration-150",
                          disabled
                            ? "cursor-not-allowed opacity-50"
                            : "hover:bg-teal-200"
                        )}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
                {value.length > 1 && (
                  <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                    +{value.length - 1} autres
                  </span>
                )}
              </div>
            )}
          </div>
          <ChevronDown
            className={cn(
              "w-5 h-5 transition-all duration-200 ml-2 flex-shrink-0",
              disabled
                ? "text-slate-300"
                : cn(
                    "text-slate-400",
                    isOpen && "rotate-180 text-teal-500",
                    !isOpen && "hover:text-slate-600"
                  )
            )}
          />
        </div>

        {/* ✅ Dropdown avec z-index plus élevé */}
        {isOpen && !disabled && (
          <div className="absolute z-[10000] w-full mt-2 bg-white border-2 border-teal-200 rounded-lg shadow-2xl max-h-64 overflow-hidden">
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-300 scrollbar-track-slate-100">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "px-4 py-3 text-sm cursor-pointer flex items-center justify-between",
                    "hover:bg-teal-50 active:bg-teal-100 transition-colors duration-150",
                    "border-b border-slate-100 last:border-b-0"
                  )}
                  onClick={() => handleToggle(option.value)}
                >
                  <span className="text-slate-700 pr-4">{option.label}</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={value.includes(option.value)}
                      onChange={() => handleToggle(option.value)}
                      className="w-5 h-5 appearance-none border-2 border-slate-300 rounded bg-white checked:bg-teal-600 checked:border-teal-600 transition-all duration-200 cursor-pointer"
                    />
                    {value.includes(option.value) && (
                      <svg
                        className="absolute top-0.5 left-0.5 w-4 h-4 text-white pointer-events-none"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
