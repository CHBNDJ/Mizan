"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Calendar,
  MessageSquare,
  Phone,
  Video,
  Mail,
  CheckCircle,
} from "lucide-react";
import { AvocatData } from "@/types";

const CANAL_CONFIG: Record<
  string,
  { icon: any; label: string; desc: string; duration?: string }
> = {
  message: {
    icon: MessageSquare,
    label: "Message écrit",
    desc: "Réponse sous 24-48h",
  },
  phone: {
    icon: Phone,
    label: "Téléphonique",
    desc: "Appel vocal",
    duration: "30 min",
  },
  video_30: {
    icon: Video,
    label: "Vidéo",
    desc: "Consultation vidéo",
    duration: "30 min",
  },
  video_60: {
    icon: Video,
    label: "Vidéo",
    desc: "Consultation vidéo",
    duration: "1h",
  },
  email: { icon: Mail, label: "Email", desc: "Réponse sous 48h" },
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
      label: "Message",
      desc: "Réponse sous 24-48h",
      duration: undefined,
    },
    {
      type: "phone",
      label: "Téléphone",
      desc: "Appel vocal",
      duration: "30 min",
    },
    {
      type: "video_30",
      label: "Vidéo",
      desc: "Consultation vidéo",
      duration: "30 min",
    },
    {
      type: "video_60",
      label: "Vidéo",
      desc: "Consultation vidéo",
      duration: "1 heure",
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
      setError(
        "Veuillez choisir une date et une heure pour ce type de consultation."
      );
      return;
    }
    setError("");
    setSending(true);

    try {
      const canal = CANAL_CONFIG[selected];
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
          ? `\n💰 Tarif : ${price.base_price.toLocaleString()} DA`
          : "";
        const durStr = canal.duration ? ` · ${canal.duration}` : "";
        const dateStr = scheduledAt
          ? `\n📅 Date souhaitée : ${new Date(scheduledAt).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} à ${scheduledTime}`
          : "";

        await supabase.from("messages").insert({
          consultation_id: cid,
          sender_id: user.id,
          content: `📋 Demande de consultation\n\n🔔 ${canal.label}${durStr}${dateStr}${priceStr}\n\nMerci de confirmer votre disponibilité et le tarif définitif.`,
        });
      }

      fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lawyer_id: avocat.id,
          title: "Nouvelle demande de consultation",
          body: `Un client souhaite vous consulter via ${canal.label}${scheduledAt ? ` le ${new Date(scheduledAt).toLocaleDateString("fr-FR")}` : ""}`,
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
        <div className="w-12 h-12 bg-teal-50 border border-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-6 h-6 text-teal-600" />
        </div>
        <p className="text-sm font-bold text-slate-900 mb-1">Demande envoyée</p>
        <p className="text-xs text-slate-500">
          Redirection vers vos consultations...
        </p>
      </div>
    );

  const inp =
    "w-full h-11 px-3 text-sm border border-slate-300 rounded-lg bg-white focus:border-teal-400 focus:border-2 outline-none transition-all text-slate-700";

  return (
    <div>
      <div className="divide-y divide-slate-100">
        {canaux.map((canal) => {
          const config = CANAL_CONFIG[canal.type];
          if (!config) return null;
          const Icon = config.icon;
          const isSelected = selected === canal.type;
          return (
            <button
              key={canal.type}
              onClick={() => {
                setSelected(canal.type);
                setError("");
              }}
              className={`w-full flex items-center justify-between gap-3 py-3 px-2 cursor-pointer transition-all text-left rounded-xl ${isSelected ? "bg-teal-50" : "hover:bg-slate-50"}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${isSelected ? "border-teal-600 bg-teal-600" : "border-slate-300"}`}
                >
                  {isSelected && (
                    <div className="w-1 h-1 bg-white rounded-full" />
                  )}
                </div>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-teal-600" : "bg-teal-50 border border-teal-100"}`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-teal-600"}`}
                  />
                </div>
                <div className="min-w-0">
                  <span
                    className={`text-sm font-medium ${isSelected ? "text-teal-800" : "text-slate-700"}`}
                  >
                    {config.label}
                  </span>
                  {canal.duration && (
                    <span
                      className={`ml-2 text-xs ${isSelected ? "text-teal-500" : "text-slate-400"}`}
                    >
                      {canal.duration}
                    </span>
                  )}
                  <p
                    className={`text-xs ${isSelected ? "text-teal-600" : "text-slate-400"}`}
                  >
                    {config.desc}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-semibold flex-shrink-0 ${isSelected ? "text-teal-600 bg-white px-2 py-0.5 rounded-full shadow-sm" : "text-slate-400"}`}
              >
                {canal.base_price
                  ? `${canal.base_price.toLocaleString()} DA`
                  : "Sur demande"}
              </span>
            </button>
          );
        })}
      </div>

      {needsSchedule && (
        <div className="mt-4 p-4 bg-teal-50 border border-teal-100 rounded-xl space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-teal-600" />
            <p className="text-xs font-semibold text-teal-800">
              Choisissez votre créneau souhaité
            </p>
          </div>
          <p className="text-[11px] text-teal-600">
            Le professionnel confirmera la disponibilité et ses honoraires.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Date *
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
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Heure *
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
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          {sending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />{" "}
              Envoi...
            </>
          ) : (
            <>
              Envoyer ma demande <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
        {isAppointment && (
          <button
            onClick={onBooking}
            className="w-full bg-white border border-teal-200 text-teal-700 hover:bg-teal-50 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Calendar className="w-4 h-4" /> RDV physique au cabinet
          </button>
        )}
        <p className="text-[10px] text-slate-400 text-center">
          Tarifs indicatifs · confirmés par le professionnel
        </p>
      </div>
    </div>
  );
}
