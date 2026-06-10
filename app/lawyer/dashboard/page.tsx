// "use client";
// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { createClient } from "@/lib/supabase/client";
// import { useAuth } from "@/hooks/useAuth";
// import {
//   Settings,
//   MessageSquare,
//   Eye,
//   Edit,
//   Camera,
//   CheckCircle,
//   Clock,
//   ChevronRight,
//   Users,
// } from "lucide-react";
// import Link from "next/link";
// import { gsap } from "gsap";

// const PROF_LABELS: Record<string, string> = {
//   avocat: "Avocat",
//   notaire: "Notaire",
//   huissier: "Huissier",
//   comptable: "Comptable",
// };

// export default function LawyerDashboardPage() {
//   const supabase = createClient();
//   const { profile, user, isAuthenticated, loading } = useAuth();
//   const router = useRouter();
//   const ref = useRef<HTMLDivElement>(null);

//   const [stats, setStats] = useState({
//     total: 0,
//     pending: 0,
//     answered: 0,
//     views: 0,
//   });
//   const [loadingStats, setLoadingStats] = useState(true);
//   const [isVerified, setIsVerified] = useState(false);
//   const [subStatus, setSubStatus] = useState<string | null>(null);
//   const [subPlan, setSubPlan] = useState<string | null>(null);
//   const [subEnd, setSubEnd] = useState<string | null>(null);

//   const profession = (profile as any)?.profession || "avocat";
//   const profLabel = PROF_LABELS[profession] || "Professionnel";
//   const initials =
//     `${profile?.first_name?.[0] || ""}${profile?.last_name?.[0] || ""}`.toUpperCase();

//   useEffect(() => {
//     if (!loading && !isAuthenticated) router.push("/auth/lawyer/login");
//   }, [loading, isAuthenticated]);
//   useEffect(() => {
//     if (user && profile?.user_type === "lawyer") {
//       loadStats();
//       checkVerif();
//       loadSub();
//     }
//   }, [user, profile]);

//   useEffect(() => {
//     if (loading || loadingStats || !ref.current) return;
//     gsap.fromTo(
//       ".d-fade",
//       { opacity: 0, y: 14 },
//       { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power2.out" }
//     );
//   }, [loading, loadingStats]);

//   useEffect(() => {
//     if (!user) return;
//     const ch = supabase
//       .channel("dash")
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "consultations",
//           filter: `lawyer_id=eq.${user.id}`,
//         },
//         loadStats
//       )
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "profile_views",
//           filter: `lawyer_id=eq.${user.id}`,
//         },
//         loadStats
//       )
//       .subscribe();
//     return () => {
//       supabase.removeChannel(ch);
//     };
//   }, [user]);

//   const checkVerif = async () => {
//     if (!user) return;
//     const { data } = await supabase
//       .from("lawyers")
//       .select("is_verified")
//       .eq("id", user.id)
//       .single();
//     setIsVerified(!!data?.is_verified);
//   };
//   const loadSub = async () => {
//     if (!user) return;
//     const { data } = await supabase
//       .from("lawyers")
//       .select("subscription_status,subscription_plan,subscription_end")
//       .eq("id", user.id)
//       .single();
//     if (data) {
//       setSubStatus(data.subscription_status);
//       setSubPlan(data.subscription_plan);
//       setSubEnd(data.subscription_end);
//     }
//   };
//   const loadStats = async () => {
//     if (!user) return;
//     setLoadingStats(true);
//     try {
//       const [
//         { count: total },
//         { count: pending },
//         { count: answered },
//         { count: views },
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
//         total: total || 0,
//         pending: pending || 0,
//         answered: answered || 0,
//         views: views || 0,
//       });
//     } finally {
//       setLoadingStats(false);
//     }
//   };

//   const planLabel = (p: string | null) =>
//     ({ "3mois": "3 mois", "6mois": "6 mois", "12mois": "12 mois" })[p || ""] ||
//     p;
//   const fmtDate = (d: string | null) =>
//     d
//       ? new Date(d).toLocaleDateString("fr-DZ", {
//           day: "numeric",
//           month: "short",
//           year: "numeric",
//         })
//       : null;

//   if (loading)
//     return (
//       <div className="min-h-screen pt-16 bg-teal-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-7 w-7 border-2 border-teal-600 border-t-transparent" />
//       </div>
//     );
//   if (!isAuthenticated) return null;

