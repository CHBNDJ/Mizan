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
//   Camera,
// } from "lucide-react";
// import Link from "next/link";
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
//     if (!loading && !isAuthenticated) router.push("/auth/lawyer/login");
//   }, [loading, isAuthenticated, router]);

//   useEffect(() => {
//     if (user && profile?.user_type === "lawyer") {
//       loadStats();
//       checkVerification();
//     }
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
//         { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
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

//   useEffect(() => {
//     if (!user) return;
//     const channel = supabase
//       .channel("dashboard-stats")
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "consultations",
//           filter: `lawyer_id=eq.${user.id}`,
//         },
//         () => loadStats()
//       )
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "profile_views",
//           filter: `lawyer_id=eq.${user.id}`,
//         },
//         () => loadStats()
//       )
//       .subscribe();
//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [user]);

//   const checkVerification = async () => {
//     if (!user) return;
//     const { data } = await supabase
//       .from("lawyers")
//       .select("is_verified")
//       .eq("id", user.id)
//       .single();
//     setIsVerified(data?.is_verified || false);
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
//         .from("consultation_messages")
//         .select("*", { count: "exact", head: true })
//         .eq("is_read", false)
//         .eq("sender_type", "client")
//         .neq("sender_id", user.id);
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
//       <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
//         <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
//           <div className="h-10 bg-slate-200 rounded-xl animate-pulse w-48" />
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//             {[...Array(3)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-xl p-5 shadow-sm border animate-pulse"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-slate-200 rounded-lg" />
//                   <div className="space-y-2 flex-1">
//                     <div className="h-3 bg-slate-200 rounded w-20" />
//                     <div className="h-6 bg-slate-200 rounded w-10" />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="h-40 bg-slate-200 rounded-xl animate-pulse" />
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) return null;

//   const statsCards = [
//     {
//       title: "Demandes clients",
//       value: stats.totalConsultations,
//       icon: Users,
//       bgColor: "bg-teal-100",
//       textColor: "text-teal-600",
//     },
//     {
//       title: "Répondues",
//       value: stats.consultationsAnswered,
//       icon: CheckCircle,
//       bgColor: "bg-green-100",
//       textColor: "text-green-600",
//     },
//     {
//       title: "Vues du profil",
//       value: stats.profileViews,
//       icon: Eye,
//       bgColor: "bg-blue-100",
//       textColor: "text-blue-600",
//     },
//   ];

//   return (
//     <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
//       <style>{`.page-header, .page-subtitle, .settings-button, .verification-banner, .stats-card, .actions-section, .help-section { opacity: 0; }`}</style>

//       <div className="max-w-7xl mx-auto px-4 py-8" ref={containerRef}>
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="page-header text-2xl sm:text-3xl font-bold text-slate-800">
//               Tableau de bord
//             </h1>
//             <p className="page-subtitle text-slate-600 mt-1 text-sm sm:text-base">
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

//         {!isVerified && (
//           <div className="verification-banner bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
//             <div className="flex items-start gap-3">
//               <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
//               <div>
//                 <h3 className="font-semibold text-amber-800 mb-1">
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

//         {!profile?.avatar_url && (
//           <div className="verification-banner bg-teal-50 border border-teal-200 rounded-xl p-5 mb-6">
//             <div className="flex items-start justify-between gap-4">
//               <div className="flex items-start gap-3">
//                 <div className="w-9 h-9 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center flex-shrink-0">
//                   <Camera className="w-4 h-4 text-teal-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-teal-800 mb-1">
//                     Votre profil est incomplet
//                   </h3>
//                   <p className="text-teal-700 text-sm">
//                     Les avocats avec une photo reçoivent 3x plus de demandes.
//                     Ajoutez votre photo de profil pour attirer plus de clients.
//                   </p>
//                 </div>
//               </div>
//               <Link href="/profile" className="flex-shrink-0">
//                 <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap">
//                   Ajouter ma photo
//                 </button>
//               </Link>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
//           {loadingStats
//             ? [...Array(3)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="bg-white rounded-xl p-5 shadow-sm border animate-pulse"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-slate-200 rounded-lg flex-shrink-0" />
//                     <div className="space-y-2 flex-1">
//                       <div className="h-3 bg-slate-200 rounded w-20" />
//                       <div className="h-6 bg-slate-200 rounded w-10" />
//                     </div>
//                   </div>
//                 </div>
//               ))
//             : statsCards.map((stat, index) => (
//                 <div
//                   key={index}
//                   className="stats-card bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div
//                       className={`p-2.5 rounded-lg ${stat.bgColor} ${stat.textColor} flex-shrink-0`}
//                     >
//                       <stat.icon className="w-5 h-5" />
//                     </div>
//                     <div className="min-w-0">
//                       <p className="text-xs text-slate-500 truncate">
//                         {stat.title}
//                       </p>
//                       <p className="text-2xl font-bold text-slate-800">
//                         {stat.value}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//         </div>

