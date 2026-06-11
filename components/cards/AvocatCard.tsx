// "use client";
// import Link from "next/link";
// import { AvocatData } from "@/types";
// import { MapPin, Star, Scale } from "lucide-react";
// import { getInitials } from "@/lib/utils";
// import Image from "next/image";

// interface AvocatCardProps {
//   avocat: AvocatData;
//   searchParams?: any;
// }

// export function AvocatCard({ avocat, searchParams }: AvocatCardProps) {
//   const getProfileUrl = () => {
//     const params = searchParams?.toString();
//     return `/lawyers/${avocat.id}${params ? `?${params}` : ""}`;
//   };

//   const specialites = avocat.specialites || [];
//   const autresSpecialites = specialites.length > 1 ? specialites.length - 1 : 0;

//   const hasGoogleRating =
//     avocat.rating_google && (avocat.reviews_count_google ?? 0) > 0;
//   const hasMizanRating =
//     avocat.rating_mizan && (avocat.reviews_count_mizan ?? 0) > 0;

//   return (
//     <Link href={getProfileUrl()} className="h-full">
//       {/* MOBILE : centré */}
//       <div className="sm:hidden h-full bg-white border border-slate-200 rounded-xl p-3 cursor-pointer transition-all duration-200 hover:border-slate-300 hover:-translate-y-1 hover:shadow-md flex flex-col items-center text-center">
//         <div className="w-16 h-16 rounded-full mb-2 flex-shrink-0 overflow-hidden bg-teal-100 flex items-center justify-center font-medium text-base text-teal-700">
//           {avocat.avatar_url ? (
//             <img
//               src={avocat.avatar_url}
//               alt={`${avocat.prenom} ${avocat.nom}`}
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             getInitials(avocat.prenom, avocat.nom)
//           )}
//         </div>

//         <div className="text-[13px] font-medium text-slate-800 mb-1 w-full truncate">
//           {avocat.prenom} {avocat.nom}
//         </div>

//         <div className="flex items-center justify-center gap-1.5 mb-1 w-full">
//           <span className="text-[11px] text-slate-500 truncate">
//             {specialites[0] || "Avocat"}
//           </span>
//           {autresSpecialites > 0 && (
//             <span className="flex-shrink-0 bg-teal-100 text-teal-700 text-[10px] font-medium px-1.5 py-0.5 rounded">
//               +{autresSpecialites}
//             </span>
//           )}
//         </div>

//         <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 mb-2 w-full">
//           <MapPin className="w-3 h-3 flex-shrink-0" />
//           <span className="truncate">{avocat.wilaya}</span>
//         </div>

//         <div className="mt-auto space-y-1 w-full">
//           {hasGoogleRating && (
//             <div className="flex items-center justify-center gap-1 text-[11px]">
//               <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
//               <span className="font-medium text-slate-800">
//                 {avocat.rating_google!.toFixed(1)}
//               </span>
//               <Image
//                 src="/google.png"
//                 alt="Google"
//                 width={11}
//                 height={11}
//                 className="flex-shrink-0"
//               />
//               <span className="text-slate-500">
//                 ({avocat.reviews_count_google})
//               </span>
//             </div>
//           )}
//           {hasMizanRating && (
//             <div className="flex items-center justify-center gap-1 text-[11px]">
//               <Star className="w-3 h-3 fill-teal-500 text-teal-500 flex-shrink-0" />
//               <span className="font-medium text-slate-800">
//                 {avocat.rating_mizan!.toFixed(1)}
//               </span>
//               <Scale className="w-3 h-3 text-teal-600 flex-shrink-0" />
//               <span className="text-slate-500">
//                 ({avocat.reviews_count_mizan})
//               </span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* DESKTOP : gauche */}
//       <div className="hidden sm:flex h-full bg-white border border-slate-200 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-slate-300 hover:-translate-y-1 hover:shadow-md flex-col">
//         <div className="relative w-12 h-12 mb-3 flex-shrink-0">
//           {avocat.avatar_url ? (
//             <img
//               src={avocat.avatar_url}
//               alt={`${avocat.prenom} ${avocat.nom}`}
//               className="w-full h-full rounded-full object-cover border-2 border-teal-100"
//             />
//           ) : (
//             <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center font-medium text-base text-teal-700">
//               {getInitials(avocat.prenom, avocat.nom)}
//             </div>
//           )}
//         </div>

//         <div className="text-[15px] font-medium text-slate-800 mb-1 truncate flex-shrink-0">
//           {avocat.prenom} {avocat.nom}
//         </div>

//         <div className="flex items-center gap-1.5 mb-2 min-h-[20px] flex-shrink-0">
//           <div className="text-xs text-slate-600 truncate flex-1">
//             {specialites[0] || "Avocat"}
//           </div>
//           {autresSpecialites > 0 && (
//             <div className="flex-shrink-0 bg-teal-100 text-teal-700 text-[10px] font-medium px-1.5 py-0.5 rounded">
//               +{autresSpecialites}
//             </div>
//           )}
//         </div>

//         <div className="flex items-center gap-1 text-xs text-slate-500 mb-2 flex-shrink-0">
//           <MapPin className="w-3 h-3 flex-shrink-0" />
//           <span className="truncate">{avocat.wilaya}</span>
//         </div>

