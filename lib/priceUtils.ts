import { formatPrice } from "./utils";

export { formatPrice };

export const calculateConsultationPrice = (
  customPrice: number | null | undefined,
  experience: number,
  rating: number | null | undefined
): number => {
  if (customPrice && customPrice > 0) {
    return customPrice;
  }

  const BASE_PRICE = 5000;
  const EXPERIENCE_BONUS = 50;
  const RATING_BONUS = 100;
  const MAX_ESTIMATED = 7000;

  const experienceBonus = experience * EXPERIENCE_BONUS;
  const ratingBonus = rating ? rating * RATING_BONUS : 0;

  return Math.min(
    Math.round(BASE_PRICE + experienceBonus + ratingBonus),
    MAX_ESTIMATED
  );
};

export const PRICE_LIMITS = {
  MIN: 5000,
  MAX: 100000,
} as const;
