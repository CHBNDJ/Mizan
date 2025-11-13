// app/qr/[code]/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  // Logger les statistiques
  console.log(`QR Code scanné: ${code}`);
  console.log(`User-Agent: ${request.headers.get("user-agent")}`);
  console.log(`IP: ${request.headers.get("x-forwarded-for")}`);

  // Redirection vers la page d'accueil
  return NextResponse.redirect("https://mizan-dz.com", {
    status: 301,
  });
}
