// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next();
//   const supabase = createMiddlewareClient({ req, res });

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   const path = req.nextUrl.pathname;

//   // ✅ Pages publiques accessibles sans connexion
//   const publicPaths = [
//     "/",
//     "/search",
//     "/auth/login",
//     "/auth/register",
//     "/auth/lawyer/login",
//     "/auth/lawyer/register",
//     "/auth/verify-email",
//     "/auth/reset-password",
//     "/auth/forgot-password",
//   ];

//   const isPublicPath =
//     publicPaths.some((p) => path.startsWith(p)) ||
//     path.match(/^\/lawyers\/[^\/]+$/);

//   // ✅ Si pas de session et route protégée
//   if (!session && !isPublicPath) {
//     return NextResponse.redirect(new URL("/auth/login", req.url));
//   }

//   // ✅ Si utilisateur connecté
//   if (session?.user) {
//     const { data: profile } = await supabase
//       .from("users")
//       .select("user_type, verified")
//       .eq("id", session.user.id)
//       .single();

//     // ✅ Si avocat non vérifié essaie d'accéder au dashboard/settings
//     if (profile?.user_type === "lawyer" && !profile?.verified) {
//       const restrictedPaths = [
//         "/lawyer/dashboard",
//         "/lawyer/settings",
//         "/lawyer/consultations",
//         "/lawyer/clients",
//         "/lawyer/calendar",
//       ];

//       if (restrictedPaths.some((p) => path.startsWith(p))) {
//         return NextResponse.redirect(new URL("/lawyer/onboarding", req.url));
//       }
//     }

//     // ✅ Empêcher les clients d'accéder aux routes avocat
//     if (profile?.user_type === "client" && path.startsWith("/lawyer/")) {
//       return NextResponse.redirect(new URL("/", req.url));
//     }

//     // ✅ Empêcher les avocats d'accéder aux routes client
//     if (profile?.user_type === "lawyer" && path.startsWith("/client/")) {
//       return NextResponse.redirect(new URL("/lawyer/dashboard", req.url));
//     }
//   }

//   return res;
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
// };

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
    "/auth/lawyer/login",
    "/auth/lawyer/register",
    "/auth/verify-email",
    "/auth/reset-password",
    "/auth/forgot-password",
  ];

  const isPublicPath =
    publicPaths.some((p) => path.startsWith(p)) ||
    path.match(/^\/lawyers\/[^\/]+$/) ||
    path.match(/^\/claim-profile\/[^\/]+$/); // ✅ Autoriser claim-profile

  // ✅ Si pas de session et route protégée
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // ✅ Si utilisateur connecté
  if (session?.user) {
    const { data: profile } = await supabase
      .from("users")
      .select("user_type, verified")
      .eq("id", session.user.id)
      .single();

    // ✅ Si avocat non vérifié essaie d'accéder au dashboard/settings
    if (profile?.user_type === "lawyer" && !profile?.verified) {
      const restrictedPaths = [
        "/lawyer/dashboard",
        "/lawyer/settings",
        "/lawyer/consultations",
        "/lawyer/clients",
        "/lawyer/calendar",
      ];

      if (restrictedPaths.some((p) => path.startsWith(p))) {
        return NextResponse.redirect(new URL("/lawyer/onboarding", req.url));
      }
    }

    // ✅ Empêcher les clients d'accéder aux routes avocat
    if (profile?.user_type === "client" && path.startsWith("/lawyer/")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ Empêcher les avocats d'accéder aux routes client
    if (profile?.user_type === "lawyer" && path.startsWith("/client/")) {
      return NextResponse.redirect(new URL("/lawyer/dashboard", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
