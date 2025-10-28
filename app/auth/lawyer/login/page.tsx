// "use client";

// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { Eye, EyeOff } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { FormErrors } from "@/types";
// import { useAuth } from "@/hooks/useAuth";
// import { gsap } from "gsap";

// export default function LawyerLoginPage() {
//   const router = useRouter();
//   const { signIn } = useAuth();
//   const containerRef = useRef<HTMLDivElement>(null);

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

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
//         ".login-form",
//         { opacity: 0, y: 20 },
//         { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
//         "-=0.3"
//       )
//       .fromTo(
//         ".form-footer",
//         { opacity: 0, y: 20 },
//         { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
//         "-=0.2"
//       );
//   }, []);

//   const inputBaseClass =
//     "w-full h-12 px-4 text-sm border border-slate-300 rounded-lg bg-white focus:border-2 hover:border-2 hover:border-teal-300 focus:border-teal-300 outline-none transition-all duration-200 text-slate-700";
//   const errorClass = "text-red-500 text-xs mt-1";

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     if (errors[name as keyof FormErrors]) {
//       setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
//     }
//   };

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};

//     if (!formData.email.trim()) {
//       newErrors.email = "L'email est requis";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Format email invalide";
//     }

//     if (!formData.password.trim()) {
//       newErrors.password = "Le mot de passe est requis";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setIsSubmitting(true);
//     setErrors({});

//     try {
//       const result = await signIn(formData.email, formData.password, "lawyer");
//       const redirectPath = result.redirectPath || "/lawyer/dashboard";
//       router.push(redirectPath);
//     } catch (error: any) {
//       console.error("Erreur connexion avocat:", error);

//       let errorMessage = "Email ou mot de passe incorrect.";

//       if (error.message?.includes("Invalid login credentials")) {
//         errorMessage = "Email ou mot de passe incorrect.";
//       } else if (error.message?.includes("Too many requests")) {
//         errorMessage = "Trop de tentatives. Veuillez réessayer plus tard.";
//       } else if (
//         error.message?.includes("Ce compte n'est pas un compte avocat")
//       ) {
//         errorMessage = error.message;
//       } else if (error.message?.includes("User not found")) {
//         errorMessage = "Aucun compte trouvé avec cet email.";
//       } else if (error.message?.includes("Email not confirmed")) {
//         errorMessage =
//           "Veuillez confirmer votre email avant de vous connecter.";
//       }

//       setErrors({ general: errorMessage });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
//       <style>{`
//         .page-title,
//         .page-subtitle,
//         .login-form,
//         .form-footer {
//           opacity: 0;
//         }
//       `}</style>

//       <div className="max-w-md mx-auto px-4 py-24" ref={containerRef}>
//         <div className="text-center mb-8">
//           <h1 className="page-title text-2xl font-bold text-slate-800 mb-2">
//             Connexion Avocat
//           </h1>
//           <p className="page-subtitle text-slate-600">
//             Accédez à votre espace professionnel
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
//           {errors.general && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-red-600 text-sm">{errors.general}</p>
//             </div>
//           )}

//           <form
//             onSubmit={handleSubmit}
//             className="login-form space-y-6"
//             noValidate
//           >
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className={`${inputBaseClass} placeholder:text-slate-400`}
//                 placeholder="votre@email.com"
//                 required
//                 disabled={isSubmitting}
//               />
//               {errors.email && <p className={errorClass}>{errors.email}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Mot de passe
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   className={`${inputBaseClass} pr-12 placeholder:text-slate-400`}
//                   placeholder="Votre mot de passe"
//                   required
//                   disabled={isSubmitting}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   disabled={isSubmitting}
//                   className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-4 h-4" />
//                   ) : (
//                     <Eye className="w-4 h-4" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className={errorClass}>{errors.password}</p>
//               )}
//             </div>

//             <div className="flex flex-col gap-3 sm:flex-row items-center sm:justify-between">
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   disabled={isSubmitting}
//                   className="w-4 h-4 border-slate-300 rounded focus:ring-teal-500 accent-teal-600 disabled:opacity-50"
//                   style={{ accentColor: "#0d9488" }}
//                 />
//                 <span className="ml-2 text-sm text-slate-600 select-none">
//                   Se souvenir de moi
//                 </span>
//               </label>
//               <Link
//                 href="/auth/lawyer/forgot-password"
//                 className="text-sm text-teal-600 hover:text-teal-700 transition-colors font-medium text-left sm:text-right"
//               >
//                 Mot de passe oublié ?
//               </Link>
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="cursor-pointer w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {isSubmitting ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                   Connexion en cours...
//                 </>
//               ) : (
//                 "Se connecter"
//               )}
//             </button>
//           </form>

