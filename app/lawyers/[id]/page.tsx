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
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { getAvocatById } from "@/lib/avocatsData";
import { getInitials } from "@/lib/utils";
import { AvocatData, ProfilePageProps } from "@/types";
import { createClient } from "@/lib/supabase/client";
import ConsultationModal from "@/components/consultation/ConsultationModal";
import { ContactCard } from "@/components/ContactCard";
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

export default function ProfilePageDesign2({ params }: ProfilePageProps) {
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
        ".hero-card",
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.1 }
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
          delay: 0.4,
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
          <div className="h-72 bg-slate-200 rounded-2xl animate-pulse" />
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

        <div className="hero-card opacity-0 invisible bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">
            <div className="relative bg-gradient-to-b from-teal-500 to-teal-800 flex items-center justify-center min-h-[220px] sm:min-h-[280px]">
              {avocat.avatar_url ? (
                <img
                  src={avocat.avatar_url}
                  alt={`${avocat.prenom} ${avocat.nom}`}
                  className="w-full h-full object-cover absolute inset-0"
                />
              ) : (
                <span className="text-5xl font-bold text-white/90">
                  {getInitials(avocat.prenom, avocat.nom)}
                </span>
              )}
              {avocat.verified && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium border border-white/30">
                    <CheckCircle className="w-3 h-3" />
                    Vérifié
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 flex flex-col justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-800 mb-1">
                  {toCivilite(avocat.genre)} {avocat.prenom} {avocat.nom}
                </h1>
                <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span>
                    {avocat.ville}, {avocat.wilaya} · Barreau de{" "}
                    {avocat.barreau}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {avocat.specialites
                    ?.slice(0, 3)
                    .map((spec: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium border border-teal-100"
                      >
                        <span className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                        {spec}
                      </span>
                    ))}
                  {(avocat.specialites?.length ?? 0) > 3 && (
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-medium">
                      +{(avocat.specialites?.length ?? 0) - 3}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
                  <span>⏱ {experienceAnnees} ans d'expérience</span>
                  {avocat.langues && (
                    <span>🗣 {avocat.langues.join(" · ")}</span>
                  )}
                </div>

                {((avocat.rating_google &&
                  (avocat.reviews_count_google ?? 0) > 0) ||
                  (avocat.rating_mizan &&
                    (avocat.reviews_count_mizan ?? 0) > 0)) && (
                  <div className="flex flex-wrap gap-3 mb-3">
                    {avocat.rating_google &&
                      (avocat.reviews_count_google ?? 0) > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-slate-800">
                            {avocat.rating_google.toFixed(1)}
                          </span>
                          <Image
                            src="/google.png"
                            alt="Google"
                            width={11}
                            height={11}
                          />
                          <span className="text-slate-500">
                            ({avocat.reviews_count_google})
                          </span>
                        </div>
                      )}
                    {avocat.rating_mizan &&
                      (avocat.reviews_count_mizan ?? 0) > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3 h-3 fill-teal-500 text-teal-500" />
                          <span className="font-semibold text-slate-800">
                            {avocat.rating_mizan.toFixed(1)}
                          </span>
                          <Scale className="w-3 h-3 text-teal-600" />
                          <span className="text-slate-500">
                            ({avocat.reviews_count_mizan})
                          </span>
                        </div>
                      )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                {(!user || profile?.user_type === "client") && !isOwnProfile ? (
                  <button
                    onClick={() => {
                      if (!user || profile?.user_type !== "client") {
                        router.push("/auth/client/register");
                        return;
                      }
                      setIsConsultationModalOpen(true);
                    }}
                    className="flex-1 cursor-pointer bg-teal-600 hover:bg-teal-700 text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Demander une consultation
                  </button>
                ) : !isOwnProfile &&
                  (!user || profile?.user_type !== "client") ? (
                  <Link href="/auth/client/register" className="flex-1">
                    <button className="w-full cursor-pointer bg-teal-600 hover:bg-teal-700 text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all">
                      Créez un compte
                    </button>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-teal-600">
                    {formatPrice(tarifEstime)}
                  </div>
                  <div className="text-xs text-slate-400">
                    {avocat.consultation_price
                      ? "/ consultation"
                      : "Tarif estimé"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 px-5 py-3 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/50">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                Cabinet
              </p>
              <p className="text-xs text-slate-700">
                {avocat.adresse?.rue || "Non renseigné"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                Inscription
              </p>
              <p className="text-xs text-slate-700">
                Barreau de {avocat.barreau} ·{" "}
                {avocat.experience?.date_inscription || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                Langues
              </p>
              <p className="text-xs text-slate-700">
                {avocat.langues?.join(" · ") || "Non renseigné"}
              </p>
            </div>
          </div>
        </div>

        {!avocat.is_claimed && (
          <div className="content-card opacity-0 invisible bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm mb-4">
            <p className="text-xs font-semibold text-slate-600 mb-2">
              Vous êtes cet avocat ?
            </p>
            <Link
              href={`/claim-profile/${avocat.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold text-xs rounded-xl border border-teal-100 transition-all"
            >
              Réclamer ce profil
            </Link>
          </div>
        )}

        {avocat.specialites && avocat.specialites.length > 0 && (
          <Card className="content-card opacity-0 invisible shadow-sm mb-4">
            <CardHeader>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Briefcase className="w-4 h-4 text-teal-600" />
                Tous les domaines d'expertise
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {avocat.specialites.map((spec: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-50 text-teal-700 rounded-full text-xs font-medium border border-teal-100 hover:bg-teal-100 transition-all"
                  >
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full" />
                    {spec}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {user && profile?.user_type === "client" && !isOwnProfile && (
          <Card className="content-card opacity-0 invisible shadow-sm mb-4">
            <CardContent className="pt-4">
              <ContactCard
                allPhoneNumbers={[
                  ...(avocat.contact?.telephone
                    ?.split(",")
                    .map((n) => n.trim()) || []),
                  ...(avocat.contact?.mobile?.split(",").map((n) => n.trim()) ||
                    []),
                ].filter(Boolean)}
              />
            </CardContent>
          </Card>
        )}

        {user && profile?.id === avocat.id && (
          <Card className="content-card opacity-0 invisible shadow-sm mb-4">
            <CardHeader>
              <h3 className="text-sm font-semibold text-slate-800">
                Mes coordonnées
              </h3>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {avocat.contact?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <a
                    href={`mailto:${avocat.contact.email}`}
                    className="text-xs text-slate-700 hover:text-teal-600 transition-colors break-all"
                  >
                    {avocat.contact.email}
                  </a>
                </div>
              )}
              {avocat.contact?.site_web && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <a
                    href={avocat.contact.site_web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-700 hover:text-teal-600 transition-colors break-all"
                  >
                    Voir le site web
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
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
