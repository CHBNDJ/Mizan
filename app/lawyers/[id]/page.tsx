// "use client";
// import React, {
//   use,
//   useState,
//   useEffect,
//   useRef,
//   useLayoutEffect,
// } from "react";
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
// import { ContactCard } from "@/components/ContactCard";
// import ReviewSection from "@/components/reviews/ReviewSection";
// import Link from "next/link";
// import { formatPhoneNumber, detectPhoneType } from "@/lib/phoneFormatter";
// import FeedbackPopup from "@/components/FeedbackPopup";
// import { useAuth } from "@/hooks/useAuth";
// import { formatPrice, calculateConsultationPrice } from "@/lib/priceUtils";
// import Image from "next/image";
// import { toCivilite } from "@/lib/genderUtils";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

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
//   const hasAnimated = useRef(false);

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
//         setAvocat(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadAvocat();
//   }, [id]);

//   useLayoutEffect(() => {
//     if (!avocat || loading || hasAnimated.current) return;

//     hasAnimated.current = true;

//     ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

//     requestAnimationFrame(() => {
//       gsap.fromTo(
//         ".back-button",
//         { autoAlpha: 0, x: -30 },
//         { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out" }
//       );

//       const headerTL = gsap.timeline({ defaults: { ease: "power3.out" } });
//       headerTL
//         .fromTo(
//           ".profile-avatar",
//           { autoAlpha: 0, scale: 0.8, x: -50 },
//           { autoAlpha: 1, scale: 1, x: 0, duration: 0.8 }
//         )
//         .fromTo(
//           ".profile-name",
//           { autoAlpha: 0, x: -50 },
//           { autoAlpha: 1, x: 0, duration: 0.7 },
//           "-=0.5"
//         )
//         .fromTo(
//           ".profile-location",
//           { autoAlpha: 0, x: -30 },
//           { autoAlpha: 1, x: 0, duration: 0.6 },
//           "-=0.4"
//         )
//         .fromTo(
//           ".profile-ratings",
//           { autoAlpha: 0, x: -30 },
//           { autoAlpha: 1, x: 0, duration: 0.6 },
//           "-=0.3"
//         )
//         .fromTo(
//           ".profile-verified",
//           { autoAlpha: 0, scale: 0.8 },
//           { autoAlpha: 1, scale: 1, duration: 0.5 },
//           "-=0.2"
//         );

//       gsap.fromTo(
//         ".profile-price",
//         { autoAlpha: 0, x: 50 },
//         { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.3 }
//       );

//       const immediateCards = [".card-expertise", ".card-experience"];

//       immediateCards.forEach((selector, index) => {
//         const element = document.querySelector(selector);
//         if (element) {
//           const fromX = index === 0 ? -50 : 50;
//           gsap.fromTo(
//             selector,
//             { autoAlpha: 0, x: fromX, y: 20 },
//             {
//               autoAlpha: 1,
//               x: 0,
//               y: 0,
//               duration: 0.8,
//               delay: 0.4 + index * 0.15,
//               ease: "power3.out",
//             }
//           );
//         }
//       });

//       const scrollCards = [".card-languages", ".card-address"];

//       scrollCards.forEach((selector) => {
//         const element = document.querySelector(selector);
//         if (element) {
//           gsap.fromTo(
//             selector,
//             { autoAlpha: 0, y: 30 },
//             {
//               autoAlpha: 1,
//               y: 0,
//               duration: 0.8,
//               ease: "power3.out",
//               scrollTrigger: {
//                 trigger: selector,
//                 start: "top 90%",
//                 end: "top 70%",
//                 toggleActions: "play none none none",
//               },
//             }
//           );
//         }
//       });

//       setTimeout(() => {
//         const sidebarCards = document.querySelectorAll(".sidebar-card");

//         if (sidebarCards.length > 0) {
//           const isMobile = window.innerWidth < 1024;

//           if (isMobile) {
//             gsap.fromTo(
//               ".sidebar-card",
//               { autoAlpha: 0, y: 30 },
//               {
//                 autoAlpha: 1,
//                 y: 0,
//                 duration: 0.6,
//                 stagger: 0.12,
//                 ease: "power3.out",
//                 scrollTrigger: {
//                   trigger: ".sidebar-container",
//                   start: "top 90%",
//                   toggleActions: "play none none none",
//                 },
//               }
//             );
//           } else {
//             gsap.fromTo(
//               ".sidebar-card",
//               { autoAlpha: 0, x: 50, scale: 0.95 },
//               {
//                 autoAlpha: 1,
//                 x: 0,
//                 scale: 1,
//                 duration: 0.7,
//                 stagger: 0.12,
//                 delay: 0.6,
//                 ease: "power3.out",
//               }
//             );
//           }
//         }
//       }, 100);

