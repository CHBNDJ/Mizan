// "use client";

// import { useState, useEffect, useRef, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";
// import { createClient } from "@/lib/supabase/client";
// import { gsap } from "gsap";

// function ResetPasswordForm() {
//   const supabase = createClient();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const containerRef = useRef<HTMLDivElement>(null);

//   const userType = searchParams.get("type") || "lawyer";
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [sessionReady, setSessionReady] = useState(false);

//   useEffect(() => {
//     const handlePasswordReset = async () => {
//       try {
//         const hashParams = new URLSearchParams(
//           window.location.hash.substring(1)
//         );
//         const access_token = hashParams.get("access_token");
//         const refresh_token = hashParams.get("refresh_token");
//         const type = hashParams.get("type");

//         if (!access_token || type !== "recovery") {
//           setError("Lien de réinitialisation invalide ou expiré");
//           setIsLoading(false);
//           return;
//         }

//         const { error: sessionError } = await supabase.auth.setSession({
//           access_token,
//           refresh_token: refresh_token || "",
//         });

//         if (sessionError) {
//           console.error("Erreur session:", sessionError);
//           setError("Lien de réinitialisation invalide ou expiré");
//           setIsLoading(false);
//           return;
//         }

//         setSessionReady(true);
//         setIsLoading(false);
//       } catch (err) {
//         console.error("Erreur initialisation:", err);
//         setError("Une erreur est survenue");
//         setIsLoading(false);
//       }
//     };

//     handlePasswordReset();
//   }, [supabase]);

//   useEffect(() => {
//     if (!containerRef.current || isLoading) return;

//     const timeline = gsap.timeline();

//     timeline
//       .fromTo(
//         ".icon-container",
//         { opacity: 0, y: -30, scale: 0.8 },
//         { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.7)" }
//       )
//       .fromTo(
//         ".page-title",
//         { opacity: 0, y: -20 },
//         { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
//         "-=0.3"
//       )
//       .fromTo(
//         ".form-card",
//         { opacity: 0, y: 30 },
//         { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
//         "-=0.3"
//       );
//   }, [isLoading]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess(false);
//     setIsSubmitting(true);

//     if (password.length < 8) {
//       setError("Le mot de passe doit contenir au moins 8 caractères.");
//       setIsSubmitting(false);
//       return;
//     }

//     if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
//       setError(
//         "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre."
//       );
//       setIsSubmitting(false);
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Les mots de passe ne correspondent pas.");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const { error: updateError } = await supabase.auth.updateUser({
//         password: password,
//       });

//       if (updateError) {
//         console.error("Erreur update:", updateError);
//         setError("Erreur lors de la modification : " + updateError.message);
//         setIsSubmitting(false);
//         return;
//       }

//       setSuccess(true);

//       setTimeout(async () => {
//         await supabase.auth.signOut();
//         const loginPath =
//           userType === "client" ? "/auth/client/login" : "/auth/lawyer/login";
//         window.location.href = loginPath;
//       }, 2000);
//     } catch (err: any) {
//       console.error("Erreur reset password:", err);
//       setError("Une erreur est survenue. Réessayez.");
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
//           <p className="text-slate-600">Vérification du lien...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!sessionReady) {
//     return (
//       <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
//         <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
//           <div className="flex flex-col items-center text-center">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
//               <AlertCircle className="w-8 h-8 text-red-600" />
//             </div>
//             <h2 className="text-2xl font-bold text-slate-800 mb-2">
//               Lien invalide ou expiré
//             </h2>
//             <p className="text-slate-600 mb-6">
//               {error || "Le lien de réinitialisation est invalide ou a expiré."}
//             </p>

