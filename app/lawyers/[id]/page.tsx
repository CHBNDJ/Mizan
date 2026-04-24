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

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          ".profile-photo-card",
          { autoAlpha: 0, x: -40, scale: 0.97 },
          { autoAlpha: 1, x: 0, scale: 1, duration: 0.8 }
        )
        .fromTo(
          ".profile-action-cards",
          { autoAlpha: 0, x: -30 },
          { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.1 },
          "-=0.4"
        );

      gsap.fromTo(
        ".profile-content-cards",
        { autoAlpha: 0, x: 40 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.3,
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
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden bg-slate-200 animate-pulse aspect-[3/4]" />
              <div className="h-20 bg-slate-200 rounded-xl animate-pulse" />
              <div className="h-12 bg-slate-200 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-28 bg-slate-200 rounded-xl animate-pulse" />
              <div className="h-20 bg-slate-200 rounded-xl animate-pulse" />
              <div className="h-16 bg-slate-200 rounded-xl animate-pulse" />
            </div>
          </div>
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

  const consultationButton = (
    <button
      onClick={() => {
        if (!user || profile?.user_type !== "client") {
          router.push("/auth/client/register");
          return;
        }
        setIsConsultationModalOpen(true);
      }}
      className="cursor-pointer w-full bg-teal-600 hover:bg-teal-700 text-white transition-all duration-200 py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 font-semibold text-sm shadow-sm"
    >
      <MessageCircle className="w-4 h-4" />
      Demander une consultation
    </button>
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

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          <div className="order-1 lg:order-none flex flex-col gap-3">
            <div className="profile-photo-card opacity-0 invisible bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                {avocat.avatar_url ? (
                  <img
                    src={avocat.avatar_url}
                    alt={`${avocat.prenom} ${avocat.nom}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl font-bold text-white/90">
                    {getInitials(avocat.prenom, avocat.nom)}
                  </span>
                )}
                {avocat.verified && (
                  <div className="absolute bottom-3 right-3">
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-white/95 text-teal-600 rounded-full text-xs font-semibold shadow-sm">
                      <CheckCircle className="w-3 h-3" />
                      Vérifié
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h1 className="text-base font-bold text-slate-800 mb-1">
                  {toCivilite(avocat.genre)} {avocat.prenom} {avocat.nom}
                </h1>
                <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span>
                    {avocat.ville}, {avocat.wilaya} · Barreau de{" "}
                    {avocat.barreau}
                  </span>
                </div>

                {((avocat.rating_google &&
                  (avocat.reviews_count_google ?? 0) > 0) ||
                  (avocat.rating_mizan &&
                    (avocat.reviews_count_mizan ?? 0) > 0)) && (
                  <div className="space-y-1.5">
                    {avocat.rating_google &&
                      (avocat.reviews_count_google ?? 0) > 0 && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
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
                            ({avocat.reviews_count_google} avis)
                          </span>
                        </div>
                      )}
                    {avocat.rating_mizan &&
                      (avocat.reviews_count_mizan ?? 0) > 0 && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Star className="w-3 h-3 fill-teal-500 text-teal-500 flex-shrink-0" />
                          <span className="font-semibold text-slate-800">
                            {avocat.rating_mizan.toFixed(1)}
                          </span>
                          <Scale className="w-3 h-3 text-teal-600 flex-shrink-0" />
                          <span className="text-slate-500">
                            ({avocat.reviews_count_mizan} avis)
                          </span>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>

            <div className="profile-action-cards opacity-0 invisible bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-slate-400 mb-1">Tarif consultation</p>
              <div className="text-xl font-bold text-teal-600">
                {formatPrice(tarifEstime)}
              </div>
              {!avocat.consultation_price && (
                <p className="text-xs text-slate-400 italic mt-0.5">
                  Tarif estimé · basé sur l'expérience
                </p>
              )}
            </div>

            {user && profile?.id === avocat.id && (
              <div className="profile-action-cards opacity-0 invisible">
                <Card className="shadow-sm">
                  <CardHeader>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Contact
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
                    {avocat.contact?.telephone &&
                      parsePhoneNumbers(avocat.contact.telephone).map(
                        (phone, i) => (
                          <div key={i} className="flex items-center gap-2">
                            {detectPhoneType(phone) === "mobile" ? (
                              <Smartphone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            ) : (
                              <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            )}
                            <a
                              href={`tel:${phone.replace(/\s/g, "")}`}
                              className="text-xs text-slate-700 hover:text-teal-600 transition-colors"
                            >
                              {formatPhoneNumber(phone)}
                            </a>
                          </div>
                        )
                      )}
                    {avocat.contact?.mobile &&
                      parsePhoneNumbers(avocat.contact.mobile).map(
                        (mobile, i) => (
                          <div key={i} className="flex items-center gap-2">
                            {detectPhoneType(mobile) === "mobile" ? (
                              <Smartphone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            ) : (
                              <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            )}
                            <a
                              href={`tel:${mobile.replace(/\s/g, "")}`}
                              className="text-xs text-slate-700 hover:text-teal-600 transition-colors"
                            >
                              {formatPhoneNumber(mobile)}
                            </a>
                          </div>
                        )
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
              </div>
            )}

            {user &&
              profile?.user_type === "client" &&
              profile?.id !== avocat.id &&
              avocat.contact?.site_web && (
                <div className="profile-action-cards opacity-0 invisible">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <div className="text-sm font-semibold text-slate-800">
                        En savoir plus
                      </div>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                  </Card>
                </div>
              )}

            {!isOwnProfile && (!user || profile?.user_type !== "client") && (
              <div className="profile-action-cards opacity-0 invisible bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
                <p className="text-xs text-slate-600 font-medium mb-3">
                  Connectez-vous pour voir les coordonnées
                </p>
                <Link
                  href="/auth/client/register"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl transition-all"
                >
                  Créez un compte
                </Link>
              </div>
            )}

            {!avocat.is_claimed && (
              <div className="profile-action-cards opacity-0 invisible bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
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

            {(!user || profile?.user_type === "client") && !isOwnProfile && (
              <div className="profile-action-cards opacity-0 invisible hidden lg:block">
                {consultationButton}
                {user && profile?.user_type === "client" && (
                  <div className="mt-3">
                    <ContactCard
                      allPhoneNumbers={[
                        ...(avocat.contact?.telephone
                          ?.split(",")
                          .map((n) => n.trim()) || []),
                        ...(avocat.contact?.mobile
                          ?.split(",")
                          .map((n) => n.trim()) || []),
                      ].filter(Boolean)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="order-2 lg:order-none flex flex-col gap-4">
            {avocat.specialites && avocat.specialites.length > 0 && (
              <Card className="profile-content-cards opacity-0 invisible shadow-sm">
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

            <Card className="profile-content-cards opacity-0 invisible shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Expérience
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-slate-50 rounded-xl">
                    <div className="text-2xl font-bold text-teal-600 mb-1">
                      {experienceAnnees} ans
                    </div>
                    <div className="text-xs text-slate-500">d'expérience</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-xl">
                    <div className="text-lg font-bold text-teal-600 mb-1">
                      {avocat.experience?.date_inscription || "N/A"}
                    </div>
                    <div className="text-xs text-slate-500">
                      Inscription barreau
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {avocat.langues && avocat.langues.length > 0 && (
              <Card className="profile-content-cards opacity-0 invisible shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Languages className="w-4 h-4 text-teal-600" />
                    Langues parlées
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {avocat.langues.map((langue: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                      >
                        {langue}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="profile-content-cards opacity-0 invisible shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  Cabinet
                </div>
              </CardHeader>
              <CardContent>
                <div className="font-medium text-slate-700 text-sm">
                  {avocat.adresse?.rue || "Adresse non spécifiée"}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {avocat.adresse?.code_postal || ""}{" "}
                  {avocat.adresse?.ville || avocat.ville}
                  {avocat.adresse?.wilaya && `, ${avocat.adresse.wilaya}`}
                </div>
              </CardContent>
            </Card>

            {(!user || profile?.user_type === "client") && !isOwnProfile && (
              <div className="profile-content-cards opacity-0 invisible lg:hidden flex flex-col gap-3">
                {consultationButton}
                {user && profile?.user_type === "client" && (
                  <ContactCard
                    allPhoneNumbers={[
                      ...(avocat.contact?.telephone
                        ?.split(",")
                        .map((n) => n.trim()) || []),
                      ...(avocat.contact?.mobile
                        ?.split(",")
                        .map((n) => n.trim()) || []),
                    ].filter(Boolean)}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="reviews-section opacity-0 invisible mt-8">
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
