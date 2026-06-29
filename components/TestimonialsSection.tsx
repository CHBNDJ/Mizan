"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  user_name: string;
  user_type: string;
  message: string;
  created_at: string;
}

export default function TestimonialsSection() {
  const supabase = createClient();
  const t = useTranslations("testimonials");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("platform_feedbacks")
      .select("id, user_name, user_type, message, created_at")
      .eq("type", "testimonial")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setTestimonials(data || []);
        setLoading(false);
      });
  }, []);

  if (loading || testimonials.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-white dark:bg-transparent">
      <div className="max-w-6xl mx-auto">
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
              className="bg-slate-50 dark:bg-[#1c1c1e] border border-slate-100 dark:border-[#1c2220] rounded-2xl p-6 flex flex-col gap-4 hover:shadow-sm transition-shadow dark:shadow-none"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <Quote className="w-5 h-5 text-teal-200 dark:text-[#6fcf9f]" />
              </div>
              <p className="text-sm text-slate-600 dark:text-[#E8E8E6] leading-relaxed flex-1 line-clamp-4">
                {item.message}
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-200 dark:border-[#1c2220]">
                <div className="w-8 h-8 bg-teal-600 dark:bg-[#0F6E56] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {item.user_name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-[#F5F5F4]">
                    {item.user_name}
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
    </section>
  );
}
