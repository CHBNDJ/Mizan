// import { Resend } from "resend";
// import { NextRequest, NextResponse } from "next/server";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(request: NextRequest) {
//   try {
//     const { email, code, lawyerName } = await request.json();

//     const { data, error } = await resend.emails.send({
//       from: "Mizan <noreply@mizan-dz.com>",
//       to: email,
//       subject: "🔐 Votre code de vérification Mizan",
//       html: `
//         <!DOCTYPE html>
//         <html>
//           <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f3f4f6;">
//             <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px;">
//               <h1 style="color: #0d9488; text-align: center;">🔐 Code de Vérification</h1>

//               <p style="font-size: 16px;">Bonjour <strong>${lawyerName}</strong>,</p>

//               <p>Vous avez demandé à réclamer votre profil sur Mizan.</p>

//               <div style="background: #f1f5f9; border: 2px dashed #0d9488; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
//                 <p style="margin: 0; color: #64748b; font-size: 14px;">Votre code de vérification :</p>
//                 <h2 style="margin: 10px 0; font-size: 36px; color: #0d9488; letter-spacing: 10px;">${code}</h2>
//               </div>

//               <p style="color: #64748b; font-size: 14px;">
//                 ⏱️ Ce code expire dans <strong>10 minutes</strong>.
//               </p>

//               <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b;">
//                 Si vous n'avez pas demandé ce code, ignorez cet email.
//               </p>
//             </div>
//           </body>
//         </html>
//       `,
//     });

//     if (error) {
//       console.error("Erreur envoi code vérification:", error);
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     return NextResponse.json({ success: true });
//   } catch (error: any) {
//     console.error("Erreur envoi code vérification:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, lawyerId } = await request.json();

    if (!email || !lawyerId) {
      return NextResponse.json(
        { error: "Email et ID avocat requis" },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    // 1. Vérifier que le profil existe et n'est pas déjà réclamé
    const { data: lawyer, error: lawyerError } = await supabase
      .from("users")
      .select("*, lawyers(*)")
      .eq("id", lawyerId)
      .single();

    if (lawyerError || !lawyer || !lawyer.lawyers) {
      return NextResponse.json(
        { error: "Profil introuvable" },
        { status: 404 }
      );
    }

    // 2. Vérifier que le profil n'est pas déjà réclamé
    if (lawyer.lawyers.is_claimed) {
      return NextResponse.json(
        { error: "Ce profil a déjà été réclamé" },
        { status: 400 }
      );
    }

    // 3. Vérifier que l'email correspond
    if (lawyer.professional_email !== email) {
      return NextResponse.json(
        { error: "Cet email ne correspond pas au profil" },
        { status: 400 }
      );
    }

    // 4. Vérifier la limite de codes (max 3 par heure)
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const { data: recentCodes } = await supabase
      .from("claim_verification_codes")
      .select("id")
      .eq("lawyer_id", lawyerId)
      .eq("email", email)
      .gte("created_at", oneHourAgo);

    if (recentCodes && recentCodes.length >= 3) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans 1 heure." },
        { status: 429 }
      );
    }

    // 5. Générer un code à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 6. Stocker le code dans la base de données
    const expiresAt = new Date(Date.now() + 15 * 60000).toISOString();

    const { error: insertError } = await supabase
      .from("claim_verification_codes")
      .insert({
        lawyer_id: lawyerId,
        email: email,
        code: code,
        expires_at: expiresAt,
        attempts: 0,
        used: false,
      });

    if (insertError) {
      console.error("Erreur insertion code:", insertError);
      return NextResponse.json(
        { error: "Erreur lors de la génération du code" },
        { status: 500 }
      );
    }

    // 7. Envoyer l'email avec Resend
    try {
      const { error: emailError } = await resend.emails.send({
        from: "Mizan <noreply@mizan-dz.com>",
        to: email,
        subject: "🔐 Code de vérification - Réclamation de profil Mizan",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f3f4f6;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px;">
              <div style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0;">🔐 Code de Vérification</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Réclamation de votre profil Mizan</p>
              </div>
              
              <div style="padding: 30px;">
                <p>Bonjour <strong>${lawyer.first_name} ${lawyer.last_name}</strong>,</p>
                
                <p>Vous avez demandé à réclamer votre profil d'avocat sur <strong>Mizan</strong>.</p>
                
                <div style="background: white; border: 3px dashed #0d9488; border-radius: 10px; padding: 30px; text-align: center; margin: 20px 0;">
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Votre code de vérification :</p>
                  <div style="font-size: 48px; font-weight: bold; color: #0d9488; letter-spacing: 8px; font-family: 'Courier New', monospace;">${code}</div>
                  <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px;">
                    ⏱️ Ce code est valable pendant <strong>15 minutes</strong>
                  </p>
                </div>
                
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #92400e;">
                    <strong>⚠️ Attention :</strong> Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
                  </p>
                </div>
                
                <p>Après avoir entré ce code, vous pourrez :</p>
                <ul>
                  <li>✅ Gérer votre profil professionnel</li>
                  <li>✅ Recevoir et gérer vos consultations</li>
                  <li>✅ Interagir avec vos clients</li>
                </ul>
                
                <div style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
                  <p>Cet email a été envoyé par <strong>Mizan</strong></p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      if (emailError) {
        console.error("Erreur envoi email:", emailError);
        await supabase
          .from("claim_verification_codes")
          .delete()
          .eq("lawyer_id", lawyerId)
          .eq("code", code);

        return NextResponse.json(
          { error: "Erreur lors de l'envoi de l'email" },
          { status: 500 }
        );
      }
    } catch (emailError: any) {
      console.error("Erreur envoi email:", emailError);
      await supabase
        .from("claim_verification_codes")
        .delete()
        .eq("lawyer_id", lawyerId)
        .eq("code", code);

      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Code envoyé avec succès",
      expiresIn: 15,
    });
  } catch (error: any) {
    console.error("Erreur send-claim-code:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
