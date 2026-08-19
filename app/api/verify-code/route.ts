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

const verifyRateLimit = new Map<string, { count: number; resetAt: number }>();
const VERIFY_WINDOW_MS = 15 * 60 * 1000;
const VERIFY_MAX = 5;

function checkVerifyLimit(key: string): boolean {
  const now = Date.now();
  const entry = verifyRateLimit.get(key);
  if (!entry || now > entry.resetAt) {
    verifyRateLimit.set(key, { count: 1, resetAt: now + VERIFY_WINDOW_MS });
    return true;
  }
  if (entry.count >= VERIFY_MAX) return false;
  entry.count += 1;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of verifyRateLimit.entries()) {
    if (now > entry.resetAt) verifyRateLimit.delete(key);
  }
}, 5 * 60 * 1000);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    const { code, userType } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email et code requis" },
        { status: 400 }
      );
    }

    const ip =
      (request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
    if (!checkVerifyLimit(`${ip}:${email}`)) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans 15 minutes." },
        { status: 429 }
      );
    }

    const { data: verificationData, error: fetchError } = await supabaseAdmin
      .from("email_verifications")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError || !verificationData) {
      return NextResponse.json(
        { error: "Code introuvable ou expiré" },
        { status: 404 }
      );
    }

    const expiresAt = new Date(verificationData.expires_at);
    if (expiresAt < new Date()) {
      await supabaseAdmin
        .from("email_verifications")
        .delete()
        .eq("email", email);

      return NextResponse.json(
        { error: "Le code a expiré. Demandez un nouveau code." },
        { status: 400 }
      );
    }

    if (verificationData.code !== code) {
      return NextResponse.json({ error: "Code invalide" }, { status: 400 });
    }

    const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
    const user = userData?.users.find((u) => u.email?.toLowerCase() === email);

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        email_confirm: true,
      });

    if (updateError) {
      return NextResponse.json(
        { error: "Erreur lors de la vérification" },
        { status: 500 }
      );
    }

    await supabaseAdmin.from("email_verifications").delete().eq("email", email);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/notify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
        },
        body: JSON.stringify({
          subject: `Nouvel utilisateur ${userType} vérifié`,
          title: "Nouveau compte vérifié",
          message: `
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Type :</strong> ${userType}</p>
            <p><strong>Date :</strong> ${new Date().toLocaleString("fr-FR")}</p>
          `,
          priority: "normal",
        }),
      });
    } catch (notifyError) {}

    const redirectPath = userType === "lawyer" ? "/lawyer/onboarding" : "/";

    return NextResponse.json({
      success: true,
      message: "Email vérifié",
      redirectPath,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
