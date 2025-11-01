import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    await resend.emails.send({
      from: "Mizan <noreply@mizan-dz.com>",
      to: email,
      subject: "✅ Votre compte avocat a été validé !",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0d9488;">🎉 Félicitations ${name} !</h1>
          
          <p>Votre compte avocat sur <strong>Mizan</strong> a été vérifié et activé.</p>
          
          <p>Vous pouvez maintenant :</p>
          <ul>
            <li>Accéder à votre tableau de bord</li>
            <li>Répondre aux consultations clients</li>
            <li>Gérer votre profil public</li>
          </ul>
          
          <a href="https://TON_DOMAINE.com/auth/lawyer/login" 
             style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
            Se connecter
          </a>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            Besoin d'aide ? Contactez-nous à support@mizan-dz.com
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur envoi email validation:", error);
    return NextResponse.json({ error: "Erreur envoi email" }, { status: 500 });
  }
}
