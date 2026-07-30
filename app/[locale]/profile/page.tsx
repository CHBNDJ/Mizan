"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { localizedDigits } from "@/lib/arabicNumerals";
import {
  User,
  Mail,
  Phone,
  Smartphone,
  Scale,
  FileText,
  Briefcase,
  Calculator,
  TrendingUp,
  Edit,
  Save,
  X,
  MapPin,
  Building,
  Camera,
  Globe,
  CheckCircle,
  Languages,
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
import { SPECIALITES, WILAYAS, LOCATION, LANGUES } from "@/utils/constants";
import { COMMUNES_PAR_WILAYA } from "@/utils/communes";
import { DOMAINES_PAR_PROFESSION } from "@/lib/avocatsData";
import { getInitials } from "@/lib/utils";
import { getSpecialiteLabel, getWilayaLabel } from "@/lib/i18nLabels";
import ImageCropModal from "@/components/ImageCropModal";
import { gsap } from "gsap";

const PROF_KEY: Record<string, string> = {
  avocat: "avocat",
  notaire: "notaire",
  huissier: "huissier",
  comptable: "comptable",
  "expert-comptable": "expertComptable",
  traducteur: "traducteur",
};
const PROF_ICONS: Record<string, any> = {
  avocat: Scale,
  notaire: FileText,
  huissier: Briefcase,
  comptable: Calculator,
  "expert-comptable": TrendingUp,
  traducteur: Languages,
};

const cap = (str: string) =>
  str
    ? str
        .split(/[\s-]+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")
    : str;

function ProfilePageContent() {
  const supabase = createClient();
  const { user, profile, lawyerProfile, loading, refreshProfile } = useAuth();
  const t = useTranslations();
  const locale = useLocale();
  const ld = (s: string) => localizedDigits(s, locale);
  const civiliteOptions = [
    { value: "homme", label: t("genres.homme") },
    { value: "femme", label: t("genres.femme") },
  ];
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeProfession, setActiveProfession] = useState<string>("");

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("activeProfession");
      const defaultProf =
        (lawyerProfile as any)?.profession ||
        (profile as any)?.profession ||
        "avocat";
      setActiveProfession(stored || defaultProf);
    }
  }, [lawyerProfile, profile]);

  const profession =
    activeProfession || (profile as any)?.profession || "avocat";
  const profKey = PROF_KEY[profession] || "avocat";
  const ProfIcon = PROF_ICONS[profession] || Scale;
  const profLabel = t(`professions.${profKey}.label`);
  const profNumLabel = t(`myProfile.numLabels.${profKey}`);
  const profNumPlaceholder = t(`myProfile.numPlaceholders.${profKey}`);
  const isCourtSupreme = !!(lawyerProfile as any)?.is_cour_supreme;

  const domaineOptions = (
    DOMAINES_PAR_PROFESSION[profession] || SPECIALITES
  ).map((s) => ({
    value: s.toLowerCase().replace(/\s+/g, "-"),
    label: getSpecialiteLabel(s, t),
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
    label: getWilayaLabel(w, t),
  }));
  const langueOptions = LANGUES.map((l) => ({
    value: l,
    label: t(`langues.${l}`),
  }));

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
    }
  }, [user, profile, lawyerProfile, loading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024)
      return;
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
      setSaveError(t("myProfile.timeoutError"));
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
      setSaveError(
        t("myProfile.saveError", {
          msg: String(error?.message || error || "?"),
        })
      );
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

  const getFullAddress = () => {
    const wilayaDisplay = addressData.wilaya
      ? getWilayaLabel(cap(addressData.wilaya), t)
      : "";
    const cityDisplay = addressData.city ? cap(addressData.city) : "";
    return (
      [addressData.street, addressData.postalCode, cityDisplay, wilayaDisplay]
        .filter(Boolean)
        .join(", ") || t("myProfile.notProvidedF")
    );
  };

  const inputCls =
    "w-full px-3 sm:px-4 py-3 text-sm sm:text-base text-slate-900 dark:text-[#F5F5F4] bg-white dark:bg-[#1c1c1e] border-2 border-slate-300 rounded-lg hover:border-teal-300 dark:hover:border-[#6fcf9f] focus:border-teal-300 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all duration-200 placeholder:text-slate-400 dark:text-[#7A7A78]";

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none">
      <style>{`.page-header,.page-subtitle,.action-buttons,.profile-card,.info-card{opacity:0;}`}</style>
      <div className="max-w-4xl mx-auto px-4 py-8" ref={containerRef}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="page-header text-2xl sm:text-3xl font-bold text-slate-800 dark:text-[#F5F5F4]">
              {t("myProfile.title")}
            </h1>
            <p className="page-subtitle text-slate-600 dark:text-[#E8E8E6] mt-1 sm:mt-2 text-sm sm:text-base">
              {t("myProfile.subtitle")}
            </p>
          </div>
          <div className="action-buttons flex gap-2 flex-shrink-0">
            <button
              onClick={() => refreshProfile()}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-slate-300 dark:border-[#3a3a3d] text-slate-600 dark:text-[#E8E8E6] rounded-lg hover:bg-slate-50 dark:hover:bg-[#1c2220] cursor-pointer text-sm sm:text-base"
            >
              {t("myProfile.refresh")}
            </button>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-teal-600 dark:bg-[#0F6E56] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-teal-700 dark:hover:bg-[#085041] cursor-pointer text-sm sm:text-base"
              >
                <Edit className="w-4 h-4" /> {t("myProfile.edit")}
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
          <div className="lg:col-span-1">
            <div className="profile-card bg-white dark:bg-[#1c1c1e] rounded-lg p-6 shadow-sm dark:shadow-none border border-slate-200 dark:border-[#1c2220]">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-2 group">
                  {avatarUrl ? (
                    <>
                      <Image
                        src={avatarUrl}
                        alt="Photo"
                        fill
                        onClick={() => {
                          setSelectedImage(avatarUrl);
                          setShowCropModal(true);
                        }}
                        className="rounded-full object-cover border-4 border-teal-100 dark:border-[#6fcf9f]/20 shadow-lg dark:shadow-none cursor-pointer hover:opacity-90 hover:scale-105 transition-all"
                        sizes="96px"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 w-9 h-9 bg-teal-600 dark:bg-[#0F6E56] rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-700 dark:hover:bg-[#085041] shadow-lg dark:shadow-none border-2 border-white z-10"
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
                        className="absolute top-0 left-0 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 shadow-md dark:shadow-none z-10 cursor-pointer"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-600 dark:from-[#0F6E56] dark:to-[#085041] rounded-full flex items-center justify-center">
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
                          {t("myProfile.addPhoto")}
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
                <h2 className="text-xl font-semibold text-slate-800 dark:text-[#F5F5F4] mt-4">
                  {formData.firstName ||
                    profile?.first_name ||
                    t("myProfile.firstNameFallback")}{" "}
                  {formData.lastName ||
                    profile?.last_name ||
                    t("myProfile.lastNameFallback")}
                </h2>
                <p className="text-slate-600 dark:text-[#E8E8E6] flex items-center justify-center gap-1.5 mt-1">
                  <ProfIcon className="w-4 h-4 text-teal-600 dark:text-[#6fcf9f]" />
                  {profile?.user_type === "lawyer"
                    ? profLabel
                    : t("myProfile.clientFallback")}
                </p>
                {isCourtSupreme && (
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-amber-700 font-medium bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" />{" "}
                    {t("myProfile.courSupremeBadge")}
                  </div>
                )}
                {profile?.user_type === "client" && (
                  <div className="mt-4 text-sm text-slate-600 dark:text-[#E8E8E6]">
                    <p className="flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {formData.location || profile?.location
                        ? t(
                            `location.${formData.location || profile?.location}`
                          )
                        : t("myProfile.notProvided")}
                    </p>
                  </div>
                )}
                {profile?.user_type === "lawyer" && (
                  <div className="mt-4 text-sm text-slate-600 dark:text-[#E8E8E6]">
                    <p>
                      {t("myProfile.yearsExperience", {
                        years:
                          lawyerFormData.experienceYears ||
                          lawyerProfile?.experience_years ||
                          0,
                      })}
                    </p>
                    <p className="mt-1">
                      {profNumLabel} :{" "}
                      {lawyerFormData.barNumber ||
                        lawyerProfile?.bar_number ||
                        t("myProfile.notProvided")}
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

          <div className="lg:col-span-2">
            <div className="info-card bg-white dark:bg-[#1c1c1e] rounded-lg p-6 shadow-sm dark:shadow-none border border-slate-200 dark:border-[#1c2220]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-[#F5F5F4]">
                  {t("myProfile.personalInfoTitle")}
                </h3>
                {isEditing && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="cursor-pointer flex-1 sm:flex-none flex items-center justify-center gap-2 bg-teal-600 dark:bg-[#0F6E56] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-teal-700 dark:hover:bg-[#085041] disabled:opacity-50 text-sm sm:text-base"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? t("myProfile.saving") : t("myProfile.save")}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="cursor-pointer flex-1 sm:flex-none flex items-center justify-center gap-2 border border-slate-300 dark:border-[#3a3a3d] text-slate-600 dark:text-[#E8E8E6] px-3 sm:px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-[#1c2220] disabled:opacity-50 text-sm sm:text-base"
                    >
                      <X className="w-4 h-4" /> {t("myProfile.cancel")}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {profile?.user_type === "lawyer" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                      {t("myProfile.civilite")}
                    </label>
                    {isEditing ? (
                      <div className="relative z-20">
                        <CustomSelect
                          options={civiliteOptions}
                          value={lawyerFormData.gender}
                          onChange={(v) =>
                            setLawyerFormData((p) => ({ ...p, gender: v }))
                          }
                          placeholder={t("myProfile.select")}
                          className="h-12"
                        />
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 dark:bg-[#1c1c1e] rounded-lg">
                        <span className="text-slate-800 dark:text-[#F5F5F4]">
                          {lawyerFormData.gender
                            ? civiliteOptions.find(
                                (g) => g.value === lawyerFormData.gender
                              )?.label
                            : t("myProfile.notProvided")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                    {t("myProfile.firstName")}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          firstName: cap(e.target.value),
                        }))
                      }
                      className={inputCls}
                      placeholder={t("myProfile.firstNamePh")}
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#1c1c1e] rounded-lg">
                      <User className="w-5 h-5 text-slate-400 dark:text-[#7A7A78]" />
                      <span className="text-slate-800 dark:text-[#F5F5F4]">
                        {formData.firstName ||
                          profile?.first_name ||
                          t("myProfile.notProvided")}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                    {t("myProfile.lastName")}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          lastName: cap(e.target.value),
                        }))
                      }
                      className={inputCls}
                      placeholder={t("myProfile.lastNamePh")}
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#1c1c1e] rounded-lg">
                      <User className="w-5 h-5 text-slate-400 dark:text-[#7A7A78]" />
                      <span className="text-slate-800 dark:text-[#F5F5F4]">
                        {formData.lastName ||
                          profile?.last_name ||
                          t("myProfile.notProvided")}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                    {t("myProfile.email")}
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#1c1c1e] rounded-lg">
                    <Mail className="w-5 h-5 text-slate-400 dark:text-[#7A7A78]" />
                    <span className="text-slate-800 dark:text-[#F5F5F4] text-sm tracking-tight">
                      {user?.email}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                    {t("myProfile.fixedPhone")}
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, phone: e.target.value }))
                      }
                      className={inputCls}
                      placeholder={t("myProfile.fixedPhonePh")}
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#1c1c1e] rounded-lg">
                      <Phone className="w-5 h-5 text-slate-400 dark:text-[#7A7A78]" />
                      <span className="text-slate-800 dark:text-[#F5F5F4]">
                        {formData.phone ||
                          profile?.phone ||
                          t("myProfile.notProvided")}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                    {t("myProfile.mobile")}
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, mobile: e.target.value }))
                      }
                      className={inputCls}
                      placeholder={t("myProfile.mobilePh")}
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#1c1c1e] rounded-lg">
                      <Smartphone className="w-5 h-5 text-slate-400 dark:text-[#7A7A78]" />
                      <span className="text-slate-800 dark:text-[#F5F5F4]">
                        {formData.mobile ||
                          profile?.mobile ||
                          t("myProfile.notProvided")}
                      </span>
                    </div>
                  )}
                </div>
                {profile?.user_type === "lawyer" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                      {t("myProfile.website")}
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            website: e.target.value,
                          }))
                        }
                        className={inputCls}
                        placeholder={t("myProfile.websitePh")}
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#1c1c1e] rounded-lg">
                        <Globe className="w-5 h-5 text-slate-400 dark:text-[#7A7A78]" />
                        <span className="text-slate-800 dark:text-[#F5F5F4]">
                          {formData.website ||
                            profile?.website ||
                            t("myProfile.notProvided")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {profile?.user_type === "client" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                      {t("myProfile.location")}
                    </label>
                    {isEditing ? (
                      <CustomSelect
                        options={LOCATION.map((l) => ({
                          value: l.value,
                          label: t(`location.${l.value}`),
                        }))}
                        value={formData.location}
                        onChange={(v) =>
                          setFormData((p) => ({ ...p, location: v }))
                        }
                        placeholder={t("myProfile.select")}
                        className="h-12"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#1c1c1e] rounded-lg">
                        <MapPin className="w-5 h-5 text-slate-400 dark:text-[#7A7A78]" />
                        <span className="text-slate-800 dark:text-[#F5F5F4]">
                          {formData.location || profile?.location
                            ? t(
                                `location.${formData.location || profile?.location}`
                              )
                            : t("myProfile.notProvided")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {profile?.user_type === "lawyer" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                      {t("myProfile.officeAddress")}
                    </label>
                    {isEditing ? (
                      <div className="space-y-3 p-4 border border-slate-200 dark:border-[#1c2220] rounded-lg">
                        <input
                          type="text"
                          value={addressData.street}
                          onChange={(e) =>
                            setAddressData((p) => ({
                              ...p,
                              street: cap(e.target.value),
                            }))
                          }
                          className={inputCls}
                          placeholder={t("myProfile.street")}
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
                          placeholder={t("myProfile.wilaya")}
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
                              ? t("myProfile.commune")
                              : t("myProfile.chooseWilayaFirst")
                          }
                          className="h-12"
                          disabled={!addressData.wilaya}
                        />
                        <input
                          type="text"
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
                          placeholder={t("myProfile.postalCode")}
                          maxLength={5}
                        />
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-[#1c1c1e] rounded-lg">
                        <Building className="w-5 h-5 text-slate-400 dark:text-[#7A7A78] mt-0.5" />
                        <span className="text-slate-800 dark:text-[#F5F5F4]">
                          {getFullAddress()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {profile?.user_type === "lawyer" && (
                  <div className="border-t border-slate-200 dark:border-[#1c2220] pt-6">
                    <h4 className="text-lg font-medium text-slate-800 dark:text-[#F5F5F4] mb-4 flex items-center gap-2">
                      <ProfIcon className="w-5 h-5 text-teal-600 dark:text-[#6fcf9f]" />{" "}
                      {t("myProfile.professionalInfoTitle")}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                          {profNumLabel}
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
                            placeholder={profNumPlaceholder}
                          />
                        ) : (
                          <div className="p-3 bg-slate-50 dark:bg-[#1c1c1e] rounded-lg">
                            <span className="text-slate-800 dark:text-[#F5F5F4]">
                              {lawyerFormData.barNumber ||
                                lawyerProfile?.bar_number ||
                                t("myProfile.notProvided")}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                          {t("myProfile.experienceYears")}
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
                          <div className="p-3 bg-slate-50 dark:bg-[#1c1c1e] rounded-lg">
                            <span className="text-slate-800 dark:text-[#F5F5F4]">
                              {ld(String(lawyerFormData.experienceYears || 0))}{" "}
                              {t("myProfile.yearsShort")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                        {t("myProfile.consultationPrice")}
                      </label>
                      <div className="p-3 bg-slate-50 dark:bg-[#1c1c1e] rounded-lg">
                        <span className="text-slate-500 dark:text-[#A8A8A6] text-sm italic">
                          {t("myProfile.priceOnRequest")}
                        </span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                        {profession === "avocat"
                          ? t("myProfile.specialitiesAvocat")
                          : t("myProfile.specialitiesOther")}
                      </label>
                      {isEditing ? (
                        <MultiSelectWithCheckboxes
                          placeholder={t("myProfile.selectPlaceholder")}
                          options={domaineOptions}
                          value={lawyerFormData.specializations}
                          onChange={(v) =>
                            setLawyerFormData((p) => ({
                              ...p,
                              specializations: v,
                            }))
                          }
                          className="h-12"
                          placeholderClassName="text-slate-400 dark:text-[#7A7A78] font-medium text-sm"
                        />
                      ) : (
                        <div className="p-3 bg-slate-50 dark:bg-[#1c1c1e] rounded-lg">
                          {lawyerFormData.specializations?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {lawyerFormData.specializations.map(
                                (s: string, i: number) => (
                                  <span
                                    key={i}
                                    className="bg-teal-100 dark:bg-[#6fcf9f]/10 text-teal-800 dark:text-[#6fcf9f] px-3 py-1 rounded-full text-sm"
                                  >
                                    {getSpecialiteLabel(s, t)}
                                  </span>
                                )
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-600 dark:text-[#E8E8E6]">
                              {t("myProfile.noSpecialities")}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                        {t("myProfile.languagesSpoken")}
                      </label>
                      {isEditing ? (
                        <div className="relative z-10">
                          <MultiSelectWithCheckboxes
                            placeholder={t("myProfile.selectPlaceholder")}
                            options={langueOptions}
                            value={lawyerFormData.languages}
                            onChange={(v) =>
                              setLawyerFormData((p) => ({ ...p, languages: v }))
                            }
                            className="h-12"
                            placeholderClassName="text-slate-400 dark:text-[#7A7A78] font-medium text-sm"
                          />
                        </div>
                      ) : (
                        <div className="p-3 bg-slate-50 dark:bg-[#1c1c1e] rounded-lg">
                          {lawyerFormData.languages?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {lawyerFormData.languages.map(
                                (l: string, i: number) => (
                                  <span
                                    key={i}
                                    className="bg-purple-100 dark:bg-[#3D1F4A] text-purple-800 dark:text-[#C9A8E0] px-3 py-1 rounded-full text-sm"
                                  >
                                    {t(`langues.${l}`)}
                                  </span>
                                )
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-600 dark:text-[#E8E8E6]">
                              {t("myProfile.noLanguages")}
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

import { Suspense } from "react";

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 dark:border-[#6fcf9f] border-t-transparent" />
        </div>
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
}
