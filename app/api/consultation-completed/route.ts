import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createSessionClient } from "@/lib/supabase/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSessionClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { consultationId } = await request.json();

    if (!consultationId) {
      return NextResponse.json(
        { error: "consultationId requis" },
        { status: 400 }
      );
    }

    const { data: consultation, error } = await supabaseAdmin
      .from("consultations")
      .select("id, client_id, lawyer_id, status")
      .eq("id", consultationId)
      .single();

    if (error || !consultation) {
      return NextResponse.json(
        { error: "Consultation introuvable" },
        { status: 404 }
      );
    }

    if (
      user.id !== consultation.client_id &&
      user.id !== consultation.lawyer_id
    ) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await supabaseAdmin.from("pending_reviews").upsert(
      {
        client_id: consultation.client_id,
        lawyer_id: consultation.lawyer_id,
        consultation_id: consultationId,
      },
      { onConflict: "client_id,consultation_id", ignoreDuplicates: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur consultation-completed:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