//         <div className="actions-section bg-white rounded-xl p-6 shadow-sm border mb-6">
//           <h2 className="text-lg font-semibold text-slate-800 mb-4">
//             Actions rapides
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//             <button
//               onClick={() => router.push("/lawyer/consultations")}
//               className="p-4 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-colors text-left group cursor-pointer"
//             >
//               <div className="flex items-start gap-3">
//                 <MessageSquare className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
//                 <div>
//                   <h3 className="font-medium text-slate-800 group-hover:text-teal-700 text-sm">
//                     Mes consultations
//                   </h3>
//                   <p className="text-xs text-slate-500 mt-0.5">
//                     {stats.consultationsPending > 0
//                       ? `${stats.consultationsPending} en attente`
//                       : "Aucune en attente"}
//                   </p>
//                 </div>
//               </div>
//             </button>
//             <button
//               onClick={() => router.push("/profile")}
//               className="p-4 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-colors text-left group cursor-pointer"
//             >
//               <div className="flex items-start gap-3">
//                 <Edit className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
//                 <div>
//                   <h3 className="font-medium text-slate-800 group-hover:text-teal-700 text-sm">
//                     Modifier mon profil
//                   </h3>
//                   <p className="text-xs text-slate-500 mt-0.5">
//                     Personnalisez vos informations
//                   </p>
//                 </div>
//               </div>
//             </button>
//             <button
//               onClick={() => router.push(`/lawyers/${user?.id}`)}
//               className="p-4 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-colors text-left group cursor-pointer"
//             >
//               <div className="flex items-start gap-3">
//                 <Eye className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
//                 <div>
//                   <h3 className="font-medium text-slate-800 group-hover:text-teal-700 text-sm">
//                     Mon profil public
//                   </h3>
//                   <p className="text-xs text-slate-500 mt-0.5">
//                     Comment les clients vous voient
//                   </p>
//                 </div>
//               </div>
//             </button>
//           </div>
//         </div>

