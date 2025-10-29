"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Home } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

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
          // Pas d'utilisateur connecté, rester sur la page
          setLoading(false);
          return;
        }

        // ✅ Récupérer le profil avec first_name et last_name
        const { data: profile } = await supabase
          .from("users")
          .select("verified, user_type, first_name, last_name")
          .eq("id", user.id)
          .single();

        if (!profile) {
          setLoading(false);
          return;
        }

        // ✅ Si avocat vérifié, rediriger vers dashboard
        if (profile.user_type === "lawyer" && profile.verified) {
          router.push("/lawyer/dashboard");
          return;
        }

        // ✅ Si avocat non vérifié
        if (profile.user_type === "lawyer" && !profile.verified) {
          // Récupérer et formater le nom
          const firstName =
            profile.first_name || user.user_metadata?.firstName || "";
          const lastName =
            profile.last_name || user.user_metadata?.lastName || "";

          let fullName = "";
          if (firstName && lastName) {
            fullName = `${firstName} ${lastName}`.trim();
          } else if (firstName) {
            fullName = firstName;
          } else if (lastName) {
            fullName = lastName;
          }

          setLawyerName(fullName);

          // ✅ Déconnecter l'utilisateur
          await supabase.auth.signOut();
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

  // Afficher un loader pendant la vérification
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
            🎉 Inscription réussie{lawyerName ? `, ${lawyerName}` : ""} !
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

        {/* ✅ NOUVEAU: Bouton pour retourner à l'accueil */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="text-center mb-4">
            <p className="text-sm text-slate-500 mb-4">
              Vous avez été déconnecté automatiquement pour des raisons de
              sécurité.
            </p>
            <Link href="/">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg">
                <Home className="w-4 h-4" />
                Retour à l'accueil
              </button>
            </Link>
          </div>

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
