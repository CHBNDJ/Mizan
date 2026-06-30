"use client";
import { useState, useEffect } from "react";
import { Star, X, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PendingReview {
  id: string;
  lawyer_id: string;
  consultation_id: string;
  lawyer: {
    first_name: string;
    last_name: string;
  };
}

const FAKE_PENDING: PendingReview = {
  id: "test",
  lawyer_id: "test",
  consultation_id: "test",
  lawyer: { first_name: "Ahmed", last_name: "Benali" },
};

export default function ReviewPopup() {
  const supabase = createClient();
  const { user, profile } = useAuth();
  const t = useTranslations("reviewPopup");

  const [pending, setPending] = useState<PendingReview | null>(FAKE_PENDING);
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(true);

  const getStarLabel = (n: number) => {
    if (n === 1) return t("stars.1");
    if (n === 2) return t("stars.2");
    if (n === 3) return t("stars.3");
    if (n === 4) return t("stars.4");
    return t("stars.5");
  };

  const handleSubmit = async () => {
    setDone(true);
    setTimeout(() => setVisible(false), 2500);
  };

  const handleDismiss = () => {
    setVisible(false);
  };

  if (!visible || !pending) return null;

  const lawyerName = `${pending.lawyer.first_name} ${pending.lawyer.last_name}`;
  const displayRating = hovered || rating;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl w-full max-w-md shadow-2xl dark:shadow-none border border-slate-100 dark:border-[#1c2220]">
        {done ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-teal-50 dark:bg-[#6fcf9f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-teal-600 dark:text-[#6fcf9f]" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-[#F5F5F4] mb-2">
              {t("thankYouTitle")}
            </h3>
            <p className="text-slate-500 dark:text-[#A8A8A6] text-sm">
              {t("thankYouDesc")}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-[#1c2220]">
              <div>
                <p className="text-xs font-semibold text-teal-600 dark:text-[#6fcf9f] uppercase tracking-wide mb-0.5">
                  {t("tag")}
                </p>
                <h3 className="text-base font-bold text-slate-800 dark:text-[#F5F5F4] leading-snug">
                  {t("title", { name: lawyerName })}
                </h3>
              </div>
              <button
                onClick={handleDismiss}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#2a2a2d] text-slate-400 dark:text-[#7A7A78] transition-colors cursor-pointer flex-shrink-0 ms-3"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-3">
                  {t("ratingLabel")}
                </p>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      className="cursor-pointer focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors duration-100 ${
                          star <= displayRating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-transparent text-slate-200 dark:text-[#3a3a3d]"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs font-semibold text-teal-600 dark:text-[#6fcf9f] h-4">
                  {getStarLabel(displayRating)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                  {t("commentLabel")}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder={t("commentPlaceholder")}
                  className="w-full px-4 py-3 text-sm border-2 border-slate-200 dark:border-[#3a3a3d] rounded-xl bg-white dark:bg-[#141415] text-slate-700 dark:text-[#F5F5F4] placeholder:text-slate-400 dark:placeholder:text-[#7A7A78] focus:border-transparent dark:focus:border-transparent focus:ring-2 focus:ring-teal-400 dark:focus:ring-[#6fcf9f] outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 dark:bg-[#0F6E56] dark:hover:bg-[#085041] text-white py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {t("submit")}
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-3 border border-slate-200 dark:border-[#1c2220] text-slate-600 dark:text-[#E8E8E6] rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#2a2a2d] transition-colors cursor-pointer"
                >
                  {t("later")}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
