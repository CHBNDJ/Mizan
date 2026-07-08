import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: NextRequest) {
  try {
    const { consultationId, userId } = await req.json();

    if (!consultationId || !userId) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const { data: consult, error } = await supabaseAdmin
      .from("consultations")
      .select(
        "*, lawyer:lawyer_id(first_name, last_name, profession), client:client_id(first_name, last_name)"
      )
      .eq("id", consultationId)
      .maybeSingle();

    if (error || !consult) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    if (userId !== consult.client_id && userId !== consult.lawyer_id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ consultation: consult });
  } catch (e) {
    console.error("Erreur get-consultation:", e);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
