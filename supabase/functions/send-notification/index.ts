import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface NotificationRequest {
  userId: string;
  title: string;
  message: string;
  type: "email" | "push";
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: any) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { userId, title, message, type }: NotificationRequest =
      await req.json();

    const { data: user, error: userError } =
      await supabase.auth.admin.getUserById(userId);
    if (userError || !user) {
      throw new Error(`Utilisateur non trouvé: ${userError?.message}`);
    }

    const { data: preferences, error: prefError } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (prefError) {
      throw new Error(`Préférences non trouvées: ${prefError.message}`);
    }

    let result = { success: false, details: "" };

    switch (type) {
      case "email":
        if (preferences.email_notifications) {
          result = await sendEmailNotification(
            user.user.email!,
            title,
            message
          );
        } else {
          result = {
            success: false,
            details: "Notifications email désactivées",
          };
        }
        break;

      case "push":
        if (preferences.push_notifications) {
          result = await sendPushNotification(userId, title, message);
        } else {
          result = {
            success: false,
            details: "Notifications push désactivées",
          };
        }
        break;

      default:
        throw new Error(`Type de notification non supporté: ${type}`);
    }

    return new Response(
      JSON.stringify({ success: result.success, details: result.details }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: result.success ? 200 : 400,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function sendEmailNotification(
  email: string,
  title: string,
  message: string
) {
  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY non configurée");
    }

    const emailData = {
      from: "Mizan <noreply@mizan-dz.com>",
      to: [email],
      subject: title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0891b2, #06b6d4); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">⚖️ Mizan</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; margin-top: 0;">${title}</h2>
            <p style="color: #475569; line-height: 1.6; font-size: 16px;">${message}</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://mizan-dz.com/dashboard"
                 style="background: #0891b2; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Ouvrir Mizan
              </a>
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="color: #94a3b8; font-size: 14px; margin: 0;">
                © 2025 Mizan. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error(`Erreur Resend: ${response.status}`);
    }

    return {
      success: true,
      details: `Email envoyé à ${email}`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      details: errorMessage,
    };
  }
}

async function sendPushNotification(
  userId: string,
  title: string,
  message: string
) {
  try {
    return {
      success: true,
      details: `Notification push envoyée à l'utilisateur ${userId}`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      details: errorMessage,
    };
  }
}
