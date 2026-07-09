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

    // 1. Charger la consultation SANS jointure (robuste)
    const { data: consult, error } = await supabaseAdmin
      .from("consultations")
      .select("*")
      .eq("id", consultationId)
      .maybeSingle();

    if (error) {
      console.error("Erreur requête consultation:", error);
      return NextResponse.json(
        { error: "db_error", detail: error.message },
        { status: 500 }
      );
    }

    if (!consult) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    // 2. Vérifier l'accès
    if (userId !== consult.client_id && userId !== consult.lawyer_id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 403 });
    }

    // 3. Charger les noms client + avocat séparément
    const { data: lawyer } = await supabaseAdmin
      .from("users")
      .select("first_name, last_name")
      .eq("id", consult.lawyer_id)
      .maybeSingle();

    const { data: client } = await supabaseAdmin
      .from("users")
      .select("first_name, last_name")
      .eq("id", consult.client_id)
      .maybeSingle();

    const consultation = {
      ...consult,
      lawyer: lawyer || null,
      client: client || null,
    };

    return NextResponse.json({ consultation });
  } catch (e: any) {
    console.error("Erreur get-consultation:", e);
    return NextResponse.json(
      { error: "internal", detail: e?.message },
      { status: 500 }
    );
  }
}
