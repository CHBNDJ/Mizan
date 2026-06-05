import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Créer le client Supabase pour le middleware
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Récupérer l'utilisateur connecté
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Protection route ADMIN ─────────────────────────────────
  // Seul ton email admin peut accéder à /admin
  if (pathname.startsWith("/admin")) {
    const ADMIN_EMAILS = [process.env.ADMIN_EMAIL!];

    if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
      // Redirige vers la home si pas admin
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ── Protection route LAWYER DASHBOARD ─────────────────────
  // Seuls les avocats connectés peuvent accéder à /lawyer/dashboard
  if (pathname.startsWith("/lawyer/dashboard")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/lawyer/login", request.url));
    }

    // Vérifier que c'est bien un avocat
    const { data: userData } = await supabase
      .from("users")
      .select("user_type")
      .eq("id", user.id)
      .single();

    if (!userData || userData.user_type !== "lawyer") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

// Routes sur lesquelles le middleware s'applique
export const config = {
  matcher: ["/admin/:path*", "/lawyer/dashboard/:path*"],
};
