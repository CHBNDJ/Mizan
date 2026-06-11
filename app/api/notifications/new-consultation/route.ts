import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-webhook-secret");
    if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const record = body.record;

    if (!record) return NextResponse.json({ ok: true });

    const consultationId = record.id;
    const lawyerId = record.lawyer_id;
    const clientId = record.client_id;

    const { data: lawyer } = await supabaseAdmin
      .from("users")
      .select("email, first_name, last_name")
      .eq("id", lawyerId)
      .single();

    const { data: client } = await supabaseAdmin
      .from("users")
      .select("first_name, last_name")
      .eq("id", clientId)
      .single();

    const { data: messages } = await supabaseAdmin
      .from("messages")
      .select("content")
      .eq("consultation_id", consultationId)
      .order("created_at", { ascending: true })
      .limit(1);

    const firstMessage = messages?.[0]?.content || "";
    const canalLine =
      firstMessage.split("\n").find((l: string) => l.includes("Canal :")) || "";
    const canal = canalLine.replace("🔔 Canal : ", "").split("\n")[0].trim();

    if (!lawyer?.email) return NextResponse.json({ ok: true });

    const lawyerName = `${lawyer.first_name} ${lawyer.last_name}`;
    const clientName = client
      ? `${client.first_name} ${client.last_name}`
      : "Un client";
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/consultations`;

    await resend.emails.send({
      from: "Mizan <notifications@mizan-dz.com>",
      to: lawyer.email,
      subject: `Nouvelle demande de consultation — ${clientName}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8fafc;margin:0;padding:24px">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
    
    <div style="background:#0f6e56;padding:24px 28px">
      <p style="color:#9fe1cb;font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;margin:0 0 6px">Mizan · Nouvelle demande</p>
      <h1 style="color:#fff;font-size:20px;font-weight:700;margin:0">Vous avez reçu une demande de consultation</h1>
    </div>

    <div style="padding:28px">
      <p style="color:#475569;font-size:15px;margin:0 0 20px">Bonjour ${lawyerName},</p>
      
      <div style="background:#f0fdf9;border:1px solid #d1fae5;border-radius:12px;padding:16px 20px;margin-bottom:20px">
        <p style="color:#0f6e56;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin:0 0 10px">Détails de la demande</p>
        <p style="color:#0f172a;font-size:15px;font-weight:600;margin:0 0 4px">👤 ${clientName}</p>
        ${canal ? `<p style="color:#475569;font-size:14px;margin:0">📋 ${canal}</p>` : ""}
      </div>

      <p style="color:#64748b;font-size:14px;margin:0 0 24px;line-height:1.6">
        Répondez rapidement pour maximiser vos chances d'accepter cette consultation.
      </p>

      <a href="${dashboardUrl}" style="display:inline-block;background:#0f6e56;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 24px;border-radius:10px">
        Voir la demande →
      </a>
    </div>

    <div style="padding:16px 28px;border-top:1px solid #f1f5f9">
      <p style="color:#94a3b8;font-size:12px;margin:0">Mizan · Plateforme juridique en Algérie · <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#0f6e56">mizan-dz.com</a></p>
    </div>
  </div>
</body>
</html>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
