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
  Settings,
  MessageSquare,
  Eye,
  Edit,
  CheckCircle,
  Camera,
  Lock,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Clock,
  Star,
  BarChart2,
} from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";

export default function LawyerDashboardPage() {
  const supabase = createClient();
  const { profile, user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    answered: 0,
    views: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [subStatus, setSubStatus] = useState<string | null>(null);
  const [subPlan, setSubPlan] = useState<string | null>(null);
  const [subEnd, setSubEnd] = useState<string | null>(null);

  // Abonnement payant = accès aux stats avancées
  const isPaid = subStatus === "active";

  const profession = (profile as any)?.profession || "avocat";
  const PROF: Record<string, string> = {
    avocat: "Avocat",
    notaire: "Notaire",
    huissier: "Huissier",
    comptable: "Comptable",
  };
  const profLabel = PROF[profession] || "Professionnel";
  const initials =
    `${profile?.first_name?.[0] || ""}${profile?.last_name?.[0] || ""}`.toUpperCase();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/auth/lawyer/login");
  }, [loading, isAuthenticated]);
  useEffect(() => {
    if (user && profile?.user_type === "lawyer") {
      loadStats();
      checkVerif();
      loadSub();
    }
  }, [user, profile]);

  useEffect(() => {
    if (loading || loadingStats || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dash-hero",
        { opacity: 0, y: -24 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );
      gsap.fromTo(
        ".dash-stat",
        { opacity: 0, y: 16, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.2,
        }
      );
      gsap.fromTo(
        ".dash-card",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.07,
          ease: "power2.out",
          delay: 0.45,
        }
      );
      gsap.fromTo(
        ".dash-actions",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.65 }
      );
    }, ref);
    return () => ctx.revert();
  }, [loading, loadingStats]);

  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel("db-stats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "consultations",
          filter: `lawyer_id=eq.${user.id}`,
        },
        loadStats
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "profile_views",
          filter: `lawyer_id=eq.${user.id}`,
        },
        loadStats
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user]);

  const checkVerif = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("lawyers")
      .select("is_verified")
      .eq("id", user.id)
      .single();
    setIsVerified(!!data?.is_verified);
  };
  const loadSub = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("lawyers")
      .select("subscription_status,subscription_plan,subscription_end")
      .eq("id", user.id)
      .single();
    if (data) {
      setSubStatus(data.subscription_status);
      setSubPlan(data.subscription_plan);
      setSubEnd(data.subscription_end);
    }
  };
  const loadStats = async () => {
    if (!user) return;
    setLoadingStats(true);
    try {
      const [
        { count: total },
        { count: pending },
        { count: answered },
        { count: views },
      ] = await Promise.all([
        supabase
          .from("consultations")
          .select("*", { count: "exact", head: true })
          .eq("lawyer_id", user.id),
        supabase
          .from("consultation_messages")
          .select("*", { count: "exact", head: true })
          .eq("is_read", false)
          .eq("sender_type", "client")
          .neq("sender_id", user.id),
        supabase
          .from("consultations")
          .select("*", { count: "exact", head: true })
          .eq("lawyer_id", user.id)
          .eq("status", "answered"),
        supabase
          .from("profile_views")
          .select("*", { count: "exact", head: true })
          .eq("lawyer_id", user.id),
      ]);
      setStats({
        total: total || 0,
        pending: pending || 0,
        answered: answered || 0,
        views: views || 0,
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const planLabel = (p: string | null) =>
    ({ "3mois": "3 mois", "6mois": "6 mois", "12mois": "12 mois" })[p || ""] ||
    p;
  const fmtDate = (d: string | null) =>
    d
      ? new Date(d).toLocaleDateString("fr-DZ", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;

  if (loading)
    return (
      <div className="min-h-screen pt-16 bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent" />
      </div>
    );
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen pt-16 bg-slate-50" ref={ref}>
      <style>{`
        .dash-hero,.dash-stat,.dash-card,.dash-actions{opacity:0;}
        .stat-glow{box-shadow:0 0 0 1px rgba(20,184,166,0.15),0 4px 24px rgba(20,184,166,0.08);}
      `}</style>

      {/* ── Header bande teal ── */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-teal-500 pt-8 pb-20">
        <div className="max-w-5xl mx-auto px-4 dash-hero">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                ) : (
                  initials
                )}
              </div>
              <div>
                <p className="text-teal-200 text-xs font-medium uppercase tracking-widest mb-0.5">
                  {profLabel}
                </p>
                <h1 className="text-white text-xl sm:text-2xl font-bold leading-tight">
                  Bonjour, {profile?.first_name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 text-xs text-teal-100 font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Profil vérifié
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-200 font-medium">
                      <Clock className="w-3 h-3" />
                      Vérification en cours
                    </span>
                  )}
                  <span className="text-teal-400">·</span>
                  <span className="text-xs text-teal-200">
                    {isPaid
                      ? `Abonnement ${planLabel(subPlan)}`
                      : "Lancement gratuit"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push("/settings")}
              className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-14 pb-12">
        {/* ── Stats flottantes ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {/* Demandes */}
          <div className="dash-stat bg-white rounded-2xl p-5 stat-glow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-teal-50 rounded-bl-3xl" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
              Demandes
            </p>
            <p className="text-3xl font-bold text-slate-800">
              {loadingStats ? "—" : stats.total}
            </p>
            {stats.pending > 0 && (
              <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-red-50 text-red-600 text-[11px] font-semibold rounded-full border border-red-100">
                {stats.pending} non lu{stats.pending > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Répondues */}
          <div className="dash-stat bg-white rounded-2xl p-5 stat-glow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-3xl" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
              Répondues
            </p>
            <p className="text-3xl font-bold text-slate-800">
              {loadingStats ? "—" : stats.answered}
            </p>
            {stats.total > 0 && (
              <p className="text-[11px] text-slate-400 mt-2">
                {Math.round((stats.answered / stats.total) * 100)}% de taux
              </p>
            )}
          </div>

          {/* Vues profil — payant */}
          <div
            className={`dash-stat rounded-2xl p-5 relative overflow-hidden ${isPaid ? "bg-white stat-glow" : "bg-slate-100 border border-dashed border-slate-300"}`}
          >
            {isPaid ? (
              <>
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-3xl" />
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                  Vues profil
                </p>
                <p className="text-3xl font-bold text-slate-800">
                  {loadingStats ? "—" : stats.views}
                </p>
                <p className="text-[11px] text-slate-400 mt-2">ce mois</p>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-slate-400 mb-2" />
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                  Vues profil
                </p>
                <p className="text-sm font-semibold text-slate-400">
                  Abonnement
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Bientôt disponible
                </p>
              </>
            )}
          </div>

          {/* Score / Abonnement */}
          <div
            className={`dash-stat rounded-2xl p-5 relative overflow-hidden ${isPaid ? "bg-teal-600" : "bg-slate-800"}`}
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-bl-3xl" />
            {isPaid ? (
              <>
                <Star className="w-4 h-4 text-teal-200 mb-2" />
                <p className="text-xs font-semibold text-teal-200 uppercase tracking-wide mb-1">
                  Abonnement
                </p>
                <p className="text-lg font-bold text-white">
                  {planLabel(subPlan)}
                </p>
                {subEnd && (
                  <p className="text-[11px] text-teal-300 mt-1">
                    jusqu'au {fmtDate(subEnd)}
                  </p>
                )}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-400 mb-2" />
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                  Abonnement
                </p>
                <p className="text-sm font-bold text-slate-300">
                  Lancement gratuit
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Paiement bientôt →
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── Banners contextuelles ── */}
        {!isVerified && (
          <div className="dash-card mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Vérification en cours · 24-48h
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Nos équipes vérifient vos informations. Email de confirmation à
                venir.
              </p>
            </div>
          </div>
        )}

        {!profile?.avatar_url && (
          <div className="dash-card mb-4 bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                <Camera className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Ajoutez votre photo
                </p>
                <p className="text-xs text-slate-500">
                  3× plus de demandes avec une photo professionnelle
                </p>
              </div>
            </div>
            <Link href="/profile">
              <button className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors whitespace-nowrap">
                Ajouter <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
        )}

        {/* ── Actions rapides ── */}
        <div className="dash-actions grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {/* Consultations */}
          <button
            onClick={() => router.push("/lawyer/consultations")}
            className="group relative bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-2xl p-5 text-left transition-all cursor-pointer"
          >
            {stats.pending > 0 && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {stats.pending > 9 ? "9+" : stats.pending}
              </span>
            )}
            <div className="w-10 h-10 rounded-xl bg-teal-50 group-hover:bg-teal-100 flex items-center justify-center mb-3 transition-colors">
              <MessageSquare className="w-5 h-5 text-teal-600" />
            </div>
            <p className="text-sm font-bold text-slate-800 group-hover:text-teal-700">
              Mes consultations
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {stats.pending > 0
                ? `${stats.pending} message${stats.pending > 1 ? "s" : ""} non lu${stats.pending > 1 ? "s" : ""}`
                : "Tout est à jour"}
            </p>
          </button>

          {/* Modifier profil */}
          <button
            onClick={() => router.push("/profile")}
            className="group bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl p-5 text-left transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center mb-3 transition-colors">
              <Edit className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              Modifier mon profil
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Spécialités · Langues · Adresse
            </p>
          </button>

          {/* Profil public */}
          <button
            onClick={() => router.push(`/lawyer/${user?.id}`)}
            className="group bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl p-5 text-left transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors">
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              Mon profil public
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Tel que les clients vous voient
            </p>
          </button>
        </div>

        {/* ── Aide ── */}
        <div className="dash-card bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-bold text-slate-800">Besoin d'aide ?</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Notre équipe répond sous 24h
            </p>
          </div>
          <a
            href="mailto:support@mizan-dz.com"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Nous contacter <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

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
//   CreditCard,
//   Lock,
//   TrendingUp,
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
//   const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(
//     null
//   );
//   const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
//   const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

//   const hasActiveSubscription = false; // Chargily non implémenté
//   const canSeeProfileViews = true;

//   const profession = (profile as any)?.profession || "avocat";
//   const PROF_LABELS: Record<string, string> = {
//     avocat: "Avocat",
//     notaire: "Notaire",
//     huissier: "Huissier",
//     comptable: "Comptable",
//   };
//   const profLabel = PROF_LABELS[profession] || "Professionnel";

//   useEffect(() => {
//     if (!loading && !isAuthenticated) router.push("/auth/lawyer/login");
//   }, [loading, isAuthenticated, router]);

//   useEffect(() => {
//     if (user && profile?.user_type === "lawyer") {
//       loadStats();
//       checkVerification();
//       loadSubscription();
//     }
//   }, [user, profile]);

//   useEffect(() => {
//     if (!containerRef.current || loading || loadingStats) return;
//     gsap
//       .timeline()
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

//   const loadSubscription = async () => {
//     if (!user) return;
//     const { data } = await supabase
//       .from("lawyers")
//       .select("subscription_status,subscription_plan,subscription_end")
//       .eq("id", user.id)
//       .single();
//     if (data) {
//       setSubscriptionStatus(data.subscription_status);
//       setSubscriptionPlan(data.subscription_plan);
//       setSubscriptionEnd(data.subscription_end);
//     }
//   };

//   const loadStats = async () => {
//     if (!user) return;
//     try {
//       setLoadingStats(true);
//       const [
//         { count: totalCount },
//         { count: pendingCount },
//         { count: answeredCount },
//         { count: viewsCount },
//       ] = await Promise.all([
//         supabase
//           .from("consultations")
//           .select("*", { count: "exact", head: true })
//           .eq("lawyer_id", user.id),
//         supabase
//           .from("consultation_messages")
//           .select("*", { count: "exact", head: true })
//           .eq("is_read", false)
//           .eq("sender_type", "client")
//           .neq("sender_id", user.id),
//         supabase
//           .from("consultations")
//           .select("*", { count: "exact", head: true })
//           .eq("lawyer_id", user.id)
//           .eq("status", "answered"),
//         supabase
//           .from("profile_views")
//           .select("*", { count: "exact", head: true })
//           .eq("lawyer_id", user.id),
//       ]);
//       setStats({
//         totalConsultations: totalCount || 0,
//         consultationsPending: pendingCount || 0,
//         consultationsAnswered: answeredCount || 0,
//         profileViews: viewsCount || 0,
//       });
//     } catch {
//     } finally {
//       setLoadingStats(false);
//     }
//   };

//   const fmtDate = (d: string | null) =>
//     d
//       ? new Date(d).toLocaleDateString("fr-DZ", {
//           day: "numeric",
//           month: "long",
//           year: "numeric",
//         })
//       : null;
//   const planLabel = (p: string | null) =>
//     ({ "3mois": "3 mois", "6mois": "6 mois", "12mois": "12 mois" })[p || ""] ||
//     p;

//   if (loading)
//     return (
//       <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
//         <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
//           <div className="h-10 bg-slate-200 rounded-xl animate-pulse w-48" />
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//             {[...Array(4)].map((_, i) => (
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
//         </div>
//       </div>
//     );
//   if (!isAuthenticated) return null;

//   return (
//     <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
//       <style>{`.page-header,.page-subtitle,.settings-button,.verification-banner,.stats-card,.actions-section,.help-section{opacity:0;}`}</style>
//       <div className="max-w-7xl mx-auto px-4 py-8" ref={containerRef}>
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="page-header text-2xl sm:text-3xl font-bold text-slate-800">
//               Tableau de bord
//             </h1>
//             <p className="page-subtitle text-slate-600 mt-1 text-sm sm:text-base">
//               Bonjour {profile?.first_name}, bienvenue sur votre espace{" "}
//               {profLabel.toLowerCase()}
//             </p>
//           </div>
//           <button
//             onClick={() => router.push("/settings")}
//             className="settings-button p-2 text-slate-600 hover:text-slate-800 hover:bg-white rounded-lg transition-colors"
//           >
//             <Settings className="w-6 h-6 cursor-pointer" />
//           </button>
//         </div>

//         {/* Banner vérification en cours */}
//         {!isVerified && (
//           <div className="verification-banner bg-amber-50 border border-amber-200 rounded-xl p-5 mb-4">
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

//         {/* Banner photo manquante */}
//         {!profile?.avatar_url && (
//           <div className="verification-banner bg-teal-50 border border-teal-200 rounded-xl p-5 mb-4">
//             <div className="flex items-start justify-between gap-4">
//               <div className="flex items-start gap-3">
//                 <div className="w-9 h-9 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center flex-shrink-0">
//                   <Camera className="w-4 h-4 text-teal-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-teal-800 mb-1">
//                     Profil incomplet
//                   </h3>
//                   <p className="text-teal-700 text-sm">
//                     Les professionnels avec une photo reçoivent 3× plus de
//                     demandes.
//                   </p>
//                 </div>
//               </div>
//               <Link href="/profile" className="flex-shrink-0">
//                 <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap">
//                   Ajouter ma photo
//                 </button>
//               </Link>
//             </div>
//           </div>
//         )}

//         {/* Banner abonnement — paiement bientôt disponible */}
//         {isVerified && (
//           <div className="verification-banner bg-slate-800 rounded-xl p-5 mb-4">
//             <div className="flex items-start justify-between gap-4 flex-wrap">
//               <div className="flex items-start gap-3">
//                 <div className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
//                   <CreditCard className="w-4 h-4 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-white mb-1">
//                     Abonnement — Bientôt disponible
//                   </h3>
//                   <p className="text-slate-300 text-sm">
//                     Le paiement en ligne sera disponible prochainement. Votre
//                     profil est visible gratuitement pendant la phase de
//                     lancement.
//                   </p>
//                 </div>
//               </div>
//               {/* Bouton désactivé — pas de Chargily encore */}
//               <button
//                 disabled
//                 className="flex-shrink-0 bg-slate-600 text-slate-400 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed whitespace-nowrap"
//               >
//                 Paiement bientôt →
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Stats */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
//           {loadingStats ? (
//             [...Array(4)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-xl p-5 shadow-sm border animate-pulse"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-slate-200 rounded-lg flex-shrink-0" />
//                   <div className="space-y-2 flex-1">
//                     <div className="h-3 bg-slate-200 rounded w-20" />
//                     <div className="h-6 bg-slate-200 rounded w-10" />
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <>
//               {/* Demandes clients */}
//               <div className="stats-card bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2.5 rounded-lg bg-teal-100 flex-shrink-0">
//                     <Users className="w-5 h-5 text-teal-600" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-xs text-slate-500 truncate">
//                       Demandes clients
//                     </p>
//                     <p className="text-2xl font-bold text-slate-800">
//                       {stats.totalConsultations}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Répondues */}
//               <div className="stats-card bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2.5 rounded-lg bg-green-100 flex-shrink-0">
//                     <CheckCircle className="w-5 h-5 text-green-600" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-xs text-slate-500 truncate">Répondues</p>
//                     <p className="text-2xl font-bold text-slate-800">
//                       {stats.consultationsAnswered}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Vues profil */}
//               {canSeeProfileViews ? (
//                 <div className="stats-card bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2.5 rounded-lg bg-blue-100 flex-shrink-0">
//                       <Eye className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <div className="min-w-0">
//                       <p className="text-xs text-slate-500 truncate">
//                         Vues du profil
//                       </p>
//                       <p className="text-2xl font-bold text-slate-800">
//                         {stats.profileViews}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="stats-card bg-slate-50 rounded-xl p-5 shadow-sm border border-dashed border-slate-300">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2.5 rounded-lg bg-slate-200 flex-shrink-0">
//                       <Lock className="w-5 h-5 text-slate-400" />
//                     </div>
//                     <div className="min-w-0">
//                       <p className="text-xs text-slate-400 truncate">
//                         Vues du profil
//                       </p>
//                       <p className="text-xs text-slate-400 font-medium mt-1">
//                         Plan 12 mois
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Abonnement */}
//               <div className="stats-card bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow">
//                 <div className="flex items-center gap-3">
//                   <div
//                     className={`p-2.5 rounded-lg flex-shrink-0 ${subscriptionStatus === "active" ? "bg-teal-100" : "bg-slate-100"}`}
//                   >
//                     <TrendingUp
//                       className={`w-5 h-5 ${subscriptionStatus === "active" ? "text-teal-600" : "text-slate-400"}`}
//                     />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-xs text-slate-500 truncate">
//                       Abonnement
//                     </p>
//                     {subscriptionStatus === "active" ? (
//                       <>
//                         <p className="text-sm font-bold text-teal-600">
//                           {planLabel(subscriptionPlan)}
//                         </p>
//                         {subscriptionEnd && (
//                           <p className="text-xs text-slate-400">
//                             jusqu'au {fmtDate(subscriptionEnd)}
//                           </p>
//                         )}
//                       </>
//                     ) : (
//                       <p className="text-sm font-bold text-slate-400">
//                         Lancement gratuit
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Actions rapides */}
//         <div className="actions-section bg-white rounded-xl p-6 shadow-sm border mb-6">
//           <h2 className="text-lg font-semibold text-slate-800 mb-4">
//             Actions rapides
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//             {/* Mes consultations — badge rouge si messages en attente */}
//             <button
//               onClick={() => router.push("/lawyer/consultations")}
//               className="p-4 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-colors text-left group cursor-pointer relative"
//             >
//               {stats.consultationsPending > 0 && (
//                 <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                   {stats.consultationsPending > 9
//                     ? "9+"
//                     : stats.consultationsPending}
//                 </span>
//               )}
//               <div className="flex items-start gap-3">
//                 <MessageSquare className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
//                 <div>
//                   <h3 className="font-medium text-slate-800 group-hover:text-teal-700 text-sm">
//                     Mes consultations
//                   </h3>
//                   <p className="text-xs text-slate-500 mt-0.5">
//                     {stats.consultationsPending > 0
//                       ? `${stats.consultationsPending} message${stats.consultationsPending > 1 ? "s" : ""} non lu${stats.consultationsPending > 1 ? "s" : ""}`
//                       : "Aucun message en attente"}
//                   </p>
//                 </div>
//               </div>
//             </button>

//             {/* Modifier profil */}
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
//                     Spécialités, langues, adresse
//                   </p>
//                 </div>
//               </div>
//             </button>

//             {/* Profil public */}
//             <button
//               onClick={() => router.push(`/lawyer/${user?.id}`)}
//               className="p-4 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-colors text-left group cursor-pointer"
//             >
//               <div className="flex items-start gap-3">
//                 <Eye className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
//                 <div>
//                   <h3 className="font-medium text-slate-800 group-hover:text-teal-700 text-sm">
//                     Mon profil public
//                   </h3>
//                   <p className="text-xs text-slate-500 mt-0.5">
//                     Tel que les clients vous voient
//                   </p>
//                 </div>
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Aide */}
//         <div className="help-section bg-teal-50 rounded-xl p-6 text-center border border-teal-100">
//           <h2 className="text-base font-semibold text-slate-800 mb-2">
//             Besoin d'aide ?
//           </h2>
//           <p className="text-slate-600 text-sm mb-4">
//             Notre équipe est disponible pour vous accompagner
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
