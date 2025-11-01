import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ✅ FONCTION UNIQUE pour formater les prix
export function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " DZD";
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getInitials(firstName?: string, lastName?: string): string {
  if (!firstName) {
    return lastName ? lastName.substring(0, 2).toUpperCase() : "??";
  }
  return `${firstName.charAt(0)}${lastName?.charAt(0) || ""}`.toUpperCase();
}
