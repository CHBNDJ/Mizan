import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendClientResponseNotification } from "@/lib/email/client-notifications";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { consultationId, response } = await request.json();
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

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

    const { data: consultation, error: fetchError } = await supabase
      .from("consultations")
      .select("*")
      .eq("id", consultationId)
      .single();

    if (fetchError || !consultation) {
      console.error("Erreur récupération consultation:", fetchError);
      throw fetchError;
    }

    const { data: clientData } = await supabase
      .from("users")
      .select("email, first_name, last_name")
      .eq("id", consultation.client_id)
      .eq("user_type", "client")
      .single();

    const { data: lawyerData } = await supabase
      .from("users")
      .select("first_name, last_name")
      .eq("id", user.id)
      .eq("user_type", "lawyer")
      .single();

    let emailSentToClient = false;

    if (clientData && lawyerData) {
      const { data: clientPrefs } = await supabase
        .from("user_preferences")
        .select("email_notifications")
        .eq("user_id", consultation.client_id)
        .maybeSingle();

      const shouldSendEmail =
        !clientPrefs || clientPrefs.email_notifications !== false;

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
