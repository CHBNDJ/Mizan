import { NextRequest, NextResponse } from "next/server";
import { sendAdminNotification } from "@/lib/email/admin-notifications";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const internalSecret = request.headers.get("x-internal-secret");
    const isInternal =
      internalSecret &&
      internalSecret === process.env.INTERNAL_API_SECRET;

    if (!isInternal) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
      }
    }

    const { subject, title, message, priority } = await request.json();

    await sendAdminNotification({
      subject,
      title,
      message,
      priority: priority || "normal",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur notification admin:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
