// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { createClient } from "@/lib/supabase/client";
// import { useAuth } from "@/hooks/useAuth";
// import {
//   Clock,
//   Users,
//   Eye,
//   Edit,
//   Settings,
//   MessageSquare,
//   CheckCircle,
// } from "lucide-react";
// import { gsap } from "gsap";

// export default function LawyerDashboardPage() {
//   const supabase = createClient();
//   const { profile, user, isAuthenticated, loading } = useAuth();
//   const router = useRouter();
//   const containerRef = useRef<HTMLDivElement>(null);

//   const [stats, setStats] = useState({
//     totalConsultations: 0,
//     consultationsPending: 0,
//     consultationsAnswered: 0,
//     profileViews: 0,
//   });

//   const [loadingStats, setLoadingStats] = useState(true);
//   const [isVerified, setIsVerified] = useState(false);

//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       router.push("/auth/lawyer/login");
//     }
//   }, [loading, isAuthenticated, router]);

//   useEffect(() => {
//     if (user && profile?.user_type === "lawyer") {
//       loadStats();
//       checkVerification();
//     }
//   }, [user, profile]);

//   useEffect(() => {
//     if (!user || profile?.user_type !== "lawyer") return;

//     const interval = setInterval(() => {
//       loadStats();
//       checkVerification();
//     }, 10000);

//     return () => clearInterval(interval);
//   }, [user, profile]);

//   useEffect(() => {
//     if (!containerRef.current || loading || loadingStats) return;

//     const timeline = gsap.timeline();

//     timeline
//       .fromTo(
//         ".page-header",
//         { opacity: 0, y: -30 },
//         { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
//       )
//       .fromTo(
//         ".page-subtitle",
//         { opacity: 0, y: -20 },
//         { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
//         "-=0.4"
//       )
//       .fromTo(
//         ".settings-button",
//         { opacity: 0, scale: 0.8 },
//         { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
//         "-=0.3"
//       )
//       .fromTo(
//         ".verification-banner",
//         { opacity: 0, y: 20 },
//         { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
//         "-=0.2"
//       )
//       .fromTo(
//         ".stats-card",
//         { opacity: 0, y: 20 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.5,
//           stagger: 0.1,
//           ease: "power2.out",
//         },
//         "-=0.3"
//       )
//       .fromTo(
//         ".actions-section",
//         { opacity: 0, y: 20 },
//         { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
//         "-=0.2"
//       )
//       .fromTo(
//         ".help-section",
//         { opacity: 0, y: 20 },
//         { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
//         "-=0.2"
//       );
//   }, [loading, loadingStats]);

//   const checkVerification = async () => {
//     if (!user) return;

//     // ✅ Lire depuis la table LAWYERS, pas USERS
//     const { data } = await supabase
//       .from("lawyers")
//       .select("verified")
//       .eq("id", user.id)
//       .single();

//     setIsVerified(data?.verified || false);
//   };

//   const loadStats = async () => {
//     if (!user) return;

//     try {
//       setLoadingStats(true);

//       const { count: totalCount } = await supabase
//         .from("consultations")
//         .select("*", { count: "exact", head: true })
//         .eq("lawyer_id", user.id);

//       const { count: pendingCount } = await supabase
//         .from("consultations")
//         .select("*", { count: "exact", head: true })
//         .eq("lawyer_id", user.id)
//         .eq("status", "pending");

//       const { count: answeredCount } = await supabase
//         .from("consultations")
//         .select("*", { count: "exact", head: true })
//         .eq("lawyer_id", user.id)
//         .eq("status", "answered");

//       const { count: viewsCount } = await supabase
//         .from("profile_views")
//         .select("*", { count: "exact", head: true })
//         .eq("lawyer_id", user.id);

//       setStats({
//         totalConsultations: totalCount || 0,
//         consultationsPending: pendingCount || 0,
//         consultationsAnswered: answeredCount || 0,
//         profileViews: viewsCount || 0,
//       });
//     } catch (error) {
//       console.error("Erreur chargement stats:", error);
//     } finally {
//       setLoadingStats(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
//           <p className="text-slate-600">Chargement...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return null;
//   }

