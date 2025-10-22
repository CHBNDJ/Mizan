"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { AvocatCard } from "@/components/cards/AvocatCard";
import {
  getTopRatedAvocats,
  getSpecialites,
  getWilayas,
  getStatistiques,
} from "@/lib/avocatsData";
import { MultiSelectWithCheckboxes } from "@/components/ui/MultiSelectCheck";

// export const dynamic = "force-dynamic";

export default function HomePage() {
  const router = useRouter();

  const [selectedSpecialites, setSelectedSpecialites] = useState<string[]>([]);
  const [selectedWilaya, setSelectedWilaya] = useState("");

  const [topAvocats, setTopAvocats] = useState<any[]>([]);
  const [wilayas, setWilayas] = useState<string[]>([]);
  const [stats, setStats] = useState<any>({
    total_avocats: 32,
    pourcentage_verification: 100,
  });

  const specialites = getSpecialites();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [topAvocatsData, wilayasData, statsData] = await Promise.all([
          getTopRatedAvocats(6),
          getWilayas(),
          getStatistiques(),
        ]);

        setTopAvocats(topAvocatsData);
        setWilayas(wilayasData);
        setStats(statsData);
      } catch (error) {
        console.error("Erreur chargement données:", error);
      }
    };

    loadData();
  }, []);

  const specialiteOptions = specialites.map((specialite) => ({
    value: specialite,
    label: specialite,
  }));

  const wilayaOptions = wilayas.map((wilaya) => ({
    value: wilaya,
    label: wilaya,
  }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (selectedSpecialites.length > 0) {
      selectedSpecialites.forEach((spec) => {
        params.append("specialite", spec);
      });
    }

    if (selectedWilaya) {
      params.set("wilaya", selectedWilaya);
    }

    const queryString = params.toString();
    const url = queryString ? `/search?${queryString}` : "/search";
    router.push(url);
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-800 mb-6">
            Besoin d'un avocat ?
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Trouvez votre avocat en Algérie selon votre besoin juridique et
            votre localisation. Avec Mizan, c'est simple, rapide et sécurisé.
          </p>

          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <MultiSelectWithCheckboxes
                    placeholder="Choisir des spécialités..."
                    options={specialiteOptions}
                    value={selectedSpecialites}
                    onChange={setSelectedSpecialites}
                    className="h-12"
                  />
                </div>

                <div className="lg:w-64">
                  <CustomSelect
                    placeholder="Choisir une wilaya"
                    options={wilayaOptions}
                    value={selectedWilaya}
                    onChange={setSelectedWilaya}
                    className="h-12"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 px-8 bg-teal-500 hover:bg-teal-500 md:text-lg font-semibold whitespace-nowrap"
              >
                <Search className="w-5 h-5 mr-2" />
                Rechercher des avocats
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-3xl font-bold text-teal-600 mb-2">
                {stats.total_avocats}
              </div>
              <div className="text-slate-600 font-medium">Avocats inscrits</div>
            </div>

            <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-3xl font-bold text-teal-600 mb-2">
                {wilayas.length}
              </div>
              <div className="text-slate-600 font-medium">
                Wilayas couvertes
              </div>
            </div>

            <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-3xl font-bold text-teal-600 mb-2">
                {specialites.length}
              </div>
              <div className="text-slate-600 font-medium">
                Spécialités juridiques
              </div>
            </div>

            <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-3xl font-bold text-teal-600 mb-2">
                {stats.pourcentage_verification}%
              </div>
              <div className="text-slate-600 font-medium">
                Taux de vérification
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Avocats les mieux notés
            </h2>
            <p className="text-lg text-slate-600">
              Découvrez les avocats recommandés par notre communauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {topAvocats.map((avocat) => (
              <AvocatCard key={avocat.id} avocat={avocat} />
            ))}
          </div>

          <div className="text-center">
            <button
              className="text-teal-600 cursor-pointer items-center justify-center inline-flex"
              onClick={() => {
                router.push("/search");
              }}
            >
              Voir tous les avocats
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Rechercher par région
            </h2>
            <p className="text-lg text-slate-600">
              Trouvez des avocats près de chez vous
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {wilayas.map((wilaya) => (
              <Link
                key={wilaya}
                href={`/search?wilaya=${wilaya}`}
                className="group"
              >
                <div className="bg-gradient-to-br bg-teal-500 text-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <MapPin className="w-8 h-8 mx-auto mb-3 opacity-80" />
                  <h3 className="font-bold text-lg">{wilaya}</h3>
                  <p className="text-teal-100 text-sm mt-1">Voir les avocats</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-teal-500">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Vous êtes avocat ?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Rejoignez notre plateforme et développez votre clientèle
          </p>
          <Link href="/auth/lawyer/register">
            <button
              className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold
                   hover:bg-gradient-to-r hover:from-white hover:to-teal-50
                   hover:shadow-xl hover:scale-105
                   transition-all duration-500 ease-out
                   shadow-sm border border-teal-100 cursor-pointer"
            >
              S'inscrire sur Mizan
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
