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

async function isAuthorized(req: NextRequest): Promise<boolean> {
  const internalSecret = req.headers.get("x-internal-secret");
  if (internalSecret && internalSecret === process.env.INTERNAL_API_SECRET)
    return true;

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const {
      data: { user },
    } = await supabase.auth.getUser(auth.replace("Bearer ", ""));
    if (user) return true;
  }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { user_id, title, body, url } = await req.json();

    if (!user_id || !title || !body) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    const { data: sub } = await supabase
      .from("push_subscriptions")
      .select("subscription")
      .eq("user_id", user_id)
      .maybeSingle();

    if (!sub?.subscription) {
      return NextResponse.json({ sent: false, reason: "Pas de subscription" });
    }

    await webpush.sendNotification(
      sub.subscription,
      JSON.stringify({ title, body, url: url || "/" })
    );

    return NextResponse.json({ sent: true });
  } catch (error: any) {
    if (error.statusCode === 410) {
      const body = await req
        .clone()
        .json()
        .catch(() => ({}));
      if (body.user_id) {
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("user_id", body.user_id);
      }
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