//   const statsCards = [
//     {
//       title: "Demandes clients",
//       value: stats.totalConsultations,
//       icon: Users,
//       color: "teal",
//       bgColor: "bg-teal-100",
//       textColor: "text-teal-600",
//     },
//     {
//       title: "Répondues",
//       value: stats.consultationsAnswered,
//       icon: CheckCircle,
//       color: "green",
//       bgColor: "bg-green-100",
//       textColor: "text-green-600",
//     },
//     {
//       title: "Profil vu",
//       value: stats.profileViews,
//       icon: Eye,
//       color: "blue",
//       bgColor: "bg-blue-100",
//       textColor: "text-blue-600",
//     },
//   ];

//   return (
//     <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
//       <style>{`
//         .page-header,
//         .page-subtitle,
//         .settings-button,
//         .verification-banner,
//         .stats-card,
//         .actions-section,
//         .help-section {
//           opacity: 0;
//         }
//       `}</style>

//       <div className="max-w-7xl mx-auto px-4 py-8" ref={containerRef}>
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="page-header text-3xl font-bold text-slate-800">
//               Tableau de bord
//             </h1>
//             <p className="page-subtitle text-slate-600 mt-1">
//               Bonjour {profile?.first_name}, bienvenue sur votre espace
//               professionnel
//             </p>
//           </div>

//           <button
//             onClick={() => router.push("/settings")}
//             className="settings-button p-2 text-slate-600 hover:text-slate-800 hover:bg-white rounded-lg transition-colors"
//           >
//             <Settings className="w-6 h-6 cursor-pointer" />
//           </button>
//         </div>

//         {/* Bandeau de vérification */}
//         {!isVerified && (
//           <div className="verification-banner bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
//             <div className="flex items-start">
//               <Clock className="w-6 h-6 text-amber-600 mt-1 mr-4 flex-shrink-0" />
//               <div>
//                 <h3 className="font-semibold text-amber-800 mb-2">
//                   Vérification en cours
//                 </h3>
//                 <p className="text-amber-700 text-sm">
//                   Nos équipes examinent vos informations professionnelles
//                   (24-48h). Vous recevrez un email dès que votre profil sera
//                   validé.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Statistiques */}
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
//           {loadingStats
//             ? Array.from({ length: 3 }).map((_, i) => (
//                 <div
//                   key={i}
//                   className="bg-white rounded-lg p-6 shadow-sm border animate-pulse"
//                 >
//                   <div className="flex items-center">
//                     <div className="w-12 h-12 bg-slate-200 rounded-lg mr-4"></div>
//                     <div className="flex-1">
//                       <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
//                       <div className="h-6 bg-slate-200 rounded w-12"></div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             : statsCards.map((stat, index) => (
//                 <div
//                   key={index}
//                   className="stats-card bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex items-center">
//                     <div
//                       className={`p-3 rounded-lg ${stat.bgColor} ${stat.textColor} mr-4`}
//                     >
//                       <stat.icon className="w-6 h-6" />
//                     </div>
//                     <div>
//                       <p className="text-sm text-slate-600">{stat.title}</p>
//                       <p className="text-2xl font-bold text-slate-800">
//                         {stat.value}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//         </div>

//         {/* Actions rapides */}
//         <div className="actions-section bg-white rounded-lg p-6 shadow-sm border mb-8">
//           <h2 className="text-xl font-semibold text-slate-800 mb-6">
//             Actions rapides
//           </h2>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//             <button
//               onClick={() => router.push("/lawyer/consultations")}
//               className="p-4 border border-slate-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors text-left group"
//             >
//               <div className="flex items-start cursor-pointer">
//                 <MessageSquare className="w-5 h-5 text-teal-600 mr-3 mt-1 flex-shrink-0" />
//                 <div>
//                   <h3 className="font-medium text-slate-800 group-hover:text-teal-700">
//                     Mes consultations
//                   </h3>
//                   <p className="text-sm text-slate-600">
//                     {stats.consultationsPending > 0
//                       ? `${stats.consultationsPending} en attente de réponse`
//                       : "Aucune consultation en attente"}
//                   </p>
//                 </div>
//               </div>
//             </button>

