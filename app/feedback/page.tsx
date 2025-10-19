"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Lightbulb, Bug, Send } from "lucide-react";

export default function FeedbackPage() {
  const [type, setType] = useState("testimonial");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      await fetch("/api/platform-feedback/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message: message.trim(),
          pageUrl: "/feedback",
        }),
      });

      setSuccess(true);
      setTimeout(() => router.push("/"), 2500);
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const feedbackTypes = [
    {
      value: "testimonial",
      icon: MessageCircle,
      label: "Partager mon expérience",
    },
    {
      value: "suggestion",
      icon: Lightbulb,
      label: "Suggérer une amélioration",
    },
    {
      value: "bug",
      icon: Bug,
      label: "Signaler un bug",
    },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-50 via-white to-teal-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {success ? (
          <div className="bg-white rounded-xl shadow-xl p-16 text-center">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-teal-600"
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
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Merci pour votre feedback !
            </h2>
            <p className="text-lg text-slate-600">
              Votre message a bien été envoyé. Redirection...
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl">
            {/* Header */}
            <div className="p-8 border-b border-slate-100">
              <h1 className="text-3xl font-semibold text-slate-900 mb-2">
                Votre avis nous intéresse
              </h1>
              <p className="text-slate-600">
                Aidez-nous à améliorer votre expérience sur Mizan
              </p>
            </div>

            <div className="p-8">
              {/* Type selection */}
              <div className="space-y-3 mb-8">
                {feedbackTypes.map((ft) => {
                  const Icon = ft.icon;
                  const isSelected = type === ft.value;

                  return (
                    <label
                      key={ft.value}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-teal-500 bg-teal-50"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
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
                      <span
                        className={`text-lg font-medium ${
                          isSelected ? "text-slate-900" : "text-slate-700"
                        }`}
                      >
                        {ft.label}
                      </span>
                      {isSelected && (
                        <div className="ml-auto w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Message input */}
              <div className="mb-8">
                <label className="block text-base font-medium text-slate-700 mb-3">
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
                  className="w-full h-48 p-4 border-2 border-slate-300 rounded-lg resize-none focus:border-2 focus:border-teal-400 outline-none transition-all text-slate-700 placeholder:text-slate-400"
                />
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={!message.trim() || sending}
                className="cursor-pointer w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white py-4 px-6 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer le feedback
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
