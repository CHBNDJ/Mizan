import type { useTranslations } from "next-intl";

type T = ReturnType<typeof useTranslations>;

const lookup = (t: T, namespace: string, value: string): string => {
  try {
    const result = t(`${namespace}.${value}`);
    return result.includes(`${namespace}.`) ? value : result;
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
