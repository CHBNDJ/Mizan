"use client";

import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { EmailConfirmationModalProps } from "@/types";

export default function EmailConfirmationModal({
  isOpen,
  onClose,
  email,
}: EmailConfirmationModalProps) {
  const t = useTranslations("emailConfirmationModal");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fadeIn">
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl max-w-md w-full p-6 shadow-2xl dark:shadow-none transform animate-slideUp">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-[#1F3D2A] rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-[#7FD99F]" />
          </div>

          <h3 className="text-xl font-semibold text-slate-800 dark:text-[#F5F5F4] mb-2">
            {t("title")}
          </h3>

          <p className="text-slate-600 dark:text-[#E8E8E6] text-sm mb-4">
            {t("sentTo")}
          </p>

          <div className="bg-blue-50 dark:bg-[#1F2E3D] border border-blue-200 dark:border-[#2A4A5A] rounded-lg px-4 py-2 mb-4">
            <p className="text-blue-800 dark:text-[#7FB3E0] font-medium text-sm">
              {email}
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-[#3D2E1F] border border-amber-200 dark:border-[#5A4A2A] rounded-lg p-4 mb-6 text-left w-full">
            <p className="text-amber-800 dark:text-[#E0B568] text-sm mb-2 font-medium">
              {t("nextSteps")}
            </p>
            <ol className="text-amber-700 dark:text-[#E0B568]/90 text-xs space-y-1 list-decimal list-inside">
              <li>{t("step1")}</li>
              <li>{t("step2")}</li>
              <li>{t("step3")}</li>
            </ol>
            <p className="text-amber-600 dark:text-[#E0B568]/80 text-xs mt-2 italic">
              {t("checkSpam")}
            </p>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer w-full bg-teal-600 dark:bg-[#0F6E56] text-white py-3 rounded-lg hover:bg-teal-700 dark:hover:bg-[#085041] transition-colors font-medium"
          >
            {t("gotIt")}
          </button>
        </div>
      </div>
    </div>
  );
}
