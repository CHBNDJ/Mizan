"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-white dark:bg-[#1c1c1e] border-t border-slate-100 dark:border-[#1c2220]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
          <div className="flex items-center">
            <img
              src="/favicon-light.svg"
              className="block dark:hidden w-6 h-6"
              alt="M"
            />
            <img
              src="/favicon-dark.svg"
              className="hidden dark:block w-6 h-6"
              alt="M"
            />
            <span className="font-semibold text-slate-800 dark:text-[#F5F5F4] -ms-0.5">
              IZAN
            </span>
          </div>
          <span className="text-slate-300">|</span>
          <Link
            href="/cgu"
            className="text-slate-600 dark:text-[#E8E8E6] hover:text-teal-600 transition-colors"
          >
            {t("cgu")}
          </Link>
          <Link
            href="/privacy"
            className="text-slate-600 dark:text-[#E8E8E6] hover:text-teal-600 transition-colors"
          >
            {t("privacy")}
          </Link>
          <Link
            href="/legal"
            className="text-slate-600 dark:text-[#E8E8E6] hover:text-teal-600 transition-colors"
          >
            {t("legal")}
          </Link>
          <Link
            href="/faq"
            className="text-slate-600 dark:text-[#E8E8E6] hover:text-teal-600 transition-colors"
          >
            {t("faq")}
          </Link>
          <Link
            href="/contact"
            className="text-slate-600 dark:text-[#E8E8E6] hover:text-teal-600 transition-colors"
          >
            {t("contact")}
          </Link>
          <Link
            href="/feedback"
            className="text-slate-600 dark:text-[#E8E8E6] hover:text-teal-600 transition-colors"
          >
            {t("feedback")}
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-slate-400 dark:text-[#7A7A78]">
            © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
