// "use client";
// import React, { use, useState, useEffect } from "react";
// import { notFound, useRouter, useSearchParams } from "next/navigation";
// import {
//   ArrowLeft,
//   MapPin,
//   Phone,
//   Globe,
//   Star,
//   CheckCircle,
//   Calendar,
//   Languages,
//   Briefcase,
//   MessageCircle,
//   Mail,
//   Smartphone,
//   Scale,
// } from "lucide-react";
// import { Card, CardContent, CardHeader } from "@/components/ui/Card";
// import { getAvocatById } from "@/lib/avocatsData";
// import { getInitials } from "@/lib/utils";
// import { AvocatData, ProfilePageProps } from "@/types";
// import { createClient } from "@/lib/supabase/client";
// import ConsultationModal from "@/components/consultation/ConsultationModal";
// import ReviewSection from "@/components/reviews/ReviewSection";
// import Link from "next/link";
// import { formatPhoneNumber } from "@/lib/phoneFormatter";
// import FeedbackPopup from "@/components/FeedbackPopup";
// import { useAuth } from "@/hooks/useAuth";
// import { formatPrice, calculateConsultationPrice } from "@/lib/priceUtils";
// import Image from "next/image";
// import { toCivilite } from "@/lib/genderUtils";

// export default function ProfilePage({ params }: ProfilePageProps) {
//   const { id } = use(params);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { user, profile } = useAuth();
//   const [avocat, setAvocat] = useState<AvocatData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
//   const supabase = createClient();
//   const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

//   const isOwnProfile = user?.id === avocat?.id;

//   const handleConsultationSuccess = () => {
//     setTimeout(() => {
//       setShowFeedbackPopup(true);
//     }, 3000);
//   };

//   useEffect(() => {
//     const loadAvocat = async () => {
//       try {
//         const avocatData = await getAvocatById(id);
//         setAvocat(avocatData);
//       } catch (error) {
//         console.error("Erreur chargement avocat:", error);
//         setAvocat(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadAvocat();
//   }, [id]);

//   useEffect(() => {
//     if (!avocat?.id) return;

//     const trackProfileView = async () => {
//       try {
//         const ipResponse = await fetch("https://api.ipify.org?format=json");
//         const { ip } = await ipResponse.json();

//         const { error } = await supabase.from("profile_views").insert({
//           lawyer_id: avocat.id,
//           viewer_id: null,
//           viewer_ip: ip,
//         });

//         if (error && !error.message.includes("duplicate")) {
//           console.error("Erreur tracking vue profil:", error);
//         }
//       } catch (error) {
//         console.error("Erreur tracking vue profil:", error);
//       }
//     };

//     trackProfileView();
//   }, [avocat?.id]);

//   const parsePhoneNumbers = (phoneString: string): string[] => {
//     if (!phoneString) return [];
//     return phoneString
//       .split(",")
//       .map((num) => num.trim())
//       .filter((num) => num.length > 0);
//   };

//   const reloadAvocatData = async () => {
//     try {
//       console.log("🔄 Rechargement des données avocat...");

//       // ✅ Attendre un peu (au cas où)
//       await new Promise((resolve) => setTimeout(resolve, 500));

//       // ✅ Forcer un refetch complet
//       const avocatData = await getAvocatById(id);

//       if (avocatData) {
//         console.log("✅ Nouvelles données reçues:", {
//           rating_mizan: avocatData.rating_mizan,
//           reviews_count_mizan: avocatData.reviews_count_mizan,
//           rating: avocatData.rating,
//           reviews_count: avocatData.reviews_count,
//         });

//         setAvocat(avocatData);
//       } else {
//         console.error("❌ Aucune donnée reçue");
//       }
//     } catch (error) {
//       console.error("❌ Erreur rechargement avocat:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen pt-24 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
//       </div>
//     );
//   }

//   if (!avocat) notFound();

