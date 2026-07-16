"use client";
import { useState } from "react";
import {
  Sparkles,
  Facebook,
  Music2,
  Search,
  Users,
  Newspaper,
  MoreHorizontal,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

interface AcquisitionPopupProps {
  userId: string;
  onClose: () => void;
}

const OPTIONS = [
  { key: "facebook", labelKey: "facebook", Icon: Facebook },
  { key: "tiktok", labelKey: "tiktok", Icon: Music2 },
  { key: "twitter", labelKey: "twitter", Icon: XLogo },
  { key: "google", labelKey: "google", Icon: Search },
  { key: "proche", labelKey: "proche", Icon: Users },
  { key: "presse", labelKey: "presse", Icon: Newspaper },
];

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function AcquisitionPopup({
  userId,
  onClose,
}: AcquisitionPopupProps) {
  const supabase = createClient();
  const t = useTranslations("acquisitionPopup");
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = async (source: string) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await supabase
        .from("users")
        .update({ acquisition_source: source })
        .eq("id", userId);
    } catch (error) {
      console.error("Erreur acquisition_source:", error);
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 dark:bg-black/60">
      <div className="w-full max-w-sm bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-100 dark:border-[#1c2220] shadow-xl dark:shadow-none p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 end-4 text-slate-400 dark:text-[#7A7A78] hover:text-slate-600 dark:hover:text-[#E8E8E6] cursor-pointer"
          aria-label={t("close")}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-5">
          <div className="w-11 h-11 rounded-full bg-teal-50 dark:bg-[#6fcf9f]/10 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-5 h-5 text-teal-600 dark:text-[#6fcf9f]" />
          </div>
          <p className="text-base font-medium text-slate-800 dark:text-[#F5F5F4] mb-1">
            {t("title")}
          </p>
          <p className="text-sm text-slate-500 dark:text-[#A8A8A6]">
            {t("question")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {OPTIONS.map(({ key, labelKey, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelect(key)}
              disabled={submitting}
              className="rounded-lg py-3 px-2 flex flex-col items-center gap-1.5 border border-slate-200 dark:border-[#3a3a3d] bg-white dark:bg-[#1c1c1e] hover:border-teal-300 dark:hover:border-[#6fcf9f] hover:bg-teal-50/50 dark:hover:bg-[#6fcf9f]/5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Icon className="w-5 h-5 text-slate-500 dark:text-[#A8A8A6]" />
              <span className="text-xs text-slate-700 dark:text-[#E8E8E6]">
                {t(labelKey)}
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleSelect("autre")}
            disabled={submitting}
            className="col-span-2 rounded-lg py-3 px-2 flex flex-row items-center justify-center gap-2 border border-slate-200 dark:border-[#3a3a3d] bg-white dark:bg-[#1c1c1e] hover:border-teal-300 dark:hover:border-[#6fcf9f] hover:bg-teal-50/50 dark:hover:bg-[#6fcf9f]/5 transition-all cursor-pointer disabled:opacity-50"
          >
            <MoreHorizontal className="w-5 h-5 text-slate-500 dark:text-[#A8A8A6]" />
            <span className="text-xs text-slate-700 dark:text-[#E8E8E6]">
              {t("autre")}
            </span>
          </button>
        </div>

        <p
          onClick={onClose}
          className="text-center text-xs text-slate-400 dark:text-[#7A7A78] mt-4 cursor-pointer hover:text-slate-600 dark:hover:text-[#E8E8E6]"
        >
          {t("skip")}
        </p>
      </div>
    </div>
  );
}
