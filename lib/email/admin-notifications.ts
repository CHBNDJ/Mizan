import { resend, EMAIL_CONFIG } from "./config";

type Priority = "normal" | "high" | "urgent";

interface AdminNotificationParams {
  subject: string;
  title: string;
  message: string;
  priority?: Priority;
}

const priorityColors = {
  normal: "#0d9488",
  high: "#f59e0b",
  urgent: "#ef4444",
};

const priorityEmojis = {
  normal: "ℹ️",
  high: "⚠️",
  urgent: "🚨",
};

export async function sendAdminNotification({
  subject,
  title,
  message,
  priority = "normal",
}: AdminNotificationParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: EMAIL_CONFIG.adminEmail,
      subject: `${priorityEmojis[priority]} ${subject}`,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-left: 4px solid ${priorityColors[priority]};">
              
              <div style="background: ${priorityColors[priority]}; padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">
                  ${priorityEmojis[priority]} ${title}
                </h1>
              </div>
              
              <div style="padding: 40px 30px;">
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  ${message}
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${EMAIL_CONFIG.baseUrl}/admin" 
                     style="display: inline-block; padding: 14px 28px; background: ${priorityColors[priority]}; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    🔧 Tableau de bord admin
                  </a>
                </div>
              </div>
              
              <div style="background: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0; text-align: center;">
                  📅 ${new Date().toLocaleString("fr-FR", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("❌ Erreur Resend (admin):", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi à l'admin:", error);
    return { success: false, error };
  }
}
