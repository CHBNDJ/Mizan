"use client";

import { useState } from "react";
import { X, MessageCircle, Lightbulb, Bug, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { FeedbackPopupProps } from "@/types";
import { useAuth } from "@/hooks/useAuth";

export default function FeedbackPopup({ onClose }: FeedbackPopupProps) {
  const { user } = useAuth();
  const t = useTranslations("feedbackPopup");
  const [type, setType] = useState("testimonial");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
          pageUrl: window.location.pathname,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errorSend"));
      }

      setSuccess(true);
      setTimeout(() => onClose(), 2000);
    } catch (err: any) {
      console.error("Erreur feedback:", err);
      setError(err.message || t("errorGeneric"));
    } finally {
      setSending(false);
    }
  };

  const feedbackTypes = [
    {
      value: "testimonial",
      icon: MessageCircle,
      label: t("types.testimonial"),
    },
    { value: "suggestion", icon: Lightbulb, label: t("types.suggestion") },
    { value: "bug", icon: Bug, label: t("types.bug") },
  ];

  const placeholder =
    type === "bug"
      ? t("placeholders.bug")
      : type === "suggestion"
        ? t("placeholders.suggestion")
        : t("placeholders.testimonial");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1c1c1e] rounded-xl max-w-lg w-full shadow-xl dark:shadow-none border border-transparent dark:border-[#1c2220] relative">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 text-slate-400 dark:text-[#7A7A78] hover:text-slate-700 dark:hover:text-[#E8E8E6] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-12 px-8">
            <div className="w-16 h-16 bg-teal-100 dark:bg-[#6fcf9f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-teal-600 dark:text-[#6fcf9f]"
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
            <h3 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-2">
              {t("thanksTitle")}
            </h3>
            <p className="text-slate-600 dark:text-[#A8A8A6]">
              {t("thanksDesc")}
            </p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-slate-100 dark:border-[#1c2220]">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-[#F5F5F4] mb-1">
                {t("title")}
              </h3>
              <p className="text-sm text-slate-600 dark:text-[#A8A8A6]">
                {t("subtitle")}
              </p>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2 mb-6">
                {feedbackTypes.map((ft) => {
                  const Icon = ft.icon;
                  const isSelected = type === ft.value;

                  return (
                    <label
                      key={ft.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-teal-500 dark:border-[#6fcf9f] bg-teal-50 dark:bg-[#6fcf9f]/10"
                          : "border-slate-200 dark:border-[#1c2220] hover:border-slate-300 dark:hover:border-[#3a3a3d] hover:bg-slate-50 dark:hover:bg-[#141415]"
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
                          isSelected
                            ? "bg-teal-600 dark:bg-[#0F6E56]"
                            : "bg-slate-100 dark:bg-[#2a2a2d]"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            isSelected
                              ? "text-white"
                              : "text-slate-500 dark:text-[#A8A8A6]"
                          }`}
                        />
                      </div>
                      <span
                        className={`font-medium ${
                          isSelected
                            ? "text-slate-900 dark:text-[#F5F5F4]"
                            : "text-slate-700 dark:text-[#E8E8E6]"
                        }`}
                      >
                        {ft.label}
                      </span>
                      {isSelected && (
                        <div className="ms-auto w-5 h-5 bg-teal-600 dark:bg-[#0F6E56] rounded-full flex items-center justify-center">
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

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                  {t("messageLabel")}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 text-sm border border-slate-300 dark:border-[#3a3a3d] rounded-lg bg-white dark:bg-[#141415] focus:border-2 hover:border-2 hover:border-teal-300 dark:hover:border-[#6fcf9f] focus:border-teal-300 dark:focus:border-[#6fcf9f] outline-none transition-all duration-200 text-slate-700 dark:text-[#E8E8E6] placeholder:text-slate-400 dark:placeholder:text-[#7A7A78] resize-none h-32"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="cursor-pointer flex-1 px-4 py-2.5 border border-slate-300 dark:border-[#1c2220] rounded-lg text-slate-700 dark:text-[#E8E8E6] font-medium hover:bg-slate-50 dark:hover:bg-[#141415] transition-colors"
                >
                  {t("later")}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || sending}
                  className="cursor-pointer flex-1 bg-teal-600 dark:bg-[#0F6E56] hover:bg-teal-700 dark:hover:bg-[#085041] disabled:bg-slate-300 dark:disabled:bg-[#2a2a2d] text-white py-2.5 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      {t("sending")}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t("send")}
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
