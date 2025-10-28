// "use client";
// import { useRouter } from "next/navigation";
// import { CheckCircle, Clock, Scale, ArrowRight } from "lucide-react";
// export default function LawyerOnboardingPage() {
//   const router = useRouter();
//   return (
//     <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
//       {" "}
//       <div className="max-w-2xl mx-auto px-4 py-16">
//         {" "}
//         {/* Header simple */}{" "}
//         <div className="text-center mb-12">
//           {" "}
//           <Scale className="h-16 w-16 text-teal-600 mx-auto mb-6" />{" "}
//           <h1 className="text-3xl font-bold text-slate-800 mb-4">
//             {" "}
//             Bienvenue sur Mizan !{" "}
//           </h1>{" "}
//           <p className="text-lg text-slate-600">
//             {" "}
//             Votre compte avocat a été créé avec succès{" "}
//           </p>{" "}
//         </div>{" "}
//         {/* Contenu principal simplifié */}{" "}
//         <div className="bg-white rounded-2xl shadow-lg p-8">
//           {" "}
//           <div className="text-center mb-8">
//             {" "}
//             <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
//               {" "}
//               <CheckCircle className="w-10 h-10 text-green-600" />{" "}
//             </div>{" "}
//             <h2 className="text-2xl font-bold text-slate-800 mb-4">
//               {" "}
//               Compte créé avec succès !{" "}
//             </h2>{" "}
//             <p className="text-slate-600 mb-8">
//               {" "}
//               Nos équipes vont vérifier vos informations professionnelles. Ce
//               processus prend généralement 24 à 48 heures.{" "}
//             </p>{" "}
//           </div>{" "}
//           {/* Statut simple */}{" "}
//           <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
//             {" "}
//             <div className="flex items-center mb-3">
//               {" "}
//               <Clock className="w-5 h-5 text-amber-600 mr-3" />{" "}
//               <span className="font-medium text-amber-800">
//                 {" "}
//                 Vérification en cours{" "}
//               </span>{" "}
//             </div>{" "}
//             <p className="text-amber-700 text-sm">
//               {" "}
//               Vous recevrez un email dès que votre profil sera validé et visible
//               par les clients.{" "}
//             </p>{" "}
//           </div>{" "}
//           {/* Actions simples */}{" "}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             {" "}
//             <button
//               onClick={() => router.push("/lawyer/dashboard")}
//               className="cursor-pointer bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center"
//             >
//               {" "}
//               Voir mon tableau de bord{" "}
//               <ArrowRight className="w-4 h-4 ml-2" />{" "}
//             </button>{" "}
//             <button
//               onClick={() => router.push("/")}
//               className="cursor-pointer border border-slate-300 text-slate-600 px-8 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
//             >
//               {" "}
//               Retour à l'accueil{" "}
//             </button>{" "}
//           </div>{" "}
//         </div>{" "}
//         {/* Contact simple */}{" "}
//         <div className="text-center mt-8">
//           {" "}
//           <p className="text-slate-600 text-sm">
//             {" "}
//             Des questions ? Contactez-nous à{" "}
//             <a
//               href="mailto:support@mizan-dz.com"
//               className="text-teal-600 hover:text-teal-700"
//             >
//               {" "}
//               support@mizan-dz.com{" "}
//             </a>{" "}
//           </p>{" "}
//         </div>{" "}
//       </div>{" "}
//     </div>
//   );
// }

// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { CheckCircle, Clock, Scale, ArrowRight, Loader2 } from "lucide-react";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// export default function LawyerOnboardingPage() {
//   const router = useRouter();
//   const supabase = createClientComponentClient();
//   const [lawyerName, setLawyerName] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const {
//           data: { user },
//         } = await supabase.auth.getUser();

//         if (user) {
//           // Récupérer les métadonnées utilisateur
//           const firstName = user.user_metadata?.firstName || "";
//           const lastName = user.user_metadata?.lastName || "";
//           setLawyerName(firstName ? `${firstName} ${lastName}`.trim() : "");
//         }
//       } catch (error) {
//         // Silencieux en cas d'erreur
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [supabase]);

