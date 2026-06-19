"use client";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";

const LANGUAGES = [
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
  { code: "en", label: "EN" },
] as const;

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
      <Globe className="w-3.5 h-3.5 text-slate-400 mx-1" />
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => router.replace(pathname, { locale: l.code })}
          className={`px-2 py-1 text-xs font-medium rounded-md cursor-pointer transition-all ${
            locale === l.code
              ? "bg-teal-600 text-white"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