//       setTimeout(() => {
//         const reviewsSection = document.querySelector(".reviews-section");
//         if (reviewsSection) {
//           gsap.fromTo(
//             ".reviews-section",
//             { autoAlpha: 0, y: 50 },
//             {
//               autoAlpha: 1,
//               y: 0,
//               duration: 1,
//               ease: "power3.out",
//               scrollTrigger: {
//                 trigger: ".reviews-section",
//                 start: "top 85%",
//                 toggleActions: "play none none none",
//               },
//             }
//           );
//         }
//       }, 100);
//     });

//     return () => {
//       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//     };
//   }, [avocat, loading, user, profile]);

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
//           return;
//         }
//       } catch (error) {
//         return;
//       }
//     };

//     trackProfileView();
//   }, [avocat?.id, supabase]);

//   const parsePhoneNumbers = (phoneString: string): string[] => {
//     if (!phoneString) return [];
//     return phoneString
//       .split(",")
//       .map((num) => num.trim())
//       .filter((num) => num.length > 0);
//   };

//   const reloadAvocatData = async () => {
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//       const avocatData = await getAvocatById(id);
//       if (avocatData) {
//         setAvocat(avocatData);
//       }
//     } catch (error) {
//       return;
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
//     avocat.rating_google || avocat.rating_mizan
//   );

//   return (
//     <div className="min-h-screen pt-24 bg-gradient-to-br from-teal-100 via-white to-teal-100 overflow-x-hidden w-full">
//       <div>
//         <div className="max-w-4xl mx-auto px-4 py-6">
//           <div className="flex items-center mb-4">
//             <button
//               onClick={handleBackToResults}
//               className="back-button opacity-0 invisible flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               <span className="hidden sm:inline">Retour aux résultats</span>
//               <span className="sm:hidden">Retour</span>
//             </button>
//           </div>

//           <div className="flex flex-col sm:flex-row items-center sm:gap-6">
//             <div className="profile-avatar opacity-0 invisible w-40 h-40 mb-4 flex-shrink-0 mx-auto sm:mx-0">
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
//               <div className="flex flex-col sm:flex-row sm:justify-between ">
//                 <div className="flex-1">
//                   <h1 className="profile-name opacity-0 invisible text-2xl sm:text-3xl font-bold text-slate-800 mb-2 text-center sm:text-left">
//                     {toCivilite(avocat.genre)} {avocat.prenom} {avocat.nom}
//                   </h1>

//                   <div className="profile-location opacity-0 invisible flex flex-col sm:flex-row sm:items-center sm:gap-4 text-slate-600 mb-4 text-center sm:text-left">
//                     <div className="flex items-center gap-1 justify-center sm:justify-start">
//                       <MapPin className="w-4 h-4" />
//                       <span>
//                         {avocat.ville}, {avocat.wilaya}
//                       </span>
//                     </div>
//                     <span className="hidden sm:inline">•</span>
//                     <span>Barreau de {avocat.barreau}</span>
//                   </div>

//                   {((avocat.rating_google &&
//                     (avocat.reviews_count_google ?? 0) > 0) ||
//                     (avocat.rating_mizan &&
//                       (avocat.reviews_count_mizan ?? 0) > 0)) && (
//                     <div className="profile-ratings opacity-0 invisible flex flex-col sm:flex-row sm:items-center gap-3 text-center sm:text-left mt-4">
//                       {avocat.rating_google &&
//                         (avocat.reviews_count_google ?? 0) > 0 && (
//                           <div className="flex items-center justify-center sm:justify-start gap-2 text-yellow-500">
//                             <Star className="w-5 h-5 fill-current" />
//                             <span className="font-semibold text-lg">
//                               {avocat.rating_google.toFixed(1)}
//                             </span>
//                             <Image
//                               src="/google.png"
//                               alt="Google"
//                               width={18}
//                               height={18}
//                               className="ml-1"
//                             />
//                             <span className="text-sm text-slate-500">
//                               ({avocat.reviews_count_google} avis)
//                             </span>
//                           </div>
//                         )}

