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
  Mail,
  Smartphone,
  Scale,
  ChevronRight,
  Linkedin,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { getAvocatById } from "@/lib/avocatsData";
import { getInitials } from "@/lib/utils";
import { AvocatData, ProfilePageProps } from "@/types";
import { createClient } from "@/lib/supabase/client";
import ConsultationModal from "@/components/consultation/ConsultationModal";
import ReviewSection from "@/components/reviews/ReviewSection";
import Link from "next/link";
import { formatPhoneNumber, detectPhoneType } from "@/lib/phoneFormatter";
import FeedbackPopup from "@/components/FeedbackPopup";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, calculateConsultationPrice } from "@/lib/priceUtils";
import Image from "next/image";
import { toCivilite } from "@/lib/genderUtils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const getSiteLabel = (url: string): { label: string; sublabel: string } => {
  if (url.includes("linkedin.com"))
    return { label: "LinkedIn", sublabel: "Voir le profil" };
  if (url.includes("facebook.com"))
    return { label: "Facebook", sublabel: "Voir la page" };
  if (url.includes("instagram.com"))
    return { label: "Instagram", sublabel: "Voir le profil" };
  return { label: "Site web", sublabel: "Visiter le site" };
};

const getPhoneLabel = (type: string): string => {
  if (type === "mobile") return "Mobile";
  return "Fixe";
};

interface InfoItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  href?: string;
  teal?: boolean;
}

const InfoCardMobile = ({
  icon,
  label,
  value,
  href,
  teal = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  teal?: boolean;
}) => {
  const content = (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-sm ${teal ? "bg-teal-50 border-teal-100" : "bg-white border-slate-200"}`}
    >
      <div
        className={`w-9 h-9 flex items-center justify-center flex-shrink-0 rounded-lg ${teal ? "bg-white border border-teal-100" : "bg-teal-50 border border-teal-100"}`}
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
      </div>
      <ChevronRight
        className={`w-4 h-4 flex-shrink-0 ${teal ? "text-teal-400" : "text-slate-300"}`}
      />
    </div>
  );
  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }
  return <div>{content}</div>;
};

const InfoCardDesktop = ({
  icon,
  label,
  value,
  sublabel,
  href,
  teal = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  href?: string;
  teal?: boolean;
}) => {
  const content = (
    <div
      className={`rounded-xl border shadow-sm p-4 flex flex-col gap-2 h-full ${teal ? "bg-teal-50 border-teal-100" : "bg-white border-slate-200"}`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${teal ? "bg-white border border-teal-100" : "bg-teal-50 border border-teal-100"}`}
        >
          {icon}
        </div>
        <span
          className={`text-xs font-semibold uppercase tracking-wide ${teal ? "text-teal-600" : "text-slate-400"}`}
        >
          {label}
        </span>
      </div>
      <div
        className={`text-sm font-medium ${teal ? "text-teal-800" : "text-slate-800"}`}
      >
        {value}
      </div>
      {sublabel && (
        <div className={`text-xs ${teal ? "text-teal-500" : "text-teal-600"}`}>
          {sublabel}
        </div>
      )}
    </div>
  );
  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="block h-full"
      >
        {content}
      </a>
    );
  }
  return <div className="h-full">{content}</div>;
};

