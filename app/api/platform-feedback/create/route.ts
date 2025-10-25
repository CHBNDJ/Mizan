// import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@/lib/supabase/server";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(request: NextRequest) {
//   try {
//     const supabase = await createClient();
//     const { type, message, title, allowPublic, pageUrl } = await request.json();

//     // Validation
//     if (!type || !message?.trim()) {
//       return NextResponse.json(
//         { error: "Type et message requis" },
//         { status: 400 }
//       );
//     }

//     // Récupérer l'utilisateur (optionnel, peut être anonyme)
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     let userData = null;
//     if (user) {
//       const { data } = await supabase
//         .from("users")
//         .select("first_name, last_name, email, user_type")
//         .eq("id", user.id)
//         .single();
//       userData = data;
//     }

//     // Créer le feedback
//     const { data: feedback, error } = await supabase
//       .from("platform_feedbacks")
//       .insert({
//         user_id: user?.id || null,
//         user_name: userData
//           ? `${userData.first_name} ${userData.last_name}`
//           : null,
//         user_email: userData?.email || null,
//         user_type: userData?.user_type || "anonymous",
//         type,
//         title: title?.trim() || null,
//         message: message.trim(),
//         page_url: pageUrl || null,
//         status: "pending",
//         is_public: type === "testimonial" && allowPublic ? false : false,
//         browser: request.headers.get("user-agent")?.substring(0, 200),
//       })
//       .select()
//       .single();

//     if (error) throw error;

//     // 📧 Envoyer email notification à l'admin
//     try {
//       const typeEmojis = {
//         bug: "🐛",
//         suggestion: "💡",
//         testimonial: "⭐",
//         other: "💬",
//       };

//       const typeLabels = {
//         bug: "Bug signalé",
//         suggestion: "Suggestion",
//         testimonial: "Témoignage",
//         other: "Feedback",
//       };

//       await resend.emails.send({
//         from: "Mizan System <noreply@mizan-dz.com>",
//         to: "admin@mizan-dz.com",
//         subject: `${typeEmojis[type as keyof typeof typeEmojis]} Nouveau feedback : ${typeLabels[type as keyof typeof typeLabels]}`,
//         html: `
//           <!DOCTYPE html>
//           <html>
//             <body style="font-family: Arial, sans-serif; padding: 20px;">
//               <h2 style="color: #0d9488;">${typeEmojis[type as keyof typeof typeEmojis]} ${typeLabels[type as keyof typeof typeLabels]}</h2>

//               <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
//                 ${
//                   userData
//                     ? `
//                   <p><strong>Utilisateur :</strong> ${userData.first_name} ${userData.last_name} (${userData.user_type})</p>
//                   <p><strong>Email :</strong> ${userData.email}</p>
//                 `
//                     : `
//                   <p><strong>Utilisateur :</strong> Anonyme</p>
//                 `
//                 }
//                 <p><strong>Date :</strong> ${new Date().toLocaleString("fr-FR")}</p>
//                 ${pageUrl ? `<p><strong>Page :</strong> ${pageUrl}</p>` : ""}
//               </div>

//               ${title ? `<h3>${title}</h3>` : ""}

//               <div style="background: #f1f5f9; padding: 15px; border-radius: 5px;">
//                 <p style="white-space: pre-wrap;">${message}</p>
//               </div>

//               ${
//                 type === "testimonial" && allowPublic
//                   ? `
//                 <p style="margin-top: 20px; color: #0d9488;">
//                   ✅ L'utilisateur a autorisé la publication de ce témoignage
//                 </p>
//               `
//                   : ""
//               }

