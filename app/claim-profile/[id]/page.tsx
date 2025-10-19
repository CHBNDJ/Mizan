"use client";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getAvocatById } from "@/lib/avocatsData";
import { AlertCircle, Mail, Lock, CheckCircle2 } from "lucide-react";

export default function ClaimProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [avocat, setAvocat] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getAvocatById(id).then((data) => {
      // Vérifier si le profil est déjà réclamé
      if (data?.is_claimed) {
        alert(
          "⚠️ Ce profil a déjà été réclamé et est géré par son propriétaire."
        );
        router.push(`/lawyers/${id}`);
        return;
      }
      setAvocat(data);
    });
  }, [id, router]);

  // Étape 1 : Générer et envoyer le code par email
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Vérifier que l'email correspond
    if (email !== avocat?.contact?.email) {
      setError("Cet email ne correspond pas au profil");
      setLoading(false);
      return;
    }

    try {
      // 1. Générer code 6 chiffres
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(newCode);

      // 2. Envoyer l'email via l'API
      const response = await fetch("/api/send-claim-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          code: newCode,
          lawyerName: `${avocat.prenom} ${avocat.nom}`,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de l'envoi du code");
      }

      // 3. Passer à l'étape 2
      setStep(2);
      setError("");
    } catch (err: any) {
      console.error("Erreur envoi code:", err);
      setError(err.message || "Erreur lors de l'envoi du code");
    } finally {
      setLoading(false);
    }
  };

  // Étape 2 : Vérifier code et activer compte
  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Vérifier le code
    if (code !== generatedCode) {
      setError("Code invalide");
      setLoading(false);
      return;
    }

    // Vérifier le mot de passe
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      setLoading(false);
      return;
    }

    try {
      // Appeler l'API pour activer le compte
      const response = await fetch("/api/claim-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lawyerId: id,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'activation");
      }

      // Succès !
      alert(
        "✅ Profil activé avec succès ! Vous pouvez maintenant vous connecter."
      );
      router.push("/auth/lawyer/login");
    } catch (err: any) {
      console.error("Erreur activation:", err);
      setError(err.message || "Erreur lors de l'activation du compte");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (!avocat) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-teal-50 via-white to-teal-50">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Réclamer votre profil
          </h1>
          <p className="text-slate-600">
            {avocat.prenom} {avocat.nom}
          </p>
        </div>

        {/* Card principale */}
        <Card className="shadow-xl border-0">
          <div className="p-8">
            {/* ÉTAPE 1 : Entrer l'email */}
            {step === 1 && (
              <form onSubmit={handleSendCode} className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <Mail className="w-4 h-4" />
                    Confirmez votre email professionnel
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={avocat.contact.email}
                    className="w-full h-12 px-4 text-sm border border-slate-300 rounded-lg bg-white focus:border-2 hover:border-2 hover:border-teal-300 focus:border-teal-300 outline-none transition-all duration-200 text-slate-700"
                    required
                    disabled={loading}
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Entrez : <strong>{avocat.contact.email}</strong>
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Envoi en cours...
                    </div>
                  ) : (
                    "Envoyer le code de vérification"
                  )}
                </Button>

                <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg">
                  <p className="text-teal-800 text-sm">
                    📧 Un code de vérification sera envoyé à votre adresse
                    email. Vérifiez aussi vos spams !
                  </p>
                </div>
              </form>
            )}

            {/* ÉTAPE 2 : Entrer le code et créer le mot de passe */}
            {step === 2 && (
              <form onSubmit={handleActivate} className="space-y-6">
                {/* Message de succès envoi */}
                <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-teal-800 font-medium text-sm">
                        Code envoyé avec succès !
                      </p>
                      <p className="text-teal-700 text-xs mt-1">
                        Vérifiez votre boîte mail : <strong>{email}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Code de vérification */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
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
                    className="w-full h-12 px-4 text-sm border border-slate-300 rounded-lg bg-white focus:border-2 hover:border-2 hover:border-teal-300 focus:border-teal-300 outline-none transition-all duration-200 text-slate-700"
                    required
                    maxLength={6}
                    disabled={loading}
                  />
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Entrez le code reçu par email
                  </p>
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <Lock className="w-4 h-4" />
                    Créer votre mot de passe
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 px-4 text-sm border border-slate-300 rounded-lg bg-white focus:border-2 hover:border-2 hover:border-teal-300 focus:border-teal-300 outline-none transition-all duration-200 text-slate-700"
                    required
                    minLength={8}
                    disabled={loading}
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Minimum 8 caractères
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="cursor-pointer flex-1 h-12 bg-teal-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer flex-[2] h-12 bg-teal-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Activation...
                      </div>
                    ) : (
                      "Activer mon compte"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          En activant votre compte, vous pourrez gérer votre profil, recevoir
          des consultations et interagir avec vos clients.
        </p>
      </div>
    </div>
  );
}
