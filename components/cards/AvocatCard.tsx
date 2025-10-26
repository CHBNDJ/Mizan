"use client";
import Link from "next/link";
import { Star, MapPin, CheckCircle } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { AvocatCardProps } from "@/types";
import { formatPrice, calculateConsultationPrice } from "@/lib/priceUtils";

export function AvocatCard({ avocat, searchParams }: AvocatCardProps) {
  const experienceAnnees = avocat.experience?.annees || 0;
  const basePrice = 3000 + experienceAnnees * 200;
  const ratingBonus = avocat.rating ? avocat.rating * 500 : 0;
  const tarifEstime = calculateConsultationPrice(
    avocat.consultation_price,
    avocat.experience?.annees || 0,
    avocat.rating
  );

  const getProfileUrl = () => {
    const params = searchParams?.toString();
    return `/lawyers/${avocat.id}${params ? `?${params}` : ""}`;
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-teal-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden group min-h-[450px] h-full flex flex-col">
      <div className="bg-transparent p-6 text-center border-b border-slate-100 flex-shrink-0">
        <div className="w-20 h-20 mx-auto mb-4">
          {avocat.avatar_url ? (
            <img
              src={avocat.avatar_url}
              alt={`${avocat.prenom} ${avocat.nom}`}
              className="w-full h-full rounded-full object-cover border-2 border-teal-600 group-hover:border-teal-700 transition-colors shadow-md"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-teal-700 font-bold text-xl border-2 border-teal-600 group-hover:border-teal-700 transition-colors">
              {getInitials(avocat.prenom, avocat.nom)}
            </div>
          )}
        </div>

        <h3 className="font-bold text-xl text-slate-800 mb-2 h-14 flex items-center justify-center leading-tight">
          <span className="line-clamp-2 text-center">
            {avocat.prenom
              ? `${avocat.titre} ${avocat.prenom} ${avocat.nom}`
              : `${avocat.titre} ${avocat.nom}`}
          </span>
        </h3>

        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-3 h-6">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">
            {avocat.ville}, {avocat.wilaya}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 h-8">
          {avocat.rating && avocat.reviews_count ? (
            <>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(avocat.rating!)
                        ? "text-amber-400 fill-current"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-600">
                ({avocat.reviews_count})
              </span>
            </>
          ) : (
            <span className="text-sm text-slate-400">Pas d'avis</span>
          )}

          {avocat.verified && (
            <div className="flex items-center gap-1 ml-3 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
              <CheckCircle className="w-3 h-3" />
              <span>Vérifié</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-8 flex-grow flex items-center">
          {avocat.specialites && avocat.specialites.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center content-center w-full">
              {avocat.specialites
                .slice(0, 5)
                .map((spec: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium text-center"
                    title={spec}
                  >
                    {spec.length > 22 ? `${spec.slice(0, 22)}...` : spec}
                  </span>
                ))}
              {avocat.specialites.length > 5 && (
                <span className="px-3 py-2 bg-slate-100 text-slate-600 rounded-full text-sm">
                  +{avocat.specialites.length - 5}
                </span>
              )}
            </div>
          ) : (
            <div className="w-full text-center text-slate-400 text-sm">
              Spécialités non précisées
            </div>
          )}
        </div>

        <div className="text-center mt-auto flex-shrink-0">
          <div className="mb-4">
            <div className="text-3xl font-bold text-teal-600 mb-1">
              {formatPrice(tarifEstime)}
            </div>
            <div className="text-sm text-slate-500">
              {avocat.consultation_price ? "Tarif consultation" : "Estimation"}
            </div>
          </div>

          <Link href={getProfileUrl()}>
            <button className="w-full bg-teal-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/25 uppercase tracking-wide text-sm cursor-pointer">
              Consulter le profil
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
