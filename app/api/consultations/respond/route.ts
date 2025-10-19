// app/api/consultations/respond/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendClientResponseNotification } from "@/lib/email/client-notifications";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { consultationId, response } = await request.json();
    const supabase = await createClient();

    // Récupérer l'utilisateur connecté (l'avocat)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Mettre à jour la consultation
    const { error: updateError } = await supabase
      .from("consultations")
      .update({
        response: response.trim(),
        status: "answered",
        answered_at: new Date().toISOString(),
      })
      .eq("id", consultationId)
      .eq("lawyer_id", user.id);

    if (updateError) {
      console.error("Erreur mise à jour consultation:", updateError);
      throw updateError;
    }

    // Récupérer les informations de la consultation
    const { data: consultation, error: fetchError } = await supabase
      .from("consultations")
      .select("*")
      .eq("id", consultationId)
      .single();

    if (fetchError || !consultation) {
      console.error("Erreur récupération consultation:", fetchError);
      throw fetchError;
    }

    // Récupérer les informations du client
    const { data: clientData } = await supabase
      .from("users")
      .select("email, first_name, last_name")
      .eq("id", consultation.client_id)
      .eq("user_type", "client")
      .single();

    // Récupérer les informations de l'avocat
    const { data: lawyerData } = await supabase
      .from("users")
      .select("first_name, last_name")
      .eq("id", user.id)
      .eq("user_type", "lawyer")
      .single();

    // Envoyer email au client (si préférences activées)
    let emailSentToClient = false;

    if (clientData && lawyerData) {
      // Vérifier les préférences de notification du client
      const { data: clientPrefs } = await supabase
        .from("user_preferences")
        .select("email_notifications")
        .eq("user_id", consultation.client_id)
        .maybeSingle();

      const shouldSendEmail =
        clientPrefs && clientPrefs.email_notifications === true;

      if (shouldSendEmail) {
        try {
          await sendClientResponseNotification({
            clientEmail: clientData.email,
            clientName: `${clientData.first_name} ${clientData.last_name}`,
            lawyerName: `Me. ${lawyerData.first_name} ${lawyerData.last_name}`,
            response: response.trim(),
            consultationId: consultation.id,
          });

          emailSentToClient = true;
        } catch (emailError) {
          console.error("Erreur envoi email client:", emailError);
        }
      }
    }

    // Notification admin (toujours envoyée)
    try {
      // Récupérer les données si manquantes
      let clientInfo = clientData;
      let lawyerInfo = lawyerData;

      if (!clientInfo) {
        const { data } = await supabase
          .from("users")
          .select("email, first_name, last_name")
          .eq("id", consultation.client_id)
          .single();
        clientInfo = data;
      }

      if (!lawyerInfo) {
        const { data } = await supabase
          .from("users")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single();
        lawyerInfo = data;
      }

      await resend.emails.send({
        from: "Mizan System <noreply@mizan-dz.com>",
        to: "admin@mizan-dz.com",
        subject: "✅ Consultation répondue",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
            </head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #0d9488;">✅ Réponse envoyée par un avocat</h2>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Avocat :</strong> Me. ${lawyerInfo?.first_name || "N/A"} ${lawyerInfo?.last_name || "N/A"}</p>
                <p><strong>Client :</strong> ${clientInfo?.first_name || "N/A"} ${clientInfo?.last_name || "N/A"}</p>
                <p><strong>Email client :</strong> ${clientInfo?.email || "N/A"}</p>
                <p><strong>Date :</strong> ${new Date().toLocaleString("fr-FR")}</p>
              </div>
              
              <h3>Question du client :</h3>
              <div style="background: #f1f5f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <p style="white-space: pre-wrap;">${consultation.question || "N/A"}</p>
              </div>
              
              <h3>Réponse de l'avocat :</h3>
              <div style="background: #ecfdf5; padding: 15px; border-radius: 5px; border-left: 4px solid #0d9488;">
                <p style="white-space: pre-wrap;">${response}</p>
              </div>
              
              <p style="margin-top: 20px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/lawyer/consultations" 
                   style="color: #0d9488;">
                  Voir la consultation
                </a>
              </p>
            </body>
          </html>
        `,
      });
    } catch (adminError) {
      console.error("Erreur notification admin:", adminError);
    }

    return NextResponse.json({ success: true, emailSent: emailSentToClient });
  } catch (error: any) {
    console.error("Erreur réponse consultation:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erreur lors de l'envoi de la réponse",
      },
      { status: 500 }
    );
  }
}
