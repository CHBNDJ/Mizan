import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, lawyerId } = await request.json();

    if (!email || !lawyerId) {
      return NextResponse.json(
        { error: "Email et ID avocat requis" },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    const { data: lawyer, error: lawyerError } = await supabase
      .from("users")
      .select("*, lawyers(*)")
      .eq("id", lawyerId)
      .single();

    if (lawyerError || !lawyer || !lawyer.lawyers) {
      return NextResponse.json(
        { error: "Profil introuvable" },
        { status: 404 }
      );
    }

    if (lawyer.lawyers.is_claimed) {
      return NextResponse.json(
        { error: "Ce profil a déjà été réclamé" },
        { status: 400 }
      );
    }

    if (lawyer.professional_email !== email) {
      return NextResponse.json(
        { error: "Cet email ne correspond pas au profil" },
        { status: 400 }
      );
    }

    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const { data: recentCodes } = await supabase
      .from("claim_verification_codes")
      .select("id")
      .eq("lawyer_id", lawyerId)
      .eq("email", email)
      .gte("created_at", oneHourAgo);

    if (recentCodes && recentCodes.length >= 3) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans 1 heure." },
        { status: 429 }
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 15 * 60000).toISOString();

    const { error: insertError } = await supabase
      .from("claim_verification_codes")
      .insert({
        lawyer_id: lawyerId,
        email: email,
        code: code,
        expires_at: expiresAt,
        attempts: 0,
        used: false,
      });

    if (insertError) {
      console.error("Erreur insertion code:", insertError);
      return NextResponse.json(
        { error: "Erreur lors de la génération du code" },
        { status: 500 }
      );
    }

    try {
      const { error: emailError } = await resend.emails.send({
        from: "MIZAN <noreply@mizan-dz.com>",
        to: email,
        subject: "🔐 Code de vérification - Réclamation de profil MIZAN",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px;">
              <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0;">🔐 Code de Vérification</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Réclamation de votre profil MIZAN</p>
              </div>
              
              <div style="padding: 30px;">
                <p>Bonjour <strong>${lawyer.first_name} ${lawyer.last_name}</strong>,</p>
                
                <p>Vous avez demandé à réclamer votre profil d'avocat sur <strong>MIZAN</strong>.</p>
                
                <div style="background: white; border: 3px dashed #0d9488; border-radius: 10px; padding: 30px; text-align: center; margin: 20px 0;">
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Votre code de vérification :</p>
                  <div style="font-size: 48px; font-weight: bold; color: #0d9488; letter-spacing: 8px; font-family: 'Courier New', monospace;">${code}</div>
                  <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px;">
                    ⏱️ Ce code est valable pendant <strong>15 minutes</strong>
                  </p>
                </div>
                
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #92400e;">
                    <strong>⚠️ Attention :</strong> Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
                  </p>
                </div>
                
                <p>Après avoir entré ce code, vous pourrez :</p>
                <ul>
                  <li>✅ Gérer votre profil professionnel</li>
                  <li>✅ Recevoir et gérer vos consultations</li>
                  <li>✅ Interagir avec vos clients</li>
                </ul>
                
                <div style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
                  <p>Cet email a été envoyé par <strong>MIZAN</strong></p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      if (emailError) {
        console.error("Erreur envoi email:", emailError);
        await supabase
          .from("claim_verification_codes")
          .delete()
          .eq("lawyer_id", lawyerId)
          .eq("code", code);

        return NextResponse.json(
          { error: "Erreur lors de l'envoi de l'email" },
          { status: 500 }
        );
      }
    } catch (emailError: any) {
      console.error("Erreur envoi email:", emailError);
      await supabase
        .from("claim_verification_codes")
        .delete()
        .eq("lawyer_id", lawyerId)
        .eq("code", code);

      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Code envoyé avec succès",
      expiresIn: 15,
    });
  } catch (error: any) {
    console.error("Erreur send-claim-code:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
