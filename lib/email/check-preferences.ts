import { createClient } from "@/lib/supabase/server";

export async function canSendEmail(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user_preferences")
      .select("email_notifications")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Erreur vérification préférences email:", error);
      return true;
    }

    if (!data) {
      return true;
    }

    return data.email_notifications === true;
  } catch (error) {
    console.error("Erreur inattendue vérification préférences:", error);
    return true;
  }
}
