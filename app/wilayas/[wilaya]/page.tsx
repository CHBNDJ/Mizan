import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Users, Star } from "lucide-react";
import { AvocatCard } from "@/components/cards/AvocatCard";
import { getAvocatsByWilaya, getVillesByWilaya } from "@/lib/avocatsData";

interface WilayaPageProps {
  params: Promise<{ wilaya: string }>; // ← Promise ajoutée
}

export default async function WilayaPage({ params }: WilayaPageProps) {
  // ← async ajouté
  const { wilaya } = await params; // ← await ajouté

  const wilayaNom = decodeURIComponent(wilaya); // ← utilise wilaya directement
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center text-slate-600 hover:text-slate-800 mb-6"
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
                Trouvez un avocat qualifié dans la wilaya de {wilayaCapitalized}
                . Tous nos avocats sont vérifiés et spécialisés dans différents
                domaines du droit.
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

      {/* Statistiques */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600 mb-1">
                {totalAvocats}
              </div>
              <div className="text-sm text-slate-600">Avocats</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600 mb-1">
                {avocatsVerifies}
              </div>
              <div className="text-sm text-slate-600">Vérifiés</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600 mb-1">
                {moyenneExperience.toFixed(0)}
              </div>
              <div className="text-sm text-slate-600">
                Ans d'expérience moy.
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600 mb-1">
                {moyenneRating ? moyenneRating.toFixed(1) : "N/A"}
              </div>
              <div className="text-sm text-slate-600">Note moyenne</div>
            </div>
          </div>
        </div>
      </div>

      {/* Villes disponibles */}
      {villes.length > 1 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Villes couvertes dans {wilayaCapitalized}
          </h2>
          <div className="flex flex-wrap gap-2">
            {villes.map((ville) => {
              const avocatsVille = avocats.filter(
                (a) => a.ville === ville
              ).length;
              return (
                <span
                  key={ville}
                  className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium"
                >
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {ville} ({avocatsVille})
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Liste des avocats */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {avocats.map((avocat) => (
            <AvocatCard key={avocat.id} avocat={avocat} />
          ))}
        </div>
      </div>
    </div>
  );
}
