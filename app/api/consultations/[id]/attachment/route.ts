import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { encryptFile } from "@/lib/fileEncryption";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: consultationId } = await params;

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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file)
      return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });

    const allowed = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (!allowed.includes(file.type))
      return NextResponse.json(
        { error: "Type de fichier non autorisé" },
        { status: 400 }
      );
    if (file.size > 10 * 1024 * 1024)
      return NextResponse.json(
        { error: "Fichier trop volumineux" },
        { status: 400 }
      );

    const arrayBuffer = await file.arrayBuffer();
    const plainBuffer = Buffer.from(arrayBuffer);
    const encryptedBuffer = encryptFile(plainBuffer);

    const fileExt = file.name.split(".").pop();
    const fileName = `${consultationId}/${Date.now()}.${fileExt}`;

    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: uploadError } = await admin.storage
      .from("consultation-attachments")
      .upload(fileName, encryptedBuffer, {
        contentType: file.type,
      });

    if (uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 });

    return NextResponse.json({ path: fileName });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erreur upload" },
      { status: 500 }
    );
  }
}
