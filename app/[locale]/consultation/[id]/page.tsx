"use client";
import { use, useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { localizedDigits } from "@/lib/arabicNumerals";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getAvocatById } from "@/lib/avocatsData";
import { useAuth } from "@/hooks/useAuth";
import { AvocatData } from "@/types";
import Link from "next/link";
import {
  MessageSquare,
  Phone,
  Video,
  Mail,
  ArrowLeft,
  CheckCircle,
  Clock,
  Star,
  ChevronRight,
} from "lucide-react";

const CANAL_CONFIG: Record<
  string,
  { icon: any; label: string; desc: string; duration?: string }
> = {
  message: {
    icon: MessageSquare,
    label: "Message écrit",
    desc: "Réponse sous 24-48h par messagerie sécurisée Mizan",
  },
  phone: {
    icon: Phone,
    label: "Téléphonique",
    desc: "Appel vocal avec l'avocat",
    duration: "30 min",
  },
  video_30: {
    icon: Video,
    label: "Vidéo",
    desc: "Consultation par vidéo",
    duration: "30 min",
  },
  video_60: {
    icon: Video,
    label: "Vidéo",
    desc: "Consultation par vidéo",
    duration: "1h",
  },
  email: {
    icon: Mail,
    label: "Email",
    desc: "Échange par email sécurisé, réponse sous 48h",
  },
};

const PROF_LABELS: Record<string, string> = {
  avocat: "Avocat",
  notaire: "Notaire",
  huissier: "Huissier",
  comptable: "Comptable",
  "expert-comptable": "Expert Comptable",
};

interface Pricing {
  id: string;
  type: string;
  label: string;
  duration?: string;
  base_price?: number;
  is_active: boolean;
}