//   const handleBackToResults = () => {
//     const backUrl = `/search?${searchParams.toString()}`;
//     router.push(backUrl);
//   };

//   const experienceAnnees = avocat.experience?.annees || 0;
//   const tarifEstime = calculateConsultationPrice(
//     avocat.consultation_price,
//     avocat.experience?.annees || 0,
//     avocat.rating
//   );

//   return (
//     <div className="min-h-screen pt-24 bg-gradient-to-br from-teal-100 via-white to-teal-100">
//       <div>
//         <div className="max-w-4xl mx-auto px-4 py-6">
//           <div className="flex items-center mb-4">
//             <button
//               onClick={handleBackToResults}
//               className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               <span className="hidden sm:inline">Retour aux résultats</span>
//               <span className="sm:hidden">Retour</span>
//             </button>
//           </div>

//           <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
//             <div className="w-24 h-24 mb-4 flex-shrink-0 mx-auto sm:mx-0">
//               {avocat.avatar_url ? (
//                 <img
//                   src={avocat.avatar_url}
//                   alt={`${avocat.prenom} ${avocat.nom}`}
//                   className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
//                 />
//               ) : (
//                 <div className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
//                   {getInitials(avocat.prenom, avocat.nom)}
//                 </div>
//               )}
//             </div>

//             <div className="flex-1">
//               <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
//                 <div>
//                   <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 text-center sm:text-left">
//                     {toCivilite(avocat.genre)} {avocat.prenom} {avocat.nom}
//                   </h1>

//                   <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-slate-600 mb-4 text-center sm:text-left">
//                     <div className="flex items-center gap-1 justify-center sm:justify-start">
//                       <MapPin className="w-4 h-4" />
//                       <span>
//                         {avocat.ville}, {avocat.wilaya}
//                       </span>
//                     </div>
//                     <span className="hidden sm:inline">•</span>
//                     <span>Barreau de {avocat.barreau}</span>
//                   </div>

//          {/* ✅ AFFICHAGE SIMPLIFIÉ DES RATINGS */}
// <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-center sm:text-left mt-4">
//   {(avocat.rating_google && (avocat.reviews_count_google ?? 0) > 0) ||
//    (avocat.rating_mizan && (avocat.reviews_count_mizan ?? 0) > 0) ? (
//     <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//       {/* Note Google */}
//       {avocat.rating_google && (avocat.reviews_count_google ?? 0) > 0 && (
//         <div className="flex items-center justify-center sm:justify-start gap-2 text-yellow-500">
//           <Star className="w-5 h-5 fill-current" />
//           <span className="font-semibold text-lg">{avocat.rating_google.toFixed(1)}</span>
//           <Image
//             src="/google.png"
//             alt="Google"
//             width={18}
//             height={18}
//             className="ml-1"
//           />
//           <span className="text-sm text-slate-500">
//             ({avocat.reviews_count_google} avis)
//           </span>
//         </div>
//       )}

//       {/* Séparateur */}
//       {avocat.rating_google && (avocat.reviews_count_google ?? 0) > 0 &&
//        avocat.rating_mizan && (avocat.reviews_count_mizan ?? 0) > 0 && (
//         <span className="text-slate-300 hidden sm:inline">•</span>
//       )}

//       {/* Note Mizan */}
//       {avocat.rating_mizan && (avocat.reviews_count_mizan ?? 0) > 0 && (
//         <div className="flex items-center justify-center sm:justify-start gap-2 text-teal-600">
//           <Star className="w-5 h-5 fill-current" />
//           <span className="font-semibold text-lg">{avocat.rating_mizan.toFixed(1)}</span>
//           <svg className="w-4 h-4 ml-1 fill-current" viewBox="0 0 24 24">
//             <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
//           </svg>
//           <span className="text-sm text-slate-500">
//             ({avocat.reviews_count_mizan} avis)
//           </span>
//         </div>
//       )}
//     </div>
//   ) : null}

