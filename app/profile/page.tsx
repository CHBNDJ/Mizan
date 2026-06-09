"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  Smartphone,
  Scale,
  FileText,
  Briefcase,
  Calculator,
  Edit,
  Save,
  X,
  MapPin,
  Building,
  Camera,
  Globe,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { MultiSelectWithCheckboxes } from "@/components/ui/MultiSelectCheck";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  CIVILITE_OPTIONS,
  dbToFrontend,
  frontendToDb,
} from "@/lib/genderUtils";
import {
  SPECIALITES,
  WILAYAS,
  LOCATION,
  LANGUES,
  GENRES,
} from "@/utils/constants";
import { COMMUNES_PAR_WILAYA } from "@/utils/communes";
import { DOMAINES_PAR_PROFESSION } from "@/lib/avocatsData";
import { getInitials, formatPrice } from "@/lib/utils";
import ImageCropModal from "@/components/ImageCropModal";
import { gsap } from "gsap";

const PROF_LABELS: Record<
  string,
  { label: string; numLabel: string; numPlaceholder: string; Icon: any }
> = {
  avocat: {
    label: "Avocat",
    numLabel: "Numéro de barreau",
    numPlaceholder: "ex: ALG2024-001",
    Icon: Scale,
  },
  notaire: {
    label: "Notaire",
    numLabel: "N° chambre des notaires",
    numPlaceholder: "ex: NOT-2024-001",
    Icon: FileText,
  },
  huissier: {
    label: "Huissier",
    numLabel: "N° huissier de justice",
    numPlaceholder: "ex: HUI-2024-001",
    Icon: Briefcase,
  },
  comptable: {
    label: "Comptable",
    numLabel: "N° ONEC / ONCA",
    numPlaceholder: "ex: ONEC-2024-001",
    Icon: Calculator,
  },
};
const getProfLabel = (profession?: string) =>
  PROF_LABELS[profession || "avocat"] || PROF_LABELS.avocat;

