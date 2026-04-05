export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return "";

  const cleanNumber = phone.replace(/[\s\-\.\(\)]/g, "");

  const countryFormats: { [key: string]: (num: string) => string } = {
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

    "213": (num: string) => {
      const national = num.replace(/^(\+213|00213|213)/, "");

      if (national.length === 9) {
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

        return `+213 ${national.slice(0, 3)} ${national.slice(
          3,
          5
        )} ${national.slice(5, 7)} ${national.slice(7)}`;
      } else if (national.length === 8) {
        return `+213 ${national.slice(0, 2)} ${national.slice(
          2,
          4
        )} ${national.slice(4, 6)} ${national.slice(6)}`;
      }

      return `+213 ${national}`;
    },

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

    "49": (num: string) => {
      const national = num.replace(/^(\+49|0049|49)/, "");
      if (national.length >= 10) {
        return `+49 ${national.slice(0, 2)} ${national.slice(2)}`;
      }
      return `+49 ${national}`;
    },

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

  let countryCode = "";
  let formattedNumber = cleanNumber;

  if (cleanNumber.startsWith("+")) {
    for (const code of Object.keys(countryFormats).sort(
      (a, b) => b.length - a.length
    )) {
      if (cleanNumber.startsWith(`+${code}`)) {
        countryCode = code;
        break;
      }
    }
  } else if (cleanNumber.startsWith("0") && cleanNumber.length === 10) {
    countryCode = "33";
    formattedNumber = `+33${cleanNumber.slice(1)}`;
  } else if (
    cleanNumber.length === 9 &&
    (cleanNumber.startsWith("5") ||
      cleanNumber.startsWith("6") ||
      cleanNumber.startsWith("7"))
  ) {
    countryCode = "213";
    formattedNumber = `+213${cleanNumber}`;
  }

  if (countryCode && countryFormats[countryCode]) {
    return countryFormats[countryCode](formattedNumber);
  }

  return cleanNumber
    .replace(/^\+(\d)/, "+$1 ")
    .replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
};

export const normalizePhoneForStorage = (phone: string): string => {
  if (!phone) return "";

  const cleanNumber = phone.replace(/[\s\-\.\(\)]/g, "");

  if (!cleanNumber.startsWith("+")) {
    if (cleanNumber.startsWith("0") && cleanNumber.length === 10) {
      return `+33${cleanNumber.slice(1)}`;
    }

    if (cleanNumber.length === 9 && /^[567]/.test(cleanNumber)) {
      return `+213${cleanNumber}`;
    }
  }

  return cleanNumber.startsWith("+") ? cleanNumber : `+${cleanNumber}`;
};

export const formatMultiplePhones = (phoneString: string): string => {
  if (!phoneString) return "";

  return phoneString
    .split(",")
    .map((phone) => formatPhoneNumber(phone.trim()))
    .filter((phone) => phone.length > 0)
    .join(", ");
};

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

export const isValidPhoneNumber = (phone: string): boolean => {
  if (!phone) return false;

  const cleanNumber = phone.replace(/[\s\-\.\(\)]/g, "");

  const phoneRegex = /^\+\d{8,15}$/;

  return phoneRegex.test(cleanNumber);
};

