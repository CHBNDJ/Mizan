"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { localizedDigits } from "@/lib/arabicNumerals";
import {
  CheckCircle,
  X,
  Clock,
  MessageCircle,
  Phone,
  Video,
  Mail,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { JoinCallButton } from "@/components/consultation/JoinCallButton";

const CANAL_ICONS: Record<string, any> = {
  message: MessageCircle,
  phone: Phone,
  video_30: Video,
  video_60: Video,
  email: Mail,
};

interface Consultation {
  id: string;
  status: string;
  created_at: string;
  subject: string;
  scheduled_at: string | null;
  client: { first_name: string; last_name: string };
  canal?: string;
}

export function PendingConsultations() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const t = useTranslations("pendingConsultations");
  const locale = useLocale();
  const ld = (s: string) => localizedDigits(s, locale);
  const dateLocale =
    locale === "ar" ? "ar-DZ" : locale === "en" ? "en-US" : "fr-FR";
  const [items, setItems] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [declining, setDeclining] = useState<string | null>(null);
  const [declineMsg, setDeclineMsg] = useState("");

  useEffect(() => {
    if (!user) return;
    loadPending();
    const channel = supabase
      .channel("pending-consultations")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "consultations",
          filter: `lawyer_id=eq.${user.id}`,
        },
        () => loadPending()
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "consultations",
          filter: `lawyer_id=eq.${user.id}`,
        },
        () => loadPending()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadPending = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("consultations")
      .select(
        `id, status, created_at, subject, scheduled_at, client:client_id(first_name, last_name)`
      )
      .eq("lawyer_id", user.id)
      .in("status", ["pending", "accepted", "in_progress"])
      .order("created_at", { ascending: false })
      .limit(10);

    if (!data) {
      setLoading(false);
      return;
    }

    const enriched = data.map((c: any) => {
      const subjectLower = (c.subject || "").toLowerCase();
      const canal =
        Object.keys(CANAL_ICONS).find((k) =>
          subjectLower.includes(k.replace("_", " "))
        ) ||
        (subjectLower.includes("vidéo") || subjectLower.includes("video")
          ? "video_30"
          : subjectLower.includes("téléphone") || subjectLower.includes("phone")
            ? "phone"
            : "message");
      return { ...c, canal };
    });

    setItems(enriched);
    setLoading(false);
  };

  const updateStatus = async (
    id: string,
    status: "accepted" | "declined",
    message?: string
  ) => {
    await fetch(`/api/consultations/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, message }),
    });
    if (status === "accepted") localStorage.setItem("pendingFeedback", "true");
    loadPending();
    setDeclining(null);
    setDeclineMsg("");
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      pending: {
        label: t("statusPending"),
        color:
          "bg-amber-50 dark:bg-[#3D2E1F] text-amber-700 dark:text-[#E0B568] border-amber-200 dark:border-[#5A4A2A]",
      },
      accepted: {
        label: t("statusAccepted"),
        color:
          "bg-teal-50 dark:bg-[#1F3D2E] text-teal-700 dark:text-[#6fcf9f] border-teal-200 dark:border-[#1F3D2E]",
      },
      in_progress: {
        label: t("statusInProgress"),
        color:
          "bg-blue-50 dark:bg-[#1F2E3D] text-blue-700 dark:text-[#7FB3E0] border-blue-200 dark:border-[#2A4A5A]",
      },
    };
    return (
      map[status] || {
        label: status,
        color:
          "bg-slate-50 text-slate-600 dark:text-[#E8E8E6] border-slate-200 dark:border-[#1c2220]",
      }
    );
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return t("minutesAgo", { n: ld(String(mins)) });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t("hoursAgo", { n: ld(String(hrs)) });
    return t("daysAgo", { n: ld(String(Math.floor(hrs / 24))) });
  };

  const formatScheduled = (iso: string) => {
    const d = new Date(iso);
    const date = d.toLocaleDateString(dateLocale, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    const time = d.toLocaleTimeString(dateLocale, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date: ld(date), time: ld(time) };
  };

  const isVideoCanal = (canal?: string) =>
    canal === "video_30" || canal === "video_60";
  const needsSchedule = (canal?: string) =>
    ["phone", "video_30", "video_60"].includes(canal || "");

  if (loading || items.length === 0) return null;

  return (
    <div className="bg-white dark:bg-[#1c1c1e] border border-teal-100 dark:border-[#1F3D2E] rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-teal-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600 dark:text-[#6fcf9f]" />
          <h2 className="text-sm font-bold text-teal-900 dark:text-[#F5F5F4]">
            {t("title")}
          </h2>
          {items.filter((i) => i.status === "pending").length > 0 && (
            <span className="bg-teal-600 dark:bg-[#0F6E56] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {ld(String(items.filter((i) => i.status === "pending").length))}
            </span>
          )}
        </div>
        <button
          onClick={() => router.push("/lawyer/consultations")}
          className="text-xs text-teal-600 dark:text-[#6fcf9f] font-medium hover:text-teal-700 dark:hover:text-[#6fcf9f] cursor-pointer"
        >
          {t("seeAll")}
        </button>
      </div>

      <div className="divide-y divide-slate-50">
        {items.map((c) => {
          const badge = getStatusBadge(c.status);
          const CanalIcon = c.canal ? CANAL_ICONS[c.canal] : MessageCircle;
          const isPending = c.status === "pending";
          const isAccepted =
            c.status === "accepted" || c.status === "in_progress";
          const scheduled = c.scheduled_at
            ? formatScheduled(c.scheduled_at)
            : null;

          return (
            <div key={c.id} className="px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-[#1F3D2E] flex items-center justify-center text-teal-700 dark:text-[#6fcf9f] font-semibold text-sm flex-shrink-0">
                  {c.client?.first_name?.[0]}
                  {c.client?.last_name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-[#F5F5F4] truncate">
                      {c.client?.first_name} {c.client?.last_name}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-[#7A7A78] flex-shrink-0">
                      {timeAgo(c.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <CanalIcon className="w-3.5 h-3.5 text-teal-500 dark:text-[#6fcf9f] flex-shrink-0" />
                    <p className="text-xs text-slate-500 dark:text-[#A8A8A6] truncate">
                      {c.subject || t("consultationFallback")}
                    </p>
                    <span
                      className={`flex-shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {scheduled && needsSchedule(c.canal) && (
                    <div className="mb-2 flex items-center gap-2 bg-teal-50 dark:bg-[#1F3D2E] border border-teal-100 dark:border-[#1F3D2E] rounded-lg px-3 py-2">
                      <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-[#6fcf9f] flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-teal-800">
                          {scheduled.date}
                        </p>
                        <p className="text-xs text-teal-600 dark:text-[#6fcf9f]">
                          {scheduled.time}
                        </p>
                      </div>
                    </div>
                  )}

                  {isPending ? (
                    declining === c.id ? (
                      <div className="mt-2 space-y-2">
                        <textarea
                          value={declineMsg}
                          onChange={(e) => setDeclineMsg(e.target.value)}
                          placeholder={t("declineReasonPh")}
                          rows={2}
                          className="w-full text-xs border border-slate-200 dark:border-[#1c2220] rounded-lg px-3 py-2 resize-none focus:border-teal-400 outline-none text-slate-700 dark:text-[#E8E8E6]"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              updateStatus(c.id, "declined", declineMsg)
                            }
                            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium py-1.5 rounded-lg cursor-pointer"
                          >
                            {t("confirmDecline")}
                          </button>
                          <button
                            onClick={() => setDeclining(null)}
                            className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:text-[#E8E8E6] text-xs rounded-lg cursor-pointer"
                          >
                            {t("cancel")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => updateStatus(c.id, "accepted")}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-teal-600 dark:bg-[#0F6E56] hover:bg-teal-700 dark:hover:bg-[#085041] text-white text-xs font-semibold py-2 rounded-lg cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> {t("accept")}
                        </button>
                        <button
                          onClick={() => setDeclining(c.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] hover:bg-slate-50 text-slate-600 dark:text-[#E8E8E6] text-xs font-medium py-2 rounded-lg cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> {t("refuse")}
                        </button>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {isAccepted && isVideoCanal(c.canal) && (
                        <JoinCallButton
                          consultationId={c.id}
                          canal="video_30"
                        />
                      )}
                      <button
                        onClick={() => router.push("/lawyer/consultations")}
                        className="flex items-center gap-1 text-xs text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#6fcf9f] font-medium cursor-pointer"
                      >
                        {t("messaging")} <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
