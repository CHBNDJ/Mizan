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
  getRedirectPath: (userType: string, action: "login" | "register") => string;
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

      if (error) {
        console.error("Erreur vérification intégrité:", error);
        return null;
      }

      if (!profile) {
        console.warn("Compte fantôme détecté, déconnexion forcée");
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
    } catch (error) {
      console.error("Exception vérification intégrité:", error);
      return null;
    }
  };

  const getRedirectPath = (userType: string, action: "login" | "register") => {
    if (userType === "lawyer") {
      return "/lawyer/dashboard";
    } else {
      return "/";
    }
  };

  const refreshProfile = async () => {
    if (!state.user?.id) return;

    try {
      const profile = await verifyUserIntegrity(state.user);

      if (!profile) return;

      let lawyerProfile = null;
      if (profile?.user_type === "lawyer") {
        const { data: lawyerData, error: lawyerError } = await supabase
          .from("lawyers")
          .select("*")
          .eq("id", state.user.id)
          .maybeSingle();

        if (lawyerError) {
          console.error("Erreur chargement profil avocat:", lawyerError);
        } else {
          lawyerProfile = lawyerData;
        }
      }

      setState((prev) => ({
        ...prev,
        profile,
        lawyerProfile,
      }));
    } catch (error) {
      console.error("Erreur actualisation profil:", error);
    }
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
      specializations?: string[];
      wilayas?: string[];
      experience_years?: number;
      consultationPrice?: string;
      gender?: string;
      languages?: string[];
      address?: {
        street: string;
        neighborhood?: string | null;
        city: string;
        postalCode: string;
      };
    }
  ) => {
    try {
      const metaData: any = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone || null,
        mobile: userData.mobile || null,
        user_type: userData.userType,
        location: userData.location || null,
        gender: userData.gender || null,
        languages: userData.languages || ["Arabe", "Français"],
      };

      if (userData.userType === "lawyer") {
        metaData.bar_number = userData.bar_number || "";
        metaData.specializations = userData.specializations || [];
        metaData.wilayas = userData.wilayas || [];
        metaData.experience_years = userData.experience_years || 0;
        metaData.address = userData.address || null;
      }

      // ✅ CRÉER LE COMPTE SANS EMAIL AUTO
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metaData,
          emailRedirectTo: undefined, // Désactive l'email auto
        },
      });

      if (authError) {
        console.error("Erreur inscription Supabase:", authError);
        throw new Error(authError.message);
      }

      if (!authData.user) {
        console.error("Aucun utilisateur créé");
        throw new Error("Échec de création d'utilisateur");
      }

      // ❌ SUPPRIMER CETTE LIGNE
      // await new Promise((resolve) => setTimeout(resolve, 3000));

      // ✅ ENVOYER LE CODE DE VÉRIFICATION
      try {
        const codeResponse = await fetch("/api/send-verification-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            firstName: userData.firstName,
            userType: userData.userType,
          }),
        });

        const codeData = await codeResponse.json();

        if (!codeResponse.ok) {
          console.error("Erreur envoi code:", codeData);
          throw new Error("Erreur lors de l'envoi du code de vérification");
        }

        console.log("✅ Code envoyé avec succès");
      } catch (codeError) {
        console.error("Exception envoi code:", codeError);
        throw new Error("Impossible d'envoyer le code de vérification");
      }

      // ✅ RETOURNER LE PATH AVEC PARAMS
      return {
        ...authData,
        redirectPath: `/auth/verify-email?email=${encodeURIComponent(email)}&type=${userData.userType}`,
        userType: userData.userType,
      };
    } catch (error: any) {
      console.error("Erreur inscription:", error);

      if (
        error.message?.includes("already registered") ||
        error.message?.includes("User already registered")
      ) {
        throw new Error("Cette adresse email est déjà utilisée.");
      } else if (error.message?.includes("Password should be at least")) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
      } else if (error.message?.includes("Invalid email")) {
        throw new Error("Format d'email invalide.");
      } else if (error.message?.includes("Network error")) {
        throw new Error("Problème de connexion. Vérifiez votre internet.");
      }

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
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        console.error("Erreur connexion:", authError);
        throw new Error(authError.message);
      }

      if (!authData.user) {
        console.error("Aucun utilisateur trouvé");
        throw new Error("Aucun utilisateur trouvé");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const profile = await verifyUserIntegrity(authData.user);

      if (!profile) {
        throw new Error("Ce compte a été supprimé.");
      }

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

        const errorMsg =
          expectedUserType === "lawyer"
            ? "Ce compte n'est pas un compte avocat. Veuillez utiliser l'interface client."
            : "Ce compte n'est pas un compte client. Veuillez utiliser l'interface avocat.";

        throw new Error(errorMsg);
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
        "login"
      );

      return {
        ...authData,
        redirectPath,
        userType: profile?.user_type || "client",
      };
    } catch (error: any) {
      console.error("Erreur connexion:", error);

      if (error.message?.includes("Invalid login credentials")) {
        throw new Error("Email ou mot de passe incorrect.");
      } else if (error.message?.includes("Email not confirmed")) {
        throw new Error(
          "Veuillez confirmer votre email avant de vous connecter."
        );
      } else if (error.message?.includes("Too many requests")) {
        throw new Error("Trop de tentatives. Veuillez réessayer plus tard.");
      } else if (error.message?.includes("Ce compte n'est pas un compte")) {
        throw error;
      } else if (error.message?.includes("Ce compte a été supprimé")) {
        throw error;
      }

      throw error;
    }
  };

  const signOut = async () => {
    try {
      setState({
        user: null,
        session: null,
        profile: null,
        lawyerProfile: null,
        loading: false,
      });

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.warn("Erreur déconnexion Supabase:", error);
      }
    } catch (error: any) {
      console.error("Erreur critique déconnexion:", error);
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
              console.warn("Profil introuvable, déconnexion");
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

            if (mounted) {
              setState((prev) => ({
                ...prev,
                profile,
                lawyerProfile,
              }));
            }
          } catch (error) {
            console.error("Erreur chargement profil:", error);
          }
        }, 100);
      } else {
        if (!mounted) return;
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

  const value = {
    ...state,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    isAuthenticated: !!state.user,
    getRedirectPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