//   const ACTIONS = [
//     {
//       icon: MessageSquare,
//       label: "Consultations",
//       sub:
//         stats.pending > 0
//           ? `${stats.pending} message${stats.pending > 1 ? "s" : ""} non lu${stats.pending > 1 ? "s" : ""}`
//           : "Aucun message en attente",
//       href: "/lawyer/consultations",
//       badge: stats.pending,
//     },
//     {
//       icon: Edit,
//       label: "Modifier mon profil",
//       sub: "Spécialités · Langues · Adresse",
//       href: "/profile",
//     },
//     {
//       icon: Eye,
//       label: "Profil public",
//       sub: "Tel que les clients vous voient",
//       href: `/lawyers/${user?.id}`,
//     },
//   ];

//   return (
//     <div className="min-h-screen pt-16 bg-teal-50" ref={ref}>
//       <style>{`.d-fade{opacity:0;}`}</style>

//       <div className="max-w-3xl mx-auto px-4 py-8">
//         {/* ── Header profil ── */}
//         <div className="d-fade flex items-center justify-between mb-7">
//           <div className="flex items-center gap-3">
//             <div className="w-11 h-11 rounded-2xl bg-teal-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 overflow-hidden">
//               {profile?.avatar_url ? (
//                 <img
//                   src={profile.avatar_url}
//                   className="w-full h-full object-cover"
//                   alt=""
//                 />
//               ) : (
//                 initials
//               )}
//             </div>
//             <div>
//               <p className="text-base font-bold text-teal-900 leading-tight">
//                 {profile?.first_name} {profile?.last_name}
//               </p>
//               <div className="flex items-center gap-2 mt-0.5">
//                 <span className="text-xs text-teal-600 font-medium">
//                   {profLabel}
//                 </span>
//                 {isVerified ? (
//                   <span className="inline-flex items-center gap-1 text-xs text-teal-600 font-medium">
//                     <CheckCircle className="w-3 h-3" />
//                     Vérifiée
//                   </span>
//                 ) : (
//                   <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
//                     <Clock className="w-3 h-3" />
//                     En cours
//                   </span>
//                 )}
//                 <span className="text-teal-300">·</span>
//                 <span className="text-xs text-teal-500">
//                   {subStatus === "active"
//                     ? `Plan ${planLabel(subPlan)}`
//                     : "Lancement gratuit"}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <button
//             onClick={() => router.push("/settings")}
//             className="w-9 h-9 rounded-xl bg-white border border-teal-100 flex items-center justify-center text-teal-600 hover:bg-teal-50 transition-colors cursor-pointer"
//           >
//             <Settings className="w-4 h-4" />
//           </button>
//         </div>

//         {/* ── Banner photo manquante ── */}
//         {!profile?.avatar_url && (
//           <div className="d-fade mb-5 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
//             <Camera className="w-4 h-4 text-amber-500 flex-shrink-0" />
//             <div className="flex-1">
//               <p className="text-sm font-semibold text-amber-800">
//                 Ajoutez votre photo
//               </p>
//               <p className="text-xs text-amber-600 mt-0.5">
//                 3× plus de demandes avec une photo professionnelle
//               </p>
//             </div>
//             <Link href="/profile">
//               <button className="text-xs font-semibold text-amber-700 hover:text-amber-900 cursor-pointer whitespace-nowrap">
//                 Ajouter →
//               </button>
//             </Link>
//           </div>
//         )}

//         {/* ── Banners vérification ── */}
//         {!isVerified && (
//           <div className="d-fade mb-5 flex items-center gap-3 bg-white border border-teal-100 rounded-2xl px-4 py-3">
//             <Clock className="w-4 h-4 text-teal-500 flex-shrink-0" />
//             <div>
//               <p className="text-sm font-semibold text-teal-800">
//                 Vérification en cours · 24-48h
//               </p>
//               <p className="text-xs text-teal-600 mt-0.5">
//                 Email de confirmation à venir.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* ── Stats — 4 cards ── */}
//         <div className="d-fade grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
//           {/* Demandes */}
//           <div className="bg-white border border-teal-100 rounded-2xl p-4">
//             <div className="flex items-center justify-between mb-3">
//               <Users className="w-4 h-4 text-teal-400" />
//               {stats.pending > 0 && (
//                 <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
//                   {stats.pending}
//                 </span>
//               )}
//             </div>
//             <p className="text-[11px] text-teal-500 font-semibold uppercase tracking-wide mb-1">
//               Demandes
//             </p>
//             <p className="text-3xl font-bold text-teal-900 leading-none">
//               {loadingStats ? (
//                 <span className="text-teal-200">—</span>
//               ) : (
//                 stats.total
//               )}
//             </p>
//           </div>