//   {/* Badge vérifié */}
//   {avocat.verified && (
//     <div className="flex items-center justify-center sm:justify-start gap-1 text-teal-600 mt-2 sm:mt-0">
//       <CheckCircle className="w-5 h-5" />
//       <span className="font-medium">Vérifié</span>
//     </div>
//   )}
// </div>

//                 <div className="text-center sm:text-right mt-4 sm:mt-0">
//                   <div className="text-xl sm:text-2xl font-bold text-teal-600">
//                     {formatPrice(tarifEstime)}
//                   </div>
//                   <div className="text-sm text-slate-500">
//                     {avocat.consultation_price
//                       ? "Tarif consultation"
//                       : "Tarif estimé"}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6">
//             {avocat.specialites && avocat.specialites.length > 0 && (
//               <Card className="transition-all duration-300">
//                 <CardHeader>
//                   <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
//                     <Briefcase className="w-5 h-5" />
//                     Domaines d'expertise
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex flex-wrap gap-2">
//                     {avocat.specialites.map((spec: string, index: number) => (
//                       <span
//                         key={index}
//                         className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium cursor-default"
//                       >
//                         {spec}
//                       </span>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             <Card className="transition-all duration-300">
//               <CardHeader>
//                 <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
//                   <Calendar className="w-5 h-5" />
//                   Expérience professionnelle
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-2 gap-6">
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-teal-600 mb-1">
//                       {experienceAnnees} ans
//                     </div>
//                     <div className="text-slate-600">d'expérience</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-teal-600 mb-1">
//                       {avocat.experience?.date_inscription || "N/A"}
//                     </div>
//                     <div className="text-slate-600">Inscription au barreau</div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {avocat.langues && avocat.langues.length > 0 && (
//               <Card className="transition-all duration-300">
//                 <CardHeader>
//                   <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
//                     <Languages className="w-5 h-5" />
//                     Langues parlées
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex flex-wrap gap-2">
//                     {avocat.langues.map((langue: string, index: number) => (
//                       <span
//                         key={index}
//                         className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
//                       >
//                         {langue}
//                       </span>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             <Card className="transition-all duration-300">
//               <CardHeader>
//                 <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
//                   <MapPin className="w-5 h-5" />
//                   Adresse du cabinet
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-slate-700">
//                   <div className="font-medium">
//                     {avocat.adresse?.rue || "Adresse non spécifiée"}
//                   </div>
//                   {avocat.adresse?.quartier && (
//                     <div className="text-slate-600">
//                       {avocat.adresse.quartier}
//                     </div>
//                   )}
//                   <div className="text-slate-600">
//                     {avocat.adresse?.code_postal || ""}{" "}
//                     {avocat.adresse?.ville || avocat.ville}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="lg:sticky lg:top-24 space-y-6">
//             {user && profile?.id === avocat.id && (
//               <Card className="transition-all duration-300">
//                 <CardHeader>
//                   <div>
//                     <h3 className="text-lg font-semibold text-slate-800">
//                       Contact
//                     </h3>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {avocat.contact?.email && (
//                     <div className="flex items-center gap-3">
//                       <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />

//                       <a
//                         href={`mailto:${avocat.contact.email}`}
//                         className="text-slate-700 hover:text-teal-600 transition-colors break-all"
//                       >
//                         {avocat.contact.email}
//                       </a>
//                     </div>
//                   )}

//                   {avocat.contact?.telephone &&
//                     parsePhoneNumbers(avocat.contact.telephone).length > 0 && (
//                       <div className="space-y-2">
//                         <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
//                           Téléphone fixe
//                         </div>
//                         {parsePhoneNumbers(avocat.contact.telephone).map(
//                           (phone, index) => (
//                             <div
//                               key={index}
//                               className="flex items-center gap-3"
//                             >
//                               <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />

