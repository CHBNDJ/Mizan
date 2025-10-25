"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { gsap } from "gsap";

export default function ClientForgotPasswordPage() {
  const supabase = createClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password?type=client`,
      });

      if (error) throw error;
      setStatus("success");
      setMessage("Un email de réinitialisation a été envoyé à votre adresse.");
    } catch (error: any) {
      setStatus("error");
      setMessage("Erreur lors de l'envoi de l'email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
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
          <div className="icon-container w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="page-title text-2xl font-bold text-slate-800 mb-2">
            Mot de passe oublié
          </h1>
          <p className="page-subtitle text-slate-600 text-sm">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <div className="form-card bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          {status === "success" && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{message}</p>
              <p className="text-green-600 text-xs mt-2">
                Vérifiez votre boîte email et vos spams.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-slate-800 w-full h-12 px-4 text-sm border-2 border-slate-300 rounded-lg bg-white hover:border-teal-300 focus:border-teal-300 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all duration-200"
                placeholder="votre@email.com"
                required
                disabled={isSubmitting || status === "success"}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || status === "success"}
              className="cursor-pointer w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer le lien"}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-slate-100">
            <Link
              href="/auth/client/login"
              className="text-sm text-teal-600 hover:text-teal-700 transition-colors"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
