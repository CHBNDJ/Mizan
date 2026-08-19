import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createRawClient } from "@supabase/supabase-js";

const supabaseVerify = createRawClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller }, error: authError } =
      await supabaseVerify.auth.getUser(token);
    if (authError || !caller) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId manquant" }, { status: 400 });
    }

    if (caller.id !== userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const supabase = await createAdminClient();

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Erreur suppression auth:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur API delete-auth-user:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
