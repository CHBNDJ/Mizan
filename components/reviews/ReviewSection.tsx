"use client";

import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ReviewSectionProps, Review } from "@/types";

export default function ReviewSection({ lawyerId }: ReviewSectionProps) {
  const supabase = createClient();
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    loadReviews();
  }, [lawyerId]);

  const loadReviews = async () => {
    try {
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("lawyer_id", lawyerId)
        .order("created_at", { ascending: false });

      if (reviewsError?.message) throw reviewsError;

      if (!reviewsData || reviewsData.length === 0) {
        setReviews([]);
        setLoading(false);
        return;
      }

      const clientIds = reviewsData.map((r) => r.client_id);

      const { data: clientsData, error: clientsError } = await supabase
        .from("users")
        .select("id, first_name, last_name")
        .in("id", clientIds);

      if (clientsError?.message) throw clientsError;

      const formattedReviews: Review[] = reviewsData.map((review) => {
        const client = clientsData?.find((c) => c.id === review.client_id);
        return {
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at,
          client: {
            first_name: client?.first_name || "Utilisateur",
            last_name: client?.last_name?.[0] || "",
          },
        };
      });

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

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
    return `Il y a ${Math.floor(diffDays / 365)} ans`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Vous devez être connecté pour laisser un avis");
      return;
    }

    if (!newReview.comment.trim()) {
      alert("Veuillez écrire un commentaire");
      return;
    }

    setSubmitting(true);

    try {
      const { error: insertError } = await supabase.from("reviews").insert({
        lawyer_id: lawyerId,
        client_id: user.id,
        rating: newReview.rating,
        comment: newReview.comment.trim(),
      });

      if (insertError) throw insertError;

      try {
        const reviewerName = user.user_metadata?.first_name
          ? `${user.user_metadata.first_name} ${
              user.user_metadata.last_name || ""
            }`
          : "Un client";

        await supabase.functions.invoke("send-notification", {
          body: {
            userId: lawyerId,
            title: "Nouvel avis reçu",
            message: `${reviewerName} a laissé un avis ${newReview.rating} étoiles sur votre profil.`,
            type: "email",
          },
        });
      } catch (notifError) {
        console.error("Erreur notification:", notifError);
      }

      setNewReview({ rating: 5, comment: "" });
      await loadReviews();
    } catch (error: any) {
      console.error("Erreur soumission avis:", error);
      alert(`Erreur: ${error.message || "Inconnue"}`);
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">
          Avis clients
          {reviews.length > 0 && (
            <span className="text-lg font-medium text-teal-700 ml-4">
              {averageRating.toFixed(1)}/5 · {reviews.length} avis
            </span>
          )}
        </h2>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <p className="text-slate-600 text-lg">Aucun avis pour le moment</p>
          <p className="text-sm text-slate-500 mt-2">
            Soyez le premier à laisser un avis
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <Quote className="w-6 h-6 text-teal-500 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 italic leading-relaxed line-clamp-4">
                    "{review.comment}"
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <div className="font-semibold text-slate-800 text-base">
                    {review.client.first_name} {review.client.last_name}.
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {formatDate(review.created_at)}
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-slate-300"
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
        <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-8 border border-teal-100 shadow-sm">
          <h3 className="text-2xl font-semibold text-slate-800 mb-6">
            Partagez votre expérience
          </h3>
          {!user ? (
            <p className="text-slate-600 text-base">
              Connectez-vous en tant que client pour laisser un avis.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-base font-medium text-slate-700">
                  Votre note :
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
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                rows={4}
                disabled={submitting}
                className="w-full py-4 px-5 text-base border border-slate-300 rounded-xl bg-white focus:border-2 hover:border-2 hover:border-teal-300 focus:border-teal-400 outline-none transition-all duration-200 text-slate-700 disabled:opacity-50 resize-none"
                placeholder="Décrivez votre expérience en quelques mots..."
                required
              />

              <button
                type="submit"
                disabled={submitting}
                className="cursor-pointer w-full sm:w-auto bg-teal-600 text-white px-8 py-3.5 rounded-xl hover:bg-teal-700 transition-all duration-200 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-100"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Envoi en cours...
                  </>
                ) : (
                  "Publier mon avis"
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
