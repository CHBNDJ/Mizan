"use client";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getSpecialiteLabel, getWilayaLabel } from "@/lib/i18nLabels";
import { AvocatData } from "@/types";
import { MapPin, Star, Scale } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface AvocatCardProps {
  avocat: AvocatData;
  searchParams?: any;
}

export function AvocatCard({ avocat, searchParams }: AvocatCardProps) {
  const t = useTranslations();

  const getProfileUrl = () => {
    const params = searchParams?.toString();
    const identifier = avocat.slug || avocat.id;
    return `/lawyers/${identifier}${params ? `?${params}` : ""}`;
  };

  const specialites = avocat.specialites || [];
  const autresSpecialites = specialites.length > 1 ? specialites.length - 1 : 0;
  const hasGoogleRating =
    avocat.rating_google && (avocat.reviews_count_google ?? 0) > 0;
  const hasMizanRating =
    avocat.rating_mizan && (avocat.reviews_count_mizan ?? 0) > 0;
  const isAvailableNow = !!avocat.available_now;

  return (
    <Link href={getProfileUrl()} className="h-full">
      <div className="sm:hidden h-full bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-xl p-3 cursor-pointer transition-all duration-200 hover:border-slate-300 hover:-translate-y-1 hover:shadow-md flex flex-col items-center text-center">
        <div className="relative w-16 h-16 mb-2 flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-teal-100 dark:bg-[#1F3D2E] flex items-center justify-center font-medium text-base text-teal-700 dark:text-[#6fcf9f]">
            {avocat.avatar_url ? (
              <Image
                src={avocat.avatar_url}
                alt={`${avocat.prenom} ${avocat.nom}`}
                fill
                className="rounded-full object-cover"
                sizes="64px"
              />
            ) : (
              getInitials(avocat.prenom, avocat.nom)
            )}
          </div>
          {isAvailableNow && (
            <span className="absolute bottom-0 end-0 w-3.5 h-3.5 rounded-full bg-teal-500 dark:bg-[#6fcf9f] border-2 border-white dark:border-[#1c1c1e]" />
          )}
        </div>
        <div className="text-[13px] font-medium text-slate-800 dark:text-[#F5F5F4] mb-1 w-full truncate">
          {avocat.prenom} {avocat.nom}
        </div>
        <div className="flex items-center justify-center gap-1.5 mb-1 w-full">
          <span className="text-[11px] text-slate-500 dark:text-[#A8A8A6] truncate">
            {specialites[0]
              ? getSpecialiteLabel(specialites[0], t)
              : t("professions.avocat.label")}
          </span>
          {autresSpecialites > 0 && (
            <span className="flex-shrink-0 bg-teal-100 dark:bg-[#1F3D2E] text-teal-700 dark:text-[#6fcf9f] text-[10px] font-medium px-1.5 py-0.5 rounded">
              +{autresSpecialites}
            </span>
          )}
        </div>
        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-[#A8A8A6] mb-2 w-full">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{getWilayaLabel(avocat.wilaya, t)}</span>
        </div>
        <div className="mt-auto space-y-1 w-full">
          {hasGoogleRating && (
            <div className="flex items-center justify-center gap-1 text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
              <span className="font-medium text-slate-800 dark:text-[#F5F5F4]">
                {avocat.rating_google!.toFixed(1)}
              </span>
              <Image
                src="/google.png"
                alt="Google"
                width={11}
                height={11}
                className="flex-shrink-0"
              />
              <span className="text-slate-500 dark:text-[#A8A8A6]">
                ({avocat.reviews_count_google})
              </span>
            </div>
          )}
          {hasMizanRating && (
            <div className="flex items-center justify-center gap-1 text-[11px]">
              <Star className="w-3 h-3 fill-teal-500 text-teal-500 flex-shrink-0" />
              <span className="font-medium text-slate-800 dark:text-[#F5F5F4]">
                {avocat.rating_mizan!.toFixed(1)}
              </span>
              <Scale className="w-3 h-3 text-teal-600 dark:text-[#6fcf9f] flex-shrink-0" />
              <span className="text-slate-500 dark:text-[#A8A8A6]">
                ({avocat.reviews_count_mizan})
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="hidden sm:flex h-full bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-slate-300 hover:-translate-y-1 hover:shadow-md flex-col">
        <div className="relative w-12 h-12 mb-3 flex-shrink-0">
          {avocat.avatar_url ? (
            <Image
              src={avocat.avatar_url}
              alt={`${avocat.prenom} ${avocat.nom}`}
              fill
              className="rounded-full object-cover border-2 border-teal-100 dark:border-[#1F3D2E]"
              sizes="48px"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-[#1F3D2E] flex items-center justify-center font-medium text-base text-teal-700 dark:text-[#6fcf9f]">
              {getInitials(avocat.prenom, avocat.nom)}
            </div>
          )}
          {isAvailableNow && (
            <span className="absolute bottom-0 end-0 w-3.5 h-3.5 rounded-full bg-teal-500 dark:bg-[#6fcf9f] border-2 border-white dark:border-[#1c1c1e]" />
          )}
        </div>
        <div className="text-[15px] font-medium text-slate-800 dark:text-[#F5F5F4] mb-1 truncate flex-shrink-0">
          {avocat.prenom} {avocat.nom}
        </div>
        <div className="flex items-center gap-1.5 mb-2 min-h-[20px] flex-shrink-0">
          <div className="text-xs text-slate-600 dark:text-[#E8E8E6] truncate flex-1">
            {specialites[0]
              ? getSpecialiteLabel(specialites[0], t)
              : t("professions.avocat.label")}
          </div>
          {autresSpecialites > 0 && (
            <div className="flex-shrink-0 bg-teal-100 dark:bg-[#1F3D2E] text-teal-700 dark:text-[#6fcf9f] text-[10px] font-medium px-1.5 py-0.5 rounded">
              +{autresSpecialites}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-[#A8A8A6] mb-2 flex-shrink-0">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{getWilayaLabel(avocat.wilaya, t)}</span>
        </div>
        <div className="mt-auto space-y-1 h-[44px]">
          {hasGoogleRating && (
            <div className="flex items-center gap-1 text-[12px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
              <span className="font-medium text-slate-800 dark:text-[#F5F5F4]">
                {avocat.rating_google!.toFixed(1)}
              </span>
              <Image
                src="/google.png"
                alt="Google"
                width={12}
                height={12}
                className="flex-shrink-0"
              />
              <span className="text-slate-500 dark:text-[#A8A8A6]">
                ({avocat.reviews_count_google})
              </span>
            </div>
          )}
          {hasMizanRating && (
            <div className="flex items-center gap-1 text-[12px]">
              <Star className="w-3 h-3 fill-teal-500 text-teal-500 flex-shrink-0" />
              <span className="font-medium text-slate-800 dark:text-[#F5F5F4]">
                {avocat.rating_mizan!.toFixed(1)}
              </span>
              <Scale className="w-3 h-3 text-teal-600 dark:text-[#6fcf9f] flex-shrink-0" />
              <span className="text-slate-500 dark:text-[#A8A8A6]">
                ({avocat.reviews_count_mizan})
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
