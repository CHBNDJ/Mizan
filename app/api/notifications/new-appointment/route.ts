import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

const MONTHS_FR = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];
const DAYS_FR = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return `${DAYS_FR[d.getDay()]} ${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
}

const PROF_LABELS: Record<string, string> = {
  notaire: "Notaire",
  huissier: "Huissier de justice",
  avocat: "Avocat",
  comptable: "Comptable",
  "expert-comptable": "Expert Comptable",
};

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = request.headers.get("x-webhook-secret");
    if (
      !process.env.SUPABASE_WEBHOOK_SECRET ||
      webhookSecret !== process.env.SUPABASE_WEBHOOK_SECRET
    ) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const payload = await request.json();
    const appt = payload.record;
    if (!appt) return NextResponse.json({ message: "Ignoré" });

    const [{ data: lawyer }, { data: client }] = await Promise.all([
      supabaseAdmin
        .from("users")
        .select("email, first_name, last_name")
        .eq("id", appt.lawyer_id)
        .single(),
      supabaseAdmin
        .from("users")
        .select("email, first_name, last_name")
        .eq("id", appt.client_id)
        .single(),
    ]);
    const { data: lawyerProf } = await supabaseAdmin
      .from("lawyers")
      .select("profession")
      .eq("id", appt.lawyer_id)
      .single();

    if (!lawyer || !client)
      return NextResponse.json({ error: "Users not found" }, { status: 404 });

    const profLabel =
      PROF_LABELS[lawyerProf?.profession || "notaire"] || "Professionnel";
    const dateLabel = formatDate(appt.appointment_date);
    const timeLabel = appt.start_time?.slice(0, 5) || "";

    await resend.emails.send({
      from: "MIZAN <noreply@mizan-dz.com>",
      to: lawyer.email,
      subject: `📅 Nouveau rendez-vous — ${dateLabel} à ${timeLabel}`,
      html: `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><title>Nouveau RDV MIZAN</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">
  <tr><td style="padding-bottom:20px">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="background:#0f6e56;width:32px;height:32px;border-radius:8px;text-align:center;vertical-align:middle">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
          <path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
        </svg>
      </td>
      <td style="padding-left:10px;font-size:17px;font-weight:700;color:#0f2d24">MIZAN</td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#ffffff;border-top:3px solid #0f6e56;border-radius:0 0 12px 12px;padding:32px">
    <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#0f6e56">Nouveau rendez-vous</p>
    <p style="margin:0 0 20px;font-size:22px;font-weight:700;color:#0f2d24">
      ${client.first_name} ${client.last_name}
    </p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:20px">
      <tr><td style="width:36px;height:2px;background:#0f6e56;font-size:0">&nbsp;</td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fffe;border:1px solid #d0f0e8;border-radius:8px;padding:16px;margin-bottom:20px">
      <tr><td style="padding:4px 0;font-size:13px;color:#334155"><strong>📅 Date :</strong> ${dateLabel}</td></tr>
      <tr><td style="padding:4px 0;font-size:13px;color:#334155"><strong>🕐 Heure :</strong> ${timeLabel}</td></tr>
      <tr><td style="padding:4px 0;font-size:13px;color:#334155"><strong>📝 Objet :</strong> ${appt.subject}</td></tr>
      ${appt.client_phone ? `<tr><td style="padding:4px 0;font-size:13px;color:#334155"><strong>📞 Téléphone :</strong> ${appt.client_phone}</td></tr>` : ""}
    </table>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:28px">
      <tr><td style="border:1.5px solid #0f6e56;border-radius:8px;padding:10px 24px">
        <a href="https://mizan-dz.com/lawyer/dashboard" style="font-size:13px;font-weight:700;color:#0f6e56;text-decoration:none">
          Voir dans mon dashboard
        </a>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="border-top:0.5px solid #e2e8f0;padding-top:16px;font-size:11px;color:#94a3b8">
        <a href="mailto:support@mizan-dz.com" style="color:#0f6e56;text-decoration:none">support@mizan-dz.com</a>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="padding-top:16px;text-align:center;font-size:10px;color:#94a3b8">
    © 2026 MIZAN · <a href="https://mizan-dz.com" style="color:#94a3b8;text-decoration:none">mizan-dz.com</a>
  </td></tr>
</table></td></tr></table>
</body></html>`,
    });

    await resend.emails.send({
      from: "MIZAN <noreply@mizan-dz.com>",
      to: client.email,
      subject: `✅ Votre rendez-vous est enregistré — ${dateLabel}`,
      html: `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><title>Confirmation RDV MIZAN</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">
  <tr><td style="padding-bottom:20px">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="background:#0f6e56;width:32px;height:32px;border-radius:8px;text-align:center;vertical-align:middle">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
          <path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
        </svg>
      </td>
      <td style="padding-left:10px;font-size:17px;font-weight:700;color:#0f2d24">MIZAN</td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#ffffff;border-top:3px solid #0f6e56;border-radius:0 0 12px 12px;padding:32px">
    <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#0f6e56">Rendez-vous enregistré</p>
    <p style="margin:0 0 20px;font-size:22px;font-weight:700;color:#0f2d24">
      ${lawyer.first_name} ${lawyer.last_name}
    </p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:20px">
      <tr><td style="width:36px;height:2px;background:#0f6e56;font-size:0">&nbsp;</td></tr>
    </table>
    <p style="margin:0 0 16px;font-size:13px;color:#334155;line-height:1.75">
      Votre demande de rendez-vous a bien été transmise au ${profLabel.toLowerCase()}. Il confirmera le créneau par message sur MIZAN.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fffe;border:1px solid #d0f0e8;border-radius:8px;padding:16px;margin-bottom:20px">
      <tr><td style="padding:4px 0;font-size:13px;color:#334155"><strong>📅 Date demandée :</strong> ${dateLabel}</td></tr>
      <tr><td style="padding:4px 0;font-size:13px;color:#334155"><strong>🕐 Heure :</strong> ${timeLabel}</td></tr>
      <tr><td style="padding:4px 0;font-size:13px;color:#334155"><strong>📝 Objet :</strong> ${appt.subject}</td></tr>
    </table>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:28px">
      <tr><td style="border:1.5px solid #0f6e56;border-radius:8px;padding:10px 24px">
        <a href="https://mizan-dz.com/mes-consultations" style="font-size:13px;font-weight:700;color:#0f6e56;text-decoration:none">
          Suivre mon rendez-vous
        </a>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="border-top:0.5px solid #e2e8f0;padding-top:16px;font-size:11px;color:#94a3b8">
        <a href="mailto:support@mizan-dz.com" style="color:#0f6e56;text-decoration:none">support@mizan-dz.com</a>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="padding-top:16px;text-align:center;font-size:10px;color:#94a3b8">
    © 2026 MIZAN · <a href="https://mizan-dz.com" style="color:#94a3b8;text-decoration:none">mizan-dz.com</a>
  </td></tr>
</table></td></tr></table>
</body></html>`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook RDV:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