//                               <a
//                                 href={`tel:${phone.replace(/\s/g, "")}`}
//                                 className="text-slate-700 hover:text-teal-600 transition-colors"
//                               >
//                                 {formatPhoneNumber(phone)}
//                               </a>
//                             </div>
//                           )
//                         )}
//                       </div>
//                     )}

//                   {avocat.contact?.mobile &&
//                     parsePhoneNumbers(avocat.contact.mobile).length > 0 && (
//                       <div className="space-y-2">
//                         <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
//                           Mobile
//                         </div>
//                         {parsePhoneNumbers(avocat.contact.mobile).map(
//                           (mobile, index) => (
//                             <div
//                               key={index}
//                               className="flex items-center gap-3"
//                             >
//                               <Smartphone className="w-4 h-4 text-slate-500 flex-shrink-0" />

//                               <a
//                                 href={`tel:${mobile.replace(/\s/g, "")}`}
//                                 className="text-slate-700 hover:text-teal-600 transition-colors"
//                               >
//                                 {formatPhoneNumber(mobile)}
//                               </a>
//                             </div>
//                           )
//                         )}
//                       </div>
//                     )}

//                   {avocat.contact?.site_web && (
//                     <div className="flex items-center gap-3">
//                       <Globe className="w-4 h-4 text-slate-500 flex-shrink-0" />

//                       <a
//                         href={avocat.contact.site_web}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-slate-700 hover:text-teal-600 transition-colors break-all"
//                       >
//                         Voir le site web
//                       </a>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//             {user &&
//               profile?.user_type === "client" &&
//               profile?.id !== avocat.id &&
//               avocat.contact?.site_web && (
//                 <Card className="transition-all duration-300">
//                   <CardHeader>
//                     <div className="text-lg font-semibold text-slate-800">
//                       En savoir plus
//                     </div>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="flex items-center gap-3">
//                       <Globe className="w-4 h-4 text-slate-500 flex-shrink-0" />

//                       <a
//                         href={avocat.contact.site_web}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-slate-700 hover:text-teal-600 transition-colors break-all"
//                       >
//                         Voir le site web
//                       </a>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}

//             {!isOwnProfile && (!user || profile?.user_type !== "client") && (
//               <Card className="bg-white shadow-sm transition-all duration-300">
//                 <CardContent className="p-6 text-center">
//                   <p className="text-slate-700 font-semibold mb-3">
//                     Connectez-vous pour voir les coordonnées
//                   </p>
//                   <Link
//                     href="/auth/client/register"
//                     className="inline-flex items-center gap-2 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100"
//                   >
//                     Créez un compte
//                   </Link>
//                 </CardContent>
//               </Card>
//             )}

//             {!avocat.is_claimed && (
//               <Card className="bg-white shadow-sm transition-all duration-300">
//                 <CardContent className="p-6">
//                   <div className="max-w-2xl mx-auto text-center space-y-2">
//                     <h3 className="font-semibold text-slate-700">
//                       Vous êtes cet avocat ?
//                     </h3>
//                     <div className="pt-2">
//                       <Link
//                         href={`/claim-profile/${avocat.id}`}
//                         className="inline-flex items-center gap-2 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100"
//                       >
//                         Réclamer ce profil
//                       </Link>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {(!user || profile?.user_type === "client") && !isOwnProfile && (
//               <Card className="transition-all duration-300 shadow-sm hover:shadow-md">
//                 <CardContent className="p-4 sm:p-6">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                     <button
//                       onClick={() => setIsConsultationModalOpen(true)}
//                       className="cursor-pointer bg-teal-50 border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6 sm:p-8 rounded-lg flex flex-col items-center gap-3 sm:gap-4 text-center group"
//                     >
//                       <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center transition-colors duration-200">
//                         <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
//                       </div>
//                       <div>
//                         <div className="font-medium text-sm text-slate-700 group-hover:text-teal-700 transition-colors duration-200">
//                           Consultation
//                         </div>
//                         <div className="text-xs text-slate-500 group-hover:text-teal-600 transition-colors duration-200">
//                           Juridique
//                         </div>
//                       </div>
//                     </button>

