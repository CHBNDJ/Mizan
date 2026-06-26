"use client";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Scale,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  CreditCard,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";

type NavLink = {
  href: string;
  label: string;
  hasNotification?: boolean;
  notificationCount?: number;
};

const PROF_KEY: Record<string, string> = {
  avocat: "avocat",
  notaire: "notaire",
  huissier: "huissier",
  comptable: "comptable",
};

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const { user, profile, signOut, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const hiddenPaths = ["/auth/verify-email", "/lawyer/onboarding"];
  const isHidden = hiddenPaths.some((p) => pathname.startsWith(p));

  const loadUnreadCount = async () => {
    if (!user || !profile) return;
    try {
      if (profile.user_type === "lawyer") {
        const { count } = await supabase
          .from("consultation_messages")
          .select("*", { count: "exact", head: true })
          .eq("is_read", false)
          .eq("sender_type", "client")
          .neq("sender_id", user.id);
        setUnreadCount(count || 0);
      } else if (profile.user_type === "client") {
        const { count } = await supabase
          .from("consultation_messages")
          .select("*", { count: "exact", head: true })
          .eq("is_read", false)
          .eq("sender_type", "lawyer")
          .neq("sender_id", user.id);
        setUnreadCount(count || 0);
      }
    } catch {}
  };

  useEffect(() => {
    loadUnreadCount();
  }, [user, profile]);

  useEffect(() => {
    if (!user || !profile) return;
    const channel = supabase
      .channel(`navbar-unread-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "consultation_messages" },
        (payload) => {
          const msg = payload.new as any;
          if (msg.sender_id !== user.id && !msg.is_read) {
            const ok =
              (profile.user_type === "lawyer" &&
                msg.sender_type === "client") ||
              (profile.user_type === "client" && msg.sender_type === "lawyer");
            if (ok) {
              setUnreadCount((p) => p + 1);
              if (
                "Notification" in window &&
                Notification.permission === "granted"
              ) {
                new Notification("Nouveau message - Mizan", {
                  body: "Vous avez reçu un nouveau message",
                  icon: "/logo.png",
                  tag: "mizan-message",
                });
              }
              const audio = new Audio("/notification.mp3");
              audio.volume = 0.3;
              audio.play().catch(() => {});
            }
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "consultation_messages" },
        (payload) => {
          const msg = payload.new as any;
          if (msg.is_read && msg.sender_id !== user.id) {
            const wasForMe =
              (profile.user_type === "lawyer" &&
                msg.sender_type === "client") ||
              (profile.user_type === "client" && msg.sender_type === "lawyer");
            if (wasForMe) setUnreadCount((p) => Math.max(0, p - 1));
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default")
      Notification.requestPermission();
  }, []);

  const cap = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;
  const getUserInitial = () =>
    profile?.first_name
      ? cap(profile.first_name)[0]
      : user?.email?.[0]?.toUpperCase() || "U";
  const getUserDisplayName = () =>
    profile?.first_name && profile?.last_name
      ? `${cap(profile.first_name)} ${cap(profile.last_name)}`
      : user?.email || t("nav.defaultUser");

  const getProfessionLabel = () => {
    if (profile?.user_type === "client") return t("nav.client");
    const prof = (profile as any)?.profession;
    const key = PROF_KEY[prof];
    return key ? t(`professions.${key}.label`) : t("nav.professional");
  };

  const allNavLinks: NavLink[] = [
    { href: "/", label: t("nav.home") },
    ...(isAuthenticated && profile?.user_type === "client"
      ? [
          {
            href: "/mes-consultations",
            label: t("nav.myConsultations"),
            hasNotification:
              unreadCount > 0 && pathname !== "/mes-consultations",
            notificationCount: unreadCount,
          },
        ]
      : []),
    ...(isAuthenticated && profile?.user_type === "lawyer"
      ? [
          {
            href: "/lawyer/consultations",
            label: t("nav.consultations"),
            hasNotification:
              unreadCount > 0 && pathname !== "/lawyer/consultations",
            notificationCount: unreadCount,
          },
        ]
      : []),
    { href: "/howitworks", label: t("nav.howItWorks") },
  ];

  const handleSignOut = async () => {
    try {
      setIsOpen(false);
      await signOut();
      router.push("/");
    } catch {
      router.push("/");
    }
  };

  if (isHidden) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[999] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex lg:grid lg:grid-cols-[1fr_auto_1fr] items-center justify-between lg:justify-normal h-16 w-full">
            <Link
              href="/"
              className="flex items-center gap-3 group flex-shrink-0"
            >
              <Scale className="h-8 w-8 text-teal-600 transition-transform group-hover:rotate-12" />
              <span className="text-xl font-bold text-slate-800">MIZAN</span>
            </Link>

            <div className="hidden lg:flex items-center justify-center gap-8">
              {allNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "whitespace-nowrap text-sm font-medium transition-colors hover:text-teal-600 relative py-2",
                    pathname === link.href ? "text-teal-600" : "text-slate-600"
                  )}
                >
                  <span className="relative inline-flex items-center">
                    {link.label}
                    {link.hasNotification && link.notificationCount ? (
                      <span className="absolute -top-2 -end-4 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                        {link.notificationCount > 9
                          ? "9+"
                          : link.notificationCount}
                      </span>
                    ) : null}
                  </span>
                  {pathname === link.href && (
                    <div className="absolute bottom-0 start-0 end-0 h-0.5 bg-teal-600 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center justify-end gap-2 flex-shrink-0">
              <ThemeToggle />
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-slate-100 cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {getUserInitial()}
                        </span>
                      </div>
                      <div className="text-start">
                        <div className="text-sm font-medium text-slate-700">
                          {getUserDisplayName()}
                        </div>
                        <div className="text-xs text-slate-500">
                          {getProfessionLabel()}
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200 group-aria-expanded:rotate-180" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {profile?.user_type === "lawyer" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/lawyer/dashboard"
                            className="w-full hover:bg-teal-50"
                          >
                            <LayoutDashboard className="w-4 h-4 me-2" />
                            {t("nav.dashboard")}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/lawyer/abonnements"
                            className="w-full hover:bg-teal-50"
                          >
                            <CreditCard className="w-4 h-4 me-2" />
                            {t("nav.mySubscription")}
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/profile");
                        setIsOpen(false);
                      }}
                      className="w-full hover:bg-teal-50 cursor-pointer"
                    >
                      <User className="w-4 h-4 me-2" />
                      {t("nav.myProfile")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push("/settings");
                        setIsOpen(false);
                      }}
                      className="w-full hover:bg-teal-50 cursor-pointer"
                    >
                      <Settings className="w-4 h-4 me-2" />
                      {t("nav.settings")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="w-full hover:bg-red-100 text-red-600 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 me-2" />
                      {t("nav.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="group rounded-lg py-2 flex items-center gap-2 bg-teal-600 text-white px-8 cursor-pointer shadow-sm">
                        {t("nav.signup")}{" "}
                        <ChevronDown className="w-4 h-4 transition-transform duration-200 group-aria-expanded:rotate-180" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      sameWidth={false}
                      className="w-44"
                    >
                      <DropdownMenuItem asChild>
                        <Link
                          href="/auth/client/register"
                          className="w-full hover:bg-teal-50 text-sm py-2"
                        >
                          {t("nav.client")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/auth/lawyer/register"
                          className="w-full hover:bg-teal-50 text-sm py-2"
                        >
                          {t("nav.professional")}
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="group flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-teal-600 cursor-pointer">
                        {t("nav.login")}{" "}
                        <ChevronDown className="w-4 h-4 transition-transform duration-200 group-aria-expanded:rotate-180" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-44">
                      <DropdownMenuItem asChild>
                        <Link
                          href="/auth/client/login"
                          className="w-full hover:bg-teal-50 text-sm py-2"
                        >
                          {t("nav.client")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/auth/lawyer/login"
                          className="w-full hover:bg-teal-50 text-sm py-2"
                        >
                          {t("nav.professional")}
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              <LanguageSwitcher />
            </div>

            <div className="flex items-center gap-1 lg:hidden">
              <ThemeToggle />
              <button
                className="cursor-pointer p-2 text-slate-700 rounded-lg"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed top-16 start-0 end-0 z-[9999] lg:hidden border-t border-slate-200 bg-gradient-to-br from-teal-100 via-white to-teal-100 shadow-2xl backdrop-blur-lg">
          <div className="py-4 space-y-4">
            <div className="px-4 flex justify-center">
              <LanguageSwitcher />
            </div>

            {allNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-colors relative",
                  pathname === link.href
                    ? "text-teal-600 bg-white/60"
                    : "text-slate-600 hover:bg-white/40"
                )}
                onClick={() => setIsOpen(false)}
              >
                <span className="relative inline-flex items-center">
                  {link.label}
                  {link.hasNotification && link.notificationCount ? (
                    <span className="ms-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {link.notificationCount > 9
                        ? "9+"
                        : link.notificationCount}
                    </span>
                  ) : null}
                </span>
              </Link>
            ))}

            <div className="px-4 space-y-4 border-t border-slate-200/50 pt-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-white/70 rounded-lg shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {getUserInitial()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-900">
                        {getUserDisplayName()}
                      </div>
                      <div className="text-xs text-slate-500">
                        {getProfessionLabel()}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {profile?.user_type === "lawyer" && (
                      <>
                        <button
                          onClick={() => {
                            router.push("/lawyer/dashboard");
                            setIsOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-start hover:bg-white/60 rounded-lg"
                        >
                          <Scale className="w-4 h-4 text-slate-600" />
                          <span className="text-sm font-medium text-slate-900">
                            {t("nav.dashboard")}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            router.push("/lawyer/abonnements");
                            setIsOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-start hover:bg-white/60 rounded-lg"
                        >
                          <CreditCard className="w-4 h-4 text-slate-600" />
                          <span className="text-sm font-medium text-slate-900">
                            {t("nav.mySubscription")}
                          </span>
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        router.push("/profile");
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-start hover:bg-white/60 rounded-lg"
                    >
                      <User className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-900">
                        {t("nav.myProfile")}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        router.push("/settings");
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-start hover:bg-white/60 rounded-lg"
                    >
                      <Settings className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-900">
                        {t("nav.settings")}
                      </span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2 text-start hover:bg-red-50/80 text-red-600 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {t("nav.logout")}
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="m-4">
                  <div className="flex bg-teal-50 rounded-lg p-1">
                    {(["login", "signup"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          "cursor-pointer flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                          activeTab === tab
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-600 hover:text-slate-700"
                        )}
                      >
                        {tab === "login"
                          ? t("nav.loginTab")
                          : t("nav.signupTab")}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    {[
                      {
                        href:
                          activeTab === "login"
                            ? "/auth/client/login"
                            : "/auth/client/register",
                        label: t("nav.client"),
                        sub:
                          activeTab === "login"
                            ? t("nav.accessAccount")
                            : t("nav.createAccount"),
                        icon: User,
                      },
                      {
                        href:
                          activeTab === "login"
                            ? "/auth/lawyer/login"
                            : "/auth/lawyer/register",
                        label: t("nav.professional"),
                        sub:
                          activeTab === "login"
                            ? t("nav.professionalSpace")
                            : t("nav.joinPlatform"),
                        icon: Scale,
                      },
                    ].map(({ href, label, sub, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className="block w-full p-3 border border-slate-200 bg-white/90 rounded-lg hover:border-teal-500 hover:bg-white shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {label}
                            </div>
                            <div className="text-xs text-slate-500">{sub}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