//                       {avocat.rating_google &&
//                         (avocat.reviews_count_google ?? 0) > 0 &&
//                         avocat.rating_mizan &&
//                         (avocat.reviews_count_mizan ?? 0) > 0 && (
//                           <span className="text-slate-300 hidden sm:inline">
//                             •
//                           </span>
//                         )}

//                       {avocat.rating_mizan &&
//                         (avocat.reviews_count_mizan ?? 0) > 0 && (
//                           <div className="flex items-center justify-center sm:justify-start gap-2 text-teal-600">
//                             <Star className="w-5 h-5 fill-current" />
//                             <span className="font-semibold text-lg">
//                               {avocat.rating_mizan.toFixed(1)}
//                             </span>
//                             <Scale className="w-5 h-5 fill-current" />
//                             <span className="text-sm text-slate-500">
//                               ({avocat.reviews_count_mizan} avis)
//                             </span>
//                           </div>
//                         )}
//                     </div>
//                   )}

//                   {avocat.verified && (
//                     <div className="profile-verified opacity-0 invisible flex items-center justify-center sm:justify-start gap-1 text-teal-600 mt-3">
//                       <CheckCircle className="w-5 h-5" />
//                       <span className="font-medium">Vérifié</span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="profile-price opacity-0 invisible text-center sm:text-right mt-4 sm:mt-0">
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
//               <Card className="card-expertise opacity-0 invisible transition-all duration-300">
//                 <CardHeader>
//                   <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
//                     <Briefcase className="w-5 h-5" />
//                     Domaines d'expertise
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex flex-wrap gap-3">
//                     {avocat.specialites.map((spec: string, index: number) => (
//                       <span
//                         key={index}
//                         className="inline-flex items-center gap-2 px-3 py-2.5 bg-teal-50 text-teal-700 rounded-full text-[15px] font-medium border border-teal-100 hover:bg-teal-100 hover:border-teal-200 transition-all shadow-sm"
//                       >
//                         <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
//                         {spec}
//                       </span>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             <Card className="card-experience opacity-0 invisible transition-all duration-300">
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
//               <Card className="card-languages opacity-0 invisible transition-all duration-300">
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

//             <Card className="card-address opacity-0 invisible transition-all duration-300">
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
//                   <div className="text-slate-600">
//                     {avocat.adresse?.code_postal || ""}{" "}
//                     {avocat.adresse?.ville || avocat.ville}
//                     {avocat.adresse?.wilaya && <>, {avocat.adresse.wilaya}</>}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="sidebar-container lg:sticky lg:top-24 space-y-6">
//             {user && profile?.id === avocat.id && (
//               <Card className="sidebar-card opacity-0 invisible transition-all duration-300">
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
//                         {parsePhoneNumbers(avocat.contact.telephone).map(
//                           (phone, index) => {
//                             const phoneType = detectPhoneType(phone);
//                             return (
//                               <div
//                                 key={index}
//                                 className="flex items-center gap-3"
//                               >
//                                 {phoneType === "mobile" ? (
//                                   <Smartphone className="w-4 h-4 text-slate-500 flex-shrink-0" />
//                                 ) : (
//                                   <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
//                                 )}

//                                 <a
//                                   href={`tel:${phone.replace(/\s/g, "")}`}
//                                   className="text-slate-700 hover:text-teal-600 transition-colors"
//                                 >
//                                   {formatPhoneNumber(phone)}
//                                 </a>
//                               </div>
//                             );
//                           }
//                         )}
//                       </div>
//                     )}

//                   {avocat.contact?.mobile &&
//                     parsePhoneNumbers(avocat.contact.mobile).length > 0 && (
//                       <div className="space-y-2">
//                         {parsePhoneNumbers(avocat.contact.mobile).map(
//                           (mobile, index) => {
//                             const phoneType = detectPhoneType(mobile);
//                             return (
//                               <div
//                                 key={index}
//                                 className="flex items-center gap-3"
//                               >
//                                 {phoneType === "mobile" ? (
//                                   <Smartphone className="w-4 h-4 text-slate-500 flex-shrink-0" />
//                                 ) : (
//                                   <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
//                                 )}

