"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FormErrors } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { gsap } from "gsap";

export default function ClientLoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        ".login-form",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".form-footer",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.2"
      );
  }, []);

  const inputBaseClass =
    "w-full h-12 px-4 text-sm border border-slate-300 rounded-lg bg-white focus:border-2 hover:border-2 hover:border-teal-300 focus:border-teal-300 outline-none transition-all duration-200 text-slate-700";
  const errorClass = "text-red-500 text-xs mt-1";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (!formData.email.trim()) {
      newErrors.email = t("validation.required.email");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("validation.invalid.email");
    }

    if (!formData.password.trim()) {
      newErrors.password = t("validation.required.password");
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
      const result = await signIn(formData.email, formData.password, "client");
      const redirectPath = result.redirectPath || "/";
      router.push(redirectPath);
    } catch (error: any) {
      console.error("Erreur connexion client:", error);

      let errorMessage = t("validation.general.wrongCredentials");

      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = t("validation.general.wrongCredentials");
      } else if (error.message?.includes("Too many requests")) {
        errorMessage = t("validation.general.tooManyAttempts");
      } else if (
        error.message?.includes("Ce compte n'est pas un compte client")
      ) {
        errorMessage = t("validation.general.notClientAccount");
      } else if (error.message?.includes("User not found")) {
        errorMessage = t("validation.general.userNotFound");
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = t("validation.general.emailNotConfirmed");
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none">
      <style>{`
        .page-title,
        .page-subtitle,
        .login-form,
        .form-footer {
          opacity: 0;
        }
      `}</style>

      <div className="max-w-md mx-auto px-4 py-24" ref={containerRef}>
        <div className="text-center mb-8">
          <h1 className="page-title text-2xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-2">
            {t("auth.clientLogin.title")}
          </h1>
          <p className="page-subtitle text-slate-600 dark:text-[#E8E8E6]">
            {t("auth.clientLogin.subtitle")}
          </p>
        </div>

        <div className="bg-white dark:bg-[#0b1210] rounded-2xl shadow-lg dark:shadow-none p-6 border border-slate-100 dark:border-[#1c2220]">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="login-form space-y-6"
            noValidate
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("auth.clientLogin.email")}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${inputBaseClass} placeholder:text-slate-400 dark:text-[#7A7A78]`}
                placeholder={t("auth.clientLogin.emailPh")}
                required
                disabled={isSubmitting}
              />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("auth.clientLogin.password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`${inputBaseClass} pe-12 placeholder:text-slate-400 dark:text-[#7A7A78]`}
                  placeholder={t("auth.clientLogin.passwordPh")}
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="cursor-pointer absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#7A7A78] hover:text-slate-600 dark:text-[#E8E8E6] transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className={errorClass}>{errors.password}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row items-center sm:justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isSubmitting}
                  className="w-4 h-4 border-slate-300 rounded focus:ring-teal-500 accent-teal-600 disabled:opacity-50"
                  style={{ accentColor: "#0d9488" }}
                />
                <span className="ms-2 text-sm text-slate-600 dark:text-[#E8E8E6] select-none">
                  {t("auth.clientLogin.rememberMe")}
                </span>
              </label>
              <Link
                href="/auth/client/forgot-password"
                className="text-sm text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#5db98a] transition-colors font-medium text-start sm:text-end"
              >
                {t("auth.clientLogin.forgotPassword")}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white me-2"></div>
                  {t("auth.clientLogin.submitting")}
                </>
              ) : (
                t("auth.clientLogin.submit")
              )}
            </button>
          </form>

          <div className="form-footer text-center mt-6 pt-6 border-t border-slate-100 dark:border-[#1c2220]">
            <div className="flex flex-col gap-2 sm:block">
              <span className="text-sm text-slate-600 dark:text-[#E8E8E6]">
                {t("auth.clientLogin.newHere")}
              </span>
              <Link
                href="/auth/client/register"
                className="text-sm text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#5db98a] font-medium transition-colors sm:ms-1"
              >
                {t("auth.clientLogin.createAccount")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