//               <p style="margin-top: 20px;">
//                 <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/feedbacks/${feedback.id}"
//                    style="color: #0d9488;">
//                   Voir et traiter ce feedback
//                 </a>
//               </p>
//             </body>
//           </html>
//         `,
//       });
//     } catch (emailError) {
//       console.error("⚠️ Erreur email admin:", emailError);
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Merci pour votre feedback !",
//     });
//   } catch (error: any) {
//     console.error("Erreur création feedback:", error);
//     return NextResponse.json(
//       { error: "Erreur lors de l'envoi" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // ✅ AJOUTER await
    const supabase = await createClient();

    // ✅ VÉRIFICATION AUTHENTIFICATION (OBLIGATOIRE)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour envoyer un feedback" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, message, pageUrl, userId } = body;

    // ✅ VALIDATION
    if (!type || !message?.trim()) {
      return NextResponse.json(
        { error: "Type et message requis" },
        { status: 400 }
      );
    }

    if (!userId || userId !== user.id) {
      return NextResponse.json(
        { error: "Données utilisateur invalides" },
        { status: 403 }
      );
    }

    // ✅ Récupérer les infos utilisateur
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("first_name, last_name, email, user_type")
      .eq("id", user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // ✅ Créer le feedback
    const { data: feedback, error: insertError } = await supabase
      .from("platform_feedbacks")
      .insert({
        user_id: user.id,
        user_name: `${userData.first_name} ${userData.last_name}`,
        user_email: userData.email,
        user_type: userData.user_type,
        type,
        message: message.trim(),
        page_url: pageUrl || null,
        status: "pending",
        is_public: false,
        browser: request.headers.get("user-agent")?.substring(0, 200),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Erreur insertion feedback:", insertError);
      throw new Error("Erreur lors de l'enregistrement");
    }

    // ✅ Envoyer email notification à l'admin
    try {
      const typeEmojis: Record<string, string> = {
        bug: "🐛",
        suggestion: "💡",
        testimonial: "⭐",
        other: "💬",
      };

      const typeLabels: Record<string, string> = {
        bug: "Bug signalé",
        suggestion: "Suggestion",
        testimonial: "Témoignage",
        other: "Feedback",
      };

      await resend.emails.send({
        from: "Mizan System <noreply@mizan-dz.com>",
        to: process.env.ADMIN_EMAIL || "admin@mizan-dz.com",
        subject: `${typeEmojis[type]} Nouveau feedback : ${typeLabels[type]}`,
        html: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: Arial, sans-serif; padding: 20px; background: #f8fafc;">
              <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h2 style="color: #0d9488; margin-bottom: 20px;">
                  ${typeEmojis[type]} ${typeLabels[type]}
                </h2>

                <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 8px 0;"><strong>👤 Utilisateur :</strong> ${userData.first_name} ${userData.last_name}</p>
                  <p style="margin: 8px 0;"><strong>📧 Email :</strong> ${userData.email}</p>
                  <p style="margin: 8px 0;"><strong>🏷️ Type :</strong> ${userData.user_type === "lawyer" ? "Avocat" : "Client"}</p>
                  <p style="margin: 8px 0;"><strong>📅 Date :</strong> ${new Date().toLocaleString("fr-FR")}</p>
                  ${pageUrl ? `<p style="margin: 8px 0;"><strong>📄 Page :</strong> ${pageUrl}</p>` : ""}
                </div>

                <div style="background: #ffffff; padding: 20px; border-left: 4px solid #0d9488; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #334155;">Message :</h3>
                  <p style="white-space: pre-wrap; color: #475569; line-height: 1.6;">${message}</p>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/feedbacks"
                     style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                    Voir tous les feedbacks
                  </a>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      console.log("✅ Email admin envoyé");
    } catch (emailError) {
      console.error("⚠️ Erreur email admin:", emailError);
      // Ne pas faire échouer la requête si l'email échoue
    }

    return NextResponse.json({
      success: true,
      message: "Merci pour votre feedback !",
      feedback: feedback,
    });
  } catch (error: any) {
    console.error("❌ Erreur création feedback:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'envoi" },
      { status: 500 }
    );
  }
}
