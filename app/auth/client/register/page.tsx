"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Eye, EyeOff, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CIVILITE_OPTIONS, frontendToDb } from "@/lib/genderUtils";
import { LOCATION, COUNTRIES, LOCATION_TO_PHONE_CODE } from "@/utils/constants";
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
    mobile: "",
    location: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mobileCountry, setMobileCountry] = useState("213");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!containerRef.current) return;
    gsap
      .timeline()
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

  const countryOptions = COUNTRIES.map((c) => ({
    value: c.code,
    label: `${c.flag} +${c.code} ${c.name}`,
  }));

  const inputCls =
    "w-full h-12 px-4 text-sm border border-slate-300 rounded-lg bg-white hover:border-teal-300 focus:border-teal-300 focus:border-2 outline-none transition-all duration-200 text-slate-700";
  const errCls = "text-red-500 text-xs mt-1";
  const cap = (s: string) =>
    s
      ? s
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ")
      : s;

  const handleCap = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((p) => ({ ...p, [e.target.name]: cap(e.target.value) }));
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleLocationChange = (v: string) => {
    setFormData((p) => ({ ...p, location: v }));
    const code = LOCATION_TO_PHONE_CODE[v];
    if (code) setMobileCountry(code);
  };

  const validateForm = (): boolean => {
    const e: FormErrors = {};
    if (!formData.firstName.trim()) e.firstName = "Le prénom est requis";
    if (!formData.lastName.trim()) e.lastName = "Le nom est requis";
    if (!formData.email.trim()) e.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Format email invalide";
    if (!formData.password) e.password = "Le mot de passe est requis";
    else if (formData.password.length < 8) e.password = "Minimum 8 caractères";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      e.password = "1 majuscule, 1 minuscule, 1 chiffre";
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Les mots de passe ne correspondent pas";
    if (!formData.mobile.trim()) e.mobile = "Le mobile est requis";
    else if (formData.mobile.length < 7) e.mobile = "Numéro trop court";
    if (!formData.location) e.location = "Sélectionnez votre lieu de résidence";
    if (!formData.gender) e.gender = "La civilité est requise";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      const result = await signUp(formData.email, formData.password, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        mobile: `+${mobileCountry}${formData.mobile}`,
        userType: "client" as const,
        location: formData.location,
        gender: frontendToDb(formData.gender),
      });
      router.push(result.redirectPath || "/");
    } catch (error: any) {
      let msg = "Une erreur est survenue.";
      if (error.message?.includes("already registered"))
        msg = "Cette adresse email est déjà utilisée.";
      setErrors({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <style>{`.page-title,.page-subtitle,.register-form{opacity:0;}`}</style>
      <div className="max-w-md mx-auto px-4 py-24" ref={containerRef}>
        <div className="text-center mb-8">
          <h1 className="page-title text-2xl font-bold text-slate-800 mb-2">
            Inscription Client
          </h1>
          <p className="page-subtitle text-slate-600">
            Créez votre compte et trouvez le bon expert juridique
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Civilité *
              </label>
              <CustomSelect
                options={CIVILITE_OPTIONS}
                value={formData.gender}
                onChange={(v) => setFormData((p) => ({ ...p, gender: v }))}
                placeholder="Sélectionnez"
                className="h-12"
                disabled={isSubmitting}
              />
              {errors.gender && <p className={errCls}>{errors.gender}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleCap}
                  className={inputCls}
                  placeholder="Votre prénom"
                  disabled={isSubmitting}
                />
                {errors.firstName && (
                  <p className={errCls}>{errors.firstName}</p>
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
                  onChange={handleCap}
                  className={inputCls}
                  placeholder="Votre nom"
                  disabled={isSubmitting}
                />
                {errors.lastName && <p className={errCls}>{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Lieu de résidence *
              </label>
              <CustomSelect
                options={LOCATION}
                value={formData.location}
                onChange={handleLocationChange}
                placeholder="Sélectionnez votre pays"
                className="h-12"
                disabled={isSubmitting}
              />
              {errors.location && <p className={errCls}>{errors.location}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                <Smartphone className="w-4 h-4" /> Numéro mobile *
              </label>
              <div className="flex gap-2">
                <div className="w-44 flex-shrink-0">
                  <CustomSelect
                    options={countryOptions}
                    value={mobileCountry}
                    onChange={setMobileCountry}
                    placeholder="+213"
                    className="h-12"
                    disabled={isSubmitting}
                  />
                </div>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) handleInput(e);
                  }}
                  className={inputCls}
                  placeholder="555 123 456"
                  disabled={isSubmitting}
                />
              </div>
              {errors.mobile && <p className={errCls}>{errors.mobile}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Adresse email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInput}
                className={`${inputCls} placeholder:text-slate-400`}
                placeholder="votre@email.com"
                disabled={isSubmitting}
              />
              {errors.email && <p className={errCls}>{errors.email}</p>}
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
                  onChange={handleInput}
                  className={`${inputCls} pr-12`}
                  placeholder="Minimum 8 caractères"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && <p className={errCls}>{errors.password}</p>}
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
                  onChange={handleInput}
                  className={`${inputCls} pr-12`}
                  placeholder="Répétez votre mot de passe"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className={errCls}>{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                className="cursor-pointer w-6 h-6 border-slate-300 rounded mt-1"
                style={{ accentColor: "#0d9488" }}
                required
                disabled={isSubmitting}
              />
              <label
                htmlFor="terms"
                className="text-sm text-slate-600 cursor-pointer"
              >
                J'accepte les{" "}
                <Link href="/cgu" className="text-teal-600 hover:underline">
                  conditions d'utilisation
                </Link>{" "}
                et la{" "}
                <Link href="/privacy" className="text-teal-600 hover:underline">
                  politique de confidentialité
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full h-12 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 outline-none transition-all duration-200 mt-6 disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Création en cours...
                </>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>

          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-slate-600">
              Vous avez déjà un compte ?{" "}
            </span>
            <Link
              href="/auth/client/login"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