//                                 <a
//                                   href={`tel:${mobile.replace(/\s/g, "")}`}
//                                   className="text-slate-700 hover:text-teal-600 transition-colors"
//                                 >
//                                   {formatPhoneNumber(mobile)}
//                                 </a>
//                               </div>
//                             );
//                           }
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
//                 <Card className="sidebar-card opacity-0 invisible transition-all duration-300">
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
//               <Card className="sidebar-card opacity-0 invisible bg-white shadow-sm transition-all duration-300">
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
//               <Card className="sidebar-card opacity-0 invisible bg-white shadow-sm transition-all duration-300">
//                 <CardContent className="p-6">
//                   <div className="max-w-2xl mx-auto text-center space-y-2">
//                     <h3 className="font-semibold text-slate-700">
//                       Vous êtes cet avocat ?
//                     </h3>
//                     <div className="pt-2">
//                       <Link
//                         href={`/claim-profile/${avocat.id}`}
//                         className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100"
//                       >
//                         Réclamer ce profil
//                       </Link>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {(!user || profile?.user_type === "client") && !isOwnProfile && (
//               <Card className="sidebar-card opacity-0 invisible transition-all duration-300 shadow-sm hover:shadow-md">
//                 <CardContent className="p-4 sm:p-6">
//                   <button
//                     onClick={() => {
//                       if (!user || profile?.user_type !== "client") {
//                         router.push("/auth/client/register");
//                         return;
//                       }
//                       setIsConsultationModalOpen(true);
//                     }}
//                     className="cursor-pointer w-full bg-teal-50 border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6 sm:p-8 rounded-lg flex flex-col items-center gap-3 sm:gap-4 text-center group mb-4"
//                   >
//                     <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center transition-colors duration-200">
//                       <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
//                     </div>
//                     <div>
//                       <div className="font-medium text-sm text-slate-700 group-hover:text-teal-700 transition-colors duration-200">
//                         Consultation
//                       </div>
//                       <div className="text-xs text-slate-500 group-hover:text-teal-600 transition-colors duration-200">
//                         Juridique
//                       </div>
//                     </div>
//                   </button>

//                   {user && profile?.user_type === "client" && (
//                     <ContactCard
//                       allPhoneNumbers={[
//                         ...(avocat.contact?.telephone
//                           ?.split(",")
//                           .map((n) => n.trim()) || []),
//                         ...(avocat.contact?.mobile
//                           ?.split(",")
//                           .map((n) => n.trim()) || []),
//                       ].filter(Boolean)}
//                     />
//                   )}
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>

