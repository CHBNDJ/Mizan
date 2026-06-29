"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { gsap } from "gsap";

export default function ClientForgotPasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const t = useTranslations("forgotPasswordPage");
  const containerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!containerRef.current) return;
    const timeline = gsap.timeline();
    timeline
      .fromTo(
        ".icon-container",
        { opacity: 0, y: -30, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.7)" }
      )
      .fromTo(
        ".page-title",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".page-subtitle",
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".form-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.3"
      );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password?type=client`,
      });

      if (error) throw error;

      setStatus("success");
      setMessage(t("successMsg"));

      setTimeout(() => {
        router.push("/auth/client/login");
      }, 3000);
    } catch (error: any) {
      setStatus("error");
      setMessage(t("errorMsg"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none">
      <style>{`
        .icon-container, .page-title, .page-subtitle, .form-card { opacity: 0; }
      `}</style>

      <div className="max-w-md mx-auto px-4 py-24" ref={containerRef}>
        <div className="text-center mb-8">
          <div className="icon-container w-16 h-16 bg-teal-100 dark:bg-[#6fcf9f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-teal-600 dark:text-[#6fcf9f]" />
          </div>
          <h1 className="page-title text-2xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-2">
            {t("title")}
          </h1>
          <p className="page-subtitle text-slate-600 dark:text-[#E8E8E6] text-sm">
            {t("subtitle")}
          </p>
        </div>

        <div className="form-card bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-lg dark:shadow-none p-6 border border-slate-100 dark:border-[#1c2220]">
          {status === "success" && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-[#1F3D2A] border border-green-200 dark:border-[#2A5A3A] rounded-lg">
              <p className="text-green-600 dark:text-[#7FD99F] text-sm font-medium">
                {message}
              </p>
              <p className="text-green-600 dark:text-[#7FD99F] text-xs mt-2">
                {t("checkSpam")}
              </p>
              <p className="text-green-600 dark:text-[#7FD99F] text-xs mt-2 font-medium">
                {t("redirecting")}
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-[#3D1F1F] border border-red-200 dark:border-[#5A2A2A] rounded-lg">
              <p className="text-red-600 dark:text-[#E08585] text-sm">
                {message}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                {t("emailLabel")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-slate-800 dark:text-[#F5F5F4] w-full h-12 px-4 text-sm border-2 border-slate-300 dark:border-[#3a3a3d] rounded-lg bg-white dark:bg-[#1c1c1e] hover:border-teal-300 dark:hover:border-[#6fcf9f] focus:border-teal-300 dark:focus:border-[#6fcf9f] focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-[#6fcf9f]/20 outline-none transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-[#7A7A78]"
                placeholder="votre@email.com"
                required
                disabled={isSubmitting || status === "success"}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || status === "success"}
              className="cursor-pointer w-full bg-teal-600 dark:bg-[#0F6E56] text-white py-3 rounded-lg font-medium hover:bg-teal-700 dark:hover:bg-[#085041] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t("sending") : t("sendLink")}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-slate-100 dark:border-[#1c2220]">
            <Link
              href="/auth/client/login"
              className="text-sm text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#6fcf9f] transition-colors"
            >
              {t("backToLogin")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
