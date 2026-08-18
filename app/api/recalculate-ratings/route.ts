import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { lawyerId } = await request.json();

    if (!lawyerId) {
      return NextResponse.json({ error: "lawyerId manquant" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: mizanReviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("rating")
      .eq("lawyer_id", lawyerId)
      .eq("source", "mizan");

    if (reviewsError) {
      console.error("Erreur récupération reviews:", reviewsError);
      return NextResponse.json(
        { error: "Erreur récupération avis" },
        { status: 500 }
      );
    }

    const reviews = mizanReviews || [];
    const mizanCount = reviews.length;
    const mizanAvg =
      mizanCount > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / mizanCount
        : 0;

    console.log("📊 Stats MIZAN calculées:", {
      mizanCount,
      mizanAvg: mizanAvg.toFixed(2),
    });

    const { error: updateError } = await supabase
      .from("lawyers")
      .update({
        rating_mizan: Number(mizanAvg.toFixed(2)),
        reviews_count_mizan: mizanCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", lawyerId);

    if (updateError) {
      console.error("Erreur mise à jour lawyers:", updateError);
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      stats: {
        rating_mizan: Number(mizanAvg.toFixed(2)),
        reviews_count_mizan: mizanCount,
      },
    });
  } catch (error: any) {
    console.error("❌ Erreur recalcul ratings:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
