import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  // ✅ Pages publiques accessibles sans connexion
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
    path.match(/^\/lawyers\/[^\/]+$/) || // Profils avocats publics
    path.match(/^\/claim-profile\/[^\/]+$/); // Pages de réclamation de profil

  // ✅ Si pas de session et route protégée → rediriger vers login
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // ✅ Si utilisateur connecté
  if (session?.user) {
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("user_type, verified")
      .eq("id", session.user.id)
      .single();

    // Si erreur de récupération du profil, rediriger vers login
    if (profileError) {
      console.error("Erreur récupération profil:", profileError);
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // ✅ GESTION SPÉCIALE: Avocat non vérifié
    if (profile?.user_type === "lawyer" && !profile?.verified) {
      // ✅ MODIFICATION: Pages autorisées pour avocat non vérifié
      const allowedPaths = [
        "/lawyer/onboarding",
        "/", // ✅ NOUVEAU: Autoriser l'accueil
        "/search", // ✅ NOUVEAU: Autoriser la recherche
        "/howitworks", // ✅ NOUVEAU: Autoriser "Comment ça marche"
      ];

      const isAllowedPath =
        allowedPaths.some((p) => path === p) ||
        path.match(/^\/lawyers\/[^\/]+$/); // ✅ Profils avocats publics aussi autorisés

      if (!isAllowedPath) {
        console.log(
          `[Middleware] Avocat non vérifié bloqué sur: ${path} → Redirection /lawyer/onboarding`
        );
        return NextResponse.redirect(new URL("/lawyer/onboarding", req.url));
      }

      // ✅ Si accès autorisé, laisser passer SANS créer de cookie
      return res;
    }

    // ✅ Si avocat vérifié essaie d'accéder à onboarding → rediriger vers dashboard
    if (
      profile?.user_type === "lawyer" &&
      profile?.verified &&
      path === "/lawyer/onboarding"
    ) {
      return NextResponse.redirect(new URL("/lawyer/dashboard", req.url));
    }

    // ✅ Empêcher les clients d'accéder aux routes avocat
    if (profile?.user_type === "client" && path.startsWith("/lawyer/")) {
      console.log(
        `[Middleware] Client tente d'accéder à route avocat: ${path}`
      );
      return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ Empêcher les avocats vérifiés d'accéder aux routes client
    if (
      profile?.user_type === "lawyer" &&
      profile?.verified &&
      path.startsWith("/client/")
    ) {
      console.log(
        `[Middleware] Avocat tente d'accéder à route client: ${path}`
      );
      return NextResponse.redirect(new URL("/lawyer/dashboard", req.url));
    }

    // ✅ Protection des routes avocats (dashboard, settings, etc.)
    const lawyerProtectedPaths = [
      "/lawyer/dashboard",
      "/lawyer/settings",
      "/lawyer/consultations",
      "/lawyer/clients",
      "/lawyer/calendar",
      "/lawyer/profile",
    ];

    if (
      lawyerProtectedPaths.some((p) => path.startsWith(p)) &&
      profile?.user_type !== "lawyer"
    ) {
      console.log(`[Middleware] Non-avocat tente d'accéder à: ${path}`);
      return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ Protection supplémentaire: avocat non vérifié ne peut pas accéder au dashboard
    if (
      lawyerProtectedPaths.some((p) => path.startsWith(p)) &&
      profile?.user_type === "lawyer" &&
      !profile?.verified
    ) {
      console.log(`[Middleware] Avocat non vérifié tente d'accéder à: ${path}`);
      return NextResponse.redirect(new URL("/lawyer/onboarding", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
