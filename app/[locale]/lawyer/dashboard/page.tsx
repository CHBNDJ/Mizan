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
import FeedbackPopup from "@/components/FeedbackPopup";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
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
  TrendingUp,
  Calculator,
  RefreshCw,
  Zap,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { gsap } from "gsap";
import { PendingConsultations } from "@/components/dashboard/PendingConsultations";
import { localizedDigits } from "@/lib/arabicNumerals";

const PROF_KEY: Record<string, string> = {
  avocat: "avocat",
  notaire: "notaire",
  huissier: "huissier",
  comptable: "comptable",
  "expert-comptable": "expertComptable",
};
const PROF_ICONS: Record<string, any> = {
  avocat: CheckCircle,
  notaire: CheckCircle,
  huissier: CheckCircle,
  comptable: Calculator,
  "expert-comptable": TrendingUp,
};

const CHECKIN_REMINDER_MS = 2 * 60 * 60 * 1000;
const AUTO_OFF_AFTER_IGNORED_MS = 4 * 60 * 60 * 1000;

export default function LawyerDashboardPage() {
  const supabase = createClient();
  const { profile, user, isAuthenticated, loading, lawyerProfile } = useAuth();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const ld = (s: string) => localizedDigits(s, locale);
  const ref = useRef<HTMLDivElement>(null);

  const [activeProfession, setActiveProfession] = useState<string>("");
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
  const [showFeedback, setShowFeedback] = useState(false);

  const [availableNow, setAvailableNow] = useState(false);
  const [availableSince, setAvailableSince] = useState<string | null>(null);
  const [elapsedMin, setElapsedMin] = useState(0);
  const [showCheckIn, setShowCheckIn] = useState(false);

  const professions: string[] = (lawyerProfile as any)?.professions || [
    (profile as any)?.profession || "avocat",
  ];
  const isMultiProfession = professions.length > 1;
  const profKey = PROF_KEY[activeProfession] || "avocat";
  const ProfIcon = PROF_ICONS[activeProfession] || CheckCircle;
  const profLabel = t(`professions.${profKey}.label`);
  const initials =
    `${profile?.first_name?.[0] || ""}${profile?.last_name?.[0] || ""}`.toUpperCase();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/auth/lawyer/login");
  }, [loading, isAuthenticated]);

  useEffect(() => {
    if (typeof window !== "undefined" && lawyerProfile) {
      const primaryProf = (lawyerProfile as any)?.profession || "avocat";
      const stored = localStorage.getItem("activeProfession");
      const profs: string[] = (lawyerProfile as any)?.professions || [
        primaryProf,
      ];
      const active = stored && profs.includes(stored) ? stored : primaryProf;
      localStorage.setItem("activeProfession", active);
      setActiveProfession(active);
    }
  }, [lawyerProfile]);

  useEffect(() => {
    const pending = localStorage.getItem("pendingFeedback");
    if (pending === "true") {
      localStorage.removeItem("pendingFeedback");
      const timer = setTimeout(() => setShowFeedback(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (user && profile?.user_type === "lawyer") {
      loadStats();
      checkVerif();
      loadSub();
      loadAvailableNow();
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

  useEffect(() => {
    if (!availableNow || !availableSince) {
      setElapsedMin(0);
      setShowCheckIn(false);
      return;
    }
    const tick = () => {
      const elapsed = Date.now() - new Date(availableSince).getTime();
      setElapsedMin(Math.floor(elapsed / 60000));
      if (elapsed >= AUTO_OFF_AFTER_IGNORED_MS) {
        toggleAvailableNow(false);
        setShowCheckIn(false);
      } else if (elapsed >= CHECKIN_REMINDER_MS) {
        setShowCheckIn(true);
      }
    };
    tick();
    const interval = setInterval(tick, 30000);
    return () => clearInterval(interval);
  }, [availableNow, availableSince]);

  const loadAvailableNow = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("lawyers")
      .select("available_now, available_now_since")
      .eq("id", user.id)
      .single();
    if (data) {
      setAvailableNow(!!data.available_now);
      setAvailableSince(data.available_now_since);
    }
  };

  const toggleAvailableNow = async (next: boolean) => {
    if (!user) return;
    const since = next ? new Date().toISOString() : null;
    setAvailableNow(next);
    setAvailableSince(since);
    setShowCheckIn(false);
    await supabase
      .from("lawyers")
      .update({ available_now: next, available_now_since: since })
      .eq("id", user.id);
  };

  const confirmStillAvailable = async () => {
    if (!user) return;
    const since = new Date().toISOString();
    setAvailableSince(since);
    setShowCheckIn(false);
    await supabase
      .from("lawyers")
      .update({ available_now_since: since })
      .eq("id", user.id);
  };

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

  const switchProfession = () => {
    const next =
      professions.find((p) => p !== activeProfession) || professions[0];
    localStorage.setItem("activeProfession", next);
    setActiveProfession(next);
  };

  const planLabel = (p: string | null): string =>
    p ? t(`durations.${p}`) : "";
  const dateLocale =
    locale === "ar" ? "ar-DZ" : locale === "en" ? "en-US" : "fr-DZ";
  const fmtDate = (d: string | null): string =>
    d
      ? new Date(d).toLocaleDateString(dateLocale, {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";

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
      label: t("dashboard.actionConsultations"),
      sub:
        stats.pending > 0
          ? t("dashboard.unreadMessage", { count: stats.pending })
          : t("dashboard.noUnreadMessages"),
      href: "/lawyer/consultations",
      badge: stats.pending,
    },
    {
      icon: Edit,
      label: t("dashboard.actionEditProfile"),
      sub: t("dashboard.actionEditProfileSub"),
      href: "/profile",
    },
    {
      icon: Eye,
      label: t("dashboard.actionPublicProfile"),
      sub: t("dashboard.actionPublicProfileSub"),
      href: `/lawyers/${user?.id}`,
    },
  ];

  return (
    <>
      <div className="min-h-screen pt-16 bg-teal-50" ref={ref}>
        <style>{`.d-fade{opacity:0;}`}</style>
        <div className="max-w-3xl mx-auto px-4 py-8">
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
                  <div className="flex items-center gap-1">
                    <ProfIcon className="w-3 h-3 text-teal-600" />
                    <span className="text-xs text-teal-600 font-medium">
                      {profLabel}
                    </span>
                  </div>
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 text-xs text-teal-600 font-medium">
                      <CheckCircle className="w-3 h-3" />
                      {t("dashboard.verified")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                      <Clock className="w-3 h-3" />
                      {t("dashboard.pending")}
                    </span>
                  )}
                  <span className="text-teal-300">·</span>
                  <span className="text-xs text-teal-500">
                    {subStatus === "active"
                      ? t("dashboard.planLabel", { plan: planLabel(subPlan) })
                      : t("dashboard.freeLaunch")}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isMultiProfession && (
                <button
                  onClick={switchProfession}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-teal-200 hover:bg-teal-50 text-teal-700 text-xs font-semibold rounded-xl cursor-pointer transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {professions.find((p) => p !== activeProfession) ===
                  "comptable"
                    ? t("dashboard.switchToComptable")
                    : t("dashboard.switchToExpertComptable")}
                </button>
              )}
              <button
                onClick={() => router.push("/settings")}
                className="w-9 h-9 rounded-xl bg-white border border-teal-100 flex items-center justify-center text-teal-600 hover:bg-teal-50 transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!profile?.avatar_url && (
            <div className="d-fade mb-5 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <Camera className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800">
                  {t("dashboard.addPhotoTitle")}
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  {t("dashboard.addPhotoDesc")}
                </p>
              </div>
              <Link href="/profile">
                <button className="text-xs font-semibold text-amber-700 hover:text-amber-900 cursor-pointer whitespace-nowrap">
                  {t("dashboard.addAction")}
                </button>
              </Link>
            </div>
          )}

          {!isVerified && (
            <div className="d-fade mb-5 flex items-center gap-3 bg-white border border-teal-100 rounded-2xl px-4 py-3">
              <Clock className="w-4 h-4 text-teal-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-teal-800">
                  {t("dashboard.verificationPending")}
                </p>
                <p className="text-xs text-teal-600 mt-0.5">
                  {t("dashboard.verificationDesc")}
                </p>
              </div>
            </div>
          )}

          {/* Disponible maintenant */}
          <div className="d-fade mb-5 bg-white border border-teal-100 rounded-2xl px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-teal-900">
                    {t("dashboard.availableNowTitle")}
                  </p>
                  <p className="text-xs text-teal-500 mt-0.5">
                    {t("dashboard.availableNowDesc")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleAvailableNow(!availableNow)}
                className="relative w-11 h-6 rounded-full flex-shrink-0 cursor-pointer transition-colors"
                style={{ background: availableNow ? "#0D9488" : "#CBD5E1" }}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                  style={{ insetInlineStart: availableNow ? "22px" : "2px" }}
                />
              </button>
            </div>
            {availableNow && (
              <div className="mt-3 pt-3 border-t border-teal-50 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <p className="text-xs text-teal-700">
                  {elapsedMin < 60
                    ? t("dashboard.availableSince", {
                        n: ld(String(elapsedMin)),
                      })
                    : t("dashboard.availableSinceHours", {
                        n: ld(String(Math.floor(elapsedMin / 60))),
                      })}
                </p>
              </div>
            )}
            {showCheckIn && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-3 flex-wrap">
                <p className="text-xs font-semibold text-amber-800">
                  {t("dashboard.stillAvailableQuestion")}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={confirmStillAvailable}
                    className="text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    {t("dashboard.stillAvailableYes")}
                  </button>
                  <button
                    onClick={() => toggleAvailableNow(false)}
                    className="text-xs font-medium bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    {t("dashboard.stillAvailableNo")}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="d-fade grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
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
                {t("dashboard.statRequests")}
              </p>
              <p className="text-3xl font-bold text-teal-900 leading-none">
                {loadingStats ? (
                  <span className="text-teal-200">—</span>
                ) : (
                  stats.total
                )}
              </p>
            </div>
            <div className="bg-white border border-teal-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <CheckCircle className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-[11px] text-teal-500 font-semibold uppercase tracking-wide mb-1">
                {t("dashboard.statAnswered")}
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
            <div className="bg-white border border-teal-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <Eye className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-[11px] text-teal-500 font-semibold uppercase tracking-wide mb-1">
                {t("dashboard.statViews")}
              </p>
              <p className="text-3xl font-bold text-teal-900 leading-none">
                {loadingStats ? (
                  <span className="text-teal-200">—</span>
                ) : (
                  stats.views
                )}
              </p>
            </div>
            <div className="bg-teal-700 border border-teal-600 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <Settings className="w-4 h-4 text-teal-300" />
              </div>
              <p className="text-[11px] text-teal-300 font-semibold uppercase tracking-wide mb-1">
                {t("dashboard.statSubscription")}
              </p>
              <p className="text-sm font-bold text-white leading-tight">
                {subStatus === "active"
                  ? t("dashboard.planLabel", { plan: planLabel(subPlan) })
                  : t("dashboard.freeLaunch")}
              </p>
              {subStatus === "active" && subEnd && (
                <p className="text-[10px] text-teal-300 mt-1">
                  {t("dashboard.until", { date: fmtDate(subEnd) })}
                </p>
              )}
              {subStatus !== "active" && (
                <p className="text-[10px] text-teal-400 mt-1">
                  {t("dashboard.paymentSoon")}
                </p>
              )}
            </div>
          </div>

          <div className="d-fade grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {ACTIONS.map((item, i) => (
              <Link key={i} href={item.href}>
                <div className="group bg-white border border-teal-100 rounded-2xl p-4 hover:border-teal-300 hover:bg-teal-50 transition-all cursor-pointer h-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 group-hover:bg-white flex items-center justify-center transition-colors">
                      <item.icon className="w-4 h-4 text-teal-600" />
                    </div>
                    {(item.badge || 0) > 0 ? (
                      <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                        {(item.badge || 0) > 9 ? "9+" : item.badge}
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-teal-200 group-hover:text-teal-400 transition-colors" />
                    )}
                  </div>
                  <p className="text-sm font-bold text-teal-900">
                    {item.label}
                  </p>
                  <p className="text-xs text-teal-500 mt-0.5">{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="d-fade mb-5">
            <PendingConsultations />
          </div>

          <div className="d-fade mb-5">
            <div className="bg-white border border-teal-100 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-teal-50 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                <p className="text-sm font-bold text-teal-900">
                  {t("dashboard.pricingTitle", { profession: profLabel })}
                </p>
              </div>
              <div className="p-5">
                <PricingManager profession={activeProfession} />
              </div>
            </div>
          </div>

          {(activeProfession === "notaire" ||
            activeProfession === "huissier") && (
            <div className="d-fade mb-5">
              <div className="bg-white border border-teal-100 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-teal-50 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-teal-600" />
                  <p className="text-sm font-bold text-teal-900">
                    {t("dashboard.availabilityTitle")}
                  </p>
                </div>
                <div className="p-5">
                  <AvailabilityManager />
                </div>
              </div>
            </div>
          )}

          <div className="d-fade flex items-center justify-between bg-white border border-teal-100 rounded-2xl px-5 py-4">
            <div>
              <p className="text-sm font-bold text-teal-900">
                {t("dashboard.helpTitle")}
              </p>
              <p className="text-xs text-teal-500 mt-0.5">
                {t("dashboard.helpSub")}
              </p>
            </div>
            <a
              href="mailto:support@mizan-dz.com"
              className="text-xs font-semibold text-teal-600 hover:text-teal-800 cursor-pointer transition-colors"
            >
              {t("dashboard.contactAction")}
            </a>
          </div>
        </div>
      </div>
      {showFeedback && <FeedbackPopup onClose={() => setShowFeedback(false)} />}
    </>
  );
}
