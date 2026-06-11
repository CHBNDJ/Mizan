import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

type Status = "pending" | "accepted" | "in_progress" | "completed" | "declined";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: consultationId } = await params;
    const { status, message } = (await req.json()) as {
      status: Status;
      message?: string;
    };

    const validStatuses: Status[] = [
      "pending",
      "accepted",
      "in_progress",
      "completed",
      "declined",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { data: consult, error } = await supabaseAdmin
      .from("consultations")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", consultationId)
      .select(
        "*, lawyer:lawyer_id(first_name, last_name), client:client_id(first_name, last_name, email)"
      )
      .single();

    if (error || !consult) {
      return NextResponse.json(
        { error: "Consultation not found" },
        { status: 404 }
      );
    }

    if (
      (status === "accepted" || status === "declined") &&
      consult.client?.email
    ) {
      const lawyerName = `${consult.lawyer?.first_name} ${consult.lawyer?.last_name}`;
      const isAccepted = status === "accepted";

      await resend.emails.send({
        from: "Mizan <notifications@mizan-dz.com>",
        to: consult.client.email,
        subject: isAccepted
          ? `Votre demande a été acceptée — ${lawyerName}`
          : `Mise à jour de votre demande — ${lawyerName}`,
        html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8fafc;margin:0;padding:24px">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
    <div style="background:${isAccepted ? "#0f6e56" : "#475569"};padding:24px 28px">
      <h1 style="color:#fff;font-size:20px;font-weight:700;margin:0">${isAccepted ? "Demande acceptée ✓" : "Demande non retenue"}</h1>
    </div>
    <div style="padding:28px">
      <p style="color:#475569;font-size:15px;margin:0 0 20px">${isAccepted ? `${lawyerName} a accepté votre demande. Vous pouvez échanger dans la messagerie.` : `${lawyerName} n'est pas disponible pour cette demande.${message ? " " + message : ""}`}</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/mes-consultations" style="display:inline-block;background:#0f6e56;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 24px;border-radius:10px">Voir mes consultations →</a>
    </div>
  </div>
</body></html>`,
      });
    }

    if (status === "accepted" || status === "declined") {
      await supabaseAdmin.from("messages").insert({
        consultation_id: consultationId,
        sender_id: consult.lawyer_id,
        content:
          status === "accepted"
            ? "✅ Demande acceptée. La consultation peut commencer."
            : `❌ Demande non retenue.${message ? " " + message : ""}`,
      });
    }

    return NextResponse.json({ ok: true, status });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
