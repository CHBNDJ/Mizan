import { Resend } from "resend";
import { canSendEmail } from "./check-preferences";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLawyerNotification(params: {
  lawyerId: string;
  lawyerEmail: string;
  lawyerName: string;
  consultationId: string;
  question: string;
  clientName?: string;
}) {
  const { lawyerId, lawyerEmail, lawyerName, question, clientName } = params;

  const canSend = await canSendEmail(lawyerId);

  if (!canSend) {
    return { success: false, reason: "preferences_disabled" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Mizan <noreply@mizan-dz.com>",
      to: lawyerEmail,
      subject: "📩 Nouvelle consultation - Mizan",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0d9488;">Nouvelle consultation</h1>
          <p>Bonjour <strong>${lawyerName}</strong>,</p>
          <p>${clientName ? `<strong>${clientName}</strong>` : "Un client"} vous a posé une question :</p>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #1e293b;">"${question}"</p>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/lawyer/consultations"
             style="display: inline-block; background: #0d9488; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px;">
            Répondre
          </a>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 13px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color: #0d9488;">
              Gérer mes notifications
            </a>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Erreur envoi email Resend:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Erreur envoi notification avocat:", error);
    return { success: false, error };
  }
}
