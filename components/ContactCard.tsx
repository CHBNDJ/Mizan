"use client";

import { Phone, Smartphone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { detectPhoneType } from "@/lib/phoneFormatter";
import { COUNTRIES } from "@/utils/constants";

interface ContactCardProps {
  allPhoneNumbers: string[];
}

export function ContactCard({ allPhoneNumbers }: ContactCardProps) {
  const categorizeNumbers = () => {
    const fixes: string[] = [];
    const mobiles: string[] = [];

    for (const num of allPhoneNumbers) {
      if (!num || num.trim() === "") continue;
      const trimmed = num.trim();
      const type = detectPhoneType(trimmed);

      if (type === "fixe") {
        fixes.push(trimmed);
      } else if (type === "mobile") {
        mobiles.push(trimmed);
      }
    }

    return { fixes, mobiles };
  };

  const { fixes, mobiles } = categorizeNumbers();

  if (fixes.length === 0 && mobiles.length === 0) return null;

  const cleanPhoneForCall = (phone: string) => phone.replace(/[\s\-\(\)]/g, "");

  const cleanPhoneForWhatsApp = (phone: string) => {
    let cleaned = phone.replace(/[\s\-\(\)]/g, "");
    if (!cleaned.startsWith("+")) {
      if (cleaned.startsWith("213")) cleaned = "+" + cleaned;
      else if (cleaned.startsWith("0")) cleaned = "+213" + cleaned.substring(1);
      else cleaned = "+213" + cleaned;
    }
    return cleaned;
  };

  const formatPhoneForDisplay = (phone: string) => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, "");

    if (cleaned.startsWith("+33") || cleaned.startsWith("33")) {
      const withoutPrefix = cleaned.replace(/^\+?33/, "");
      const formatted =
        withoutPrefix.match(/.{1,2}/g)?.join(" ") || withoutPrefix;
      return `+33 ${formatted}`;
    }

    if (cleaned.startsWith("+213") || cleaned.startsWith("213")) {
      const withoutPrefix = cleaned.replace(/^\+?213/, "");
      const formatted =
        withoutPrefix.match(/.{1,2}/g)?.join(" ") || withoutPrefix;
      return `+213 ${formatted}`;
    }

    if (cleaned.startsWith("0")) {
      return cleaned.match(/.{1,2}/g)?.join(" ") || cleaned;
    }

    return phone;
  };

  const getCountryFlag = (phone: string) => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, "");

    for (const country of COUNTRIES) {
      if (
        cleaned.startsWith(`+${country.code}`) ||
        cleaned.startsWith(country.code)
      ) {
        return country.flag;
      }
    }

    return "📱";
  };

  const whatsappNumber =
    mobiles.find((m) => m.includes("+213") || m.includes("213")) || mobiles[0];

  return (
    <div className="space-y-3">
      {fixes.map((fixe, index) => (
        <a
          key={`fixe-${index}`}
          href={`tel:${cleanPhoneForCall(fixe)}`}
          className="group flex items-center gap-3 p-4 bg-white border border-slate-200 hover:border-teal-500 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="w-11 h-11 bg-teal-50 group-hover:bg-teal-600 rounded-xl flex items-center justify-center transition-colors shadow-sm flex-shrink-0">
            <Phone className="w-5 h-5 text-teal-600 group-hover:text-white transition-colors" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-medium text-slate-500 group-hover:text-teal-600 transition-colors uppercase tracking-wide">
              Fixe {getCountryFlag(fixe)}
            </div>
            <div className="text-base font-semibold text-slate-900 mt-0.5">
              {formatPhoneForDisplay(fixe)}
            </div>
          </div>
        </a>
      ))}

      {mobiles.map((mobile, index) => (
        <a
          key={`mobile-${index}`}
          href={`tel:${cleanPhoneForCall(mobile)}`}
          className="group flex items-center gap-3 p-4 bg-white border border-slate-200 hover:border-teal-500 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="w-11 h-11 bg-teal-50 group-hover:bg-teal-600 rounded-xl flex items-center justify-center transition-colors shadow-sm flex-shrink-0">
            <Smartphone className="w-5 h-5 text-teal-600 group-hover:text-white transition-colors" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-medium text-slate-500 group-hover:text-teal-600 transition-colors uppercase tracking-wide">
              Mobile {getCountryFlag(mobile)}
            </div>
            <div className="text-base font-semibold text-slate-900 mt-0.5">
              {formatPhoneForDisplay(mobile)}
            </div>
          </div>
        </a>
      ))}

      {whatsappNumber && (
        <a
          href={`https://wa.me/${cleanPhoneForWhatsApp(whatsappNumber)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white py-4 px-4 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <FaWhatsapp className="w-5 h-5" />
          <span>Contacter sur WhatsApp</span>
        </a>
      )}
    </div>
  );
}
