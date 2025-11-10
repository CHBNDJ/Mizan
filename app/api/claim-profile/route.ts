import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { lawyerId, email, password } = await request.json();
    const supabase = await createAdminClient();

    const { data: oldUser } = await supabase
      .from("users")
      .select("*")
      .eq("id", lawyerId)
      .single();

    const { data: oldLawyer } = await supabase
      .from("lawyers")
      .select("*")
      .eq("id", lawyerId)
      .single();

    if (!oldUser || !oldLawyer) {
      return NextResponse.json(
        { error: "Profil introuvable" },
        { status: 404 }
      );
    }

    if (oldLawyer.is_claimed) {
      return NextResponse.json(
        {
          error:
            "Ce profil a déjà été réclamé. Connectez-vous directement avec vos identifiants.",
          alreadyClaimed: true,
        },
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
        {
          error:
            "Un compte existe déjà avec cet email. Connectez-vous directement.",
          alreadyExists: true,
        },
        { status: 400 }
      );
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
      });

    if (authError) {
      console.error("Erreur création auth:", authError);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    const newAuthId = authData.user.id;

    await new Promise((resolve) => setTimeout(resolve, 1500));

    await supabase.from("lawyers").delete().eq("id", newAuthId);
    await supabase.from("users").delete().eq("id", newAuthId);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const { error: userError } = await supabase.from("users").insert({
      id: newAuthId,
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
    });

    if (userError) {
      console.error("Erreur création user:", userError);
      await supabase.auth.admin.deleteUser(newAuthId);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    const { error: lawyerError } = await supabase.from("lawyers").insert({
      id: newAuthId,
      bar_number: oldLawyer.bar_number,
      specializations: oldLawyer.specializations,
      wilayas: oldLawyer.wilayas,
      experience_years: oldLawyer.experience_years,
      consultation_price: oldLawyer.consultation_price,
      bio: oldLawyer.bio,
      is_claimed: true,
      claimed_at: new Date().toISOString(),
      is_verified: true,
      is_available: oldLawyer.is_available,
      total_consultations: oldLawyer.total_consultations,
      average_rating: oldLawyer.average_rating,
      total_reviews: oldLawyer.total_reviews,
      reviews_count: oldLawyer.reviews_count,
      rating_google: oldLawyer.rating_google,
      reviews_count_google: oldLawyer.reviews_count_google,
      rating_mizan: oldLawyer.rating_mizan,
      reviews_count_mizan: oldLawyer.reviews_count_mizan,
      created_at: oldLawyer.created_at,
      updated_at: new Date().toISOString(),
    });

    if (lawyerError) {
      console.error("Erreur création lawyer:", lawyerError);
      await supabase.from("users").delete().eq("id", newAuthId);
      await supabase.auth.admin.deleteUser(newAuthId);
      return NextResponse.json({ error: lawyerError.message }, { status: 500 });
    }

    await supabase.from("lawyers").delete().eq("id", lawyerId);
    await supabase.from("users").delete().eq("id", lawyerId);

    // ✅ LOGS DE DEBUG
    console.log("🔍 ========================================");
    console.log("🔍 DÉBUT NOTIFICATION CLAIM");
    console.log("🔍 Email avocat:", email);
    console.log("🔍 Nom:", oldUser.first_name, oldUser.last_name);
    console.log("🔍 ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
    console.log("🔍 RESEND_FROM_EMAIL:", process.env.RESEND_FROM_EMAIL);
    console.log(
      "🔍 RESEND_API_KEY:",
      process.env.RESEND_API_KEY ? "✅ Présente" : "❌ Manquante"
    );
    console.log("🔍 ========================================");

    // ✅ ENVOI DE LA NOTIFICATION (C'EST CE QUI MANQUAIT !)
    try {
      const wilayasText = oldLawyer.wilayas?.join(", ") || "Non spécifié";
      const specializationsText =
        oldLawyer.specializations?.slice(0, 3).join(", ") || "Non spécifié";
      const hasMoreSpecs = oldLawyer.specializations?.length > 3;

      console.log("🔍 Tentative d'envoi notification claim...");

      const notifResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || "https://mizan-dz.com"}/api/admin/notify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: "✅ Profil avocat réclamé avec succès",
            title: "Un avocat a réclamé son profil",
            message: `
            <div style="background: #d1fae5; padding: 15px; border-left: 4px solid #10b981; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0; color: #065f46; font-weight: 600;">
                ✅ Un avocat a activé son compte en réclamant son profil statique
              </p>
            </div>

            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>👤 Nom :</strong> ${oldUser.first_name} ${oldUser.last_name}</p>
              <p style="margin: 5px 0;"><strong>📧 Email :</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>📱 Mobile :</strong> ${oldUser.mobile || "Non spécifié"}</p>
              ${oldUser.phone ? `<p style="margin: 5px 0;"><strong>☎️ Fixe :</strong> ${oldUser.phone}</p>` : ""}
              <p style="margin: 5px 0;"><strong>🔢 N° Carte Pro :</strong> ${oldLawyer.bar_number}</p>
              <p style="margin: 5px 0;"><strong>📍 Wilayas :</strong> ${wilayasText}</p>
              <p style="margin: 5px 0;"><strong>🎓 Spécialités :</strong> ${specializationsText}${hasMoreSpecs ? "..." : ""}</p>
              <p style="margin: 5px 0;"><strong>⏱️ Expérience :</strong> ${oldLawyer.experience_years} ans</p>
              ${oldLawyer.consultation_price ? `<p style="margin: 5px 0;"><strong>💰 Tarif :</strong> ${oldLawyer.consultation_price.toLocaleString("fr-DZ")} DZD</p>` : ""}
              <p style="margin: 5px 0;"><strong>🆔 Ancien ID :</strong> ${lawyerId}</p>
              <p style="margin: 5px 0;"><strong>🆔 Nouvel ID :</strong> ${newAuthId}</p>
              <p style="margin: 5px 0;"><strong>📅 Date réclamation :</strong> ${new Date().toLocaleDateString(
                "fr-FR",
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://supabase.com/dashboard/project/qkjxbmhrwkwnweepvhum/editor"
                 style="background: #0891b2; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Voir dans Supabase
              </a>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 14px; margin-bottom: 10px;">
                ℹ️ <strong>Actions effectuées automatiquement :</strong>
              </p>
              <ul style="color: #64748b; font-size: 14px; margin: 0; padding-left: 20px;">
                <li>Compte utilisateur créé avec l'email : ${email}</li>
                <li>Profil avocat marqué comme réclamé (is_claimed = true)</li>
                <li>Profil vérifié automatiquement (is_verified = true)</li>
                <li>Ancien profil statique supprimé</li>
                <li>L'avocat peut maintenant se connecter et gérer son profil</li>
              </ul>
            </div>

            <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                ⚠️ <strong>À vérifier :</strong> Confirme que les informations du profil sont correctes et que le numéro de carte professionnelle est valide.
              </p>
            </div>
          `,
            priority: "normal",
          }),
        }
      );

      console.log("🔍 Réponse notification claim:", notifResponse.status);

      const notifData = await notifResponse.json();
      console.log("🔍 Data notification claim:", notifData);

      if (notifResponse.ok) {
        console.log("✅ Admin notifié du claim de profil");
      } else {
        console.error("❌ Erreur notification claim:", notifData);
      }
    } catch (notifError) {
      console.error("⚠️ Erreur notification admin claim:", notifError);
      // Ne pas bloquer le claim si la notification échoue
    }

    return NextResponse.json({
      success: true,
      message: "Profil activé avec succès",
    });
  } catch (error: any) {
    console.error("💥 Erreur claim profil:", error);
    return NextResponse.json(
      {
        error: error.message || "Erreur lors de l'activation du profil",
      },
      { status: 500 }
    );
  }
}
