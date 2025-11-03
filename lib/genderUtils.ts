export type GenderValue = "male" | "female" | "homme" | "femme";
export type CiviliteDisplay = "M." | "Mme";

export function dbToFrontend(
  dbGender: string | undefined
): "homme" | "femme" | "" {
  if (!dbGender) return "";
  const lower = dbGender.toLowerCase();
  if (lower === "male" || lower === "homme") return "homme";
  if (lower === "female" || lower === "femme") return "femme";
  return "";
}

export function frontendToDb(frontendGender: string): "male" | "female" {
  return frontendGender === "femme" ? "female" : "male";
}

export function toCivilite(gender: string | undefined): CiviliteDisplay {
  if (!gender) return "M.";
  const lower = gender.toLowerCase();
  if (lower === "female" || lower === "femme") return "Mme";
  return "M.";
}

export function civiliteToFrontend(
  civilite: CiviliteDisplay
): "homme" | "femme" {
  return civilite === "Mme" ? "femme" : "homme";
}

export const CIVILITE_OPTIONS = [
  { value: "homme", label: "M." },
  { value: "femme", label: "Mme" },
];

export function getTitre(gender: string | undefined): string {
  return toCivilite(gender) === "Mme" ? "Maître" : "Maître";
}