//         <div className="mt-auto space-y-1 h-[44px]">
//           {hasGoogleRating && (
//             <div className="flex items-center gap-1 text-[12px]">
//               <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
//               <span className="font-medium text-slate-800">
//                 {avocat.rating_google!.toFixed(1)}
//               </span>
//               <Image
//                 src="/google.png"
//                 alt="Google"
//                 width={12}
//                 height={12}
//                 className="flex-shrink-0"
//               />
//               <span className="text-slate-500">
//                 ({avocat.reviews_count_google})
//               </span>
//             </div>
//           )}
//           {hasMizanRating && (
//             <div className="flex items-center gap-1 text-[12px]">
//               <Star className="w-3 h-3 fill-teal-500 text-teal-500 flex-shrink-0" />
//               <span className="font-medium text-slate-800">
//                 {avocat.rating_mizan!.toFixed(1)}
//               </span>
//               <Scale className="w-3 h-3 text-teal-600 flex-shrink-0" />
//               <span className="text-slate-500">
//                 ({avocat.reviews_count_mizan})
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
//     </Link>
//   );
// }

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

function PriceBadge({ price }: { price: number | null | undefined }) {
  if (!price)
    return (
      <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
        Sur demande
      </span>
    );
  return (
    <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
      dès {price.toLocaleString("fr-DZ")} DA
    </span>
  );
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
      {/* ── MOBILE ── */}
      <div className="sm:hidden h-full bg-white border border-slate-200 rounded-xl p-3 cursor-pointer transition-all duration-200 hover:border-slate-300 hover:-translate-y-1 hover:shadow-md flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full mb-2 flex-shrink-0 overflow-hidden bg-teal-100 flex items-center justify-center font-medium text-base text-teal-700">
          {avocat.avatar_url ? (
            <img
              src={avocat.avatar_url}
              alt={`${avocat.prenom} ${avocat.nom}`}
              className="w-full h-full object-cover"
            />
          ) : (
            getInitials(avocat.prenom, avocat.nom)
          )}
        </div>
        <div className="text-[13px] font-medium text-slate-800 mb-1 w-full truncate">
          {avocat.prenom} {avocat.nom}
        </div>
        <div className="flex items-center justify-center gap-1.5 mb-1 w-full">
          <span className="text-[11px] text-slate-500 truncate">
            {specialites[0] || "Avocat"}
          </span>
          {autresSpecialites > 0 && (
            <span className="flex-shrink-0 bg-teal-100 text-teal-700 text-[10px] font-medium px-1.5 py-0.5 rounded">
              +{autresSpecialites}
            </span>
          )}
        </div>
        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 mb-2 w-full">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{avocat.wilaya}</span>
        </div>
        <div className="mb-2">
          <PriceBadge price={avocat.consultation_price} />
        </div>
        <div className="mt-auto space-y-1 w-full">
          {hasGoogleRating && (
            <div className="flex items-center justify-center gap-1 text-[11px]">
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
            <div className="flex items-center justify-center gap-1 text-[11px]">
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

      {/* ── DESKTOP ── */}
      <div className="hidden sm:flex h-full bg-white border border-slate-200 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-slate-300 hover:-translate-y-1 hover:shadow-md flex-col">
        <div className="relative w-12 h-12 mb-3 flex-shrink-0">
          {avocat.avatar_url ? (
            <img
              src={avocat.avatar_url}
              alt={`${avocat.prenom} ${avocat.nom}`}
              className="w-full h-full rounded-full object-cover border-2 border-teal-100"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center font-medium text-base text-teal-700">
              {getInitials(avocat.prenom, avocat.nom)}
            </div>
          )}
        </div>
        <div className="text-[15px] font-medium text-slate-800 mb-1 truncate flex-shrink-0">
          {avocat.prenom} {avocat.nom}
        </div>
        <div className="flex items-center gap-1.5 mb-1.5 min-h-[20px] flex-shrink-0">
          <div className="text-xs text-slate-600 truncate flex-1">
            {specialites[0] || "Avocat"}
          </div>
          {autresSpecialites > 0 && (
            <div className="flex-shrink-0 bg-teal-100 text-teal-700 text-[10px] font-medium px-1.5 py-0.5 rounded">
              +{autresSpecialites}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500 mb-2 flex-shrink-0">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{avocat.wilaya}</span>
        </div>
        {/* Prix */}
        <div className="mb-2 flex-shrink-0">
          <PriceBadge price={avocat.consultation_price} />
        </div>
        <div className="mt-auto space-y-1 h-[44px]">
          {hasGoogleRating && (
            <div className="flex items-center gap-1 text-[12px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
              <span className="font-medium text-slate-800">
                {avocat.rating_google!.toFixed(1)}
              </span>
              <Image
                src="/google.png"
                alt="Google"
                width={12}
                height={12}
                className="flex-shrink-0"
              />
              <span className="text-slate-500">
                ({avocat.reviews_count_google})
              </span>
            </div>
          )}
          {hasMizanRating && (
            <div className="flex items-center gap-1 text-[12px]">
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
