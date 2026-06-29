"use client";
import { Scale, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CGUPage() {
  const router = useRouter();
  const t = useTranslations("cguPage");
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
            <Scale className="w-8 h-8 text-teal-600 dark:text-[#6fcf9f]" />
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
            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s1.title")}
              </h2>
              <p className="text-slate-700 dark:text-[#E8E8E6] leading-relaxed mb-4">
                {t("s1.p1")}
              </p>
              <div className="bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-200 dark:border-[#6fcf9f]/20 rounded-lg p-5">
                <h3 className="font-semibold text-teal-900 dark:text-[#F5F5F4] mb-2">
                  ⚖️ {t("s1.boxTitle")}
                </h3>
                <p className="text-teal-800 dark:text-[#6fcf9f] leading-relaxed">
                  <strong>{t("s1.boxP1").split(":")[0]}:</strong>
                  {t("s1.boxP1").split(":").slice(1).join(":")}
                </p>
                <p className="text-teal-800 dark:text-[#6fcf9f] leading-relaxed mt-2">
                  {t("s1.boxP2")}
                </p>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s2.title")}
              </h2>
              <p className="text-slate-700 dark:text-[#E8E8E6] leading-relaxed">
                {t("s2.p1")}
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s3.title")}
              </h2>
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-800 dark:text-[#F5F5F4]">
                  {t("s3.clientsTitle")}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-[#E8E8E6]">
                  {t.raw("s3.clients").map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <h3 className="font-semibold text-slate-800 dark:text-[#F5F5F4] mt-4">
                  {t("s3.prosTitle")}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-[#E8E8E6]">
                  {t.raw("s3.pros").map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s4.title")}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-[#E8E8E6]">
                {t.raw("s4.items").map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s5.title")}
              </h2>
              <div className="bg-blue-50 dark:bg-[#1F2E3D] border border-blue-200 dark:border-[#2A4A5A] rounded-lg p-5">
                <h3 className="font-semibold text-blue-900 dark:text-[#7FB3E0] mb-3">
                  📋 {t("s5.boxTitle")}
                </h3>
                <p className="text-blue-800 dark:text-[#7FB3E0] leading-relaxed mb-3">
                  {t("s5.p1")}
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-[#7FB3E0]">
                      {t("s5.aTitle")}
                    </h4>
                    <p className="text-blue-800 dark:text-[#7FB3E0] text-sm">
                      {t("s5.aP")}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-[#7FB3E0]">
                      {t("s5.bTitle")}
                    </h4>
                    <p className="text-blue-800 dark:text-[#7FB3E0] text-sm mb-2">
                      {t("s5.bP")}
                    </p>
                  </div>
                </div>
                <h3 className="font-semibold text-blue-900 dark:text-[#7FB3E0] mt-4 mb-2">
                  📧 {t("s5.infoTitle")}
                </h3>
                <p className="text-blue-800 dark:text-[#7FB3E0] text-sm">
                  {t("s5.infoP")}
                </p>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s6.title")}
              </h2>
              <div className="bg-green-50 dark:bg-[#1F3D2A] border border-green-200 dark:border-[#2A5A3A] rounded-lg p-5">
                <p className="text-green-800 dark:text-[#7FD99F] leading-relaxed mb-4">
                  {t("s6.p1")}
                </p>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-[#7FD99F]">
                      ✏️ {t("s6.rectifTitle")}
                    </h3>
                    <p className="text-green-800 dark:text-[#7FD99F] text-sm">
                      {t("s6.rectifP")}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-[#7FD99F]">
                      🗑️ {t("s6.deleteTitle")}
                    </h3>
                    <p className="text-green-800 dark:text-[#7FD99F] text-sm">
                      {t("s6.deleteP")}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-[#7FD99F]">
                      🚫 {t("s6.opposeTitle")}
                    </h3>
                    <p className="text-green-800 dark:text-[#7FD99F] text-sm">
                      {t("s6.opposeP")}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-[#7FD99F]">
                      👁️ {t("s6.accessTitle")}
                    </h3>
                    <p className="text-green-800 dark:text-[#7FD99F] text-sm">
                      {t("s6.accessP")}
                    </p>
                  </div>
                </div>
                <div className="mt-5 p-4 bg-green-100 dark:bg-[#2A5A3A] border border-green-300 dark:border-[#3A6A4A] rounded">
                  <h3 className="font-semibold text-green-900 dark:text-[#7FD99F] mb-2">
                    📞 {t("s6.howTitle")}
                  </h3>
                  <ul className="space-y-1 text-green-800 dark:text-[#7FD99F] text-sm">
                    <li>
                      <strong>{t("s6.email")}</strong>{" "}
                      <a
                        href="mailto:professionnel@mizan-dz.com"
                        className="underline"
                      >
                        professionnel@mizan-dz.com
                      </a>
                    </li>
                    <li>
                      <strong>{t("s6.phone")}</strong> +33 6 60 25 35 70
                    </li>
                    <li>
                      <strong>{t("s6.delay")}</strong> {t("s6.delayValue")}
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s7.title")}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-[#E8E8E6]">
                {t.raw("s7.items").map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p className="text-slate-700 dark:text-[#E8E8E6] leading-relaxed mt-3">
                {t("s7.p1")}
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s8.title")}
              </h2>
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-800 dark:text-[#F5F5F4]">
                  {t("s8.commitTitle")}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-[#E8E8E6]">
                  {t.raw("s8.commit").map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <h3 className="font-semibold text-slate-800 dark:text-[#F5F5F4] mt-4">
                  {t("s8.declineTitle")}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-[#E8E8E6]">
                  {t.raw("s8.decline").map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="text-slate-700 dark:text-[#E8E8E6] leading-relaxed mt-4 bg-amber-50 dark:bg-[#3D2E1F] border border-amber-200 dark:border-[#5A4A2A] rounded p-3">
                  <strong>⚠️ {t("s8.importantP").split(":")[0]}:</strong>
                  {t("s8.importantP").split(":").slice(1).join(":")}
                </p>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s9.title")}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-[#E8E8E6]">
                {t.raw("s9.items").map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s10.title")}
              </h2>
              <p className="text-slate-700 dark:text-[#E8E8E6] leading-relaxed">
                {t("s10.p1")}
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s11.title")}
              </h2>
              <p className="text-slate-700 dark:text-[#E8E8E6] leading-relaxed">
                {t("s11.p1")}
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s12.title")}
              </h2>
              <p className="text-slate-700 dark:text-[#E8E8E6] leading-relaxed">
                {t("s12.p1")}
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-4">
                {t("s13.title")}
              </h2>
              <a
                href="mailto:contact@mizan-dz.com?subject=Question sur les CGU"
                className="text-teal-600 dark:text-[#6fcf9f] font-medium hover:underline text-lg"
              >
                contact@mizan-dz.com
              </a>
              <p className="text-slate-700 dark:text-[#E8E8E6] leading-relaxed mt-2">
                {t("s13.phone")}
              </p>
              <p className="text-slate-600 dark:text-[#A8A8A6] mt-4">
                {t("s13.otherRequests")}{" "}
                <Link
                  href="/contact"
                  className="text-teal-600 dark:text-[#6fcf9f] hover:underline font-medium"
                >
                  {t("s13.contactPage")}
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
