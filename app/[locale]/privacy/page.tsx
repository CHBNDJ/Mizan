"use client";
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function PrivacyPolicyPage() {
  const router = useRouter();
  const t = useTranslations("privacyPage");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current.querySelectorAll(".animate-section"),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
      }
    );
  }, []);

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none">
      <div className="max-w-3xl mx-auto px-4 py-12" ref={containerRef}>
        <button
          onClick={() => router.back()}
          className="animate-section inline-flex items-center gap-2 text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#6fcf9f] mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back")}
        </button>
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-[#1c2220] p-8 md:p-10">
          <div className="animate-section flex items-center gap-3 mb-6">
            <Shield className="w-7 h-7 text-teal-600 dark:text-[#6fcf9f]" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-[#F5F5F4]">
              {t("title")}
            </h1>
          </div>

          <div className="space-y-8 text-slate-700 dark:text-[#E8E8E6] leading-relaxed">
            <section className="animate-section">
              <p>{t("intro")}</p>
            </section>

            <section className="animate-section">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-[#F5F5F4] mb-3">
                {t("s1.title")}
              </h2>
              <p>
                {t("s1.p1")}{" "}
                <a
                  href="mailto:professionnel@mizan-dz.com"
                  className="text-teal-600 dark:text-[#6fcf9f] hover:underline font-medium"
                >
                  professionnel@mizan-dz.com
                </a>
                .
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-[#F5F5F4] mb-3">
                {t("s2.title")}
              </h2>
              <p>{t("s2.p1")}</p>
            </section>

            <section className="animate-section">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-[#F5F5F4] mb-3">
                {t("s3.title")}
              </h2>
              <p>{t("s3.p1")}</p>
              <p className="mt-2 font-semibold">{t("s3.neverSell")}</p>
            </section>

            <section className="animate-section">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-[#F5F5F4] mb-3">
                {t("s4.title")}
              </h2>
              <p>{t("s4.p1")}</p>
            </section>

            <section className="animate-section">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-[#F5F5F4] mb-3">
                {t("s5.title")}
              </h2>
              <p>
                {t("s5.p1")}{" "}
                <a
                  href="mailto:contact@mizan-dz.com"
                  className="text-teal-600 dark:text-[#6fcf9f] hover:underline font-medium"
                >
                  contact@mizan-dz.com
                </a>
                .
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-[#F5F5F4] mb-3">
                {t("s6.title")}
              </h2>
              <a
                href="mailto:contact@mizan-dz.com"
                className="text-teal-600 dark:text-[#6fcf9f] font-medium hover:underline text-lg"
              >
                contact@mizan-dz.com
              </a>
              <p className="text-slate-600 dark:text-[#A8A8A6] mt-4 text-sm">
                {t("s6.otherRequests")}{" "}
                <Link
                  href="/contact"
                  className="text-teal-600 dark:text-[#6fcf9f] hover:underline font-medium"
                >
                  {t("s6.contactPage")}
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