export default function ConsultationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const supabase = createClient();
  const { user, profile } = useAuth();
  const router = useRouter();

  const locale = useLocale();
  const ld = (s: string) => localizedDigits(s, locale);
  const [avocat, setAvocat] = useState<AvocatData | null>(null);
  const [pricing, setPricing] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    Promise.all([
      getAvocatById(id),
      supabase
        .from("consultation_pricing")
        .select("*")
        .eq("lawyer_id", id)
        .eq("is_active", true)
        .order("created_at"),
    ]).then(([av, { data: pr }]) => {
      setAvocat(av);
      setPricing(pr || []);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const canal = params.get("canal");
    if (canal) setSelected(canal);
  }, []);

  const handleConsult = async () => {
    if (!user || profile?.user_type !== "client") {
      const back = `/consultation/${id}${selected ? `?canal=${selected}` : ""}`;
      router.push(`/auth/client/register?redirect=${encodeURIComponent(back)}`);
      return;
    }
    if (!selected) return;
    setSending(true);
    try {
      const canal = CANAL_CONFIG[selected];
      const price = pricing.find((p) => p.type === selected);
      const { data: existing } = await supabase
        .from("consultations")
        .select("id")
        .eq("client_id", user.id)
        .eq("lawyer_id", id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      let cid = existing?.id;
      if (!cid) {
        const { data: nc } = await supabase
          .from("consultations")
          .insert({
            client_id: user.id,
            lawyer_id: id,
            status: "pending",
          })
          .select("id")
          .single();
        cid = nc?.id;
      }
      if (cid) {
        const priceStr = price?.base_price
          ? `\n💰 Tarif indicatif : ${price.base_price.toLocaleString()} DA`
          : "";
        const durStr = price?.duration ? ` · ${price.duration}` : "";
        await supabase.from("consultation_messages").insert({
          consultation_id: cid,
          sender_id: user.id,
          sender_type: "client",
          message: `📋 Demande de consultation\n\n🔔 Canal choisi : ${canal.label}${durStr}${priceStr}\n\nMerci de confirmer votre disponibilité et le tarif définitif selon mon dossier.`,
          is_read: false,
        });
      }
      setSent(true);
      setTimeout(() => router.push(`/mes-consultations`), 2500);
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-50 via-white to-teal-50 dark:bg-none flex items-center justify-center">
        <div className="animate-spin rounded-full h-7 w-7 border-2 border-teal-600 dark:border-[#6fcf9f] border-t-transparent" />
      </div>
    );

  if (!avocat)
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-slate-500 dark:text-[#A8A8A6]">
          Professionnel introuvable.
        </p>
      </div>
    );

  const profLabel =
    PROF_LABELS[avocat.profession || "avocat"] || "Professionnel";
  const hasPricing = pricing.length > 0;

  const defaultCanaux = [
    {
      type: "message",
      label: "Message écrit",
      base_price: undefined,
      duration: undefined,
    },
    {
      type: "video_30",
      label: "Vidéo 30 min",
      base_price: undefined,
      duration: "30 min",
    },
    {
      type: "phone",
      label: "Téléphonique",
      base_price: undefined,
      duration: "30 min",
    },
  ];
  const canaux = hasPricing ? pricing : defaultCanaux;

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-50 via-white to-teal-50 dark:bg-none">
      <div className="max-w-xl mx-auto px-4 py-8">
        <Link
          href={`/lawyers/${id}`}
          className="inline-flex items-center gap-2 text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#6fcf9f] text-sm font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Retour au profil
        </Link>

        <div className="bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-2xl p-5 mb-5 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-700 dark:bg-[#0F6E56] flex items-center justify-center text-white text-lg font-bold flex-shrink-0 overflow-hidden">
              {avocat.avatar_url ? (
                <img
                  src={avocat.avatar_url}
                  className="w-full h-full object-cover"
                  alt=""
                />
              ) : (
                `${avocat.prenom?.[0]}${avocat.nom?.[0]}`
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-teal-600 dark:text-[#6fcf9f] uppercase tracking-widest mb-0.5">
                {profLabel} · {avocat.barreau}
              </p>
              <p className="text-base font-bold text-slate-900 dark:text-[#F5F5F4] truncate">
                Maître {avocat.prenom} {avocat.nom}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-slate-500 dark:text-[#A8A8A6]">
                  {avocat.experience?.annees} ans d'expérience
                </span>
                {avocat.rating_google && avocat.rating_google > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-[#E8E8E6]">
                      {ld(avocat.rating_google.toFixed(1))}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-[#7A7A78]">
                      ({ld(String(avocat.reviews_count_google))})
                    </span>
                  </div>
                )}
                {avocat.verified && (
                  <div className="flex items-center gap-1 text-teal-600 dark:text-[#6fcf9f]">
                    <CheckCircle className="w-3 h-3" />
                    <span className="text-xs font-medium">Vérifié</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {sent && (
          <div className="bg-white dark:bg-[#1c1c1e] border border-teal-100 dark:border-[#6fcf9f]/20 rounded-2xl p-8 text-center shadow-sm dark:shadow-none mb-5">
            <div className="w-14 h-14 bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-100 dark:border-[#6fcf9f]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-teal-600 dark:text-[#6fcf9f]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F5F5F4] mb-1">
              Demande envoyée
            </h3>
            <p className="text-sm text-slate-500 dark:text-[#A8A8A6]">
              Redirection vers vos consultations...
            </p>
          </div>
        )}

        {!sent && (
          <>
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F5F4] mb-1">
              Choisir un type de consultation
            </h2>
            <p className="text-sm text-slate-500 dark:text-[#A8A8A6] mb-5">
              Sélectionnez le format qui correspond à votre besoin.
              {!hasPricing &&
                " Les tarifs sont fixés par le professionnel selon votre dossier."}
            </p>

            <div className="space-y-3 mb-6">
              {canaux.map((canal: any) => {
                const config = CANAL_CONFIG[canal.type];
                if (!config) return null;
                const Icon = config.icon;
                const isSelected = selected === canal.type;
                return (
                  <button
                    key={canal.type}
                    onClick={() => setSelected(canal.type)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-teal-50 dark:bg-[#6fcf9f]/10 border-teal-300 dark:border-[#6fcf9f] shadow-sm dark:shadow-none"
                        : "bg-white dark:bg-[#1c1c1e] border-slate-200 dark:border-[#1c2220] hover:border-teal-200 dark:hover:border-[#6fcf9f]/50 hover:bg-teal-50/30 dark:hover:bg-[#6fcf9f]/5"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected
                            ? "bg-teal-600 dark:bg-[#0F6E56]"
                            : "bg-slate-100 dark:bg-[#141415]"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${isSelected ? "text-white" : "text-slate-500 dark:text-[#A8A8A6]"}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900 dark:text-[#F5F5F4]">
                            {config.label}
                          </p>
                          {canal.duration && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-[#A8A8A6] bg-slate-100 dark:bg-[#141415] px-2 py-0.5 rounded-full">
                              <Clock className="w-2.5 h-2.5" />
                              {canal.duration}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-[#A8A8A6] mt-0.5">
                          {config.desc}
                        </p>
                        <p className="text-sm font-bold text-teal-700 dark:text-[#6fcf9f] mt-1">
                          {canal.base_price
                            ? `À partir de ${canal.base_price.toLocaleString()} DA`
                            : "Tarif sur demande"}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${
                          isSelected
                            ? "border-teal-600 dark:border-[#6fcf9f] bg-teal-600 dark:bg-[#0F6E56]"
                            : "border-slate-300 dark:border-[#3a3a3d]"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            viewBox="0 0 20 20"
                            fill="white"
                            className="w-full h-full"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-50 dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-xl p-3 mb-5 flex items-start gap-2">
              <svg
                className="w-4 h-4 text-slate-400 dark:text-[#7A7A78] mt-0.5 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-xs text-slate-500 dark:text-[#A8A8A6] leading-relaxed">
                Le tarif indiqué est indicatif. Le professionnel confirmera le
                tarif définitif selon la complexité de votre dossier avant tout
                paiement.
              </p>
            </div>

            {!user ? (
              (() => {
                const back = `/consultation/${id}${selected ? `?canal=${selected}` : ""}`;
                const q = `?redirect=${encodeURIComponent(back)}`;
                return (
                  <div className="space-y-3">
                    <Link href={`/auth/client/register${q}`} className="block">
                      <button className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-[#0F6E56] dark:hover:bg-[#085041] text-white py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all">
                        Créer un compte gratuit pour consulter
                      </button>
                    </Link>
                    <Link href={`/auth/client/login${q}`} className="block">
                      <button className="w-full bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] hover:bg-slate-50 dark:hover:bg-[#1c2220] text-slate-700 dark:text-[#E8E8E6] py-3.5 rounded-2xl font-medium text-sm cursor-pointer transition-all">
                        J'ai déjà un compte — Me connecter
                      </button>
                    </Link>
                  </div>
                );
              })()
            ) : (
              <button
                onClick={handleConsult}
                disabled={!selected || sending}
                className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-[#0F6E56] dark:hover:bg-[#085041] disabled:opacity-40 text-white py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
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
          </>
        )}
      </div>
    </div>
  );
}
