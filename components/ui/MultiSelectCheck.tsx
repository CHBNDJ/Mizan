"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { useTranslations } from "next-intl";
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
  showSelectAll = false,
  heightClass = "h-12 max-h-12",
}: MultiSelectWithCheckboxesProps & {
  showSelectAll?: boolean;
  heightClass?: string;
}) {
  const t = useTranslations("multiSelect");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const allValues = options.map((o) => o.value);
  const allSelected = allValues.every((v) => value.includes(v));

  const handleToggleAll = () => {
    if (disabled) return;
    if (allSelected) {
      onChange([]);
    } else {
      onChange(allValues);
    }
  };

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
        <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6]">
          {label}
        </label>
      )}

      <div className={`relative ${className}`} ref={containerRef}>
        <div
          className={cn(
            "w-full px-3 py-2 border border-slate-300 dark:border-[#3a3a3d] rounded-lg bg-white dark:bg-[#1c1c1e] flex items-center justify-between",
            `transition-all duration-200 ${heightClass} outline-none`,
            disabled
              ? "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-[#141415] border-slate-200 dark:border-[#1c2220]"
              : cn(
                  "cursor-pointer",
                  "hover:border-2 hover:border-teal-300 dark:hover:border-[#6fcf9f]",
                  "focus-within:border-2 focus-within:border-teal-300 dark:focus-within:border-[#6fcf9f] focus-within:ring-2 focus-within:ring-teal-500/20 dark:focus-within:ring-[#6fcf9f]/20"
                ),
            !disabled &&
              isOpen &&
              "border-2 border-teal-300 dark:border-[#6fcf9f] ring-2 ring-teal-500/20 dark:ring-[#6fcf9f]/20 shadow-md dark:shadow-none"
          )}
          onClick={handleMainClick}
        >
          <div className="flex-1 flex items-center gap-1 overflow-hidden">
            {value.length === 0 ? (
              <span className={placeholderClassName}>{placeholder}</span>
            ) : allSelected && showSelectAll ? (
              <span className="inline-flex items-center gap-1 bg-teal-100 dark:bg-[#6fcf9f]/15 text-teal-800 dark:text-[#6fcf9f] px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap">
                {t("selectAll")}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange([]);
                  }}
                  disabled={disabled}
                  className="rounded-full p-0.5 hover:bg-teal-200 dark:hover:bg-[#6fcf9f]/25 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ) : (
              <div className="flex items-center gap-1 overflow-hidden">
                {value.slice(0, 1).map((selectedValue) => {
                  const option = options.find(
                    (opt) => opt.value === selectedValue
                  );
                  return (
                    <span
                      key={selectedValue}
                      className="inline-flex items-center gap-1 bg-teal-100 dark:bg-[#6fcf9f]/15 text-teal-800 dark:text-[#6fcf9f] px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap"
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
                            : "hover:bg-teal-200 dark:hover:bg-[#6fcf9f]/25"
                        )}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
                {value.length > 1 && (
                  <span className="text-xs text-slate-500 dark:text-[#A8A8A6] font-medium whitespace-nowrap">
                    {t("othersCount", { n: value.length - 1 })}
                  </span>
                )}
              </div>
            )}
          </div>
          <ChevronDown
            className={cn(
              "w-5 h-5 transition-all duration-200 ms-2 flex-shrink-0",
              disabled
                ? "text-slate-300 dark:text-[#5a5a5d]"
                : cn(
                    "text-slate-400 dark:text-[#7A7A78]",
                    isOpen && "rotate-180 text-teal-500 dark:text-[#6fcf9f]",
                    !isOpen && "hover:text-slate-600 dark:hover:text-[#E8E8E6]"
                  )
            )}
          />
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-[10000] w-full mt-2 bg-white dark:bg-[#1c1c1e] border-2 border-teal-200 dark:border-[#6fcf9f]/30 rounded-lg shadow-2xl dark:shadow-none max-h-64 overflow-hidden">
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-300 scrollbar-track-slate-100">
              {showSelectAll && (
                <div
                  className={cn(
                    "px-4 py-3 text-sm cursor-pointer flex items-center justify-between",
                    "hover:bg-teal-50 dark:hover:bg-[#6fcf9f]/10 active:bg-teal-100 dark:active:bg-[#6fcf9f]/15 transition-colors duration-150",
                    "border-b border-slate-100 dark:border-[#1c2220]"
                  )}
                  onClick={handleToggleAll}
                >
                  <span className="text-slate-800 dark:text-[#F5F5F4] font-semibold pe-4">
                    {t("selectAll")}
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleToggleAll}
                      className="w-5 h-5 appearance-none border-2 border-slate-300 dark:border-[#3a3a3d] rounded bg-white dark:bg-[#1c1c1e] checked:bg-teal-600 checked:border-teal-600 dark:checked:bg-[#0F6E56] dark:checked:border-[#0F6E56] transition-all duration-200 cursor-pointer"
                    />
                    {allSelected && (
                      <svg
                        className="absolute top-0.5 start-0.5 w-4 h-4 text-white pointer-events-none"
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
              )}

              {options.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "px-4 py-3 text-sm cursor-pointer flex items-center justify-between",
                    "hover:bg-teal-50 dark:hover:bg-[#6fcf9f]/10 active:bg-teal-100 dark:active:bg-[#6fcf9f]/15 transition-colors duration-150",
                    "border-b border-slate-100 dark:border-[#1c2220] last:border-b-0"
                  )}
                  onClick={() => handleToggle(option.value)}
                >
                  <span className="text-slate-700 dark:text-[#E8E8E6] pe-4">
                    {option.label}
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={value.includes(option.value)}
                      onChange={() => handleToggle(option.value)}
                      className="w-5 h-5 appearance-none border-2 border-slate-300 dark:border-[#3a3a3d] rounded bg-white dark:bg-[#1c1c1e] checked:bg-teal-600 checked:border-teal-600 dark:checked:bg-[#0F6E56] dark:checked:border-[#0F6E56] transition-all duration-200 cursor-pointer"
                    />
                    {value.includes(option.value) && (
                      <svg
                        className="absolute top-0.5 start-0.5 w-4 h-4 text-white pointer-events-none"
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
