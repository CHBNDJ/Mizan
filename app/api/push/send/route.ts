import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { lawyer_id, title, body, url } = await req.json();

    if (!lawyer_id || !title || !body) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    const { data: sub } = await supabase
      .from("push_subscriptions")
      .select("subscription")
      .eq("user_id", lawyer_id)
      .maybeSingle();

    if (!sub?.subscription) {
      return NextResponse.json({ sent: false, reason: "Pas de subscription" });
    }

    await webpush.sendNotification(
      sub.subscription,
      JSON.stringify({ title, body, url: url || "/lawyer/consultations" })
    );

    return NextResponse.json({ sent: true });
  } catch (error: any) {
    if (error.statusCode === 410) {
      const body = await req.json().catch(() => ({}));
      if (body.lawyer_id) {
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("user_id", body.lawyer_id);
      }
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