//           {/* Répondues */}
//           <div className="bg-white border border-teal-100 rounded-2xl p-4">
//             <div className="flex items-center justify-between mb-3">
//               <CheckCircle className="w-4 h-4 text-teal-400" />
//             </div>
//             <p className="text-[11px] text-teal-500 font-semibold uppercase tracking-wide mb-1">
//               Répondues
//             </p>
//             <p className="text-3xl font-bold text-teal-900 leading-none">
//               {loadingStats ? (
//                 <span className="text-teal-200">—</span>
//               ) : (
//                 stats.answered
//               )}
//             </p>
//             {stats.total > 0 && (
//               <p className="text-[11px] text-teal-400 mt-1.5">
//                 {Math.round((stats.answered / stats.total) * 100)}%
//               </p>
//             )}
//           </div>

//           {/* Vues */}
//           <div className="bg-white border border-teal-100 rounded-2xl p-4">
//             <div className="flex items-center justify-between mb-3">
//               <Eye className="w-4 h-4 text-teal-400" />
//             </div>
//             <p className="text-[11px] text-teal-500 font-semibold uppercase tracking-wide mb-1">
//               Vues profil
//             </p>
//             <p className="text-3xl font-bold text-teal-900 leading-none">
//               {loadingStats ? (
//                 <span className="text-teal-200">—</span>
//               ) : (
//                 stats.views
//               )}
//             </p>
//           </div>

//           {/* Abonnement */}
//           <div className="bg-teal-700 border border-teal-600 rounded-2xl p-4">
//             <div className="flex items-center justify-between mb-3">
//               <Settings className="w-4 h-4 text-teal-300" />
//             </div>
//             <p className="text-[11px] text-teal-300 font-semibold uppercase tracking-wide mb-1">
//               Abonnement
//             </p>
//             <p className="text-sm font-bold text-white leading-tight">
//               {subStatus === "active"
//                 ? `Plan ${planLabel(subPlan)}`
//                 : "Lancement gratuit"}
//             </p>
//             {subStatus === "active" && subEnd && (
//               <p className="text-[10px] text-teal-300 mt-1">
//                 jusqu'au {fmtDate(subEnd)}
//               </p>
//             )}
//             {subStatus !== "active" && (
//               <p className="text-[10px] text-teal-400 mt-1">Paiement bientôt</p>
//             )}
//           </div>
//         </div>

//         {/* ── Actions — 3 cards ── */}
//         <div className="d-fade grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
//           {ACTIONS.map((item, i) => (
//             <Link key={i} href={item.href}>
//               <div className="group bg-white border border-teal-100 rounded-2xl p-4 hover:border-teal-300 hover:bg-teal-50 transition-all cursor-pointer h-full">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="w-8 h-8 rounded-xl bg-teal-50 group-hover:bg-white flex items-center justify-center transition-colors">
//                     <item.icon className="w-4 h-4 text-teal-600" />
//                   </div>
//                   {(item.badge || 0) > 0 && (
//                     <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
//                       {(item.badge || 0) > 9 ? "9+" : item.badge}
//                     </span>
//                   )}
//                   {!(item.badge || 0) && (
//                     <ChevronRight className="w-4 h-4 text-teal-200 group-hover:text-teal-400 transition-colors" />
//                   )}
//                 </div>
//                 <p className="text-sm font-bold text-teal-900">{item.label}</p>
//                 <p className="text-xs text-teal-500 mt-0.5">{item.sub}</p>
//               </div>
//             </Link>
//           ))}
//         </div>

