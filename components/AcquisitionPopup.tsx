"use client";
import { useState } from "react";
import { Sparkles, Users, Newspaper, MoreHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

interface AcquisitionPopupProps {
  userId: string;
  onClose: () => void;
}

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function FacebookLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.03 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"
      />
    </svg>
  );
}

function TikTokLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        fill="#25F4EE"
        d="M9.375 8.938v-.85a6.6 6.6 0 0 0-.9-.062A6.6 6.6 0 0 0 2 14.575a6.57 6.57 0 0 0 2.813 5.4A6.55 6.55 0 0 1 3.5 16a6.6 6.6 0 0 1 5.875-7.062z"
      />
      <path
        fill="#FE2C55"
        d="M9.5 18.25a3 3 0 0 0 3-2.9V2h2.625a4.9 4.9 0 0 1-.075-.85h-3.6v13.35a3 3 0 0 1-3 2.9 3 3 0 0 1-1.4-.35 3 3 0 0 0 2.45 1.2M18.9 6.375v-.8a4.9 4.9 0 0 1-2.7-.8 4.94 4.94 0 0 0 2.7 1.6"
      />
      <path
        fill="currentColor"
        d="M16.2 4.775A4.94 4.94 0 0 1 15.125 2H14.5v13.35a3 3 0 0 1-3 2.9 3 3 0 0 1-2.45-1.2 3 3 0 0 1-1.55-2.625 3 3 0 0 1 3.9-2.862V8.938A6.6 6.6 0 0 0 4.813 19.975 6.55 6.55 0 0 0 9.5 22a6.6 6.6 0 0 0 6.6-6.6V8.688a7.5 7.5 0 0 0 4.4 1.412V6.5a4.9 4.9 0 0 1-4.3-1.725"
      />
    </svg>
  );
}

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const OPTIONS = [
  { key: "facebook", labelKey: "facebook", Logo: FacebookLogo, brand: true },
  { key: "tiktok", labelKey: "tiktok", Logo: TikTokLogo, brand: true },
  { key: "twitter", labelKey: "twitter", Logo: XLogo, brand: false },
  { key: "google", labelKey: "google", Logo: GoogleLogo, brand: true },
  { key: "proche", labelKey: "proche", Logo: Users, brand: false },
  { key: "presse", labelKey: "presse", Logo: Newspaper, brand: false },
];

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none dark:bg-[#1c1c1e] rounded-2xl border border-teal-100 dark:border-[#1c2220] shadow-2xl dark:shadow-none p-6 relative">
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-white dark:bg-[#6fcf9f]/10 border border-teal-100 dark:border-[#6fcf9f]/20 flex items-center justify-center mx-auto mb-3 shadow-sm dark:shadow-none">
            <Sparkles className="w-6 h-6 text-teal-600 dark:text-[#6fcf9f]" />
          </div>
          <p className="text-lg font-semibold text-slate-800 dark:text-[#F5F5F4] mb-1">
            {t("title")}
          </p>
          <p className="text-sm text-slate-500 dark:text-[#A8A8A6]">
            {t("question")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {OPTIONS.map(({ key, labelKey, Logo, brand }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelect(key)}
              disabled={submitting}
              className="group rounded-xl py-3.5 px-2 flex flex-col items-center gap-2 border border-teal-100 dark:border-[#3a3a3d] bg-white/90 dark:bg-[#232325] hover:border-teal-400 dark:hover:border-[#6fcf9f] hover:bg-white dark:hover:bg-[#6fcf9f]/10 hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Logo
                className={
                  brand
                    ? "w-6 h-6"
                    : "w-6 h-6 text-slate-600 dark:text-[#E8E8E6]"
                }
              />
              <span className="text-xs font-medium text-slate-700 dark:text-[#E8E8E6]">
                {t(labelKey)}
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleSelect("autre")}
            disabled={submitting}
            className="col-span-2 rounded-xl py-3 px-2 flex flex-row items-center justify-center gap-2 border border-teal-100 dark:border-[#3a3a3d] bg-white/90 dark:bg-[#232325] hover:border-teal-400 dark:hover:border-[#6fcf9f] hover:bg-white dark:hover:bg-[#6fcf9f]/10 hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <MoreHorizontal className="w-5 h-5 text-slate-600 dark:text-[#E8E8E6]" />
            <span className="text-xs font-medium text-slate-700 dark:text-[#E8E8E6]">
              {t("autre")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
