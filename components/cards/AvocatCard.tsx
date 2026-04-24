"use client";
import Link from "next/link";
import { AvocatData } from "@/types";
import { MapPin, Star, Scale } from "lucide-react";
import { getInitials } from "@/lib/utils";
import Image from "next/image";

interface AvocatCardProps {
  avocat: AvocatData;
  searchParams?: any;
}

export function AvocatCard({ avocat, searchParams }: AvocatCardProps) {
  const getProfileUrl = () => {
    const params = searchParams?.toString();
    return `/lawyers/${avocat.id}${params ? `?${params}` : ""}`;
  };

  const specialites = avocat.specialites || [];
  const autresSpecialites = specialites.length > 1 ? specialites.length - 1 : 0;

  const hasGoogleRating =
    avocat.rating_google && (avocat.reviews_count_google ?? 0) > 0;
  const hasMizanRating =
    avocat.rating_mizan && (avocat.reviews_count_mizan ?? 0) > 0;

  return (
    <Link href={getProfileUrl()} className="h-full">
      <div className="h-full bg-white border border-slate-200 rounded-xl p-3.5 cursor-pointer transition-all duration-200 hover:border-slate-300 hover:-translate-y-1 hover:shadow-md flex flex-col">
        <div className="flex items-center gap-2.5 mb-2.5 flex-shrink-0">
          {avocat.avatar_url ? (
            <img
              src={avocat.avatar_url}
              alt={`${avocat.prenom} ${avocat.nom}`}
              className="w-9 h-9 rounded-full object-cover border-2 border-teal-100 flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center font-medium text-sm text-teal-700 flex-shrink-0">
              {getInitials(avocat.prenom, avocat.nom)}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-sm font-medium text-slate-800 truncate">
              {avocat.prenom} {avocat.nom}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{avocat.wilaya}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-3 flex-shrink-0">
          <div className="text-xs text-slate-600 truncate flex-1">
            {specialites[0] || "Avocat"}
          </div>
          {autresSpecialites > 0 && (
            <div className="flex-shrink-0 bg-teal-100 text-teal-700 text-[10px] font-medium px-1.5 py-0.5 rounded">
              +{autresSpecialites}
            </div>
          )}
        </div>

        <div className="mt-auto space-y-1 h-[38px] flex flex-col justify-end">
          {hasGoogleRating && (
            <div className="flex items-center gap-1 text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
              <span className="font-medium text-slate-800">
                {avocat.rating_google!.toFixed(1)}
              </span>
              <Image
                src="/google.png"
                alt="Google"
                width={11}
                height={11}
                className="flex-shrink-0"
              />
              <span className="text-slate-500">
                ({avocat.reviews_count_google})
              </span>
            </div>
          )}
          {hasMizanRating && (
            <div className="flex items-center gap-1 text-[11px]">
              <Star className="w-3 h-3 fill-teal-500 text-teal-500 flex-shrink-0" />
              <span className="font-medium text-slate-800">
                {avocat.rating_mizan!.toFixed(1)}
              </span>
              <Scale className="w-3 h-3 text-teal-600 flex-shrink-0" />
              <span className="text-slate-500">
                ({avocat.reviews_count_mizan})
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
