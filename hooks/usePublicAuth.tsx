"use client";

import { createClient } from "@/lib/supabase/client";

export function usePublicAuth() {
  const supabase = createClient();

  const resetPasswordForEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        if (error.message?.includes("should be different")) {
          throw new Error(
            "Le nouveau mot de passe doit être différent de l'ancien."
          );
        }
        throw error;
      }

      await supabase.auth.signOut();
      return { success: true };
    } catch (error: any) {
      throw error;
    }
  };

  const verifyOtp = async (token_hash: string, type: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: type as any,
      });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      throw error;
    }
  };

  return {
    resetPasswordForEmail,
    updatePassword,
    verifyOtp,
  };
}
