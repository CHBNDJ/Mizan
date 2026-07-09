import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { consultationId } = await req.json();
    if (!consultationId)
      return NextResponse.json(
        { error: "Missing consultationId" },
        { status: 400 }
      );

    const { data: existing } = await supabaseAdmin
      .from("consultation_rooms")
      .select("room_url, room_name")
      .eq("consultation_id", consultationId)
      .maybeSingle();

    if (existing?.room_url)
      return NextResponse.json({
        url: existing.room_url,
        name: existing.room_name,
      });

    const roomName = `mizan-${consultationId.slice(0, 12)}`;
    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 4; // 4h

    const dailyRes = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        name: roomName,
        privacy: "public",
        properties: {
          exp: expiresAt,
          enable_chat: true,
          enable_screenshare: true,
          start_video_off: false,
          start_audio_off: false,
          max_participants: 2,
          lang: "fr",
          theme: {
            colors: {
              accent: "#0F6E56",
              accentText: "#FFFFFF",
              background: "#F0F9F4",
              backgroundAccent: "#E1F5EE",
              baseText: "#1c1c1e",
              border: "#C5E8DA",
              mainAreaBg: "#FFFFFF",
              mainAreaBgAccent: "#E1F5EE",
              mainAreaText: "#1c1c1e",
              supportiveText: "#0F6E56",
            },
            dark: {
              colors: {
                accent: "#6fcf9f",
                accentText: "#0a3d30",
                background: "#1c1c1e",
                backgroundAccent: "#26492f",
                baseText: "#E8E8E6",
                border: "#2a2a2d",
                mainAreaBg: "#141415",
                mainAreaBgAccent: "#1c2220",
                mainAreaText: "#E8E8E6",
                supportiveText: "#6fcf9f",
              },
            },
          },
        },
      }),
    });

    if (!dailyRes.ok) {
      const err = await dailyRes.text();
      console.error("Daily.co error:", err);
      return NextResponse.json(
        { error: "Failed to create room" },
        { status: 500 }
      );
    }

    const room = await dailyRes.json();
    const roomUrl = room.url;

    await supabaseAdmin.from("consultation_rooms").insert({
      consultation_id: consultationId,
      room_name: roomName,
      room_url: roomUrl,
      expires_at: new Date(expiresAt * 1000).toISOString(),
    });

    return NextResponse.json({ url: roomUrl, name: roomName });
  } catch (error) {
    console.error("Create room error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
