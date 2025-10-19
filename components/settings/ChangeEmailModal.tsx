"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, X, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ChangeEmailModalProps } from "@/types";

export default function ChangeEmailModal({
  isOpen,
  onClose,
  showToast,
  onSuccess,
}: ChangeEmailModalProps) {
  const supabase = createClient();
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setError("Format d'email invalide.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.email) {
        throw new Error("Utilisateur non trouvé");
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password: password,
      });

      if (signInError) {
        setError("Mot de passe incorrect.");
        setIsSubmitting(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (updateError) {
        setError("Erreur : " + updateError.message);
        setIsSubmitting(false);
        return;
      }

      setNewEmail("");
      setPassword("");
      onClose();
      onSuccess(newEmail);
    } catch (err: any) {
      console.error("Erreur changement email:", err);
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Mail className="w-5 h-5 text-teal-600" />
            </div>
            Modifier l'email
          </h3>
          <button
            onClick={onClose}
            className="cursor-pointer text-slate-800 hover:text-teal-600 p-2 hover:bg-teal-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 animate-shake">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nouvel email *
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base text-slate-900 bg-white border-2 border-slate-300 rounded-lg hover:border-teal-300 focus:border-teal-300 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all duration-200 placeholder:text-slate-400"
              placeholder="nouveau@email.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mot de passe actuel *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base text-slate-900 bg-white border-2 border-slate-300 rounded-lg hover:border-teal-300 focus:border-teal-300 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all duration-200 placeholder:text-slate-400"
                placeholder="Votre mot de passe"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Double validation requise (sécurité)
            </p>
            <ol className="text-amber-700 text-xs space-y-1.5 list-decimal list-inside ml-1">
              <li>
                Vous recevrez un email sur votre <strong>ancien email</strong>
              </li>
              <li>
                Vous recevrez un email sur votre <strong>nouvel email</strong>
              </li>
              <li>
                <strong>Vous devez cliquer sur les 2 liens</strong> pour valider
                le changement
              </li>
            </ol>
            <p className="text-amber-600 text-xs mt-2 italic">
              Cette double validation protège votre compte contre le piratage.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer flex-1 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all hover:shadow-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Envoi...
                </span>
              ) : (
                "Modifier"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer flex-1 border-2 border-slate-300 text-slate-600 py-3 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
