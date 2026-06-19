"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Lightbulb, Bug, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function FeedbackPage() {
  const { user, profile, isAuthenticated, loading } = useAuth();
  const [type, setType] = useState("testimonial");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/client/login?redirect=/feedback");
    }
  }, [loading, isAuthenticated, router]);

  const handleSubmit = async () => {
    if (!message.trim() || !user) return;

    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/platform-feedback/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message: message.trim(),
          pageUrl: "/feedback",
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      setSuccess(true);
      setTimeout(() => {
        const redirectPath =
          profile?.user_type === "lawyer" ? "/lawyer/dashboard" : "/";
        router.push(redirectPath);
      }, 2500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur est survenue");
    } finally {
      setSending(false);
    }
  };

  const feedbackTypes = [
    {
      value: "testimonial",
      icon: MessageCircle,
      label: "Expérience",
    },
    {
      value: "suggestion",
      icon: Lightbulb,
      label: "Amélioration",
    },
    {
      value: "bug",
      icon: Bug,
      label: "Bug",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-white to-teal-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-white to-teal-100 px-4">
      <div className="max-w-2xl w-full mx-auto">
        {success ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              Merci pour votre feedback !
            </h2>
            <p className="text-slate-600">Redirection en cours...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h1 className="text-2xl font-semibold text-slate-900">
                Votre avis nous intéresse
              </h1>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="mb-5">
                <div className="flex gap-2">
                  {feedbackTypes.map((ft) => {
                    const Icon = ft.icon;
                    const isSelected = type === ft.value;

                    return (
                      <label
                        key={ft.value}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-teal-500 bg-teal-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="feedback-type"
                          value={ft.value}
                          checked={isSelected}
                          onChange={(e) => setType(e.target.value)}
                          className="hidden"
                        />
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            isSelected ? "bg-teal-600" : "bg-slate-100"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${
                              isSelected ? "text-white" : "text-slate-500"
                            }`}
                          />
                        </div>
                        <span className="font-medium text-slate-900 text-sm text-center">
                          {ft.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Votre message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    type === "bug"
                      ? "Décrivez le problème..."
                      : type === "suggestion"
                        ? "Quelle fonctionnalité aimeriez-vous ?"
                        : "Partagez votre expérience..."
                  }
                  className="w-full h-32 px-4 py-3 text-sm border border-slate-300 rounded-lg bg-white focus:border-2 hover:border-2 hover:border-teal-300 focus:border-teal-300 outline-none transition-all duration-200 text-slate-700 resize-none"
                  maxLength={1000}
                />
                <p className="text-xs text-slate-500 mt-2">
                  {message.length}/1000 caractères
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!message.trim() || sending}
                className="cursor-pointer w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Envoyer
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
