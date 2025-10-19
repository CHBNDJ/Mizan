"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Phone, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { MultiSelectWithCheckboxes } from "@/components/ui/MultiSelectCheck";
import { ExtendedLawyerSignupFormData, FormErrors } from "@/types";
import { SPECIALITES, WILAYAS, COUNTRIES } from "@/utils/constants";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useAuth } from "@/hooks/useAuth";

export default function LawyerRegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState<ExtendedLawyerSignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    mobile: "",
    barNumber: "",
    wilaya: [],
    specializations: [],
    experience: "",
    address: {
      street: "",
      neighborhood: "",
      city: "",
      postalCode: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("213");
  const [selectedMobileCountry, setSelectedMobileCountry] = useState("213");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const wilayaOptions = WILAYAS.map((wilaya) => ({
    value: wilaya.toLowerCase().replace(/\s+/g, "-"),
    label: wilaya,
  }));

  const specialiteOptions = SPECIALITES.map((spec) => ({
    value: spec.toLowerCase().replace(/\s+/g, "-"),
    label: spec,
  }));

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

  // Gérer les champs d'adresse
  const handleAddressInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name.replace("address.", "");

    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [fieldName]:
          fieldName === "street" ||
          fieldName === "neighborhood" ||
          fieldName === "city"
            ? capitalizeWords(value)
            : value,
      },
    });

    if (errors[fieldName as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: undefined,
        general: undefined,
      }));
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

    // Validation téléphone et mobile
    if (!formData.phone.trim() && !formData.mobile.trim()) {
      newErrors.phone = "Au moins un numéro de téléphone est requis";
      newErrors.mobile = "Au moins un numéro de téléphone est requis";
    }

    if (formData.phone.trim() && formData.phone.length < 8) {
      newErrors.phone = "Numéro de téléphone trop court";
    }

    if (formData.mobile.trim() && formData.mobile.length < 8) {
      newErrors.mobile = "Numéro mobile trop court";
    }

    // Validation adresse
    if (!formData.address.street.trim()) {
      newErrors.street = "L'adresse est requise";
    }

    if (!formData.address.city.trim()) {
      newErrors.city = "La ville est requise";
    }

    if (!formData.address.postalCode.trim()) {
      newErrors.postalCode = "Le code postal est requis";
    } else if (!/^\d{5}$/.test(formData.address.postalCode)) {
      newErrors.postalCode = "Code postal invalide (5 chiffres requis)";
    }

    if (!formData.barNumber.trim()) {
      newErrors.barNumber = "Le numéro de barreau est requis";
    }

    if (formData.wilaya.length === 0) {
      newErrors.wilaya = "Sélectionnez au moins une wilaya";
    }

    if (formData.specializations.length === 0) {
      newErrors.specializations = "Sélectionnez au moins une spécialité";
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "L'expérience est requise";
    } else if (parseInt(formData.experience) > 50) {
      newErrors.experience = "Expérience maximum 50 ans";
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
        phone: formData.phone.trim()
          ? `+${selectedCountry}${formData.phone.trim()}`
          : undefined,
        mobile: formData.mobile.trim()
          ? `+${selectedMobileCountry}${formData.mobile.trim()}`
          : undefined,
        userType: "lawyer" as const,
        location: formData.wilaya[0] || undefined,
        bar_number: formData.barNumber.trim(),
        specializations: formData.specializations,
        wilayas: formData.wilaya,
        experience_years: parseInt(formData.experience) || 0,
        address: {
          street: formData.address.street.trim(),
          neighborhood: formData.address.neighborhood?.trim() || null,
          city: formData.address.city.trim(),
          postalCode: formData.address.postalCode.trim(),
        },
      };

      const result = await signUp(formData.email, formData.password, userData);
      const redirectPath = result.redirectPath || "/lawyer/dashboard";
      router.push(redirectPath);
    } catch (error: any) {
      console.error("Erreur inscription avocat:", error);

      let errorMessage = "Une erreur est survenue lors de l'inscription.";

      if (error.message?.includes("already registered")) {
        errorMessage = "Cette adresse email est déjà utilisée.";
      } else if (error.message?.includes("invalid email")) {
        errorMessage = "Format d'email invalide.";
      } else if (error.message?.includes("weak password")) {
        errorMessage = "Le mot de passe est trop faible.";
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <div className="max-w-md mx-auto px-4 py-24">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Inscription Avocat
          </h1>
          <p className="text-slate-600">
            Créez votre compte et rejoignez notre réseau d'avocats
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Prénom et Nom */}
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

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${inputBaseClass} placeholder:text-slate-400`}
                placeholder="avocat@exemple.com"
                required
                disabled={isSubmitting}
              />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>

            {/* Mot de passe */}
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
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

            {/* Confirmation mot de passe */}
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
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

            {/* Adresse du cabinet */}
            <div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Adresse du cabinet *
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleAddressInput}
                  className={`${inputBaseClass} placeholder:text-slate-400`}
                  placeholder="123 Rue de la République"
                  required
                  disabled={isSubmitting}
                />
                {errors.street && <p className={errorClass}>{errors.street}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Quartier
                  </label>
                  <input
                    type="text"
                    name="address.neighborhood"
                    value={formData.address.neighborhood}
                    onChange={handleAddressInput}
                    className={`${inputBaseClass} placeholder:text-slate-400`}
                    placeholder="Centre-ville"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    name="address.postalCode"
                    value={formData.address.postalCode}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) && value.length <= 5) {
                        handleAddressInput(e);
                      }
                    }}
                    className={`${inputBaseClass} placeholder:text-slate-400`}
                    placeholder="16000"
                    maxLength={5}
                    required
                    disabled={isSubmitting}
                  />
                  {errors.postalCode && (
                    <p className={errorClass}>{errors.postalCode}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ville *
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleAddressInput}
                  className={`${inputBaseClass} placeholder:text-slate-400`}
                  placeholder="Alger"
                  required
                  disabled={isSubmitting}
                />
                {errors.city && <p className={errorClass}>{errors.city}</p>}
              </div>
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

            {/* Numéro barreau */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Numéro d'inscription au Barreau *
              </label>
              <input
                type="text"
                name="barNumber"
                value={formData.barNumber}
                onChange={handleInputChange}
                className={inputBaseClass}
                placeholder="ex: ALG2024-001"
                required
                disabled={isSubmitting}
              />
              {errors.barNumber && (
                <p className={errorClass}>{errors.barNumber}</p>
              )}
            </div>

            {/* Wilayas */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Wilaya(s) d'exercice *
              </label>
              <MultiSelectWithCheckboxes
                placeholder="Choisir des wilayas..."
                options={wilayaOptions}
                value={formData.wilaya}
                onChange={(value) =>
                  setFormData({ ...formData, wilaya: value })
                }
                className="h-12"
                placeholderClassName="text-slate-400 font-medium text-sm"
                disabled={isSubmitting}
              />
              {errors.wilaya && <p className={errorClass}>{errors.wilaya}</p>}
            </div>

            {/* Spécialités et Expérience */}
            <div className="grid grid-cols-1 sm:grid-cols-[3fr_1fr] gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Spécialité(s) *
                </label>
                <MultiSelectWithCheckboxes
                  placeholder="Spécialités"
                  options={specialiteOptions}
                  value={formData.specializations}
                  onChange={(value) =>
                    setFormData({ ...formData, specializations: value })
                  }
                  className="h-12"
                  placeholderClassName="text-slate-400 font-medium text-sm"
                  disabled={isSubmitting}
                />
                {errors.specializations && (
                  <p className={errorClass}>{errors.specializations}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 tracking-tight">
                  Expérience *
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  className={`${inputBaseClass} placeholder:text-slate-400 px-3`}
                  placeholder="5"
                  required
                  disabled={isSubmitting}
                />
                {errors.experience && (
                  <p className={errorClass}>{errors.experience}</p>
                )}
              </div>
            </div>

            {/* Bouton submit */}
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
                "Créer mon compte avocat"
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-slate-100">
            <div className="flex flex-col gap-2 sm:block">
              <span className="text-sm text-slate-600">
                Vous avez déjà un compte ?
              </span>
              <Link
                href="/auth/lawyer/login"
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
