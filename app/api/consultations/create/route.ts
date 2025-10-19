import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validation des données
    if (!body.lawyer_id || !body.client_id || !body.question) {
      return NextResponse.json(
        { success: false, error: "Données manquantes" },
        { status: 400 }
      );
    }

    // Vérifier l'utilisateur connecté
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Créer la consultation
    const { data: consultation, error: insertError } = await supabase
      .from("consultations")
      .insert({
        client_id: body.client_id,
        lawyer_id: body.lawyer_id,
        question: body.question.trim(),
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Erreur création consultation:", insertError);
      throw insertError;
    }

    // Créer le message initial avec la question du client
    const { error: messageError } = await supabase
      .from("consultation_messages")
      .insert({
        consultation_id: consultation.id,
        sender_id: body.client_id,
        sender_type: "client",
        message: body.question.trim(),
        is_read: false,
      });

    if (messageError) {
      console.error("Erreur création message:", messageError);
    }

    // Vérifier les préférences de notification de l'avocat
    const { data: lawyerPrefs } = await supabase
      .from("user_preferences")
      .select("email_notifications")
      .eq("user_id", body.lawyer_id)
      .maybeSingle();

    const shouldSendEmail = lawyerPrefs?.email_notifications === true;

    if (shouldSendEmail) {
      // Récupérer les informations de l'avocat et du client
      const { data: lawyer } = await supabase
        .from("users")
        .select("first_name, last_name, email")
        .eq("id", body.lawyer_id)
        .single();

      const { data: client } = await supabase
        .from("users")
        .select("first_name, last_name")
        .eq("id", body.client_id)
        .single();

      if (lawyer) {
        try {
          // Envoyer email de notification à l'avocat
          await resend.emails.send({
            from: "Mizan <noreply@mizan-dz.com>",
            to: lawyer.email,
            subject: "📩 Nouvelle consultation - Mizan",
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8">
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
                  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px;">
                    <h1 style="color: #0d9488; margin-bottom: 20px;">Nouvelle consultation</h1>
                    
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                      Bonjour <strong>Me. ${lawyer.first_name} ${lawyer.last_name}</strong>,
                    </p>
                    
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                      ${client ? `<strong>${client.first_name} ${client.last_name}</strong>` : "Un client"} vous a posé une question :
                    </p>
                    
                    <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                      <p style="color: #1e293b; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">"${body.question}"</p>
                    </div>
                    
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/lawyer/consultations"
                       style="display: inline-block; background-color: #0d9488; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin-top: 20px; font-weight: 600;">
                      Répondre à la consultation
                    </a>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                    
                    <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
                      Vous recevez cet email car vous avez un compte avocat sur Mizan.
                      <br>
                      <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" 
                         style="color: #0d9488; text-decoration: none;">
                        Gérer mes préférences de notifications
                      </a>
                    </p>
                    
                    <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
                      Une question ? Contactez-nous à 
                      <a href="mailto:avocat@mizan-dz.com" style="color: #0d9488;">avocat@mizan-dz.com</a>
                    </p>
                  </div>
                </body>
              </html>
            `,
          });
        } catch (emailError) {
          console.error("Erreur envoi email avocat:", emailError);
        }
      }
    }

    // Notification admin (toujours envoyée)
    try {
      const { data: clientData } = await supabase
        .from("users")
        .select("email, first_name, last_name")
        .eq("id", body.client_id)
        .single();

      const { data: lawyerData } = await supabase
        .from("users")
        .select("email, first_name, last_name")
        .eq("id", body.lawyer_id)
        .single();

      await resend.emails.send({
        from: "Mizan System <noreply@mizan-dz.com>",
        to: "admin@mizan-dz.com",
        subject: "🔔 Nouvelle consultation créée",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
            </head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #0d9488;">📩 Nouvelle consultation créée</h2>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Client :</strong> ${clientData?.first_name} ${clientData?.last_name}</p>
                <p><strong>Email client :</strong> ${clientData?.email}</p>
                <p><strong>Avocat :</strong> Me. ${lawyerData?.first_name} ${lawyerData?.last_name}</p>
                <p><strong>Email avocat :</strong> ${lawyerData?.email}</p>
                <p><strong>Date :</strong> ${new Date().toLocaleString("fr-FR")}</p>
              </div>
              
              <h3>Question :</h3>
              <div style="background: #f1f5f9; padding: 15px; border-radius: 5px;">
                <p style="white-space: pre-wrap;">${body.question}</p>
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

    return NextResponse.json({ success: true, consultation });
  } catch (error: unknown) {
    console.error("Erreur création consultation:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