//                     <button
//                       onClick={() => {
//                         if (!user || profile?.user_type !== "client") {
//                           router.push("/auth/client/register");
//                           return;
//                         }

//                         if (avocat.contact?.mobile) {
//                           const firstMobile = avocat.contact.mobile
//                             .split(",")[0]
//                             .trim();
//                           window.location.href = `tel:${firstMobile.replace(
//                             /\s/g,
//                             ""
//                           )}`;
//                         } else if (avocat.contact?.telephone) {
//                           const firstPhone = avocat.contact.telephone
//                             .split(",")[0]
//                             .trim();
//                           window.location.href = `tel:${firstPhone.replace(
//                             /\s/g,
//                             ""
//                           )}`;
//                         }
//                       }}
//                       className="cursor-pointer bg-teal-50 border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6 sm:p-8 rounded-lg flex flex-col items-center gap-3 sm:gap-4 text-center group"
//                     >
//                       <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center transition-colors duration-200">
//                         <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
//                       </div>
//                       <div>
//                         <div className="font-medium text-sm text-slate-700 group-hover:text-teal-700 transition-colors duration-200">
//                           Contact
//                         </div>
//                         <div className="text-xs text-slate-500 group-hover:text-teal-600 transition-colors duration-200">
//                           Immédiat
//                         </div>
//                       </div>
//                     </button>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>

//         <div className="mt-8">
//           <ReviewSection
//             lawyerId={avocat.id}
//             onReviewSubmitted={reloadAvocatData}
//           />
//         </div>
//       </div>

//       <ConsultationModal
//         isOpen={isConsultationModalOpen}
//         onClose={() => setIsConsultationModalOpen(false)}
//         lawyerId={avocat.id}
//         lawyerName={`${avocat.prenom} ${avocat.nom}`}
//         onSuccess={handleConsultationSuccess}
//       />

//       {showFeedbackPopup && (
//         <FeedbackPopup onClose={() => setShowFeedbackPopup(false)} />
//       )}
//     </div>
//   );
// }

"use client";
import React, { use, useState, useEffect } from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Globe,
  Star,
  CheckCircle,
  Calendar,
  Languages,
  Briefcase,
  MessageCircle,
  Mail,
  Smartphone,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { getAvocatById } from "@/lib/avocatsData";
import { getInitials } from "@/lib/utils";
import { AvocatData, ProfilePageProps } from "@/types";
import { createClient } from "@/lib/supabase/client";
import ConsultationModal from "@/components/consultation/ConsultationModal";
import ReviewSection from "@/components/reviews/ReviewSection";
import Link from "next/link";
import { formatPhoneNumber } from "@/lib/phoneFormatter";
import FeedbackPopup from "@/components/FeedbackPopup";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, calculateConsultationPrice } from "@/lib/priceUtils";
import Image from "next/image";
import { toCivilite } from "@/lib/genderUtils";

