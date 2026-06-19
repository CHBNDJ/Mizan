import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "ar", "en"],
  defaultLocale: "fr",
  localePrefix: "as-needed", // fr = mizan-dz.com/recherche, ar = mizan-dz.com/ar/recherche
});

export type Locale = (typeof routing.locales)[number];
