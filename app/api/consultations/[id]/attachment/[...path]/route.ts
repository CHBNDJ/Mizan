import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { decryptFile } from "@/lib/fileEncryption";
export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; path: string[] }> }
) {
  try {
    const supabase = await createClient();
    const { id: consultationId, path: pathParts } = await params;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data: consultation } = await supabase
      .from("consultations")
      .select("client_id, lawyer_id")
      .eq("id", consultationId)
      .single();

    if (
      !consultation ||
      (user.id !== consultation.client_id && user.id !== consultation.lawyer_id)
    )
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

    const storagePath = pathParts.join("/");

    if (!storagePath.startsWith(`${consultationId}/`)) {
      return NextResponse.json({ error: "Chemin invalide" }, { status: 400 });
    }

    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: fileData, error: downloadError } = await admin.storage
      .from("consultation-attachments")
      .download(storagePath);

    if (downloadError || !fileData)
      return NextResponse.json(
        { error: "Fichier introuvable" },
        { status: 404 }
      );

    const arrayBuffer = await fileData.arrayBuffer();
    const storedBuffer = Buffer.from(arrayBuffer);
    const decrypted = decryptFile(storedBuffer);

    const contentType =
      request.nextUrl.searchParams.get("type") || "application/octet-stream";

    return new NextResponse(decrypted, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error: any) {
    console.error("ERREUR UPLOAD ATTACHMENT:", error);
    return NextResponse.json(
      { error: error.message || "Erreur upload" },
      { status: 500 }
    );
  }
}
