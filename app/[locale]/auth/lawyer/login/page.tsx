"use client";
import { useState, useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FormErrors } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { gsap } from "gsap";

export default function LawyerLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const inputCls =
    "w-full h-12 px-4 text-sm border border-slate-300 dark:border-[#3a3a3d] rounded-lg bg-white dark:bg-[#1c1c1e] focus:border-2 dark:focus:border-[#6fcf9f] hover:border-2 hover:border-teal-300 dark:hover:border-[#6fcf9f] focus:border-teal-300 outline-none transition-all text-slate-700 dark:text-[#F5F5F4] placeholder:text-slate-400 dark:placeholder:text-[#7A7A78]";
  const errCls = "text-red-500 dark:text-[#E08585] text-xs mt-1";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FormErrors])
      setErrors((p) => ({ ...p, [name]: undefined, general: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!formData.email.trim()) e.email = t("validation.required.email");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = t("validation.invalid.email");
    if (!formData.password.trim())
      e.password = t("validation.required.password");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      const { data: auth, error: authErr } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
      if (authErr) throw authErr;

      const { data: profile, error: profErr } = await supabase
        .from("users")
        .select("user_type, verified")
        .eq("id", auth.user.id)
        .single();
      if (profErr) throw profErr;

      if (profile.user_type !== "lawyer") {
        await supabase.auth.signOut();
        throw new Error("notLawyerAccount");
      }
      if (!profile.verified) {
        await supabase.auth.signOut();
        setErrors({
          general: t("validation.general.pendingVerification"),
        });
        setIsSubmitting(false);
        return;
      }
      router.push("/lawyer/dashboard");
    } catch (err: any) {
      let msg = t("validation.general.wrongCredentials");
      if (err.message?.includes("Invalid login credentials"))
        msg = t("validation.general.wrongCredentials");
      else if (err.message?.includes("Too many requests"))
        msg = t("validation.general.tooManyAttemptsShort");
      else if (err.message === "notLawyerAccount")
        msg = t("validation.general.notLawyerAccount");
      else if (err.message?.includes("User not found"))
        msg = t("validation.general.userNotFound");
      else if (err.message?.includes("Email not confirmed"))
        msg = t("validation.general.emailNotConfirmedShort");
      else if (
        err.message?.toLowerCase().includes("network") ||
        err.message?.toLowerCase().includes("fetch")
      )
        msg = t("validation.general.networkError");
      setErrors({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none">
      <style>{`.page-title,.page-subtitle,.login-form,.form-footer{opacity:0;}`}</style>
      <div className="max-w-md mx-auto px-4 py-24" ref={containerRef}>
        <div className="text-center mb-8">
          <h1 className="page-title text-2xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-2">
            {t("auth.lawyerLogin.title")}
          </h1>
          <p className="page-subtitle text-slate-600 dark:text-[#E8E8E6]">
            {t("auth.lawyerLogin.subtitle")}
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
            className="login-form space-y-6"
            noValidate
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                {t("auth.lawyerLogin.email")}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${inputCls}`}
                placeholder={t("auth.lawyerLogin.emailPh")}
                disabled={isSubmitting}
              />
              {errors.email && <p className={errCls}>{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                {t("auth.lawyerLogin.password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputCls} pe-12`}
                  placeholder={t("auth.lawyerLogin.passwordPh")}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
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
            <div className="flex flex-col gap-3 sm:flex-row items-center sm:justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isSubmitting}
                  className="w-4 h-4 border-slate-300 dark:border-[#3a3a3d] rounded"
                  style={{ accentColor: "#0d9488" }}
                />
                <span className="ms-2 text-sm text-slate-600 dark:text-[#E8E8E6] select-none">
                  {t("auth.lawyerLogin.rememberMe")}
                </span>
              </label>
              <Link
                href="/auth/lawyer/forgot-password"
                className="text-sm text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#6fcf9f] font-medium"
              >
                {t("auth.lawyerLogin.forgotPassword")}
              </Link>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full bg-teal-600 dark:bg-[#0F6E56] text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 dark:hover:bg-[#085041] transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white me-2" />{" "}
                  {t("auth.lawyerLogin.submitting")}
                </>
              ) : (
                t("auth.lawyerLogin.submit")
              )}
            </button>
          </form>
          <div className="form-footer text-center mt-6 pt-6 border-t border-slate-100 dark:border-[#1c2220]">
            <span className="text-sm text-slate-600 dark:text-[#E8E8E6]">
              {t("auth.lawyerLogin.newHere")}{" "}
            </span>
            <Link
              href="/auth/lawyer/register"
              className="text-sm text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#6fcf9f] font-medium"
            >
              {t("auth.lawyerLogin.createAccount")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
