"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import FeedbackPopup from "@/components/FeedbackPopup";

export default function FeedbackTrigger() {
  const supabase = createClient();
  const { user, profile } = useAuth();
  const pathname = usePathname();
  const [showFeedback, setShowFeedback] = useState(false);

  const isBlockedPage =
    /\/lawyers\//.test(pathname) ||
    /\/mes-consultations/.test(pathname) ||
    /\/lawyer\/consultations/.test(pathname);

  useEffect(() => {
    if (!user || !profile) return;
    if (isBlockedPage) return;
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

      let eligible = false;

      if (profile.user_type === "lawyer") {
        const { count: sentCount } = await supabase
          .from("consultation_messages")
          .select("*", { count: "exact", head: true })
          .eq("sender_id", user.id)
          .eq("sender_type", "lawyer");
        eligible = (sentCount || 0) > 0;
      } else {
        const { data: myConsults } = await supabase
          .from("consultations")
          .select("id")
          .eq("client_id", user.id);
        const ids = (myConsults || []).map((c) => c.id);
        if (ids.length > 0) {
          const { count: lawyerReplies } = await supabase
            .from("consultation_messages")
            .select("*", { count: "exact", head: true })
            .in("consultation_id", ids)
            .eq("sender_type", "lawyer");
          eligible = (lawyerReplies || 0) > 0;
        }
      }

      if (!eligible) return;

      setTimeout(() => {
        if (!cancelled && !isBlockedPage) setShowFeedback(true);
      }, 8000);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, profile, supabase, isBlockedPage, pathname]);

  if (!showFeedback) return null;
  return <FeedbackPopup onClose={() => setShowFeedback(false)} />;
}
