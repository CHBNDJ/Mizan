import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next");

  console.log("🔍 [CALLBACK] Params:", {
    code: code?.substring(0, 10),
    type,
    next,
  });

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

  if (code) {
    console.log("🔄 [CALLBACK] Exchanging code for session...");

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("❌ [CALLBACK] Exchange error:", error);
      return NextResponse.redirect(
        new URL(
          "/auth/client/login?error=confirmation_failed",
          requestUrl.origin
        )
      );
    }

    console.log("✅ [CALLBACK] Code exchanged successfully");

    // Si type=recovery, c'est un password reset
    if (type === "recovery") {
      console.log(
        "🔐 [CALLBACK] Password reset detected, redirecting to /auth/reset-password"
      );
      return NextResponse.redirect(
        new URL("/auth/reset-password", requestUrl.origin)
      );
    }

    // Si on a un paramètre 'next', on redirige là
    if (next) {
      console.log(`➡️  [CALLBACK] Redirecting to: ${next}`);
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }

    // Sinon, on redirige vers le dashboard selon le type d'utilisateur
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
        profile?.user_type === "lawyer"
          ? "/lawyer/dashboard"
          : "/client/dashboard";

      console.log(`➡️  [CALLBACK] Redirecting to dashboard: ${redirectPath}`);
      return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
    }
  }

  console.log("⚠️  [CALLBACK] No code found, redirecting to home");
  return NextResponse.redirect(new URL("/", requestUrl.origin));
}
