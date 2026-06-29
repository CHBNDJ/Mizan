"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Option, CustomSelectProps } from "@/types";

export function CustomSelect({
  options,
  placeholder,
  value,
  onChange,
  className,
  label,
  disabled = false,
  size = "default",
}: CustomSelectProps) {
  const t = useTranslations("customSelect");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    } else {
      setSearchTerm("");
    }
  };

  const resolvedPlaceholder = placeholder ?? t("defaultPlaceholder");

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-1">
          {label}
        </label>
      )}

      <div ref={selectRef} className="relative z-50">
        <div
          onClick={toggleOpen}
          className={cn(
            "w-full px-3 py-2 border border-slate-300 dark:border-[#1c2220] rounded-lg bg-white dark:bg-[#1c1c1e] cursor-pointer flex items-center justify-between",
            "hover:border-2 hover:border-teal-300 dark:hover:border-[#6fcf9f]",
            disabled &&
              "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-[#141415]",
            isOpen &&
              "border-2 border-teal-300 dark:border-[#6fcf9f] shadow-md dark:shadow-none",
            className
          )}
        >
          {isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder={t("searchPlaceholder")}
              className={cn(
                "w-full outline-none bg-transparent placeholder-slate-400 dark:placeholder-[#7A7A78]",
                size === "large"
                  ? "text-base text-slate-700 dark:text-[#E8E8E6]"
                  : "text-sm text-slate-700 dark:text-[#E8E8E6]"
              )}
              disabled={disabled}
            />
          ) : (
            <span
              className={cn(
                "truncate",
                size === "large" ? "text-base" : "text-sm",
                !selectedOption &&
                  "text-slate-400 dark:text-[#7A7A78] font-normal",
                selectedOption &&
                  "text-slate-700 dark:text-[#E8E8E6] font-normal"
              )}
            >
              {selectedOption ? selectedOption.label : resolvedPlaceholder}
            </span>
          )}

          <ChevronDown
            className={cn(
              "w-5 h-5 text-slate-400 dark:text-[#7A7A78] ms-2 flex-shrink-0",
              isOpen && "rotate-180 text-teal-500 dark:text-[#6fcf9f]"
            )}
          />
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-[9999] w-full mt-2 bg-white dark:bg-[#1c1c1e] border-2 border-teal-200 dark:border-[#1F3D2E] rounded-lg shadow-2xl dark:shadow-none max-h-64 overflow-hidden">
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-300 scrollbar-track-slate-100">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-slate-500 dark:text-[#A8A8A6] bg-slate-50 dark:bg-[#141415]">
                  {t("noResults", { term: searchTerm })}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={`${option.value}-${index}`}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "px-4 py-3 text-sm cursor-pointer flex items-center justify-between",
                      "hover:bg-teal-50 dark:hover:bg-[#1F3D2E] active:bg-teal-100 dark:active:bg-[#26492f]",
                      "border-b border-slate-100 dark:border-[#1c2220] last:border-b-0",
                      value === option.value &&
                        "bg-teal-100 dark:bg-[#1F3D2E] text-teal-800 dark:text-[#6fcf9f] font-medium"
                    )}
                  >
                    <span className="truncate text-slate-700 dark:text-[#E8E8E6]">
                      {option.label}
                    </span>
                    {value === option.value && (
                      <Check className="w-4 h-4 text-teal-600 dark:text-[#6fcf9f] ms-2 flex-shrink-0" />
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
