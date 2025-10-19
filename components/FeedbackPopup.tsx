"use client";

import { useState } from "react";
import { X, MessageCircle, Lightbulb, Bug, Send } from "lucide-react";
import { FeedbackPopupProps } from "@/types";

export default function FeedbackPopup({ onClose }: FeedbackPopupProps) {
  const [type, setType] = useState("testimonial");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

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
          pageUrl: window.location.pathname,
        }),
      });

      setSuccess(true);
      setTimeout(() => onClose(), 2000);
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          // Success state
          <div className="text-center py-12 px-8">
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
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Merci pour votre feedback !
            </h3>
            <p className="text-slate-600">Votre message a bien été envoyé.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-semibold text-slate-900 mb-1">
                Votre avis nous intéresse
              </h3>
              <p className="text-sm text-slate-600">
                Aidez-nous à améliorer votre expérience sur Mizan
              </p>
            </div>

            <div className="p-6">
              {/* Type selection */}
              <div className="space-y-2 mb-6">
                {feedbackTypes.map((ft) => {
                  const Icon = ft.icon;
                  const isSelected = type === ft.value;

                  return (
                    <label
                      key={ft.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
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
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? "bg-teal-600" : "bg-slate-100"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            isSelected ? "text-white" : "text-slate-500"
                          }`}
                        />
                      </div>
                      <span
                        className={`font-medium ${
                          isSelected ? "text-slate-900" : "text-slate-700"
                        }`}
                      >
                        {ft.label}
                      </span>
                      {isSelected && (
                        <div className="ml-auto w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
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
              <div className="mb-6">
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
                  className="w-full text-slate-700 placeholder:text-slate-500 h-32 p-3 border border-slate-300 rounded-lg resize-none focus:ring-teal-400 focus:ring-1 outline-none transition-all"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="cursor-pointer flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Plus tard
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || sending}
                  className="cursor-pointer flex-1 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white py-2.5 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Envoi...
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
          </>
        )}
      </div>
    </div>
  );
}
