// import { createAdminClient } from "@/lib/supabase/server";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//   try {
//     const { lawyerId, email, password } = await request.json();
//     const supabase = await createAdminClient();

//     const { data: oldUser } = await supabase
//       .from("users")
//       .select("*")
//       .eq("id", lawyerId)
//       .single();

//     const { data: oldLawyer } = await supabase
//       .from("lawyers")
//       .select("*")
//       .eq("id", lawyerId)
//       .single();

//     if (!oldUser || !oldLawyer) {
//       return NextResponse.json(
//         { error: "Profil introuvable" },
//         { status: 404 }
//       );
//     }

//     if (oldUser.professional_email !== email) {
//       return NextResponse.json(
//         { error: "Email ne correspond pas au profil" },
//         { status: 400 }
//       );
//     }

//     const { data: existingAuthData } = await supabase.auth.admin.listUsers();
//     const existingAuthUser = existingAuthData?.users.find(
//       (u) => u.email === email
//     );

//     if (existingAuthUser) {
//       return NextResponse.json(
//         {
//           error:
//             "Un compte existe déjà avec cet email. Connectez-vous directement.",
//         },
//         { status: 400 }
//       );
//     }

//     const { data: authData, error: authError } =
//       await supabase.auth.admin.createUser({
//         email: email,
//         password: password,
//         email_confirm: true,
//       });

//     if (authError) {
//       console.error("Erreur création auth:", authError);
//       return NextResponse.json({ error: authError.message }, { status: 500 });
//     }

//     const newAuthId = authData.user.id;

//     await new Promise((resolve) => setTimeout(resolve, 1500));

//     await supabase.from("lawyers").delete().eq("id", newAuthId);
//     await supabase.from("users").delete().eq("id", newAuthId);

//     await new Promise((resolve) => setTimeout(resolve, 500));

//     const { error: userError } = await supabase.from("users").insert({
//       id: newAuthId,
//       email: email,
//       first_name: oldUser.first_name,
//       last_name: oldUser.last_name,
//       phone: oldUser.phone,
//       mobile: oldUser.mobile,
//       user_type: "lawyer",
//       location: oldUser.location,
//       address: oldUser.address,
//       avatar_url: oldUser.avatar_url,
//       professional_email: email,
//       gender: oldUser.gender,
//       languages: oldUser.languages,
//       website: oldUser.website,
//       verified: true,
//       created_at: oldUser.created_at,
//       updated_at: new Date().toISOString(),
//     });

//     if (userError) {
//       console.error("Erreur création user:", userError);
//       await supabase.auth.admin.deleteUser(newAuthId);
//       return NextResponse.json({ error: userError.message }, { status: 500 });
//     }

//     const { error: lawyerError } = await supabase.from("lawyers").insert({
//       id: newAuthId,
//       bar_number: oldLawyer.bar_number,
//       specializations: oldLawyer.specializations,
//       wilayas: oldLawyer.wilayas,
//       experience_years: oldLawyer.experience_years,
//       consultation_price: oldLawyer.consultation_price,
//       bio: oldLawyer.bio,
//       is_claimed: true,
//       claimed_at: new Date().toISOString(),
//       is_verified: true,
//       is_available: oldLawyer.is_available,
//       total_consultations: oldLawyer.total_consultations,
//       average_rating: oldLawyer.average_rating,
//       total_reviews: oldLawyer.total_reviews,
//       created_at: oldLawyer.created_at,
//       updated_at: new Date().toISOString(),
//     });

//     if (lawyerError) {
//       console.error("Erreur création lawyer:", lawyerError);
//       await supabase.from("users").delete().eq("id", newAuthId);
//       await supabase.auth.admin.deleteUser(newAuthId);
//       return NextResponse.json({ error: lawyerError.message }, { status: 500 });
//     }

//     await supabase.from("lawyers").delete().eq("id", lawyerId);
//     await supabase.from("users").delete().eq("id", lawyerId);

//     return NextResponse.json({
//       success: true,
//       message: "Profil activé avec succès",
//     });
//   } catch (error: any) {
//     console.error("💥 Erreur claim profil:", error);
//     return NextResponse.json(
//       {
//         error: error.message || "Erreur lors de l'activation du profil",
//       },
//       { status: 500 }
//     );
//   }
// }

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
      professional_email: email,
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
      rating: oldLawyer.rating,
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
