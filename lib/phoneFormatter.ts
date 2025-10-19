// lib/phoneFormatter.ts

/**
 * Formate un numéro de téléphone selon les conventions internationales
 * Utilisé pour l'affichage ET avant insertion en base
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return "";

  // Nettoyer le numéro (enlever espaces, tirets, points, parenthèses)
  const cleanNumber = phone.replace(/[\s\-\.\(\)]/g, "");

  // Patterns de formatage par pays
  const countryFormats: { [key: string]: (num: string) => string } = {
    // France (+33)
    "33": (num: string) => {
      const national = num.replace(/^(\+33|0033|33)/, "");
      if (national.length === 9) {
        return `+33 ${national.charAt(0)} ${national.slice(
          1,
          3
        )} ${national.slice(3, 5)} ${national.slice(5, 7)} ${national.slice(
          7
        )}`;
      }
      return `+33 ${national}`;
    },

    // Algérie (+213)
    "213": (num: string) => {
      const national = num.replace(/^(\+213|00213|213)/, "");

      if (national.length === 9) {
        // Numéros mobiles (commencent par 5, 6, 7) : +213 661 53 93 38
        if (
          national.startsWith("5") ||
          national.startsWith("6") ||
          national.startsWith("7")
        ) {
          return `+213 ${national.slice(0, 3)} ${national.slice(
            3,
            5
          )} ${national.slice(5, 7)} ${national.slice(7)}`;
        }
        // Autres numéros 9 chiffres : +213 xxx xx xx xx
        return `+213 ${national.slice(0, 3)} ${national.slice(
          3,
          5
        )} ${national.slice(5, 7)} ${national.slice(7)}`;
      } else if (national.length === 8) {
        // Numéros fixes (commencent par 2, 3, 4, etc.) : +213 23 49 18 37
        return `+213 ${national.slice(0, 2)} ${national.slice(
          2,
          4
        )} ${national.slice(4, 6)} ${national.slice(6)}`;
      }

      return `+213 ${national}`;
    },

    // Maroc (+212)
    "212": (num: string) => {
      const national = num.replace(/^(\+212|00212|212)/, "");
      if (national.length === 9) {
        return `+212 ${national.charAt(0)} ${national.slice(
          1,
          3
        )} ${national.slice(3, 5)} ${national.slice(5, 7)} ${national.slice(
          7
        )}`;
      }
      return `+212 ${national}`;
    },

    // Tunisie (+216)
    "216": (num: string) => {
      const national = num.replace(/^(\+216|00216|216)/, "");
      if (national.length === 8) {
        return `+216 ${national.slice(0, 2)} ${national.slice(
          2,
          5
        )} ${national.slice(5)}`;
      }
      return `+216 ${national}`;
    },

    // Canada/États-Unis (+1)
    "1": (num: string) => {
      const national = num.replace(/^(\+1|001|1)/, "");
      if (national.length === 10) {
        return `+1 (${national.slice(0, 3)}) ${national.slice(
          3,
          6
        )}-${national.slice(6)}`;
      }
      return `+1 ${national}`;
    },

    // Royaume-Uni (+44)
    "44": (num: string) => {
      const national = num.replace(/^(\+44|0044|44)/, "");
      if (national.length === 10) {
        if (national.startsWith("7")) {
          return `+44 ${national.slice(0, 4)} ${national.slice(
            4,
            7
          )}${national.slice(7)}`;
        } else {
          return `+44 ${national.slice(0, 2)} ${national.slice(
            2,
            6
          )} ${national.slice(6)}`;
        }
      }
      return `+44 ${national}`;
    },

    // Allemagne (+49)
    "49": (num: string) => {
      const national = num.replace(/^(\+49|0049|49)/, "");
      if (national.length >= 10) {
        return `+49 ${national.slice(0, 2)} ${national.slice(2)}`;
      }
      return `+49 ${national}`;
    },

    // Espagne (+34)
    "34": (num: string) => {
      const national = num.replace(/^(\+34|0034|34)/, "");
      if (national.length === 9) {
        return `+34 ${national.slice(0, 3)} ${national.slice(
          3,
          5
        )} ${national.slice(5, 7)} ${national.slice(7)}`;
      }
      return `+34 ${national}`;
    },

    // Italie (+39)
    "39": (num: string) => {
      const national = num.replace(/^(\+39|0039|39)/, "");
      if (national.length >= 9) {
        if (national.length === 10 && national.startsWith("3")) {
          return `+39 ${national.slice(0, 3)} ${national.slice(
            3,
            6
          )} ${national.slice(6)}`;
        } else {
          return `+39 ${national.slice(0, 2)} ${national.slice(
            2,
            6
          )} ${national.slice(6)}`;
        }
      }
      return `+39 ${national}`;
    },

    // Belgique (+32)
    "32": (num: string) => {
      const national = num.replace(/^(\+32|0032|32)/, "");
      if (national.length === 9) {
        if (national.startsWith("4")) {
          return `+32 ${national.slice(0, 3)} ${national.slice(
            3,
            5
          )} ${national.slice(5, 7)} ${national.slice(7)}`;
        } else {
          return `+32 ${national.charAt(0)} ${national.slice(
            1,
            4
          )} ${national.slice(4, 6)} ${national.slice(6)}`;
        }
      }
      return `+32 ${national}`;
    },

    // Suisse (+41)
    "41": (num: string) => {
      const national = num.replace(/^(\+41|0041|41)/, "");
      if (national.length === 9) {
        return `+41 ${national.slice(0, 2)} ${national.slice(
          2,
          5
        )} ${national.slice(5, 7)} ${national.slice(7)}`;
      }
      return `+41 ${national}`;
    },
  };

  // Détecter le code pays
  let countryCode = "";
  let formattedNumber = cleanNumber;

  // Vérifier si le numéro commence par +
  if (cleanNumber.startsWith("+")) {
    for (const code of Object.keys(countryFormats).sort(
      (a, b) => b.length - a.length
    )) {
      if (cleanNumber.startsWith(`+${code}`)) {
        countryCode = code;
        break;
      }
    }
  }
  // Vérifier si c'est un numéro français sans indicatif (commence par 0)
  else if (cleanNumber.startsWith("0") && cleanNumber.length === 10) {
    countryCode = "33";
    formattedNumber = `+33${cleanNumber.slice(1)}`;
  }
  // Vérifier si c'est un numéro algérien sans indicatif
  else if (
    cleanNumber.length === 9 &&
    (cleanNumber.startsWith("5") ||
      cleanNumber.startsWith("6") ||
      cleanNumber.startsWith("7"))
  ) {
    countryCode = "213";
    formattedNumber = `+213${cleanNumber}`;
  }

  // Appliquer le formatage selon le pays
  if (countryCode && countryFormats[countryCode]) {
    return countryFormats[countryCode](formattedNumber);
  }

  // Fallback : formatage générique avec espace après le +
  return cleanNumber
    .replace(/^\+(\d)/, "+$1 ")
    .replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
};

/**
 * Normalise un numéro pour le stockage en base
 * Garde le format international mais propre
 */
