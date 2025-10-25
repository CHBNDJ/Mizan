import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  const token_hash = requestUrl.searchParams.get("token_hash");
  const token = requestUrl.searchParams.get("token");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next");

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  // ✅ FLUX PKCE (code) - Créer la session d'abord
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("❌ [CALLBACK] Erreur échange code:", error);
      return NextResponse.redirect(
        new URL(
          "/auth/client/login?error=confirmation_failed",
          requestUrl.origin
        )
      );
    }

    console.log("✅ [CALLBACK] Session créée");

    // ✅ PRIORITÉ : Si paramètre "next" existe, rediriger là-bas
    if (next) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }

    // ✅ Sinon, redirection normale selon user_type
    const { data: profile } = await supabase
      .from("users")
      .select("user_type")
      .eq("id", data.user.id)
      .single();

    const redirectPath =
      profile?.user_type === "lawyer" ? "/lawyer/dashboard" : "/";

    return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
  }

  // ✅ FLUX OTP/Recovery avec token
  const tokenToUse = token_hash || token;

  if (tokenToUse) {
    // Type recovery ou pas de type (parfois Supabase n'envoie pas le type)
    if (type === "recovery" || !type) {
      const { error } = await supabase.auth.verifyOtp({
        type: "recovery",
        token_hash: tokenToUse,
      });

      if (error) {
        console.error("❌ [CALLBACK] Erreur recovery:", error);
        return NextResponse.redirect(
          new URL("/auth/client/login?error=recovery_failed", requestUrl.origin)
        );
      }

      // Si next existe, rediriger là-bas
      if (next) {
        console.log("✅ [CALLBACK] Redirection recovery vers 'next':", next);
        return NextResponse.redirect(new URL(next, requestUrl.origin));
      }

      // Sinon, rediriger vers reset-password
      const resetUrl = new URL("/auth/reset-password", requestUrl.origin);

      return NextResponse.redirect(resetUrl);
    }

    // Autres types d'OTP
    if (type) {
      const { error } = await supabase.auth.verifyOtp({
        type: type as any,
        token_hash: tokenToUse,
      });

      if (error) {
        console.error("❌ [CALLBACK] Erreur OTP:", error);
        return NextResponse.redirect(
          new URL(
            "/auth/client/login?error=verification_failed",
            requestUrl.origin
          )
        );
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("user_type")
          .eq("id", user.id)
          .single();

        const redirectPath =
          profile?.user_type === "lawyer" ? "/lawyer/dashboard" : "/";

        return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
      }
    }
  }

  // Aucun paramètre valide
  return NextResponse.redirect(new URL("/", requestUrl.origin));
}
