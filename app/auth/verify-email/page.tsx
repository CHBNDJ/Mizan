// "use client";

// import { useState, useEffect, useRef, Suspense } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { Mail, CheckCircle, AlertCircle } from "lucide-react";
// import { gsap } from "gsap";

// function VerifyEmailForm() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const containerRef = useRef<HTMLDivElement>(null);
//   const email = searchParams.get("email") || "";
//   const userType = searchParams.get("type") || "client";

//   const [code, setCode] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [isResending, setIsResending] = useState(false);
//   const [resendSuccess, setResendSuccess] = useState(false);

//   useEffect(() => {
//     if (!containerRef.current) return;

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
//         ".page-subtitle",
//         { opacity: 0, y: -15 },
//         { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
//         "-=0.3"
//       )
//       .fromTo(
//         ".form-card",
//         { opacity: 0, y: 30 },
//         { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
//         "-=0.3"
//       );
//   }, []);

//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setIsVerifying(true);

//     if (code.length !== 6) {
//       setError("Le code doit contenir 6 chiffres");
//       setIsVerifying(false);
//       return;
//     }

//     try {
//       const response = await fetch("/api/verify-code", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: email,
//           code: code,
//           userType: userType,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Code invalide");
//       }

//       setSuccess(true);

//       // Redirection après 2 secondes
//       setTimeout(() => {
//         const redirectPath = userType === "lawyer" ? "/lawyer/onboarding" : "/";
//         router.push(redirectPath);
//       }, 2000);
//     } catch (err: any) {
//       console.error("Erreur vérification:", err);
//       setError(err.message || "Code invalide ou expiré");
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleResendCode = async () => {
//     setIsResending(true);
//     setResendSuccess(false);
//     setError("");

//     try {
//       console.log("🔄 Tentative de renvoi du code...");

//       const response = await fetch("/api/resend-verification-code", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: email,
//           userType: userType,
//         }),
//       });

//       // ✅ Vérifier le content-type
//       const contentType = response.headers.get("content-type");
//       console.log("📋 Content-Type:", contentType);

//       if (!response.ok) {
//         // Si c'est du JSON, on essaie de le parser
//         if (contentType?.includes("application/json")) {
//           try {
//             const data = await response.json();
//             throw new Error(data.error || "Erreur lors du renvoi du code");
//           } catch (parseError) {
//             console.error("Erreur parse JSON:", parseError);
//             throw new Error(`Erreur serveur (${response.status})`);
//           }
//         } else {
//           // Si ce n'est pas du JSON, on affiche le texte brut
//           const text = await response.text();
//           console.error("Réponse non-JSON:", text);
//           throw new Error(`Erreur serveur: ${response.status}`);
//         }
//       }

//       // ✅ Succès : parser le JSON
//       let data;
//       try {
//         data = await response.json();
//         console.log("✅ Réponse:", data);
//       } catch (parseError) {
//         console.error("Impossible de parser la réponse:", parseError);
//         throw new Error("Erreur de communication avec le serveur");
//       }

//       setResendSuccess(true);
//       setTimeout(() => setResendSuccess(false), 5000);
//     } catch (err: any) {
//       console.error("❌ Erreur renvoi code:", err);
//       setError(err.message || "Erreur lors du renvoi du code");
//     } finally {
//       setIsResending(false);
//     }
//   };

//   if (!email) {
//     return (
//       <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
//         <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
//           <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
//           <h2 className="text-xl font-bold text-slate-800 mb-2">
//             Email manquant
//           </h2>
//           <p className="text-slate-600 mb-4">
//             Impossible de vérifier votre compte sans email.
//           </p>
//           <button
//             onClick={() => router.push("/")}
//             className="cursor-pointer bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
//           >
//             Retour à l'accueil
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
//       <style>{`
//         .icon-container,
//         .page-title,
//         .page-subtitle,
//         .form-card {
//           opacity: 0;
//         }
//       `}</style>

//       <div className="max-w-md mx-auto px-4 py-24" ref={containerRef}>
//         <div className="text-center mb-8">
//           <div className="icon-container w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <Mail className="w-10 h-10 text-teal-600" />
//           </div>

//           <h1 className="page-title text-2xl font-bold text-slate-800 mb-4">
//             Vérifiez votre email
//           </h1>

//           <p className="page-subtitle text-slate-600 mb-2">
//             Un code de vérification à 6 chiffres a été envoyé à :
//           </p>
//           <p className="font-semibold text-slate-800">{email}</p>
//         </div>

//         <div className="form-card bg-white rounded-2xl shadow-lg p-8">
//           {/* Message de succès */}
//           {success && (
//             <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
//               <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//               <div>
//                 <p className="text-green-800 font-medium text-sm">
//                   Email vérifié avec succès ! ✨
//                 </p>
//                 <p className="text-green-700 text-xs mt-1">
//                   Redirection en cours...
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Message d'erreur */}
//           {error && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
//               <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
//               <p className="text-red-700 text-sm">{error}</p>
//             </div>
//           )}

//           {/* Message de renvoi réussi */}
//           {resendSuccess && (
//             <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
//               <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
//               <p className="text-blue-700 text-sm">
//                 Un nouveau code a été envoyé à votre email !
//               </p>
//             </div>
//           )}

//           {/* Formulaire de code */}
//           <form onSubmit={handleVerify} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2 text-center">
//                 Code de vérification
//               </label>
//               <input
//                 type="text"
//                 value={code}
//                 onChange={(e) => {
//                   const value = e.target.value.replace(/\D/g, "");
//                   if (value.length <= 6) setCode(value);
//                 }}
//                 placeholder="123456"
//                 className="w-full h-14 px-4 text-center text-2xl font-bold tracking-widest border-2 border-slate-300 rounded-lg bg-white hover:border-teal-300 focus:border-teal-300 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all duration-200 text-slate-800"
//                 maxLength={6}
//                 required
//                 disabled={isVerifying || success}
//                 autoFocus
//               />
//               <p className="text-xs text-slate-500 mt-2 text-center">
//                 Entrez le code reçu par email
//               </p>
//             </div>

//             <button
//               type="submit"
//               disabled={isVerifying || success || code.length !== 6}
//               className="cursor-pointer w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isVerifying ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   Vérification...
//                 </div>
//               ) : success ? (
//                 "Vérifié ✓"
//               ) : (
//                 "Vérifier mon email"
//               )}
//             </button>
//           </form>

//           {/* Section "Vous ne recevez pas le code ?" */}
//           <div className="mt-6 pt-6 border-t border-slate-100">
//             <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
//               <p className="text-teal-800 text-sm">
//                 <strong>Vous ne voyez pas l'email ?</strong>
//                 <br />
//                 Vérifiez vos spams ou courrier indésirable.
//               </p>
//             </div>

//             <button
//               onClick={handleResendCode}
//               disabled={isResending || success}
//               className="cursor-pointer w-full text-teal-600 hover:text-teal-700 text-sm font-medium py-2 hover:bg-teal-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isResending ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-teal-600"></div>
//                   Envoi en cours...
//                 </div>
//               ) : (
//                 "Renvoyer le code"
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Footer */}
//         <p className="text-center text-xs text-slate-500 mt-6">
//           Besoin d'aide ?{" "}
//           <a
//             href="mailto:support@mizan-dz.com"
//             className="text-teal-600 hover:text-teal-700"
//           >
//             Contactez-nous
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default function VerifyEmailPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
//         </div>
//       }
//     >
//       <VerifyEmailForm />
//     </Suspense>
//   );
// }

