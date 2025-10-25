// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { MessageCircle, Lightbulb, Bug, Send } from "lucide-react";

// export default function FeedbackPage() {
//   const [type, setType] = useState("testimonial");
//   const [message, setMessage] = useState("");
//   const [sending, setSending] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async () => {
//     if (!message.trim()) return;

//     setSending(true);
//     try {
//       await fetch("/api/platform-feedback/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           type,
//           message: message.trim(),
//           pageUrl: "/feedback",
//         }),
//       });

//       setSuccess(true);
//       setTimeout(() => router.push("/"), 2500);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setSending(false);
//     }
//   };

//   const feedbackTypes = [
//     {
//       value: "testimonial",
//       icon: MessageCircle,
//       label: "Partager mon expérience",
//     },
//     {
//       value: "suggestion",
//       icon: Lightbulb,
//       label: "Suggérer une amélioration",
//     },
//     { value: "bug", icon: Bug, label: "Signaler un bug" },
//   ];

//   return (
//     <div className="min-h-screen p-26 bg-gradient-to-br from-teal-100 via-white to-teal-100 px-4 sm:px-6">
//       <div className="w-full max-w-3xl mx-auto rounded-full">
//         {success ? (
//           <div className="bg-white shadow-lg p-8 sm:p-16 text-center">
//             <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <svg
//                 className="w-10 h-10 text-teal-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             </div>
//             <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
//               Merci pour votre feedback !
//             </h2>
//             <p className="text-base sm:text-lg text-slate-600">
//               Votre message a bien été envoyé. Redirection...
//             </p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
//             {/* Header */}
//             <div className="p-6 sm:p-8 border-b border-slate-100 text-center sm:text-left">
//               <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
//                 Votre avis nous intéresse
//               </h1>
//               <p className="text-slate-600 text-sm sm:text-base">
//                 Aidez-nous à améliorer votre expérience sur Mizan
//               </p>
//             </div>

//             <div className="p-6 sm:p-8">
//               {/* Type selection */}
//               <div className="space-y-3 mb-8">
//                 {feedbackTypes.map((ft) => {
//                   const Icon = ft.icon;
//                   const isSelected = type === ft.value;

//                   return (
//                     <label
//                       key={ft.value}
//                       className={`flex sm:flex-col items-center gap-3 sm:gap-2 p-4 sm:p-5 rounded-lg border-2 cursor-pointer transition-all ${
//                         isSelected
//                           ? "border-teal-500 bg-teal-50"
//                           : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         name="feedback-type"
//                         value={ft.value}
//                         checked={isSelected}
//                         onChange={(e) => setType(e.target.value)}
//                         className="hidden"
//                       />
//                       <div
//                         className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
//                           isSelected ? "bg-teal-600" : "bg-slate-100"
//                         }`}
//                       >
//                         <Icon
//                           className={`w-5 h-5 sm:w-6 sm:h-6 ${
//                             isSelected ? "text-white" : "text-slate-500"
//                           }`}
//                         />
//                       </div>
//                       <span
//                         className={`text-sm sm:text-base font-medium text-center sm:mt-1 ${
//                           isSelected ? "text-slate-900" : "text-slate-700"
//                         }`}
//                       >
//                         {ft.label}
//                       </span>
//                     </label>
//                   );
//                 })}
//               </div>

//               {/* Message input */}
//               <div className="mb-8">
//                 <label className="block text-sm sm:text-base font-medium text-slate-700 mb-3">
//                   Votre message
//                 </label>
//                 <textarea
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   placeholder={
//                     type === "bug"
//                       ? "Décrivez le problème..."
//                       : type === "suggestion"
//                         ? "Quelle fonctionnalité aimeriez-vous ?"
//                         : "Partagez votre expérience..."
//                   }
//                   className="w-full h-32 sm:h-40 p-3 sm:p-4 border-2 border-slate-300 rounded-lg resize-none focus:border-2 focus:border-teal-400 outline-none transition-all text-slate-700 placeholder:text-slate-400 text-sm sm:text-base"
//                 />
//               </div>

//               {/* Submit button */}
//               <button
//                 onClick={handleSubmit}
//                 disabled={!message.trim() || sending}
//                 className="cursor-pointer w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white py-3 sm:py-4 px-6 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base sm:text-lg"
//               >
//                 {sending ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
//                     Envoi en cours...
//                   </>
//                 ) : (
//                   <>
//                     <Send className="w-5 h-5" />
//                     Envoyer le feedback
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Lightbulb, Bug, Send } from "lucide-react";
import { gsap } from "gsap";
import { useAuth } from "@/hooks/useAuth";

