"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, Home } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { localizedDigits } from "@/lib/arabicNumerals";

export default function LawyerOnboardingPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const t = useTranslations("onboardingPage");
  const locale = useLocale();
  const ld = (s: string) => localizedDigits(s, locale);
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

        const { data: profile } = await supabase
          .from("users")
          .select("user_type, first_name, last_name")
          .eq("id", user.id)
          .single();

        if (!profile) {
          setLoading(false);
          return;
        }
        const firstName = profile.first_name || "";
        const lastName = profile.last_name || "";
        const titlePrefix = t("titlePrefix");

        let fullName = "";
        if (firstName && lastName) {
          fullName = `${titlePrefix} ${firstName} ${lastName}`;
        } else if (firstName) {
          fullName = `${titlePrefix} ${firstName}`;
        } else if (lastName) {
          fullName = `${titlePrefix} ${lastName}`;
        } else {
          fullName = titlePrefix;
        }

        setLawyerName(fullName);

        const { data: lawyerData } = await supabase
          .from("lawyers")
          .select("is_verified")
          .eq("id", user.id)
          .single();

        if (profile.user_type === "lawyer" && lawyerData?.is_verified) {
          router.push("/lawyer/dashboard");
          return;
        }

        if (profile.user_type === "lawyer" && !lawyerData?.is_verified) {
          await supabase.auth.signOut();
          await new Promise((resolve) => setTimeout(resolve, 500));
          setLoading(false);
          return;
        }

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
      <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 dark:text-[#6fcf9f] animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-[#E8E8E6]">
            {t("checkingProfile")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-xl dark:shadow-none p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 dark:from-[#0F6E56] dark:to-[#085041] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg dark:shadow-none">
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

          <h1 className="text-3xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-3">
            {t("welcome", { name: lawyerName })}
          </h1>

          <p className="text-slate-600 dark:text-[#E8E8E6] text-lg">
            {t("registered")}
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-[#3D2E1F] border-l-4 border-amber-400 dark:border-[#E0B568] p-6 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-amber-600 dark:text-[#E0B568] flex-shrink-0 mt-0.5"
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
              <h3 className="font-semibold text-amber-900 dark:text-[#E0B568] mb-2">
                {t("validationTitle")}
              </h3>
              <p className="text-amber-800 dark:text-[#E0B568]/90 text-sm leading-relaxed">
                {t("validationDesc")}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#141415] rounded-lg">
            <div className="w-8 h-8 bg-teal-100 dark:bg-[#6fcf9f]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-teal-600 dark:text-[#6fcf9f] font-bold text-sm">
                {ld("1")}
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-[#E8E8E6]">
              {t("step1")}
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#141415] rounded-lg">
            <div className="w-8 h-8 bg-teal-100 dark:bg-[#6fcf9f]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-teal-600 dark:text-[#6fcf9f] font-bold text-sm">
                {ld("2")}
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-[#E8E8E6]">
              {t("step2")}
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#141415] rounded-lg">
            <div className="w-8 h-8 bg-teal-100 dark:bg-[#6fcf9f]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-teal-600 dark:text-[#6fcf9f] font-bold text-sm">
                {ld("3")}
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-[#E8E8E6]">
              {t("step3")}
            </p>
          </div>
        </div>

        <div className="text-center pt-6 border-t border-slate-200 dark:border-[#1c2220]">
          <button
            onClick={handleReturnHome}
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 dark:bg-[#0F6E56] text-white rounded-lg font-medium hover:bg-teal-700 dark:hover:bg-[#085041] transition-colors shadow-md dark:shadow-none hover:shadow-lg dark:hover:shadow-none cursor-pointer mb-4"
          >
            <Home className="w-4 h-4" />
            {t("backHome")}
          </button>

          <p className="text-sm text-slate-500 dark:text-[#A8A8A6]">
            {t("questions")}{" "}
            <a
              href="mailto:support@mizan-dz.com"
              className="text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#6fcf9f] font-medium"
            >
              support@mizan-dz.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
