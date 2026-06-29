"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Shield,
  Trash2,
  LogOut,
  Check,
  AlertTriangle,
  Mail,
  Key,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
      const t = setTimeout(onClose, 3000);
      return () => clearTimeout(t);
    }
  }, [show, onClose]);
  if (!show) return null;
  const bg = {
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
      className={`fixed top-20 end-4 ${bg} text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-lg dark:shadow-none flex items-center gap-2 z-50 text-sm sm:text-base max-w-[90vw] sm:max-w-md`}
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
  const t = useTranslations("settingsPage");
  const containerRef = useRef<HTMLDivElement>(null);

  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStep, setDeleteStep] = useState(0);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  useEffect(() => {
    if (!containerRef.current) return;
    gsap
      .timeline()
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
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
        "-=0.3"
      );
  }, []);

  const showToast = (message: string, type: "success" | "error" | "warning") =>
    setToast({ show: true, message, type });

  const handleSignOut = async () => {
    try {
      await signOut();
      showToast(t("toasts.logoutSuccess"), "success");
      setTimeout(() => router.push("/"), 1000);
    } catch {
      showToast(t("toasts.logoutError"), "error");
    }
  };

  const confirmDelete = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      showToast(t("toasts.deleting"), "warning");
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) throw new Error("Session invalide");
      const userId = user.id,
        userEmail = user.email;
      try {
        await supabase.from("user_preferences").delete().eq("user_id", userId);
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("user_id", userId);
        await supabase.from("notifications").delete().eq("user_id", userId);
        await supabase.from("profile_views").delete().eq("viewer_id", userId);
        await supabase.from("profile_views").delete().eq("lawyer_id", userId);
        await supabase.from("consultations").delete().eq("client_id", userId);
        await supabase.from("consultations").delete().eq("lawyer_id", userId);
        await supabase.from("reviews").delete().eq("client_id", userId);
        await supabase
          .from("consultation_messages")
          .delete()
          .eq("sender_id", userId);
      } catch {}
      if (profile?.user_type === "lawyer")
        await supabase.from("lawyers").delete().eq("id", userId);
      const { error: userError } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);
      if (userError) throw userError;
      try {
        await fetch("/api/delete-auth-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.session.access_token}`,
          },
          body: JSON.stringify({ userId }),
        });
      } catch {}
      await signOut();
      showToast(t("toasts.deleteSuccess"), "success");
      try {
        await fetch("/api/admin/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: "Compte supprimé",
            title: "Suppression",
            message: `<p>Email: ${userEmail}</p><p>Type: ${profile?.user_type}</p><p>ID: ${userId}</p>`,
            priority: "normal",
          }),
        });
      } catch {}
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "?";
      showToast(t("toasts.deleteError", { msg }), "error");
      setIsDeleting(false);
      setDeleteStep(0);
    }
  };

  const Toggle = ({
    label,
    description,
  }: {
    label: string;
    description: string;
  }) => (
    <div className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-slate-50 rounded-lg">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <Bell className="w-5 h-5 text-teal-600 dark:text-[#6fcf9f] flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-slate-700 dark:text-[#E8E8E6] text-sm sm:text-base truncate">
            {label}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8A8A6] truncate">
            {description}
          </p>
        </div>
      </div>
      <div
        className="relative inline-flex items-center opacity-60 cursor-not-allowed flex-shrink-0"
        title={t("notifLockedNote")}
      >
        <div className="w-11 h-6 bg-teal-600 dark:bg-[#0F6E56] rounded-full relative">
          <div className="absolute top-[2px] end-[2px] bg-white dark:bg-[#0b1210] rounded-full h-5 w-5" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style jsx global>{`
        .page-header,
        .page-subtitle,
        .settings-section {
          opacity: 0;
        }
      `}</style>
      <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none">
        <div className="max-w-4xl mx-auto px-4 py-8" ref={containerRef}>
          <Toast
            message={toast.message}
            type={toast.type}
            show={toast.show}
            onClose={() => setToast({ ...toast, show: false })}
          />

          <div className="mb-6 sm:mb-8">
            <h1 className="page-header text-2xl sm:text-3xl font-bold text-slate-800 dark:text-[#F5F5F4]">
              {t("title")}
            </h1>
            <p className="page-subtitle text-slate-600 dark:text-[#E8E8E6] mt-1 text-sm sm:text-base">
              {t("subtitle")}
            </p>
          </div>

          <div className="settings-section bg-white dark:bg-[#0b1210] rounded-lg shadow-sm dark:shadow-none border p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-[#F5F5F4] flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-teal-600 dark:text-[#6fcf9f]" />{" "}
              {t("notificationsTitle")}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <Toggle
                label={t("emailNotifTitle")}
                description={t("emailNotifDesc")}
              />
              <Toggle
                label={t("pushNotifTitle")}
                description={t("pushNotifDesc")}
              />
            </div>
            <p className="text-xs text-slate-400 dark:text-[#7A7A78] mt-3">
              {t("notifEssentialNote")}
            </p>
          </div>

          <div className="settings-section bg-white dark:bg-[#0b1210] rounded-lg shadow-sm dark:shadow-none border p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-[#F5F5F4] mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" /> {t("privacyTitle")}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="cursor-pointer w-full flex flex-col sm:flex-row sm:items-center gap-2 p-3 sm:p-4 border border-slate-200 dark:border-[#1c2220] rounded-lg hover:bg-slate-50 text-start group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Key className="w-5 h-5 text-slate-500 dark:text-[#A8A8A6] group-hover:text-teal-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-slate-700 dark:text-[#E8E8E6] group-hover:text-teal-700 dark:group-hover:text-[#6fcf9f] dark:hover:text-[#6fcf9f] text-sm sm:text-base">
                      {t("changePasswordTitle")}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8A8A6]">
                      {t("changePasswordDesc")}
                    </p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setIsEmailModalOpen(true)}
                className="cursor-pointer w-full flex flex-col sm:flex-row sm:items-center gap-2 p-3 sm:p-4 border border-slate-200 dark:border-[#1c2220] rounded-lg hover:bg-slate-50 text-start group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Mail className="w-5 h-5 text-slate-500 dark:text-[#A8A8A6] group-hover:text-teal-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-slate-700 dark:text-[#E8E8E6] group-hover:text-teal-700 dark:group-hover:text-[#6fcf9f] dark:hover:text-[#6fcf9f] text-sm sm:text-base">
                      {t("changeEmailTitle")}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8A8A6]">
                      {t("changeEmailDesc")}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="settings-section bg-white dark:bg-[#0b1210] rounded-lg shadow-sm dark:shadow-none border border-red-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-red-600 mb-4">
              {t("dangerZoneTitle")}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-medium text-red-800 mb-2 text-sm sm:text-base">
                  {t("logoutTitle")}
                </h3>
                <p className="text-xs sm:text-sm text-red-600 mb-3">
                  {t("logoutDesc")}
                </p>
                <button
                  onClick={handleSignOut}
                  className="cursor-pointer flex items-center justify-center gap-2 bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 text-sm sm:text-base w-full sm:w-auto"
                >
                  <LogOut className="w-4 h-4" /> {t("logoutAction")}
                </button>
              </div>
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-medium text-red-800 mb-2 text-sm sm:text-base">
                  {t("deleteAccountTitle")}
                </h3>
                {deleteStep === 0 ? (
                  <>
                    <p className="text-xs sm:text-sm text-red-600 mb-3">
                      {t("deleteAccountDesc")}
                    </p>
                    <button
                      onClick={() => setDeleteStep(1)}
                      className="cursor-pointer flex items-center justify-center gap-2 bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-800 text-sm sm:text-base w-full sm:w-auto"
                    >
                      <Trash2 className="w-4 h-4" /> {t("deleteAccountAction")}
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm text-red-700 font-medium">
                      {t("confirmTitle")}
                    </p>
                    <p className="text-xs sm:text-sm text-red-600">
                      {t("confirmDesc")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button
                        onClick={confirmDelete}
                        disabled={isDeleting}
                        className="cursor-pointer bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-800 disabled:opacity-50 flex items-center justify-center gap-2 text-sm flex-1 sm:flex-none"
                      >
                        {isDeleting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            {t("deleting")}
                          </>
                        ) : (
                          t("confirmYes")
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsDeleting(false);
                          setDeleteStep(0);
                        }}
                        disabled={isDeleting}
                        className="cursor-pointer bg-slate-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-slate-600 text-sm flex-1 sm:flex-none"
                      >
                        {t("confirmCancel")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-[#E8E8E6] text-xs sm:text-sm">
              {t("helpText")}{" "}
              <a
                href="mailto:support@mizan-dz.com"
                className="text-teal-600 dark:text-[#6fcf9f] hover:underline"
              >
                support@mizan-dz.com
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
          onSuccess={(e) => {
            setPendingEmail(e);
            setShowEmailConfirmation(true);
          }}
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
