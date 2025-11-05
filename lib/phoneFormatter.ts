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
