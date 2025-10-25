import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { email, firstName, userType } = await request.json();

    if (!email || !userType) {
      return NextResponse.json(
        { error: "Email et type requis" },
        { status: 400 }
      );
    }

    // Générer code 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Supprimer ancien code si existe
    await supabaseAdmin.from("email_verifications").delete().eq("email", email);

    // Insérer nouveau code
    const { error: insertError } = await supabaseAdmin
      .from("email_verifications")
      .insert({
        email: email,
        code: code,
        user_type: userType,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("Erreur insertion code:", insertError);
      throw insertError;
    }

    // Envoyer email
    const { error: emailError } = await resend.emails.send({
      from: "Mizan <noreply@mizan-dz.com>",
      to: email,
      subject: "🔐 Votre code de vérification Mizan",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f0fdfa;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdfa; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

                    <tr>
                      <td style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                          🔐 Code de vérification
                        </h1>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px; color: #334155; font-size: 16px;">
                          Bonjour ${firstName || ""},
                        </p>

                        <p style="margin: 0 0 30px; color: #334155; font-size: 16px;">
                          Merci de vous être inscrit sur <strong>Mizan</strong> ! Pour finaliser la création de votre compte ${userType === "lawyer" ? "avocat" : "client"}, veuillez entrer le code ci-dessous :
                        </p>

                        <div style="background-color: #f0fdfa; border: 2px dashed #0d9488; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                          <p style="margin: 0 0 10px; color: #64748b; font-size: 14px; font-weight: 600;">
                            VOTRE CODE DE VÉRIFICATION
                          </p>
                          <p style="margin: 0; color: #0f172a; font-size: 42px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                            ${code}
                          </p>
                        </div>

                        <p style="margin: 0 0 20px; color: #334155; font-size: 14px;">
                          ⏱️ <strong>Ce code est valide pendant 15 minutes.</strong>
                        </p>

                        <p style="margin: 0; color: #64748b; font-size: 14px;">
                          Si vous n'avez pas demandé cette vérification, ignorez cet email.
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">
                          Besoin d'aide ?
                        </p>
                        <p style="margin: 0; color: #0d9488; font-size: 14px; font-weight: 600;">
                          <a href="mailto:support@mizan-dz.com" style="color: #0d9488; text-decoration: none;">
                            support@mizan-dz.com
                          </a>
                        </p>
                        <p style="margin: 20px 0 0; color: #94a3b8; font-size: 12px;">
                          © ${new Date().getFullYear()} Mizan
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (emailError) {
      console.error("Erreur envoi email:", emailError);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi du code" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur send-verification-code:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
