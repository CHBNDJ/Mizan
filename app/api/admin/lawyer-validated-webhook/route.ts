import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const PROF_CONFIG: Record<
  string,
  {
    label: string;
    numLabel: string;
    civilite: (fn: string, ln: string) => string;
  }
> = {
  avocat: {
    label: "avocat",
    numLabel: "Barreau",
    civilite: (fn, ln) => `Maître ${fn} ${ln}`,
  },
  notaire: {
    label: "notaire",
    numLabel: "Chambre des notaires",
    civilite: (fn, ln) => `Maître ${fn} ${ln}`,
  },
  huissier: {
    label: "huissier",
    numLabel: "N° huissier",
    civilite: (fn, ln) => `Maître ${fn} ${ln}`,
  },
  comptable: {
    label: "comptable",
    numLabel: "N° ONEC / ONCA",
    civilite: (fn, ln) => `${fn} ${ln}`,
  },
  "expert-comptable": {
    label: "expert-comptable",
    numLabel: "N° ONEC",
    civilite: (fn, ln) => `${fn} ${ln}`,
  },
  traducteur: {
    label: "traducteur assermenté",
    numLabel: "N° d'agrément (Ministère de la Justice)",
    civilite: (fn, ln) => `${fn} ${ln}`,
  },
};

const buildEmailHtml = (
  firstName: string,
  lastName: string,
  profession = "avocat",
  barNumber?: string
) => {
  const cfg = PROF_CONFIG[profession] ?? PROF_CONFIG.avocat;
  const civilite = cfg.civilite(firstName, lastName);
  const numStr = barNumber
    ? `${cfg.numLabel} : <strong>${barNumber}</strong>`
    : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:40px 16px;">
  <tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;">

    <tr>
      <td style="padding-bottom:24px;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:#0d9488;width:36px;height:36px;border-radius:10px;text-align:center;vertical-align:middle;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
                <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
                <path d="M7 21h10"/><path d="M12 3v18"/>
                <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
              </svg>
            </td>
            <td style="padding-left:10px;font-size:18px;font-weight:700;color:#134e4a;letter-spacing:-.02em;">Mizan</td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08);">

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:linear-gradient(135deg,#0d9488 0%,#0f766e 100%);padding:36px 36px 32px;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#99f6e4;">Compte vérifié</p>
              <p style="margin:0;font-size:26px;font-weight:700;color:#ffffff;line-height:1.2;">
                Bienvenue, ${firstName}.
              </p>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:32px 36px;">

              <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.7;">
                Bonjour ${civilite},
              </p>

              <p style="margin:0 0 20px;font-size:14px;color:#334155;line-height:1.7;">
                Notre équipe a examiné et validé votre inscription en tant que <strong>${cfg.label}</strong>.
                Votre profil est maintenant <strong>actif et visible</strong> sur Mizan.
                ${numStr ? `<br><span style="color:#64748b;font-size:13px;">${numStr}</span>` : ""}
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdfa;border-radius:10px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 10px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#0f766e;">Vos prochaines étapes</p>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#334155;">✓&nbsp;&nbsp;Complétez votre profil (photo, bio)</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#334155;">✓&nbsp;&nbsp;Définissez vos tarifs de consultation</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#334155;">✓&nbsp;&nbsp;Activez les notifications push</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#0d9488;border-radius:10px;padding:12px 28px;">
                    <a href="https://mizan-dz.com/auth/lawyer/login" style="font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;display:block;">
                      Accéder à mon espace →
                    </a>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid #e2e8f0;padding-top:20px;font-size:12px;color:#94a3b8;">
                    Une question ?
                    <a href="mailto:support@mizan-dz.com" style="color:#0d9488;text-decoration:none;font-weight:600;">support@mizan-dz.com</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>

      </td>
    </tr>

    <tr>
      <td style="padding-top:20px;text-align:center;font-size:11px;color:#94a3b8;">
        © 2026 Mizan ·
        <a href="https://mizan-dz.com" style="color:#94a3b8;text-decoration:none;">mizan-dz.com</a>
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await resend.emails.send({
      from: "Mizan <noreply@mizan-dz.com>",
      to: user.email,
      subject: "✅ Votre compte Mizan est maintenant actif",
      html: buildEmailHtml(
        user.first_name,
        user.last_name,
        lawyer?.profession ?? "avocat",
        lawyer?.bar_number ?? undefined
      ),
    });

    return NextResponse.json({ success: true, email: user.email });
  } catch (error: any) {
    console.error("Erreur webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