//           <div className="form-footer text-center mt-6 pt-6 border-t border-slate-100">
//             <div className="flex flex-col gap-2 sm:block">
//               <span className="text-sm text-slate-600">
//                 Nouveau sur Mizan ?
//               </span>
//               <Link
//                 href="/auth/lawyer/register"
//                 className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors sm:ml-1"
//               >
//                 Créer un compte
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

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

  const inputBaseClass =
    "w-full h-12 px-4 text-sm border border-slate-300 rounded-lg bg-white focus:border-2 hover:border-2 hover:border-teal-300 focus:border-teal-300 outline-none transition-all duration-200 text-slate-700";
  const errorClass = "text-red-500 text-xs mt-1";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email invalide";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Le mot de passe est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // ✅ Connexion
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (authError) throw authError;

      // ✅ Vérifier le type d'utilisateur et le statut vérifié
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("user_type, verified")
        .eq("id", authData.user.id)
        .single();

      if (profileError) throw profileError;

      // ✅ Vérifier que c'est bien un avocat
      if (profile.user_type !== "lawyer") {
        await supabase.auth.signOut();
        throw new Error(
          "Ce compte n'est pas un compte avocat. Veuillez utiliser la connexion client."
        );
      }

      // ✅ BLOQUER si avocat non vérifié
      if (!profile.verified) {
        await supabase.auth.signOut();
        setErrors({
          general:
            "Votre compte est en attente de validation. Vous recevrez un email dès que votre profil sera vérifié par notre équipe.",
        });
        setIsSubmitting(false);
        return;
      }

      // ✅ Si tout est OK, rediriger vers le dashboard
      router.push("/lawyer/dashboard");
    } catch (error: any) {
      console.error("Erreur connexion avocat:", error);

      let errorMessage = "Email ou mot de passe incorrect.";

      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Email ou mot de passe incorrect.";
      } else if (error.message?.includes("Too many requests")) {
        errorMessage = "Trop de tentatives. Veuillez réessayer plus tard.";
      } else if (
        error.message?.includes("Ce compte n'est pas un compte avocat")
      ) {
        errorMessage = error.message;
      } else if (error.message?.includes("User not found")) {
        errorMessage = "Aucun compte trouvé avec cet email.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage =
          "Veuillez confirmer votre email avant de vous connecter.";
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
      <style>{`
        .page-title,
        .page-subtitle,
        .login-form,
        .form-footer {
          opacity: 0;
        }
      `}</style>

      <div className="max-w-md mx-auto px-4 py-24" ref={containerRef}>
        <div className="text-center mb-8">
          <h1 className="page-title text-2xl font-bold text-slate-800 mb-2">
            Connexion Avocat
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
                onChange={handleInputChange}
                className={`${inputBaseClass} placeholder:text-slate-400`}
                placeholder="votre@email.com"
                required
                disabled={isSubmitting}
              />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
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
                  onChange={handleInputChange}
                  className={`${inputBaseClass} pr-12 placeholder:text-slate-400`}
                  placeholder="Votre mot de passe"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className={errorClass}>{errors.password}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row items-center sm:justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isSubmitting}
                  className="w-4 h-4 border-slate-300 rounded focus:ring-teal-500 accent-teal-600 disabled:opacity-50"
                  style={{ accentColor: "#0d9488" }}
                />
                <span className="ml-2 text-sm text-slate-600 select-none">
                  Se souvenir de moi
                </span>
              </label>
              <Link
                href="/auth/lawyer/forgot-password"
                className="text-sm text-teal-600 hover:text-teal-700 transition-colors font-medium text-left sm:text-right"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <div className="form-footer text-center mt-6 pt-6 border-t border-slate-100">
            <div className="flex flex-col gap-2 sm:block">
              <span className="text-sm text-slate-600">
                Nouveau sur Mizan ?
              </span>
              <Link
                href="/auth/lawyer/register"
                className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors sm:ml-1"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
