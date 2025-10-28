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

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, Clock, Scale, ArrowRight, Loader2 } from "lucide-react";
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
          // Récupérer les métadonnées utilisateur
          const firstName = user.user_metadata?.firstName || "";
          const lastName = user.user_metadata?.lastName || "";
          setLawyerName(firstName ? `${firstName} ${lastName}`.trim() : "");
        }
      } catch (error) {
        // Silencieux en cas d'erreur
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Scale className="h-16 w-16 text-teal-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Bienvenue {lawyerName && `Maître ${lawyerName}`} sur Mizan !
          </h1>
          <p className="text-lg text-slate-600">
            Votre compte avocat a été créé avec succès
          </p>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Compte créé avec succès !
            </h2>
            <p className="text-slate-600 mb-8">
              Nos équipes vont vérifier vos informations professionnelles. Ce
              processus prend généralement 24 à 48 heures.
            </p>
          </div>

          {/* Statut */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-3">
              <Clock className="w-5 h-5 text-amber-600 mr-3" />
              <span className="font-medium text-amber-800">
                Vérification en cours
              </span>
            </div>
            <p className="text-amber-700 text-sm">
              Vous recevrez un email dès que votre profil sera validé et visible
              par les clients.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/lawyer/dashboard")}
              className="cursor-pointer bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center"
            >
              Voir mon tableau de bord
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <button
              onClick={() => router.push("/")}
              className="cursor-pointer border border-slate-300 text-slate-600 px-8 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center mt-8">
          <p className="text-slate-600 text-sm">
            Des questions ? Contactez-nous à{" "}
            <a
              href="mailto:support@mizan-dz.com"
              className="text-teal-600 hover:text-teal-700"
            >
              support@mizan-dz.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
