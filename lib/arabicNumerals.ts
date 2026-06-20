const EASTERN_ARABIC_DIGITS = [
  "٠",
  "١",
  "٢",
  "٣",
  "٤",
  "٥",
  "٦",
  "٧",
  "٨",
  "٩",
];

export function toArabicNumerals(input: string): string {
  return input.replace(/[0-9]/g, (d) => EASTERN_ARABIC_DIGITS[parseInt(d, 10)]);
}

export function localizedDigits(input: string, locale: string): string {
  return locale === "ar" ? toArabicNumerals(input) : input;
}
