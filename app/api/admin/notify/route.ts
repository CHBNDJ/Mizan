import { NextRequest, NextResponse } from "next/server";
import { sendAdminNotification } from "@/lib/email/admin-notifications";

export async function POST(request: NextRequest) {
  try {
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
