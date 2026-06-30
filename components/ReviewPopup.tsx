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

export default function ReviewPopup() {
  const supabase = createClient();
  const { user, profile } = useAuth();
  const t = useTranslations("reviewPopup");

  const [pending, setPending] = useState<PendingReview | null>(null);
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!user || profile?.user_type !== "client") return;
    checkPendingReviews();
  }, [user, profile]);

  const checkPendingReviews = async () => {
    const { data } = await supabase
      .from("pending_reviews")
      .select(
        `
        id,
        lawyer_id,
        consultation_id,
        lawyer:lawyer_id(first_name, last_name)
      `
      )
      .eq("client_id", user!.id)
      .limit(1)
      .maybeSingle();

    if (data) {
      setPending(data as any);
      setTimeout(() => setVisible(true), 800);
    }
  };

  const handleSubmit = async () => {
    if (!pending || !user) return;
    setSubmitting(true);
    try {
      await supabase.from("reviews").insert({
        lawyer_id: pending.lawyer_id,
        client_id: user.id,
        rating,
        comment: comment.trim() || null,
        source: "mizan",
      });

      try {
        await fetch("/api/recalculate-ratings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lawyerId: pending.lawyer_id }),
        });
      } catch (_) {}

      await supabase.from("pending_reviews").delete().eq("id", pending.id);

      setDone(true);
      setTimeout(() => setVisible(false), 2500);
    } catch (error) {
      console.error("Erreur soumission avis:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDismiss = async () => {
    if (!pending) return;
    await supabase.from("pending_reviews").delete().eq("id", pending.id);
    setVisible(false);
  };

  if (!visible || !pending) return null;

  const lawyerName = `${pending.lawyer.first_name} ${pending.lawyer.last_name}`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl w-full max-w-md shadow-2xl dark:shadow-none border border-slate-100 dark:border-[#1c2220] transform animate-slideUp">
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
                <h3 className="text-base font-bold text-slate-800 dark:text-[#F5F5F4]">
                  {t("title", { name: lawyerName })}
                </h3>
              </div>
              <button
                onClick={handleDismiss}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1c2220] text-slate-400 dark:text-[#7A7A78] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-3">
                  {t("ratingLabel")}
                </p>
                <div className="flex items-center gap-2">
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
                        className={`w-8 h-8 transition-colors ${
                          star <= (hovered || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200 dark:text-[#3a3a3d]"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-slate-500 dark:text-[#A8A8A6] ms-2">
                    {rating === 1 && t("stars.1")}
                    {rating === 2 && t("stars.2")}
                    {rating === 3 && t("stars.3")}
                    {rating === 4 && t("stars.4")}
                    {rating === 5 && t("stars.5")}
                  </span>
                </div>
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
                  className="w-full px-4 py-3 text-sm border border-slate-300 dark:border-[#3a3a3d] rounded-xl bg-white dark:bg-[#1c1c1e] text-slate-700 dark:text-[#F5F5F4] placeholder:text-slate-400 dark:placeholder:text-[#7A7A78] hover:border-teal-300 dark:hover:border-[#6fcf9f] focus:border-teal-400 dark:focus:border-[#6fcf9f] focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-[#6fcf9f]/20 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 dark:bg-[#0F6E56] dark:hover:bg-[#085041] text-white py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    t("submit")
                  )}
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-3 border border-slate-200 dark:border-[#1c2220] text-slate-600 dark:text-[#E8E8E6] rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#1c2220] transition-colors cursor-pointer"
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
