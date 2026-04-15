// "use client";
// import Link from "next/link";
// import { Star, MapPin, CheckCircle } from "lucide-react";
// import Image from "next/image";
// import { getInitials } from "@/lib/utils";
// import { AvocatCardProps } from "@/types";
// import { formatPrice, calculateConsultationPrice } from "@/lib/priceUtils";

// export function AvocatCard({ avocat, searchParams }: AvocatCardProps) {
//   const tarifEstime = calculateConsultationPrice(
//     avocat.consultation_price,
//     avocat.experience?.annees || 0,
//     avocat.rating_google || avocat.rating_mizan
//   );

//   const getProfileUrl = () => {
//     const params = searchParams?.toString();
//     return `/lawyers/${avocat.id}${params ? `?${params}` : ""}`;
//   };

//   return (
//     <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-teal-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden group min-h-[450px] h-full flex flex-col">
//       <div className="bg-transparent p-6 text-center border-b border-slate-100 flex-shrink-0">
//         <div className="w-20 h-20 mx-auto mb-4">
//           {avocat.avatar_url ? (
//             <img
//               src={avocat.avatar_url}
//               alt={`${avocat.prenom} ${avocat.nom}`}
//               className="w-full h-full rounded-full object-cover border-2 border-teal-600 group-hover:border-teal-700 transition-colors shadow-md"
//             />
//           ) : (
//             <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-teal-700 font-bold text-xl border-2 border-teal-600 group-hover:border-teal-700 transition-colors">
//               {getInitials(avocat.prenom, avocat.nom)}
//             </div>
//           )}
//         </div>

//         <h3 className="font-bold text-xl text-slate-800 mb-2 h-14 flex items-center justify-center leading-tight">
//           <span className="line-clamp-2 text-center">
//             {avocat.prenom
//               ? `${avocat.titre} ${avocat.prenom} ${avocat.nom}`
//               : `${avocat.titre} ${avocat.nom}`}
//           </span>
//         </h3>

//         <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-3 h-6">
//           <MapPin className="w-4 h-4 flex-shrink-0" />
//           <span className="truncate">
//             {avocat.ville}, {avocat.wilaya}
//           </span>
//         </div>

//         <div className="flex flex-col items-center gap-2 min-h-[60px]">
//           {(avocat.rating_google && (avocat.reviews_count_google ?? 0) > 0) ||
//           (avocat.rating_mizan && (avocat.reviews_count_mizan ?? 0) > 0) ? (
//             <>
//               {avocat.rating_google &&
//                 (avocat.reviews_count_google ?? 0) > 0 && (
//                   <div className="flex items-center gap-1.5">
//                     <div className="flex items-center">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`w-3.5 h-3.5 ${
//                             i < Math.floor(avocat.rating_google!)
//                               ? "text-yellow-400 fill-current"
//                               : "text-slate-300"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                     <Image
//                       src="/google.png"
//                       alt="Google"
//                       width={14}
//                       height={14}
//                       className="ml-0.5"
//                     />
//                     <span className="text-xs text-slate-600 font-medium">
//                       {avocat.rating_google.toFixed(1)}
//                     </span>
//                     <span className="text-xs text-slate-500">
//                       ({avocat.reviews_count_google})
//                     </span>
//                   </div>
//                 )}

//               {avocat.rating_mizan && (avocat.reviews_count_mizan ?? 0) > 0 && (
//                 <div className="flex items-center gap-1.5">
//                   <div className="flex items-center">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className={`w-3.5 h-3.5 ${
//                           i < Math.floor(avocat.rating_mizan!)
//                             ? "text-teal-500 fill-current"
//                             : "text-slate-300"
//                         }`}
//                       />
//                     ))}
//                   </div>
//                   <svg
//                     className="w-3.5 h-3.5 text-teal-600 fill-current ml-0.5"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
//                   </svg>
//                   <span className="text-xs text-slate-600 font-medium">
//                     {avocat.rating_mizan.toFixed(1)}
//                   </span>
//                   <span className="text-xs text-slate-500">
//                     ({avocat.reviews_count_mizan})
//                   </span>
//                 </div>
//               )}
//             </>
//           ) : (
//             <span className="text-sm text-slate-400">Pas d'avis</span>
//           )}

//           {avocat.verified && (
//             <div className="flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
//               <CheckCircle className="w-3 h-3" />
//               <span>Vérifié</span>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="p-6 flex flex-col flex-grow">
//         <div className="mb-8 flex-grow flex items-center">
//           {avocat.specialites && avocat.specialites.length > 0 ? (
//             <div className="flex flex-wrap gap-2 justify-center content-center w-full">
//               {avocat.specialites
//                 .slice(0, 5)
//                 .map((spec: string, index: number) => (
//                   <span
//                     key={index}
//                     className="px-3 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium text-center"
//                     title={spec}
//                   >
//                     {spec.length > 22 ? `${spec.slice(0, 22)}...` : spec}
//                   </span>
//                 ))}
//               {avocat.specialites.length > 5 && (
//                 <span className="px-3 py-2 bg-slate-100 text-slate-600 rounded-full text-sm">
//                   +{avocat.specialites.length - 5}
//                 </span>
//               )}
//             </div>
//           ) : (
//             <div className="w-full text-center text-slate-400 text-sm">
//               Spécialités non précisées
//             </div>
//           )}
//         </div>

//         <div className="text-center mt-auto flex-shrink-0">
//           <div className="mb-4">
//             <div className="text-3xl font-bold text-teal-600 mb-1">
//               {formatPrice(tarifEstime)}
//             </div>
//             <div className="text-sm text-slate-500">
//               {avocat.consultation_price ? "Tarif consultation" : "Estimation"}
//             </div>
//           </div>

//           <Link href={getProfileUrl()}>
//             <button className="w-full bg-teal-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/25 uppercase tracking-wide text-sm cursor-pointer">
//               Consulter le profil
//             </button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import Link from "next/link";
import { AvocatData } from "@/types";
import { MapPin, Star } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface AvocatCardProps {
  avocat: AvocatData;
  searchParams?: any;
}

export function AvocatCard({ avocat, searchParams }: AvocatCardProps) {
  const getProfileUrl = () => {
    const params = searchParams?.toString();
    return `/lawyers/${avocat.id}${params ? `?${params}` : ""}`;
  };

  const rating = avocat.rating_google || avocat.rating_mizan || 0;
  const specialites = avocat.specialites || [];
  const autresSpecialites = specialites.length > 1 ? specialites.length - 1 : 0;

  return (
    <Link href={getProfileUrl()}>
      <div className="bg-white border border-slate-200 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-slate-300 hover:-translate-y-1 hover:shadow-md">
        <div className="relative w-12 h-12 mb-3">
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

        <div className="text-[15px] font-medium text-slate-800 mb-1 truncate">
          {avocat.prenom} {avocat.nom}
        </div>

        <div className="flex items-center gap-1.5 mb-2 min-h-[20px]">
          <div className="text-xs text-slate-600 truncate flex-1">
            {specialites[0] || "Avocat"}
          </div>
          {autresSpecialites > 0 && (
            <div className="flex-shrink-0 bg-teal-100 text-teal-700 text-[10px] font-medium px-1.5 py-0.5 rounded">
              +{autresSpecialites}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{avocat.wilaya}</span>
        </div>

        {rating > 0 && (
          <div className="flex items-center gap-1 text-[13px] font-medium text-slate-800">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
