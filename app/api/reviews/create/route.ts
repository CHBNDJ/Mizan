import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { lawyerId, clientId, rating, comment } = await req.json();

    if (!lawyerId || !clientId || !rating) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    if (user.id !== clientId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json({ error: "Note invalide" }, { status: 400 });
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

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Erreur reviews/create:", e);
    return NextResponse.json(
      { error: "internal", detail: e?.message },
      { status: 500 }
    );
  }
}
