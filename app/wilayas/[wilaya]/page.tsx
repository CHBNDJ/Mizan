"use client";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { AvocatCard } from "@/components/cards/AvocatCard";
import { getAvocatsByWilaya, getVillesByWilaya } from "@/lib/avocatsData";
import { gsap } from "gsap";

interface WilayaPageProps {
  params: Promise<{ wilaya: string }>;
}

export default async function WilayaPage({ params }: WilayaPageProps) {
  const { wilaya } = await params;

  const wilayaNom = decodeURIComponent(wilaya);
  const wilayaCapitalized =
    wilayaNom.charAt(0).toUpperCase() + wilayaNom.slice(1);

  const avocats = getAvocatsByWilaya(wilayaCapitalized);
  const villes = getVillesByWilaya(wilayaCapitalized);

  if (avocats.length === 0) {
    notFound();
  }

  const totalAvocats = avocats.length;
  const avocatsVerifies = avocats.filter((a) => a.verified).length;
  const moyenneExperience =
    avocats.reduce((sum, a) => sum + a.experience.annees, 0) / totalAvocats;
  const avocatsAvecRating = avocats.filter((a) => a.rating && a.rating > 0);
  const moyenneRating =
    avocatsAvecRating.length > 0
      ? avocatsAvecRating.reduce((sum, a) => sum + (a.rating || 0), 0) /
        avocatsAvecRating.length
      : null;

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
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-100 pt-16">
      <style jsx>{`
        .wilaya-header,
        .wilaya-stat,
        .wilaya-villes,
        .wilaya-avocat-card {
          opacity: 0;
        }
      `}</style>

      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="wilaya-header">
            <Link
              href="/"
              className="inline-flex items-center text-slate-600 hover:text-slate-800 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Link>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-800 mb-4">
                  Avocats à {wilayaCapitalized}
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl">
                  Trouvez un avocat qualifié dans la wilaya de{" "}
                  {wilayaCapitalized}. Tous nos avocats sont vérifiés et
                  spécialisés dans différents domaines du droit.
                </p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold text-teal-600">
                  {totalAvocats}
                </div>
                <div className="text-sm text-slate-500">
                  Avocat{totalAvocats > 1 ? "s" : ""} disponible
                  {totalAvocats > 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="wilaya-stat text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-2xl font-bold text-teal-600 mb-1">
                {totalAvocats}
              </div>
              <div className="text-sm text-slate-600">Avocats</div>
            </div>

            <div className="wilaya-stat text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-2xl font-bold text-teal-600 mb-1">
                {avocatsVerifies}
              </div>
              <div className="text-sm text-slate-600">Vérifiés</div>
            </div>

            <div className="wilaya-stat text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-2xl font-bold text-teal-600 mb-1">
                {moyenneExperience.toFixed(0)}
              </div>
              <div className="text-sm text-slate-600">
                Ans d'expérience moy.
              </div>
            </div>

            <div className="wilaya-stat text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-2xl font-bold text-teal-600 mb-1">
                {moyenneRating ? moyenneRating.toFixed(1) : "N/A"}
              </div>
              <div className="text-sm text-slate-600">Note moyenne</div>
            </div>
          </div>
        </div>
      </div>

      {villes.length > 1 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="wilaya-villes">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Villes couvertes dans {wilayaCapitalized}
            </h2>
            <div className="flex flex-wrap gap-2">
              {villes.map((ville: string) => {
                const avocatsVille = avocats.filter(
                  (a: any) => a.ville === ville
                ).length;
                return (
                  <span
                    key={ville}
                    className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors"
                  >
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {ville} ({avocatsVille})
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
