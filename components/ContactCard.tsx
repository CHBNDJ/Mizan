"use client";

import { useState, useRef, useEffect } from "react";
import { Phone, Smartphone, MessageCircle, ChevronDown } from "lucide-react";

interface ContactCardProps {
  allPhoneNumbers: string[];
}

export function ContactCard({ allPhoneNumbers }: ContactCardProps) {
  const [showWhatsAppMenu, setShowWhatsAppMenu] = useState(false);
  const whatsappRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        whatsappRef.current &&
        !whatsappRef.current.contains(event.target as Node)
      ) {
        setShowWhatsAppMenu(false);
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
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
      <h3 className="font-semibold text-slate-900">Contact</h3>

      {fixes.length > 0 && (
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <Phone className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-500 mb-1">Téléphone fixe</div>
            <div className="flex flex-wrap items-center gap-2">
              {fixes.map((phone, index) => (
                <>
                  <a
                    key={`fixe-${index}`}
                    href={`tel:${cleanPhoneForCall(phone)}`}
                    className="text-sm font-medium text-slate-900 hover:text-teal-600 transition-colors"
                  >
                    {phone}
                  </a>
                  {index < fixes.length - 1 && (
                    <span className="text-slate-400">/</span>
                  )}
                </>
              ))}
            </div>
          </div>
        </div>
      )}

      {mobiles.length > 0 && (
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <Smartphone className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-500 mb-1">Mobile</div>
            <div className="flex flex-wrap items-center gap-2">
              {mobiles.map((mobile, index) => (
                <>
                  <a
                    key={`mobile-${index}`}
                    href={`tel:${cleanPhoneForCall(mobile)}`}
                    className="text-sm font-medium text-slate-900 hover:text-teal-600 transition-colors"
                  >
                    {mobile}
                  </a>
                  {index < mobiles.length - 1 && (
                    <span className="text-slate-400">/</span>
                  )}
                </>
              ))}
            </div>
          </div>
        </div>
      )}

      {mobiles.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          {mobiles.length === 1 ? (
            <a
              href={`https://wa.me/${cleanPhoneForWhatsApp(mobiles[0])}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-lg transition-colors font-medium text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contacter sur WhatsApp</span>
            </a>
          ) : (
            <div className="relative" ref={whatsappRef}>
              <button
                onClick={() => setShowWhatsAppMenu(!showWhatsAppMenu)}
                className="cursor-pointer w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-lg transition-colors font-medium text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contacter sur WhatsApp</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showWhatsAppMenu && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
                  <div className="p-2">
                    {mobiles.map((mobile, index) => (
                      <a
                        key={`wa-${index}`}
                        href={`https://wa.me/${cleanPhoneForWhatsApp(mobile)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setShowWhatsAppMenu(false)}
                        className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-slate-900">{mobile}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
