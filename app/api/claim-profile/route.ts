import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { lawyerId, email, password } = await request.json();

    const supabase = await createAdminClient();

    // Récupérer les données existantes
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("id", lawyerId)
      .single();

    const { data: existingLawyer } = await supabase
      .from("lawyers")
      .select("*")
      .eq("id", lawyerId)
      .single();

    if (!existingUser || !existingLawyer) {
      throw new Error("Profil introuvable");
    }

    // Supprimer l'ancien compte auth si existant
    const { data: allUsers } = await supabase.auth.admin.listUsers();
    const oldAuthUser = allUsers?.users.find((u) => u.email === email);

    if (oldAuthUser) {
      await supabase.auth.admin.deleteUser(oldAuthUser.id);
    }

    // Créer le compte auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
      });

    if (authError) throw new Error(authError.message);

    const newAuthId = authData.user.id;

    // Attendre que le trigger se termine
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Supprimer les entrées créées par le trigger
    await supabase.from("lawyers").delete().eq("id", newAuthId);
    await supabase.from("users").delete().eq("id", newAuthId);

    // Créer users avec le nouvel auth ID
    const { error: userError } = await supabase.from("users").insert({
      id: newAuthId,
      email: existingUser.email,
      first_name: existingUser.first_name,
      last_name: existingUser.last_name,
      phone: existingUser.phone,
      mobile: existingUser.mobile,
      user_type: existingUser.user_type,
      location: existingUser.location,
      address: existingUser.address,
      avatar_url: existingUser.avatar_url,
      professional_email: existingUser.professional_email,
      created_at: existingUser.created_at,
      updated_at: new Date().toISOString(),
    });

    if (userError) {
      throw new Error(userError.message);
    }

    // Créer lawyers avec le nouvel auth ID
    const { error: lawyerError } = await supabase.from("lawyers").insert({
      id: newAuthId,
      bar_number: existingLawyer.bar_number,
      specializations: existingLawyer.specializations,
      wilayas: existingLawyer.wilayas,
      experience_years: existingLawyer.experience_years,
      hourly_rate: existingLawyer.hourly_rate,
      bio: existingLawyer.bio,
      is_claimed: true,
      claimed_at: new Date().toISOString(),
      is_verified: existingLawyer.is_verified,
      is_available: existingLawyer.is_available,
      total_consultations: existingLawyer.total_consultations,
      average_rating: existingLawyer.average_rating,
      total_reviews: existingLawyer.total_reviews,
      created_at: existingLawyer.created_at,
      updated_at: new Date().toISOString(),
    });

    if (lawyerError) {
      throw new Error(lawyerError.message);
    }

    // Supprimer les anciennes entrées
    await supabase.from("lawyers").delete().eq("id", lawyerId);
    await supabase.from("users").delete().eq("id", lawyerId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur claim profil:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
