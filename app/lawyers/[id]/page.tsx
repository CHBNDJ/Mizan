"use client";
import React, { use, useState, useEffect } from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Smartphone,
  Mail,
  Globe,
  Linkedin,
  Star,
  CheckCircle,
  Calendar,
  Languages,
  Briefcase,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { getAvocatById } from "@/lib/avocatsData";
import { getInitials } from "@/lib/utils";
import { formatMultiplePhones } from "@/lib/phoneFormatter";
import { AvocatData, ProfilePageProps } from "@/types";
import { createClient } from "@/lib/supabase/client";
import ConsultationModal from "@/components/consultation/ConsultationModal";
import ReviewSection from "@/components/reviews/ReviewSection";
import Link from "next/link";
import FeedbackPopup from "@/components/FeedbackPopup";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, calculateConsultationPrice } from "@/lib/priceUtils";

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

  // ✅ Vérifier si c'est le profil de l'utilisateur connecté
  const isOwnProfile = user?.id === avocat?.id;

  const handleConsultationSuccess = () => {
    setTimeout(() => {
      setShowFeedbackPopup(true);
    }, 3000);
  };

  useEffect(() => {
    const loadAvocat = async () => {
      try {
        const avocatData = await getAvocatById(id);
        setAvocat(avocatData);
      } catch (error) {
        console.error("Erreur chargement avocat:", error);
        setAvocat(null);
      } finally {
        setLoading(false);
      }
    };

    loadAvocat();
  }, [id]);

  // Tracker les vues de profil
  useEffect(() => {
    if (!avocat?.id) return;

    const trackProfileView = async () => {
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const { ip } = await ipResponse.json();

        const { error } = await supabase.from("profile_views").insert({
          lawyer_id: avocat.id,
          viewer_id: null,
          viewer_ip: ip,
        });

        if (error && !error.message.includes("duplicate")) {
          console.error("Erreur tracking vue profil:", error);
        }
      } catch (error) {
        console.error("Erreur tracking vue profil:", error);
      }
    };

    trackProfileView();
  }, [avocat?.id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!avocat) notFound();

  const handleBackToResults = () => {
    const backUrl = `/search?${searchParams.toString()}`;
    router.push(backUrl);
  };

  const experienceAnnees = avocat.experience?.annees || 0;
  const basePrice = 3000 + experienceAnnees * 200;
  const ratingBonus = avocat.rating ? avocat.rating * 500 : 0;
  const tarifEstime = calculateConsultationPrice(
    avocat.consultation_price,
    avocat.experience?.annees || 0,
    avocat.rating
  );

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      {/* Header */}
      <div>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBackToResults}
              className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour aux résultats</span>
              <span className="sm:hidden">Retour</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 mb-4 flex-shrink-0 mx-auto sm:mx-0">
              {avocat.avatar_url ? (
                <img
                  src={avocat.avatar_url}
                  alt={`${avocat.prenom} ${avocat.nom}`}
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {getInitials(avocat.prenom, avocat.nom)}
                </div>
              )}
            </div>

            {/* Infos principales */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 text-center sm:text-left">
                    {avocat.prenom} {avocat.nom}
                  </h1>

                  {/* Localisation & Barreau */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-slate-600 mb-4 text-center sm:text-left">
                    <div className="flex items-center gap-1 justify-center sm:justify-start">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {avocat.ville}, {avocat.wilaya}
                      </span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <span>Barreau de {avocat.barreau}</span>
                  </div>

                  {/* Rating & Vérification */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-center sm:text-left">
                    {avocat.rating && (
                      <div className="flex items-center justify-center sm:justify-start gap-1 text-yellow-500">
                        <Star className="w-5 h-5 fill-current" />
                        <span>{avocat.rating.toFixed(1)}</span>
                        {avocat.reviews_count && (
                          <span className="text-sm text-slate-500">
                            ({avocat.reviews_count} avis)
                          </span>
                        )}
                      </div>
                    )}

                    {avocat.verified && (
                      <div className="flex items-center justify-center sm:justify-start gap-1 text-teal-600 mt-2 sm:mt-0">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Vérifié</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tarif */}
                <div className="text-center sm:text-right mt-4 sm:mt-0">
                  <div className="text-xl sm:text-2xl font-bold text-teal-600">
                    {formatPrice(tarifEstime)}
                  </div>
                  <div className="text-sm text-slate-500">
                    {avocat.consultation_price
                      ? "Tarif consultation"
                      : "Tarif estimé"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Spécialités */}
            {avocat.specialites && avocat.specialites.length > 0 && (
              <Card className="transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                    <Briefcase className="w-5 h-5" />
                    Domaines d'expertise
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {avocat.specialites.map((spec: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium cursor-default"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Expérience */}
            <Card className="transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                  <Calendar className="w-5 h-5" />
                  Expérience professionnelle
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600 mb-1">
                      {experienceAnnees} ans
                    </div>
                    <div className="text-slate-600">d'expérience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600 mb-1">
                      {avocat.experience?.date_inscription || "N/A"}
                    </div>
                    <div className="text-slate-600">Inscription au barreau</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Langues */}
            {avocat.langues && avocat.langues.length > 0 && (
              <Card className="transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                    <Languages className="w-5 h-5" />
                    Langues parlées
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {avocat.langues.map((langue: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                      >
                        {langue}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Adresse */}
            <Card className="transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                  <MapPin className="w-5 h-5" />
                  Adresse du cabinet
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-700">
                  <div className="font-medium">
                    {avocat.adresse?.rue || "Adresse non spécifiée"}
                  </div>
                  {avocat.adresse?.quartier && (
                    <div className="text-slate-600">
                      {avocat.adresse.quartier}
                    </div>
                  )}
                  <div className="text-slate-600">
                    {avocat.adresse?.code_postal || ""}{" "}
                    {avocat.adresse?.ville || avocat.ville}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact */}
            <Card className="transition-all duration-300">
              <CardHeader>
                <div className="text-lg font-semibold text-slate-800">
                  Contact
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Téléphone fixe */}
                {avocat.contact?.telephone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400">
                        Téléphone fixe
                      </span>
                      {(() => {
                        const phoneValue: string = avocat.contact.telephone;
                        const formattedPhones =
                          formatMultiplePhones(phoneValue);

                        const phoneNumbers: string[] = phoneValue
                          .split(",")
                          .map((num: string) => num.trim())
                          .filter((num: string) => num.length > 0);

                        if (phoneNumbers.length === 1) {
                          return (
                            <a
                              href={`tel:${phoneNumbers[0]}`}
                              className="text-slate-700 hover:text-teal-600 transition-colors"
                            >
                              {formattedPhones}
                            </a>
                          );
                        }

                        const formattedArray = formattedPhones.split(", ");
                        return (
                          <div className="flex flex-wrap items-center gap-1">
                            {phoneNumbers.map(
                              (phone: string, index: number) => (
                                <React.Fragment key={index}>
                                  <a
                                    href={`tel:${phone}`}
                                    className="text-slate-700 hover:text-teal-600 transition-colors"
                                  >
                                    {formattedArray[index] || phone}
                                  </a>
                                  {index < phoneNumbers.length - 1 && (
                                    <span className="text-slate-400">,</span>
                                  )}
                                </React.Fragment>
                              )
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Mobile */}
                {avocat.contact?.mobile &&
                  avocat.contact.mobile !== avocat.contact?.telephone && (
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-slate-500" />
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400">Mobile</span>
                        {(() => {
                          const mobileValue: string = avocat.contact.mobile!;
                          const formattedMobiles =
                            formatMultiplePhones(mobileValue);

                          const mobileNumbers: string[] = mobileValue
                            .split(",")
                            .map((num: string) => num.trim())
                            .filter((num: string) => num.length > 0);

                          if (mobileNumbers.length === 1) {
                            return (
                              <a
                                href={`tel:${mobileNumbers[0]}`}
                                className="text-slate-700 hover:text-teal-600 transition-colors"
                              >
                                {formattedMobiles}
                              </a>
                            );
                          }

                          const formattedArray = formattedMobiles.split(", ");
                          return (
                            <div className="flex flex-wrap items-center gap-1">
                              {mobileNumbers.map(
                                (mobile: string, index: number) => (
                                  <React.Fragment key={index}>
                                    <a
                                      href={`tel:${mobile}`}
                                      className="text-slate-700 hover:text-teal-600 transition-colors"
                                    >
                                      {formattedArray[index] || mobile}
                                    </a>
                                    {index < mobileNumbers.length - 1 && (
                                      <span className="text-slate-400">,</span>
                                    )}
                                  </React.Fragment>
                                )
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                {/* Email */}
                {avocat.contact?.email ? (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-500" />

                    <a
                      href={`mailto:${avocat.contact.email}`}
                      className="text-slate-700 hover:text-teal-600 transition-colors truncate tracking-tighter"
                    >
                      {avocat.contact.email}
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400">Email non disponible</span>
                  </div>
                )}

                {/* Site web */}
                {avocat.contact?.site_web && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-slate-500" />

                    <a
                      href={avocat.contact.site_web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-teal-600 transition-colors"
                    >
                      Site web
                    </a>
                  </div>
                )}

                {/* LinkedIn */}
                {avocat.contact?.linkedin && (
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-4 h-4 text-slate-500" />

                    <a
                      href={avocat.contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-teal-600 transition-colors"
                    >
                      LinkedIn
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bandeau Claim */}
            {!avocat.is_claimed && (
              <Card className="bg-white shadow-sm transition-all duration-300">
                <CardContent className="p-6">
                  <div className="max-w-2xl mx-auto text-center space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-2xl lg:text-xl font-semibold text-slate-700">
                        Vous êtes cet avocat ?
                      </h3>
                    </div>
                    <div className="pt-2">
                      <Link
                        href={`/claim-profile/${avocat.id}`}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-teal-600 hover:from-teal-700 hover:to-teal-800 text-white font-semibold text-base rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100"
                      >
                        Réclamer ce profil
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cartes d'action - UNIQUEMENT si ce n'est PAS son propre profil */}
            {!isOwnProfile && (
              <Card className="transition-all duration-300 shadow-sm hover:shadow-md">
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <button
                      onClick={() => setIsConsultationModalOpen(true)}
                      className="cursor-pointer bg-teal-50 border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6 sm:p-8 rounded-lg flex flex-col items-center gap-3 sm:gap-4 text-center group"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center transition-colors duration-200">
                        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-slate-700 group-hover:text-teal-700 transition-colors duration-200">
                          Consultation
                        </div>
                        <div className="text-xs text-slate-500 group-hover:text-teal-600 transition-colors duration-200">
                          Juridique
                        </div>
                      </div>
                    </button>

                    <button className="cursor-pointer bg-teal-50 border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6 sm:p-8 rounded-lg flex flex-col items-center gap-3 sm:gap-4 text-center group">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center transition-colors duration-200">
                        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-slate-700 group-hover:text-teal-700 transition-colors duration-200">
                          Contact
                        </div>
                        <div className="text-xs text-slate-500 group-hover:text-teal-600 transition-colors duration-200">
                          Immédiat
                        </div>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Section Avis */}
        <div className="mt-8">
          <ReviewSection lawyerId={avocat.id} />
        </div>

        <ConsultationModal
          isOpen={isConsultationModalOpen}
          onClose={() => setIsConsultationModalOpen(false)}
          lawyerId={avocat.id}
          lawyerName={`${avocat.prenom} ${avocat.nom}`}
          onSuccess={handleConsultationSuccess}
        />
      </div>
      {showFeedbackPopup && (
        <FeedbackPopup onClose={() => setShowFeedbackPopup(false)} />
      )}
    </div>
  );
}
