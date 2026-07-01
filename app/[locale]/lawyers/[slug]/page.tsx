"use client";
import React, {
  use,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import { useLocale } from "next-intl";
import { localizedDigits } from "@/lib/arabicNumerals";
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
  Mail,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { getAvocatById } from "@/lib/avocatsData";
import { getInitials } from "@/lib/utils";
import { AvocatData } from "@/types";
import { createClient } from "@/lib/supabase/client";
import BookingModal from "@/components/booking/BookingModal";
import ReviewSection from "@/components/reviews/ReviewSection";
import { ConsultationPanel } from "@/components/consultation/ConsultationPanel";
import Link from "next/link";
import { formatPhoneNumber, detectPhoneType } from "@/lib/phoneFormatter";
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
        className={`w-9 h-9 flex items-center justify-center flex-shrink-0 rounded-lg text-base ${teal ? "bg-white dark:bg-[#1c1c1e] border border-teal-100 dark:border-[#6fcf9f]/20" : "bg-teal-50 dark:bg-[#141415] border border-teal-100 dark:border-[#1c2220]"}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`text-xs mb-0.5 ${teal ? "text-teal-600 dark:text-[#6fcf9f]" : "text-slate-400 dark:text-[#7A7A78]"}`}
        >
          {label}
        </div>
        <div
          className={`text-sm font-medium truncate ${teal ? "text-teal-800 dark:text-[#6fcf9f]" : "text-slate-800 dark:text-[#F5F5F4]"}`}
        >
          {value}
        </div>
        {sublabel && !whatsappHref && (
          <div className="text-xs text-slate-400 dark:text-[#7A7A78] mt-0.5">
            {sublabel}
          </div>
        )}
      </div>
      <ChevronRight
        className={`w-4 h-4 flex-shrink-0 ${teal ? "text-teal-400 dark:text-[#6fcf9f]" : "text-slate-300 dark:text-[#3a3a3d]"}`}
      />
    </div>
  );
  return (
    <div
      className={`rounded-xl border shadow-sm overflow-hidden ${teal ? "bg-teal-50 dark:bg-[#141415] border-teal-100 dark:border-[#1c2220]" : "bg-white dark:bg-[#1c1c1e] border-slate-200 dark:border-[#1c2220]"}`}
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
        <div className="flex border-t border-slate-100 dark:border-[#1c2220]">
          <a
            href={href}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-600 dark:text-[#E8E8E6] hover:bg-slate-50 dark:hover:bg-[#2a2a2d] border-r border-slate-100 dark:border-[#1c2220]"
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
      className={`rounded-xl border shadow-sm overflow-hidden flex flex-col h-full ${teal ? "bg-teal-50 dark:bg-[#141415] border-teal-100 dark:border-[#1c2220]" : "bg-white dark:bg-[#1c1c1e] border-slate-200 dark:border-[#1c2220]"}`}
    >
      <div className="flex items-start gap-3 p-4 flex-1">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-base ${teal ? "bg-white dark:bg-[#1c1c1e] border border-teal-100 dark:border-[#6fcf9f]/20" : "bg-teal-50 dark:bg-[#141415] border border-teal-100 dark:border-[#1c2220]"}`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className={`text-xs font-semibold uppercase tracking-wide mb-1 ${teal ? "text-teal-600 dark:text-[#6fcf9f]" : "text-slate-400 dark:text-[#7A7A78]"}`}
          >
            {label}
          </div>
          <div
            className={`text-sm font-medium ${teal ? "text-teal-800 dark:text-[#6fcf9f]" : "text-slate-800 dark:text-[#F5F5F4]"}`}
          >
            {value}
          </div>
          {sublabel && !whatsappHref && (
            <div
              className={`text-xs mt-0.5 ${teal ? "text-teal-500 dark:text-[#6fcf9f]/80" : "text-slate-400 dark:text-[#7A7A78]"}`}
            >
              {sublabel}
            </div>
          )}
        </div>
        {!whatsappHref && (
          <ChevronRight
            className={`w-4 h-4 flex-shrink-0 mt-0.5 ${teal ? "text-teal-400 dark:text-[#6fcf9f]" : "text-slate-300 dark:text-[#3a3a3d]"}`}
          />
        )}
      </div>
      {whatsappHref && href && (
        <div className="flex border-t border-slate-100 dark:border-[#1c2220] mt-auto">
          <a
            href={href}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-600 dark:text-[#E8E8E6] hover:bg-slate-50 dark:hover:bg-[#2a2a2d] border-r border-slate-100 dark:border-[#1c2220]"
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

export default function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params as Promise<{ slug: string }>);
  const router = useRouter();
  const locale = useLocale();
  const ld = (s: string) => localizedDigits(s, locale);
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();
  const [avocat, setAvocat] = useState<AvocatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [pricingChannels, setPricingChannels] = useState<any[]>([]);
  const supabase = createClient();
  const hasAnimated = useRef(false);

  const isOwnProfile = user?.id === avocat?.id;
  const isClient = !!user && profile?.user_type === "client";
  const showConsultPanel = !user || isClient || isOwnProfile;

  useEffect(() => {
    getAvocatById(slug)
      .then((data) => {
        setAvocat(data);
        if (data?.id) {
          supabase
            .from("consultation_pricing")
            .select("*")
            .eq("lawyer_id", data.id)
            .eq("is_active", true)
            .order("created_at")
            .then(({ data: pr }) => setPricingChannels(pr || []));
        }
      })
      .catch(() => setAvocat(null))
      .finally(() => setLoading(false));
  }, [slug]);

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
        if (document.querySelector(".reviews-section"))
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
    getAvocatById(slug)
      .then((d) => {
        if (d) setAvocat(d);
      })
      .catch(() => {});
  };

  if (loading)
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:from-[#0a0a0a] dark:via-[#141415] dark:to-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
          <div className="h-80 bg-slate-200 dark:bg-[#1c1c1e] rounded-2xl animate-pulse" />
          <div className="h-32 bg-slate-200 dark:bg-[#1c1c1e] rounded-xl animate-pulse" />
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
  const showContact = isOwnProfile;
  const rawSiteUrl = avocat.contact?.site_web?.trim();
  const validSiteUrl = rawSiteUrl
    ? rawSiteUrl.startsWith("http")
      ? rawSiteUrl
      : `https://${rawSiteUrl}`
    : undefined;
  const siteInfo = validSiteUrl ? getSiteLabel(validSiteUrl) : null;
  const hasAddress = !!(
    avocat.adresse?.rue ||
    avocat.adresse?.ville ||
    avocat.ville
  );
  const avokatProfessions: string[] =
    (avocat as any).professions?.length > 1
      ? (avocat as any).professions
      : [avocat.profession || "avocat"];

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
                <Linkedin className="w-3.5 h-3.5 text-teal-600 dark:text-[#6fcf9f]" />
              ) : (
                <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-[#6fcf9f]" />
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
        icon: (
          <CheckCircle className="w-3.5 h-3.5 text-teal-600 dark:text-[#6fcf9f]" />
        ),
        label: "Vous êtes ce professionnel ?",
        value: "Réclamer ce profil",
        href: `/claim-profile/${avocat.id}`,
        teal: true,
      }
    : null;
  const allInfoItems = [...infoItems, ...(claimItem ? [claimItem] : [])];

  return (
    <div className="min-h-screen pt-16 pb-24 lg:pb-8 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:from-[#0a0a0a] dark:via-[#141415] dark:to-[#0a0a0a] overflow-x-hidden w-full">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push(`/search?${searchParams.toString()}`)}
          className="back-button opacity-0 invisible flex items-center gap-2 text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#8fdfb5] cursor-pointer mb-6 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Retour aux résultats</span>
          <span className="sm:hidden">Retour</span>
        </button>

        {isOwnProfile && (
          <div className="mb-4 flex items-center justify-between bg-teal-50 dark:bg-[#141415] border border-teal-200 dark:border-[#1c2220] rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-teal-700 dark:text-[#6fcf9f]" />
              <div>
                <p className="text-sm font-medium text-teal-900 dark:text-[#F5F5F4]">
                  Aperçu de votre profil public
                </p>
                <p className="text-xs text-teal-600 dark:text-[#6fcf9f]">
                  Tel que vos clients vous voient
                </p>
              </div>
            </div>
            <Link href="/profile">
              <button className="bg-teal-600 dark:bg-[#0F6E56] hover:bg-teal-700 dark:hover:bg-[#085041] text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-all">
                Modifier →
              </button>
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {/* Hero card */}
          <div className="bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_220px] min-h-[320px]">
              <div className="hero-left opacity-0 invisible p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {avokatProfessions.map((p: string) => (
                      <span
                        key={p}
                        className="text-[10px] font-semibold text-teal-600 dark:text-[#6fcf9f] uppercase tracking-widest bg-teal-50 dark:bg-[#141415] px-2 py-0.5 rounded-full border border-teal-100 dark:border-[#1c2220]"
                      >
                        {getProfLabel(p).label}
                      </span>
                    ))}
                    <span className="text-[10px] text-slate-400 dark:text-[#7A7A78]">
                      · {profInfo.numLabel} {avocat.barreau}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-light text-slate-800 dark:text-[#E8E8E6] leading-tight mb-1">
                    {toCivilite(avocat.genre)} {avocat.prenom}
                  </h1>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-[#F5F5F4] leading-tight mb-4">
                    {avocat.nom}
                  </h2>
                  <div className="w-10 h-0.5 bg-teal-600 dark:bg-[#0F6E56] mb-4" />
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-teal-500 dark:bg-[#6fcf9f] flex-shrink-0" />
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-teal-600 dark:text-[#6fcf9f]" />
                      <span className="text-sm text-slate-600 dark:text-[#E8E8E6] font-medium">
                        {ld(String(expAnnees))} ans d'expérience
                      </span>
                      <span className="text-sm text-slate-400 dark:text-[#7A7A78]">
                        · inscrit en{" "}
                        {avocat.experience?.date_inscription
                          ? ld(String(avocat.experience.date_inscription))
                          : "N/A"}
                      </span>
                    </div>
                    {avocat.langues && avocat.langues.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-teal-500 dark:bg-[#6fcf9f] flex-shrink-0" />
                        <Languages className="w-3.5 h-3.5 flex-shrink-0 text-teal-600 dark:text-[#6fcf9f]" />
                        <span className="text-sm text-slate-600 dark:text-[#E8E8E6] font-medium">
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
                              <span className="text-sm font-semibold text-slate-700 dark:text-[#E8E8E6]">
                                {ld(avocat.rating_google.toFixed(1))}
                              </span>
                              <Image
                                src="/google.png"
                                alt="Google"
                                width={10}
                                height={10}
                              />
                              <span className="text-sm text-slate-400 dark:text-[#7A7A78]">
                                ({ld(String(avocat.reviews_count_google))})
                              </span>
                            </div>
                          )}
                        {avocat.rating_mizan &&
                          (avocat.reviews_count_mizan ?? 0) > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-teal-500 text-teal-500 dark:fill-[#6fcf9f] dark:text-[#6fcf9f]" />
                              <span className="text-sm font-semibold text-slate-700 dark:text-[#E8E8E6]">
                                {ld(avocat.rating_mizan.toFixed(1))}
                              </span>
                              <Scale className="w-3.5 h-3.5 text-teal-600 dark:text-[#6fcf9f]" />
                              <span className="text-sm text-slate-400 dark:text-[#7A7A78]">
                                ({ld(String(avocat.reviews_count_mizan))})
                              </span>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {avocat.verified && (
                    <div className="flex items-center gap-1 text-[11px] text-teal-600 dark:text-[#6fcf9f] font-medium bg-teal-50 dark:bg-[#141415] border border-teal-100 dark:border-[#1c2220] px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Vérifié par Mizan
                    </div>
                  )}
                  {avocat.is_cour_supreme && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-700 dark:text-[#E0B568] font-medium bg-amber-50 dark:bg-[#3D2E1F] border border-amber-200 dark:border-[#5A4A2A] px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Agréé Cour Suprême
                    </div>
                  )}
                </div>
              </div>
              <div className="hero-right opacity-0 invisible bg-gradient-to-b from-teal-500 to-teal-800 dark:from-[#0F6E56] dark:to-[#04342C] flex items-center justify-center relative order-first sm:order-last min-h-[260px] sm:min-h-0">
                {avocat.avatar_url ? (
                  <Image
                    src={avocat.avatar_url}
                    alt={`${avocat.prenom} ${avocat.nom}`}
                    fill
                    className="object-cover"
                    sizes="(max-width:640px) 100vw, 220px"
                    priority
                  />
                ) : (
                  <span className="text-6xl font-bold text-white/90">
                    {getInitials(avocat.prenom, avocat.nom)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Spécialités */}
          {avocat.specialites && avocat.specialites.length > 0 && (
            <Card className="content-card opacity-0 invisible shadow-sm dark:bg-[#1c1c1e] dark:border-[#1c2220]">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-[#F5F5F4]">
                  <Briefcase className="w-4 h-4 text-teal-600 dark:text-[#6fcf9f]" />{" "}
                  Domaines d'expertise
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {avocat.specialites.map((spec: string, i: number) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-[#141415] text-teal-700 dark:text-[#6fcf9f] rounded-full text-xs font-medium border border-teal-100 dark:border-[#1c2220] hover:bg-teal-100 dark:hover:bg-[#1c2220] transition-all"
                    >
                      <span className="w-1.5 h-1.5 bg-teal-600 dark:bg-[#6fcf9f] rounded-full" />
                      {spec}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Panel consultation */}
          {showConsultPanel && (
            <div className="content-card opacity-0 invisible bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-2xl p-5 shadow-sm relative overflow-hidden">
              {isOwnProfile && (
                <div className="absolute inset-0 z-10 bg-white/80 dark:bg-[#1c1c1e]/90 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-2 bg-teal-50 dark:bg-[#141415] border border-teal-200 dark:border-[#1c2220] text-teal-800 dark:text-[#6fcf9f] text-xs font-medium px-4 py-2 rounded-full">
                    <Eye className="w-3.5 h-3.5" /> Ce que vos clients voient
                  </div>
                  <p className="text-xs text-slate-400 dark:text-[#7A7A78]">
                    Vous ne pouvez pas vous envoyer une consultation
                  </p>
                </div>
              )}
              <ConsultationPanel
                avocat={avocat}
                pricingChannels={pricingChannels}
                user={user}
                profile={profile}
                supabase={supabase}
                onSuccess={() => {}}
                onBooking={() => setIsBookingModalOpen(true)}
              />
            </div>
          )}

          {/* Contacts */}
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

          {/* Carte */}
          {hasAddress && (
            <div className="content-card opacity-0 invisible bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-2xl overflow-hidden shadow-sm">
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

          <div className="reviews-section opacity-0 invisible mt-4">
            <ReviewSection
              lawyerId={avocat.id}
              onReviewSubmitted={reloadAvocat}
            />
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        lawyerId={avocat.id}
        lawyerName={`${avocat.prenom} ${avocat.nom}`}
        profession={avocat.profession || "notaire"}
        onSuccess={() => {}}
      />
    </div>
  );
}
