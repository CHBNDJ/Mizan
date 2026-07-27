"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import FeedbackPopup from "@/components/FeedbackPopup";

export default function FeedbackTrigger() {
  const supabase = createClient();
  const { user, profile } = useAuth();
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (!user || !profile) return;
    let cancelled = false;
    (async () => {
      if (profile.user_type === "client") {
        const { data: pendingReview } = await supabase
          .from("pending_reviews")
          .select("id")
          .eq("client_id", user.id)
          .limit(1)
          .maybeSingle();
        if (pendingReview) return;
      }

      const { data: existingFeedback } = await supabase
        .from("platform_feedbacks")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();
      if (existingFeedback) return;

      const column = profile.user_type === "lawyer" ? "lawyer_id" : "client_id";
      const { count: consultCount } = await supabase
        .from("consultations")
        .select("*", { count: "exact", head: true })
        .eq(column, user.id);
      if ((consultCount || 0) === 0) return;

      setTimeout(() => {
        if (!cancelled) setShowFeedback(true);
      }, 8000);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, profile, supabase]);

  if (!showFeedback) return null;
  return <FeedbackPopup onClose={() => setShowFeedback(false)} />;
}
