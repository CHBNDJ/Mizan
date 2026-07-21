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
    const {
      message,
      attachment_url,
      attachment_type,
      attachment_name,
      system_key,
      system_params,
    } = await request.json();

    if (!message?.trim() && !attachment_url && !system_key) {
      return NextResponse.json(
        { error: "Message ou pièce jointe requis" },
        { status: 400 }
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data: userData } = await supabase
      .from("users")
      .select("user_type, first_name, last_name")
      .eq("id", user.id)
      .single();

    if (!userData)
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );

    const senderType = userData.user_type === "client" ? "client" : "lawyer";

    const { data: consultation, error: consultationError } = await supabase
      .from("consultations")
      .select("id, client_id, lawyer_id, question")
      .eq("id", consultationId)
      .single();

    if (consultationError || !consultation) {
      return NextResponse.json(
        { error: "Consultation non trouvée" },
        { status: 404 }
      );
    }

    const isAuthorized =
      user.id === consultation.client_id || user.id === consultation.lawyer_id;
    if (!isAuthorized)
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

    const { data: newMessage, error: insertError } = await supabase
      .from("consultation_messages")
      .insert({
        consultation_id: consultationId,
        sender_id: user.id,
        sender_type: senderType,
        message: message?.trim() || (system_key ? "" : "(Fichier joint)"),
        is_read: false,
        attachment_url,
        attachment_type,
        attachment_name,
        system_key: system_key || null,
        system_params: system_params || null,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    {
      const { data: consultationStatus } = await supabase
        .from("consultations")
        .select("status")
        .eq("id", consultationId)
        .single();

      if (senderType === "lawyer" && consultationStatus?.status === "pending") {
        await supabase
          .from("consultations")
          .update({ status: "answered", answered_at: new Date().toISOString() })
          .eq("id", consultationId);
      } else if (
        senderType === "client" &&
        consultationStatus?.status === "answered"
      ) {
        await supabase
          .from("consultations")
          .update({ status: "pending" })
          .eq("id", consultationId);
      }
    }

    try {
      const recipientId =
        senderType === "lawyer"
          ? consultation.client_id
          : consultation.lawyer_id;
      const { data: recipient } = await supabase
        .from("users")
        .select("email, first_name, last_name, user_type, preferred_locale")
        .eq("id", recipientId)
        .single();

      if (recipient) {
        const rlocale = ["fr", "ar", "en"].includes(recipient.preferred_locale)
          ? recipient.preferred_locale
          : "fr";

        const EMAIL_STRINGS: Record<string, Record<string, string>> = {
          fr: {
            profPrefix: "Me.",
            newMessage: "Nouveau message",
            from: "De",
            greeting: "Bonjour",
            reply: "Répondre →",
            attachment: "📎 Fichier joint",
            closed: "Cette consultation a été clôturée.",
            subject: "💬 Nouveau message de",
          },
          en: {
            profPrefix: "Me.",
            newMessage: "New message",
            from: "From",
            greeting: "Hello",
            reply: "Reply →",
            attachment: "📎 Attachment",
            closed: "This consultation has been closed.",
            subject: "💬 New message from",
          },
          ar: {
            profPrefix: "الأستاذ",
            newMessage: "رسالة جديدة",
            from: "من",
            greeting: "مرحباً",
            reply: "الرد →",
            attachment: "📎 مرفق",
            closed: "تم إغلاق هذه الاستشارة.",
            subject: "💬 رسالة جديدة من",
          },
        };
        const es = EMAIL_STRINGS[rlocale];
        const profPrefix = es.profPrefix;

        const senderName =
          senderType === "lawyer"
            ? `${profPrefix} ${userData.first_name} ${userData.last_name}`
            : `${userData.first_name} ${userData.last_name}`;
        const recipientName =
          recipient.user_type === "lawyer"
            ? `${profPrefix} ${recipient.first_name} ${recipient.last_name}`
            : `${recipient.first_name} ${recipient.last_name}`;
        const consultationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${rlocale}/${recipient.user_type === "lawyer" ? "lawyer/consultations" : "mes-consultations"}`;
        const messagePreview =
          message?.trim()?.slice(0, 150) ||
          (system_key === "close" ? es.closed : es.attachment);

        await resend.emails.send({
          from: "Mizan <noreply@mizan-dz.com>",
          to: recipient.email,
          subject: `${es.subject} ${senderName}`,
          html: `<!DOCTYPE html>
<html lang="${rlocale}" dir="${rlocale === "ar" ? "rtl" : "ltr"}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 16px;">
  <tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
    <tr>
      <td style="padding-bottom:20px;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="background:#0d9488;width:34px;height:34px;border-radius:8px;text-align:center;vertical-align:middle;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
              <path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
            </svg>
          </td>
          <td style="padding-left:10px;font-size:17px;font-weight:700;color:#134e4a;">Mizan</td>
        </tr></table>
      </td>
    </tr>
    <tr>
      <td style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08);">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:linear-gradient(135deg,#0d9488 0%,#0f766e 100%);padding:28px 32px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#99f6e4;">${es.newMessage}</p>
              <p style="margin:0;font-size:20px;font-weight:700;color:#fff;">${es.from} ${senderName}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.7;">${es.greeting} ${recipientName},</p>
              <div style="background:#f8fafc;border-left:3px solid #0d9488;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:24px;">
                <p style="margin:0;font-size:14px;color:#1e293b;line-height:1.7;white-space:pre-wrap;">${messagePreview}${message?.trim()?.length > 150 ? "..." : ""}</p>
                ${attachment_url ? `<p style="margin:8px 0 0;font-size:12px;color:#64748b;">${es.attachment}</p>` : ""}
              </div>
              <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#0d9488;border-radius:8px;padding:11px 24px;">
                    <a href="${consultationUrl}" style="font-size:14px;font-weight:700;color:#fff;text-decoration:none;display:block;">${es.reply}</a>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid #e2e8f0;padding-top:16px;font-size:11px;color:#94a3b8;">
                    © 2026 Mizan · <a href="https://mizan-dz.com" style="color:#94a3b8;text-decoration:none;">mizan-dz.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  </td></tr>
</table>
</body>
</html>`,
        });

        const appUrl =
          process.env.NEXT_PUBLIC_APP_URL || "https://mizan-dz.com";
        await fetch(`${appUrl}/api/push/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
          },
          body: JSON.stringify({
            user_id: recipientId,
            title: `${es.subject} ${senderName}`,
            body: messagePreview,
            url: consultationUrl,
          }),
        }).catch(() => {});
      }
    } catch (notifError) {
      console.error("Erreur notifications:", notifError);
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