export default function FeedbackPage() {
  const { user, profile, isAuthenticated, loading } = useAuth();
  const [type, setType] = useState("testimonial");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Rediriger si non connecté
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/client/login?redirect=/feedback");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!containerRef.current || !isAuthenticated) return;

    const timeline = gsap.timeline();

    timeline
      .fromTo(
        ".page-title",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
      )
      .fromTo(
        ".page-subtitle",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".feedback-options",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".message-label",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.2"
      )
      .fromTo(
        ".submit-btn",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.2"
      );
  }, [isAuthenticated]);

  const handleSubmit = async () => {
    if (!message.trim() || !user) return;

    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/platform-feedback/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message: message.trim(),
          pageUrl: "/feedback",
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      setSuccess(true);
      setTimeout(() => {
        const redirectPath =
          profile?.user_type === "lawyer" ? "/lawyer/dashboard" : "/";
        router.push(redirectPath);
      }, 2500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur est survenue");
    } finally {
      setSending(false);
    }
  };

  const feedbackTypes = [
    {
      value: "testimonial",
      icon: MessageCircle,
      label: "Partager mon expérience",
      description: "Partagez ce que vous pensez de Mizan",
    },
    {
      value: "suggestion",
      icon: Lightbulb,
      label: "Suggérer une amélioration",
      description: "Aidez-nous à améliorer la plateforme",
    },
    {
      value: "bug",
      icon: Bug,
      label: "Signaler un bug",
      description: "Signalez un problème technique",
    },
  ];

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-white to-teal-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // ✅ Non connecté (normalement redirigé)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-teal-100 via-white to-teal-100 px-4 sm:px-6">
      <style>{`
        .page-title,
        .page-subtitle,
        .feedback-options,
        .message-label,
        .submit-btn {
          opacity: 0;
        }
      `}</style>

      <div className="w-full max-w-3xl mx-auto" ref={containerRef}>
        {success ? (
          <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-16 text-center">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Merci pour votre feedback !
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mb-2">
              Votre message a bien été envoyé à notre équipe.
            </p>
            <p className="text-sm text-slate-500">Redirection en cours...</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-slate-100">
              <h1 className="page-title text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
                Votre avis nous intéresse
              </h1>
              <p className="page-subtitle text-slate-600 text-sm sm:text-base">
                Bonjour {profile?.first_name}, aidez-nous à améliorer votre
                expérience sur Mizan
              </p>
            </div>

            <div className="p-6 sm:p-8">
              {/* Message d'erreur */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Type selection */}
              <div className="feedback-options grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {feedbackTypes.map((ft) => {
                  const Icon = ft.icon;
                  const isSelected = type === ft.value;

                  return (
                    <label
                      key={ft.value}
                      className={`flex flex-col items-center gap-3 p-5 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-teal-500 bg-teal-50"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="feedback-type"
                        value={ft.value}
                        checked={isSelected}
                        onChange={(e) => setType(e.target.value)}
                        className="hidden"
                      />
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isSelected ? "bg-teal-600" : "bg-slate-100"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            isSelected ? "text-white" : "text-slate-500"
                          }`}
                        />
                      </div>
                      <div className="text-center">
                        <span
                          className={`text-sm font-medium block ${
                            isSelected ? "text-slate-900" : "text-slate-700"
                          }`}
                        >
                          {ft.label}
                        </span>
                        <span className="text-xs text-slate-500 mt-1 block">
                          {ft.description}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Message input */}
              <div className="mb-8">
                <label className="message-label block text-sm sm:text-base font-medium text-slate-700 mb-3">
                  Votre message *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    type === "bug"
                      ? "Décrivez le problème rencontré en détail..."
                      : type === "suggestion"
                        ? "Quelle fonctionnalité aimeriez-vous voir sur Mizan ?"
                        : "Partagez votre expérience avec Mizan..."
                  }
                  className="w-full h-40 p-4 border-2 border-slate-300 rounded-lg resize-none focus:border-teal-400 outline-none transition-all text-slate-700 placeholder:text-slate-400 text-sm sm:text-base"
                  maxLength={1000}
                />
                <p className="text-xs text-slate-500 mt-2">
                  {message.length}/1000 caractères
                </p>
              </div>

              {/* Info utilisateur */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Envoyé en tant que :</span>{" "}
                  {profile?.first_name} {profile?.last_name} ({user?.email})
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Type de compte :{" "}
                  {profile?.user_type === "lawyer" ? "Avocat" : "Client"}
                </p>
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={!message.trim() || sending}
                className="submit-btn cursor-pointer w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white py-4 px-6 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base sm:text-lg"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer le feedback
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { MessageCircle, Lightbulb, Bug, Send } from "lucide-react";
// import { gsap } from "gsap";

// export default function FeedbackPage() {
//   const [type, setType] = useState("testimonial");
//   const [message, setMessage] = useState("");
//   const [sending, setSending] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const router = useRouter();
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const timeline = gsap.timeline();

//     timeline
//       .fromTo(
//         ".page-title",
//         { opacity: 0, y: -30 },
//         { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
//       )
//       .fromTo(
//         ".page-subtitle",
//         { opacity: 0, y: -20 },
//         { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
//         "-=0.4"
//       )
//       .fromTo(
//         ".feedback-options",
//         { opacity: 0, y: 20 },
//         { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
//         "-=0.3"
//       )
//       .fromTo(
//         ".message-label",
//         { opacity: 0, y: 20 },
//         { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
//         "-=0.2"
//       )
//       .fromTo(
//         ".submit-btn",
//         { opacity: 0, y: 20 },
//         { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
//         "-=0.2"
//       );
//   }, []);

//   const handleSubmit = async () => {
//     if (!message.trim()) return;

//     setSending(true);
//     try {
//       await fetch("/api/platform-feedback/create", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           type,
//           message: message.trim(),
//           pageUrl: "/feedback",
//         }),
//       });

//       setSuccess(true);
//       setTimeout(() => router.push("/"), 2500);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setSending(false);
//     }
//   };

//   const feedbackTypes = [
//     {
//       value: "testimonial",
//       icon: MessageCircle,
//       label: "Partager mon expérience",
//     },
//     {
//       value: "suggestion",
//       icon: Lightbulb,
//       label: "Suggérer une amélioration",
//     },
//     { value: "bug", icon: Bug, label: "Signaler un bug" },
//   ];

//   return (
//     <div className="min-h-screen p-26 bg-gradient-to-br from-teal-100 via-white to-teal-100 px-4 sm:px-6">
//       <style>{`
//         .page-title,
//         .page-subtitle,
//         .feedback-options,
//         .message-label,
//         .submit-btn {
//           opacity: 0;
//         }
//       `}</style>

//       <div className="w-full max-w-3xl mx-auto rounded-full" ref={containerRef}>
//         {success ? (
//           <div className="bg-white shadow-lg p-8 sm:p-16 text-center">
//             <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <svg
//                 className="w-10 h-10 text-teal-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             </div>
//             <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
//               Merci pour votre feedback !
//             </h2>
//             <p className="text-base sm:text-lg text-slate-600">
//               Votre message a bien été envoyé. Redirection...
//             </p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
//             {/* Header */}
//             <div className="p-6 sm:p-8 border-b border-slate-100 text-center sm:text-left">
//               <h1 className="page-title text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
//                 Votre avis nous intéresse
//               </h1>
//               <p className="page-subtitle text-slate-600 text-sm sm:text-base">
//                 Aidez-nous à améliorer votre expérience sur Mizan
//               </p>
//             </div>

//             <div className="p-6 sm:p-8">
//               {/* Type selection */}
//               <div className="feedback-options space-y-3 mb-8">
//                 {feedbackTypes.map((ft) => {
//                   const Icon = ft.icon;
//                   const isSelected = type === ft.value;

//                   return (
//                     <label
//                       key={ft.value}
//                       className={`flex sm:flex-col items-center gap-3 sm:gap-2 p-4 sm:p-5 rounded-lg border-2 cursor-pointer transition-all ${
//                         isSelected
//                           ? "border-teal-500 bg-teal-50"
//                           : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         name="feedback-type"
//                         value={ft.value}
//                         checked={isSelected}
//                         onChange={(e) => setType(e.target.value)}
//                         className="hidden"
//                       />
//                       <div
//                         className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
//                           isSelected ? "bg-teal-600" : "bg-slate-100"
//                         }`}
//                       >
//                         <Icon
//                           className={`w-5 h-5 sm:w-6 sm:h-6 ${
//                             isSelected ? "text-white" : "text-slate-500"
//                           }`}
//                         />
//                       </div>
//                       <span
//                         className={`text-sm sm:text-base font-medium text-center sm:mt-1 ${
//                           isSelected ? "text-slate-900" : "text-slate-700"
//                         }`}
//                       >
//                         {ft.label}
//                       </span>
//                     </label>
//                   );
//                 })}
//               </div>

//               {/* Message input */}
//               <div className="mb-8">
//                 <label className="message-label block text-sm sm:text-base font-medium text-slate-700 mb-3">
//                   Votre message
//                 </label>
//                 <textarea
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   placeholder={
//                     type === "bug"
//                       ? "Décrivez le problème..."
//                       : type === "suggestion"
//                         ? "Quelle fonctionnalité aimeriez-vous ?"
//                         : "Partagez votre expérience..."
//                   }
//                   className="w-full h-32 sm:h-40 p-3 sm:p-4 border-2 border-slate-300 rounded-lg resize-none focus:border-2 focus:border-teal-400 outline-none transition-all text-slate-700 placeholder:text-slate-400 text-sm sm:text-base"
//                 />
//               </div>

//               {/* Submit button */}
//               <button
//                 onClick={handleSubmit}
//                 disabled={!message.trim() || sending}
//                 className="submit-btn cursor-pointer w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white py-3 sm:py-4 px-6 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base sm:text-lg"
//               >
//                 {sending ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
//                     Envoi en cours...
//                   </>
//                 ) : (
//                   <>
//                     <Send className="w-5 h-5" />
//                     Envoyer le feedback
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
