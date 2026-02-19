"use client";

import { useState, useRef, useEffect } from "react";
import { Phone, Smartphone, MessageCircle } from "lucide-react";

interface ContactDropdownProps {
  lawyerName: string;
  allPhoneNumbers: string[];
  buttonClassName?: string;
}

export function ContactDropdown({
  lawyerName,
  allPhoneNumbers,
  buttonClassName,
}: ContactDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const detectPhoneType = (number: string): "fixe" | "mobile" => {
    const cleaned = number.replace(/[\s\-\(\)+]/g, "");

    const mobilePrefixes = [
      "21305",
      "21306",
      "21307",
      "2135",
      "2136",
      "2137",
      "05",
      "06",
      "07",
    ];

    for (const prefix of mobilePrefixes) {
      if (cleaned.startsWith(prefix)) return "mobile";
    }

    if (cleaned.length === 10 && cleaned.startsWith("0")) {
      const secondDigit = cleaned[1];
      if (["5", "6", "7"].includes(secondDigit)) return "mobile";
    }

    return "fixe";
  };

  const categorizeNumbers = () => {
    const fixes: string[] = [];
    const mobiles: string[] = [];

    allPhoneNumbers.forEach((num) => {
      if (!num || num.trim() === "") return;
      const trimmed = num.trim();
      const type = detectPhoneType(trimmed);
      if (type === "fixe") {
        fixes.push(trimmed);
      } else {
        mobiles.push(trimmed);
      }
    });

    return { fixes, mobiles };
  };

  const { fixes, mobiles } = categorizeNumbers();

  const hasNumbers = fixes.length > 0 || mobiles.length > 0;

  if (!hasNumbers) {
    return null;
  }

  const cleanPhoneForCall = (phone: string) => {
    return phone.replace(/[\s\-\(\)]/g, "");
  };

  const cleanPhoneForWhatsApp = (phone: string) => {
    let cleaned = phone.replace(/[\s\-\(\)]/g, "");
    if (!cleaned.startsWith("+")) {
      if (cleaned.startsWith("213")) {
        cleaned = "+" + cleaned;
      } else if (cleaned.startsWith("0")) {
        cleaned = "+213" + cleaned.substring(1);
      } else {
        cleaned = "+213" + cleaned;
      }
    }
    return cleaned;
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={
          buttonClassName ||
          "cursor-pointer bg-teal-50 border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6 sm:p-8 rounded-lg flex flex-col items-center gap-3 sm:gap-4 text-center group w-full"
        }
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center transition-colors duration-200">
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
        </div>
        <div>
          <div className="font-medium text-sm text-slate-700 group-hover:text-teal-700 transition-colors duration-200">
            Contact
          </div>
          <div className="text-xs text-slate-500 group-hover:text-teal-600 transition-colors duration-200">
            Immédiat
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
          <div className="p-2 space-y-1">
            {fixes.map((phone, index) => (
              <a
                key={`fixe-${index}`}
                href={`tel:${cleanPhoneForCall(phone)}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-slate-500">Fixe</div>
                  <div className="text-sm font-medium text-slate-900">
                    {phone}
                  </div>
                </div>
              </a>
            ))}

            {mobiles.map((mobile, index) => (
              <div key={`mobile-group-${index}`} className="space-y-1">
                <a
                  href={`tel:${cleanPhoneForCall(mobile)}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-500">Mobile</div>
                    <div className="text-sm font-medium text-slate-900">
                      {mobile}
                    </div>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${cleanPhoneForWhatsApp(mobile)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-500">WhatsApp</div>
                    <div className="text-sm font-medium text-slate-900">
                      {mobile}
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
