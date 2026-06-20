"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { gsap } from "gsap";

function ResetPasswordForm() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("resetPasswordPage");
  const containerRef = useRef<HTMLDivElement>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const type = searchParams.get("type") || "client";
  const loginPath =
    type === "lawyer" ? "/auth/lawyer/login" : "/auth/client/login";
  const forgotPath =
    type === "lawyer"
      ? "/auth/lawyer/forgot-password"
      : "/auth/client/forgot-password";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handlePasswordReset = async () => {
      try {
        const tokenHash = searchParams.get("token_hash");
        const tokenType = searchParams.get("type");

        if (tokenHash && tokenType === "recovery") {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "recovery",
          });

          if (verifyError) {
            setError(t("invalidLink"));
            setIsLoading(false);
            setSessionReady(false);
            return;
          }

          setSessionReady(true);
          setIsLoading(false);
          return;
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          setError(t("invalidLink"));
          setIsLoading(false);
          setSessionReady(false);
          return;
        }

        setSessionReady(true);
        setIsLoading(false);
      } catch (err) {
        setError(t("genericError"));
        setIsLoading(false);
        setSessionReady(false);
      }
    };

    handlePasswordReset();
  }, [supabase, searchParams, isMounted]);

  useEffect(() => {
    if (!containerRef.current || isLoading || !isMounted) return;
    const timeline = gsap.timeline();
    timeline
      .fromTo(
        ".icon-container",
        { opacity: 0, y: -30, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.7)" }
      )
      .fromTo(
        ".page-title",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".form-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.3"
      );
  }, [isLoading, isMounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    if (password.length < 8) {
      setError(t("errors.minLength"));
      setIsSubmitting(false);
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError(t("errors.complexity"));
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(t("errors.mismatch"));
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(t("errors.updateError", { msg: updateError.message }));
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);

      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push(loginPath);
      }, 2000);
    } catch (err: any) {
      setError(t("errors.tryAgain"));
      setIsSubmitting(false);
    }
  };

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="text-slate-600">{t("checkingLink")}</p>
        </div>
      </div>
    );
  }

  if (!sessionReady) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {t("invalidLinkTitle")}
            </h2>
            <p className="text-slate-600 mb-6">
              {error || t("invalidLinkDesc")}
            </p>
            <button
              onClick={() => router.push(forgotPath)}
              className="cursor-pointer w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              {t("resendLink")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {t("successTitle")}
            </h2>
            <p className="text-slate-600 mb-4">{t("successDesc")}</p>
            <p className="text-sm text-slate-500">{t("successRedirect")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <div className="max-w-md mx-auto px-4 py-24" ref={containerRef}>
        <div className="text-center mb-8">
          <div className="icon-container w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="page-title text-2xl font-bold text-slate-800 mb-2">
            {t("title")}
          </h1>
          <p className="text-slate-600 text-sm">{t("subtitle")}</p>
        </div>

        <div className="form-card bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("newPassword")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-slate-800 w-full h-12 px-4 text-sm border-2 border-slate-300 rounded-lg bg-white hover:border-teal-300 focus:border-teal-300 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all duration-200"
                  placeholder={t("passwordPh")}
                  required
                  disabled={isSubmitting}
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">{t("passwordHint")}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("confirmPassword")}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-slate-800 w-full h-12 px-4 text-sm border-2 border-slate-300 rounded-lg bg-white hover:border-teal-300 focus:border-teal-300 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all duration-200"
                  placeholder={t("confirmPasswordPh")}
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="cursor-pointer absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t("submitting")}
                </div>
              ) : (
                t("submit")
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          <button
            onClick={() => router.push(loginPath)}
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            {t("backToLogin")}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
