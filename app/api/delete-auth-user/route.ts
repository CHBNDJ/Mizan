import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createRawClient } from "@supabase/supabase-js";
import { sendAdminNotification } from "@/lib/email/admin-notifications";

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

    // Récupérer les infos du compte AVANT suppression (pour l'alerte)
    let alertInfo = "";
    try {
      const { data: userData } = await supabase
        .from("users")
        .select("first_name, last_name, email, user_type, location")
        .eq("id", userId)
        .single();
      if (userData) {
        let professionInfo = userData.user_type;
        if (userData.user_type === "lawyer") {
          const { data: lawyerData } = await supabase
            .from("lawyers")
            .select("profession, slug")
            .eq("id", userId)
            .single();
          if (lawyerData?.profession) professionInfo = lawyerData.profession;
        }
        alertInfo = `<strong>${userData.first_name || ""} ${userData.last_name || ""}</strong><br/>
          Email : ${userData.email || "—"}<br/>
          Type : ${professionInfo}<br/>
          Localisation : ${userData.location || "—"}<br/>
          ID : ${userId}`;
      }
    } catch (e) {
      console.error("Impossible de récupérer les infos avant suppression:", e);
    }

    // Envoyer l'alerte admin AVANT de supprimer
    if (alertInfo) {
      try {
        await sendAdminNotification({
          subject: "Suppression de compte",
          title: "Un compte a été supprimé",
          message: `Un utilisateur vient de supprimer son compte MIZAN :<br/><br/>${alertInfo}`,
          priority: "high",
        });
      } catch (e) {
        console.error("Erreur envoi alerte suppression:", e);
        // On continue la suppression même si l'email échoue
      }
    }

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
