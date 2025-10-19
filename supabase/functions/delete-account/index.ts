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
    // Variables d'environnement
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

    // Client admin pour la suppression
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const userId = user.id;

    // Suppression en cascade dans l'ordre correct
    const { error: preferencesError } = await supabaseAdmin
      .from("user_preferences")
      .delete()
      .eq("user_id", userId);
    if (preferencesError)
      console.warn("⚠️ user_preferences:", preferencesError.message);

    const { error: notificationsError } = await supabaseAdmin
      .from("notifications")
      .delete()
      .eq("user_id", userId);
    if (notificationsError)
      console.warn("⚠️ notifications:", notificationsError.message);

    const { error: lawyersError } = await supabaseAdmin
      .from("lawyers")
      .delete()
      .eq("id", userId);
    if (lawyersError) console.warn("⚠️ lawyers:", lawyersError.message);

    const { error: usersError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", userId);
    if (usersError) console.warn("⚠️ users:", usersError.message);

    // IMPORTANT : Supprimer le compte d'authentification
    const { error: authDeleteError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authDeleteError) {
      console.error("❌ Erreur suppression auth:", authDeleteError);
      throw new Error(
        `Erreur suppression compte auth: ${authDeleteError.message}`
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Compte supprimé avec succès (auth inclus)",
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
