import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);

  const token_hash =
    requestUrl.searchParams.get("token_hash") ||
    requestUrl.searchParams.get("token");
  const type = requestUrl.searchParams.get("type");
  const code = requestUrl.searchParams.get("code");
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

  console.log("🔍 [CALLBACK] Received:", {
    token_hash: !!token_hash,
    type,
    code: !!code,
    next,
  });

  // RECOVERY FLOW (password reset) - utilise verifyOtp
  if (token_hash && type === "recovery") {
    console.log("🔐 [CALLBACK] Recovery flow detected, using verifyOtp...");

    const { error } = await supabase.auth.verifyOtp({
      type: "recovery",
      token_hash: token_hash,
    });

    if (error) {
      console.error("❌ [CALLBACK] Recovery error:", error);
      return NextResponse.redirect(
        new URL("/auth/client/login?error=recovery_failed", requestUrl.origin)
      );
    }

    console.log(
      "✅ [CALLBACK] Recovery successful, redirecting to reset-password"
    );
    return NextResponse.redirect(
      new URL("/auth/reset-password", requestUrl.origin)
    );
  }

  // PKCE FLOW (normal auth) - utilise exchangeCodeForSession
  if (code) {
    console.log("🔍 [CALLBACK] PKCE code detected, exchanging...");

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

    if (next) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
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
        profile?.user_type === "lawyer"
          ? "/lawyer/dashboard"
          : "/client/dashboard";

      return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
    }
  }

  console.log("⚠️  [CALLBACK] No valid params, redirecting to home");
  return NextResponse.redirect(new URL("/", requestUrl.origin));
}
