import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, code, lawyerName } = await request.json();

    // Envoyer le code de vérification par email
    const { data, error } = await resend.emails.send({
      from: "Mizan <noreply@mizan-dz.com>",
      to: email,
      subject: "🔐 Votre code de vérification Mizan",
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px;">
              <h1 style="color: #0d9488; text-align: center;">🔐 Code de Vérification</h1>
              
              <p style="font-size: 16px;">Bonjour <strong>${lawyerName}</strong>,</p>
              
              <p>Vous avez demandé à réclamer votre profil sur Mizan.</p>
              
              <div style="background: #f1f5f9; border: 2px dashed #0d9488; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                <p style="margin: 0; color: #64748b; font-size: 14px;">Votre code de vérification :</p>
                <h2 style="margin: 10px 0; font-size: 36px; color: #0d9488; letter-spacing: 10px;">${code}</h2>
              </div>
              
              <p style="color: #64748b; font-size: 14px;">
                ⏱️ Ce code expire dans <strong>10 minutes</strong>.
              </p>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b;">
                Si vous n'avez pas demandé ce code, ignorez cet email.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Erreur envoi code vérification:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur envoi code vérification:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
