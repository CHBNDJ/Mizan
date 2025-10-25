import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !serviceKey || !anonKey) {
      throw new Error("Variables d'environnement manquantes");
    }

    // Vérifier l'authentification
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header manquant" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Client pour vérifier l'utilisateur
    const supabaseUser = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: authError,
    } = await supabaseUser.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Utilisateur non authentifié" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Client admin
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);
    const userId = user.id;

    console.log("🗑️ Début suppression pour userId:", userId);

    // ✅ STRATÉGIE : Supprimer auth.users en premier
    // Les CASCADE s'occuperont du reste automatiquement
    const { error: authDeleteError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authDeleteError) {
      console.error("❌ Erreur suppression auth:", authDeleteError);
      throw new Error(`Erreur suppression compte: ${authDeleteError.message}`);
    }

    console.log("✅ Compte auth supprimé avec succès");

    // ✅ Vérifier si les tables sont bien vides (optionnel)
    const { data: userCheck } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    const { data: lawyerCheck } = await supabaseAdmin
      .from("lawyers")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (userCheck || lawyerCheck) {
      console.warn("⚠️ Les tables n'ont pas été vidées par CASCADE");

      // Suppression manuelle si CASCADE n'a pas fonctionné
      await supabaseAdmin
        .from("user_preferences")
        .delete()
        .eq("user_id", userId);
      await supabaseAdmin.from("notifications").delete().eq("user_id", userId);
      await supabaseAdmin.from("lawyers").delete().eq("id", userId);
      await supabaseAdmin.from("users").delete().eq("id", userId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Compte supprimé définitivement",
        userId: userId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("💥 Erreur:", error.message);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erreur lors de la suppression",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