//   if (loading) {
//     return (
//       <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
//         <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
//       <div className="max-w-2xl mx-auto px-4 py-16">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <Scale className="h-16 w-16 text-teal-600 mx-auto mb-6" />
//           <h1 className="text-3xl font-bold text-slate-800 mb-4">
//             Bienvenue {lawyerName && `Maître ${lawyerName}`} sur Mizan !
//           </h1>
//           <p className="text-lg text-slate-600">
//             Votre compte avocat a été créé avec succès
//           </p>
//         </div>

//         {/* Contenu principal */}
//         <div className="bg-white rounded-2xl shadow-lg p-8">
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
//               <CheckCircle className="w-10 h-10 text-green-600" />
//             </div>
//             <h2 className="text-2xl font-bold text-slate-800 mb-4">
//               Compte créé avec succès !
//             </h2>
//             <p className="text-slate-600 mb-8">
//               Nos équipes vont vérifier vos informations professionnelles. Ce
//               processus prend généralement 24 à 48 heures.
//             </p>
//           </div>

//           {/* Statut */}
//           <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
//             <div className="flex items-center mb-3">
//               <Clock className="w-5 h-5 text-amber-600 mr-3" />
//               <span className="font-medium text-amber-800">
//                 Vérification en cours
//               </span>
//             </div>
//             <p className="text-amber-700 text-sm">
//               Vous recevrez un email dès que votre profil sera validé et visible
//               par les clients.
//             </p>
//           </div>

//           {/* Actions */}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button
//               onClick={() => router.push("/")}
//               className="cursor-pointer border border-slate-300 text-slate-600 px-8 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
//             >
//               Retour à l'accueil
//             </button>
//           </div>
//         </div>

//         {/* Contact */}
//         <div className="text-center mt-8">
//           <p className="text-slate-600 text-sm">
//             Des questions ? Contactez-nous à{" "}
//             <a
//               href="mailto:support@mizan-dz.com"
//               className="text-teal-600 hover:text-teal-700"
//             >
//               support@mizan-dz.com
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, Clock, Scale, Loader2 } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LawyerOnboardingPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [lawyerName, setLawyerName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // ✅ Vérifier si vérifié
          const { data: profile } = await supabase
            .from("users")
            .select("verified, user_type")
            .eq("id", user.id)
            .single();

          // ✅ Si avocat vérifié, rediriger vers dashboard
          if (profile?.user_type === "lawyer" && profile?.verified) {
            router.push("/lawyer/dashboard");
            return;
          }

          // ✅ Si avocat non vérifié, déconnecter
          if (profile?.user_type === "lawyer" && !profile?.verified) {
            await supabase.auth.signOut();
          }

          // Récupérer le nom
          const firstName = user.user_metadata?.firstName || "";
          const lastName = user.user_metadata?.lastName || "";
          setLawyerName(firstName ? `${firstName} ${lastName}`.trim() : "");
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mb-3">
            🎉 Inscription réussie !
          </h1>

          <p className="text-slate-600 text-lg mb-6">
            Votre profil a bien été créé
          </p>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-lg mb-8">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">
                ⏳ En attente de validation
              </h3>
              <p className="text-amber-800 text-sm leading-relaxed">
                Notre équipe examine actuellement votre profil. Vous recevrez un
                email de confirmation dès que votre compte sera validé.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-teal-600 font-bold">1</span>
            </div>
            <div>
              <p className="font-medium text-slate-800">
                Vérification des informations
              </p>
              <p className="text-sm text-slate-500">
                Contrôle de vos données professionnelles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-teal-600 font-bold">2</span>
            </div>
            <div>
              <p className="font-medium text-slate-800">
                Validation par l'équipe
              </p>
              <p className="text-sm text-slate-500">
                Généralement sous 24-48 heures
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-teal-600 font-bold">3</span>
            </div>
            <div>
              <p className="font-medium text-slate-800">
                Notification par email
              </p>
              <p className="text-sm text-slate-500">
                Vous pourrez ensuite accéder à votre espace
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-500 text-center">
            Besoin d'aide ? Contactez-nous à{" "}
            <a
              href="mailto:support@mizan-dz.com"
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              support@mizan-dz.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
