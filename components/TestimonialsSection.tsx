"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations, useLocale } from "next-intl";

interface Testimonial {
  id: string;
  user_name: string;
  user_type: string;
  message: string;
  translations: Record<string, string> | null;
  created_at: string;
}

const getInitials = (name?: string) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
};

const shortName = (name?: string) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
};

export default function TestimonialsSection() {
  const supabase = createClient();
  const t = useTranslations("testimonials");
  const locale = useLocale();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("platform_feedbacks")
      .select("id, user_name, user_type, message, translations, created_at")
      .eq("type", "testimonial")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(9)
      .then(({ data }) => {
        setTestimonials(data || []);
        setLoading(false);
      });
  }, []);

  if (loading || testimonials.length === 0) return null;

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none dark:bg-[#1c1c1e] border border-teal-200/70 dark:border-[#1c2220] shadow-[0_20px_50px_rgba(13,110,86,0.15)] dark:shadow-none">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-teal-600 dark:text-[#6fcf9f] uppercase tracking-widest mb-3">
              {t("tag")}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-3">
              {t("title")}
            </h2>
            <p className="text-slate-500 dark:text-[#A8A8A6] text-sm max-w-lg mx-auto">
              {t("subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white/85 dark:bg-[#232325] border border-teal-100 dark:border-[#3a3a3d] rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md hover:border-teal-300 dark:hover:border-[#6fcf9f] transition-all"
              >
                <div className="flex justify-end">
                  <span className="text-4xl leading-none text-teal-400 dark:text-[#6fcf9f] font-serif -mb-2">
                    &rdquo;
                  </span>
                </div>
                <p
                  className="text-sm text-slate-600 dark:text-[#E8E8E6] leading-relaxed flex-1 italic"
                  dir={locale === "ar" ? "rtl" : "ltr"}
                >
                  {item.translations?.[locale] || item.message}
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-teal-100 dark:border-[#3a3a3d]">
                  <div className="w-9 h-9 bg-teal-600 dark:bg-[#0F6E56] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">
                      {getInitials(item.user_name)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-[#F5F5F4]">
                      {shortName(item.user_name)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-[#A8A8A6]">
                      {item.user_type === "lawyer"
                        ? t("verifiedPro")
                        : t("client")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
