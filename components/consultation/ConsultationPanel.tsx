"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ChevronRight,
  Calendar,
  MessageSquare,
  Phone,
  Video,
  Mail,
  CheckCircle,
  Lock,
} from "lucide-react";
import { AvocatData } from "@/types";

const CANAL_ICONS: Record<string, any> = {
  message: MessageSquare,
  phone: Phone,
  video_30: Video,
  video_60: Video,
  email: Mail,
};

const NEEDS_SCHEDULE = ["phone", "video_30", "video_60"];

interface ConsultationPanelProps {
  avocat: AvocatData;
  pricingChannels: any[];
  user: any;
  profile: any;
  supabase: any;
  onSuccess: () => void;
  onBooking: () => void;
}

export function ConsultationPanel({
  avocat,
  pricingChannels,
  user,
  profile,
  supabase,
  onSuccess,
  onBooking,
}: ConsultationPanelProps) {
  const router = useRouter();
  const tc = useTranslations("consultationPanel");

  const [selected, setSelected] = useState<string | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const isAppointment = ["notaire", "huissier"].includes(
    avocat.profession || ""
  );
  const needsSchedule = NEEDS_SCHEDULE.includes(selected || "");
  const today = new Date().toISOString().split("T")[0];

  const ALL_CANAUX = [
    {
      type: "message",
      label: tc("channels.message.label"),
      desc: tc("channels.message.desc"),
      duration: undefined,
    },
    {
      type: "phone",
      label: tc("channels.phone.label"),
      desc: tc("channels.phone.desc"),
      duration: tc("duration.thirtyMin"),
    },
    {
      type: "video_30",
      label: tc("channels.video30.label"),
      desc: tc("channels.video30.desc"),
      duration: tc("duration.thirtyMin"),
    },
    {
      type: "video_60",
      label: tc("channels.video60.label"),
      desc: tc("channels.video60.desc"),
      duration: tc("duration.oneHour"),
    },
  ];

  const canaux = ALL_CANAUX.map((c) => ({
    ...c,
    base_price:
      pricingChannels.find((p: any) => p.type === c.type)?.base_price ?? null,
  }));

  const handleSend = async () => {
    if (!user || profile?.user_type !== "client") {
      router.push("/auth/client/register");
      return;
    }
    if (!selected) return;
    if (needsSchedule && (!scheduledDate || !scheduledTime)) {
      setError(tc("schedule.errorRequired"));
      return;
    }
    setError("");
    setSending(true);

    try {
      const canal = ALL_CANAUX.find((c) => c.type === selected)!;
      const price = pricingChannels.find((p: any) => p.type === selected);

      const scheduledAt =
        needsSchedule && scheduledDate && scheduledTime
          ? new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString()
          : null;

      const { data: existing } = await supabase
        .from("consultations")
        .select("id")
        .eq("client_id", user.id)
        .eq("lawyer_id", avocat.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      let cid = existing?.id;
      if (!cid) {
        const { data: nc } = await supabase
          .from("consultations")
          .insert({
            client_id: user.id,
            lawyer_id: avocat.id,
            status: "pending",
            subject: canal.label,
            scheduled_at: scheduledAt,
          })
          .select("id")
          .single();
        cid = nc?.id;
      }

      if (cid) {
        const priceStr = price?.base_price
          ? `\n💰 ${price.base_price.toLocaleString()} DA`
          : "";
        const durStr = canal.duration ? ` · ${canal.duration}` : "";
        const dateStr = scheduledAt
          ? `\n📅 ${new Date(scheduledAt).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} à ${scheduledTime}`
          : "";

        await supabase.from("messages").insert({
          consultation_id: cid,
          sender_id: user.id,
          content: `📋 ${canal.label}${durStr}${dateStr}${priceStr}`,
        });
      }

      fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: avocat.id,
          title: "Nouvelle demande de consultation",
          body: `${canal.label}${scheduledAt ? ` le ${new Date(scheduledAt).toLocaleDateString("fr-FR")}` : ""}`,
          url: "/lawyer/consultations",
        }),
      }).catch(() => {});

      setSent(true);
      setTimeout(() => {
        setSent(false);
        setSelected(null);
        setScheduledDate("");
        setScheduledTime("");
        onSuccess();
        router.push("/mes-consultations?feedback=true");
      }, 2500);
    } finally {
      setSending(false);
    }
  };

  if (sent)
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-teal-50 dark:bg-[#1F3D2E] border border-teal-100 dark:border-[#1F3D2E] rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-6 h-6 text-teal-600 dark:text-[#6fcf9f]" />
        </div>
        <p className="text-sm font-bold text-slate-900 dark:text-[#F5F5F4] mb-1">
          {tc("sentTitle")}
        </p>
        <p className="text-xs text-slate-500 dark:text-[#A8A8A6]">
          {tc("sentSubtitle")}
        </p>
      </div>
    );

  const inp =
    "w-full h-11 px-3 text-sm border border-slate-300 rounded-lg bg-white dark:bg-[#1c1c1e] focus:border-teal-400 focus:border-2 outline-none transition-all text-slate-700 dark:text-[#E8E8E6]";

  return (
    <div>
      <div className="divide-y divide-slate-100">
        {canaux.map((canal) => {
          const Icon = CANAL_ICONS[canal.type];
          if (!Icon) return null;
          const isSelected = selected === canal.type;
          return (
            <button
              key={canal.type}
              onClick={() => {
                setSelected(canal.type);
                setError("");
              }}
              className={`w-full flex items-center justify-between gap-3 py-3 px-2 cursor-pointer transition-all text-start rounded-xl ${isSelected ? "bg-teal-50 dark:bg-[#1F3D2E]" : "hover:bg-slate-50"}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${isSelected ? "border-teal-600 dark:border-[#6fcf9f] bg-teal-600 dark:bg-[#0F6E56]" : "border-slate-300"}`}
                >
                  {isSelected && (
                    <div className="w-1 h-1 bg-white dark:bg-[#1c1c1e] rounded-full" />
                  )}
                </div>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-teal-600 dark:bg-[#0F6E56]" : "bg-teal-50 dark:bg-[#1F3D2E] border border-teal-100 dark:border-[#1F3D2E]"}`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-teal-600 dark:text-[#6fcf9f]"}`}
                  />
                </div>
                <div className="min-w-0">
                  <span
                    className={`text-sm font-medium ${isSelected ? "text-teal-800" : "text-slate-700 dark:text-[#E8E8E6]"}`}
                  >
                    {canal.label}
                  </span>
                  {canal.duration && (
                    <span
                      className={`ms-2 text-xs ${isSelected ? "text-teal-500 dark:text-[#6fcf9f]" : "text-slate-400 dark:text-[#7A7A78]"}`}
                    >
                      {canal.duration}
                    </span>
                  )}
                  <p
                    className={`text-xs ${isSelected ? "text-teal-600 dark:text-[#6fcf9f]" : "text-slate-400 dark:text-[#7A7A78]"}`}
                  >
                    {canal.desc}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-semibold flex-shrink-0 ${isSelected ? "text-teal-600 dark:text-[#6fcf9f] bg-white dark:bg-[#1c1c1e] px-2 py-0.5 rounded-full shadow-sm dark:shadow-none" : "text-slate-400 dark:text-[#7A7A78]"}`}
              >
                {canal.base_price
                  ? `${canal.base_price.toLocaleString()} DA`
                  : tc("onDemand")}
              </span>
            </button>
          );
        })}
      </div>

      {needsSchedule && (
        <div className="mt-4 p-4 bg-teal-50 dark:bg-[#1F3D2E] border border-teal-100 dark:border-[#1F3D2E] rounded-xl space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-teal-600 dark:text-[#6fcf9f]" />
            <p className="text-xs font-semibold text-teal-800">
              {tc("schedule.title")}
            </p>
          </div>
          <p className="text-[11px] text-teal-600 dark:text-[#6fcf9f]">
            {tc("schedule.subtitle")}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-[#E8E8E6] mb-1">
                {tc("schedule.date")} *
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={today}
                className={inp}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-[#E8E8E6] mb-1">
                {tc("schedule.time")} *
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className={inp}
              />
            </div>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      <div className="mt-4 space-y-2">
        <button
          onClick={handleSend}
          disabled={
            !selected ||
            sending ||
            (needsSchedule && (!scheduledDate || !scheduledTime))
          }
          className="w-full bg-teal-600 dark:bg-[#0F6E56] hover:bg-teal-700 dark:hover:bg-[#085041] disabled:opacity-40 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          {sending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />{" "}
              {tc("sending")}
            </>
          ) : (
            <>
              {tc("sendRequest")} <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>

        {isAppointment && (
          <button
            onClick={onBooking}
            className="w-full bg-white dark:bg-[#1c1c1e] border border-teal-200 dark:border-[#1F3D2E] text-teal-700 dark:text-[#6fcf9f] hover:bg-teal-50 dark:hover:bg-[#26492f] py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Calendar className="w-4 h-4" /> {tc("physicalAppointment")}
          </button>
        )}

        <div className="mt-3 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-amber-800">
              {tc("payment.title")}
            </p>
            <p className="text-[10px] text-amber-600 mt-0.5">
              {tc("payment.subtitle")}
            </p>
          </div>
          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full whitespace-nowrap">
            {tc("payment.badge")}
          </span>
        </div>

        <p className="text-[10px] text-slate-400 dark:text-[#7A7A78] text-center">
          {tc("priceDisclaimer")}
        </p>
      </div>
    </div>
  );
}
