"use client";

import { Phone, Smartphone, MessageCircle } from "lucide-react";

interface ContactCardProps {
  allPhoneNumbers: string[];
}

export function ContactCard({ allPhoneNumbers }: ContactCardProps) {
  const detectPhoneType = (number: string): "fixe" | "mobile" => {
    const cleaned = number.replace(/[\s\-\(\)]/g, "");

    // FRANCE (+33)
    if (cleaned.startsWith("+33") || cleaned.startsWith("33")) {
      const withoutPrefix = cleaned.replace(/^\+?33/, "");
      const firstDigit = withoutPrefix[0];
      // Mobile français : 06, 07
      if (["6", "7"].includes(firstDigit)) return "mobile";
      // Fixe français : 01, 02, 03, 04, 05, 09
      return "fixe";
    }

    // ALGÉRIE (+213)
    if (cleaned.startsWith("+213") || cleaned.startsWith("213")) {
      const withoutPrefix = cleaned.replace(/^\+?213/, "");
      const firstDigit = withoutPrefix[0];
      // Mobile algérien : 05, 06, 07 (commence par 5, 6, 7)
      if (["5", "6", "7"].includes(firstDigit)) return "mobile";
      // Fixe algérien
      return "fixe";
    }

    // Sans indicatif pays (numéros locaux)
    if (cleaned.startsWith("0")) {
      const secondDigit = cleaned[1];
      // Mobile : 05, 06, 07 (Algérie) ou 06, 07 (France si 10 chiffres)
      if (["5", "6", "7"].includes(secondDigit)) return "mobile";
      // Fixe : 021, 023, 025, etc.
      return "fixe";
    }

    // Par défaut : mobile
    return "mobile";
  };

  const categorizeNumbers = () => {
    let fixe: string | null = null;
    let mobile: string | null = null;

    for (const num of allPhoneNumbers) {
      if (!num || num.trim() === "") continue;
      const trimmed = num.trim();
      const type = detectPhoneType(trimmed);

      if (type === "fixe" && !fixe) {
        fixe = trimmed;
      } else if (type === "mobile" && !mobile) {
        mobile = trimmed;
      }

      if (fixe && mobile) break;
    }

    return { fixe, mobile };
  };

  const { fixe, mobile } = categorizeNumbers();

  const hasNumbers = fixe || mobile;

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

      {fixe && (
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <Phone className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-500 mb-1">Téléphone fixe</div>
            <a
              href={`tel:${cleanPhoneForCall(fixe)}`}
              className="text-sm font-medium text-slate-900 hover:text-teal-600 transition-colors"
            >
              {fixe}
            </a>
          </div>
        </div>
      )}

      {mobile && (
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <Smartphone className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-slate-500 mb-1">Mobile</div>
            <a
              href={`tel:${cleanPhoneForCall(mobile)}`}
              className="text-sm font-medium text-slate-900 hover:text-teal-600 transition-colors"
            >
              {mobile}
            </a>
          </div>
        </div>
      )}

      {mobile && (
        <div className="pt-2 border-t border-slate-100">
          <a
            href={`https://wa.me/${cleanPhoneForWhatsApp(mobile)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-lg transition-colors font-medium text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Contacter sur WhatsApp</span>
          </a>
        </div>
      )}
    </div>
  );
}
