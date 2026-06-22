"use client";

import { useState } from "react";
import { Eye, EyeOff, Key, X, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { ChangePasswordModalProps } from "@/types";

export default function ChangePasswordModal({
  isOpen,
  onClose,
  showToast,
}: ChangePasswordModalProps) {
  const supabase = createClient();
  const t = useTranslations("changePasswordModal");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError(t("minLength"));
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setError(t("complexity"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("mismatch"));
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.email) {
        throw new Error(t("userNotFound"));
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password: currentPassword,
      });

      if (signInError) {
        setError(t("wrongPassword"));
        setIsSubmitting(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(t("errorPrefix", { msg: updateError.message }));
        setIsSubmitting(false);
        return;
      }

      showToast(t("successToast"), "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err: any) {
      console.error("Erreur changement mot de passe:", err);
      setError(err.message || t("genericError"));
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
              <Key className="w-5 h-5 text-teal-600" />
            </div>
            {t("title")}
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
              {t("currentPasswordLabel")}
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base text-slate-900 bg-white border-2 border-slate-300 rounded-lg hover:border-teal-300 focus:border-teal-300 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all duration-200 placeholder:text-slate-400"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="cursor-pointer absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t("newPasswordLabel")}
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base text-slate-900 bg-white border-2 border-slate-300 rounded-lg hover:border-teal-300 focus:border-teal-300 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all duration-200 placeholder:text-slate-400"
                placeholder={t("newPasswordPh")}
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="cursor-pointer absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {t("newPasswordHint")}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t("confirmPasswordLabel")}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base text-slate-900 bg-white border-2 border-slate-300 rounded-lg hover:border-teal-300 focus:border-teal-300 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all duration-200 placeholder:text-slate-400"
                placeholder={t("confirmPasswordPh")}
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="cursor-pointer absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer flex-1 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all hover:shadow-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  {t("submitting")}
                </span>
              ) : (
                t("submit")
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer flex-1 border-2 border-slate-300 text-slate-600 py-3 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
