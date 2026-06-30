"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Phone,
  Smartphone,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { MultiSelectWithCheckboxes } from "@/components/ui/MultiSelectCheck";
import { ExtendedLawyerSignupFormData, FormErrors } from "@/types";
import { CIVILITE_OPTIONS, frontendToDb } from "@/lib/genderUtils";
import { SPECIALITES, WILAYAS, COUNTRIES, LANGUES } from "@/utils/constants";
import { COMMUNES_PAR_WILAYA } from "@/utils/communes";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { separatePhoneTypes } from "@/lib/phoneFormatter";
import { useAuth } from "@/hooks/useAuth";
import { gsap } from "gsap";
import { createClient } from "@/lib/supabase/client";

const STEPS = [
  { id: 1, label: "Identité" },
  { id: 2, label: "Cabinet" },
  { id: 3, label: "Expertise" },
  { id: 4, label: "Compte" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((step, idx) => (
        <div key={step.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                step.id < current
                  ? "bg-teal-600 text-white"
                  : step.id === current
                    ? "bg-teal-600 text-white ring-4 ring-teal-100"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {step.id < current ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                step.id
              )}
            </div>
            <span
              className={`text-xs font-medium whitespace-nowrap ${
                step.id === current ? "text-teal-600" : "text-slate-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 mb-4 transition-all duration-300 ${
                step.id < current ? "bg-teal-600" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

const inputBase =
  "w-full h-12 px-4 text-sm border border-slate-300 rounded-lg bg-white focus:border-2 hover:border-2 hover:border-teal-300 focus:border-teal-300 outline-none transition-all duration-200 text-slate-700";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-red-500 text-xs mt-1">{msg}</p>;
}

export default function LawyerRegisterForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<ExtendedLawyerSignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    languages: [],
    phone: "",
    mobile: "",
    barNumber: "",
    specializations: [],
    experience: "",
    consultationPrice: "",
    address: {
      street: "",
      wilaya: "",
      city: "",
      postalCode: "",
    },
  });

  const [communeOptions, setCommuneOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("213");
  const [selectedMobileCountry, setSelectedMobileCountry] = useState("213");

  const wilayaOptions = WILAYAS.map((w) => ({
    value: w.toLowerCase().replace(/\s+/g, "-"),
    label: w,
  }));

  const specialiteOptions = SPECIALITES.map((s) => ({
    value: s.toLowerCase().replace(/\s+/g, "-"),
    label: s,
  }));

  const countryOptions = COUNTRIES.map((c) => ({
    value: c.code,
    label: `${c.flag} +${c.code}`,
  }));

  const langueOptions = LANGUES.map((l) => ({ value: l, label: l }));

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      ".register-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".step-content",
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" }
    );
  }, [currentStep]);

  useEffect(() => {
    if (formData.address.wilaya) {
      const wilayaNormalized = WILAYAS.find(
        (w) => w.toLowerCase().replace(/\s+/g, "-") === formData.address.wilaya
      );
      if (wilayaNormalized && COMMUNES_PAR_WILAYA[wilayaNormalized]) {
        setCommuneOptions(
          COMMUNES_PAR_WILAYA[wilayaNormalized].map((commune) => ({
            value: commune.toLowerCase().replace(/\s+/g, "-"),
            label: commune,
          }))
        );
        setFormData((prev) => ({
          ...prev,
          address: { ...prev.address, city: "" },
        }));
      }
    } else {
      setCommuneOptions([]);
    }
  }, [formData.address.wilaya]);

  const capitalizeWords = (str: string) =>
    str
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

  const set = (field: keyof ExtendedLawyerSignupFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
        general: undefined,
      }));
    }
  };

  const setAddress = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
        general: undefined,
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.gender) newErrors.gender = "La civilité est requise";
      if (!formData.firstName.trim())
        newErrors.firstName = "Le prénom est requis";
      if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis";
      if (!formData.mobile.trim()) newErrors.mobile = "Le mobile est requis";
      else if (formData.mobile.length < 8)
        newErrors.mobile = "Numéro trop court";
      if (formData.phone.trim() && formData.phone.length < 8)
        newErrors.phone = "Numéro trop court";
      if (formData.languages.length === 0)
        newErrors.languages = "Sélectionnez au moins une langue";
    }

    if (step === 2) {
      if (!formData.address.street.trim())
        newErrors.street = "L'adresse est requise";
      if (!formData.address.wilaya) newErrors.wilaya = "La wilaya est requise";
      if (!formData.address.city) newErrors.city = "La commune est requise";
      if (!formData.address.postalCode.trim())
        newErrors.postalCode = "Le code postal est requis";
      else if (!/^\d{5}$/.test(formData.address.postalCode))
        newErrors.postalCode = "5 chiffres requis";
      if (!formData.barNumber.trim())
        newErrors.barNumber = "Le numéro de barreau est requis";
    }

    if (step === 3) {
      if (formData.specializations.length === 0)
        newErrors.specializations = "Sélectionnez au moins une spécialité";
      if (!formData.experience.trim())
        newErrors.experience = "L'expérience est requise";
      else if (parseInt(formData.experience) > 50)
        newErrors.experience = "Maximum 50 ans";
      if (formData.consultationPrice.trim()) {
        const price = parseInt(formData.consultationPrice);
        if (price < 5000) newErrors.consultationPrice = "Minimum : 5 000 DZD";
        else if (price > 100000)
          newErrors.consultationPrice = "Maximum : 100 000 DZD";
      }
    }

    if (step === 4) {
      if (!formData.email.trim()) newErrors.email = "L'email est requis";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Format email invalide";
      if (!formData.password) newErrors.password = "Le mot de passe est requis";
      else if (formData.password.length < 8)
        newErrors.password = "Minimum 8 caractères";
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
        newErrors.password =
          "Doit contenir 1 majuscule, 1 minuscule, 1 chiffre";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setIsSubmitting(true);
    setErrors({});

    try {
      const { data: existingByEmail } = await supabase
        .from("users")
        .select("id, email, professional_email, first_name, last_name")
        .eq("user_type", "lawyer")
        .or(
          `email.eq.${formData.email},professional_email.eq.${formData.email}`
        );

      if (existingByEmail && existingByEmail.length > 0) {
        const profile = existingByEmail[0];
        const { data: lawyerData } = await supabase
          .from("lawyers")
          .select("is_claimed")
          .eq("id", profile.id)
          .single();

        if (lawyerData?.is_claimed) {
          setErrors({
            general: "Ce profil a déjà été réclamé. Veuillez vous connecter.",
          });
          setIsSubmitting(false);
          setTimeout(() => router.push("/auth/lawyer/login"), 2000);
          return;
        }

        setErrors({
          general: `Un profil existe pour ${formData.email}. Redirection...`,
        });
        setIsSubmitting(false);
        setTimeout(() => router.push(`/claim-profile/${profile.id}`), 2000);
        return;
      }

      const phoneFixe = formData.phone.trim()
        ? `+${selectedCountry}${formData.phone.trim()}`
        : "";
      const phoneMobile = formData.mobile.trim()
        ? `+${selectedMobileCountry}${formData.mobile.trim()}`
        : "";

      const { mobile: detectedMobile1, fixe: detectedFixe1 } =
        separatePhoneTypes(phoneFixe);
      const { mobile: detectedMobile2, fixe: detectedFixe2 } =
        separatePhoneTypes(phoneMobile);

      const finalMobile = detectedMobile1 || detectedMobile2 || undefined;
      const finalFixe = detectedFixe1 || detectedFixe2 || undefined;

      const userData = {
        gender: frontendToDb(formData.gender),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: finalFixe,
        mobile: finalMobile,
        userType: "lawyer" as const,
        location: formData.address.city.trim(),
        bar_number: formData.barNumber.trim(),
        specializations: formData.specializations.map((slug) => {
          const found = specialiteOptions.find((opt) => opt.value === slug);
          return found ? found.label : slug;
        }),
        experience_years: parseInt(formData.experience) || 0,
        consultation_price:
          formData.consultationPrice.trim() &&
          parseInt(formData.consultationPrice) > 0
            ? parseInt(formData.consultationPrice)
            : null,
        address: {
          street: formData.address.street.trim(),
          city: formData.address.city.trim(),
          wilaya: formData.address.wilaya?.trim(),
          postalCode: formData.address.postalCode.trim(),
        },
        languages: formData.languages,
      };

      const result = await signUp(formData.email, formData.password, userData);

      try {
        await fetch("/api/admin/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: "🚨 Nouvel avocat inscrit - Action requise",
            title: "Nouvel avocat inscrit sur Mizan",
            message: `
              <p><strong>Nom :</strong> ${formData.firstName} ${formData.lastName}</p>
              <p><strong>Email :</strong> ${formData.email}</p>
              <p><strong>Mobile :</strong> +${selectedMobileCountry}${formData.mobile}</p>
              ${formData.phone ? `<p><strong>Fixe :</strong> +${selectedCountry}${formData.phone}</p>` : ""}
              <p><strong>N° Carte Pro :</strong> ${formData.barNumber}</p>
              <p><strong>Ville :</strong> ${formData.address.city}</p>
              <p><strong>Spécialités :</strong> ${formData.specializations.slice(0, 3).join(", ")}${formData.specializations.length > 3 ? "..." : ""}</p>
              <p><strong>Expérience :</strong> ${formData.experience} ans</p>
              ${formData.consultationPrice ? `<p><strong>Tarif :</strong> ${parseInt(formData.consultationPrice).toLocaleString("fr-DZ")} DZD</p>` : ""}
            `,
            priority: "high",
          }),
        });
      } catch (_) {}

      router.push(result.redirectPath || "/lawyer/dashboard");
    } catch (error: any) {
      let msg = "Une erreur est survenue lors de l'inscription.";
      if (error.message?.includes("already registered"))
        msg = "Cette adresse email est déjà utilisée.";
      else if (error.message?.includes("invalid email"))
        msg = "Format d'email invalide.";
      else if (error.message?.includes("weak password"))
        msg = "Le mot de passe est trop faible.";
      else if (error.message?.includes("Database error"))
        msg = "Erreur technique. Réessayez dans quelques instants.";
      setErrors({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Civilité <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                options={CIVILITE_OPTIONS}
                value={formData.gender}
                onChange={(value) => set("gender", value)}
                placeholder="Sélectionnez votre genre"
                placeholderClassName="text-slate-400 text-sm font-normal"
                className="h-12"
                disabled={isSubmitting}
              />
              <FieldError msg={errors.gender} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    set("firstName", capitalizeWords(e.target.value))
                  }
                  className={inputBase}
                  placeholder="Mohamed Amine"
                  disabled={isSubmitting}
                />
                <FieldError msg={errors.firstName} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    set("lastName", capitalizeWords(e.target.value))
                  }
                  className={inputBase}
                  placeholder="MEBARKI"
                  disabled={isSubmitting}
                />
                <FieldError msg={errors.lastName} />
              </div>
            </div>

            <div className="relative z-20">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                <Smartphone className="w-4 h-4" /> Mobile{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <CustomSelect
                  options={countryOptions}
                  value={selectedMobileCountry}
                  onChange={setSelectedMobileCountry}
                  placeholder="+213"
                  className="w-24 h-12"
                  disabled={isSubmitting}
                />
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value))
                      set("mobile", e.target.value);
                  }}
                  className={`${inputBase} placeholder:text-slate-400`}
                  placeholder="555 123 456"
                  disabled={isSubmitting}
                />
              </div>
              <FieldError msg={errors.mobile} />
            </div>

            <div className="relative z-10">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                <Phone className="w-4 h-4" /> Téléphone fixe
              </label>
              <div className="flex gap-2">
                <CustomSelect
                  options={countryOptions}
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  placeholder="+213"
                  className="w-24 h-12"
                  disabled={isSubmitting}
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value))
                      set("phone", e.target.value);
                  }}
                  className={`${inputBase} placeholder:text-slate-400`}
                  placeholder="21 123 456"
                  disabled={isSubmitting}
                />
              </div>
              <FieldError msg={errors.phone} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Langues parlées <span className="text-red-500">*</span>
              </label>
              <MultiSelectWithCheckboxes
                placeholder="Choisir des langues..."
                options={langueOptions}
                value={formData.languages}
                onChange={(value) => set("languages", value)}
                className="h-12"
                placeholderClassName="text-slate-400 font-medium text-sm"
                disabled={isSubmitting}
              />
              <FieldError msg={errors.languages} />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Adresse du cabinet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) =>
                  setAddress("street", capitalizeWords(e.target.value))
                }
                className={`${inputBase} placeholder:text-slate-400`}
                placeholder="123 Rue de la République"
                disabled={isSubmitting}
              />
              <FieldError msg={errors.street} />
            </div>

            <div className="relative z-40">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Wilaya <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                options={wilayaOptions}
                value={formData.address.wilaya || ""}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, wilaya: value, city: "" },
                  }))
                }
                placeholder="Sélectionnez la wilaya"
                placeholderClassName="text-slate-400 text-sm font-normal"
                className="h-12"
                disabled={isSubmitting}
              />
              <FieldError msg={errors.wilaya} />
            </div>

            <div className="relative z-30">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Commune <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                options={communeOptions}
                value={formData.address.city || ""}
                onChange={(value) => setAddress("city", value)}
                placeholder={
                  formData.address.wilaya
                    ? "Sélectionnez la commune"
                    : "Sélectionnez d'abord une wilaya"
                }
                placeholderClassName="text-slate-400 text-sm font-normal"
                className="h-12"
                disabled={isSubmitting || !formData.address.wilaya}
              />
              <FieldError msg={errors.city} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Code postal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address.postalCode}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^\d*$/.test(v) && v.length <= 5)
                      setAddress("postalCode", v);
                  }}
                  className={`${inputBase} placeholder:text-slate-400`}
                  placeholder="16000"
                  maxLength={5}
                  disabled={isSubmitting}
                />
                <FieldError msg={errors.postalCode} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  N° carte professionnelle{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.barNumber}
                  onChange={(e) => set("barNumber", e.target.value)}
                  className={inputBase}
                  placeholder="ALG2024-001"
                  disabled={isSubmitting}
                />
                <FieldError msg={errors.barNumber} />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-[3fr_1fr] gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Domaine(s) d'Expertise <span className="text-red-500">*</span>
                </label>
                <MultiSelectWithCheckboxes
                  placeholder="Spécialités"
                  options={specialiteOptions}
                  value={formData.specializations}
                  onChange={(value) => set("specializations", value)}
                  className="h-12"
                  placeholderClassName="text-slate-400 font-medium text-sm"
                  disabled={isSubmitting}
                  showSelectAll={true}
                />
                <FieldError msg={errors.specializations} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 tracking-tight">
                  Expérience <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value))
                      set("experience", e.target.value);
                  }}
                  className={`${inputBase} px-3 placeholder:text-slate-400`}
                  placeholder="5"
                  disabled={isSubmitting}
                />
                <FieldError msg={errors.experience} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tarif de consultation (DZD)
              </label>
              <input
                type="text"
                value={formData.consultationPrice}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^\d*$/.test(v) && (v === "" || parseInt(v) <= 100000))
                    set("consultationPrice", v);
                }}
                className={`${inputBase} placeholder:text-slate-400`}
                placeholder="15000"
                disabled={isSubmitting}
              />
              <FieldError msg={errors.consultationPrice} />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => set("email", e.target.value)}
                className={`${inputBase} placeholder:text-slate-400`}
                placeholder="avocat@exemple.com"
                disabled={isSubmitting}
              />
              <FieldError msg={errors.email} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => set("password", e.target.value)}
                  className={`${inputBase} pr-12`}
                  placeholder="Minimum 8 caractères"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <FieldError msg={errors.password} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirmer le mot de passe{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  className={`${inputBase} pr-12`}
                  placeholder="Répétez votre mot de passe"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <FieldError msg={errors.confirmPassword} />
            </div>

            <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 leading-relaxed">
              En créant votre compte, vous acceptez les{" "}
              <Link href="/cgu" className="text-teal-600 hover:underline">
                CGU
              </Link>{" "}
              et la{" "}
              <Link href="/privacy" className="text-teal-600 hover:underline">
                politique de confidentialité
              </Link>{" "}
              de Mizan. Votre profil sera examiné avant publication (24–48h
              ouvrées).
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepMeta: Record<number, { title: string; sub: string }> = {
    1: {
      title: "Informations personnelles",
      sub: "Vos coordonnées en tant qu'avocat",
    },
    2: {
      title: "Informations du cabinet",
      sub: "Localisation et coordonnées de votre cabinet",
    },
    3: { title: "Domaines d'expertise", sub: "Vos spécialités juridiques" },
    4: { title: "Création de compte", sub: "Vos identifiants de connexion" },
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <div className="max-w-md mx-auto px-4 py-16" ref={containerRef}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Inscription Avocat
          </h1>
          <p className="text-slate-600">
            Créez votre compte et rejoignez notre réseau d'avocats
          </p>
        </div>

        <div className="register-card bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <StepIndicator current={currentStep} />

          <div className="mb-6">
            <span className="text-xs font-semibold text-teal-600 uppercase tracking-wide">
              Étape {currentStep} sur {STEPS.length}
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {stepMeta[currentStep].title}
            </h2>
            <p className="text-sm text-slate-500">
              {stepMeta[currentStep].sub}
            </p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {renderStep()}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={handleBack}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer ${
                currentStep === 1 ? "invisible pointer-events-none" : ""
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Retour
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-all cursor-pointer"
              >
                Continuer
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-semibold bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    Créer mon compte
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <span className="text-sm text-slate-600">
            Vous avez déjà un compte ?{" "}
          </span>
          <Link
            href="/auth/lawyer/login"
            className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
