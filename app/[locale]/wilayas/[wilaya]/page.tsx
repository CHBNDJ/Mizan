"use client";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, MapPin } from "lucide-react";
import { AvocatCard } from "@/components/cards/AvocatCard";
import { getAvocatsByWilaya, getVillesByWilaya } from "@/lib/avocatsData";
import { getWilayaLabel } from "@/lib/i18nLabels";
import { localizedDigits } from "@/lib/arabicNumerals";
import { gsap } from "gsap";

interface WilayaPageProps {
  params: Promise<{ wilaya: string }>;
}

export default async function WilayaPage({ params }: WilayaPageProps) {
  const { wilaya } = await params;

  const wilayaNom = decodeURIComponent(wilaya);
  const wilayaCapitalized =
    wilayaNom.charAt(0).toUpperCase() + wilayaNom.slice(1);

  const avocats = await getAvocatsByWilaya(wilayaCapitalized);
  const villes = getVillesByWilaya(wilayaCapitalized);

  if (avocats.length === 0) {
    notFound();
  }

  const totalAvocats = avocats.length;
  const avocatsVerifies = avocats.filter((a) => a.verified).length;
  const moyenneExperience =
    avocats.reduce((sum, a) => sum + a.experience.annees, 0) / totalAvocats;
  const avocatsAvecRating = avocats.filter(
    (a) =>
      (a.rating_google && a.rating_google > 0) ||
      (a.rating_mizan && a.rating_mizan > 0)
  );

  const moyenneRating =
    avocatsAvecRating.length > 0
      ? avocatsAvecRating.reduce((sum, a) => {
          const rating = Math.max(a.rating_google || 0, a.rating_mizan || 0);
          return sum + rating;
        }, 0) / avocatsAvecRating.length
      : 0;

  return (
    <WilayaPageClient
      wilayaCapitalized={wilayaCapitalized}
      totalAvocats={totalAvocats}
      avocatsVerifies={avocatsVerifies}
      moyenneExperience={moyenneExperience}
      moyenneRating={moyenneRating}
      villes={villes}
      avocats={avocats}
    />
  );
}

function WilayaPageClient({
  wilayaCapitalized,
  totalAvocats,
  avocatsVerifies,
  moyenneExperience,
  moyenneRating,
  villes,
  avocats,
}: any) {
  const t = useTranslations();
  const locale = useLocale();
  const ld = (s: string) => localizedDigits(s, locale);
  const wilayaLabel = getWilayaLabel(wilayaCapitalized, t);

  useEffect(() => {
    gsap.fromTo(
      ".wilaya-header",
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      ".wilaya-stat",
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.3,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      ".wilaya-villes",
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.5,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      ".wilaya-avocat-card",
      {
        opacity: 0,
        x: -30,
      },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.7,
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none pt-16">
      <style jsx>{`
        .wilaya-header,
        .wilaya-stat,
        .wilaya-villes,
        .wilaya-avocat-card {
          opacity: 0;
        }
      `}</style>

      <div className="bg-white dark:bg-[#1c1c1e] border-b border-slate-200 dark:border-[#1c2220]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="wilaya-header">
            <Link
              href="/"
              className="inline-flex items-center text-slate-600 dark:text-[#E8E8E6] hover:text-slate-800 dark:hover:text-[#F5F5F4] mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 me-2" />
              {t("wilayaPage.backHome")}
            </Link>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-4">
                  {t("wilayaPage.title", { wilaya: wilayaLabel })}
                </h1>
                <p className="text-lg text-slate-600 dark:text-[#E8E8E6] max-w-2xl">
                  {t("wilayaPage.desc", { wilaya: wilayaLabel })}
                </p>
              </div>

              <div className="text-end">
                <div className="text-3xl font-bold text-teal-600 dark:text-[#6fcf9f]">
                  {ld(String(totalAvocats))}
                </div>
                <div className="text-sm text-slate-500 dark:text-[#A8A8A6]">
                  {t("wilayaPage.available", { count: totalAvocats })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1c1c1e] border-b border-slate-200 dark:border-[#1c2220]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="wilaya-stat text-center p-4 bg-teal-50 dark:bg-[#6fcf9f]/10 rounded-lg">
              <div className="text-2xl font-bold text-teal-600 dark:text-[#6fcf9f] mb-1">
                {ld(String(totalAvocats))}
              </div>
              <div className="text-sm text-slate-600 dark:text-[#E8E8E6]">
                {t("wilayaPage.statLawyers")}
              </div>
            </div>

            <div className="wilaya-stat text-center p-4 bg-teal-50 dark:bg-[#6fcf9f]/10 rounded-lg">
              <div className="text-2xl font-bold text-teal-600 dark:text-[#6fcf9f] mb-1">
                {ld(String(avocatsVerifies))}
              </div>
              <div className="text-sm text-slate-600 dark:text-[#E8E8E6]">
                {t("wilayaPage.statVerified")}
              </div>
            </div>

            <div className="wilaya-stat text-center p-4 bg-teal-50 dark:bg-[#6fcf9f]/10 rounded-lg">
              <div className="text-2xl font-bold text-teal-600 dark:text-[#6fcf9f] mb-1">
                {ld(moyenneExperience.toFixed(0))}
              </div>
              <div className="text-sm text-slate-600 dark:text-[#E8E8E6]">
                {t("wilayaPage.statExperience")}
              </div>
            </div>

            <div className="wilaya-stat text-center p-4 bg-teal-50 dark:bg-[#6fcf9f]/10 rounded-lg">
              <div className="text-2xl font-bold text-teal-600 dark:text-[#6fcf9f] mb-1">
                {moyenneRating
                  ? ld(moyenneRating.toFixed(1))
                  : t("wilayaPage.noRating")}
              </div>
              <div className="text-sm text-slate-600 dark:text-[#E8E8E6]">
                {t("wilayaPage.statRating")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {villes.length > 1 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="wilaya-villes">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-[#F5F5F4] mb-4">
              {t("wilayaPage.citiesCovered", { wilaya: wilayaLabel })}
            </h2>
            <div className="flex flex-wrap gap-2">
              {villes.map((ville: string) => {
                const avocatsVille = avocats.filter(
                  (a: any) => a.ville === ville
                ).length;
                return (
                  <span
                    key={ville}
                    className="px-4 py-2 bg-teal-50 dark:bg-[#6fcf9f]/10 text-teal-700 dark:text-[#6fcf9f] rounded-lg text-sm font-medium hover:bg-teal-100 dark:hover:bg-[#6fcf9f]/20 transition-colors"
                  >
                    <MapPin className="w-4 h-4 inline me-1" />
                    {ville} ({ld(String(avocatsVille))})
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {avocats.map((avocat: any) => (
            <div key={avocat.id} className="wilaya-avocat-card">
              <AvocatCard avocat={avocat} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
