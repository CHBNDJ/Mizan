import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, userType } = body;

    console.log("📧 [API] Email:", email);
    console.log("👤 [API] Type:", userType);

    if (!email) {
      console.error("❌ [API] Email manquant");
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    console.log("🔍 [API] Récupération utilisateur...");
    const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
    const user = userData?.users.find((u) => u.email === email);
    const firstName = user?.user_metadata?.first_name || "";

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const response = await fetch(`${appUrl}/api/send-verification-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        firstName: firstName,
        userType: userType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ [API] Erreur send-verification-code:", errorData);
      throw new Error(errorData.error || "Erreur lors du renvoi du code");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ [API] Erreur globale:", error.message);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
