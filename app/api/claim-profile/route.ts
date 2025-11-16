import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { lawyerId, email, code, password } = await request.json();

    if (!lawyerId || !email || !code || !password) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    const { data: verification } = await supabase
      .from("claim_verification_codes")
      .select("*")
      .eq("lawyer_id", lawyerId)
      .eq("email", email)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!verification) {
      return NextResponse.json(
        { error: "Code invalide ou expiré. Demandez un nouveau code." },
        { status: 400 }
      );
    }

    if (new Date(verification.expires_at) < new Date()) {
      await supabase
        .from("claim_verification_codes")
        .update({ used: true })
        .eq("id", verification.id);

      return NextResponse.json(
        { error: "Code expiré. Demandez un nouveau code." },
        { status: 400 }
      );
    }

    if (verification.attempts >= 3) {
      await supabase
        .from("claim_verification_codes")
        .update({ used: true })
        .eq("id", verification.id);

      return NextResponse.json(
        { error: "Trop de tentatives. Demandez un nouveau code." },
        { status: 400 }
      );
    }

    if (verification.code !== code) {
      await supabase
        .from("claim_verification_codes")
        .update({ attempts: verification.attempts + 1 })
        .eq("id", verification.id);

      const attemptsLeft = 2 - verification.attempts;
      return NextResponse.json(
        { error: "Code incorrect", attemptsLeft: attemptsLeft },
        { status: 400 }
      );
    }

    const { data: oldUser } = await supabase
      .from("users")
      .select("*, lawyers(*)")
      .eq("id", lawyerId)
      .single();

    if (!oldUser || !oldUser.lawyers) {
      return NextResponse.json(
        { error: "Profil introuvable" },
        { status: 404 }
      );
    }

    if (oldUser.lawyers.is_claimed) {
      return NextResponse.json(
        { error: "Ce profil a déjà été réclamé.", alreadyClaimed: true },
        { status: 400 }
      );
    }

    if (oldUser.professional_email !== email) {
      return NextResponse.json(
        { error: "Email ne correspond pas au profil" },
        { status: 400 }
      );
    }

    const { data: existingAuthData } = await supabase.auth.admin.listUsers();
    const existingAuthUser = existingAuthData?.users.find(
      (u) => u.email === email
    );

    if (existingAuthUser) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email.", alreadyExists: true },
        { status: 400 }
      );
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
          migrated_from: lawyerId,
          claim_date: new Date().toISOString(),
        },
      });

    if (authError || !authData.user) {
      console.error("Erreur création Auth:", authError);
      return NextResponse.json(
        { error: "Erreur lors de la création du compte" },
        { status: 500 }
      );
    }

    const newAuthId = authData.user.id;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const { error: updateUserError } = await supabase
      .from("users")
      .update({
        email: email,
        first_name: oldUser.first_name,
        last_name: oldUser.last_name,
        phone: oldUser.phone,
        mobile: oldUser.mobile,
        user_type: "lawyer",
        location: oldUser.location,
        address: oldUser.address,
        avatar_url: oldUser.avatar_url,
        professional_email: null,
        gender: oldUser.gender,
        languages: oldUser.languages,
        website: oldUser.website,
        verified: true,
        created_at: oldUser.created_at,
        updated_at: new Date().toISOString(),
      })
      .eq("id", newAuthId);

    if (updateUserError) {
      console.error("Erreur update user:", updateUserError);
      await supabase.auth.admin.deleteUser(newAuthId);
      return NextResponse.json(
        { error: "Erreur mise à jour utilisateur" },
        { status: 500 }
      );
    }

    const { error: updateLawyerError } = await supabase.from("lawyers").insert({
      id: newAuthId,
      bar_number: oldUser.lawyers.bar_number,
      specializations: oldUser.lawyers.specializations,
      wilayas: oldUser.lawyers.wilayas,
      experience_years: oldUser.lawyers.experience_years,
      consultation_price: oldUser.lawyers.consultation_price,
      bio: oldUser.lawyers.bio,
      is_claimed: true,
      claimed_at: new Date().toISOString(),
      is_verified: true,
      is_available: oldUser.lawyers.is_available,
      total_consultations: oldUser.lawyers.total_consultations,
      average_rating: oldUser.lawyers.average_rating,
      total_reviews: oldUser.lawyers.total_reviews,
      reviews_count: oldUser.lawyers.reviews_count,
      rating_google: oldUser.lawyers.rating_google,
      reviews_count_google: oldUser.lawyers.reviews_count_google,
      rating_mizan: oldUser.lawyers.rating_mizan,
      reviews_count_mizan: oldUser.lawyers.reviews_count_mizan,
      previous_id: lawyerId,
      created_at: oldUser.lawyers.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (updateLawyerError) {
      console.error("Erreur update lawyer:", updateLawyerError);
      await supabase.from("users").delete().eq("id", newAuthId);
      await supabase.auth.admin.deleteUser(newAuthId);
      return NextResponse.json(
        { error: "Erreur mise à jour profil avocat" },
        { status: 500 }
      );
    }

    try {
      await supabase
        .from("consultations")
        .update({ lawyer_id: newAuthId })
        .eq("lawyer_id", lawyerId);

      await supabase
        .from("reviews")
        .update({ lawyer_id: newAuthId })
        .eq("lawyer_id", lawyerId);

      await supabase
        .from("profile_views")
        .update({ lawyer_id: newAuthId })
        .eq("lawyer_id", lawyerId);
    } catch (migrationError) {
      console.error("Erreur migration:", migrationError);
    }

    await supabase
      .from("claim_verification_codes")
      .update({ used: true })
      .eq("id", verification.id);

    try {
      await supabase.from("lawyers").delete().eq("id", lawyerId);
      await supabase.from("users").delete().eq("id", lawyerId);
    } catch (deleteError) {
      console.error("Erreur suppression:", deleteError);
    }

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || "https://mizan-dz.com"}/api/admin/notify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: "✅ Profil avocat réclamé",
            title: "Un avocat a réclamé son profil",
            message: `
              <p><strong>Nom :</strong> ${oldUser.first_name} ${oldUser.last_name}</p>
              <p><strong>Email :</strong> ${email}</p>
              <p><strong>Ancien ID :</strong> ${lawyerId}</p>
              <p><strong>Nouvel ID :</strong> ${newAuthId}</p>
            `,
          }),
        }
      );
    } catch (notifError) {
      console.error("Erreur notification:", notifError);
    }

    return NextResponse.json({
      success: true,
      message: "Profil activé avec succès",
    });
  } catch (error: any) {
    console.error("Erreur claim-profile:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
