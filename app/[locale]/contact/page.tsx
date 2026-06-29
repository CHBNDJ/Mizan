"use client";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ContactPage() {
  const router = useRouter();
  const t = useTranslations("contact");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap
      .timeline()
      .fromTo(
        ".back-btn",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      )
      .fromTo(
        ".header-title",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        ".header-desc",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".contact-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".faq-block",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.2"
      );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none pt-20">
      <style>{`.back-btn,.header-title,.header-desc,.contact-item,.faq-block{opacity:0;}`}</style>
      <div className="max-w-4xl mx-auto px-5 py-20" ref={containerRef}>
        <button
          onClick={() => router.back()}
          className="back-btn inline-flex items-center gap-2 text-teal-600 dark:text-[#6fcf9f] transition-all mb-10 text-[0.95rem] cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{t("back")}</span>
        </button>

        <div className="border-b-[3px] border-teal-600 dark:border-[#6fcf9f] pb-10 mb-16">
          <h1 className="header-title text-6xl font-light tracking-tight mb-5 text-slate-900 dark:text-[#F5F5F4]">
            {t("title")}
          </h1>
          <p className="header-desc text-xl text-slate-600 dark:text-[#E8E8E6] max-w-2xl leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <ul className="list-none mb-20">
          <li className="contact-item border-b border-slate-200 dark:border-[#1c2220] py-10">
            <h2 className="text-3xl font-normal mb-3 text-slate-900 dark:text-[#F5F5F4]">
              {t("technical.title")}
            </h2>
            <p className="text-slate-600 dark:text-[#E8E8E6] mb-5 text-lg leading-relaxed">
              {t("technical.desc")}
            </p>
            <a
              href="mailto:support@mizan-dz.com?subject=Support technique"
              className="inline-block text-teal-600 dark:text-[#6fcf9f] text-xl font-mono relative pb-1 after:content-[''] after:absolute after:bottom-0 after:start-0 after:w-0 after:h-0.5 after:bg-teal-600 dark:after:bg-[#6fcf9f] after:transition-all hover:after:w-full"
            >
              support@mizan-dz.com
            </a>
            <span className="inline-block text-sm text-slate-400 dark:text-[#7A7A78] italic ms-5">
              {t("technical.delay")}
            </span>
          </li>

          <li className="contact-item border-b border-slate-200 dark:border-[#1c2220] py-10">
            <h2 className="text-3xl font-normal mb-3 text-slate-900 dark:text-[#F5F5F4]">
              {t("general.title")}
            </h2>
            <p className="text-slate-600 dark:text-[#E8E8E6] mb-5 text-lg leading-relaxed">
              {t("general.desc")}
            </p>
            <a
              href="mailto:contact@mizan-dz.com?subject=Contact"
              className="inline-block text-teal-600 dark:text-[#6fcf9f] text-xl font-mono relative pb-1 after:content-[''] after:absolute after:bottom-0 after:start-0 after:w-0 after:h-0.5 after:bg-teal-600 dark:after:bg-[#6fcf9f] after:transition-all hover:after:w-full"
            >
              contact@mizan-dz.com
            </a>
            <span className="inline-block text-sm text-slate-400 dark:text-[#7A7A78] italic ms-5">
              {t("general.delay")}
            </span>
          </li>

          <li className="contact-item border-b border-slate-200 dark:border-[#1c2220] py-10">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-3xl font-normal text-slate-900 dark:text-[#F5F5F4]">
                {t("professional.title")}
              </h2>
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-[#1c1c1e] text-slate-600 dark:text-[#A8A8A6] text-xs font-medium rounded-md border border-slate-200 dark:border-[#1c2220]">
                {t("professional.badge")}
              </span>
            </div>
            <p className="text-slate-600 dark:text-[#E8E8E6] mb-5 text-lg leading-relaxed">
              {t("professional.desc")}
            </p>
            <a
              href="mailto:professionnel@mizan-dz.com?subject=Question professionnel"
              className="inline-block text-teal-600 dark:text-[#6fcf9f] text-xl font-mono relative pb-1 after:content-[''] after:absolute after:bottom-0 after:start-0 after:w-0 after:h-0.5 after:bg-teal-600 dark:after:bg-[#6fcf9f] after:transition-all hover:after:w-full"
            >
              professionnel@mizan-dz.com
            </a>
            <span className="inline-block text-sm text-slate-400 dark:text-[#7A7A78] italic ms-5">
              {t("professional.delay")}
            </span>
          </li>
        </ul>

        <div className="faq-block">
          <h3 className="text-2xl font-normal mb-5 text-slate-900 dark:text-[#F5F5F4]">
            {t("faqTitle")}
          </h3>
          <p className="text-slate-600 dark:text-[#E8E8E6] mb-5 leading-relaxed">
            {t("faqDesc")}
          </p>
          <Link
            href="/faq"
            className="inline-block mt-5 px-6 py-3 border-2 border-teal-600 dark:border-[#6fcf9f] text-teal-600 dark:text-[#6fcf9f] hover:bg-teal-600 dark:hover:bg-[#0F6E56] hover:text-white dark:hover:text-white transition-all rounded-full"
          >
            {t("faqLink")}
          </Link>
        </div>
      </div>
    </div>
  );
}
