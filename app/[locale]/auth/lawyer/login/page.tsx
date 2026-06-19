"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormErrors } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { gsap } from "gsap";

export default function LawyerLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const containerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap
      .timeline()
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
        ".login-form",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        ".form-footer",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.2"
      );
  }, []);

  const inputCls =
    "w-full h-12 px-4 text-sm border border-slate-300 rounded-lg bg-white focus:border-2 hover:border-2 hover:border-teal-300 focus:border-teal-300 outline-none transition-all text-slate-700";
  const errCls = "text-red-500 text-xs mt-1";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FormErrors])
      setErrors((p) => ({ ...p, [name]: undefined, general: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!formData.email.trim()) e.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Format email invalide";
    if (!formData.password.trim()) e.password = "Le mot de passe est requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      const { data: auth, error: authErr } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
      if (authErr) throw authErr;

      const { data: profile, error: profErr } = await supabase
        .from("users")
        .select("user_type, verified")
        .eq("id", auth.user.id)
        .single();
      if (profErr) throw profErr;

      if (profile.user_type !== "lawyer") {
        await supabase.auth.signOut();
        throw new Error(
          "Ce compte n'est pas un compte professionnel. Utilisez la connexion client."
        );
      }
      if (!profile.verified) {
        await supabase.auth.signOut();
        setErrors({
          general:
            "Votre compte est en attente de validation. Vous recevrez un email dès que votre profil sera vérifié.",
        });
        setIsSubmitting(false);
        return;
      }
      router.push("/lawyer/dashboard");
    } catch (err: any) {
      let msg = "Email ou mot de passe incorrect.";
      if (err.message?.includes("Invalid login credentials"))
        msg = "Email ou mot de passe incorrect.";
      else if (err.message?.includes("Too many requests"))
        msg = "Trop de tentatives. Réessayez plus tard.";
      else if (err.message?.includes("professionnel")) msg = err.message;
      else if (err.message?.includes("User not found"))
        msg = "Aucun compte trouvé avec cet email.";
      else if (err.message?.includes("Email not confirmed"))
        msg = "Confirmez votre email avant de vous connecter.";
      setErrors({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <style>{`.page-title,.page-subtitle,.login-form,.form-footer{opacity:0;}`}</style>
      <div className="max-w-md mx-auto px-4 py-24" ref={containerRef}>
        <div className="text-center mb-8">
          {/* ← CHANGÉ : Connexion Avocat → Connexion Professionnel */}
          <h1 className="page-title text-2xl font-bold text-slate-800 mb-2">
            Connexion Professionnel
          </h1>
          <p className="page-subtitle text-slate-600">
            Accédez à votre espace professionnel
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="login-form space-y-6"
            noValidate
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${inputCls} placeholder:text-slate-400`}
                placeholder="votre@email.com"
                disabled={isSubmitting}
              />
              {errors.email && <p className={errCls}>{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputCls} pr-12 placeholder:text-slate-400`}
                  placeholder="Votre mot de passe"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && <p className={errCls}>{errors.password}</p>}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row items-center sm:justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isSubmitting}
                  className="w-4 h-4 border-slate-300 rounded"
                  style={{ accentColor: "#0d9488" }}
                />
                <span className="ml-2 text-sm text-slate-600 select-none">
                  Se souvenir de moi
                </span>
              </label>
              <Link
                href="/auth/lawyer/forgot-password"
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />{" "}
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
          <div className="form-footer text-center mt-6 pt-6 border-t border-slate-100">
            <span className="text-sm text-slate-600">Nouveau sur Mizan ? </span>
            <Link
              href="/auth/lawyer/register"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
