"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Home } from "lucide-react";
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

        if (!user) {
          setLoading(false);
          return;
        }

        // ✅ Récupérer le profil
        const { data: profile } = await supabase
          .from("users")
          .select("user_type, first_name, last_name")
          .eq("id", user.id)
          .single();

        if (!profile) {
          setLoading(false);
          return;
        }

        // ✅ Vérifier le statut de vérification dans la table lawyers
        const { data: lawyerData } = await supabase
          .from("lawyers")
          .select("is_verified")
          .eq("id", user.id)
          .single();

        // ✅ Si avocat vérifié, rediriger vers dashboard
        if (profile.user_type === "lawyer" && lawyerData?.is_verified) {
          router.push("/lawyer/dashboard");
          return;
        }

        // ✅ Si avocat non vérifié, afficher la page d'attente
        if (profile.user_type === "lawyer" && !lawyerData?.is_verified) {
          const firstName = profile.first_name || "";
          const lastName = profile.last_name || "";

          // ✅ Formater avec "Maître"
          let fullName = "";
          if (firstName && lastName) {
            fullName = `Maître ${firstName} ${lastName}`;
          } else if (firstName) {
            fullName = `Maître ${firstName}`;
          } else if (lastName) {
            fullName = `Maître ${lastName}`;
          } else {
            fullName = "Maître";
          }

          setLawyerName(fullName);

          // ✅ Déconnecter l'utilisateur
          await supabase.auth.signOut();
          await new Promise((resolve) => setTimeout(resolve, 500));
          setLoading(false);
          return;
        }

        // ✅ Si ce n'est pas un avocat, rediriger vers accueil
        if (profile.user_type !== "lawyer") {
          router.push("/");
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error("Erreur dans fetchUserData:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [supabase, router]);

  const handleReturnHome = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Vérification de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* ✅ En-tête simplifié */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mb-3">
            🎉 Bienvenue {lawyerName} !
          </h1>

          <p className="text-slate-600 text-lg">
            Votre inscription a bien été enregistrée
          </p>
        </div>

        {/* ✅ Message principal simplifié */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-lg mb-6">
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
                Validation en cours
              </h3>
              <p className="text-amber-800 text-sm leading-relaxed">
                Notre équipe vérifie vos informations. Vous recevrez un email
                sous 24-48h pour activer votre compte.
              </p>
            </div>
          </div>
        </div>

        {/* ✅ Étapes simplifiées */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-teal-600 font-bold text-sm">1</span>
            </div>
            <p className="text-sm text-slate-700">
              Vérification de vos informations
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-teal-600 font-bold text-sm">2</span>
            </div>
            <p className="text-sm text-slate-700">Validation (24-48h)</p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-teal-600 font-bold text-sm">3</span>
            </div>
            <p className="text-sm text-slate-700">
              Email de confirmation avec accès
            </p>
          </div>
        </div>

        {/* ✅ Bouton retour simplifié */}
        <div className="text-center pt-6 border-t border-slate-200">
          <button
            onClick={handleReturnHome}
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg cursor-pointer mb-4"
          >
            <Home className="w-4 h-4" />
            Retour à l'accueil
          </button>

          <p className="text-sm text-slate-500">
            Questions ?{" "}
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
