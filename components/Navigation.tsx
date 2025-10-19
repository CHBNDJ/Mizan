"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Scale,
  Menu,
  X,
  ChevronDown,
  User,
  UserPlus,
  LogOut,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const { user, profile, signOut, isAuthenticated } = useAuth();

  const capitalize = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getUserInitial = () => {
    if (profile?.first_name) {
      return capitalize(profile.first_name)[0];
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  const navLinks = [{ href: "/", label: "Accueil" }];

  const switchTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleSignOut = async () => {
    try {
      setIsOpen(false);
      await signOut();
      router.push("/");
    } catch (error) {
      router.push("/");
    }
  };

  const getUserDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      const firstName = capitalize(profile.first_name);
      const lastName = capitalize(profile.last_name);
      return `${firstName} ${lastName}`;
    }
    return user?.email || "Utilisateur";
  };

  const handleProfileClick = () => {
    router.push("/profile");
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    router.push("/settings");
    setIsOpen(false);
  };

  const allNavLinks = [
    ...navLinks,
    ...(isAuthenticated && profile?.user_type === "client"
      ? [
          {
            href: "/mes-consultations",
            label: "Mes consultations",
          },
        ]
      : []),
    ...(isAuthenticated && profile?.user_type === "lawyer"
      ? [
          {
            href: "/lawyer/consultations",
            label: "Consultations",
          },
        ]
      : []),
    { href: "/consultation", label: "Comment ça marche" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex md:grid md:grid-cols-[auto_1fr_auto] items-center justify-between md:justify-normal h-16 w-full">
            {/* Logo - Colonne gauche */}
            <Link href="/" className="flex items-center gap-3 group">
              <Scale className="h-8 w-8 text-teal-600 transition-transform group-hover:rotate-12" />
              <span className="text-xl font-bold text-slate-800">MIZAN</span>
            </Link>

            {/* Navigation desktop - Colonne centre */}
            <div className="hidden md:flex items-center justify-center space-x-8">
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
                  </span>
                  {pathname === link.href && (
                    <div className="whitespace-nowrap absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Boutons auth - Desktop uniquement - Colonne droite */}
            <div className="hidden md:flex items-center justify-end gap-3">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-slate-100 cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {getUserInitial()}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-slate-700">
                          {getUserDisplayName()}
                        </div>
                        <div className="text-xs text-slate-500 capitalize">
                          {profile?.user_type === "lawyer"
                            ? "Avocat"
                            : "Client"}
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200 group-aria-expanded:rotate-180" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {profile?.user_type === "lawyer" && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/lawyer/dashboard"
                          className="w-full hover:bg-teal-50"
                        >
                          <Scale className="w-4 h-4 mr-2" />
                          Tableau de bord
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={handleProfileClick}
                      className="w-full hover:bg-teal-50 cursor-pointer"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Mon profil
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleSettingsClick}
                      className="w-full hover:bg-teal-50 cursor-pointer"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Paramètres
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="w-full hover:bg-red-100 text-red-600 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Se déconnecter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 aria-expanded:border aria-expanded:border-teal-500 text-teal-600 cursor-pointer">
                        <User className="w-4 h-4" />
                        Connexion
                        <ChevronDown className="w-4 h-4 transition-transform duration-200 group-aria-expanded:rotate-180" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      sameWidth={true}
                      className="w-36"
                    >
                      <DropdownMenuItem asChild>
                        <Link
                          href="/auth/client/login"
                          className="w-full hover:bg-teal-50"
                        >
                          Je suis un client
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/auth/lawyer/login"
                          className="w-full hover:bg-teal-50"
                        >
                          Je suis un avocat
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="group rounded-lg py-2 flex items-center gap-2 bg-teal-600 text-white transition-all duration-200 shadow-sm focus:outline-none focus:ring-0 active:outline-none active:ring-0 px-8 cursor-pointer">
                        <UserPlus className="w-4 h-4" />
                        S'inscrire
                        <ChevronDown className="w-4 h-4 transition-transform duration-200 group-aria-expanded:rotate-180" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      sameWidth={true}
                      className="w-36"
                    >
                      <DropdownMenuItem asChild>
                        <Link
                          href="/auth/client/register"
                          className="w-full hover:bg-teal-50"
                        >
                          Je suis un client
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/auth/lawyer/register"
                          className="w-full hover:bg-teal-50"
                        >
                          Je suis un avocat
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>

            {/* Menu hamburger - Mobile uniquement */}
            <button
              className="cursor-pointer md:hidden p-2 text-slate-700 rounded-lg transition-colors"
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
      </nav>

      {/* Menu mobile dropdown */}
      {isOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 md:hidden border-t border-slate-200 bg-gradient-to-br from-teal-100 via-white to-teal-100 shadow-2xl backdrop-blur-lg">
          <div className="py-4 space-y-4">
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
                      <div className="text-xs text-slate-500 capitalize">
                        {profile?.user_type === "lawyer" ? "Avocat" : "Client"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {profile?.user_type === "lawyer" && (
                      <button
                        onClick={() => {
                          router.push("/lawyer/dashboard");
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/60 rounded-lg transition-colors"
                      >
                        <Scale className="w-4 h-4 text-slate-600" />
                        <span className="cursor-pointer text-sm font-medium text-slate-900">
                          Tableau de bord
                        </span>
                      </button>
                    )}

                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/60 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-600" />
                      <span className="cursor-pointer text-sm font-medium text-slate-900">
                        Mon profil
                      </span>
                    </button>

                    <button
                      onClick={handleSettingsClick}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/60 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-600" />
                      <span className="cursor-pointer text-sm font-medium text-slate-900">
                        Paramètres
                      </span>
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-red-50/80 text-red-600 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="cursor-pointer text-sm font-medium">
                        Se déconnecter
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="m-4">
                  <div className="flex bg-teal-50 rounded-lg p-1">
                    <button
                      className={cn(
                        "cursor-pointer flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200",
                        activeTab === "login"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-700"
                      )}
                      onClick={() => switchTab("login")}
                    >
                      Connexion
                    </button>
                    <button
                      className={cn(
                        "cursor-pointer flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200",
                        activeTab === "signup"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      )}
                      onClick={() => switchTab("signup")}
                    >
                      Inscription
                    </button>
                  </div>

                  <div className="mt-4">
                    {activeTab === "login" && (
                      <div className="space-y-2">
                        <Link
                          href="/auth/client/login"
                          onClick={() => setIsOpen(false)}
                          className="block w-full p-3 border border-slate-200 bg-white/90 rounded-lg hover:border-teal-500 hover:bg-white shadow-sm transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                Je suis un client
                              </div>
                              <div className="text-xs text-slate-500">
                                Accéder à mon compte
                              </div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          href="/auth/lawyer/login"
                          onClick={() => setIsOpen(false)}
                          className="block w-full p-3 border border-slate-200 bg-white/90 rounded-lg hover:border-teal-500 hover:bg-white shadow-sm transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                              <Scale className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                Je suis un avocat
                              </div>
                              <div className="text-xs text-slate-500">
                                Espace professionnel
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )}

                    {activeTab === "signup" && (
                      <div className="space-y-2">
                        <Link
                          href="/auth/client/register"
                          onClick={() => setIsOpen(false)}
                          className="block w-full p-3 border border-slate-200 bg-white/90 rounded-lg hover:border-teal-500 hover:bg-white shadow-sm transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                Je suis un client
                              </div>
                              <div className="text-xs text-slate-500">
                                Créer mon compte
                              </div>
                            </div>
                          </div>
                        </Link>

                        <Link
                          href="/auth/lawyer/register"
                          onClick={() => setIsOpen(false)}
                          className="block w-full p-3 border border-slate-200 bg-white/90 rounded-lg hover:border-teal-500 hover:bg-white shadow-sm transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                              <Scale className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">
                                Je suis un avocat
                              </div>
                              <div className="text-xs text-slate-500">
                                Rejoindre la plateforme
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )}
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
