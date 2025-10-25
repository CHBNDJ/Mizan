"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Shield,
  Eye,
  Trash2,
  LogOut,
  Check,
  AlertTriangle,
  Mail,
  Key,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ToastState } from "@/types";
import ChangePasswordModal from "@/components/settings/ChangePasswordModal";
import ChangeEmailModal from "@/components/settings/ChangeEmailModal";
import EmailConfirmationModal from "@/components/settings/EmailConfirmationModal";
import { gsap } from "gsap";

const Toast = ({
  message,
  type,
  show,
  onClose,
}: {
  message: string;
  type: "success" | "error" | "warning";
  show: boolean;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-amber-500",
  }[type];

  const icon = {
    success: <Check className="w-4 h-4" />,
    error: <AlertTriangle className="w-4 h-4" />,
    warning: <AlertTriangle className="w-4 h-4" />,
  }[type];

  return (
    <div
      className={`fixed top-20 right-4 ${bgColor} text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 transition-all duration-300 text-sm sm:text-base max-w-[90vw] sm:max-w-md`}
    >
      {icon}
      <span className="truncate">{message}</span>
    </div>
  );
};

export default function SettingsPage() {
  const supabase = createClient();
  const { signOut, user, profile } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
  });

  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStep, setDeleteStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  useEffect(() => {
    if (!containerRef.current || isLoading) return;

    const timeline = gsap.timeline();

    timeline
      .fromTo(
        ".page-header",
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
        ".settings-section",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.3"
      );
  }, [isLoading]);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setNotifications({
            email: data.email_notifications,
            push: data.push_notifications,
          });
        }
      } catch (error) {
        console.error("Erreur chargement préférences:", error);
        showToast("Erreur lors du chargement des préférences", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  const saveNotificationSettings = async (
    newSettings: typeof notifications
  ) => {
    if (!user) {
      showToast("Utilisateur non connecté", "error");
      return;
    }

    setIsSaving(true);
    try {
      const { data: updateData, error: updateError } = await supabase
        .from("user_preferences")
        .update({
          email_notifications: newSettings.email,
          push_notifications: newSettings.push,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select();

      if (updateData && updateData.length === 0) {
        const { error: insertError } = await supabase
          .from("user_preferences")
          .insert({
            user_id: user.id,
            email_notifications: newSettings.email,
            push_notifications: newSettings.push,
          });

        if (insertError) throw insertError;
      } else if (updateError) {
        throw updateError;
      }

      setNotifications(newSettings);
      showToast("Préférences sauvegardées avec succès", "success");
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      showToast("Erreur lors de la sauvegarde", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const showToast = (
    message: string,
    type: "success" | "error" | "warning"
  ) => {
    setToast({ show: true, message, type });
  };

  const handleNotificationChange = (
    key: keyof typeof notifications,
    value: boolean
  ) => {
    const newSettings = { ...notifications, [key]: value };
    saveNotificationSettings(newSettings);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      showToast("Déconnexion réussie", "success");
      setTimeout(() => router.push("/"), 1000);
    } catch (error) {
      console.error("Erreur déconnexion:", error);
      showToast("Erreur lors de la déconnexion", "error");
    }
  };

  const handleDeleteAccount = () => {
    setDeleteStep(1);
  };

  const confirmDelete = async () => {
    if (!user) {
      showToast("Utilisateur non connecté", "error");
      return;
    }

    setIsDeleting(true);

    try {
      showToast("Suppression en cours...", "warning");
      const { data: session, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !session?.session) {
        throw new Error("Session invalide");
      }

      const userId = user.id;

      try {
        const { data, error } = await supabase.functions.invoke(
          "delete-account",
          {
            headers: {
              Authorization: `Bearer ${session.session.access_token}`,
            },
          }
        );

        if (!error && data?.success) {
          showToast("Compte supprimé avec succès", "success");

          await fetch("/api/admin/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subject: "Compte utilisateur supprimé",
              title: "Suppression de compte",
              message: `
              <p><strong>Utilisateur :</strong> ${user.email}</p>
              <p><strong>Type :</strong> ${profile?.user_type}</p>
              <p><strong>ID :</strong> ${user.id}</p>
              <p><strong>Date :</strong> ${new Date().toLocaleString("fr-FR")}</p>
            `,
              priority: "normal",
            }),
          });

          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
          return;
        }
      } catch (edgeError) {
        console.warn("Edge Function non disponible:", edgeError);
      }

      showToast("Suppression des données en cours...", "warning");

      await supabase.from("user_preferences").delete().eq("user_id", userId);
      await supabase.from("notifications").delete().eq("user_id", userId);
      await supabase.from("lawyers").delete().eq("id", userId);
      await supabase.from("users").delete().eq("id", userId);

      showToast("Compte supprimé avec succès", "success");

      await fetch("/api/admin/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "Compte utilisateur supprimé",
          title: "Suppression de compte",
          message: `
          <p><strong>Utilisateur :</strong> ${user.email}</p>
          <p><strong>Type :</strong> ${profile?.user_type}</p>
          <p><strong>ID :</strong> ${user.id}</p>
          <p><strong>Date :</strong> ${new Date().toLocaleString("fr-FR")}</p>
        `,
          priority: "normal",
        }),
      });

      setTimeout(async () => {
        await signOut();
        window.location.href = "/";
      }, 2000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      showToast(`Erreur: ${errorMessage}`, "error");
      setIsDeleting(false);
      setDeleteStep(0);
    }
  };

  const cancelDelete = () => {
    setIsDeleting(false);
    setDeleteStep(0);
  };

  const handleEmailChangeSuccess = (email: string) => {
    setPendingEmail(email);
    setShowEmailConfirmation(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-out;
        }
        .page-header,
        .page-subtitle,
        .settings-section {
          opacity: 0;
        }
      `}</style>

      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100">
        <div className="max-w-4xl mx-auto px-4 py-8" ref={containerRef}>
          <Toast
            message={toast.message}
            type={toast.type}
            show={toast.show}
            onClose={() => setToast({ ...toast, show: false })}
          />

          <div className="mb-6 sm:mb-8">
            <h1 className="page-header text-2xl sm:text-3xl font-bold text-slate-800">
              Paramètres
            </h1>
            <p className="page-subtitle text-slate-600 mt-1 text-sm sm:text-base">
              Gérez vos préférences et paramètres de compte
            </p>
          </div>

          {/* Notifications */}
          <div className="settings-section bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 flex items-center gap-2">
                <Bell className="w-5 h-5 text-teal-600" />
                Notifications
              </h2>
              {isSaving && (
                <div className="flex items-center gap-2 text-teal-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                  <span className="text-xs sm:text-sm">Sauvegarde...</span>
                </div>
              )}
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Mail className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-slate-700 text-sm sm:text-base">
                      Notifications par email
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Recevez des emails pour les nouvelles activités
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) =>
                      handleNotificationChange("email", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Bell className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-slate-700 text-sm sm:text-base">
                      Notifications push
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Notifications instantanées dans le navigateur
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) =>
                      handleNotificationChange("push", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Confidentialité */}
          <div className="settings-section bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Confidentialité et sécurité
            </h2>

            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="cursor-pointer w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Key className="w-5 h-5 text-slate-500 group-hover:text-teal-600 transition-colors flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-slate-700 group-hover:text-teal-700 transition-colors text-sm sm:text-base">
                      Changer le mot de passe
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Modifier votre mot de passe de connexion
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setIsEmailModalOpen(true)}
                className="cursor-pointer w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Mail className="w-5 h-5 text-slate-500 group-hover:text-teal-600 transition-colors flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-slate-700 group-hover:text-teal-700 transition-colors text-sm sm:text-base">
                      Modifier l'email
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Changer votre adresse email de connexion
                    </p>
                  </div>
                </div>
              </button>

              {profile?.user_type === "lawyer" && (
                <button className="cursor-pointer w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left group">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Eye className="w-5 h-5 text-slate-500 group-hover:text-teal-600 transition-colors flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-slate-700 group-hover:text-teal-700 transition-colors text-sm sm:text-base">
                        Visibilité du profil
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Gérer qui peut voir votre profil
                      </p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm text-slate-400 group-hover:text-teal-600 transition-colors sm:ml-3">
                    Publique
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Zone de danger */}
          <div className="settings-section bg-white rounded-lg shadow-sm border border-red-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-red-600 mb-4">
              Zone de danger
            </h2>

            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-medium text-red-800 mb-2 text-sm sm:text-base">
                  Déconnexion
                </h3>
                <p className="text-xs sm:text-sm text-red-600 mb-3">
                  Se déconnecter de votre compte sur cet appareil.
                </p>
                <button
                  onClick={handleSignOut}
                  className="cursor-pointer flex items-center justify-center gap-2 bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </div>

              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-medium text-red-800 mb-2 text-sm sm:text-base">
                  Supprimer le compte
                </h3>

                {deleteStep === 0 ? (
                  <>
                    <p className="text-xs sm:text-sm text-red-600 mb-3">
                      Supprimer définitivement votre compte. Cette action est
                      irréversible.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="cursor-pointer flex items-center justify-center gap-2 bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-800 transition-all duration-200 hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer le compte
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm text-red-700 font-medium">
                      ⚠️ Êtes-vous absolument sûr de vouloir supprimer votre
                      compte ?
                    </p>
                    <p className="text-xs sm:text-sm text-red-600">
                      Cette action supprimera définitivement toutes vos données
                      et ne peut pas être annulée.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button
                        onClick={confirmDelete}
                        disabled={isDeleting}
                        className="cursor-pointer bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base flex-1 sm:flex-none"
                      >
                        {isDeleting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Suppression...
                          </>
                        ) : (
                          "Oui, supprimer"
                        )}
                      </button>
                      <button
                        onClick={cancelDelete}
                        disabled={isDeleting}
                        className="cursor-pointer bg-slate-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 text-sm sm:text-base flex-1 sm:flex-none"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-slate-600 text-xs sm:text-sm px-4">
              Besoin d'aide avec vos paramètres ?{" "}
              <a
                href="mailto:support@mizan-dz.com"
                className="text-teal-600 hover:text-teal-700 hover:underline transition-colors"
              >
                Contactez-nous
              </a>
            </p>
          </div>
        </div>

        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          showToast={showToast}
        />

        <ChangeEmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          showToast={showToast}
          onSuccess={handleEmailChangeSuccess}
        />

        <EmailConfirmationModal
          isOpen={showEmailConfirmation}
          onClose={() => setShowEmailConfirmation(false)}
          email={pendingEmail}
        />
      </div>
    </>
  );
}
