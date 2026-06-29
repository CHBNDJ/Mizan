"use client";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface Question {
  q: string;
  a: string;
}
interface Category {
  label: string;
  questions: Question[];
}

const CATEGORY_KEYS = [
  "general",
  "clients",
  "avocats",
  "notaires",
  "huissiers",
  "comptables",
  "expertComptable",
];

export default function FAQPage() {
  const t = useTranslations("faqPage");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const containerRef = useRef<HTMLDivElement>(null);

  const categories: Record<string, Category> = t.raw("categories");

  useEffect(() => {
    if (!containerRef.current) return;
    gsap
      .timeline()
      .fromTo(
        ".main-title",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        ".subtitle",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".tabs-wrapper",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".cta-block",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.2"
      );
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".faq-item",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.1,
      }
    );
    setOpenIndex(null);
  }, [activeTab]);

  const activeCategory = categories[activeTab];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none">
      <style>{`.main-title,.subtitle,.tabs-wrapper,.faq-item,.cta-block{opacity:0;}`}</style>
      <div className="max-w-4xl mx-auto px-5 py-16" ref={containerRef}>
        <div className="text-center mb-10">
          <h1 className="main-title text-4xl sm:text-5xl font-bold text-slate-900 dark:text-[#F5F5F4] mb-3">
            {t("title")}
          </h1>
          <p className="subtitle text-lg text-slate-600 dark:text-[#E8E8E6] max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
        <div className="tabs-wrapper mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORY_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all cursor-pointer ${activeTab === key ? "bg-teal-600 dark:bg-[#0F6E56] text-white shadow-sm dark:shadow-none" : "bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] text-slate-600 dark:text-[#E8E8E6] hover:border-teal-200 dark:hover:border-[#6fcf9f]/50 hover:text-teal-700 dark:hover:text-[#6fcf9f]"}`}
              >
                {key === "expertComptable"
                  ? t("tabExpertComptable")
                  : categories[key]?.label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {activeCategory?.questions.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="faq-item bg-white dark:bg-[#1c1c1e] rounded-xl overflow-hidden border border-slate-200 dark:border-[#1c2220] hover:border-teal-200 dark:hover:border-[#6fcf9f]/50 transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-start hover:bg-slate-50 dark:hover:bg-[#1c2220] transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-slate-900 dark:text-[#F5F5F4] pe-4 text-sm md:text-base">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-teal-600 dark:text-[#6fcf9f] transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"}`}
                >
                  <div className="px-6 pb-5 text-slate-600 dark:text-[#A8A8A6] text-sm leading-relaxed border-t border-slate-100 dark:border-[#1c2220] pt-3">
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="cta-block mt-12 bg-white dark:bg-[#1c1c1e] rounded-xl border border-slate-200 dark:border-[#1c2220] p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-start">
              <h3 className="text-xl font-bold text-slate-900 dark:text-[#F5F5F4] mb-1">
                {t("noAnswerTitle")}
              </h3>
              <p className="text-slate-500 dark:text-[#A8A8A6] text-sm">
                {t("noAnswerDesc")}
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 dark:bg-[#0F6E56] dark:hover:bg-[#085041] text-white font-semibold text-sm rounded-xl transition-all whitespace-nowrap"
            >
              {t("contactCta")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