"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { gsap } from "gsap";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const email = searchParams.get("email") || "";
  const userType = searchParams.get("type") || "client";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

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
        ".page-subtitle",
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".form-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.3"
      );
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    if (code.length !== 6) {
      setError("Le code doit contenir 6 chiffres");
      setIsVerifying(false);
      return;
    }

    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          code: code,
          userType: userType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Code invalide");
      }

      setSuccess(true);

      // ✅ Utiliser le redirectPath retourné par l'API
      setTimeout(() => {
        const redirectPath = data.redirectPath || "/";
        router.push(redirectPath);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Code invalide ou expiré");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setResendSuccess(false);
    setError("");

    try {
      const response = await fetch("/api/resend-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          userType: userType,
        }),
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        if (contentType?.includes("application/json")) {
          try {
            const data = await response.json();
            throw new Error(data.error || "Erreur lors du renvoi du code");
          } catch (parseError) {
            throw new Error(`Erreur serveur (${response.status})`);
          }
        } else {
          const text = await response.text();
          throw new Error(`Erreur serveur: ${response.status}`);
        }
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error("Erreur de communication avec le serveur");
      }

      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || "Erreur lors du renvoi du code");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Email manquant
          </h2>
          <p className="text-slate-600 mb-4">
            Impossible de vérifier votre compte sans email.
          </p>
          <button
            onClick={() => router.push("/")}
            className="cursor-pointer bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <style>{`
        .icon-container,
        .page-title,
        .page-subtitle,
        .form-card {
          opacity: 0;
        }
      `}</style>

      <div className="max-w-md mx-auto px-4 py-24" ref={containerRef}>
        <div className="text-center mb-8">
          <div className="icon-container w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-teal-600" />
          </div>

          <h1 className="page-title text-2xl font-bold text-slate-800 mb-4">
            Vérifiez votre email
          </h1>

          <p className="page-subtitle text-slate-600 mb-2">
            Un code de vérification à 6 chiffres a été envoyé à :
          </p>
          <p className="font-semibold text-slate-800">{email}</p>
        </div>

        <div className="form-card bg-white rounded-2xl shadow-lg p-8">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-800 font-medium text-sm">
                  Email vérifié avec succès ! ✨
                </p>
                <p className="text-green-700 text-xs mt-1">
                  Redirection en cours...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {resendSuccess && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-blue-700 text-sm">
                Un nouveau code a été envoyé à votre email !
              </p>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 text-center">
                Code de vérification
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 6) setCode(value);
                }}
                placeholder="123456"
                className="w-full h-14 px-4 text-center text-2xl font-bold tracking-widest border-2 border-slate-300 rounded-lg bg-white hover:border-teal-300 focus:border-teal-300 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all duration-200 text-slate-800"
                maxLength={6}
                required
                disabled={isVerifying || success}
                autoFocus
              />
              <p className="text-xs text-slate-500 mt-2 text-center">
                Entrez le code reçu par email
              </p>
            </div>

            <button
              type="submit"
              disabled={isVerifying || success || code.length !== 6}
              className="cursor-pointer w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Vérification...
                </div>
              ) : success ? (
                "Vérifié ✓"
              ) : (
                "Vérifier mon email"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
              <p className="text-teal-800 text-sm">
                <strong>Vous ne voyez pas l'email ?</strong>
                <br />
                Vérifiez vos spams ou courrier indésirable.
              </p>
            </div>

            <button
              onClick={handleResendCode}
              disabled={isResending || success}
              className="cursor-pointer w-full text-teal-600 hover:text-teal-700 text-sm font-medium py-2 hover:bg-teal-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-teal-600"></div>
                  Envoi en cours...
                </div>
              ) : (
                "Renvoyer le code"
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Besoin d'aide ?{" "}
          <a
            href="mailto:support@mizan-dz.com"
            className="text-teal-600 hover:text-teal-700"
          >
            Contactez-nous
          </a>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
