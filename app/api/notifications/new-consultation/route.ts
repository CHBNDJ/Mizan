import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://mizan-dz.com";

const CHANNEL_LABELS: Record<string, string> = {
  message: "Consultation par message",
  phone: "Consultation téléphonique",
  video_30: "Consultation vidéo (30 min)",
  video_60: "Consultation vidéo (60 min)",
  physical: "Rendez-vous au cabinet",
};

const TZ_LABELS: Record<string, string> = {
  "Africa/Algiers": "heure d'Algérie",
  "Europe/Paris": "heure de Paris",
  "Europe/Brussels": "heure de Bruxelles",
  "Europe/Zurich": "heure de Zurich",
  "Europe/Madrid": "heure de Madrid",
  "Europe/London": "heure de Londres",
  "America/Montreal": "heure de Montréal",
  "America/Toronto": "heure de Toronto",
  "America/New_York": "heure de New York",
};

function tzLabel(tz: string): string {
  return (
    TZ_LABELS[tz] || `heure de ${tz.split("/").pop()?.replace(/_/g, " ") || tz}`
  );
}

function formatInTz(iso: string, tz: string): string {
  const d = new Date(iso).toLocaleString("fr-FR", {
    timeZone: tz,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${d} (${tzLabel(tz)})`;
}

function shell(title: string, tag: string, inner: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f8fafc;margin:0;padding:24px">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
    <div style="background:#0f6e56;padding:24px 28px">
      <p style="color:#9fe1cb;font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;margin:0 0 6px">Mizan · ${tag}</p>
      <h1 style="color:#fff;font-size:20px;font-weight:700;margin:0">${title}</h1>
    </div>
    <div style="padding:28px">
      ${inner}
    </div>
    <div style="padding:16px 28px;border-top:1px solid #f1f5f9">
      <p style="color:#94a3b8;font-size:12px;margin:0">Mizan · Plateforme juridique en Algérie · <a href="${APP_URL}" style="color:#0f6e56;text-decoration:none">mizan-dz.com</a></p>
    </div>
  </div>
</body>
</html>`;
}

function detailsBox(rows: string[]): string {
  return `<div style="background:#f0fdf9;border:1px solid #d1fae5;border-radius:12px;padding:16px 20px;margin-bottom:20px">
    <p style="color:#0f6e56;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin:0 0 10px">Détails</p>
    ${rows.join("")}
  </div>`;
}

function cta(url: string, label: string): string {
  return `<a href="${url}" style="display:inline-block;background:#0f6e56;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 24px;border-radius:10px">${label} →</a>`;
}

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-webhook-secret");
    if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const record = body.record;
    if (!record) return NextResponse.json({ ok: true });

    const lawyerId = record.lawyer_id;
    const clientId = record.client_id;
    const channel = record.channel as string;
    const scheduledAt = record.scheduled_at as string | null;

    const { data: lawyer } = await supabaseAdmin
      .from("users")
      .select("email, first_name, last_name, address, timezone")
      .eq("id", lawyerId)
      .maybeSingle();

    const { data: client } = await supabaseAdmin
      .from("users")
      .select("email, first_name, last_name, timezone")
      .eq("id", clientId)
      .maybeSingle();

    const channelLabel = CHANNEL_LABELS[channel] || "Consultation";
    const isPhysical = channel === "physical";
    const isScheduled = !!scheduledAt;
    const clientTz = (client as any)?.timezone || "Africa/Algiers";
    const lawyerTz = (lawyer as any)?.timezone || "Africa/Algiers";
    const whenClient = scheduledAt ? formatInTz(scheduledAt, clientTz) : "";
    const whenLawyer = scheduledAt ? formatInTz(scheduledAt, lawyerTz) : "";

    const lawyerName =
      `${lawyer?.first_name || ""} ${lawyer?.last_name || ""}`.trim() ||
      "votre professionnel";
    const clientName =
      `${client?.first_name || ""} ${client?.last_name || ""}`.trim() ||
      "Un client";

    const addr = lawyer?.address as any;
    const cabinetAddress = addr
      ? [addr.street, addr.postalCode, addr.city, addr.wilaya]
          .filter(Boolean)
          .join(", ")
      : "";

    const lawyerUrl = `${APP_URL}/lawyer/consultations`;
    const clientUrl = `${APP_URL}/mes-consultations`;

    if (lawyer?.email) {
      const rows = [
        `<p style="color:#0f172a;font-size:15px;font-weight:600;margin:0 0 4px">👤 ${clientName}</p>`,
        `<p style="color:#475569;font-size:14px;margin:0 0 4px">📋 ${channelLabel}</p>`,
      ];
      if (isScheduled)
        rows.push(
          `<p style="color:#475569;font-size:14px;margin:0">📅 ${whenLawyer}</p>`
        );

      const inner = `
        <p style="color:#475569;font-size:15px;margin:0 0 20px">Bonjour ${lawyer.first_name || ""},</p>
        ${detailsBox(rows)}
        <p style="color:#64748b;font-size:14px;margin:0 0 24px;line-height:1.6">
          ${
            isScheduled
              ? "Ce rendez-vous est confirmé. Retrouvez tous les détails dans votre espace."
              : "Répondez rapidement pour ne pas laisser attendre votre client."
          }
        </p>
        ${cta(lawyerUrl, isScheduled ? "Voir le rendez-vous" : "Voir la demande")}
      `;

      try {
        await resend.emails.send({
          from: "Mizan <notifications@mizan-dz.com>",
          to: lawyer.email,
          subject: isScheduled
            ? `Rendez-vous confirmé — ${clientName}`
            : `Nouvelle demande de consultation — ${clientName}`,
          html: shell(
            isScheduled
              ? "Un rendez-vous a été confirmé"
              : "Vous avez reçu une demande de consultation",
            isScheduled ? "Rendez-vous" : "Nouvelle demande",
            inner
          ),
        });
      } catch (e) {
        console.error("Erreur email professionnel:", e);
      }
    }

    if (client?.email) {
      const rows = [
        `<p style="color:#0f172a;font-size:15px;font-weight:600;margin:0 0 4px">👤 ${lawyerName}</p>`,
        `<p style="color:#475569;font-size:14px;margin:0 0 4px">📋 ${channelLabel}</p>`,
      ];
      if (isScheduled)
        rows.push(
          `<p style="color:#475569;font-size:14px;margin:0 0 4px">📅 ${whenClient}</p>`
        );
      if (isPhysical && cabinetAddress)
        rows.push(
          `<p style="color:#475569;font-size:14px;margin:0">📍 ${cabinetAddress}</p>`
        );

      const inner = `
        <p style="color:#475569;font-size:15px;margin:0 0 20px">Bonjour ${client.first_name || ""},</p>
        ${detailsBox(rows)}
        <p style="color:#64748b;font-size:14px;margin:0 0 24px;line-height:1.6">
          ${
            isScheduled
              ? "Votre rendez-vous est confirmé. Vous recevrez un rappel avant l'échéance."
              : "Votre demande a bien été transmise. Le professionnel vous répondra dans les plus brefs délais."
          }
        </p>
        ${cta(clientUrl, isScheduled ? "Voir mon rendez-vous" : "Voir ma demande")}
      `;

      try {
        await resend.emails.send({
          from: "Mizan <notifications@mizan-dz.com>",
          to: client.email,
          subject: isScheduled
            ? `Rendez-vous confirmé avec ${lawyerName}`
            : `Votre demande a bien été envoyée`,
          html: shell(
            isScheduled
              ? "Votre rendez-vous est confirmé"
              : "Votre demande a bien été envoyée",
            isScheduled ? "Rendez-vous" : "Demande envoyée",
            inner
          ),
        });
      } catch (e) {
        console.error("Erreur email client:", e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
