"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { gsap } from "gsap";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("verifyEmailPage");
  const containerRef = useRef<HTMLDivElement>(null);
  const email = searchParams.get("email") || "";
  const userType = searchParams.get("type") || "client";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

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
        ".page-subtitle",
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".form-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.3"
      );
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    if (code.length !== 6) {
      setError(t("errors.codeLength"));
      setIsVerifying(false);
      return;
    }

    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          code: code,
          userType: userType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errors.invalidCode"));
      }

      setSuccess(true);

      setTimeout(() => {
        const redirectPath = data.redirectPath || "/";
        router.push(redirectPath);
      }, 2000);
    } catch (err: any) {
      setError(err.message || t("errors.invalidOrExpired"));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setResendSuccess(false);
    setError("");

    try {
      const response = await fetch("/api/resend-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          userType: userType,
        }),
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        if (contentType?.includes("application/json")) {
          try {
            const data = await response.json();
            throw new Error(data.error || t("errors.resendError"));
          } catch (parseError) {
            throw new Error(
              t("errors.serverError", { status: response.status })
            );
          }
        } else {
          const text = await response.text();
          throw new Error(t("errors.serverError", { status: response.status }));
        }
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error(t("errors.communicationError"));
      }

      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || t("errors.resendError"));
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none flex items-center justify-center">
        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-lg dark:shadow-none p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-600 dark:text-[#E08585] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-2">
            {t("missingEmailTitle")}
          </h2>
          <p className="text-slate-600 dark:text-[#E8E8E6] mb-4">
            {t("missingEmailDesc")}
          </p>
          <button
            onClick={() => router.push("/")}
            className="cursor-pointer bg-teal-600 dark:bg-[#0F6E56] text-white px-6 py-2 rounded-lg hover:bg-teal-700 dark:hover:bg-[#085041] transition-colors"
          >
            {t("backHome")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none">
      <style>{`
        .icon-container,
        .page-title,
        .page-subtitle,
        .form-card {
          opacity: 0;
        }
      `}</style>

      <div className="max-w-md mx-auto px-4 py-24" ref={containerRef}>
        <div className="text-center mb-8">
          <div className="icon-container w-20 h-20 bg-teal-100 dark:bg-[#6fcf9f]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-teal-600 dark:text-[#6fcf9f]" />
          </div>

          <h1 className="page-title text-2xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-4">
            {t("title")}
          </h1>

          <p className="page-subtitle text-slate-600 dark:text-[#E8E8E6] mb-2">
            {t("subtitle")}
          </p>
          <p className="font-semibold text-slate-800 dark:text-[#F5F5F4]">
            {email}
          </p>
        </div>

        <div className="form-card bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-lg dark:shadow-none p-8">
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-[#1F3D2A] border border-green-200 dark:border-[#2A5A3A] rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-[#7FD99F] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-800 dark:text-[#7FD99F] font-medium text-sm">
                  {t("successTitle")}
                </p>
                <p className="text-green-700 dark:text-[#7FD99F]/90 text-xs mt-1">
                  {t("successSubtitle")}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-[#3D1F1F] border border-red-200 dark:border-[#5A2A2A] rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-[#E08585] flex-shrink-0 mt-0.5" />
              <p className="text-red-700 dark:text-[#E08585] text-sm">
                {error}
              </p>
            </div>
          )}

          {resendSuccess && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-[#1F2E3D] border border-blue-200 dark:border-[#2A4A5A] rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-[#7FB3E0] flex-shrink-0 mt-0.5" />
              <p className="text-blue-700 dark:text-[#7FB3E0] text-sm">
                {t("resendSuccess")}
              </p>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2 text-center">
                {t("codeLabel")}
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 6) setCode(value);
                }}
                placeholder="123456"
                className="w-full h-14 px-4 text-center text-2xl font-bold tracking-widest border-2 border-slate-300 dark:border-[#3a3a3d] rounded-lg bg-white dark:bg-[#1c1c1e] hover:border-teal-300 dark:hover:border-[#6fcf9f] focus:border-teal-300 dark:focus:border-[#6fcf9f] focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-[#6fcf9f]/20 outline-none transition-all duration-200 text-slate-800 dark:text-[#F5F5F4] placeholder:text-slate-300 dark:placeholder:text-[#5a5a5d]"
                maxLength={6}
                required
                disabled={isVerifying || success}
                autoFocus
              />
              <p className="text-xs text-slate-500 dark:text-[#A8A8A6] mt-2 text-center">
                {t("codeHint")}
              </p>
            </div>

            <button
              type="submit"
              disabled={isVerifying || success || code.length !== 6}
              className="cursor-pointer w-full bg-teal-600 dark:bg-[#0F6E56] text-white py-3 rounded-lg font-medium hover:bg-teal-700 dark:hover:bg-[#085041] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t("verifying")}
                </div>
              ) : success ? (
                t("verified")
              ) : (
                t("verifyAction")
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-[#1c2220]">
            <div className="bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-200 dark:border-[#6fcf9f]/20 rounded-lg p-4 mb-4">
              <p className="text-teal-800 dark:text-[#6fcf9f] text-sm">
                <strong>{t("noEmailTitle")}</strong>
                <br />
                {t("noEmailDesc")}
              </p>
            </div>

            <button
              onClick={handleResendCode}
              disabled={isResending || success}
              className="cursor-pointer w-full text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#6fcf9f] text-sm font-medium py-2 hover:bg-teal-50 dark:hover:bg-[#6fcf9f]/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-teal-600 dark:border-[#6fcf9f]"></div>
                  {t("resending")}
                </div>
              ) : (
                t("resendAction")
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-[#A8A8A6] mt-6">
          {t("needHelp")}{" "}
          <a
            href="mailto:support@mizan-dz.com"
            className="text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#6fcf9f]"
          >
            {t("contactUs")}
          </a>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 dark:border-[#6fcf9f]"></div>
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