//         {/* ── Aide ── */}
//         <div className="d-fade flex items-center justify-between bg-white border border-teal-100 rounded-2xl px-5 py-4">
//           <div>
//             <p className="text-sm font-bold text-teal-900">Besoin d'aide ?</p>
//             <p className="text-xs text-teal-500 mt-0.5">
//               support@mizan-dz.com · Réponse sous 24h
//             </p>
//           </div>
//           <a
//             href="mailto:support@mizan-dz.com"
//             className="text-xs font-semibold text-teal-600 hover:text-teal-800 cursor-pointer transition-colors"
//           >
//             Contacter →
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import dynamic from "next/dynamic";
const AvailabilityManager = dynamic(
  () => import("@/components/booking/AvailabilityManager"),
  { ssr: false }
);
const PricingManager = dynamic(
  () => import("@/components/consultation/PricingManager"),
  { ssr: false }
);
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Settings,
  MessageSquare,
  Eye,
  Edit,
  Camera,
  CheckCircle,
  Clock,
  ChevronRight,
  Users,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";

const PROF_LABELS: Record<string, string> = {
  avocat: "Avocat",
  notaire: "Notaire",
  huissier: "Huissier",
  comptable: "Comptable",
};

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

  const profession = (profile as any)?.profession || "avocat";
  const profLabel = PROF_LABELS[profession] || "Professionnel";
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
    gsap.fromTo(
      ".d-fade",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power2.out" }
    );
  }, [loading, loadingStats]);

  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel("dash")
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
      <div className="min-h-screen pt-16 bg-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-7 w-7 border-2 border-teal-600 border-t-transparent" />
      </div>
    );
  if (!isAuthenticated) return null;

  const ACTIONS = [
    {
      icon: MessageSquare,
      label: "Consultations",
      sub:
        stats.pending > 0
          ? `${stats.pending} message${stats.pending > 1 ? "s" : ""} non lu${stats.pending > 1 ? "s" : ""}`
          : "Aucun message en attente",
      href: "/lawyer/consultations",
      badge: stats.pending,
    },
    {
      icon: Edit,
      label: "Modifier mon profil",
      sub: "Spécialités · Langues · Adresse",
      href: "/profile",
    },
    {
      icon: Eye,
      label: "Profil public",
      sub: "Tel que les clients vous voient",
      href: `/lawyer/${user?.id}`,
    },
  ];

  return (
    <div className="min-h-screen pt-16 bg-teal-50" ref={ref}>
      <style>{`.d-fade{opacity:0;}`}</style>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* ── Header profil ── */}
        <div className="d-fade flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 overflow-hidden">
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
              <p className="text-base font-bold text-teal-900 leading-tight">
                {profile?.first_name} {profile?.last_name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-teal-600 font-medium">
                  {profLabel}
                </span>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 text-xs text-teal-600 font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Vérifiée
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                    <Clock className="w-3 h-3" />
                    En cours
                  </span>
                )}
                <span className="text-teal-300">·</span>
                <span className="text-xs text-teal-500">
                  {subStatus === "active"
                    ? `Plan ${planLabel(subPlan)}`
                    : "Lancement gratuit"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push("/settings")}
            className="w-9 h-9 rounded-xl bg-white border border-teal-100 flex items-center justify-center text-teal-600 hover:bg-teal-50 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* ── Banner photo manquante ── */}
        {!profile?.avatar_url && (
          <div className="d-fade mb-5 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
            <Camera className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">
                Ajoutez votre photo
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                3× plus de demandes avec une photo professionnelle
              </p>
            </div>
            <Link href="/profile">
              <button className="text-xs font-semibold text-amber-700 hover:text-amber-900 cursor-pointer whitespace-nowrap">
                Ajouter →
              </button>
            </Link>
          </div>
        )}

        {/* ── Banners vérification ── */}
        {!isVerified && (
          <div className="d-fade mb-5 flex items-center gap-3 bg-white border border-teal-100 rounded-2xl px-4 py-3">
            <Clock className="w-4 h-4 text-teal-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-teal-800">
                Vérification en cours · 24-48h
              </p>
              <p className="text-xs text-teal-600 mt-0.5">
                Email de confirmation à venir.
              </p>
            </div>
          </div>
        )}

        {/* ── Stats — 4 cards ── */}
        <div className="d-fade grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {/* Demandes */}
          <div className="bg-white border border-teal-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-4 h-4 text-teal-400" />
              {stats.pending > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                  {stats.pending}
                </span>
              )}
            </div>
            <p className="text-[11px] text-teal-500 font-semibold uppercase tracking-wide mb-1">
              Demandes
            </p>
            <p className="text-3xl font-bold text-teal-900 leading-none">
              {loadingStats ? (
                <span className="text-teal-200">—</span>
              ) : (
                stats.total
              )}
            </p>
          </div>

          {/* Répondues */}
          <div className="bg-white border border-teal-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-[11px] text-teal-500 font-semibold uppercase tracking-wide mb-1">
              Répondues
            </p>
            <p className="text-3xl font-bold text-teal-900 leading-none">
              {loadingStats ? (
                <span className="text-teal-200">—</span>
              ) : (
                stats.answered
              )}
            </p>
            {stats.total > 0 && (
              <p className="text-[11px] text-teal-400 mt-1.5">
                {Math.round((stats.answered / stats.total) * 100)}%
              </p>
            )}
          </div>

          {/* Vues */}
          <div className="bg-white border border-teal-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Eye className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-[11px] text-teal-500 font-semibold uppercase tracking-wide mb-1">
              Vues profil
            </p>
            <p className="text-3xl font-bold text-teal-900 leading-none">
              {loadingStats ? (
                <span className="text-teal-200">—</span>
              ) : (
                stats.views
              )}
            </p>
          </div>

          {/* Abonnement */}
          <div className="bg-teal-700 border border-teal-600 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <Settings className="w-4 h-4 text-teal-300" />
            </div>
            <p className="text-[11px] text-teal-300 font-semibold uppercase tracking-wide mb-1">
              Abonnement
            </p>
            <p className="text-sm font-bold text-white leading-tight">
              {subStatus === "active"
                ? `Plan ${planLabel(subPlan)}`
                : "Lancement gratuit"}
            </p>
            {subStatus === "active" && subEnd && (
              <p className="text-[10px] text-teal-300 mt-1">
                jusqu'au {fmtDate(subEnd)}
              </p>
            )}
            {subStatus !== "active" && (
              <p className="text-[10px] text-teal-400 mt-1">Paiement bientôt</p>
            )}
          </div>
        </div>

        {/* ── Actions — 3 cards ── */}
        <div className="d-fade grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {ACTIONS.map((item, i) => (
            <Link key={i} href={item.href}>
              <div className="group bg-white border border-teal-100 rounded-2xl p-4 hover:border-teal-300 hover:bg-teal-50 transition-all cursor-pointer h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 group-hover:bg-white flex items-center justify-center transition-colors">
                    <item.icon className="w-4 h-4 text-teal-600" />
                  </div>
                  {(item.badge || 0) > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                      {(item.badge || 0) > 9 ? "9+" : item.badge}
                    </span>
                  )}
                  {!(item.badge || 0) && (
                    <ChevronRight className="w-4 h-4 text-teal-200 group-hover:text-teal-400 transition-colors" />
                  )}
                </div>
                <p className="text-sm font-bold text-teal-900">{item.label}</p>
                <p className="text-xs text-teal-500 mt-0.5">{item.sub}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mes tarifs et canaux — tous les professionnels */}
        <div className="d-fade mb-5">
          <div className="bg-white border border-teal-100 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-teal-50 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <p className="text-sm font-bold text-teal-900">
                Mes canaux et tarifs
              </p>
            </div>
            <div className="p-5">
              <PricingManager />
            </div>
          </div>
        </div>

        {/* Disponibilités — notaires et huissiers */}
        {(profession === "notaire" || profession === "huissier") && (
          <div className="d-fade mb-5">
            <div className="bg-white border border-teal-100 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-teal-50 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-teal-600" />
                <p className="text-sm font-bold text-teal-900">
                  Mes disponibilités
                </p>
              </div>
              <div className="p-5">
                <AvailabilityManager />
              </div>
            </div>
          </div>
        )}

        {/* ── Aide ── */}
        <div className="d-fade flex items-center justify-between bg-white border border-teal-100 rounded-2xl px-5 py-4">
          <div>
            <p className="text-sm font-bold text-teal-900">Besoin d'aide ?</p>
            <p className="text-xs text-teal-500 mt-0.5">
              support@mizan-dz.com · Réponse sous 24h
            </p>
          </div>
          <a
            href="mailto:support@mizan-dz.com"
            className="text-xs font-semibold text-teal-600 hover:text-teal-800 cursor-pointer transition-colors"
          >
            Contacter →
          </a>
        </div>
      </div>
    </div>
  );
}
