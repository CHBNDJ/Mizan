// lib/email/client-notifications.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendClientResponseNotification(params: {
  clientEmail: string;
  clientName: string;
  lawyerName: string;
  response: string;
  consultationId: string;
}) {
  const { clientEmail, clientName, lawyerName, response, consultationId } =
    params;

  // ❌ PAS de vérification de préférences ici !
  // La vérification est faite dans l'API route AVANT d'appeler cette fonction

  try {
    const { data, error } = await resend.emails.send({
      from: "Mizan <noreply@mizan-dz.com>",
      to: clientEmail,
      subject: "✅ Réponse à votre consultation - Mizan",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
          </head>
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px;">
              <h1 style="color: #0d9488; margin-bottom: 20px;">Réponse à votre consultation</h1>
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                Bonjour <strong>${clientName}</strong>,
              </p>
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                <strong>${lawyerName}</strong> a répondu à votre question :
              </p>
              
              <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0d9488;">
                <p style="color: #1e293b; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${response}</p>
              </div>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/mes-consultations"
                 style="display: inline-block; background-color: #0d9488; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: 600;">
                Voir la consultation complète
              </a>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              
              <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
                Vous recevez cet email car vous avez posé une question sur Mizan.
                <br>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" 
                   style="color: #0d9488; text-decoration: none;">
                  Gérer mes préférences de notifications
                </a>
              </p>
              
              <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
                Une question ? Contactez-nous à 
                <a href="mailto:support@mizan-dz.com" style="color: #0d9488;">support@mizan-dz.com</a>
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("❌ [CLIENT EMAIL] Erreur:", error);
      throw error;
    }

    console.log("✅ [CLIENT EMAIL] Email envoyé");
    return { success: true, data };
  } catch (error) {
    console.error("❌ [CLIENT EMAIL] Erreur inattendue:", error);
    throw error;
  }
}
