import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const lawyerId = payload.record?.id;
    const wasVerified = payload.old_record?.is_verified;
    const isNowVerified = payload.record?.is_verified;

    if (!lawyerId || wasVerified || !isNowVerified) {
      console.log("⏭️ Pas une validation, ignoré");
      return NextResponse.json({ message: "Ignoré" });
    }

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("email, first_name, last_name")
      .eq("id", lawyerId)
      .single();

    if (error || !user) {
      console.error("❌ Avocat non trouvé:", lawyerId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await resend.emails.send({
      from: "Mizan <noreply@mizan-dz.com>",
      to: user.email,
      subject: "✅ Votre compte avocat a été validé !",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0d9488;">🎉 Félicitations ${user.first_name} ${user.last_name} !</h1>
          
          <p>Votre compte avocat sur <strong>Mizan</strong> a été vérifié et activé.</p>
          
          <p>Vous pouvez maintenant :</p>
          <ul>
            <li>Accéder à votre tableau de bord</li>
            <li>Répondre aux consultations clients</li>
            <li>Gérer votre profil public</li>
          </ul>
          
          <a href="https://mizan-dz.com/auth/lawyer/login" 
             style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
            Se connecter
          </a>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            Besoin d'aide ? Contactez-nous à support@mizan-dz.com
          </p>
        </div>
      `,
    });

    console.log(`📧 Email envoyé à ${user.email}`);
    return NextResponse.json({ success: true, email: user.email });
  } catch (error: any) {
    console.error("❌ Erreur webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
