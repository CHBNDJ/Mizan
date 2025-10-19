import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ✅ Fonction formatPrice consistente (même résultat serveur/client)
export function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " DA";
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getInitials(firstName?: string, lastName?: string): string {
  // Si pas de prénom (cabinets), utiliser les 2 premières lettres du nom
  if (!firstName) {
    return lastName ? lastName.substring(0, 2).toUpperCase() : "??";
  }

  // Si prénom disponible, utiliser première lettre du prénom + première du nom
  return `${firstName.charAt(0)}${lastName?.charAt(0) || ""}`.toUpperCase();
}
