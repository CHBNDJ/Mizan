"use client";
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function PrivacyPolicyPage() {
  const router = useRouter();
  const t = useTranslations("privacyPage");
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
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <div className="max-w-4xl mx-auto px-4 py-12" ref={containerRef}>
        <button
          onClick={() => router.back()}
          className="animate-section inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back")}
        </button>
        <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12">
          <div className="animate-section flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-slate-900">{t("title")}</h1>
          </div>
          <p className="animate-section text-slate-600 mb-8">
            {t("lastUpdate", {
              date: new Date().toLocaleDateString(dateLocale),
            })}
          </p>

          <div className="prose prose-slate max-w-none space-y-8">
            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {t("s1.title")}
              </h2>
              <p className="text-slate-700 leading-relaxed">{t("s1.p1")}</p>
              <p className="text-slate-700 leading-relaxed mt-3">
                {t("s1.p2")}
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {t("s2.title")}
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">
                  📋 {t("s2.boxTitle")}
                </h3>
                <p className="text-blue-800 leading-relaxed mb-3">
                  {t("s2.p1")}
                </p>
                <ul className="list-disc list-inside space-y-2 text-blue-800">
                  {t.raw("s2.sources").map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <h3 className="font-semibold text-blue-900 mt-5 mb-3">
                  🔍 {t("s2.natureTitle")}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-blue-800">
                  {t.raw("s2.nature").map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <h3 className="font-semibold text-blue-900 mt-5 mb-3">
                  ✅ {t("s2.useTitle")}
                </h3>
                <p className="text-blue-800 leading-relaxed">{t("s2.useP")}</p>
                <h3 className="font-semibold text-blue-900 mt-5 mb-3">
                  📧 {t("s2.infoTitle")}
                </h3>
                <p className="text-blue-800 leading-relaxed">{t("s2.infoP")}</p>
                <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded">
                  <p className="text-blue-900 font-semibold mb-2">
                    🛡️ {t("s2.rightsTitle")}
                  </p>
                  <p className="text-blue-800 text-sm mb-2">
                    {t("s2.rightsP")}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                    <li>{t("s2.rightRectif")}</li>
                    <li>{t("s2.rightDelete")}</li>
                    <li>{t("s2.rightOppose")}</li>
                    <li>{t("s2.rightAccess")}</li>
                  </ul>
                  <p className="text-blue-800 text-sm mt-3">
                    <strong>{t("s2.contact")}</strong>{" "}
                    <a
                      href="mailto:professionnel@mizan-dz.com"
                      className="underline font-medium"
                    >
                      professionnel@mizan-dz.com
                    </a>{" "}
                    — {t("s2.delay")}
                  </p>
                </div>
                <p className="text-blue-800 leading-relaxed mt-4 text-sm">
                  {t("s2.note")}
                </p>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {t("s3.title")}
              </h2>
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-800">
                  {t("s3.allTitle")}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  {t.raw("s3.all").map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <h3 className="font-semibold text-slate-800 mt-4">
                  {t("s3.clientsTitle")}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  {t.raw("s3.clients").map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <h3 className="font-semibold text-slate-800 mt-4">
                  {t("s3.prosTitle")}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  {t.raw("s3.pros").map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {t("s4.title")}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                {t("s4.p1")}
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                {t.raw("s4.items").map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4 font-semibold">
                {t("s4.neverSell")}
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {t("s5.title")}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>
                  <strong>{t("s5.between")}</strong> {t("s5.betweenP")}
                </li>
                <li>
                  <strong>{t("s5.providers")}</strong> {t("s5.providersP")}
                </li>
                <li>
                  <strong>{t("s5.legal")}</strong> {t("s5.legalP")}
                </li>
              </ul>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {t("s6.title")}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                {t.raw("s6.items").map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {t("s7.title")}
              </h2>
              <p className="text-slate-700 leading-relaxed">{t("s7.p1")}</p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {t("s8.title")}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>
                  <strong>{t("s8.access")}</strong> {t("s8.accessP")}
                </li>
                <li>
                  <strong>{t("s8.rectif")}</strong> {t("s8.rectifP")}
                </li>
                <li>
                  <strong>{t("s8.erase")}</strong> {t("s8.eraseP")}
                </li>
                <li>
                  <strong>{t("s8.portability")}</strong> {t("s8.portabilityP")}
                </li>
                <li>
                  <strong>{t("s8.oppose")}</strong> {t("s8.opposeP")}
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-3">
                {t("s8.exercise")}{" "}
                <a
                  href="mailto:contact@mizan-dz.com"
                  className="text-teal-600 hover:underline font-medium"
                >
                  contact@mizan-dz.com
                </a>
              </p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {t("s9.title")}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>
                  <strong>{t("s9.active")}</strong> {t("s9.activeP")}
                </li>
                <li>
                  <strong>{t("s9.deleted")}</strong> {t("s9.deletedP")}
                </li>
                <li>
                  <strong>{t("s9.reviews")}</strong> {t("s9.reviewsP")}
                </li>
                <li>
                  <strong>{t("s9.unregistered")}</strong>{" "}
                  {t("s9.unregisteredP")}
                </li>
              </ul>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {t("s10.title")}
              </h2>
              <p className="text-slate-700 leading-relaxed">{t("s10.p1")}</p>
            </section>

            <section className="animate-section">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {t("s11.title")}
              </h2>
              <a
                href="mailto:contact@mizan-dz.com?subject=Question sur la confidentialité"
                className="text-teal-600 font-medium hover:underline text-lg"
              >
                contact@mizan-dz.com
              </a>
              <p className="text-slate-700 leading-relaxed mt-2">
                {t("s11.phone")}
              </p>
              <p className="text-slate-600 mt-4">
                {t("s11.otherRequests")}{" "}
                <Link
                  href="/contact"
                  className="text-teal-600 hover:underline font-medium"
                >
                  {t("s11.contactPage")}
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
