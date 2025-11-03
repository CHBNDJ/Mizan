"use client";
import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getAvocatById } from "@/lib/avocatsData";
import {
  AlertCircle,
  Mail,
  Lock,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { gsap } from "gsap";

export default function ClaimProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [avocat, setAvocat] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getAvocatById(id).then((data) => {
      if (data?.is_claimed) {
        router.push(`/lawyers/${id}`);
        return;
      }
      setAvocat(data);
    });
  }, [id, router]);

  useEffect(() => {
    if (!containerRef.current || !avocat) return;

    const timeline = gsap.timeline();

    timeline
      .fromTo(
        ".header-icon",
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
        ".main-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".footer-text",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        "-=0.2"
      );
  }, [avocat]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const avocatEmail = avocat?.contact?.email;
    if (email !== avocatEmail) {
      setError("Cet email ne correspond pas au profil");
      setLoading(false);
      return;
    }

    try {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(newCode);

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

      setStep(2);
      setError("");
    } catch (err: any) {
      console.error("Erreur envoi code:", err);
      setError(err.message || "Erreur lors de l'envoi du code");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (code !== generatedCode) {
      setError("Code invalide");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      setLoading(false);
      return;
    }

    try {
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

      router.push("/auth/lawyer/login");
    } catch (err: any) {
      console.error("Erreur activation:", err);
      setError(err.message || "Erreur lors de l'activation du compte");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen pt-24 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
      <style>{`
        .header-icon,
        .page-title,
        .page-subtitle,
        .main-card,
        .footer-text {
          opacity: 0;
        }
      `}</style>

      <div className="w-full max-w-lg mx-auto px-4 py-8" ref={containerRef}>
        <div className="text-center mb-8">
          <div className="header-icon inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-6">
            <CheckCircle2 className="w-10 h-10 text-teal-600" />
          </div>
          <h1 className="page-title text-4xl font-bold text-slate-800 mb-3">
            Réclamer votre profil
          </h1>
          <p className="page-subtitle text-lg text-slate-600">
            {avocat.prenom} {avocat.nom}
          </p>
        </div>

        <Card className="main-card shadow-2xl border-0">
          <div className="p-8">
            {step === 1 && (
              <form onSubmit={handleSendCode} className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                    <Mail className="w-5 h-5" />
                    Confirmez votre email professionnel
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    className="w-full h-14 px-4 text-base border-2 border-slate-300 rounded-lg bg-white focus:border-teal-400 hover:border-teal-300 outline-none transition-all duration-200 text-slate-700"
                    required
                    disabled={loading}
                  />
                  <p className="text-sm text-slate-500 mt-3 text-center">
                    Email attendu :{" "}
                    <strong className="text-teal-600">
                      {avocat.contact.email}
                    </strong>
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white text-base font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Envoi en cours...
                    </div>
                  ) : (
                    "Envoyer le code de vérification"
                  )}
                </Button>

                <div className="bg-teal-50 border-2 border-teal-200 p-4 rounded-lg">
                  <p className="text-teal-800 text-sm">
                    📧 Un code de vérification sera envoyé à votre adresse
                    email. Vérifiez aussi vos spams !
                  </p>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleActivate} className="space-y-6">
                <div className="bg-teal-50 border-2 border-teal-200 p-5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-teal-800 font-semibold text-base">
                        Code envoyé avec succès !
                      </p>
                      <p className="text-teal-700 text-sm mt-1">
                        Vérifiez votre boîte mail : <strong>{email}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Code de vérification (6 chiffres)
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 6) setCode(value);
                    }}
                    placeholder="000000"
                    className="w-full h-16 px-4 text-center text-2xl font-bold tracking-widest border-2 border-slate-300 rounded-lg bg-white focus:border-teal-400 hover:border-teal-300 outline-none transition-all duration-200 text-slate-700 placeholder:text-slate-300"
                    required
                    maxLength={6}
                    disabled={loading}
                  />
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Entrez le code à 6 chiffres reçu par email
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                    <Lock className="w-5 h-5" />
                    Créer votre mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 caractères"
                      className="w-full h-14 px-4 pr-12 text-base border-2 border-slate-300 rounded-lg bg-white focus:border-teal-400 hover:border-teal-300 outline-none transition-all duration-200 text-slate-700"
                      required
                      minLength={8}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Minimum 8 caractères recommandés
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="cursor-pointer flex-1 h-14 bg-slate-200 text-slate-700 text-base font-semibold rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer flex-[2] h-14 bg-teal-600 text-white text-base font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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

        <p className="footer-text text-center text-sm text-slate-500 mt-6">
          En activant votre compte, vous pourrez gérer votre profil, recevoir
          des consultations et interagir avec vos clients.
        </p>
      </div>
    </div>
  );
}