export default function ProfilePage() {
  const supabase = createClient();
  const { user, profile, lawyerProfile, loading, refreshProfile } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>("");

  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    mobile: "",
    location: "",
    website: "",
  });
  const [addressData, setAddressData] = useState({
    street: "",
    city: "",
    wilaya: "",
    postalCode: "",
  });
  const [communeOptions, setCommuneOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [lawyerFormData, setLawyerFormData] = useState({
    barNumber: "",
    experienceYears: 0,
    specializations: [] as string[],
    consultationPrice: null as number | null,
    gender: "",
    languages: [] as string[],
  });

  const profession = (profile as any)?.profession || "avocat";
  const profInfo = getProfLabel(profession);

  const domaineOptions = (
    DOMAINES_PAR_PROFESSION[profession] || SPECIALITES
  ).map((s) => ({
    value: s.toLowerCase().replace(/\s+/g, "-"),
    label: s,
  }));

  useEffect(() => {
    if (!addressData.wilaya) {
      setCommuneOptions([]);
      return;
    }
    const wilayaNorm = WILAYAS.find(
      (w) => w.toLowerCase().replace(/\s+/g, "-") === addressData.wilaya
    );
    if (wilayaNorm && COMMUNES_PAR_WILAYA[wilayaNorm]) {
      setCommuneOptions(
        COMMUNES_PAR_WILAYA[wilayaNorm].map((c) => ({
          value: c.toLowerCase().replace(/\s+/g, "-"),
          label: c,
        }))
      );
    }
  }, [addressData.wilaya]);

  useEffect(() => {
    if (!containerRef.current || loading) return;
    gsap
      .timeline()
      .fromTo(
        ".page-header",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
      )
      .fromTo(
        ".page-subtitle",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".action-buttons",
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".profile-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".info-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );
  }, [loading]);

  const wilayaOptions = WILAYAS.map((w) => ({
    value: w.toLowerCase().replace(/\s+/g, "-"),
    label: w,
  }));
  const langueOptions = LANGUES.map((l) => ({ value: l, label: l }));

  const cap = (str: string) =>
    str
      ? str
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ")
      : str;

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: cap(profile.first_name || ""),
        lastName: cap(profile.last_name || ""),
        phone: profile.phone || "",
        mobile: profile.mobile || "",
        location: profile.location || "",
        website: profile.website || "",
      });
      setAvatarUrl(profile.avatar_url || "");
      if (profile.user_type === "lawyer" && profile.address) {
        setAddressData({
          street: profile.address.street || "",
          city: profile.address.city || "",
          wilaya: profile.address.wilaya || "",
          postalCode: profile.address.postalCode || "",
        });
      }
    } else if (user?.user_metadata) {
      setFormData({
        firstName: cap(user.user_metadata.first_name || ""),
        lastName: cap(user.user_metadata.last_name || ""),
        phone: user.user_metadata.phone || "",
        mobile: user.user_metadata.mobile || "",
        location: user.user_metadata.location || "",
        website: user.user_metadata.website || "",
      });
      if (user.user_metadata.address)
        setAddressData({
          street: user.user_metadata.address.street || "",
          city: user.user_metadata.address.city || "",
          wilaya: user.user_metadata.address.wilaya || "",
          postalCode: user.user_metadata.address.postalCode || "",
        });
    }
    if (lawyerProfile) {
      setLawyerFormData({
        barNumber: lawyerProfile.bar_number || "",
        experienceYears: lawyerProfile.experience_years || 0,
        specializations: lawyerProfile.specializations || [],
        consultationPrice: lawyerProfile.consultation_price ?? null,
        gender: dbToFrontend(profile?.gender) || "",
        languages: profile?.languages || [],
      });
    } else if (user?.user_metadata && profile?.user_type === "lawyer") {
      setLawyerFormData({
        barNumber: user.user_metadata.bar_number || "",
        experienceYears: user.user_metadata.experience_years || 0,
        specializations: user.user_metadata.specializations || [],
        consultationPrice: user.user_metadata.consultation_price ?? null,
        gender:
          dbToFrontend(user.user_metadata.gender || profile?.gender) || "",
        languages: user.user_metadata.languages || profile?.languages || [],
      });
    }
  }, [user, profile, lawyerProfile, loading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!user?.id) return;
    setShowCropModal(false);
    setIsUploadingAvatar(true);
    try {
      const fileName = `${user.id}/${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, croppedBlob, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      await supabase
        .from("users")
        .update({ avatar_url: data.publicUrl })
        .eq("id", user.id);
      setAvatarUrl(data.publicUrl);
      await refreshProfile();
    } catch {
    } finally {
      setIsUploadingAvatar(false);
      setSelectedImage(null);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user?.id || !avatarUrl) return;
    setIsUploadingAvatar(true);
    try {
      await supabase
        .from("users")
        .update({ avatar_url: null })
        .eq("id", user.id);
      if (avatarUrl.includes("avatars/"))
        await supabase.storage
          .from("avatars")
          .remove([avatarUrl.split("avatars/")[1]]);
      setAvatarUrl("");
      await refreshProfile();
    } catch {
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    setSaveError("");
    const timeoutId = setTimeout(() => {
      setIsSaving(false);
      setSaveError("Timeout — Vérifiez votre connexion");
    }, 8000);
    try {
      const userData: any = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phone.trim(),
        mobile: formData.mobile.trim(),
        website: formData.website.trim(),
      };
      if (profile?.user_type === "client")
        userData.location = formData.location.trim();
      if (profile?.user_type === "lawyer") {
        userData.address = {
          street: addressData.street.trim(),
          city: addressData.city.trim(),
          wilaya: addressData.wilaya?.trim(),
          postalCode: addressData.postalCode.trim(),
        };
        userData.gender = frontendToDb(lawyerFormData.gender);
        userData.languages = lawyerFormData.languages;
      }
      const { error: userError } = await supabase
        .from("users")
        .update(userData)
        .eq("id", user.id);
      if (userError) throw userError;
      if (profile?.user_type === "lawyer") {
        const { error: lawyerError } = await supabase
          .from("lawyers")
          .update({
            bar_number: lawyerFormData.barNumber.trim(),
            experience_years:
              parseInt(lawyerFormData.experienceYears.toString()) || 0,
            specializations: lawyerFormData.specializations.map((slug) => {
              const f = domaineOptions.find((o) => o.value === slug);
              return f ? f.label : slug;
            }),
            consultation_price:
              lawyerFormData.consultationPrice &&
              lawyerFormData.consultationPrice > 0
                ? lawyerFormData.consultationPrice
                : null,
          })
          .eq("id", user.id);
        if (lawyerError) throw lawyerError;
      }
      clearTimeout(timeoutId);
      setIsEditing(false);
    } catch (error: any) {
      clearTimeout(timeoutId);
      setSaveError(`Erreur: ${String(error?.message || error || "Inconnue")}`);
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setSaveError("");
    if (profile) {
      setFormData({
        firstName: cap(profile.first_name || ""),
        lastName: cap(profile.last_name || ""),
        phone: profile.phone || "",
        mobile: profile.mobile || "",
        location: profile.location || "",
        website: profile.website || "",
      });
      if (profile.user_type === "lawyer" && profile.address)
        setAddressData({
          street: profile.address.street || "",
          city: profile.address.city || "",
          wilaya: profile.address.wilaya || "",
          postalCode: profile.address.postalCode || "",
        });
    }
    if (lawyerProfile)
      setLawyerFormData({
        barNumber: lawyerProfile.bar_number || "",
        experienceYears: lawyerProfile.experience_years || 0,
        specializations: lawyerProfile.specializations || [],
        consultationPrice: lawyerProfile.consultation_price ?? null,
        gender: profile?.gender || "",
        languages: profile?.languages || [],
      });
    setIsEditing(false);
  };

  const getFullAddress = () =>
    [
      addressData.street,
      addressData.postalCode,
      addressData.city,
      addressData.wilaya,
    ]
      .filter(Boolean)
      .join(", ") || "Non renseignée";
  const inputCls =
    "w-full px-3 sm:px-4 py-3 text-sm sm:text-base text-slate-900 bg-white border-2 border-slate-300 rounded-lg hover:border-teal-300 focus:border-teal-300 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all duration-200 placeholder:text-slate-400";

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <style>{`.page-header,.page-subtitle,.action-buttons,.profile-card,.info-card{opacity:0;}`}</style>
      <div className="max-w-4xl mx-auto px-4 py-8" ref={containerRef}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="page-header text-2xl sm:text-3xl font-bold text-slate-800">
              Mon profil
            </h1>
            <p className="page-subtitle text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Gérez vos informations personnelles
            </p>
          </div>
          <div className="action-buttons flex gap-2 flex-shrink-0">
            <button
              onClick={() => refreshProfile()}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer text-sm sm:text-base"
            >
              Actualiser
            </button>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-teal-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-teal-700 cursor-pointer text-sm sm:text-base"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
            )}
          </div>
        </div>

        {saveError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{saveError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche — avatar */}
          <div className="lg:col-span-1">
            <div className="profile-card bg-white rounded-lg p-6 shadow-sm border">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-2 group">
                  {avatarUrl ? (
                    <>
                      <img
                        src={avatarUrl}
                        alt="Photo"
                        onClick={() => {
                          setSelectedImage(avatarUrl);
                          setShowCropModal(true);
                        }}
                        className="w-full h-full rounded-full object-cover border-4 border-teal-100 shadow-lg cursor-pointer hover:opacity-90 hover:scale-105 transition-all"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 w-9 h-9 bg-teal-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-700 shadow-lg border-2 border-white z-10"
                      >
                        <Camera className="w-4 h-4 text-white" />
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,image/webp"
                          onChange={handleImageSelect}
                          disabled={isUploadingAvatar}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={handleRemoveAvatar}
                        disabled={isUploadingAvatar}
                        className="absolute top-0 left-0 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 shadow-md z-10 cursor-pointer"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {getInitials(
                            formData.firstName || profile?.first_name,
                            formData.lastName || profile?.last_name
                          )}
                        </span>
                      </div>
                      <label
                        htmlFor="avatar-upload-initial"
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <Camera className="w-8 h-8 text-white mb-1" />
                        <span className="text-xs text-white font-medium">
                          Ajouter
                        </span>
                        <input
                          id="avatar-upload-initial"
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,image/webp"
                          onChange={handleImageSelect}
                          disabled={isUploadingAvatar}
                          className="hidden"
                        />
                      </label>
                    </>
                  )}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full z-20">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-semibold text-slate-800 mt-4">
                  {formData.firstName || profile?.first_name || "Prénom"}{" "}
                  {formData.lastName || profile?.last_name || "Nom"}
                </h2>
                {/* Label profession dynamique */}
                <p className="text-slate-600 flex items-center justify-center gap-1.5 mt-1">
                  <profInfo.Icon className="w-4 h-4 text-teal-600" />
                  {profile?.user_type === "lawyer" ? profInfo.label : "Client"}
                </p>

                {profile?.user_type === "client" && (
                  <div className="mt-4 text-sm text-slate-600">
                    <p className="flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {cap(
                        formData.location ||
                          profile?.location ||
                          "Non renseigné"
                      )}
                    </p>
                  </div>
                )}
                {profile?.user_type === "lawyer" && (
                  <div className="mt-4 text-sm text-slate-600">
                    <p>
                      {lawyerFormData.experienceYears ||
                        lawyerProfile?.experience_years ||
                        0}{" "}
                      ans d'expérience
                    </p>
                    <p className="mt-1">
                      {profInfo.numLabel.split(" ")[0]}:{" "}
                      {lawyerFormData.barNumber ||
                        lawyerProfile?.bar_number ||
                        "Non renseigné"}
                    </p>
                    <div className="mt-2 flex items-start justify-center gap-1">
                      <span className="text-xs text-center leading-tight">
                        {getFullAddress()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Colonne droite — formulaire */}
          <div className="lg:col-span-2">
            <div className="info-card bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h3 className="text-lg font-semibold text-slate-800">
                  Informations personnelles
                </h3>
                {isEditing && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="cursor-pointer flex-1 sm:flex-none flex items-center justify-center gap-2 bg-teal-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50 text-sm sm:text-base"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? "Sauvegarde..." : "Enregistrer"}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="cursor-pointer flex-1 sm:flex-none flex items-center justify-center gap-2 border border-slate-300 text-slate-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-slate-50 disabled:opacity-50 text-sm sm:text-base"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Civilité (avocat/notaire/huissier) */}
                {profile?.user_type === "lawyer" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Civilité
                    </label>
                    {isEditing ? (
                      <div className="relative z-20">
                        <CustomSelect
                          options={CIVILITE_OPTIONS}
                          value={lawyerFormData.gender}
                          onChange={(v) =>
                            setLawyerFormData((p) => ({ ...p, gender: v }))
                          }
                          placeholder="Sélectionnez"
                          className="h-12"
                        />
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="text-slate-800">
                          {lawyerFormData.gender
                            ? CIVILITE_OPTIONS.find(
                                (g) => g.value === lawyerFormData.gender
                              )?.label
                            : "Non renseigné"}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Prénom */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Prénom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          firstName: cap(e.target.value),
                        }))
                      }
                      className={inputCls}
                      placeholder="Votre prénom"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <User className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-800">
                        {formData.firstName ||
                          profile?.first_name ||
                          "Non renseigné"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          lastName: cap(e.target.value),
                        }))
                      }
                      className={inputCls}
                      placeholder="Votre nom"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <User className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-800">
                        {formData.lastName ||
                          profile?.last_name ||
                          "Non renseigné"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Email (readonly) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-800 text-sm tracking-tight">
                      {user?.email}
                    </span>
                  </div>
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Téléphone fixe
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, phone: e.target.value }))
                      }
                      className={inputCls}
                      placeholder="+213 21 123 456"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-800">
                        {formData.phone || profile?.phone || "Non renseigné"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mobile
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, mobile: e.target.value }))
                      }
                      className={inputCls}
                      placeholder="+213 555 123 456"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Smartphone className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-800">
                        {formData.mobile || profile?.mobile || "Non renseigné"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Site web (professionnels) */}
                {profile?.user_type === "lawyer" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Site web (optionnel)
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            website: e.target.value,
                          }))
                        }
                        className={inputCls}
                        placeholder="https://votre-cabinet.com"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Globe className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-800">
                          {formData.website ||
                            profile?.website ||
                            "Non renseigné"}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Localisation (client) */}
                {profile?.user_type === "client" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Lieu de résidence
                    </label>
                    {isEditing ? (
                      <CustomSelect
                        options={LOCATION}
                        value={formData.location}
                        onChange={(v) =>
                          setFormData((p) => ({ ...p, location: v }))
                        }
                        placeholder="Sélectionnez"
                        className="h-12"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-800">
                          {cap(
                            formData.location ||
                              profile?.location ||
                              "Non renseigné"
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Adresse cabinet (professionnel) */}
                {profile?.user_type === "lawyer" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Adresse du cabinet
                    </label>
                    {isEditing ? (
                      <div className="space-y-3 p-4 border border-slate-200 rounded-lg">
                        <input
                          type="text"
                          name="address.street"
                          value={addressData.street}
                          onChange={(e) =>
                            setAddressData((p) => ({
                              ...p,
                              street: cap(e.target.value),
                            }))
                          }
                          className={inputCls}
                          placeholder="Rue"
                        />
                        <CustomSelect
                          options={wilayaOptions}
                          value={addressData.wilaya || ""}
                          onChange={(v) =>
                            setAddressData((p) => ({
                              ...p,
                              wilaya: v,
                              city: "",
                            }))
                          }
                          placeholder="Wilaya"
                          className="h-12"
                        />
                        <CustomSelect
                          options={communeOptions}
                          value={addressData.city || ""}
                          onChange={(v) =>
                            setAddressData((p) => ({ ...p, city: v }))
                          }
                          placeholder={
                            addressData.wilaya
                              ? "Commune"
                              : "Choisir d'abord une wilaya"
                          }
                          className="h-12"
                          disabled={!addressData.wilaya}
                        />
                        <input
                          type="text"
                          name="address.postalCode"
                          value={addressData.postalCode}
                          onChange={(e) => {
                            if (
                              /^\d*$/.test(e.target.value) &&
                              e.target.value.length <= 5
                            )
                              setAddressData((p) => ({
                                ...p,
                                postalCode: e.target.value,
                              }));
                          }}
                          className={inputCls}
                          placeholder="Code postal"
                          maxLength={5}
                        />
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <Building className="w-5 h-5 text-slate-400 mt-0.5" />
                        <span className="text-slate-800">
                          {getFullAddress()}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Informations professionnelles (dynamiques selon profession) ── */}
                {profile?.user_type === "lawyer" && (
                  <div className="border-t border-slate-200 pt-6">
                    <h4 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                      <profInfo.Icon className="w-5 h-5 text-teal-600" />
                      Informations professionnelles
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {/* Numéro selon profession */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          {profInfo.numLabel}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={lawyerFormData.barNumber}
                            onChange={(e) =>
                              setLawyerFormData((p) => ({
                                ...p,
                                barNumber: e.target.value,
                              }))
                            }
                            className={inputCls}
                            placeholder={profInfo.numPlaceholder}
                          />
                        ) : (
                          <div className="p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-800">
                              {lawyerFormData.barNumber ||
                                lawyerProfile?.bar_number ||
                                "Non renseigné"}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Expérience */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Expérience (années)
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={lawyerFormData.experienceYears}
                            onChange={(e) =>
                              setLawyerFormData((p) => ({
                                ...p,
                                experienceYears: parseInt(e.target.value) || 0,
                              }))
                            }
                            className={inputCls}
                          />
                        ) : (
                          <div className="p-3 bg-slate-50 rounded-lg">
                            <span className="text-slate-800">
                              {lawyerFormData.experienceYears || 0} ans
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tarif */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Tarif de consultation
                      </label>
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <span className="text-slate-500 text-sm italic">
                          Tarif sur demande
                        </span>
                      </div>
                    </div>

                    {/* Domaines/Spécialités — label selon profession */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {profession === "avocat"
                          ? "Spécialités"
                          : "Domaines d'intervention"}
                      </label>
                      {isEditing ? (
                        <MultiSelectWithCheckboxes
                          placeholder="Sélectionner..."
                          options={domaineOptions}
                          value={lawyerFormData.specializations}
                          onChange={(v) =>
                            setLawyerFormData((p) => ({
                              ...p,
                              specializations: v,
                            }))
                          }
                          className="h-12"
                          placeholderClassName="text-slate-400 font-medium text-sm"
                        />
                      ) : (
                        <div className="p-3 bg-slate-50 rounded-lg">
                          {lawyerFormData.specializations?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {lawyerFormData.specializations.map(
                                (s: string, i: number) => (
                                  <span
                                    key={i}
                                    className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm"
                                  >
                                    {cap(s)}
                                  </span>
                                )
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-600">
                              Aucun domaine renseigné
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Langues */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Langues parlées
                      </label>
                      {isEditing ? (
                        <div className="relative z-10">
                          <MultiSelectWithCheckboxes
                            placeholder="Sélectionner..."
                            options={langueOptions}
                            value={lawyerFormData.languages}
                            onChange={(v) =>
                              setLawyerFormData((p) => ({ ...p, languages: v }))
                            }
                            className="h-12"
                            placeholderClassName="text-slate-400 font-medium text-sm"
                          />
                        </div>
                      ) : (
                        <div className="p-3 bg-slate-50 rounded-lg">
                          {lawyerFormData.languages?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {lawyerFormData.languages.map(
                                (l: string, i: number) => (
                                  <span
                                    key={i}
                                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                                  >
                                    {l.charAt(0).toUpperCase() + l.slice(1)}
                                  </span>
                                )
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-600">
                              Aucune langue renseignée
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCropModal && selectedImage && (
        <ImageCropModal
          image={selectedImage}
          onComplete={handleCropComplete}
          onCancel={() => {
            setShowCropModal(false);
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
}
