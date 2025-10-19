import { Resend } from "resend";

// Vérification uniquement côté serveur
if (typeof window === "undefined" && !process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY manquante dans .env");
}

// Côté serveur : utilise la vraie clé
// Côté client : utilise une clé factice (jamais utilisée pour envoyer des emails)
const getServerEnv = (key: string, defaultValue: string = "") => {
  return typeof window === "undefined"
    ? process.env[key] || defaultValue
    : defaultValue;
};

// Resend a besoin d'une clé valide même côté client (même si jamais utilisée)
const resendKey = getServerEnv(
  "RESEND_API_KEY",
  "re_dummy_key_for_client_side"
);

export const resend = new Resend(resendKey);

export const EMAIL_CONFIG = {
  from: getServerEnv("RESEND_FROM_EMAIL", "Mizan <noreply@mizan-dz.com>"),
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || "https://mizan-dz.com",
  adminEmail: getServerEnv("ADMIN_EMAIL", "admin@mizan-dz.com"),
};