export const getCountryCodeFromPhone = (phone: string): string => {
  if (!phone) return "";

  const cleanNumber = phone.replace(/[\s\-\.\(\)]/g, "");

  if (cleanNumber.startsWith("+")) {
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

export const toInternationalFormat = (
  phone: string,
  defaultCountryCode: string = "213"
): string => {
  if (!phone) return "";

  const cleanNumber = phone.replace(/[\s\-\.\(\)]/g, "");

  if (cleanNumber.startsWith("+")) {
    return cleanNumber;
  }

  if (cleanNumber.startsWith("0") && cleanNumber.length === 10) {
    return `+33${cleanNumber.slice(1)}`;
  }

  if (cleanNumber.length === 9 && /^[567]/.test(cleanNumber)) {
    return `+213${cleanNumber}`;
  }

  return `+${defaultCountryCode}${cleanNumber}`;
};

export const detectPhoneType = (
  phone: string
): "mobile" | "fixe" | "unknown" => {
  if (!phone) return "unknown";

  const cleanNumber = phone.replace(/[\s\-\.\(\)]/g, "");

  if (cleanNumber.startsWith("+213") || cleanNumber.startsWith("213")) {
    const national = cleanNumber.replace(/^(\+213|00213|213|0)/, "");
    if (!national) return "unknown";
    const firstDigit = national[0];
    if (["5", "6", "7"].includes(firstDigit)) return "mobile";
    if (["2", "3", "4"].includes(firstDigit)) return "fixe";
    return "unknown";
  }

  if (cleanNumber.startsWith("+33") || cleanNumber.startsWith("33")) {
    const national = cleanNumber.replace(/^(\+33|0033|33|0)/, "");
    if (!national) return "unknown";
    const firstDigit = national[0];
    if (["6", "7"].includes(firstDigit)) return "mobile";
    if (["1", "2", "3", "4", "5", "8", "9"].includes(firstDigit)) return "fixe";
    return "unknown";
  }

  if (cleanNumber.startsWith("+41") || cleanNumber.startsWith("41")) {
    const national = cleanNumber.replace(/^(\+41|0041|41|0)/, "");
    if (!national) return "unknown";
    const firstDigit = national[0];
    if (firstDigit === "7") return "mobile";
    if (["2", "3", "4", "5", "6", "8", "9"].includes(firstDigit)) return "fixe";
    return "unknown";
  }

  if (cleanNumber.startsWith("+49") || cleanNumber.startsWith("49")) {
    const national = cleanNumber.replace(/^(\+49|0049|49|0)/, "");
    if (!national || national.length < 2) return "unknown";
    const firstTwo = national.substring(0, 2);
    if (["15", "16", "17"].includes(firstTwo)) return "mobile";
    return "fixe";
  }

  if (cleanNumber.startsWith("+39") || cleanNumber.startsWith("39")) {
    const national = cleanNumber.replace(/^(\+39|0039|39|0)/, "");
    if (!national) return "unknown";
    const firstDigit = national[0];
    if (firstDigit === "3") return "mobile";
    return "fixe";
  }

  if (cleanNumber.startsWith("+32") || cleanNumber.startsWith("32")) {
    const national = cleanNumber.replace(/^(\+32|0032|32|0)/, "");
    if (!national) return "unknown";
    const firstDigit = national[0];
    if (firstDigit === "4") return "mobile";
    return "fixe";
  }

  if (cleanNumber.startsWith("+34") || cleanNumber.startsWith("34")) {
    const national = cleanNumber.replace(/^(\+34|0034|34)/, "");
    if (!national) return "unknown";
    const firstDigit = national[0];
    if (["6", "7"].includes(firstDigit)) return "mobile";
    return "fixe";
  }

  if (cleanNumber.startsWith("+212") || cleanNumber.startsWith("212")) {
    const national = cleanNumber.replace(/^(\+212|00212|212|0)/, "");
    if (!national) return "unknown";
    const firstDigit = national[0];
    if (["6", "7"].includes(firstDigit)) return "mobile";
    if (firstDigit === "5") return "fixe";
    return "unknown";
  }

  if (cleanNumber.startsWith("+216") || cleanNumber.startsWith("216")) {
    const national = cleanNumber.replace(/^(\+216|00216|216)/, "");
    if (!national) return "unknown";
    const firstDigit = national[0];
    if (["2", "4", "5", "9"].includes(firstDigit)) return "mobile";
    if (firstDigit === "7") return "fixe";
    return "unknown";
  }

  if (cleanNumber.startsWith("+44") || cleanNumber.startsWith("44")) {
    const national = cleanNumber.replace(/^(\+44|0044|44|0)/, "");
    if (!national) return "unknown";
    const firstDigit = national[0];
    if (firstDigit === "7") return "mobile";
    return "fixe";
  }

  if (cleanNumber.startsWith("+1") || cleanNumber.startsWith("1")) {
    return "unknown";
  }

  return "unknown";
};

export const separatePhoneTypes = (
  phone: string
): { mobile: string | null; fixe: string | null } => {
  if (!phone) return { mobile: null, fixe: null };

  const normalized = normalizePhoneForStorage(phone);
  const type = detectPhoneType(normalized);

  if (type === "mobile") {
    return { mobile: normalized, fixe: null };
  } else if (type === "fixe") {
    return { mobile: null, fixe: normalized };
  }

  return { mobile: normalized, fixe: null };
};
