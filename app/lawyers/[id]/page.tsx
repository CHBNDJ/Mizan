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
  Scale,
  ChevronRight,
  Linkedin,
  Video,
  Mail,
  MessageSquare,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { getAvocatById } from "@/lib/avocatsData";
import { getInitials } from "@/lib/utils";
import { AvocatData, ProfilePageProps } from "@/types";
import { createClient } from "@/lib/supabase/client";
import BookingModal from "@/components/booking/BookingModal";
import ReviewSection from "@/components/reviews/ReviewSection";
import Link from "next/link";
import { formatPhoneNumber, detectPhoneType } from "@/lib/phoneFormatter";
import FeedbackPopup from "@/components/FeedbackPopup";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { toCivilite } from "@/lib/genderUtils";
import { gsap } from "gsap";
import dynamic from "next/dynamic";
const LawyerMap = dynamic(() => import("@/components/map/LawyerMap"), {
  ssr: false,
});
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const PROF_LABELS: Record<string, { label: string; numLabel: string }> = {
  avocat: { label: "Avocat", numLabel: "Barreau de" },
  notaire: { label: "Notaire", numLabel: "Chambre des notaires de" },
  huissier: { label: "Huissier", numLabel: "Juridiction de" },
  "expert-comptable": { label: "Expert Comptable", numLabel: "N° ONEC" },
  comptable: { label: "Comptable", numLabel: "N° ONEC/ONCA" },
};
const getProfLabel = (p?: string) =>
  PROF_LABELS[p || "avocat"] || PROF_LABELS.avocat;

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

const getJitsiUrl = (id: string) =>
  `https://meet.jit.si/mizan-${id.slice(0, 10)}`;
const getMapsQuery = (a: AvocatData) =>
  [a.adresse?.rue, a.adresse?.ville || a.ville, a.wilaya, "Algérie"]
    .filter(Boolean)
    .join(", ");
const getGoogleMapsUrl = (a: AvocatData) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getMapsQuery(a))}`;
const getSiteLabel = (url: string) => {
  if (url.includes("linkedin.com"))
    return { label: "LinkedIn", sublabel: "Voir le profil" };
  if (url.includes("facebook.com"))
    return { label: "Facebook", sublabel: "Voir la page" };
  if (url.includes("instagram.com"))
    return { label: "Instagram", sublabel: "Voir le profil" };
  return { label: "Site web", sublabel: "Visiter le site" };
};
const flag = (p: string) => {
  const n = p.replace(/\s/g, "");
  if (n.startsWith("+213")) return "🇩🇿";
  if (n.startsWith("+33")) return "🇫🇷";
  if (n.startsWith("+32")) return "🇧🇪";
  if (n.startsWith("+41")) return "🇨🇭";
  if (n.startsWith("+44")) return "🇬🇧";
  if (n.startsWith("+1")) return "🇺🇸";
  if (n.startsWith("+212")) return "🇲🇦";
  if (n.startsWith("+216")) return "🇹🇳";
  return "🌍";
};
const waUrl = (p: string) =>
  `https://wa.me/${p.replace(/[\s\-\(\)]/g, "").replace("+", "")}`;
const gridClass = (n: number) => {
  if (n === 1) return "grid-cols-1";
  if (n === 2 || n === 4) return "grid-cols-2";
  return "grid-cols-3";
};

interface InfoItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  href?: string;
  whatsappHref?: string;
  teal?: boolean;
}

const WaIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const InfoCardMobile = ({
  icon,
  label,
  value,
  sublabel,
  href,
  whatsappHref,
  teal = false,
}: InfoItem) => {
  const body = (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div
        className={`w-9 h-9 flex items-center justify-center flex-shrink-0 rounded-lg text-base ${teal ? "bg-white border border-teal-100" : "bg-teal-50 border border-teal-100"}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`text-xs mb-0.5 ${teal ? "text-teal-600" : "text-slate-400"}`}
        >
          {label}
        </div>
        <div
          className={`text-sm font-medium truncate ${teal ? "text-teal-800" : "text-slate-800"}`}
        >
          {value}
        </div>
        {sublabel && !whatsappHref && (
          <div className="text-xs text-slate-400 mt-0.5">{sublabel}</div>
        )}
      </div>
      <ChevronRight
        className={`w-4 h-4 flex-shrink-0 ${teal ? "text-teal-400" : "text-slate-300"}`}
      />
    </div>
  );
  return (
    <div
      className={`rounded-xl border shadow-sm overflow-hidden ${teal ? "bg-teal-50 border-teal-100" : "bg-white border-slate-200"}`}
    >
      {href && !whatsappHref ? (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="block"
        >
          {body}
        </a>
      ) : (
        <div>{body}</div>
      )}
      {whatsappHref && href && (
        <div className="flex border-t border-slate-100">
          <a
            href={href}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 border-r border-slate-100"
          >
            <Phone className="w-3.5 h-3.5" /> Appeler
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-white bg-[#25D366] hover:bg-[#20bd5a]"
          >
            <WaIcon /> WhatsApp
          </a>
        </div>
      )}
    </div>
  );
};

const InfoCardDesktop = ({
  icon,
  label,
  value,
  sublabel,
  href,
  whatsappHref,
  teal = false,
}: InfoItem) => {
  const body = (
    <div
      className={`rounded-xl border shadow-sm overflow-hidden flex flex-col h-full ${teal ? "bg-teal-50 border-teal-100" : "bg-white border-slate-200"}`}
    >
      <div className="flex items-start gap-3 p-4 flex-1">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-base ${teal ? "bg-white border border-teal-100" : "bg-teal-50 border border-teal-100"}`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className={`text-xs font-semibold uppercase tracking-wide mb-1 ${teal ? "text-teal-600" : "text-slate-400"}`}
          >
            {label}
          </div>
          <div
            className={`text-sm font-medium ${teal ? "text-teal-800" : "text-slate-800"}`}
          >
            {value}
          </div>
          {sublabel && !whatsappHref && (
            <div
              className={`text-xs mt-0.5 ${teal ? "text-teal-500" : "text-slate-400"}`}
            >
              {sublabel}
            </div>
          )}
        </div>
        {!whatsappHref && (
          <ChevronRight
            className={`w-4 h-4 flex-shrink-0 mt-0.5 ${teal ? "text-teal-400" : "text-slate-300"}`}
          />
        )}
      </div>
      {whatsappHref && href && (
        <div className="flex border-t border-slate-100 mt-auto">
          <a
            href={href}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 border-r border-slate-100"
          >
            <Phone className="w-3 h-3" /> Appeler
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-white bg-[#25D366] hover:bg-[#20bd5a]"
          >
            <WaIcon /> WhatsApp
          </a>
        </div>
      )}
    </div>
  );
  if (href && !whatsappHref)
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="block h-full"
      >
        {body}
      </a>
    );
  return <div className="h-full">{body}</div>;
};

const VideoConsultationModal = ({
  isOpen,
  onClose,
  avocat,
  userId,
  supabase,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  avocat: AvocatData;
  userId: string;
  supabase: any;
  onSuccess: () => void;
}) => {
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");
  const [description, setDesc] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  if (!isOpen) return null;
  const handleSubmit = async () => {
    if (!date || !heure || !description.trim()) return;
    setSending(true);
    try {
      const { data: existing } = await supabase
        .from("consultations")
        .select("id")
        .eq("client_id", userId)
        .eq("lawyer_id", avocat.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      let consultationId = existing?.id;
      if (!consultationId) {
        const { data: nc } = await supabase
          .from("consultations")
          .insert({
            client_id: userId,
            lawyer_id: avocat.id,
            status: "pending",
            subject: "Consultation vidéo",
          })
          .select("id")
          .single();
        consultationId = nc?.id;
      }
      if (consultationId) {
        await supabase
          .from("messages")
          .insert({
            consultation_id: consultationId,
            sender_id: userId,
            content: `📹 Demande de consultation vidéo\n\n📅 Date souhaitée : ${date} à ${heure}\n📝 Motif : ${description.trim()}\n\nLien : ${getJitsiUrl(avocat.id)}\n\nMerci de confirmer ce créneau et d'indiquer vos honoraires.`,
          });
      }
      setSent(true);
      setTimeout(() => {
        onClose();
        setSent(false);
        setDate("");
        setHeure("");
        setDesc("");
        onSuccess();
      }, 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };
  const inp =
    "w-full h-11 px-3 text-sm border border-slate-300 rounded-lg bg-white focus:border-teal-400 focus:border-2 outline-none transition-all text-slate-700";
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md p-6 z-10">
        {sent ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-teal-50 border border-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-teal-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Demande envoyée
            </h3>
            <p className="text-sm text-slate-500">
              {avocat.prenom} {avocat.nom} vous répondra avec confirmation et
              tarif.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Video className="w-4 h-4 text-blue-500" />
                  <h3 className="text-base font-bold text-slate-900">
                    Consultation vidéo
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Maître {avocat.prenom} {avocat.nom}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 flex items-start gap-2.5">
              <span className="text-base">💡</span>
              <p className="text-xs text-blue-700 leading-relaxed">
                Le professionnel confirmera le créneau et ses honoraires par
                message.
              </p>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Date souhaitée *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Heure *
                  </label>
                  <input
                    type="time"
                    value={heure}
                    onChange={(e) => setHeure(e.target.value)}
                    className={inp}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Motif *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  placeholder="Décrivez brièvement votre problème..."
                  className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:border-teal-400 outline-none transition-all text-slate-700 resize-none"
                />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={sending || !date || !heure || !description.trim()}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Envoi...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" />
                  Envoyer la demande
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ── ConsultationPanel — grille 2 colonnes, 5 canaux ──────────────────────────
const ConsultationPanel = ({
  avocat,
  pricingChannels,
  user,
  profile,
  supabase,
  onSuccess,
  onBooking,
}: {
  avocat: AvocatData;
  pricingChannels: any[];
  user: any;
  profile: any;
  supabase: any;
  onSuccess: () => void;
  onBooking: () => void;
}) => {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const isAppointment = ["notaire", "huissier"].includes(
    avocat.profession || ""
  );

  const ALL_CANAUX = [
    { type: "message", label: "Message", duration: undefined },
    { type: "phone", label: "Téléphone", duration: "30 min" },
    { type: "video_30", label: "Vidéo", duration: "30 min" },
    { type: "video_60", label: "Vidéo", duration: "1 heure" },
    { type: "email", label: "Email", duration: undefined },
  ];
  const canaux = ALL_CANAUX.map((c) => {
    const pricing = pricingChannels.find((p: any) => p.type === c.type);
    return { ...c, base_price: pricing?.base_price ?? null };
  });

  const handleSend = async () => {
    if (!user || profile?.user_type !== "client") {
      router.push("/auth/client/register");
      return;
    }
    if (!selected) return;
    setSending(true);
    try {
      const canal = CANAL_CONFIG[selected];
      const price = pricingChannels.find((p: any) => p.type === selected);
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
          })
          .select("id")
          .single();
        cid = nc?.id;
      }
      if (cid) {
        const priceStr = price?.base_price
          ? `\n💰 Tarif indicatif : ${price.base_price.toLocaleString()} DA`
          : "";
        const durStr = canal.duration ? ` · ${canal.duration}` : "";
        await supabase
          .from("messages")
          .insert({
            consultation_id: cid,
            sender_id: user.id,
            content: `📋 Demande de consultation\n\n🔔 Canal : ${canal.label}${durStr}${priceStr}\n\nMerci de confirmer votre disponibilité et le tarif définitif.`,
          });
      }
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setSelected(null);
        onSuccess();
        router.push("/mes-consultations");
      }, 2500);
    } finally {
      setSending(false);
    }
  };

  if (sent)
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
        <div className="w-12 h-12 bg-teal-50 border border-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-6 h-6 text-teal-600" />
        </div>
        <p className="text-sm font-bold text-slate-900 mb-1">Demande envoyée</p>
        <p className="text-xs text-slate-500">
          Redirection vers vos consultations...
        </p>
      </div>
    );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900">
            Consulter {avocat.prenom} {avocat.nom}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Choisissez votre format de consultation
          </p>
        </div>
      </div>
      <div className="p-3 grid grid-cols-2 gap-2">
        {canaux.map((canal, i) => {
          const config = CANAL_CONFIG[canal.type];
          if (!config) return null;
          const Icon = config.icon;
          const isSelected = selected === canal.type;
          const isLast = i === canaux.length - 1;
          return (
            <button
              key={canal.type}
              onClick={() => setSelected(canal.type)}
              className={`flex flex-col items-center text-center p-3 rounded-xl border cursor-pointer transition-all ${isLast ? "col-span-2" : ""} ${isSelected ? "border-teal-600 bg-teal-50 shadow-sm" : "border-slate-200 hover:border-teal-200 hover:bg-slate-50"}`}
            >
              <Icon
                className={`w-5 h-5 mb-1.5 ${isSelected ? "text-teal-600" : "text-slate-400"}`}
              />
              <span
                className={`text-xs font-semibold ${isSelected ? "text-teal-800" : "text-slate-700"}`}
              >
                {config.label}
              </span>
              {canal.duration && (
                <span
                  className={`text-[10px] mt-0.5 ${isSelected ? "text-teal-600" : "text-slate-400"}`}
                >
                  {canal.duration}
                </span>
              )}
              <span
                className={`text-xs font-semibold mt-1 ${isSelected ? "text-teal-700" : "text-slate-500"}`}
              >
                {canal.base_price
                  ? `${canal.base_price.toLocaleString()} DA`
                  : "Sur demande"}
              </span>
            </button>
          );
        })}
      </div>
      <div className="px-4 pb-4 space-y-2">
        {!user ? (
          <>
            <Link href="/auth/client/register" className="block">
              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer">
                <MessageCircle className="w-4 h-4" /> Créer un compte gratuit
              </button>
            </Link>
            <Link href="/auth/client/login" className="block">
              <button className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center cursor-pointer">
                Déjà un compte
              </button>
            </Link>
          </>
        ) : (
          <button
            onClick={handleSend}
            disabled={!selected || sending}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Envoi...
              </>
            ) : (
              <>
                Envoyer ma demande <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
        {isAppointment && (
          <button
            onClick={onBooking}
            className="w-full bg-white border border-teal-200 text-teal-700 hover:bg-teal-50 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Calendar className="w-4 h-4" /> RDV physique au cabinet
          </button>
        )}
      </div>
      <div className="px-4 pb-3">
        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          Tarifs indicatifs · Le professionnel confirme le tarif définitif selon
          votre dossier.
        </p>
      </div>
    </div>
  );
};

// ── ConsultationSheet mobile ─────────────────────────────────────────────────
const ConsultationSheet = ({
  isOpen,
  onClose,
  avocat,
  pricingChannels,
  user,
  profile,
  supabase,
  onSuccess,
  onBooking,
}: {
  isOpen: boolean;
  onClose: () => void;
  avocat: AvocatData;
  pricingChannels: any[];
  user: any;
  profile: any;
  supabase: any;
  onSuccess: () => void;
  onBooking: () => void;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-t-2xl w-full max-h-[85vh] overflow-y-auto z-10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <p className="text-sm font-bold text-slate-900">
            Consulter {avocat.prenom} {avocat.nom}
          </p>
          <button onClick={onClose} className="text-slate-400 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <ConsultationPanel
            avocat={avocat}
            pricingChannels={pricingChannels}
            user={user}
            profile={profile}
            supabase={supabase}
            onSuccess={() => {
              onClose();
              onSuccess();
            }}
            onBooking={() => {
              onClose();
              onBooking();
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ── Page principale ──────────────────────────────────────────────────────────
export default function ProfilePage({ params }: ProfilePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();
  const [avocat, setAvocat] = useState<AvocatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isConsultSheetOpen, setIsConsultSheetOpen] = useState(false);
  const [pricingChannels, setPricingChannels] = useState<any[]>([]);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const supabase = createClient();
  const hasAnimated = useRef(false);

  const isOwnProfile = user?.id === avocat?.id;
  const isAppointmentProfession = ["notaire", "huissier"].includes(
    avocat?.profession || ""
  );
  const isClient = !!user && profile?.user_type === "client";
  const showConsultPanel = (!user || isClient) && !isOwnProfile;

  useEffect(() => {
    supabase
      .from("consultation_pricing")
      .select("*")
      .eq("lawyer_id", id)
      .eq("is_active", true)
      .order("created_at")
      .then(({ data: pr }) => setPricingChannels(pr || []));
    getAvocatById(id)
      .then(setAvocat)
      .catch(() => setAvocat(null))
      .finally(() => setLoading(false));
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
      gsap.fromTo(
        ".hero-left",
        { autoAlpha: 0, x: -40 },
        { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.1 }
      );
      gsap.fromTo(
        ".hero-right",
        { autoAlpha: 0, x: 40, scale: 0.97 },
        {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
        }
      );
      gsap.fromTo(
        ".content-card",
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.5,
        }
      );
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
  }, [avocat, loading]);

  useEffect(() => {
    if (!avocat?.id) return;
    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then(({ ip }) =>
        supabase
          .from("profile_views")
          .insert({ lawyer_id: avocat.id, viewer_id: null, viewer_ip: ip })
      )
      .catch(() => {});
  }, [avocat?.id]);

  const parsePhones = (s: string) =>
    s
      ? s
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean)
      : [];
  const reloadAvocat = async () => {
    await new Promise((r) => setTimeout(r, 2000));
    getAvocatById(id)
      .then((d) => {
        if (d) setAvocat(d);
      })
      .catch(() => {});
  };

  if (loading)
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
          <div className="h-80 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-32 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  if (!avocat) notFound();

  const profInfo = getProfLabel(avocat.profession);
  const expAnnees = avocat.experience?.annees || 0;
  const telephones = parsePhones(avocat.contact?.telephone || "");
  const mobiles = parsePhones(avocat.contact?.mobile || "");
  const allPhones = [
    ...telephones.map((p) => ({ number: p, type: detectPhoneType(p) })),
    ...mobiles.map((p) => ({ number: p, type: detectPhoneType(p) })),
  ];
  const showContact = !!(
    user &&
    (profile?.id === avocat.id || profile?.user_type === "client")
  );
  const validSiteUrl = avocat.contact?.site_web?.trim() || undefined;
  const siteInfo = validSiteUrl ? getSiteLabel(validSiteUrl) : null;
  const hasAddress = !!(
    avocat.adresse?.rue ||
    avocat.adresse?.ville ||
    avocat.ville
  );

  const infoItems: InfoItem[] = [
    ...(showContact
      ? allPhones.map((p) => ({
          icon: (
            <span className="text-base leading-none">{flag(p.number)}</span>
          ),
          label: p.type === "mobile" ? "Mobile" : "Fixe",
          value: formatPhoneNumber(p.number),
          sublabel: p.type === "mobile" ? "Appeler · WhatsApp" : "Appeler",
          href: `tel:${p.number.replace(/\s/g, "")}`,
          whatsappHref: p.type === "mobile" ? waUrl(p.number) : undefined,
        }))
      : []),
    ...(showContact && validSiteUrl && siteInfo
      ? [
          {
            icon:
              siteInfo.label === "LinkedIn" ? (
                <Linkedin className="w-3.5 h-3.5 text-teal-600" />
              ) : (
                <Globe className="w-3.5 h-3.5 text-teal-600" />
              ),
            label: siteInfo.label,
            value: siteInfo.sublabel,
            sublabel: validSiteUrl
              .replace(/^https?:\/\/(www\.)?/, "")
              .split("/")[0],
            href: validSiteUrl,
          },
        ]
      : []),
  ];
  const claimItem: InfoItem | null = !avocat.is_claimed
    ? {
        icon: <CheckCircle className="w-3.5 h-3.5 text-teal-600" />,
        label: "Vous êtes ce professionnel ?",
        value: "Réclamer ce profil",
        href: `/claim-profile/${avocat.id}`,
        teal: true,
      }
    : null;
  const allInfoItems = [...infoItems, ...(claimItem ? [claimItem] : [])];

  return (
    <div className="min-h-screen pt-16 pb-24 lg:pb-8 bg-gradient-to-br from-teal-100 via-white to-teal-100 overflow-x-hidden w-full">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Retour */}
        <button
          onClick={() => router.push(`/search?${searchParams.toString()}`)}
          className="back-button opacity-0 invisible flex items-center gap-2 text-teal-600 hover:text-teal-700 cursor-pointer mb-6 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Retour aux résultats</span>
          <span className="sm:hidden">Retour</span>
        </button>

        <div className="space-y-4">
          {/* ── Hero ── */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_220px] min-h-[320px]">
              <div className="hero-left opacity-0 invisible p-7 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-widest mb-3">
                    {profInfo.label} · {profInfo.numLabel} {avocat.barreau}
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-light text-slate-800 leading-tight mb-1">
                    {toCivilite(avocat.genre)} {avocat.prenom}
                  </h1>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight mb-4">
                    {avocat.nom}
                  </h2>
                  <div className="w-10 h-0.5 bg-teal-600 mb-4" />
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-teal-500 flex-shrink-0" />
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-teal-600" />
                      <span className="text-sm text-slate-600 font-medium">
                        {expAnnees} ans d'expérience
                      </span>
                      <span className="text-sm text-slate-400">
                        · inscrit en{" "}
                        {avocat.experience?.date_inscription || "N/A"}
                      </span>
                    </div>
                    {avocat.langues && avocat.langues.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-teal-500 flex-shrink-0" />
                        <Languages className="w-3.5 h-3.5 flex-shrink-0 text-teal-600" />
                        <span className="text-sm text-slate-600 font-medium">
                          {avocat.langues.join(" · ")}
                        </span>
                      </div>
                    )}
                    {((avocat.rating_google &&
                      (avocat.reviews_count_google ?? 0) > 0) ||
                      (avocat.rating_mizan &&
                        (avocat.reviews_count_mizan ?? 0) > 0)) && (
                      <div className="flex items-center gap-3 pt-0.5">
                        {avocat.rating_google &&
                          (avocat.reviews_count_google ?? 0) > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-semibold text-slate-700">
                                {avocat.rating_google.toFixed(1)}
                              </span>
                              <Image
                                src="/google.png"
                                alt="Google"
                                width={10}
                                height={10}
                              />
                              <span className="text-sm text-slate-400">
                                ({avocat.reviews_count_google})
                              </span>
                            </div>
                          )}
                        {avocat.rating_mizan &&
                          (avocat.reviews_count_mizan ?? 0) > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-teal-500 text-teal-500" />
                              <span className="text-sm font-semibold text-slate-700">
                                {avocat.rating_mizan.toFixed(1)}
                              </span>
                              <Scale className="w-3.5 h-3.5 text-teal-600" />
                              <span className="text-sm text-slate-400">
                                ({avocat.reviews_count_mizan})
                              </span>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {avocat.verified && (
                    <div className="flex items-center gap-1 text-[11px] text-teal-600 font-medium bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Vérifié par Mizan
                    </div>
                  )}
                  {avocat.is_cour_supreme && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-700 font-medium bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Agréé Cour Suprême
                    </div>
                  )}
                </div>
              </div>
              <div className="hero-right opacity-0 invisible bg-gradient-to-b from-teal-500 to-teal-800 flex items-center justify-center relative order-first sm:order-last min-h-[260px] sm:min-h-0">
                {avocat.avatar_url ? (
                  <img
                    src={avocat.avatar_url}
                    alt={`${avocat.prenom} ${avocat.nom}`}
                    className="w-full h-full object-cover absolute inset-0"
                  />
                ) : (
                  <span className="text-6xl font-bold text-white/90">
                    {getInitials(avocat.prenom, avocat.nom)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Spécialités ── */}
          {avocat.specialites && avocat.specialites.length > 0 && (
            <Card className="content-card opacity-0 invisible shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Briefcase className="w-4 h-4 text-teal-600" />
                  Domaines d'expertise
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {avocat.specialites.map((spec: string, i: number) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-xs font-medium border border-teal-100 hover:bg-teal-100 transition-all"
                    >
                      <span className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                      {spec}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Consultation panel — après spécialités ── */}
          {showConsultPanel && (
            <div className="content-card opacity-0 invisible">
              <ConsultationPanel
                avocat={avocat}
                pricingChannels={pricingChannels}
                user={user}
                profile={profile}
                supabase={supabase}
                onSuccess={() =>
                  setTimeout(() => setShowFeedbackPopup(true), 3000)
                }
                onBooking={() => setIsBookingModalOpen(true)}
              />
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="mt-3 w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Video className="w-4 h-4" /> Consultation vidéo
              </button>
            </div>
          )}

          {/* ── Info cards ── */}
          {allInfoItems.length > 0 && (
            <>
              <div className="content-card opacity-0 invisible sm:hidden flex flex-col gap-2.5">
                {allInfoItems.map((item, i) => (
                  <InfoCardMobile
                    key={i}
                    {...item}
                    href={item.href ?? undefined}
                    whatsappHref={item.whatsappHref ?? undefined}
                  />
                ))}
              </div>
              <div
                className={`content-card opacity-0 invisible hidden sm:grid ${gridClass(allInfoItems.length)} gap-3`}
              >
                {allInfoItems.map((item, i) => (
                  <InfoCardDesktop
                    key={i}
                    {...item}
                    href={item.href ?? undefined}
                    whatsappHref={item.whatsappHref ?? undefined}
                  />
                ))}
              </div>
            </>
          )}

          {/* ── Carte ── */}
          {hasAddress && (
            <div className="content-card opacity-0 invisible bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <LawyerMap
                address={[
                  avocat.adresse?.rue,
                  avocat.adresse?.ville || avocat.ville,
                  avocat.wilaya,
                  "Algérie",
                ]
                  .filter(Boolean)
                  .join(", ")}
                showContact={showContact}
                googleMapsUrl={getGoogleMapsUrl(avocat)}
                onLockedClick={() => router.push("/auth/client/register")}
              />
            </div>
          )}

          {/* ── Avis ── */}
          <div className="reviews-section opacity-0 invisible mt-4">
            <ReviewSection
              lawyerId={avocat.id}
              onReviewSubmitted={reloadAvocat}
            />
          </div>
        </div>
      </div>

      {/* ── CP-C sticky bottom bar mobile ── */}
      {showConsultPanel && (
        <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white border-t border-slate-200 px-4 py-3 shadow-lg">
          <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
            <div className="min-w-0">
              <p className="text-xs text-slate-500 truncate">
                {avocat.prenom} {avocat.nom}
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate">
                {avocat.consultation_price
                  ? `Consultation dès ${avocat.consultation_price.toLocaleString("fr-DZ")} DA`
                  : "Consultation disponible"}
              </p>
            </div>
            <button
              onClick={() => setIsConsultSheetOpen(true)}
              className="flex-shrink-0 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer transition-all whitespace-nowrap"
            >
              Consulter →
            </button>
          </div>
        </div>
      )}

      <VideoConsultationModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        avocat={avocat}
        userId={user?.id || ""}
        supabase={supabase}
        onSuccess={() => setTimeout(() => setShowFeedbackPopup(true), 3000)}
      />
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        lawyerId={avocat.id}
        lawyerName={`${avocat.prenom} ${avocat.nom}`}
        profession={avocat.profession || "notaire"}
        onSuccess={() => setTimeout(() => setShowFeedbackPopup(true), 3000)}
      />
      <ConsultationSheet
        isOpen={isConsultSheetOpen}
        onClose={() => setIsConsultSheetOpen(false)}
        avocat={avocat}
        pricingChannels={pricingChannels}
        user={user}
        profile={profile}
        supabase={supabase}
        onSuccess={() => setTimeout(() => setShowFeedbackPopup(true), 3000)}
        onBooking={() => {
          setIsConsultSheetOpen(false);
          setIsBookingModalOpen(true);
        }}
      />
      {showFeedbackPopup && (
        <FeedbackPopup onClose={() => setShowFeedbackPopup(false)} />
      )}
    </div>
  );
}
