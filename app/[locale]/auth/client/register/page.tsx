"use client";
import { useState, useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { Eye, EyeOff, Smartphone } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { toArabicNumerals } from "@/lib/arabicNumerals";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CIVILITE_OPTIONS, frontendToDb } from "@/lib/genderUtils";
import { LOCATION, COUNTRIES, LOCATION_TO_PHONE_CODE } from "@/utils/constants";
import { getCountryLabel } from "@/lib/i18nLabels";
import { FormErrors } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { gsap } from "gsap";

export default function ClientRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "";
  const { signUp } = useAuth();
  const t = useTranslations();
  const locale = useLocale();
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
    label: `${c.flag} \u200E+${c.code}\u200E ${getCountryLabel(c.id, t)}`,
  }));

  const inputCls =
    "w-full h-12 px-4 text-sm border border-slate-300 dark:border-[#3a3a3d] rounded-lg bg-white dark:bg-[#1c1c1e] hover:border-teal-300 dark:hover:border-[#6fcf9f] focus:border-teal-300 dark:focus:border-[#6fcf9f] focus:border-2 outline-none transition-all duration-200 text-slate-700 dark:text-[#F5F5F4] placeholder:text-slate-400 dark:placeholder:text-[#7A7A78]";
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
    if (!formData.firstName.trim())
      e.firstName = t("validation.required.firstName");
    if (!formData.lastName.trim())
      e.lastName = t("validation.required.lastName");
    if (!formData.email.trim()) e.email = t("validation.required.email");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = t("validation.invalid.email");
    if (!formData.password) e.password = t("validation.required.password");
    else if (formData.password.length < 8)
      e.password = t("validation.invalid.passwordLength");
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = t("validation.invalid.passwordMismatch");
    if (!formData.mobile.trim()) e.mobile = t("validation.required.mobile");
    else if (formData.mobile.length < 7)
      e.mobile = t("validation.invalid.mobileTooShort");
    if (!formData.location) e.location = t("validation.required.location");
    if (!formData.gender) e.gender = t("validation.required.civilite");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});
    const emailNorm = formData.email.trim().toLowerCase();
    try {
      const result = await signUp(emailNorm, formData.password, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        mobile: `+${mobileCountry}${formData.mobile.replace(/^0+/, "")}`,
        userType: "client" as const,
        location: formData.location,
        gender: frontendToDb(formData.gender),
      });
      const base = result.redirectPath || "/";
      const target = redirectTo
        ? `${base}${base.includes("?") ? "&" : "?"}redirect=${encodeURIComponent(
            redirectTo
          )}`
        : base;
      router.push(target);
    } catch (error: any) {
      const errStr = (error?.message || "").toLowerCase();
      let msg = t("validation.general.genericError");

      if (
        errStr.includes("already registered") ||
        errStr.includes("already exists") ||
        errStr.includes("user already") ||
        errStr.includes("duplicate") ||
        error?.status === 422
      ) {
        msg = t("validation.general.emailTaken");
      } else if (errStr.includes("invalid") && errStr.includes("email")) {
        msg = t("validation.general.emailInvalid");
      } else if (errStr.includes("password")) {
        msg = t("validation.general.passwordWeak");
      } else if (errStr.includes("rate") || errStr.includes("too many")) {
        msg = t("validation.general.tooManyAttempts");
      } else if (errStr.includes("network") || errStr.includes("fetch")) {
        msg = t("validation.general.networkError");
      }

      setErrors({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none">
      <style>{`.page-title,.page-subtitle,.register-form{opacity:0;}`}</style>
      <div className="max-w-md mx-auto px-4 py-24" ref={containerRef}>
        <div className="text-center mb-8">
          <h1 className="page-title text-2xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-2">
            {t("auth.clientRegister.title")}
          </h1>
          <p className="page-subtitle text-slate-600 dark:text-[#E8E8E6]">
            {t("auth.clientRegister.subtitle")}
          </p>
        </div>

        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-lg dark:shadow-none p-6 border border-slate-100 dark:border-[#1c2220]">
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
              <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-1">
                {t("auth.clientRegister.civilite")} *
              </label>
              <CustomSelect
                options={CIVILITE_OPTIONS}
                value={formData.gender}
                onChange={(v) => setFormData((p) => ({ ...p, gender: v }))}
                placeholder={t("auth.clientRegister.select")}
                className="h-12"
                disabled={isSubmitting}
              />
              {errors.gender && <p className={errCls}>{errors.gender}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-1">
                  {t("auth.clientRegister.firstName")} *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleCap}
                  className={inputCls}
                  placeholder={t("auth.clientRegister.firstNamePh")}
                  disabled={isSubmitting}
                />
                {errors.firstName && (
                  <p className={errCls}>{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-1">
                  {t("auth.clientRegister.lastName")} *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleCap}
                  className={inputCls}
                  placeholder={t("auth.clientRegister.lastNamePh")}
                  disabled={isSubmitting}
                />
                {errors.lastName && <p className={errCls}>{errors.lastName}</p>}
              </div>
            </div>

            <div className="relative z-30">
              <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-1">
                {t("auth.clientRegister.location")} *
              </label>
              <CustomSelect
                options={LOCATION}
                value={formData.location}
                onChange={handleLocationChange}
                placeholder={t("auth.clientRegister.locationPh")}
                className="h-12"
                disabled={isSubmitting}
              />
              {errors.location && <p className={errCls}>{errors.location}</p>}
            </div>

            <div className="relative z-20">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-1">
                <Smartphone className="w-4 h-4" />{" "}
                {t("auth.clientRegister.mobile")} *
              </label>
              <div className="flex gap-2">
                <div className="w-44 flex-shrink-0">
                  <CustomSelect
                    options={countryOptions}
                    value={mobileCountry}
                    onChange={setMobileCountry}
                    placeholder={
                      locale === "ar" ? toArabicNumerals("+213") : "+213"
                    }
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
                  placeholder={t("auth.clientRegister.mobilePh")}
                  disabled={isSubmitting}
                />
              </div>
              {errors.mobile && <p className={errCls}>{errors.mobile}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-1">
                {t("auth.clientRegister.email")} *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInput}
                className={`${inputCls} placeholder:text-slate-400 dark:text-[#7A7A78]`}
                placeholder={t("auth.clientRegister.emailPh")}
                disabled={isSubmitting}
              />
              {errors.email && <p className={errCls}>{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-1">
                {t("auth.clientRegister.password")} *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInput}
                  className={`${inputCls} pe-12`}
                  placeholder={t("auth.clientRegister.passwordPh")}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#7A7A78] hover:text-slate-600 dark:hover:text-[#E8E8E6]"
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
              <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-1">
                {t("auth.clientRegister.confirmPassword")} *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInput}
                  className={`${inputCls} pe-12`}
                  placeholder={t("auth.clientRegister.confirmPasswordPh")}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="cursor-pointer absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#7A7A78] hover:text-slate-600 dark:hover:text-[#E8E8E6]"
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
                className="cursor-pointer w-6 h-6 border-slate-300 dark:border-[#3a3a3d] rounded mt-1 accent-teal-600 dark:accent-[#0F6E56]"
                required
                disabled={isSubmitting}
              />
              <label
                htmlFor="terms"
                className="text-sm text-slate-600 dark:text-[#E8E8E6] cursor-pointer"
              >
                {t("auth.clientRegister.termsPrefix")}{" "}
                <Link
                  href="/cgu"
                  className="text-teal-600 dark:text-[#6fcf9f] hover:underline"
                >
                  {t("auth.clientRegister.termsCgu")}
                </Link>{" "}
                {t("auth.clientRegister.termsAnd")}{" "}
                <Link
                  href="/privacy"
                  className="text-teal-600 dark:text-[#6fcf9f] hover:underline"
                >
                  {t("auth.clientRegister.termsPrivacy")}
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full h-12 bg-teal-600 dark:bg-[#0F6E56] text-white font-medium rounded-lg hover:bg-teal-700 dark:hover:bg-[#085041] outline-none transition-all duration-200 mt-6 disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white me-2" />
                  {t("auth.clientRegister.submitting")}
                </>
              ) : (
                t("auth.clientRegister.submit")
              )}
            </button>
          </form>

          <div className="flex items-center justify-center gap-1.5 mt-6">
            <span className="text-sm text-slate-600 dark:text-[#E8E8E6]">
              {t("auth.clientRegister.hasAccount")}
            </span>
            <Link
              href="/auth/client/login"
              className="text-sm text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#6fcf9f] font-medium"
            >
              {t("auth.clientRegister.login")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
