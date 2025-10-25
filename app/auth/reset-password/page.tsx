"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { gsap } from "gsap";

function ResetPasswordForm() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const userType = searchParams.get("type") || "client";
  const containerRef = useRef<HTMLDivElement>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        ".form-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.3"
      );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setIsSubmitting(false);
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError(
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre."
      );
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError("Erreur lors de la modification : " + updateError.message);
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);

      const redirectPath =
        userType === "lawyer" ? "/auth/lawyer/login" : "/auth/client/login";

      setTimeout(async () => {
        await supabase.auth.signOut();
        window.location.href = redirectPath;
      }, 2000);
    } catch (err) {
      console.error("Erreur reset password:", err);
      setError("Une erreur est survenue. Réessayez.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <style>{`
        .icon-container,
        .page-title,
        .form-card {
          opacity: 0;
        }
      `}</style>

      <div className="max-w-md mx-auto px-4 py-24" ref={containerRef}>
        <div className="text-center mb-8">
          <div className="icon-container w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="page-title text-2xl font-bold text-slate-800 mb-2">
            Nouveau mot de passe
          </h1>
        </div>

        <div className="form-card bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-green-600 text-sm font-medium">
                  Mot de passe modifié avec succès !
                </p>
                <p className="text-green-600 text-xs mt-1">
                  Redirection vers la connexion...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-slate-800 w-full h-12 px-4 text-sm border-2 border-slate-300 rounded-lg bg-white hover:border-teal-300 focus:border-teal-300 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all duration-200"
                  placeholder="Minimum 8 caractères"
                  required
                  disabled={isSubmitting || success}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  disabled={isSubmitting || success}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-slate-800 w-full h-12 px-4 text-sm border-2 border-slate-300 rounded-lg bg-white hover:border-teal-300 focus:border-teal-300 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all duration-200"
                  placeholder="Répétez le mot de passe"
                  required
                  disabled={isSubmitting || success}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  disabled={isSubmitting || success}
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
              disabled={isSubmitting || success}
              className="cursor-pointer w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Modification en cours..." : "Réinitialiser"}
            </button>
          </form>
        </div>
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