//         <div className="help-section bg-teal-50 rounded-xl p-6 text-center border border-teal-100">
//           <h2 className="text-base font-semibold text-slate-800 mb-2">
//             Besoin d'aide ?
//           </h2>
//           <p className="text-slate-600 text-sm mb-4">
//             Notre équipe est là pour vous accompagner
//           </p>
//           <a
//             href="mailto:support@mizan-dz.com"
//             className="inline-flex items-center bg-teal-600 text-white px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors cursor-pointer text-sm font-medium"
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
  Camera,
  CreditCard,
  Lock,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
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
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(
    null
  );
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  // Quand Chargily sera actif, remplace `true` par :
  // subscriptionStatus === "active"
  const hasActiveSubscription = true;

  // Quand Chargily sera actif, remplace `true` par :
  // subscriptionStatus === "active" && subscriptionPlan === "12mois"
  const canSeeProfileViews = true;

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/auth/lawyer/login");
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user && profile?.user_type === "lawyer") {
      loadStats();
      checkVerification();
      loadSubscription();
    }
  }, [user, profile]);

  useEffect(() => {
    if (!containerRef.current || loading || loadingStats) return;
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
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
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

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("dashboard-stats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "consultations",
          filter: `lawyer_id=eq.${user.id}`,
        },
        () => loadStats()
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "profile_views",
          filter: `lawyer_id=eq.${user.id}`,
        },
        () => loadStats()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const checkVerification = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("lawyers")
      .select("is_verified")
      .eq("id", user.id)
      .single();
    setIsVerified(data?.is_verified || false);
  };

  const loadSubscription = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("lawyers")
      .select("subscription_status, subscription_plan, subscription_end")
      .eq("id", user.id)
      .single();
    if (data) {
      setSubscriptionStatus(data.subscription_status);
      setSubscriptionPlan(data.subscription_plan);
      setSubscriptionEnd(data.subscription_end);
    }
  };

  const loadStats = async () => {
    if (!user) return;
    try {
      setLoadingStats(true);
      const { count: totalCount } = await supabase
        .from("consultations")
        .select("*", { count: "exact", head: true })
        .eq("lawyer_id", user.id);
      const { count: pendingCount } = await supabase
        .from("consultation_messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false)
        .eq("sender_type", "client")
        .neq("sender_id", user.id);
      const { count: answeredCount } = await supabase
        .from("consultations")
        .select("*", { count: "exact", head: true })
        .eq("lawyer_id", user.id)
        .eq("status", "answered");
      const { count: viewsCount } = await supabase
        .from("profile_views")
        .select("*", { count: "exact", head: true })
        .eq("lawyer_id", user.id);
      setStats({
        totalConsultations: totalCount || 0,
        consultationsPending: pendingCount || 0,
        consultationsAnswered: answeredCount || 0,
        profileViews: viewsCount || 0,
      });
    } catch (error) {
      console.error("Erreur chargement stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const formatSubscriptionEnd = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("fr-DZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getPlanLabel = (plan: string | null) => {
    const labels: Record<string, string> = {
      "3mois": "3 mois",
      "6mois": "6 mois",
      "12mois": "12 mois",
    };
    return plan ? labels[plan] || plan : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <div className="h-10 bg-slate-200 rounded-xl animate-pulse w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 shadow-sm border animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-slate-200 rounded w-20" />
                    <div className="h-6 bg-slate-200 rounded w-10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-40 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <style>{`.page-header, .page-subtitle, .settings-button, .verification-banner, .stats-card, .actions-section, .help-section { opacity: 0; }`}</style>

      <div className="max-w-7xl mx-auto px-4 py-8" ref={containerRef}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-header text-2xl sm:text-3xl font-bold text-slate-800">
              Tableau de bord
            </h1>
            <p className="page-subtitle text-slate-600 mt-1 text-sm sm:text-base">
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

        {/* Bannière vérification en cours */}
        {!isVerified && (
          <div className="verification-banner bg-amber-50 border border-amber-200 rounded-xl p-5 mb-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">
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

        {/* Bannière abonnement — disparaît automatiquement quand hasActiveSubscription = true */}
        {isVerified && !hasActiveSubscription && (
          <div className="verification-banner bg-teal-900 rounded-xl p-5 mb-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-700 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Votre profil n'est pas encore visible
                  </h3>
                  <p className="text-teal-300 text-sm">
                    Activez votre abonnement pour apparaître dans les résultats
                    de recherche et recevoir des demandes de clients.
                  </p>
                </div>
              </div>
              <Link href="/lawyer/abonnements" className="flex-shrink-0">
                <button className="bg-teal-500 hover:bg-teal-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap">
                  Choisir mon abonnement →
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Bannière photo manquante */}
        {!profile?.avatar_url && (
          <div className="verification-banner bg-teal-50 border border-teal-200 rounded-xl p-5 mb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center flex-shrink-0">
                  <Camera className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-teal-800 mb-1">
                    Votre profil est incomplet
                  </h3>
                  <p className="text-teal-700 text-sm">
                    Les avocats avec une photo reçoivent 3x plus de demandes.
                  </p>
                </div>
              </div>
              <Link href="/profile" className="flex-shrink-0">
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap">
                  Ajouter ma photo
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {loadingStats ? (
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 shadow-sm border animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-slate-200 rounded w-20" />
                    <div className="h-6 bg-slate-200 rounded w-10" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="stats-card bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-teal-100 flex-shrink-0">
                    <Users className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 truncate">
                      Demandes clients
                    </p>
                    <p className="text-2xl font-bold text-slate-800">
                      {stats.totalConsultations}
                    </p>
                  </div>
                </div>
              </div>

              <div className="stats-card bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-green-100 flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 truncate">Répondues</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {stats.consultationsAnswered}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vues du profil — plan 12 mois uniquement (actuellement visible pour tous) */}
              {canSeeProfileViews ? (
                <div className="stats-card bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-100 flex-shrink-0">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 truncate">
                        Vues du profil
                      </p>
                      <p className="text-2xl font-bold text-slate-800">
                        {stats.profileViews}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="stats-card bg-slate-50 rounded-xl p-5 shadow-sm border border-dashed border-slate-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-200 flex-shrink-0">
                      <Lock className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-400 truncate">
                        Vues du profil
                      </p>
                      <p className="text-xs text-slate-400 font-medium mt-1">
                        Plan 12 mois
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stat abonnement */}
              <div className="stats-card bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-lg flex-shrink-0 ${subscriptionStatus === "active" ? "bg-teal-100" : "bg-slate-100"}`}
                  >
                    <TrendingUp
                      className={`w-5 h-5 ${subscriptionStatus === "active" ? "text-teal-600" : "text-slate-400"}`}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 truncate">
                      Abonnement
                    </p>
                    {subscriptionStatus === "active" ? (
                      <>
                        <p className="text-sm font-bold text-teal-600">
                          {getPlanLabel(subscriptionPlan)}
                        </p>
                        {subscriptionEnd && (
                          <p className="text-xs text-slate-400">
                            jusqu'au {formatSubscriptionEnd(subscriptionEnd)}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm font-bold text-slate-400">
                        Inactif
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions rapides */}
        <div className="actions-section bg-white rounded-xl p-6 shadow-sm border mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <button
              onClick={() => router.push("/lawyer/consultations")}
              className="p-4 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-slate-800 group-hover:text-teal-700 text-sm">
                    Mes consultations
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {stats.consultationsPending > 0
                      ? `${stats.consultationsPending} en attente`
                      : "Aucune en attente"}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push("/profile")}
              className="p-4 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <Edit className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-slate-800 group-hover:text-teal-700 text-sm">
                    Modifier mon profil
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Personnalisez vos informations
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push(`/lawyers/${user?.id}`)}
              className="p-4 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-slate-800 group-hover:text-teal-700 text-sm">
                    Mon profil public
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Comment les clients vous voient
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push("/lawyer/abonnements")}
              className={`p-4 border rounded-xl transition-colors text-left group cursor-pointer ${
                subscriptionStatus === "active"
                  ? "border-teal-200 hover:border-teal-300 hover:bg-teal-50"
                  : "border-teal-500 bg-teal-50 hover:bg-teal-100"
              }`}
            >
              <div className="flex items-start gap-3">
                <CreditCard
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${subscriptionStatus === "active" ? "text-teal-600" : "text-teal-700"}`}
                />
                <div>
                  <h3
                    className={`font-medium text-sm ${subscriptionStatus === "active" ? "text-slate-800 group-hover:text-teal-700" : "text-teal-700"}`}
                  >
                    Mon abonnement
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {subscriptionStatus === "active"
                      ? `Plan ${getPlanLabel(subscriptionPlan)}`
                      : "Activez votre visibilité"}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Aide */}
        <div className="help-section bg-teal-50 rounded-xl p-6 text-center border border-teal-100">
          <h2 className="text-base font-semibold text-slate-800 mb-2">
            Besoin d'aide ?
          </h2>
          <p className="text-slate-600 text-sm mb-4">
            Notre équipe est là pour vous accompagner
          </p>
          <a
            href="mailto:support@mizan-dz.com"
            className="inline-flex items-center bg-teal-600 text-white px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors cursor-pointer text-sm font-medium"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  );
}
