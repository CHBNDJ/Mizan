"use client";
import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { localizedDigits } from "@/lib/arabicNumerals";
import { ReviewSectionProps } from "@/types";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  client_initial: string;
}

export default function ReviewSection({
  lawyerId,
  onReviewSubmitted,
}: ReviewSectionProps) {
  const supabase = createClient();
  const { user, profile } = useAuth();
  const t = useTranslations("reviewSection");
  const locale = useLocale();
  const ld = (s: string) => localizedDigits(s, locale);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    loadReviews();
  }, [lawyerId]);

  const loadReviews = async () => {
    try {
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("id, rating, comment, created_at, client_initial")
        .eq("lawyer_id", lawyerId)
        .eq("source", "mizan")
        .order("created_at", { ascending: false });

      if (reviewsError?.message) throw reviewsError;

      if (!reviewsData || reviewsData.length === 0) {
        setReviews([]);
        setLoading(false);
        return;
      }

      const formattedReviews: Review[] = reviewsData.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at,
        client_initial: (review.client_initial || "").toUpperCase(),
      }));

      setReviews(formattedReviews);
    } catch (error: any) {
      console.error("Erreur chargement avis:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return t("today");
    if (diffDays === 1) return t("yesterday");
    if (diffDays < 7) return t("daysAgo", { n: diffDays });
    if (diffDays < 30) return t("weeksAgo", { n: Math.floor(diffDays / 7) });
    if (diffDays < 365) return t("monthsAgo", { n: Math.floor(diffDays / 30) });
    return t("yearsAgo", { n: Math.floor(diffDays / 365) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert(t("errorMustBeLoggedIn"));
      return;
    }
    const commentTrimmed = newReview.comment.trim();
    setSubmitting(true);
    try {
      const clientInitial = (profile?.first_name || "")
        .trim()
        .charAt(0)
        .toUpperCase();

      const { error: insertError } = await supabase.from("reviews").insert({
        lawyer_id: lawyerId,
        client_id: user.id,
        rating: newReview.rating,
        comment: commentTrimmed || null,
        source: "mizan",
        client_initial: clientInitial || null,
      });
      if (insertError) throw insertError;
      try {
        const recalcResponse = await fetch("/api/recalculate-ratings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lawyerId }),
        });
        if (!recalcResponse.ok) console.error("Erreur recalcul ratings");
      } catch (apiError) {
        console.error("Erreur API:", apiError);
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await loadReviews();
      if (onReviewSubmitted) await onReviewSubmitted();
      setNewReview({ rating: 5, comment: "" });
    } catch (error: any) {
      console.error("Erreur soumission avis:", error);
      alert(t("errorSubmit"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 dark:border-[#6fcf9f]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-[#F5F5F4]">
        {t("title")}
      </h2>

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-[#1c1c1e] rounded-lg border border-teal-100 dark:border-[#6fcf9f]/20">
          <p className="text-slate-800 dark:text-[#F5F5F4] text-lg font-medium">
            {t("noReviewsTitle")}
          </p>
          <p className="text-sm text-slate-500 dark:text-[#A8A8A6] mt-2">
            {t("noReviewsDesc")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-[#1c1c1e] rounded-xl p-6 shadow-sm dark:shadow-none border border-slate-200 dark:border-[#1c2220] hover:shadow-lg transition-all duration-300"
            >
              {review.comment ? (
                <div className="flex items-start gap-4 mb-4">
                  <Quote className="w-6 h-6 text-teal-500 dark:text-[#6fcf9f] flex-shrink-0 mt-1" />
                  <p className="text-slate-700 dark:text-[#E8E8E6] italic leading-relaxed flex-1 min-w-0">
                    "{review.comment}"
                  </p>
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-slate-500 dark:text-[#A8A8A6] italic text-sm">
                    {t("noComment")}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-[#1c2220]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-600 dark:bg-[#0F6E56] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">
                      {review.client_initial || "?"}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-[#F5F5F4] text-sm">
                      {t("client")}
                      {review.client_initial
                        ? ` ${review.client_initial}.`
                        : ""}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-[#A8A8A6] mt-0.5">
                      {ld(formatDate(review.created_at))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= review.rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-slate-300 dark:text-[#3a3a3d]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(!profile || profile.user_type === "client") && (
        <div className="bg-gradient-to-br from-teal-50 to-white dark:from-[#6fcf9f]/10 dark:to-[#1c1c1e] rounded-xl p-8 border border-teal-100 dark:border-[#6fcf9f]/20 shadow-sm dark:shadow-none">
          <h3 className="text-2xl font-semibold text-slate-800 dark:text-[#F5F5F4] mb-6">
            {t("shareTitle")}
          </h3>
          {!user ? (
            <p className="text-slate-600 dark:text-[#E8E8E6] text-base">
              {t("loginToReview")}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-base font-medium text-slate-700 dark:text-[#E8E8E6]">
                  {t("yourRating")}
                </span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                      disabled={submitting}
                      className="cursor-pointer focus:outline-none transition-all hover:scale-125 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newReview.rating
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-slate-300 dark:text-[#3a3a3d]"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-2">
                  {t("yourComment")}
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  rows={4}
                  disabled={submitting}
                  className="w-full py-4 px-5 text-base border-2 border-slate-200 dark:border-[#3a3a3d] rounded-xl bg-white dark:bg-[#1c1c1e] focus:border-transparent dark:focus:border-transparent focus:ring-2 focus:ring-teal-400 dark:focus:ring-[#6fcf9f] outline-none transition-all text-slate-700 dark:text-[#E8E8E6] disabled:opacity-50 resize-none"
                  placeholder={t("commentPlaceholder")}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="cursor-pointer w-full sm:w-auto bg-teal-600 dark:bg-[#0F6E56] text-white px-8 py-3.5 rounded-xl hover:bg-teal-700 dark:hover:bg-[#085041] transition-all font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md dark:shadow-none hover:shadow-lg hover:scale-[1.02] active:scale-100"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    {t("submitting")}
                  </>
                ) : (
                  t("submit")
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