//             <div className="flex flex-col sm:flex-row gap-3 w-full">
//               <button
//                 onClick={() => router.push("/auth/lawyer/forgot-password")}
//                 className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
//               >
//                 Renvoyer (Avocat)
//               </button>
//               <button
//                 onClick={() => router.push("/auth/client/forgot-password")}
//                 className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
//               >
//                 Renvoyer (Client)
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (success) {
//     return (
//       <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
//         <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
//           <div className="flex flex-col items-center text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
//               <CheckCircle className="w-8 h-8 text-green-600" />
//             </div>
//             <h2 className="text-2xl font-bold text-slate-800 mb-2">
//               Mot de passe réinitialisé !
//             </h2>
//             <p className="text-slate-600 mb-4">
//               Votre mot de passe a été modifié avec succès.
//             </p>
//             <p className="text-sm text-slate-500">
//               Redirection vers la page de connexion...
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
//       <style>{`
//         .icon-container,
//         .page-title,
//         .form-card {
//           opacity: 0;
//         }
//       `}</style>

//       <div className="max-w-md mx-auto px-4 py-24" ref={containerRef}>
//         <div className="text-center mb-8">
//           <div className="icon-container w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Lock className="w-8 h-8 text-teal-600" />
//           </div>
//           <h1 className="page-title text-2xl font-bold text-slate-800 mb-2">
//             Nouveau mot de passe
//           </h1>
//           <p className="text-slate-600 text-sm">
//             Choisissez un mot de passe sécurisé
//           </p>
//         </div>

//         <div className="form-card bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
//           {error && (
//             <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
//               <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
//               <p className="text-red-600 text-sm">{error}</p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Nouveau mot de passe
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="text-slate-800 w-full h-12 px-4 text-sm border-2 border-slate-300 rounded-lg bg-white hover:border-teal-300 focus:border-teal-300 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all duration-200"
//                   placeholder="Minimum 8 caractères"
//                   required
//                   disabled={isSubmitting}
//                   minLength={8}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
//                   disabled={isSubmitting}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//               <p className="text-xs text-slate-500 mt-2">
//                 Minimum 8 caractères avec majuscule, minuscule et chiffre
//               </p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Confirmer le mot de passe
//               </label>
//               <div className="relative">
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="text-slate-800 w-full h-12 px-4 text-sm border-2 border-slate-300 rounded-lg bg-white hover:border-teal-300 focus:border-teal-300 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all duration-200"
//                   placeholder="Répétez le mot de passe"
//                   required
//                   disabled={isSubmitting}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
//                   disabled={isSubmitting}
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="cursor-pointer w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   Modification en cours...
//                 </div>
//               ) : (
//                 "Réinitialiser mon mot de passe"
//               )}
//             </button>
//           </form>
//         </div>

//         <p className="text-center text-sm text-slate-500 mt-6">
//           <a
//             href={
//               userType === "client"
//                 ? "/auth/client/login"
//                 : "/auth/lawyer/login"
//             }
//             className="text-teal-600 hover:text-teal-700 font-medium"
//           >
//             Retour à la connexion
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default function ResetPasswordPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
//         </div>
//       }
//     >
//       <ResetPasswordForm />
//     </Suspense>
//   );
// }

"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { gsap } from "gsap";

function ResetPasswordForm() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const userType = searchParams.get("type") || "lawyer";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handlePasswordReset = async () => {
      try {
        const access_token = searchParams.get("access_token");
        const refresh_token = searchParams.get("refresh_token");
        const type = searchParams.get("type");

        let tokenFromHash = null;
        let refreshFromHash = null;
        let typeFromHash = null;

        if (typeof window !== "undefined" && window.location.hash) {
          const hashParams = new URLSearchParams(
            window.location.hash.substring(1)
          );
          tokenFromHash = hashParams.get("access_token");
          refreshFromHash = hashParams.get("refresh_token");
          typeFromHash = hashParams.get("type");
        }

        const finalAccessToken = access_token || tokenFromHash;
        const finalRefreshToken = refresh_token || refreshFromHash;
        const finalType = type || typeFromHash;

        if (!finalAccessToken || finalType !== "recovery") {
          setError("Lien de réinitialisation invalide ou expiré");
          setIsLoading(false);
          setSessionReady(false);
          return;
        }

        const { error: sessionError } = await supabase.auth.setSession({
          access_token: finalAccessToken,
          refresh_token: finalRefreshToken || "",
        });

        if (sessionError) {
          console.error("Erreur session:", sessionError);
          setError("Lien de réinitialisation invalide ou expiré");
          setIsLoading(false);
          setSessionReady(false);
          return;
        }

        setSessionReady(true);
        setIsLoading(false);
      } catch (err) {
        console.error("Erreur initialisation:", err);
        setError("Une erreur est survenue");
        setIsLoading(false);
        setSessionReady(false);
      }
    };

    handlePasswordReset();
  }, [supabase, searchParams, isMounted]);

  useEffect(() => {
    if (!containerRef.current || isLoading || !isMounted) return;

    const timeline = gsap.timeline();

    timeline
      .fromTo(
        ".icon-container",
        { opacity: 0, y: -30, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.7)" }
      )
      .fromTo(
        ".page-title",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".form-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.3"
      );
  }, [isLoading, isMounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setIsSubmitting(false);
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError(
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre."
      );
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        console.error("Erreur update:", updateError);
        setError("Erreur lors de la modification : " + updateError.message);
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);

      setTimeout(async () => {
        await supabase.auth.signOut();
        const loginPath =
          userType === "client" ? "/auth/client/login" : "/auth/lawyer/login";
        router.push(loginPath);
      }, 2000);
    } catch (err: any) {
      console.error("Erreur reset password:", err);
      setError("Une erreur est survenue. Réessayez.");
      setIsSubmitting(false);
    }
  };

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="text-slate-600">Vérification du lien...</p>
        </div>
      </div>
    );
  }

  if (!sessionReady) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Lien invalide ou expiré
            </h2>
            <p className="text-slate-600 mb-6">
              {error || "Le lien de réinitialisation est invalide ou a expiré."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => router.push("/auth/lawyer/forgot-password")}
                className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                Renvoyer (Avocat)
              </button>
              <button
                onClick={() => router.push("/auth/client/forgot-password")}
                className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
              >
                Renvoyer (Client)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Mot de passe réinitialisé !
            </h2>
            <p className="text-slate-600 mb-4">
              Votre mot de passe a été modifié avec succès.
            </p>
            <p className="text-sm text-slate-500">
              Redirection vers la page de connexion...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <div className="max-w-md mx-auto px-4 py-24" ref={containerRef}>
        <div className="text-center mb-8">
          <div className="icon-container w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="page-title text-2xl font-bold text-slate-800 mb-2">
            Nouveau mot de passe
          </h1>
          <p className="text-slate-600 text-sm">
            Choisissez un mot de passe sécurisé
          </p>
        </div>

        <div className="form-card bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-slate-800 w-full h-12 px-4 text-sm border-2 border-slate-300 rounded-lg bg-white hover:border-teal-300 focus:border-teal-300 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all duration-200"
                  placeholder="Minimum 8 caractères"
                  required
                  disabled={isSubmitting}
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Minimum 8 caractères avec majuscule, minuscule et chiffre
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-slate-800 w-full h-12 px-4 text-sm border-2 border-slate-300 rounded-lg bg-white hover:border-teal-300 focus:border-teal-300 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all duration-200"
                  placeholder="Répétez le mot de passe"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Modification en cours...
                </div>
              ) : (
                "Réinitialiser mon mot de passe"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          <button
            onClick={() =>
              router.push(
                userType === "client"
                  ? "/auth/client/login"
                  : "/auth/lawyer/login"
              )
            }
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Retour à la connexion
          </button>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
