"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Eye, EyeOff, Phone, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { COUNTRIES, LOCATION } from "@/utils/constants";
import { FormErrors } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { gsap } from "gsap";

export default function ClientRegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    mobile: "",
    location: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("213");
  const [selectedMobileCountry, setSelectedMobileCountry] = useState("213");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!containerRef.current) return;

    const timeline = gsap.timeline();

    timeline
      .fromTo(
        ".page-title",
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
        ".register-form",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );
  }, []);

  const countryOptions = COUNTRIES.map((country) => ({
    value: country.code,
    label: `${country.flag} +${country.code}`,
  }));

  const inputBaseClass =
    "w-full h-12 px-4 text-sm border border-slate-300 rounded-lg bg-white focus:border-2 hover:border-2 hover:border-teal-300 focus:border-teal-300 outline-none transition-all duration-200 text-slate-700";
  const errorClass = "text-red-500 text-xs mt-1";

  // Capitaliser les noms
  const capitalizeWords = (str: string) => {
    if (!str) return str;
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleCapitalizedInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const capitalizedValue = capitalizeWords(value);
    setFormData({
      ...formData,
      [name]: capitalizedValue,
    });

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password = "Minimum 8 caractères requis";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Doit contenir au moins: 1 majuscule, 1 minuscule, 1 chiffre";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    } else if (formData.phone.length < 8) {
      newErrors.phone = "Numéro de téléphone trop court";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Le mobile est requis";
    } else if (formData.mobile.length < 8) {
      newErrors.mobile = "Numéro de mobile trop court";
    }

    if (!formData.location) {
      newErrors.location = "Sélectionnez votre lieu de résidence";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: `+${selectedCountry}${formData.phone}`,
        mobile: `+${selectedMobileCountry}${formData.mobile}`,
        userType: "client" as const,
        location: formData.location,
      };

      const result = await signUp(formData.email, formData.password, userData);
      const redirectPath = result.redirectPath || "/";
      router.push(redirectPath);
    } catch (error: any) {
      console.error("Erreur inscription client:", error);

      let errorMessage = "Une erreur est survenue lors de l'inscription.";

      if (error.message?.includes("already registered")) {
        errorMessage = "Cette adresse email est déjà utilisée.";
      } else if (error.message?.includes("invalid email")) {
        errorMessage = "Format d'email invalide.";
      } else if (error.message?.includes("weak password")) {
        errorMessage = "Le mot de passe est trop faible.";
      }

      setErrors({
        general: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <style>{`
        .page-title,
        .page-subtitle,
        .register-form { 
          opacity: 0;
        }
      `}</style>

      <div className="max-w-md mx-auto px-4 py-24" ref={containerRef}>
        <div className="text-center mb-8">
          <h1 className="page-title text-2xl font-bold text-slate-800 mb-2">
            Inscription Client
          </h1>
          <p className="page-subtitle text-slate-600">
            Créez votre compte et trouvez l'avocat idéal
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="register-form space-y-4"
            noValidate
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleCapitalizedInput}
                  className={inputBaseClass}
                  placeholder="Votre prénom"
                  required
                  disabled={isSubmitting}
                />
                {errors.firstName && (
                  <p className={errorClass}>{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleCapitalizedInput}
                  className={inputBaseClass}
                  placeholder="Votre nom"
                  required
                  disabled={isSubmitting}
                />
                {errors.lastName && (
                  <p className={errorClass}>{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Adresse email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${inputBaseClass} placeholder:text-slate-400`}
                placeholder="votre@email.com"
                required
                disabled={isSubmitting}
              />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mot de passe *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`${inputBaseClass} pr-12`}
                  placeholder="Minimum 8 caractères"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className={errorClass}>{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirmer le mot de passe *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`${inputBaseClass} pr-12`}
                  placeholder="Répétez votre mot de passe"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className={errorClass}>{errors.confirmPassword}</p>
              )}
            </div>

            {/* Téléphone fixe */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                <Phone className="w-4 h-4" />
                Téléphone fixe
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
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  className={`${inputBaseClass} placeholder:text-slate-400`}
                  placeholder="21 123 456"
                  disabled={isSubmitting}
                />
              </div>
              {errors.phone && <p className={errorClass}>{errors.phone}</p>}
            </div>

            {/* Mobile */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                <Smartphone className="w-5 h-5" />
                Mobile *
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
                  name="mobile"
                  value={formData.mobile}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  className={`${inputBaseClass} placeholder:text-slate-400`}
                  placeholder="555 123 456"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {errors.mobile && <p className={errorClass}>{errors.mobile}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Lieu de résidence *
              </label>
              <CustomSelect
                options={LOCATION}
                value={formData.location}
                onChange={(value) =>
                  setFormData({ ...formData, location: value })
                }
                placeholder="Sélectionnez votre lieu de résidence"
                className="h-12"
                disabled={isSubmitting}
              />
              {errors.location && (
                <p className={errorClass}>{errors.location}</p>
              )}
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                className="cursor-pointer w-6 h-6 border-slate-300 rounded focus:ring-teal-500 accent-teal-600 disabled:opacity-50 mt-1"
                style={{ accentColor: "#0d9488" }}
                required
                disabled={isSubmitting}
              />
              <label
                htmlFor="terms"
                className="text-sm text-slate-600 cursor-pointer"
              >
                J'accepte les{" "}
                <Link
                  href="/terms"
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  conditions d'utilisation
                </Link>{" "}
                et la{" "}
                <Link
                  href="/privacy"
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  politique de confidentialité
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full h-12 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 outline-none transition-all duration-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Création en cours...
                </>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-slate-100">
            <div className="flex flex-col gap-2 sm:block">
              <span className="text-sm text-slate-600">
                Vous avez déjà un compte ?
              </span>
              <Link
                href="/auth/client/login"
                className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors sm:ml-1"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