//         <div className="reviews-section opacity-0 invisible mt-8">
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
import React, {
  use,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
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
  Scale,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { getAvocatById } from "@/lib/avocatsData";
import { getInitials } from "@/lib/utils";
import { AvocatData, ProfilePageProps } from "@/types";
import { createClient } from "@/lib/supabase/client";
import ConsultationModal from "@/components/consultation/ConsultationModal";
import { ContactCard } from "@/components/ContactCard";
import ReviewSection from "@/components/reviews/ReviewSection";
import Link from "next/link";
import { formatPhoneNumber, detectPhoneType } from "@/lib/phoneFormatter";
import FeedbackPopup from "@/components/FeedbackPopup";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, calculateConsultationPrice } from "@/lib/priceUtils";
import Image from "next/image";
import { toCivilite } from "@/lib/genderUtils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  const hasAnimated = useRef(false);

  const isOwnProfile = user?.id === avocat?.id;

  const handleConsultationSuccess = () => {
    setTimeout(() => setShowFeedbackPopup(true), 3000);
  };

  useEffect(() => {
    const loadAvocat = async () => {
      try {
        const avocatData = await getAvocatById(id);
        setAvocat(avocatData);
      } catch {
        setAvocat(null);
      } finally {
        setLoading(false);
      }
    };
    loadAvocat();
  }, [id]);

  useLayoutEffect(() => {
    if (!avocat || loading || hasAnimated.current) return;
    hasAnimated.current = true;
    ScrollTrigger.getAll().forEach((t) => t.kill());

    requestAnimationFrame(() => {
      gsap.fromTo(
        ".back-button",
        { autoAlpha: 0, x: -30 },
        { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out" }
      );

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          ".profile-avatar",
          { autoAlpha: 0, scale: 0.8 },
          { autoAlpha: 1, scale: 1, duration: 0.7 }
        )
        .fromTo(
          ".profile-name",
          { autoAlpha: 0, x: -30 },
          { autoAlpha: 1, x: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          ".profile-meta",
          { autoAlpha: 0, x: -20 },
          { autoAlpha: 1, x: 0, duration: 0.5 },
          "-=0.3"
        )
        .fromTo(
          ".profile-ratings",
          { autoAlpha: 0, x: -20 },
          { autoAlpha: 1, x: 0, duration: 0.5 },
          "-=0.3"
        )
        .fromTo(
          ".profile-verified",
          { autoAlpha: 0, scale: 0.8 },
          { autoAlpha: 1, scale: 1, duration: 0.4 },
          "-=0.2"
        );

      gsap.fromTo(
        ".profile-price",
        { autoAlpha: 0, x: 30 },
        { autoAlpha: 1, x: 0, duration: 0.7, ease: "power3.out", delay: 0.3 }
      );

      [".card-expertise", ".card-experience"].forEach((sel, i) => {
        if (document.querySelector(sel)) {
          gsap.fromTo(
            sel,
            { autoAlpha: 0, x: i === 0 ? -40 : 40, y: 20 },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              duration: 0.8,
              delay: 0.4 + i * 0.15,
              ease: "power3.out",
            }
          );
        }
      });

      [".card-languages", ".card-address"].forEach((sel) => {
        if (document.querySelector(sel)) {
          gsap.fromTo(
            sel,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sel,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });

      setTimeout(() => {
        const sidebarCards = document.querySelectorAll(".sidebar-card");
        if (sidebarCards.length > 0) {
          const isMobile = window.innerWidth < 1024;
          if (isMobile) {
            gsap.fromTo(
              ".sidebar-card",
              { autoAlpha: 0, y: 30 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.12,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: ".sidebar-container",
                  start: "top 90%",
                  toggleActions: "play none none none",
                },
              }
            );
          } else {
            gsap.fromTo(
              ".sidebar-card",
              { autoAlpha: 0, x: 40, scale: 0.95 },
              {
                autoAlpha: 1,
                x: 0,
                scale: 1,
                duration: 0.7,
                stagger: 0.12,
                delay: 0.6,
                ease: "power3.out",
              }
            );
          }
        }
      }, 100);

      setTimeout(() => {
        if (document.querySelector(".reviews-section")) {
          gsap.fromTo(
            ".reviews-section",
            { autoAlpha: 0, y: 50 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ".reviews-section",
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }, 100);
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [avocat, loading, user, profile]);

  useEffect(() => {
    if (!avocat?.id) return;
    const trackProfileView = async () => {
      try {
        const { ip } = await fetch("https://api.ipify.org?format=json").then(
          (r) => r.json()
        );
        await supabase
          .from("profile_views")
          .insert({ lawyer_id: avocat.id, viewer_id: null, viewer_ip: ip });
      } catch {}
    };
    trackProfileView();
  }, [avocat?.id, supabase]);

  const parsePhoneNumbers = (phoneString: string): string[] => {
    if (!phoneString) return [];
    return phoneString
      .split(",")
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
  };

  const reloadAvocatData = async () => {
    try {
      await new Promise((r) => setTimeout(r, 2000));
      const avocatData = await getAvocatById(id);
      if (avocatData) setAvocat(avocatData);
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-teal-100 via-white to-teal-100">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-200 animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-slate-200 rounded animate-pulse w-48" />
              <div className="h-4 bg-slate-200 rounded animate-pulse w-32" />
            </div>
          </div>
          <div className="h-32 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-24 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!avocat) notFound();

  const experienceAnnees = avocat.experience?.annees || 0;
  const tarifEstime = calculateConsultationPrice(
    avocat.consultation_price,
    avocat.experience?.annees || 0,
    avocat.rating_google || avocat.rating_mizan
  );

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 overflow-x-hidden w-full">
      <div className="bg-gradient-to-br from-teal-50 via-white to-teal-50 border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push(`/search?${searchParams.toString()}`)}
            className="back-button opacity-0 invisible flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors cursor-pointer mb-5 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour aux résultats</span>
            <span className="sm:hidden">Retour</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="profile-avatar opacity-0 invisible flex-shrink-0">
              {avocat.avatar_url ? (
                <img
                  src={avocat.avatar_url}
                  alt={`${avocat.prenom} ${avocat.nom}`}
                  className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {getInitials(avocat.prenom, avocat.nom)}
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h1 className="profile-name opacity-0 invisible text-xl sm:text-2xl font-bold text-slate-800">
                      {toCivilite(avocat.genre)} {avocat.prenom} {avocat.nom}
                    </h1>
                    {avocat.verified && (
                      <div className="profile-verified opacity-0 invisible flex items-center gap-1 text-teal-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-medium hidden sm:inline">
                          Vérifié
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="profile-meta opacity-0 invisible flex flex-col sm:flex-row sm:items-center sm:gap-3 text-slate-500 text-sm mb-3">
                    <div className="flex items-center gap-1 justify-center sm:justify-start">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>
                        {avocat.ville}, {avocat.wilaya}
                      </span>
                    </div>
                    <span className="hidden sm:inline text-slate-300">·</span>
                    <span>Barreau de {avocat.barreau}</span>
                  </div>

                  {((avocat.rating_google &&
                    (avocat.reviews_count_google ?? 0) > 0) ||
                    (avocat.rating_mizan &&
                      (avocat.reviews_count_mizan ?? 0) > 0)) && (
                    <div className="profile-ratings opacity-0 invisible flex flex-wrap items-center justify-center sm:justify-start gap-4">
                      {avocat.rating_google &&
                        (avocat.reviews_count_google ?? 0) > 0 && (
                          <div className="flex items-center gap-1.5 text-sm">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-semibold text-slate-800">
                              {avocat.rating_google.toFixed(1)}
                            </span>
                            <Image
                              src="/google.png"
                              alt="Google"
                              width={14}
                              height={14}
                            />
                            <span className="text-slate-500 text-xs">
                              ({avocat.reviews_count_google} avis)
                            </span>
                          </div>
                        )}
                      {avocat.rating_mizan &&
                        (avocat.reviews_count_mizan ?? 0) > 0 && (
                          <div className="flex items-center gap-1.5 text-sm">
                            <Star className="w-4 h-4 fill-teal-500 text-teal-500" />
                            <span className="font-semibold text-slate-800">
                              {avocat.rating_mizan.toFixed(1)}
                            </span>
                            <Scale className="w-3.5 h-3.5 text-teal-600" />
                            <span className="text-slate-500 text-xs">
                              ({avocat.reviews_count_mizan} avis)
                            </span>
                          </div>
                        )}
                    </div>
                  )}
                </div>

                <div className="profile-price opacity-0 invisible text-center sm:text-right mt-3 sm:mt-0">
                  <div className="text-xl font-bold text-teal-600">
                    {formatPrice(tarifEstime)}
                  </div>
                  <div className="text-xs text-slate-400">
                    {avocat.consultation_price
                      ? "Tarif consultation"
                      : "Tarif estimé"}
                  </div>
                  {!avocat.consultation_price && (
                    <div className="text-xs text-slate-400 italic">
                      basé sur l'expérience
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {avocat.specialites && avocat.specialites.length > 0 && (
              <Card className="card-expertise opacity-0 invisible transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 text-base font-semibold text-slate-800">
                    <Briefcase className="w-4 h-4 text-teal-600" />
                    Domaines d'expertise
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {avocat.specialites.map((spec: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-medium border border-teal-100 hover:bg-teal-100 transition-all"
                      >
                        <span className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                        {spec}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="card-experience opacity-0 invisible transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-2 text-base font-semibold text-slate-800">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Expérience professionnelle
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-teal-600 mb-1">
                      {experienceAnnees} ans
                    </div>
                    <div className="text-sm text-slate-500">d'expérience</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-xl font-bold text-teal-600 mb-1">
                      {avocat.experience?.date_inscription || "N/A"}
                    </div>
                    <div className="text-sm text-slate-500">
                      Inscription au barreau
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {avocat.langues && avocat.langues.length > 0 && (
              <Card className="card-languages opacity-0 invisible transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 text-base font-semibold text-slate-800">
                    <Languages className="w-4 h-4 text-teal-600" />
                    Langues parlées
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {avocat.langues.map((langue: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                      >
                        {langue}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="card-address opacity-0 invisible transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-2 text-base font-semibold text-slate-800">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  Adresse du cabinet
                </div>
              </CardHeader>
              <CardContent>
                <div className="font-medium text-slate-700">
                  {avocat.adresse?.rue || "Adresse non spécifiée"}
                </div>
                <div className="text-sm text-slate-500 mt-0.5">
                  {avocat.adresse?.code_postal || ""}{" "}
                  {avocat.adresse?.ville || avocat.ville}
                  {avocat.adresse?.wilaya && `, ${avocat.adresse.wilaya}`}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="sidebar-container lg:sticky lg:top-24 space-y-4">
            {user && profile?.id === avocat.id && (
              <Card className="sidebar-card opacity-0 invisible transition-all duration-300">
                <CardHeader>
                  <h3 className="text-base font-semibold text-slate-800">
                    Contact
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {avocat.contact?.email && (
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <a
                        href={`mailto:${avocat.contact.email}`}
                        className="text-sm text-slate-700 hover:text-teal-600 transition-colors break-all"
                      >
                        {avocat.contact.email}
                      </a>
                    </div>
                  )}
                  {avocat.contact?.telephone &&
                    parsePhoneNumbers(avocat.contact.telephone).map(
                      (phone, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          {detectPhoneType(phone) === "mobile" ? (
                            <Smartphone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          ) : (
                            <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          )}
                          <a
                            href={`tel:${phone.replace(/\s/g, "")}`}
                            className="text-sm text-slate-700 hover:text-teal-600 transition-colors"
                          >
                            {formatPhoneNumber(phone)}
                          </a>
                        </div>
                      )
                    )}
                  {avocat.contact?.mobile &&
                    parsePhoneNumbers(avocat.contact.mobile).map(
                      (mobile, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          {detectPhoneType(mobile) === "mobile" ? (
                            <Smartphone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          ) : (
                            <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          )}
                          <a
                            href={`tel:${mobile.replace(/\s/g, "")}`}
                            className="text-sm text-slate-700 hover:text-teal-600 transition-colors"
                          >
                            {formatPhoneNumber(mobile)}
                          </a>
                        </div>
                      )
                    )}
                  {avocat.contact?.site_web && (
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <a
                        href={avocat.contact.site_web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-700 hover:text-teal-600 transition-colors break-all"
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
                <Card className="sidebar-card opacity-0 invisible transition-all duration-300">
                  <CardHeader>
                    <div className="text-base font-semibold text-slate-800">
                      En savoir plus
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <a
                        href={avocat.contact.site_web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-700 hover:text-teal-600 transition-colors break-all"
                      >
                        Voir le site web
                      </a>
                    </div>
                  </CardContent>
                </Card>
              )}

            {!isOwnProfile && (!user || profile?.user_type !== "client") && (
              <Card className="sidebar-card opacity-0 invisible transition-all duration-300">
                <CardContent className="p-5 text-center">
                  <p className="text-sm text-slate-600 font-medium mb-3">
                    Connectez-vous pour voir les coordonnées
                  </p>
                  <Link
                    href="/auth/client/register"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl transition-all"
                  >
                    Créez un compte
                  </Link>
                </CardContent>
              </Card>
            )}

            {!avocat.is_claimed && (
              <Card className="sidebar-card opacity-0 invisible transition-all duration-300">
                <CardContent className="p-5 text-center">
                  <p className="text-sm font-semibold text-slate-700 mb-3">
                    Vous êtes cet avocat ?
                  </p>
                  <Link
                    href={`/claim-profile/${avocat.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl transition-all"
                  >
                    Réclamer ce profil
                  </Link>
                </CardContent>
              </Card>
            )}

            {(!user || profile?.user_type === "client") && !isOwnProfile && (
              <Card className="sidebar-card opacity-0 invisible transition-all duration-300">
                <CardContent className="p-4">
                  <button
                    onClick={() => {
                      if (!user || profile?.user_type !== "client") {
                        router.push("/auth/client/register");
                        return;
                      }
                      setIsConsultationModalOpen(true);
                    }}
                    className="cursor-pointer w-full bg-teal-600 hover:bg-teal-700 text-white transition-all duration-200 p-4 rounded-xl flex items-center justify-center gap-3 mb-3"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold text-sm">
                        Demander une consultation
                      </div>
                      <div className="text-xs text-teal-100">Juridique</div>
                    </div>
                  </button>

                  {user && profile?.user_type === "client" && (
                    <ContactCard
                      allPhoneNumbers={[
                        ...(avocat.contact?.telephone
                          ?.split(",")
                          .map((n) => n.trim()) || []),
                        ...(avocat.contact?.mobile
                          ?.split(",")
                          .map((n) => n.trim()) || []),
                      ].filter(Boolean)}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="reviews-section opacity-0 invisible mt-8">
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
