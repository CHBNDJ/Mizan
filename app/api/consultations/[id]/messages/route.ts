import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: consultationId } = await params;

    const { message, attachment_url, attachment_type, attachment_name } =
      await request.json();

    // Validation du message ou pièce jointe
    if (!message?.trim() && !attachment_url) {
      return NextResponse.json(
        { error: "Message ou pièce jointe requis" },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur connecté
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier le type d'utilisateur
    const { data: userData } = await supabase
      .from("users")
      .select("user_type, first_name, last_name")
      .eq("id", user.id)
      .single();

    if (!userData) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const senderType = userData.user_type === "lawyer" ? "lawyer" : "client";

    // Vérifier que la consultation existe
    const { data: consultation, error: consultationError } = await supabase
      .from("consultations")
      .select("id, client_id, lawyer_id, question")
      .eq("id", consultationId)
      .single();

    if (consultationError || !consultation) {
      console.error("Consultation non trouvée:", consultationError);
      return NextResponse.json(
        { error: "Consultation non trouvée" },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est autorisé
    const isAuthorized =
      user.id === consultation.client_id || user.id === consultation.lawyer_id;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Non autorisé pour cette consultation" },
        { status: 403 }
      );
    }

    // Créer le message
    const { data: newMessage, error: insertError } = await supabase
      .from("consultation_messages")
      .insert({
        consultation_id: consultationId,
        sender_id: user.id,
        sender_type: senderType,
        message: message?.trim() || "(Fichier joint)",
        is_read: false,
        attachment_url,
        attachment_type,
        attachment_name,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Erreur création message:", insertError);
      throw insertError;
    }

    // Si c'est l'avocat qui répond, changer le statut
    if (senderType === "lawyer") {
      const { data: consultationStatus } = await supabase
        .from("consultations")
        .select("status")
        .eq("id", consultationId)
        .single();

      // Changer de "pending" à "answered" si c'est la première réponse
      if (consultationStatus?.status === "pending") {
        await supabase
          .from("consultations")
          .update({
            status: "answered",
            answered_at: new Date().toISOString(),
          })
          .eq("id", consultationId);
      }
    }

    // Envoyer email au destinataire
    try {
      const recipientId =
        senderType === "lawyer"
          ? consultation.client_id
          : consultation.lawyer_id;

      const { data: recipient } = await supabase
        .from("users")
        .select("email, first_name, last_name, user_type")
        .eq("id", recipientId)
        .single();

      if (recipient) {
        // Vérifier les préférences de notification
        const { data: recipientPrefs } = await supabase
          .from("user_preferences")
          .select("email_notifications")
          .eq("user_id", recipientId)
          .maybeSingle();

        const shouldSendEmail =
          !recipientPrefs || recipientPrefs.email_notifications !== false;

        if (shouldSendEmail) {
          const senderName =
            senderType === "lawyer"
              ? `Me. ${userData.first_name} ${userData.last_name}`
              : `${userData.first_name} ${userData.last_name}`;

          const recipientName =
            recipient.user_type === "lawyer"
              ? `Me. ${recipient.first_name} ${recipient.last_name}`
              : `${recipient.first_name} ${recipient.last_name}`;

          await resend.emails.send({
            from: "Mizan <noreply@mizan-dz.com>",
            to: recipient.email,
            subject: `💬 Nouveau message de ${senderName}`,
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8">
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
                  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px;">
                    <h1 style="color: #0d9488; margin-bottom: 20px;">💬 Nouveau message</h1>
                    
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                      Bonjour <strong>${recipientName}</strong>,
                    </p>
                    
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                      <strong>${senderName}</strong> vous a envoyé un message :
                    </p>
                    
                    <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                      <p style="color: #1e293b; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message?.trim() || "📎 Fichier joint"}</p>
                    </div>
                    
                    ${
                      attachment_url
                        ? `<p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">📎 Un fichier est joint à ce message</p>`
                        : ""
                    }
                    
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/${recipient.user_type === "lawyer" ? "lawyer/consultations" : "mes-consultations"}"
                       style="display: inline-block; background-color: #0d9488; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: 600;">
                      Voir le message
                    </a>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                    
                    <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
                      Vous recevez cet email car vous avez une conversation active sur Mizan.
                      <br>
                      <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" 
                         style="color: #0d9488; text-decoration: none;">
                        Gérer mes préférences de notifications
                      </a>
                    </p>
                  </div>
                </body>
              </html>
            `,
          });
        }
      }
    } catch (emailError) {
      console.error("Erreur envoi email destinataire:", emailError);
    }

    // Notification admin (toujours envoyée)
    try {
      const { data: clientData } = await supabase
        .from("users")
        .select("email, first_name, last_name")
        .eq("id", consultation.client_id)
        .single();

      const { data: lawyerData } = await supabase
        .from("users")
        .select("email, first_name, last_name")
        .eq("id", consultation.lawyer_id)
        .single();

      const senderName =
        senderType === "lawyer"
          ? `Me. ${userData.first_name} ${userData.last_name}`
          : `${userData.first_name} ${userData.last_name}`;

      await resend.emails.send({
        from: "Mizan System <noreply@mizan-dz.com>",
        to: "admin@mizan-dz.com",
        subject: `💬 Nouveau message dans une consultation`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
            </head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #0d9488;">💬 Nouveau message dans une consultation</h2>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Envoyé par :</strong> ${senderName} (${senderType === "lawyer" ? "Avocat" : "Client"})</p>
                <p><strong>Client :</strong> ${clientData?.first_name || "N/A"} ${clientData?.last_name || "N/A"}</p>
                <p><strong>Email client :</strong> ${clientData?.email || "N/A"}</p>
                <p><strong>Avocat :</strong> Me. ${lawyerData?.first_name || "N/A"} ${lawyerData?.last_name || "N/A"}</p>
                <p><strong>Email avocat :</strong> ${lawyerData?.email || "N/A"}</p>
                <p><strong>Date :</strong> ${new Date().toLocaleString("fr-FR")}</p>
              </div>
              
              <h3>Question initiale :</h3>
              <div style="background: #f1f5f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <p style="white-space: pre-wrap;">${consultation.question || "N/A"}</p>
              </div>
              
              <h3>Nouveau message :</h3>
              <div style="background: #ecfdf5; padding: 15px; border-radius: 5px; border-left: 4px solid #0d9488;">
                <p style="white-space: pre-wrap;">${message?.trim() || "📎 Fichier joint"}</p>
              </div>
              
              ${
                attachment_url
                  ? `<p style="margin-top: 15px; color: #64748b;">📎 <a href="${attachment_url}" style="color: #0d9488;">Voir le fichier joint</a></p>`
                  : ""
              }
              
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

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error: any) {
    console.error("Erreur création message:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
