import type { useTranslations } from "next-intl";

type T = ReturnType<typeof useTranslations>;

const lookup = (t: T, namespace: string, value: string): string => {
  if (!value) return value;
  try {
    const dict = t.raw(namespace) as Record<string, string> | undefined;
    if (!dict || typeof dict !== "object") return value;
    if (dict[value] !== undefined) return dict[value];
    const lower = value.toLowerCase();
    const foundKey = Object.keys(dict).find((k) => k.toLowerCase() === lower);
    return foundKey ? dict[foundKey] : value;
  } catch {
    return value;
  }
};

export const getWilayaLabel = (value: string, t: T) =>
  lookup(t, "wilayas", value);
export const getSpecialiteLabel = (value: string, t: T) =>
  lookup(t, "specialites", value);
export const getCountryLabel = (value: string, t: T) =>
  lookup(t, "countries", value);
export const getLangueLabel = (value: string, t: T) =>
  lookup(t, "langues", value);
export const getGenreLabel = (value: string, t: T) =>
  lookup(t, "genres", value);
