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
  MessageCircle,
  Briefcase,
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
  const [selectedProfile, setSelectedProfile] = useState<
    "client" | "professional"
  >("client");
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

  useEffect(() => {
    if (isAuthenticated) {
      document.body.classList.add("has-bottom-tabs");
    } else {
      document.body.classList.remove("has-bottom-tabs");
    }
    return () => document.body.classList.remove("has-bottom-tabs");
  }, [isAuthenticated]);

  if (isHidden) return null;

  if (isAuthenticated) {
    const isLawyer = profile?.user_type === "lawyer";
    const sidebarItems = [
      ...(isLawyer
        ? [
            {
              href: "/lawyer/dashboard",
              label: t("nav.dashboard"),
              icon: LayoutDashboard,
            },
          ]
        : []),
      {
        href: isLawyer ? "/lawyer/consultations" : "/mes-consultations",
        label: isLawyer ? t("nav.consultations") : t("nav.myConsultations"),
        icon: MessageCircle,
        hasNotification: unreadCount > 0,
        notificationCount: unreadCount,
      },
      ...(isLawyer
        ? [
            {
              href: "/lawyer/abonnements",
              label: t("nav.mySubscription"),
              icon: CreditCard,
            },
          ]
        : []),
      { href: "/profile", label: t("nav.myProfile"), icon: User },
      { href: "/settings", label: t("nav.settings"), icon: Settings },
    ];

    return (
      <>
        {/* Sidebar desktop */}
        <aside className="hidden lg:flex fixed top-0 start-0 h-screen w-20 flex-col items-center py-6 z-[999] border-e border-slate-200 bg-white/80 backdrop-blur-xl">
          <Link
            href="/"
            className="w-11 h-11 rounded-xl bg-teal-600 flex items-center justify-center mb-8 flex-shrink-0 hover:rotate-6 transition-transform"
          >
            <Scale className="h-6 w-6 text-white" />
          </Link>

          <nav className="flex flex-col items-center gap-2 flex-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={cn(
                    "relative w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                    active
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-slate-500 hover:bg-teal-50 hover:text-teal-700"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.hasNotification && item.notificationCount ? (
                    <span className="absolute -top-1 -end-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {item.notificationCount > 9
                        ? "9+"
                        : item.notificationCount}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              title={t("nav.logout")}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </aside>

        {/* Langue flottante en haut à droite, hors sidebar */}
        <div className="hidden lg:block fixed top-4 end-4 z-[999]">
          <LanguageSwitcher />
        </div>

        {/* Mini barre mobile : logo + mode sombre */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-20 z-[999] flex items-center justify-between px-5 backdrop-blur-md">
          <Link
            href="/"
            className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center"
          >
            <Scale className="h-4 w-4 text-white" />
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              title={t("nav.logout")}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barre d'onglets mobile */}
        <nav className="lg:hidden fixed bottom-0 start-0 end-0 z-[999] border-t border-slate-200 bg-white/90 backdrop-blur-xl">
          <div className="flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            {sidebarItems
              .filter((i) => i.href !== "/settings")
              .map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative flex flex-col items-center gap-1 px-3 py-1"
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        active ? "text-teal-600" : "text-slate-400"
                      )}
                    />
                    <span
                      className={cn(
                        "text-[10px] font-medium",
                        active ? "text-teal-600" : "text-slate-400"
                      )}
                    >
                      {item.label}
                    </span>
                    {item.hasNotification && item.notificationCount ? (
                      <span className="absolute -top-0.5 end-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                        {item.notificationCount > 9
                          ? "9+"
                          : item.notificationCount}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
          </div>
        </nav>
      </>
    );
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[999] h-20 flex items-center backdrop-blur-md">
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center transition-transform group-hover:rotate-12">
                <Scale className="h-5 w-5 text-white" />
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {allNavLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative whitespace-nowrap text-sm font-medium transition-all px-4 py-2 rounded-full",
                      active
                        ? "bg-teal-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-teal-50 hover:text-teal-700"
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
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="group flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-all duration-200 hover:bg-teal-50 cursor-pointer">
                    <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {getUserInitial()}
                      </span>
                    </div>
                    <div className="text-start">
                      <div className="text-sm font-medium text-slate-700">
                        {getUserDisplayName()}
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
                    <button className="group flex items-center gap-1.5 px-3 py-2 rounded-full transition-all text-slate-700 hover:bg-teal-50 cursor-pointer text-sm font-medium">
                      {t("nav.client")}{" "}
                      <ChevronDown className="w-4 h-4 transition-transform duration-200 group-aria-expanded:rotate-180" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-44">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/auth/client/login"
                        className="w-full hover:bg-teal-50 text-sm py-2"
                      >
                        {t("nav.loginTab")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/auth/client/register"
                        className="w-full hover:bg-teal-50 text-sm py-2"
                      >
                        {t("nav.signupTab")}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="group rounded-full py-2 flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 cursor-pointer shadow-sm text-sm font-semibold transition-colors">
                      {t("nav.professional")}{" "}
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
                        href="/auth/lawyer/login"
                        className="w-full hover:bg-teal-50 text-sm py-2"
                      >
                        {t("nav.loginTab")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/auth/lawyer/register"
                        className="w-full hover:bg-teal-50 text-sm py-2"
                      >
                        {t("nav.signupTab")}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            <div className="flex items-center gap-2 rounded-full border border-slate-200 px-2.5 py-1.5">
              <LanguageSwitcher />
              <span className="w-px h-3.5 bg-slate-200" />
              <ThemeToggle />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              className="cursor-pointer p-2 text-slate-700"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[9998] bg-slate-900/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={cn(
          "lg:hidden fixed top-0 right-0 h-screen w-[82%] max-w-sm z-[9999] bg-gradient-to-br from-teal-100 via-white to-teal-100 shadow-2xl transition-transform duration-300 ease-out overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        )}
      >
        <div className="flex items-center justify-end p-4">
          <button
            className="cursor-pointer p-2 text-slate-700"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-2 space-y-4 pb-8">
          {allNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-colors relative",
                pathname === link.href
                  ? "text-teal-600 bg-teal-50"
                  : "text-slate-600 hover:bg-slate-50"
              )}
              onClick={() => setIsOpen(false)}
            >
              <span className="relative inline-flex items-center">
                {link.label}
                {link.hasNotification && link.notificationCount ? (
                  <span className="ms-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {link.notificationCount > 9 ? "9+" : link.notificationCount}
                  </span>
                ) : null}
              </span>
            </Link>
          ))}

          <div className="px-4 space-y-4 border-t border-slate-200/70 pt-4">
            <div className="m-4">
              <p className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-2">
                {t("nav.youAre")}
              </p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => setSelectedProfile("client")}
                  className={cn(
                    "flex flex-col items-center gap-1.5 py-3 rounded-none border transition-all cursor-pointer",
                    selectedProfile === "client"
                      ? "border-teal-700 bg-teal-50"
                      : "border-slate-200 bg-white"
                  )}
                >
                  <User
                    className={cn(
                      "w-5 h-5",
                      selectedProfile === "client"
                        ? "text-teal-600"
                        : "text-slate-400"
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium",
                      selectedProfile === "client"
                        ? "text-teal-700"
                        : "text-slate-600"
                    )}
                  >
                    {t("nav.client")}
                  </span>
                </button>
                <button
                  onClick={() => setSelectedProfile("professional")}
                  className={cn(
                    "flex flex-col items-center gap-1.5 py-3 rounded-none border transition-all cursor-pointer",
                    selectedProfile === "professional"
                      ? "border-teal-500 bg-teal-50"
                      : "border-slate-200 bg-white"
                  )}
                >
                  <Briefcase
                    className={cn(
                      "w-5 h-5",
                      selectedProfile === "professional"
                        ? "text-teal-600"
                        : "text-slate-400"
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium",
                      selectedProfile === "professional"
                        ? "text-teal-700"
                        : "text-slate-600"
                    )}
                  >
                    {t("nav.professional")}
                  </span>
                </button>
              </div>

              <div className="flex gap-2">
                <Link
                  href={
                    selectedProfile === "client"
                      ? "/auth/client/login"
                      : "/auth/lawyer/login"
                  }
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-all"
                >
                  {t("nav.loginTab")}
                </Link>
                <Link
                  href={
                    selectedProfile === "client"
                      ? "/auth/client/register"
                      : "/auth/lawyer/register"
                  }
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-lg border border-slate-200 bg-white hover:border-teal-500 hover:bg-teal-50/30 text-slate-700 text-sm font-semibold transition-all"
                >
                  {t("nav.signupTab")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