//             <button
//               onClick={() => router.push("/profile")}
//               className="p-4 border border-slate-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors text-left group"
//             >
//               <div className="flex items-start cursor-pointer">
//                 <Edit className="w-5 h-5 text-teal-600 mr-3 mt-1 flex-shrink-0" />
//                 <div>
//                   <h3 className="font-medium text-slate-800 group-hover:text-teal-700">
//                     Modifier mon profil
//                   </h3>
//                   <p className="text-sm text-slate-600">
//                     Personnalisez vos informations
//                   </p>
//                 </div>
//               </div>
//             </button>

//             <button
//               onClick={() => router.push(`/lawyers/${user?.id}`)}
//               className="p-4 border border-slate-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors text-left group"
//             >
//               <div className="flex items-start cursor-pointer">
//                 <Eye className="w-5 h-5 text-teal-600 mr-3 mt-1 flex-shrink-0" />
//                 <div>
//                   <h3 className="font-medium text-slate-800 group-hover:text-teal-700">
//                     Voir mon profil public
//                   </h3>
//                   <p className="text-sm text-slate-600">
//                     Comment les clients vous voient
//                   </p>
//                 </div>
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Section aide */}
//         <div className="help-section bg-teal-50 rounded-lg p-8 text-center">
//           <h2 className="text-xl font-semibold text-slate-800 mb-4">
//             Besoin d'aide ?
//           </h2>
//           <p className="text-slate-600 mb-4">
//             Notre équipe est là pour vous accompagner
//           </p>

//           <a
//             href="mailto:support@mizan-dz.com"
//             className="inline-flex items-center bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors cursor-pointer"
//           >
//             Nous contacter
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Clock,
  Users,
  Eye,
  Edit,
  Settings,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { gsap } from "gsap";

