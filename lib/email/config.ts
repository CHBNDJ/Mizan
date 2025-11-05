import { Resend } from "resend";

if (typeof window === "undefined" && !process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY manquante dans .env");
}

const getServerEnv = (key: string, defaultValue: string = "") => {
  return typeof window === "undefined"
    ? process.env[key] || defaultValue
    : defaultValue;
};

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