export default function ProfilePage({ params }: ProfilePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();
  const [avocat, setAvocat] = useState<AvocatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const supabase = createClient();
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const hasAnimated = useRef(false);

  const isOwnProfile = user?.id === avocat?.id;

  const handleConsultationSuccess = () => {
    setTimeout(() => setShowFeedbackPopup(true), 3000);
  };

  useEffect(() => {
    const loadAvocat = async () => {
      try {
        const avocatData = await getAvocatById(id);
        setAvocat(avocatData);
      } catch {
        setAvocat(null);
      } finally {
        setLoading(false);
      }
    };
    loadAvocat();
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
  }, [avocat, loading, user, profile]);

  useEffect(() => {
    if (!avocat?.id) return;
    const trackProfileView = async () => {
      try {
        const { ip } = await fetch("https://api.ipify.org?format=json").then(
          (r) => r.json()
        );
        await supabase
          .from("profile_views")
          .insert({ lawyer_id: avocat.id, viewer_id: null, viewer_ip: ip });
      } catch {}
    };
    trackProfileView();
  }, [avocat?.id, supabase]);

  const parsePhoneNumbers = (phoneString: string): string[] => {
    if (!phoneString) return [];
    return phoneString
      .split(",")
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
  };

  const reloadAvocatData = async () => {
    try {
      await new Promise((r) => setTimeout(r, 2000));
      const avocatData = await getAvocatById(id);
      if (avocatData) setAvocat(avocatData);
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
          <div className="h-80 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-32 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-24 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!avocat) notFound();

  const experienceAnnees = avocat.experience?.annees || 0;
  const tarifEstime = calculateConsultationPrice(
    avocat.consultation_price,
    avocat.experience?.annees || 0,
    avocat.rating_google || avocat.rating_mizan
  );

  const telephones = parsePhoneNumbers(avocat.contact?.telephone || "");
  const mobiles = parsePhoneNumbers(avocat.contact?.mobile || "");
  const allPhones = [
    ...telephones.map((p) => ({ number: p, type: detectPhoneType(p) })),
    ...mobiles.map((p) => ({ number: p, type: detectPhoneType(p) })),
  ];

  const showContact =
    user && (profile?.id === avocat.id || profile?.user_type === "client");
  const siteUrl = avocat.contact?.site_web ?? undefined;
  const siteInfo = siteUrl ? getSiteLabel(siteUrl) : null;

  const infoItems: InfoItem[] = [
    ...(avocat.adresse?.rue || avocat.ville
      ? [
          {
            icon: <MapPin className="w-3.5 h-3.5 text-teal-600" />,
            label: "Cabinet",
            value: `${avocat.adresse?.ville || avocat.ville}, ${avocat.wilaya}`,
            sublabel: avocat.adresse?.rue || undefined,
          },
        ]
      : []),
    ...(showContact
      ? allPhones.map((p) => ({
          icon:
            p.type === "mobile" ? (
              <Smartphone className="w-3.5 h-3.5 text-teal-600" />
            ) : (
              <Phone className="w-3.5 h-3.5 text-teal-600" />
            ),
          label: getPhoneLabel(p.type),
          value: formatPhoneNumber(p.number),
          sublabel: p.type === "mobile" ? "Appeler · WhatsApp" : "Appeler",
          href: `tel:${p.number.replace(/\s/g, "")}`,
        }))
      : []),
    ...(showContact && avocat.contact?.email
      ? [
          {
            icon: <Mail className="w-3.5 h-3.5 text-teal-600" />,
            label: "Email",
            value: avocat.contact.email,
            sublabel: "Envoyer un email",
            href: `mailto:${avocat.contact.email}`,
          },
        ]
      : []),
    ...(siteUrl && siteInfo
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
            sublabel: siteUrl.replace(/^https?:\/\/(www\.)?/, "").split("/")[0],
            href: siteUrl,
          },
        ]
      : []),
  ];

  const claimItem: InfoItem | null = !avocat.is_claimed
    ? {
        icon: <CheckCircle className="w-3.5 h-3.5 text-teal-600" />,
        label: "Vous êtes cet avocat ?",
        value: "Réclamer ce profil",
        href: `/claim-profile/${avocat.id}`,
        teal: true,
      }
    : null;

  const allInfoItems = claimItem ? [...infoItems, claimItem] : infoItems;

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 overflow-x-hidden w-full">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push(`/search?${searchParams.toString()}`)}
          className="back-button opacity-0 invisible flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors cursor-pointer mb-6 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Retour aux résultats</span>
          <span className="sm:hidden">Retour</span>
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_220px] min-h-[360px]">
            <div className="hero-left opacity-0 invisible p-7 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-3">
                  Avocat · Barreau de {avocat.barreau}
                </p>
                <h1 className="text-2xl sm:text-3xl font-light text-slate-800 leading-tight mb-1">
                  {toCivilite(avocat.genre)} {avocat.prenom}
                </h1>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight mb-4">
                  {avocat.nom}
                </h2>
                <div className="w-10 h-0.5 bg-teal-600 mb-5" />

                <div className="space-y-2 text-xs mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-teal-500 flex-shrink-0" />
                    <Calendar className="w-3 h-3 flex-shrink-0 text-teal-600" />
                    <span className="text-slate-700 font-medium">
                      {experienceAnnees} ans d'expérience
                    </span>
                    <span className="text-slate-400">
                      · inscrit en{" "}
                      {avocat.experience?.date_inscription || "N/A"}
                    </span>
                  </div>
                  {avocat.langues && avocat.langues.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-teal-500 flex-shrink-0" />
                      <Languages className="w-3 h-3 flex-shrink-0 text-teal-600" />
                      <span className="text-slate-700 font-medium">
                        {avocat.langues.join(" · ")}
                      </span>
                    </div>
                  )}
                  {((avocat.rating_google &&
                    (avocat.reviews_count_google ?? 0) > 0) ||
                    (avocat.rating_mizan &&
                      (avocat.reviews_count_mizan ?? 0) > 0)) && (
                    <div className="flex items-center gap-3 pt-1">
                      {avocat.rating_google &&
                        (avocat.reviews_count_google ?? 0) > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="font-semibold text-slate-700">
                              {avocat.rating_google.toFixed(1)}
                            </span>
                            <Image
                              src="/google.png"
                              alt="Google"
                              width={11}
                              height={11}
                            />
                            <span className="text-slate-400">
                              ({avocat.reviews_count_google})
                            </span>
                          </div>
                        )}
                      {avocat.rating_mizan &&
                        (avocat.reviews_count_mizan ?? 0) > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-teal-500 text-teal-500" />
                            <span className="font-semibold text-slate-700">
                              {avocat.rating_mizan.toFixed(1)}
                            </span>
                            <Scale className="w-3 h-3 text-teal-600" />
                            <span className="text-slate-400">
                              ({avocat.reviews_count_mizan})
                            </span>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xl font-bold text-teal-600">
                      {formatPrice(tarifEstime)}
                    </div>
                    <div className="text-xs text-slate-400">
                      {avocat.consultation_price
                        ? "Tarif consultation"
                        : "Tarif estimé"}
                    </div>
                  </div>
                  {(!user || profile?.user_type === "client") &&
                    !isOwnProfile && (
                      <button
                        onClick={() => {
                          if (!user || profile?.user_type !== "client") {
                            router.push("/auth/client/register");
                            return;
                          }
                          setIsConsultationModalOpen(true);
                        }}
                        className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white py-2.5 px-5 rounded-xl flex items-center gap-2 font-semibold text-sm transition-all shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Consulter
                      </button>
                    )}
                  {!user && !isOwnProfile && (
                    <Link href="/auth/client/register">
                      <button className="cursor-pointer bg-teal-600 hover:bg-teal-700 text-white py-2.5 px-5 rounded-xl font-semibold text-sm transition-all shadow-sm">
                        Créez un compte
                      </button>
                    </Link>
                  )}
                </div>
                {avocat.verified && (
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-teal-600 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Vérifié par Mizan
                  </div>
                )}
              </div>
            </div>

            <div className="hero-right opacity-0 invisible bg-gradient-to-b from-teal-500 to-teal-800 flex items-center justify-center relative order-first sm:order-last min-h-[320px] sm:min-h-0 aspect-[3/4] sm:aspect-auto">
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

        {avocat.specialites && avocat.specialites.length > 0 && (
          <Card className="content-card opacity-0 invisible shadow-sm mb-4">
            <CardHeader>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Briefcase className="w-4 h-4 text-teal-600" />
                Domaines d'expertise
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {avocat.specialites.map((spec: string, index: number) => (
                  <span
                    key={index}
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

        {!user && !isOwnProfile && (
          <div className="content-card opacity-0 invisible flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3.5 shadow-sm mb-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Phone className="w-3.5 h-3.5 text-slate-300" />
              Connectez-vous pour voir les coordonnées
            </div>
            <Link
              href="/auth/client/register"
              className="text-xs text-teal-600 font-semibold hover:text-teal-700 transition-colors"
            >
              Créer un compte →
            </Link>
          </div>
        )}

        {allInfoItems.length > 0 && (
          <>
            <div className="content-card opacity-0 invisible sm:hidden flex flex-col gap-2.5 mb-4">
              {allInfoItems.map((item, i) => (
                <InfoCardMobile
                  key={i}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                  href={item.href ?? undefined}
                  teal={item.teal}
                />
              ))}
            </div>

            <div className="content-card opacity-0 invisible hidden sm:grid grid-cols-3 gap-3 mb-4">
              {allInfoItems.map((item, i) => (
                <InfoCardDesktop
                  key={i}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                  sublabel={item.sublabel}
                  href={item.href ?? undefined}
                  teal={item.teal}
                />
              ))}
            </div>
          </>
        )}

        {(!user || profile?.user_type === "client") && !isOwnProfile && (
          <div className="content-card opacity-0 invisible lg:hidden mb-4">
            <button
              onClick={() => {
                if (!user || profile?.user_type !== "client") {
                  router.push("/auth/client/register");
                  return;
                }
                setIsConsultationModalOpen(true);
              }}
              className="cursor-pointer w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 font-semibold text-sm transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Demander une consultation
            </button>
          </div>
        )}

        <div className="reviews-section opacity-0 invisible mt-4">
          <ReviewSection
            lawyerId={avocat.id}
            onReviewSubmitted={reloadAvocatData}
          />
        </div>
      </div>

      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        lawyerId={avocat.id}
        lawyerName={`${avocat.prenom} ${avocat.nom}`}
        onSuccess={handleConsultationSuccess}
      />

      {showFeedbackPopup && (
        <FeedbackPopup onClose={() => setShowFeedbackPopup(false)} />
      )}
    </div>
  );
}
