"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-3">
            Témoignages
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            Des clients et professionnels qui font confiance à Mizan
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-sm transition-shadow"
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
                <Quote className="w-5 h-5 text-teal-200" />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed flex-1 line-clamp-4">
                {t.message}
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">
                    {t.user_name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {t.user_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {t.user_type === "lawyer"
                      ? "Professionnel vérifié"
                      : "Client Mizan"}
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
