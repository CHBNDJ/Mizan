"use client";
import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getAvocatById } from "@/lib/avocatsData";
import { localizedDigits, toArabicNumerals } from "@/lib/arabicNumerals";
import {
  AlertCircle,
  Mail,
  Lock,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { gsap } from "gsap";

export default function ClaimProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const t = useTranslations("claimProfilePage");
  const locale = useLocale();
  const ld = (s: string) => localizedDigits(s, locale);
  const containerRef = useRef<HTMLDivElement>(null);
  const [avocat, setAvocat] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [codeExpiresIn, setCodeExpiresIn] = useState<number>(15);

  useEffect(() => {
    getAvocatById(id).then((data) => {
      if (data?.is_claimed) {
        router.push(`/lawyers/${id}`);
        return;
      }
      setAvocat(data);
    });
  }, [id, router]);

  useEffect(() => {
    if (!containerRef.current || !avocat) return;
    const timeline = gsap.timeline();
    timeline
      .fromTo(
        ".header-icon",
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
        ".main-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".footer-text",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        "-=0.2"
      );
  }, [avocat]);

  useEffect(() => {
    if (step !== 2) return;
    const timer = setInterval(() => {
      setCodeExpiresIn((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setError(t("codeExpired"));
          setStep(1);
          return 0;
        }
        return prev - 1;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, [step]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAttemptsLeft(null);

    try {
      const response = await fetch("/api/send-claim-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lawyerId: id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errors.emailMismatch"));
      }

      setCodeExpiresIn(data.expiresIn || 15);
      setStep(2);
      setError("");
    } catch (err: any) {
      setError(err.message || t("errors.sendError"));
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (code.length !== 6) {
      setError(t("errors.codeLength"));
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError(t("errors.passwordLength"));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/claim-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lawyerId: id, email, code, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.alreadyClaimed) {
          setError(t("errors.alreadyClaimed"));
          setTimeout(() => router.push("/auth/lawyer/login"), 2000);
          return;
        }

        if (data.attemptsLeft !== undefined) {
          setAttemptsLeft(data.attemptsLeft);
          setError(t("errors.wrongCode", { n: data.attemptsLeft }));
          setLoading(false);
          return;
        }

        throw new Error(data.error || t("errors.activationError"));
      }

      router.push("/auth/lawyer/login?claimed=true");
    } catch (err: any) {
      setError(err.message || t("errors.activationErrorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    setCode("");
    setError("");
    setAttemptsLeft(null);
    setStep(1);
  };

  if (!avocat) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
        <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
          <div className="h-20 bg-slate-200 rounded-2xl animate-pulse mx-auto w-20" />
          <div className="h-8 bg-slate-200 rounded-xl animate-pulse w-48 mx-auto" />
          <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
      <style>{`.header-icon, .page-title, .page-subtitle, .main-card, .footer-text { opacity: 0; }`}</style>

      <div className="w-full max-w-lg mx-auto px-4 py-8" ref={containerRef}>
        <div className="text-center mb-8">
          <div className="header-icon inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-6">
            <CheckCircle2 className="w-10 h-10 text-teal-600" />
          </div>
          <h1 className="page-title text-3xl font-bold text-slate-800 mb-3">
            {t("title")}
          </h1>
          <p className="page-subtitle text-lg text-slate-600">
            {avocat.prenom} {avocat.nom}
          </p>
        </div>

        <Card className="main-card shadow-2xl border-0">
          <div className="p-8">
            {step === 1 && (
              <form onSubmit={handleSendCode} className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                    <Mail className="w-5 h-5" />
                    {t("step1.label")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    className="w-full h-14 px-4 text-base border-2 border-slate-300 rounded-lg bg-white focus:border-teal-400 hover:border-teal-300 outline-none transition-all duration-200 text-slate-700"
                    required
                    disabled={loading}
                  />
                  <p className="text-sm text-slate-500 mt-3">
                    {t("step1.hint")}
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white text-base font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      {t("step1.sending")}
                    </div>
                  ) : (
                    t("step1.submit")
                  )}
                </Button>

                <div className="bg-teal-50 border-2 border-teal-200 p-4 rounded-lg">
                  <p className="text-teal-800 text-sm">{t("step1.infoBox")}</p>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleActivate} className="space-y-6">
                <div className="bg-teal-50 border-2 border-teal-200 p-5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-teal-800 font-semibold text-base">
                        {t("step2.sentTitle")}
                      </p>
                      <p className="text-teal-700 text-sm mt-1">
                        {t("step2.sentDesc")}
                      </p>
                      <p className="text-teal-600 text-xs mt-2">
                        {t("step2.expiresIn", { n: ld(String(codeExpiresIn)) })}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    {t("step2.codeLabel")}
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 6) setCode(value);
                    }}
                    placeholder="000000"
                    className="w-full h-16 px-4 text-center text-2xl font-bold tracking-widest border-2 border-slate-300 rounded-lg bg-white focus:border-teal-400 outline-none transition-all text-slate-700"
                    required
                    maxLength={6}
                    disabled={loading}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-slate-500">
                      {t("step2.codeReceived")}
                    </p>
                    {attemptsLeft !== null && (
                      <p className="text-xs text-amber-600 font-medium">
                        {t("step2.attemptsLeft", { n: attemptsLeft })}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                    <Lock className="w-5 h-5" />
                    {t("step2.passwordLabel")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("step2.passwordPh")}
                      className="w-full h-14 px-4 pe-12 text-base border-2 border-slate-300 rounded-lg bg-white focus:border-teal-400 outline-none transition-all text-slate-700"
                      required
                      minLength={8}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-red-700 text-sm font-medium">
                        {error}
                      </p>
                      {attemptsLeft === 0 && (
                        <button
                          type="button"
                          onClick={handleResendCode}
                          className="mt-2 text-teal-600 text-sm font-medium hover:underline"
                        >
                          {t("step2.newCode")}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading}
                    className="flex-1 h-14 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50"
                  >
                    {t("step2.newCode")}
                  </button>
                  <button
                    type="submit"
                    disabled={loading || code.length !== 6}
                    className="flex-[2] h-14 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        {t("step2.activating")}
                      </div>
                    ) : (
                      t("step2.activate")
                    )}
                  </button>
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-lg">
                  <p className="text-amber-800 text-xs">
                    {t("step2.notReceived")}
                  </p>
                </div>
              </form>
            )}
          </div>
        </Card>

        <p className="footer-text text-center text-sm text-slate-500 mt-6">
          {t("footer")}
        </p>
      </div>
    </div>
  );
}
