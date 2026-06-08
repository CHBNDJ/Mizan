import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const mizanLogoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
     fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
  <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
  <path d="M7 21h10"/>
  <path d="M12 3v18"/>
  <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
</svg>`;

const buildEmailHtml = (
  firstName: string,
  lastName: string,
  profession: string = "avocat",
  barreau?: string
) => {
  const profLabel =
    {
      avocat: "avocat",
      notaire: "notaire",
      huissier: "huissier",
      comptable: "comptable",
    }[profession] ?? "professionnel";
  const civilitePlaceholder =
    profession === "avocat" ||
    profession === "notaire" ||
    profession === "huissier"
      ? `Maître ${firstName} ${lastName}`
      : `${firstName} ${lastName}`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Votre compte Mizan est vérifié</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px">
  <tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">

    <!-- Logo -->
    <tr>
      <td style="padding-bottom:20px">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:#0f6e56;width:32px;height:32px;border-radius:8px;text-align:center;vertical-align:middle">
              ${mizanLogoSvg}
            </td>
            <td style="padding-left:10px;font-size:17px;font-weight:700;color:#0f2d24;letter-spacing:-.02em">
              Mizan
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Card principale -->
    <tr>
      <td style="background:#ffffff;border-top:3px solid #0f6e56;border-radius:0 0 12px 12px;padding:32px">

        <!-- Badge statut -->
        <table cellpadding="0" cellspacing="0" style="margin-bottom:6px">
          <tr>
            <td style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#0f6e56">
              Compte vérifié
            </td>
          </tr>
        </table>

        <!-- Titre -->
        <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:#0f2d24;line-height:1.2">
          Bienvenue, ${firstName}.
        </p>
        <p style="margin:0 0 20px;font-size:13px;color:#64748b">
          Votre profil de ${profLabel}${barreau ? ` (Barreau de ${barreau})` : ""} est maintenant actif sur Mizan.
        </p>

        <!-- Séparateur -->
        <table cellpadding="0" cellspacing="0" style="margin-bottom:20px">
          <tr><td style="width:36px;height:2px;background:#0f6e56;font-size:0">&nbsp;</td></tr>
        </table>

        <!-- Corps -->
        <p style="margin:0 0 24px;font-size:13px;color:#334155;line-height:1.75">
          Notre équipe a examiné et validé votre inscription. Vous pouvez dès maintenant
          accéder à votre espace professionnel, compléter votre profil et recevoir
          vos premières demandes de consultation.
        </p>

        <!-- CTA outline -->
        <table cellpadding="0" cellspacing="0" style="margin-bottom:28px">
          <tr>
            <td style="border:1.5px solid #0f6e56;border-radius:8px;padding:10px 24px">
              <a href="https://mizan-dz.com/auth/lawyer/login"
                 style="font-size:13px;font-weight:700;color:#0f6e56;text-decoration:none;display:block">
                Accéder à mon espace
              </a>
            </td>
          </tr>
        </table>

        <!-- Footer card -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-top:0.5px solid #e2e8f0;padding-top:16px;font-size:11px;color:#94a3b8">
              Une question ?
              <a href="mailto:support@mizan-dz.com" style="color:#0f6e56;text-decoration:none">
                support@mizan-dz.com
              </a>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- Footer global -->
    <tr>
      <td style="padding-top:16px;text-align:center;font-size:10px;color:#94a3b8">
        © 2026 Mizan ·
        <a href="https://mizan-dz.com" style="color:#94a3b8;text-decoration:none">mizan-dz.com</a>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;
};

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const lawyerId = payload.record?.id;
    const wasVerified = payload.old_record?.is_verified;
    const isNowVerified = payload.record?.is_verified;

    if (!lawyerId || wasVerified || !isNowVerified) {
      return NextResponse.json({ message: "Ignoré" });
    }

    const { data: user, error: userErr } = await supabaseAdmin
      .from("users")
      .select("email, first_name, last_name")
      .eq("id", lawyerId)
      .single();

    const { data: lawyer } = await supabaseAdmin
      .from("lawyers")
      .select("profession, bar_number")
      .eq("id", lawyerId)
      .single();

    if (userErr || !user) {
      console.error("Avocat non trouvé:", lawyerId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await resend.emails.send({
      from: "Mizan <noreply@mizan-dz.com>",
      to: user.email,
      subject: "Votre compte Mizan a été vérifié",
      html: buildEmailHtml(
        user.first_name,
        user.last_name,
        lawyer?.profession ?? "avocat",
        lawyer?.bar_number ?? undefined
      ),
    });

    console.log(`Email envoyé à ${user.email}`);
    return NextResponse.json({ success: true, email: user.email });
  } catch (error: any) {
    console.error("Erreur webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