export default function LawyerDashboardPage() {
  const supabase = createClient();
  const { profile, user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState({
    totalConsultations: 0,
    consultationsPending: 0,
    consultationsAnswered: 0,
    profileViews: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/lawyer/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user && profile?.user_type === "lawyer") {
      loadStats();
      checkVerification();
    }
  }, [user, profile]);

  useEffect(() => {
    if (!containerRef.current || loading || loadingStats) return;

    // ✅ REAL-TIME : Écouter les nouveaux messages
    useEffect(() => {
      if (!user || profile?.user_type !== "lawyer") return;

      const messagesChannel = supabase
        .channel("dashboard-messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "consultation_messages",
          },
          (payload) => {
            if (payload.new.sender_id !== user.id) {
              loadStats();
            }
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "consultation_messages",
          },
          () => {
            loadStats();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(messagesChannel);
      };
    }, [user, profile]);

    const timeline = gsap.timeline();

    timeline
      .fromTo(
        ".page-header",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
      )
      .fromTo(
        ".page-subtitle",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".settings-button",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
        "-=0.3"
      )
      .fromTo(
        ".verification-banner",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.2"
      )
      .fromTo(
        ".stats-card",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.3"
      )
      .fromTo(
        ".actions-section",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.2"
      )
      .fromTo(
        ".help-section",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.2"
      );
  }, [loading, loadingStats]);

  const checkVerification = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("lawyers")
      .select("verified")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Erreur vérification:", error);
      setIsVerified(false);
      return;
    }

    setIsVerified(data?.verified || false);
  };

  const loadStats = async () => {
    if (!user) return;

    try {
      setLoadingStats(true);

      // Total consultations
      const { count: totalCount } = await supabase
        .from("consultations")
        .select("*", { count: "exact", head: true })
        .eq("lawyer_id", user.id);

      // Répondues (status = answered)
      const { count: answeredCount } = await supabase
        .from("consultations")
        .select("*", { count: "exact", head: true })
        .eq("lawyer_id", user.id)
        .eq("status", "answered");

      // Messages non lus = consultations en attente
      const { data: consultationIds } = await supabase
        .from("consultations")
        .select("id")
        .eq("lawyer_id", user.id);

      let pendingCount = 0;
      if (consultationIds && consultationIds.length > 0) {
        const { data: unreadMessages } = await supabase
          .from("consultation_messages")
          .select("consultation_id")
          .in(
            "consultation_id",
            consultationIds.map((c) => c.id)
          )
          .eq("is_read", false)
          .neq("sender_id", user.id);

        // Nombre de consultations uniques avec messages non lus
        const uniqueConsultations = new Set(
          unreadMessages?.map((m) => m.consultation_id) || []
        );
        pendingCount = uniqueConsultations.size;
      }

      // Vues de profil
      const { count: viewsCount } = await supabase
        .from("profile_views")
        .select("*", { count: "exact", head: true })
        .eq("lawyer_id", user.id);

      setStats({
        totalConsultations: totalCount || 0,
        consultationsPending: pendingCount,
        consultationsAnswered: answeredCount || 0,
        profileViews: viewsCount || 0,
      });
    } catch (error) {
      console.error("Erreur chargement stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const statsCards = [
    {
      title: "Consultations totales",
      value: stats.totalConsultations,
      icon: Users,
      color: "teal",
      bgColor: "bg-teal-100",
      textColor: "text-teal-600",
    },
    {
      title: "Répondues",
      value: stats.consultationsAnswered,
      icon: CheckCircle,
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Profil vu",
      value: stats.profileViews,
      icon: Eye,
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <style>{`
        .page-header,
        .page-subtitle,
        .settings-button,
        .verification-banner,
        .stats-card,
        .actions-section,
        .help-section {
          opacity: 0;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-8" ref={containerRef}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-header text-3xl font-bold text-slate-800">
              Tableau de bord
            </h1>
            <p className="page-subtitle text-slate-600 mt-1">
              Bonjour {profile?.first_name}, bienvenue sur votre espace
              professionnel
            </p>
          </div>

          <button
            onClick={() => router.push("/settings")}
            className="settings-button p-2 text-slate-600 hover:text-slate-800 hover:bg-white rounded-lg transition-colors"
          >
            <Settings className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        {/* Bandeau de vérification */}
        {!isVerified && (
          <div className="verification-banner bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <Clock className="w-6 h-6 text-amber-600 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">
                  Vérification en cours
                </h3>
                <p className="text-amber-700 text-sm">
                  Nos équipes examinent vos informations professionnelles
                  (24-48h). Vous recevrez un email dès que votre profil sera
                  validé.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
          {loadingStats
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-6 shadow-sm border animate-pulse"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-slate-200 rounded-lg mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
                      <div className="h-6 bg-slate-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))
            : statsCards.map((stat, index) => (
                <div
                  key={index}
                  className="stats-card bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div
                      className={`p-3 rounded-lg ${stat.bgColor} ${stat.textColor} mr-4`}
                    >
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Actions rapides */}
        <div className="actions-section bg-white rounded-lg p-6 shadow-sm border mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Actions rapides
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <button
              onClick={() => router.push("/lawyer/consultations")}
              className="p-4 border border-slate-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors text-left group"
            >
              <div className="flex items-start cursor-pointer">
                <MessageSquare className="w-5 h-5 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-slate-800 group-hover:text-teal-700">
                    Mes consultations
                  </h3>
                  <p className="text-sm text-slate-600">
                    {stats.consultationsPending > 0
                      ? `${stats.consultationsPending} avec nouveaux messages`
                      : "Aucun nouveau message"}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push("/profile")}
              className="p-4 border border-slate-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors text-left group"
            >
              <div className="flex items-start cursor-pointer">
                <Edit className="w-5 h-5 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-slate-800 group-hover:text-teal-700">
                    Modifier mon profil
                  </h3>
                  <p className="text-sm text-slate-600">
                    Personnalisez vos informations
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push(`/lawyers/${user?.id}`)}
              className="p-4 border border-slate-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-colors text-left group"
            >
              <div className="flex items-start cursor-pointer">
                <Eye className="w-5 h-5 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-slate-800 group-hover:text-teal-700">
                    Voir mon profil public
                  </h3>
                  <p className="text-sm text-slate-600">
                    Comment les clients vous voient
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Section aide */}
        <div className="help-section bg-teal-50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Besoin d'aide ?
          </h2>
          <p className="text-slate-600 mb-4">
            Notre équipe est là pour vous accompagner
          </p>

          <a
            href="mailto:support@mizan-dz.com"
            className="inline-flex items-center bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors cursor-pointer"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  );
}
