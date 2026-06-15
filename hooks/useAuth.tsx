"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Profile, LawyerProfile } from "@/types";
import { LOCATION } from "@/utils/constants";

const supabase = createClient();

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  lawyerProfile: LawyerProfile | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (
    email: string,
    password: string,
    expectedUserType?: "client" | "lawyer"
  ) => Promise<any>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  getRedirectPath: (
    userType: string,
    action: "login" | "register",
    lawyerProf?: any
  ) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    lawyerProfile: null,
    loading: true,
  });

  const verifyUserIntegrity = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();
      if (error) return null;
      if (!profile) {
        await supabase.auth.signOut();
        setState({
          user: null,
          session: null,
          profile: null,
          lawyerProfile: null,
          loading: false,
        });
        localStorage.clear();
        sessionStorage.clear();
        return null;
      }
      return profile;
    } catch {
      return null;
    }
  };

  const getRedirectPath = (
    userType: string,
    action: "login" | "register",
    lawyerProf?: any
  ) => {
    if (userType === "lawyer") {
      if (lawyerProf?.profession && typeof window !== "undefined") {
        localStorage.setItem("activeProfession", lawyerProf.profession);
      }
      return "/lawyer/dashboard";
    }
    return "/";
  };

  const refreshProfile = async () => {
    if (!state.user?.id) return;
    try {
      const profile = await verifyUserIntegrity(state.user);
      if (!profile) return;
      let lawyerProfile = null;
      if (profile?.user_type === "lawyer") {
        const { data } = await supabase
          .from("lawyers")
          .select("*")
          .eq("id", state.user.id)
          .maybeSingle();
        lawyerProfile = data;
      }
      setState((prev) => ({ ...prev, profile, lawyerProfile }));
    } catch {}
  };

  const signUp = async (
    email: string,
    password: string,
    userData: {
      firstName: string;
      lastName: string;
      phone?: string;
      mobile?: string;
      userType: "client" | "lawyer";
      location?: string;
      bar_number?: string;
      profession?: string;
      professions?: string[];
      specializations?: string[];
      wilayas?: string[];
      experience_years?: number;
      consultation_price?: number | null;
      gender?: string;
      languages?: string[];
      website?: string;
      address?: {
        street: string;
        neighborhood?: string | null;
        city: string;
        wilaya?: string;
        postalCode: string;
      };
    }
  ) => {
    try {
      const metaData: any = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || null,
        mobile: userData.mobile || null,
        userType: userData.userType,
        location: userData.location || null,
        gender: userData.gender || null,
        languages: userData.languages || ["Arabe", "Français"],
      };
      if (userData.userType === "lawyer") {
        metaData.bar_number = userData.bar_number || "";
        metaData.profession = userData.profession || "avocat";
        metaData.specializations = userData.specializations || [];
        metaData.experience_years = userData.experience_years || 0;
        metaData.consultation_price = userData.consultation_price || null;
        metaData.address = userData.address || null;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metaData, emailRedirectTo: undefined },
      });
      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("Échec de création d'utilisateur");

      await new Promise((resolve) => setTimeout(resolve, 2500));

      try {
        if (userData.languages?.length) {
          await supabase
            .from("users")
            .update({ languages: userData.languages })
            .eq("id", authData.user.id);
        }
        if (userData.userType === "lawyer" && userData.address) {
          await supabase
            .from("users")
            .update({ address: userData.address })
            .eq("id", authData.user.id);
        }
        if (userData.userType === "lawyer" && userData.profession) {
          const professionsToSet = userData.professions?.length
            ? userData.professions
            : [userData.profession];
          const rawSlug = `${userData.firstName}-${userData.lastName}`
            .toLowerCase()
            .normalize("NFD")
            .replace(/̀-ͯ/g, "")
            .replace(/[^a-z0-9-]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
          await supabase
            .from("lawyers")
            .update({
              profession: userData.profession,
              professions: professionsToSet,
              slug: rawSlug,
            })
            .eq("id", authData.user.id);
          if (userData.website) {
            const ws = userData.website.trim();
            const websiteUrl = ws.startsWith("http") ? ws : `https://${ws}`;
            await supabase
              .from("users")
              .update({ website: websiteUrl })
              .eq("id", authData.user.id);
          }
        }
        if (userData.userType === "client" && userData.location) {
          const locationOpt = (
            LOCATION as readonly { value: string; label: string }[]
          ).find((l) => l.value === userData.location);
          const country = locationOpt?.label || userData.location || "";
          await supabase
            .from("users")
            .update({ country })
            .eq("id", authData.user.id);
        }
      } catch (updateError) {
        console.warn("Post-signup update partielle:", updateError);
      }

      try {
        const codeRes = await fetch("/api/send-verification-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            firstName: userData.firstName,
            userType: userData.userType,
          }),
        });
        if (!codeRes.ok) throw new Error("Erreur envoi code");
      } catch {
        throw new Error("Impossible d'envoyer le code de vérification");
      }

      return {
        ...authData,
        redirectPath: `/auth/verify-email?email=${encodeURIComponent(email)}&type=${userData.userType}`,
        userType: userData.userType,
      };
    } catch (error: any) {
      if (
        error.message?.includes("already registered") ||
        error.message?.includes("User already registered")
      )
        throw new Error("Cette adresse email est déjà utilisée.");
      if (error.message?.includes("Password should be at least"))
        throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
      if (error.message?.includes("Invalid email"))
        throw new Error("Format d'email invalide.");
      if (error.message?.includes("Network error"))
        throw new Error("Problème de connexion. Vérifiez votre internet.");
      throw error;
    }
  };

  const signIn = async (
    email: string,
    password: string,
    expectedUserType?: "client" | "lawyer"
  ) => {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("Aucun utilisateur trouvé");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const profile = await verifyUserIntegrity(authData.user);
      if (!profile) throw new Error("Ce compte a été supprimé.");

      let lawyerProfile = null;
      if (profile?.user_type === "lawyer") {
        const { data } = await supabase
          .from("lawyers")
          .select("*")
          .eq("id", authData.user.id)
          .maybeSingle();
        lawyerProfile = data;
      }

      if (expectedUserType && profile?.user_type !== expectedUserType) {
        await supabase.auth.signOut();
        throw new Error(
          expectedUserType === "lawyer"
            ? "Ce compte n'est pas un compte professionnel. Veuillez utiliser l'interface client."
            : "Ce compte n'est pas un compte client. Veuillez utiliser l'interface professionnelle."
        );
      }

      setState({
        user: authData.user,
        session: authData.session,
        profile,
        lawyerProfile,
        loading: false,
      });

      const redirectPath = getRedirectPath(
        profile?.user_type || "client",
        "login",
        lawyerProfile
      );
      return {
        ...authData,
        redirectPath,
        userType: profile?.user_type || "client",
      };
    } catch (error: any) {
      if (error.message?.includes("Invalid login credentials"))
        throw new Error("Email ou mot de passe incorrect.");
      if (error.message?.includes("Email not confirmed"))
        throw new Error(
          "Veuillez confirmer votre email avant de vous connecter."
        );
      if (error.message?.includes("Too many requests"))
        throw new Error("Trop de tentatives. Veuillez réessayer plus tard.");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem("activeProfession");
      setState({
        user: null,
        session: null,
        profile: null,
        lawyerProfile: null,
        loading: false,
      });
      await supabase.auth.signOut();
    } catch {
      setState({
        user: null,
        session: null,
        profile: null,
        lawyerProfile: null,
        loading: false,
      });
    }
  };

  useEffect(() => {
    let mounted = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setState((prev) => ({
          ...prev,
          user: session.user,
          session,
          loading: false,
        }));
        setTimeout(async () => {
          if (!mounted) return;
          try {
            const { data: profile } = await supabase
              .from("users")
              .select("*")
              .eq("id", session.user.id)
              .single();
            if (!profile) {
              await supabase.auth.signOut();
              setState({
                user: null,
                session: null,
                profile: null,
                lawyerProfile: null,
                loading: false,
              });
              return;
            }
            let lawyerProfile = null;
            if (profile?.user_type === "lawyer") {
              const { data } = await supabase
                .from("lawyers")
                .select("*")
                .eq("id", session.user.id)
                .maybeSingle();
              lawyerProfile = data;
            }
            if (mounted)
              setState((prev) => ({ ...prev, profile, lawyerProfile }));
          } catch {}
        }, 100);
      } else {
        if (mounted)
          setState({
            user: null,
            session: null,
            profile: null,
            lawyerProfile: null,
            loading: false,
          });
      }
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        signOut,
        refreshProfile,
        isAuthenticated: !!state.user,
        getRedirectPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
