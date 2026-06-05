import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  // ── Protection ADMIN ──────────────────────────────────────
  // Seul l'email défini dans ADMIN_EMAIL peut accéder à /admin
  if (path.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail || session.user.email !== adminEmail) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return res;
  }

  // ── Routes publiques ──────────────────────────────────────
  const publicPaths = [
    "/",
    "/search",
    "/auth/login",
    "/auth/register",
    "/auth/client/login",
    "/auth/client/register",
    "/auth/lawyer/login",
    "/auth/lawyer/register",
    "/auth/verify-email",
    "/auth/reset-password",
    "/auth/forgot-password",
    "/auth/client/forgot-password",
    "/auth/lawyer/forgot-password",
    "/howitworks",
  ];

  const isPublicPath =
    publicPaths.some((p) => path.startsWith(p)) ||
    path.match(/^\/lawyers\/[^\/]+$/) ||
    path.match(/^\/claim-profile\/[^\/]+$/) ||
    path.match(/^\/blog\/[^\/]+$/) ||
    path === "/blog" ||
    path === "/lawyer/abonnements";

  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (session?.user) {
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("user_type, verified, role")
      .eq("id", session.user.id)
      .single();

    if (profileError) {
      console.error("Erreur récupération profil:", profileError);
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (profile?.user_type === "lawyer" && !profile?.verified) {
      const allowedPaths = [
        "/lawyer/onboarding",
        "/lawyer/abonnements",
        "/",
        "/search",
        "/howitworks",
      ];

      const isAllowedPath =
        allowedPaths.some((p) => path === p) ||
        path.match(/^\/lawyers\/[^\/]+$/);
      if (!isAllowedPath) {
        return NextResponse.redirect(new URL("/lawyer/onboarding", req.url));
      }

      return res;
    }

    if (
      profile?.user_type === "lawyer" &&
      profile?.verified &&
      path === "/lawyer/onboarding"
    ) {
      return NextResponse.redirect(new URL("/lawyer/dashboard", req.url));
    }

    if (profile?.user_type === "client" && path.startsWith("/lawyer/")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      profile?.user_type === "lawyer" &&
      profile?.verified &&
      path.startsWith("/client/")
    ) {
      return NextResponse.redirect(new URL("/lawyer/dashboard", req.url));
    }

    const lawyerProtectedPaths = [
      "/lawyer/dashboard",
      "/lawyer/settings",
      "/lawyer/consultations",
      "/lawyer/clients",
      "/lawyer/calendar",
      "/lawyer/profile",
      "/lawyer/abonnements",
    ];

    if (
      lawyerProtectedPaths.some((p) => path.startsWith(p)) &&
      profile?.user_type !== "lawyer"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      lawyerProtectedPaths.some((p) => path.startsWith(p)) &&
      profile?.user_type === "lawyer" &&
      !profile?.verified
    ) {
      return NextResponse.redirect(new URL("/lawyer/onboarding", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
