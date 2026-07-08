import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://mizan-dz.com";

function formatDateFr(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildEmail(opts: {
  recipientName: string;
  otherName: string;
  channelLabel: string;
  whenStr: string;
  joinUrl: string;
  minutesLabel: string;
}): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1c1c1e;">
      <h2 style="color: #0F6E56;">Rappel de rendez-vous</h2>
      <p>Bonjour ${opts.recipientName},</p>
      <p>Votre consultation <strong>${opts.channelLabel}</strong> avec ${opts.otherName} commence <strong>${opts.minutesLabel}</strong>.</p>
      <p style="background:#f0f9f4; border-radius:8px; padding:12px 16px;">
        📅 ${opts.whenStr}
      </p>
      <p style="margin: 24px 0;">
        <a href="${opts.joinUrl}"
           style="background:#0F6E56; color:#fff; text-decoration:none; padding:12px 24px; border-radius:8px; display:inline-block; font-weight:bold;">
          Rejoindre l'appel
        </a>
      </p>
      <p style="color:#6b7280; font-size:13px;">
        Si le bouton ne fonctionne pas, copiez ce lien : ${opts.joinUrl}
      </p>
      <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />
      <p style="color:#9ca3af; font-size:12px;">MIZAN — mizan-dz.com</p>
    </div>
  `;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const results = { reminders_1h: 0, reminders_15m: 0, errors: 0 };

  try {
    const { data: consults, error } = await supabaseAdmin
      .from("consultations")
      .select(
        "id, scheduled_at, channel, client_id, lawyer_id, reminder_1h_sent, reminder_15m_sent"
      )
      .not("scheduled_at", "is", null)
      .in("channel", ["video_30", "video_60", "phone"])
      .neq("status", "closed");

    if (error) {
      console.error("Erreur récupération consultations:", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    for (const c of consults || []) {
      const start = new Date(c.scheduled_at).getTime();
      const minutesUntil = (start - now) / 60000;

      const is1hWindow =
        minutesUntil <= 65 && minutesUntil > 20 && !c.reminder_1h_sent;

      const is15mWindow =
        minutesUntil <= 20 && minutesUntil > 0 && !c.reminder_15m_sent;

      if (!is1hWindow && !is15mWindow) continue;

      const { data: client } = await supabaseAdmin
        .from("users")
        .select("email, first_name, last_name")
        .eq("id", c.client_id)
        .maybeSingle();

      const { data: lawyer } = await supabaseAdmin
        .from("users")
        .select("email, first_name, last_name")
        .eq("id", c.lawyer_id)
        .maybeSingle();

      const channelLabel = c.channel === "phone" ? "téléphone" : "vidéo";
      const whenStr = formatDateFr(c.scheduled_at);
      const minutesLabel = is1hWindow ? "dans 1 heure" : "dans 15 minutes";
      const joinUrl = `${APP_URL}/consultation/${c.id}/video`;

      const clientName = client?.first_name || "cher client";
      const lawyerName =
        `${lawyer?.first_name || ""} ${lawyer?.last_name || ""}`.trim();

      if (client?.email) {
        try {
          await resend.emails.send({
            from: "MIZAN <notifications@mizan-dz.com>",
            to: client.email,
            subject: `Rappel : votre consultation ${channelLabel} ${minutesLabel}`,
            html: buildEmail({
              recipientName: clientName,
              otherName: lawyerName || "votre professionnel",
              channelLabel,
              whenStr,
              joinUrl,
              minutesLabel,
            }),
          });
        } catch (e) {
          console.error("Erreur email client:", e);
          results.errors++;
        }
      }
      if (lawyer?.email) {
        try {
          await resend.emails.send({
            from: "MIZAN <notifications@mizan-dz.com>",
            to: lawyer.email,
            subject: `Rappel : consultation ${channelLabel} ${minutesLabel}`,
            html: buildEmail({
              recipientName: lawyer?.first_name || "cher professionnel",
              otherName: clientName,
              channelLabel,
              whenStr,
              joinUrl,
              minutesLabel,
            }),
          });
        } catch (e) {
          console.error("Erreur email avocat:", e);
          results.errors++;
        }
      }
      const updateField = is1hWindow
        ? { reminder_1h_sent: true }
        : { reminder_15m_sent: true };
      await supabaseAdmin
        .from("consultations")
        .update(updateField)
        .eq("id", c.id);

      if (is1hWindow) results.reminders_1h++;
      if (is15mWindow) results.reminders_15m++;
    }

    return NextResponse.json({ ok: true, ...results });
  } catch (e) {
    console.error("Erreur cron reminders:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
