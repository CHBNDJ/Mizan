import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: NextRequest) {
  try {
    const { lawyerId, clientId, rating, comment } = await req.json();

    if (!lawyerId || !clientId || !rating) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("reviews").insert({
      lawyer_id: lawyerId,
      client_id: clientId,
      rating,
      comment: comment || null,
      source: "mizan",
    });

    if (error) {
      console.error("Erreur insertion avis:", error);
      return NextResponse.json(
        { error: "insert_failed", detail: error.message },
        { status: 500 }
      );
    }

    // Recalculer la note moyenne de l'avocat
    try {
      const { data: allReviews } = await supabaseAdmin
        .from("reviews")
        .select("rating")
        .eq("lawyer_id", lawyerId)
        .eq("source", "mizan");

      if (allReviews && allReviews.length > 0) {
        const avg =
          allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
        await supabaseAdmin
          .from("lawyers")
          .update({
            rating_mizan: Math.round(avg * 10) / 10,
            reviews_count_mizan: allReviews.length,
          })
          .eq("id", lawyerId);
      }
    } catch (e) {
      console.error("Erreur recalcul:", e);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Erreur reviews/create:", e);
    return NextResponse.json(
      { error: "internal", detail: e?.message },
      { status: 500 }
    );
  }
}
