"use client";
import { FileText, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function LegalMentionsPage() {
  const router = useRouter();
  const t = useTranslations("legalPage");
  const locale = useLocale();
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

  const dateLocale =
    locale === "ar" ? "ar-DZ" : locale === "en" ? "en-US" : "fr-FR";

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none">
      <div className="max-w-4xl mx-auto px-4 py-12" ref={containerRef}>
        <button
          onClick={() => router.back()}
          className="animate-section inline-flex items-center gap-2 text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#6fcf9f] mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back")}
        </button>
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200 dark:border-[#1c2220] p-8 md:p-12">
          <div className="animate-section flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-teal-600 dark:text-[#6fcf9f]" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-[#F5F5F4]">
              {t("title")}
            </h1>
          </div>
          <p className="animate-section text-slate-600 dark:text-[#E8E8E6] mb-8">
            {t("lastUpdate", {
              date: new Date().toLocaleDateString(dateLocale),
            })}
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <div className="animate-section bg-amber-50 dark:bg-[#3D2E1F] border border-amber-200 dark:border-[#5A4A2A] rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-amber-900 dark:text-[#E0B568] font-semibold mb-1">
                    {t("warningTitle")}
                  </p>
                  <p className="text-amber-800 dark:text-[#E0B568]/90 text-sm">
                    {t("warningP")}
                  </p>
                </div>
              </div>
            </div>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s1.title")}
              </h2>
              <div className="bg-slate-50 dark:bg-[#1c1c1e] rounded-lg p-6 border border-slate-200 dark:border-[#1c2220]">
                <p className="text-slate-700 dark:text-[#E8E8E6]">
                  <strong className="text-slate-900 dark:text-[#F5F5F4]">
                    {t("s1.projectName")}
                  </strong>{" "}
                  MIZAN
                </p>
                <p className="text-slate-700 dark:text-[#E8E8E6]">
                  <strong className="text-slate-900 dark:text-[#F5F5F4]">
                    {t("s1.operator")}
                  </strong>{" "}
                  Chabane Nadji
                </p>
                <p className="text-slate-700 dark:text-[#E8E8E6]">
                  <strong className="text-slate-900 dark:text-[#F5F5F4]">
                    {t("s1.status")}
                  </strong>{" "}
                  {t("s1.statusValue")}
                </p>
                <p className="text-slate-700 dark:text-[#E8E8E6]">
                  <strong className="text-slate-900 dark:text-[#F5F5F4]">
                    {t("s1.contactEmail")}
                  </strong>{" "}
                  <span className="text-teal-600 dark:text-[#6fcf9f]">
                    contact@mizan-dz.com
                  </span>
                </p>
                <p className="text-slate-700 dark:text-[#E8E8E6]">
                  <strong className="text-slate-900 dark:text-[#F5F5F4]">
                    {t("s1.personalEmail")}
                  </strong>{" "}
                  <span className="text-teal-600 dark:text-[#6fcf9f]">
                    chabane.nadji@gmail.com
                  </span>
                </p>
                <p className="text-slate-700 dark:text-[#E8E8E6]">
                  <strong className="text-slate-900 dark:text-[#F5F5F4]">
                    {t("s1.phone")}
                  </strong>{" "}
                  +33 6 60 25 35 70
                </p>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-[#1F2E3D] border border-blue-200 dark:border-[#2A4A5A] rounded">
                  <p className="text-blue-800 dark:text-[#7FB3E0] text-xs">
                    📋 {t("s1.regNote")}
                  </p>
                </div>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s1b.title")}
              </h2>
              <div className="bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-200 dark:border-[#6fcf9f]/20 rounded-lg p-6">
                <p className="text-teal-900 dark:text-[#F5F5F4] leading-relaxed font-medium mb-3">
                  ⚖️ {t("s1b.p1")}
                </p>
                <p className="text-teal-800 dark:text-[#6fcf9f] leading-relaxed">
                  {t("s1b.p2")}
                </p>
                <p className="text-teal-800 dark:text-[#6fcf9f] leading-relaxed mt-2">
                  {t("s1b.p3")}
                </p>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s2.title")}
              </h2>
              <p className="text-slate-700 dark:text-[#E8E8E6]">
                <strong>Chabane Nadji</strong>
                <br />
                {t("s2.role")}
                <br />
                {t("s2.email")}{" "}
                <span className="text-teal-600 dark:text-[#6fcf9f]">
                  chabane.nadji@gmail.com
                </span>
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s3.title")}
              </h2>
              <div className="bg-slate-50 dark:bg-[#1c1c1e] rounded-lg p-6 border border-slate-200 dark:border-[#1c2220]">
                <p className="text-slate-700 dark:text-[#E8E8E6]">
                  <strong className="text-slate-900 dark:text-[#F5F5F4]">
                    {t("s3.host")}
                  </strong>{" "}
                  {t("s3.hostValue")}
                </p>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s4.title")}
              </h2>
              <p className="text-slate-700 dark:text-[#E8E8E6] leading-relaxed">
                {t("s4.p1")}
              </p>
              <p className="text-slate-700 dark:text-[#E8E8E6] leading-relaxed mt-3">
                {t("s4.p2")}
              </p>
              <p className="text-slate-700 dark:text-[#E8E8E6] leading-relaxed mt-3">
                {t("s4.p3")}
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s5.title")}
              </h2>
              <p className="text-slate-700 dark:text-[#E8E8E6] leading-relaxed">
                {t("s5.p1")}{" "}
                <Link
                  href="/privacy"
                  className="text-teal-600 dark:text-[#6fcf9f] hover:underline font-medium"
                >
                  {t("s5.link")}
                </Link>
                .
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s6.title")}
              </h2>
              <p className="text-slate-700 dark:text-[#E8E8E6] leading-relaxed">
                {t("s6.p1")}
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s7.title")}
              </h2>
              <p className="text-slate-700 dark:text-[#E8E8E6] leading-relaxed">
                {t("s7.p1")}
              </p>
              <p className="text-slate-700 dark:text-[#E8E8E6] leading-relaxed mt-3">
                {t("s7.p2")}
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s8.title")}
              </h2>
              <p className="text-slate-700 dark:text-[#E8E8E6] leading-relaxed">
                {t("s8.p1")}
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s9.title")}
              </h2>
              <a
                href="mailto:contact@mizan-dz.com?subject=Question sur les mentions légales"
                className="text-teal-600 dark:text-[#6fcf9f] font-medium hover:underline text-lg"
              >
                contact@mizan-dz.com
              </a>
              <p className="text-slate-600 dark:text-[#A8A8A6] mt-4">
                {t("s9.otherRequests")}{" "}
                <Link
                  href="/contact"
                  className="text-teal-600 dark:text-[#6fcf9f] hover:underline font-medium"
                >
                  {t("s9.contactPage")}
                </Link>
                .
              </p>
            </section>
          </div>

          <div className="animate-section mt-12 pt-8 border-t border-slate-200 dark:border-[#1c2220]">
            <p className="text-sm text-slate-500 dark:text-[#A8A8A6] text-center">
              {t("footerNote")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