export const normalizePhoneForStorage = (phone: string): string => {
  if (!phone) return "";

  const cleanNumber = phone.replace(/[\s\-\.\(\)]/g, "");

  // Si pas d'indicatif, deviner le pays
  if (!cleanNumber.startsWith("+")) {
    // Numéro français
    if (cleanNumber.startsWith("0") && cleanNumber.length === 10) {
      return `+33${cleanNumber.slice(1)}`;
    }
    // Numéro algérien
    if (cleanNumber.length === 9 && /^[567]/.test(cleanNumber)) {
      return `+213${cleanNumber}`;
    }
  }

  // S'assurer que le + est présent
  return cleanNumber.startsWith("+") ? cleanNumber : `+${cleanNumber}`;
};

/**
 * Gère les numéros multiples (séparés par virgules)
 */
export const formatMultiplePhones = (phoneString: string): string => {
  if (!phoneString) return "";

  return phoneString
    .split(",")
    .map((phone) => formatPhoneNumber(phone.trim()))
    .filter((phone) => phone.length > 0)
    .join(", ");
};

/**
 * Normalise les numéros multiples pour le stockage
 */
export const normalizeMultiplePhonesForStorage = (
  phoneString: string
): string => {
  if (!phoneString) return "";

  return phoneString
    .split(",")
    .map((phone) => normalizePhoneForStorage(phone.trim()))
    .filter((phone) => phone.length > 0)
    .join(",");
};

/**
 * Valide un numéro de téléphone
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  if (!phone) return false;

  const cleanNumber = phone.replace(/[\s\-\.\(\)]/g, "");

  // Doit commencer par + et avoir au moins 8 chiffres
  const phoneRegex = /^\+\d{8,15}$/;

  return phoneRegex.test(cleanNumber);
};

/**
 * Extrait le code pays d'un numéro
 */
export const getCountryCodeFromPhone = (phone: string): string => {
  if (!phone) return "";

  const cleanNumber = phone.replace(/[\s\-\.\(\)]/g, "");

  if (cleanNumber.startsWith("+")) {
    // Codes pays connus (du plus long au plus court)
    const countryCodes = [
      "213",
      "216",
      "212",
      "33",
      "44",
      "49",
      "39",
      "34",
      "32",
      "41",
      "1",
    ];

    for (const code of countryCodes) {
      if (cleanNumber.startsWith(`+${code}`)) {
        return code;
      }
    }
  }

  return "";
};

/**
 * Convertit un numéro local en format international
 */
export const toInternationalFormat = (
  phone: string,
  defaultCountryCode: string = "213"
): string => {
  if (!phone) return "";

  const cleanNumber = phone.replace(/[\s\-\.\(\)]/g, "");

  // Déjà international
  if (cleanNumber.startsWith("+")) {
    return cleanNumber;
  }

  // Numéro français (commence par 0)
  if (cleanNumber.startsWith("0") && cleanNumber.length === 10) {
    return `+33${cleanNumber.slice(1)}`;
  }

  // Numéro algérien (9 chiffres commençant par 5, 6 ou 7)
  if (cleanNumber.length === 9 && /^[567]/.test(cleanNumber)) {
    return `+213${cleanNumber}`;
  }

  // Utiliser le code pays par défaut
  return `+${defaultCountryCode}${cleanNumber}`;
};

/**
 * Exemples d'utilisation :
 *
 * formatPhoneNumber("0645676780") → "+33 6 45 67 67 80"
 * formatPhoneNumber("+213555123456") → "+213 555 12 34 56"
 * formatMultiplePhones("0645676780,+213555123456") → "+33 6 45 67 67 80, +213 555 12 34 56"
 * normalizePhoneForStorage("06 45 67 67 80") → "+33645676780"
 * isValidPhoneNumber("+33645676780") → true
 * getCountryCodeFromPhone("+33645676780") → "33"
 */
