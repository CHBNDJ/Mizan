// /lib/currency.ts

const EXCHANGE_RATE = 140; // 1 EUR = ~140 DZD (à ajuster)

export function eurToDzd(eur: number): number {
  return Math.round(eur * EXCHANGE_RATE);
}

export function dzdToEur(dzd: number): number {
  return Math.round((dzd / EXCHANGE_RATE) * 100) / 100;
}

export function formatPrice(eur: number, showBoth = true): string {
  const dzd = eurToDzd(eur);

  if (showBoth) {
    return `${eur} EUR (≈${dzd.toLocaleString()} DZD)`;
  }

  return `${eur} EUR`;
}

// Utilisation
formatPrice(50); // "50 EUR (≈7,000 DZD)"
