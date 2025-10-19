import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const token_hash = requestUrl.searchParams.get("token_hash");
  const token = requestUrl.searchParams.get("token");
  const type = requestUrl.searchParams.get("type");

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

  // Flux PKCE (code)
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Erreur échange code PKCE:", error);
      return NextResponse.redirect(
        new URL(
          "/auth/client/login?error=confirmation_failed",
          requestUrl.origin
        )
      );
    }

    // Récupérer le type d'utilisateur pour redirection
    const { data: profile } = await supabase
      .from("users")
      .select("user_type")
      .eq("id", data.user.id)
      .single();

    const redirectPath =
      profile?.user_type === "lawyer" ? "/lawyer/dashboard" : "/";

    return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
  }

  // Flux OTP (token/token_hash)
  const tokenToUse = token_hash || token;
  if (tokenToUse && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash: tokenToUse,
    });

    if (error) {
      console.error("Erreur vérification OTP:", error);
      return NextResponse.redirect(
        new URL(
          "/auth/client/login?error=verification_failed",
          requestUrl.origin
        )
      );
    }

    // Récupérer le type d'utilisateur pour redirection
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

  // Aucun paramètre valide
  return NextResponse.redirect(new URL("/", requestUrl.origin));
}