export default function ProfilePage({ params }: ProfilePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();
  const [avocat, setAvocat] = useState<AvocatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const supabase = createClient();
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);

  const isOwnProfile = user?.id === avocat?.id;

  const handleConsultationSuccess = () => {
    setTimeout(() => {
      setShowFeedbackPopup(true);
    }, 3000);
  };

  useEffect(() => {
    const loadAvocat = async () => {
      try {
        const avocatData = await getAvocatById(id);
        setAvocat(avocatData);
      } catch (error) {
        console.error("Erreur chargement avocat:", error);
        setAvocat(null);
      } finally {
        setLoading(false);
      }
    };

    loadAvocat();
  }, [id]);

  useEffect(() => {
    if (!avocat?.id) return;

    const trackProfileView = async () => {
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const { ip } = await ipResponse.json();

        const { error } = await supabase.from("profile_views").insert({
          lawyer_id: avocat.id,
          viewer_id: null,
          viewer_ip: ip,
        });

        if (error && !error.message.includes("duplicate")) {
          console.error("Erreur tracking vue profil:", error);
        }
      } catch (error) {
        console.error("Erreur tracking vue profil:", error);
      }
    };

    trackProfileView();
  }, [avocat?.id]);

  const parsePhoneNumbers = (phoneString: string): string[] => {
    if (!phoneString) return [];
    return phoneString
      .split(",")
      .map((num) => num.trim())
      .filter((num) => num.length > 0);
  };

  const reloadAvocatData = async () => {
    try {
      console.log("🔄 Rechargement des données avocat...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      const avocatData = await getAvocatById(id);

      if (avocatData) {
        console.log("✅ Nouvelles données reçues:", {
          rating_mizan: avocatData.rating_mizan,
          reviews_count_mizan: avocatData.reviews_count_mizan,
        });

        setAvocat(avocatData);
      } else {
        console.error("❌ Aucune donnée reçue");
      }
    } catch (error) {
      console.error("❌ Erreur rechargement avocat:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!avocat) notFound();

  const handleBackToResults = () => {
    const backUrl = `/search?${searchParams.toString()}`;
    router.push(backUrl);
  };

  const experienceAnnees = avocat.experience?.annees || 0;
  const tarifEstime = calculateConsultationPrice(
    avocat.consultation_price,
    avocat.experience?.annees || 0,
    avocat.rating_google || avocat.rating_mizan
  );

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <div>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBackToResults}
              className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour aux résultats</span>
              <span className="sm:hidden">Retour</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
            <div className="w-24 h-24 mb-4 flex-shrink-0 mx-auto sm:mx-0">
              {avocat.avatar_url ? (
                <img
                  src={avocat.avatar_url}
                  alt={`${avocat.prenom} ${avocat.nom}`}
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {getInitials(avocat.prenom, avocat.nom)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 text-center sm:text-left">
                    {toCivilite(avocat.genre)} {avocat.prenom} {avocat.nom}
                  </h1>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-slate-600 mb-4 text-center sm:text-left">
                    <div className="flex items-center gap-1 justify-center sm:justify-start">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {avocat.ville}, {avocat.wilaya}
                      </span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <span>Barreau de {avocat.barreau}</span>
                  </div>

                  {/* ✅ AFFICHAGE SIMPLIFIÉ DES RATINGS */}
                  {((avocat.rating_google &&
                    (avocat.reviews_count_google ?? 0) > 0) ||
                    (avocat.rating_mizan &&
                      (avocat.reviews_count_mizan ?? 0) > 0)) && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-center sm:text-left mt-4">
                      {/* Note Google */}
                      {avocat.rating_google &&
                        (avocat.reviews_count_google ?? 0) > 0 && (
                          <div className="flex items-center justify-center sm:justify-start gap-2 text-yellow-500">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="font-semibold text-lg">
                              {avocat.rating_google.toFixed(1)}
                            </span>
                            <Image
                              src="/google.png"
                              alt="Google"
                              width={18}
                              height={18}
                              className="ml-1"
                            />
                            <span className="text-sm text-slate-500">
                              ({avocat.reviews_count_google} avis)
                            </span>
                          </div>
                        )}

                      {/* Séparateur */}
                      {avocat.rating_google &&
                        (avocat.reviews_count_google ?? 0) > 0 &&
                        avocat.rating_mizan &&
                        (avocat.reviews_count_mizan ?? 0) > 0 && (
                          <span className="text-slate-300 hidden sm:inline">
                            •
                          </span>
                        )}

                      {/* Note Mizan */}
                      {avocat.rating_mizan &&
                        (avocat.reviews_count_mizan ?? 0) > 0 && (
                          <div className="flex items-center justify-center sm:justify-start gap-2 text-teal-600">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="font-semibold text-lg">
                              {avocat.rating_mizan.toFixed(1)}
                            </span>
                            <svg
                              className="w-4 h-4 ml-1 fill-current"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                            <span className="text-sm text-slate-500">
                              ({avocat.reviews_count_mizan} avis)
                            </span>
                          </div>
                        )}
                    </div>
                  )}

                  {/* Badge vérifié */}
                  {avocat.verified && (
                    <div className="flex items-center justify-center sm:justify-start gap-1 text-teal-600 mt-3">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Vérifié</span>
                    </div>
                  )}
                </div>

                <div className="text-center sm:text-right mt-4 sm:mt-0">
                  <div className="text-xl sm:text-2xl font-bold text-teal-600">
                    {formatPrice(tarifEstime)}
                  </div>
                  <div className="text-sm text-slate-500">
                    {avocat.consultation_price
                      ? "Tarif consultation"
                      : "Tarif estimé"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {avocat.specialites && avocat.specialites.length > 0 && (
              <Card className="transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                    <Briefcase className="w-5 h-5" />
                    Domaines d'expertise
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {avocat.specialites.map((spec: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium cursor-default"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                  <Calendar className="w-5 h-5" />
                  Expérience professionnelle
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600 mb-1">
                      {experienceAnnees} ans
                    </div>
                    <div className="text-slate-600">d'expérience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600 mb-1">
                      {avocat.experience?.date_inscription || "N/A"}
                    </div>
                    <div className="text-slate-600">Inscription au barreau</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {avocat.langues && avocat.langues.length > 0 && (
              <Card className="transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                    <Languages className="w-5 h-5" />
                    Langues parlées
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {avocat.langues.map((langue: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                      >
                        {langue}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                  <MapPin className="w-5 h-5" />
                  Adresse du cabinet
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-700">
                  <div className="font-medium">
                    {avocat.adresse?.rue || "Adresse non spécifiée"}
                  </div>
                  {avocat.adresse?.quartier && (
                    <div className="text-slate-600">
                      {avocat.adresse.quartier}
                    </div>
                  )}
                  <div className="text-slate-600">
                    {avocat.adresse?.code_postal || ""}{" "}
                    {avocat.adresse?.ville || avocat.ville}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:sticky lg:top-24 space-y-6">
            {user && profile?.id === avocat.id && (
              <Card className="transition-all duration-300">
                <CardHeader>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Contact
                    </h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {avocat.contact?.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />

                      <a
                        href={`mailto:${avocat.contact.email}`}
                        className="text-slate-700 hover:text-teal-600 transition-colors break-all"
                      >
                        {avocat.contact.email}
                      </a>
                    </div>
                  )}

                  {avocat.contact?.telephone &&
                    parsePhoneNumbers(avocat.contact.telephone).length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Téléphone fixe
                        </div>
                        {parsePhoneNumbers(avocat.contact.telephone).map(
                          (phone, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
                              <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />

                              <a
                                href={`tel:${phone.replace(/\s/g, "")}`}
                                className="text-slate-700 hover:text-teal-600 transition-colors"
                              >
                                {formatPhoneNumber(phone)}
                              </a>
                            </div>
                          )
                        )}
                      </div>
                    )}

                  {avocat.contact?.mobile &&
                    parsePhoneNumbers(avocat.contact.mobile).length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Mobile
                        </div>
                        {parsePhoneNumbers(avocat.contact.mobile).map(
                          (mobile, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
                              <Smartphone className="w-4 h-4 text-slate-500 flex-shrink-0" />

                              <a
                                href={`tel:${mobile.replace(/\s/g, "")}`}
                                className="text-slate-700 hover:text-teal-600 transition-colors"
                              >
                                {formatPhoneNumber(mobile)}
                              </a>
                            </div>
                          )
                        )}
                      </div>
                    )}

                  {avocat.contact?.site_web && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-slate-500 flex-shrink-0" />

                      <a
                        href={avocat.contact.site_web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-700 hover:text-teal-600 transition-colors break-all"
                      >
                        Voir le site web
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {user &&
              profile?.user_type === "client" &&
              profile?.id !== avocat.id &&
              avocat.contact?.site_web && (
                <Card className="transition-all duration-300">
                  <CardHeader>
                    <div className="text-lg font-semibold text-slate-800">
                      En savoir plus
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-slate-500 flex-shrink-0" />

                      <a
                        href={avocat.contact.site_web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-700 hover:text-teal-600 transition-colors break-all"
                      >
                        Voir le site web
                      </a>
                    </div>
                  </CardContent>
                </Card>
              )}

            {!isOwnProfile && (!user || profile?.user_type !== "client") && (
              <Card className="bg-white shadow-sm transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <p className="text-slate-700 font-semibold mb-3">
                    Connectez-vous pour voir les coordonnées
                  </p>
                  <Link
                    href="/auth/client/register"
                    className="inline-flex items-center gap-2 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100"
                  >
                    Créez un compte
                  </Link>
                </CardContent>
              </Card>
            )}

            {!avocat.is_claimed && (
              <Card className="bg-white shadow-sm transition-all duration-300">
                <CardContent className="p-6">
                  <div className="max-w-2xl mx-auto text-center space-y-2">
                    <h3 className="font-semibold text-slate-700">
                      Vous êtes cet avocat ?
                    </h3>
                    <div className="pt-2">
                      <Link
                        href={`/claim-profile/${avocat.id}`}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100"
                      >
                        Réclamer ce profil
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {(!user || profile?.user_type === "client") && !isOwnProfile && (
              <Card className="transition-all duration-300 shadow-sm hover:shadow-md">
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <button
                      onClick={() => setIsConsultationModalOpen(true)}
                      className="cursor-pointer bg-teal-50 border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6 sm:p-8 rounded-lg flex flex-col items-center gap-3 sm:gap-4 text-center group"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center transition-colors duration-200">
                        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-slate-700 group-hover:text-teal-700 transition-colors duration-200">
                          Consultation
                        </div>
                        <div className="text-xs text-slate-500 group-hover:text-teal-600 transition-colors duration-200">
                          Juridique
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        if (!user || profile?.user_type !== "client") {
                          router.push("/auth/client/register");
                          return;
                        }

                        if (avocat.contact?.mobile) {
                          const firstMobile = avocat.contact.mobile
                            .split(",")[0]
                            .trim();
                          window.location.href = `tel:${firstMobile.replace(
                            /\s/g,
                            ""
                          )}`;
                        } else if (avocat.contact?.telephone) {
                          const firstPhone = avocat.contact.telephone
                            .split(",")[0]
                            .trim();
                          window.location.href = `tel:${firstPhone.replace(
                            /\s/g,
                            ""
                          )}`;
                        }
                      }}
                      className="cursor-pointer bg-teal-50 border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6 sm:p-8 rounded-lg flex flex-col items-center gap-3 sm:gap-4 text-center group"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center transition-colors duration-200">
                        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-slate-700 group-hover:text-teal-700 transition-colors duration-200">
                          Contact
                        </div>
                        <div className="text-xs text-slate-500 group-hover:text-teal-600 transition-colors duration-200">
                          Immédiat
                        </div>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-8">
          <ReviewSection
            lawyerId={avocat.id}
            onReviewSubmitted={reloadAvocatData}
          />
        </div>
      </div>

      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        lawyerId={avocat.id}
        lawyerName={`${avocat.prenom} ${avocat.nom}`}
        onSuccess={handleConsultationSuccess}
      />

      {showFeedbackPopup && (
        <FeedbackPopup onClose={() => setShowFeedbackPopup(false)} />
      )}
    </div>
  );
}
