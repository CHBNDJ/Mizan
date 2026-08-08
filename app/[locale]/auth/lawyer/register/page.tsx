"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import {
  Eye,
  EyeOff,
  Phone,
  Smartphone,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Scale,
  FileText,
  Briefcase,
  Calculator,
  TrendingUp,
  Languages,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale, useMessages } from "next-intl";
import { toArabicNumerals } from "@/lib/arabicNumerals";
import { MultiSelectWithCheckboxes } from "@/components/ui/MultiSelectCheck";
import { ExtendedLawyerSignupFormData, FormErrors } from "@/types";
import { frontendToDb } from "@/lib/genderUtils";
import {
  WILAYAS,
  COUNTRIES,
  LANGUES,
  LANGUES_TRADUCTEUR,
} from "@/utils/constants";
import { COMMUNES_PAR_WILAYA } from "@/utils/communes";
import { REGIONS_FRANCE, VILLES_PAR_REGION } from "@/utils/franceData";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { separatePhoneTypes } from "@/lib/phoneFormatter";
import { useAuth } from "@/hooks/useAuth";
import { gsap } from "gsap";
import { createClient } from "@/lib/supabase/client";
import { DOMAINES_PAR_PROFESSION } from "@/lib/avocatsData";
import {
  getSpecialiteLabel,
  getCountryLabel,
  getWilayaLabel,
} from "@/lib/i18nLabels";

type Profession =
  | "avocat"
  | "notaire"
  | "huissier"
  | "comptable"
  | "expert-comptable"
  | "traducteur";

const PROF_KEY: Record<Profession, string> = {
  avocat: "avocat",
  notaire: "notaire",
  huissier: "huissier",
  comptable: "comptable",
  "expert-comptable": "expertComptable",
  traducteur: "traducteur",
};

const PROFESSION_ICONS: { id: Profession; Icon: any }[] = [
  { id: "avocat", Icon: Scale },
  { id: "notaire", Icon: FileText },
  { id: "huissier", Icon: Briefcase },
  { id: "comptable", Icon: Calculator },
  { id: "expert-comptable", Icon: TrendingUp },
  { id: "traducteur", Icon: Languages },
];

export default function LawyerRegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const t = useTranslations();
  const messages = useMessages();
  const specialitesLookup = useMemo(() => {
    const raw = (messages as any)?.specialites || {};
    const map: Record<string, string> = {};
    Object.entries(raw).forEach(([k, v]) => {
      map[k.toLowerCase()] = v as string;
    });
    return map;
  }, [messages]);
  const translateSpec = (s: string) => specialitesLookup[s.toLowerCase()] || s;
  const wilayasLookup = useMemo(() => {
    const raw = (messages as any)?.wilayas || {};
    const map: Record<string, string> = {};
    Object.entries(raw).forEach(([k, v]) => {
      map[k.toLowerCase()] = v as string;
    });
    return map;
  }, [messages]);
  const translateWilaya = (s: string) => wilayasLookup[s.toLowerCase()] || s;

  const communesLookup = useMemo(() => {
    const raw = (messages as any)?.communes || {};
    const map: Record<string, string> = {};
    Object.entries(raw).forEach(([k, v]) => {
      map[k.toLowerCase()] = v as string;
    });
    return map;
  }, [messages]);
  const translateCommune = (s: string) => communesLookup[s.toLowerCase()] || s;

  const civiliteOptions = [
    { value: "homme", label: t("genres.homme") },
    { value: "femme", label: t("genres.femme") },
  ];
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const [professions, setProfessions] = useState<Profession[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ExtendedLawyerSignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    languages: [],
    phone: "",
    mobile: "",
    barNumber: "",
    specializations: [],
    experience: "",
    consultationPrice: "",
    address: { street: "", wilaya: "", city: "", postalCode: "" },
    country_practice: "Algérie",
    website: "",
  });
  const [communeOptions, setCommuneOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("213");
  const [selectedMobileCountry, setSelectedMobileCountry] = useState("213");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const isFrance = formData.country_practice === "France";

  const PROFESSIONS = PROFESSION_ICONS.map((p) => {
    const key = PROF_KEY[p.id];
    return {
      ...p,
      label: t(`professions.${key}.label`),
      numLabel: t(`auth.lawyerRegister.numLabels.${key}`),
      numPlaceholder: t(`auth.lawyerRegister.numPlaceholders.${key}`),
    };
  });

  const primaryProfession = professions[0] || null;
  const currentProf = PROFESSIONS.find((p) => p.id === primaryProfession);
  const domaineOptions = primaryProfession
    ? (DOMAINES_PAR_PROFESSION[primaryProfession] || []).map((d) => ({
        value: d,
        label: translateSpec(d),
      }))
    : [];

  const handleProfessionSelect = (p: Profession) => {
    if (p === "expert-comptable") {
      setProfessions(["expert-comptable", "comptable"]);
    } else {
      setProfessions([p]);
    }
  };

  const handleCountrySelect = (country: string) => {
    setFormData((p) => ({
      ...p,
      country_practice: country,
      address: { ...p.address, wilaya: "", city: "" },
    }));
    const dial = country === "France" ? "33" : "213";
    setSelectedMobileCountry(dial);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    gsap
      .timeline()
      .fromTo(
        ".page-title",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
      )
      .fromTo(
        ".page-subtitle",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".register-form",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );
  }, []);

  useEffect(() => {
    if (!formData.address.wilaya) {
      setCommuneOptions([]);
      return;
    }
    if (isFrance) {
      const r = REGIONS_FRANCE.find(
        (x) => x.toLowerCase().replace(/\s+/g, "-") === formData.address.wilaya
      );
      if (r && VILLES_PAR_REGION[r]) {
        setCommuneOptions(
          VILLES_PAR_REGION[r].map((c) => ({
            value: c.toLowerCase().replace(/\s+/g, "-"),
            label: c,
          }))
        );
        setFormData((prev) => ({
          ...prev,
          address: { ...prev.address, city: "" },
        }));
      }
      return;
    }
    const w = WILAYAS.find(
      (x) => x.toLowerCase().replace(/\s+/g, "-") === formData.address.wilaya
    );
    if (w && COMMUNES_PAR_WILAYA[w]) {
      setCommuneOptions(
        COMMUNES_PAR_WILAYA[w].map((c) => ({
          value: c.toLowerCase().replace(/\s+/g, "-"),
          label: translateCommune(c),
        }))
      );
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, city: "" },
      }));
    }
  }, [formData.address.wilaya, formData.country_practice]);

  const wilayaOptions = WILAYAS.map((w) => ({
    value: w.toLowerCase().replace(/\s+/g, "-"),
    label: translateWilaya(w),
  }));
  const regionOptions = REGIONS_FRANCE.map((r) => ({
    value: r.toLowerCase().replace(/\s+/g, "-"),
    label: r,
  }));
  const countryOptions = COUNTRIES.map((c) => {
    const nom = getCountryLabel(c.id, t);
    return {
      value: c.code,
      label: `${c.flag} \u200E+${c.code}\u200E ${nom}`,
      sortKey: nom,
    };
  }).sort((a, b) => a.sortKey.localeCompare(b.sortKey, locale));
  const langueOptions = (
    primaryProfession === "traducteur" ? LANGUES_TRADUCTEUR : LANGUES
  ).map((l) => ({ value: l, label: t(`langues.${l}`) }));

  const inputCls =
    "w-full h-12 px-4 text-sm border border-slate-300 dark:border-[#3a3a3d] rounded-lg bg-white dark:bg-[#1c1c1e] hover:border-teal-300 dark:hover:border-[#6fcf9f] text-slate-700 dark:text-[#F5F5F4] focus:border-teal-300 dark:focus:border-[#6fcf9f] focus:border-2 outline-none transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-[#7A7A78]";
  const labelCls =
    "block text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-1";
  const errCls = "text-red-500 dark:text-[#E08585] text-xs mt-1";

  const cap = (s: string) =>
    s
      ? s
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ")
      : s;
  const handleCap = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((p) => ({ ...p, [e.target.name]: cap(e.target.value) }));
  const handleAddr = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fn = e.target.name.replace("address.", "");
    setFormData((p) => ({
      ...p,
      address: {
        ...p.address,
        [fn]: fn === "street" ? cap(e.target.value) : e.target.value,
      },
    }));
  };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validateStep = (step: number): boolean => {
    const e: FormErrors = {};
    if (step === 2) {
      if (!formData.gender) e.gender = t("validation.required.civilite");
      if (!formData.firstName.trim())
        e.firstName = t("validation.required.firstName");
      if (!formData.lastName.trim())
        e.lastName = t("validation.required.lastName");
      if (!formData.mobile.trim()) e.mobile = t("validation.required.mobile");
      else if (formData.mobile.length < 8)
        e.mobile = t("validation.invalid.mobileTooShort");
      if (formData.languages.length === 0)
        e.languages = t("validation.required.languages");
    }
    if (step === 3) {
      if (!formData.address.street.trim())
        e.street = t("validation.required.street");
      if (!formData.address.wilaya) e.wilaya = t("validation.required.wilaya");
      if (!formData.address.city) e.city = t("validation.required.city");
      if (!formData.address.postalCode.trim())
        e.postalCode = t("validation.required.postalCode");
      else if (!/^\d{5}$/.test(formData.address.postalCode))
        e.postalCode = t("validation.invalid.postalCode");
      const isTraducteurNonAssermente =
        primaryProfession === "traducteur" && !(formData as any).isAssermente;
      if (!isTraducteurNonAssermente && !isFrance) {
        if (!formData.barNumber.trim())
          e.barNumber = t("auth.lawyerRegister.barNumberRequired", {
            numLabel: currentProf?.numLabel || "",
          });
        else if (
          primaryProfession === "avocat" &&
          !/^(\d{2}\/\d{3,4}|\d{3,4}\/\d{2})$/.test(formData.barNumber.trim())
        )
          e.barNumber = t("validation.invalid.barNumber");
      }
    }
    if (step === 4) {
      if (formData.specializations.length === 0)
        e.specializations = t("validation.required.specializations");
      if (!formData.experience.trim())
        e.experience = t("validation.required.experience");
      else {
        const yr = parseInt(formData.experience);
        const currentYear = new Date().getFullYear();
        if (yr < 1950 || yr > currentYear)
          e.experience = t("auth.lawyerRegister.inscriptionYearInvalid");
      }
    }
    if (step === 5) {
      if (!formData.email.trim()) e.email = t("validation.required.email");
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        e.email = t("validation.invalid.email");
      if (!formData.password) e.password = t("validation.required.password");
      else if (formData.password.length < 8)
        e.password = t("validation.invalid.passwordLength");
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
        e.password = t("validation.invalid.passwordComplexityFull");
      if (formData.password !== formData.confirmPassword)
        e.confirmPassword = t("validation.invalid.passwordMismatch");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!formData.country_practice) return;
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (currentStep === 1 && professions.length > 0) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (validateStep(currentStep)) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handleBack = () => {
    setCurrentStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(5) || professions.length === 0) return;
    setIsSubmitting(true);
    setErrors({});
    const emailNorm = formData.email.trim().toLowerCase();
    try {
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("user_type", "lawyer")
        .or(`email.eq.${emailNorm},professional_email.eq.${emailNorm}`);
      if (existing && existing.length > 0) {
        const { data: ld } = await supabase
          .from("lawyers")
          .select("is_claimed")
          .eq("id", existing[0].id)
          .single();
        if (ld?.is_claimed) {
          setErrors({ general: t("auth.lawyerRegister.profileClaimed") });
          setIsSubmitting(false);
          setTimeout(() => router.push("/auth/lawyer/login"), 2000);
          return;
        }
        setErrors({ general: t("auth.lawyerRegister.profileExists") });
        setIsSubmitting(false);
        setTimeout(() => router.push(`/claim-profile/${existing[0].id}`), 2000);
        return;
      }

      const mobilePrincipal = formData.mobile.trim()
        ? `+${selectedMobileCountry}${formData.mobile.trim().replace(/^0+/, "")}`
        : "";
      const mobileSecondaire = formData.phone.trim()
        ? `+${selectedCountry}${formData.phone.trim().replace(/^0+/, "")}`
        : "";
      const allMobiles = [mobilePrincipal, mobileSecondaire]
        .filter(Boolean)
        .join(",");

      const result = await signUp(emailNorm, formData.password, {
        gender: frontendToDb(formData.gender),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: undefined,
        mobile: allMobiles || undefined,
        userType: "lawyer" as const,
        location: formData.address.city.trim(),
        is_cour_supreme: !!(formData as any).isCourtSupreme,
        is_assermente:
          primaryProfession === "traducteur"
            ? !!(formData as any).isAssermente
            : false,
        website: formData.website?.trim()
          ? formData.website.startsWith("http")
            ? formData.website.trim()
            : `https://${formData.website.trim()}`
          : undefined,
        bar_number: formData.barNumber.trim(),
        profession: primaryProfession!,
        professions: professions,
        specializations: formData.specializations,
        inscription_year: parseInt(formData.experience) || null,
        experience_years:
          new Date().getFullYear() -
          (parseInt(formData.experience) || new Date().getFullYear()),
        consultation_price: null,
        country_practice: formData.country_practice || "Algérie",
        address: {
          street: formData.address.street.trim(),
          city: formData.address.city.trim(),
          wilaya: formData.address.wilaya?.trim(),
          postalCode: formData.address.postalCode.trim(),
        },
        languages: formData.languages,
      });

      try {
        await fetch("/api/admin/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: `Nouveau ${currentProf?.label} inscrit`,
            title: `Nouveau professionnel sur Mizan`,
            message: `
              <p><strong>Nom :</strong> ${formData.firstName} ${formData.lastName}</p>
              <p><strong>Email :</strong> ${emailNorm}</p>
             <p><strong>Numéro principal :</strong> +${selectedMobileCountry}${formData.mobile.replace(/^0+/, "")}</p>
              ${formData.phone.trim() ? `<p><strong>Numéro secondaire :</strong> +${selectedCountry}${formData.phone.replace(/^0+/, "")}</p>` : ""}
              <p><strong>Pays d'exercice :</strong> ${formData.country_practice}</p>
              <p><strong>Professions :</strong> ${professions.join(", ")}</p>
              <p><strong>${currentProf?.numLabel} :</strong> ${formData.barNumber}</p>
              <p><strong>Ville :</strong> ${formData.address.city}, ${formData.address.wilaya}</p>
              <p><strong>Spécialités :</strong> ${formData.specializations.map((s) => getSpecialiteLabel(s, t)).join(", ")}</p>
              <p><strong>Langues :</strong> ${formData.languages.join(", ")}</p>
              <p><strong>Année d'inscription :</strong> ${formData.experience}</p>
            `,
            priority: "high",
          }),
        });
      } catch {}

      router.push(result.redirectPath || "/lawyer/dashboard");
    } catch (error: any) {
      let msg = t("validation.general.genericError");
      const em = (error?.message || "").toLowerCase();
      if (
        em.includes("already registered") ||
        em.includes("already been registered") ||
        em.includes("already exists") ||
        em.includes("duplicate") ||
        error?.status === 422
      )
        msg = t("validation.general.emailTaken");
      else if (em.includes("bar_number") || em.includes("check constraint"))
        msg = t("validation.general.barNumberInvalid");
      else if (em.includes("network") || em.includes("fetch"))
        msg = t("validation.general.networkError");
      else if (em.includes("database error"))
        msg = t("validation.general.dbError");
      setErrors({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const STEPS = [
    { id: 1, label: t("auth.lawyerRegister.steps.profession") },
    { id: 2, label: t("auth.lawyerRegister.steps.identity") },
    { id: 3, label: t("auth.lawyerRegister.steps.office") },
    { id: 4, label: t("auth.lawyerRegister.steps.expertise") },
    { id: 5, label: t("auth.lawyerRegister.steps.account") },
  ];

  const StepIndicator = () => (
    <div className="flex items-center mb-8">
      {STEPS.map((step, idx) => (
        <div key={step.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${step.id < currentStep ? "bg-teal-600 dark:bg-[#0F6E56] text-white" : step.id === currentStep ? "bg-teal-600 dark:bg-[#0F6E56] text-white ring-4 ring-teal-100 dark:ring-[#6fcf9f]/20" : "bg-slate-100 dark:bg-[#1c1c1e] text-slate-400 dark:text-[#7A7A78]"}`}
            >
              {step.id < currentStep ? (
                <CheckCircle className="w-4 h-4" />
              ) : locale === "ar" ? (
                toArabicNumerals(String(step.id))
              ) : (
                step.id
              )}
            </div>
            <span
              className={`text-xs font-medium whitespace-nowrap ${step.id === currentStep ? "text-teal-600 dark:text-[#6fcf9f]" : "text-slate-400 dark:text-[#7A7A78]"}`}
            >
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 mb-4 transition-all duration-300 ${step.id < currentStep ? "bg-teal-600 dark:bg-[#0F6E56]" : "bg-slate-200 dark:bg-[#1c2220]"}`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const stepMeta: Record<number, { title: string; sub: string }> = {
    1: {
      title: t("auth.lawyerRegister.step0Title"),
      sub: t("auth.lawyerRegister.step0Subtitle"),
    },
    2: {
      title: t("auth.lawyerRegister.stepMeta.identityTitle"),
      sub: t("auth.lawyerRegister.stepMeta.identitySubtitle", {
        profession: currentProf?.label || "",
      }),
    },
    3: {
      title: t("auth.lawyerRegister.stepMeta.officeTitle"),
      sub: t("auth.lawyerRegister.stepMeta.officeSubtitle"),
    },
    4: {
      title:
        primaryProfession === "avocat"
          ? t("auth.lawyerRegister.stepMeta.expertiseTitleAvocat")
          : t("auth.lawyerRegister.stepMeta.expertiseTitleOther"),
      sub: t("auth.lawyerRegister.stepMeta.expertiseSubtitle"),
    },
    5: {
      title: t("auth.lawyerRegister.stepMeta.accountTitle"),
      sub: t("auth.lawyerRegister.stepMeta.accountSubtitle"),
    },
  };

  const renderStep = () => {
    if (currentStep === 0)
      return (
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-[#F5F5F4] mb-2">
            {t("auth.lawyerRegister.countryStepTitle")}
          </h3>
          <p className="text-sm text-slate-500 dark:text-[#A8A8A6] mb-6">
            {t("auth.lawyerRegister.countryStepSubtitle")}
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {[
              {
                value: "Algérie",
                flag: "🇩🇿",
                label: t("auth.lawyerRegister.countryAlgeria"),
              },
              {
                value: "France",
                flag: "🇫🇷",
                label: t("auth.lawyerRegister.countryFrance"),
              },
            ].map((c) => {
              const isSelected = formData.country_practice === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => handleCountrySelect(c.value)}
                  className={`aspect-square p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer relative ${isSelected ? "border-teal-600 dark:border-[#6fcf9f] bg-teal-50 dark:bg-[#6fcf9f]/10" : "border-slate-200 dark:border-[#1c2220] bg-white dark:bg-[#1c1c1e] hover:border-teal-300 dark:hover:border-[#6fcf9f]/50"}`}
                >
                  <span className="text-4xl leading-none">{c.flag}</span>
                  <span
                    className={`text-sm font-semibold text-center ${isSelected ? "text-teal-700 dark:text-[#6fcf9f]" : "text-slate-700 dark:text-[#E8E8E6]"}`}
                  >
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      );

    if (currentStep === 1)
      return (
        <div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {PROFESSIONS.map((p) => {
              const isSelected = professions.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleProfessionSelect(p.id)}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all cursor-pointer relative ${isSelected ? "border-teal-600 dark:border-[#6fcf9f] bg-teal-50 dark:bg-[#6fcf9f]/10" : "border-slate-200 dark:border-[#1c2220] bg-white dark:bg-[#1c1c1e] hover:border-teal-300 dark:hover:border-[#6fcf9f]/50"}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-100 dark:border-[#6fcf9f]/20 flex items-center justify-center">
                    <p.Icon className="w-5 h-5 text-teal-600 dark:text-[#6fcf9f]" />
                  </div>
                  <span
                    className={`text-sm font-semibold text-center leading-tight min-h-[2.5rem] flex items-center justify-center ${isSelected ? "text-teal-700 dark:text-[#6fcf9f]" : "text-slate-700 dark:text-[#E8E8E6]"}`}
                  >
                    {p.label}
                  </span>
                </button>
              );
            })}
          </div>

          {professions[0] === "expert-comptable" && (
            <div className="mt-4 bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-100 dark:border-[#6fcf9f]/20 rounded-xl px-4 py-3 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-teal-600 dark:text-[#6fcf9f] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-teal-700 dark:text-[#6fcf9f]">
                {t("auth.lawyerRegister.expertComptableNote")}
              </p>
            </div>
          )}
        </div>
      );

    if (currentStep === 2)
      return (
        <div className="space-y-4">
          <div>
            <label className={labelCls}>
              {t("auth.lawyerRegister.civilite")} *
            </label>
            <CustomSelect
              options={civiliteOptions}
              value={formData.gender}
              onChange={(v) => setFormData((p) => ({ ...p, gender: v }))}
              placeholder={t("auth.clientRegister.select")}
              className="h-12"
              disabled={isSubmitting}
            />
            {errors.gender && <p className={errCls}>{errors.gender}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                {t("auth.lawyerRegister.firstName")} *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleCap}
                className={inputCls}
                placeholder={t("auth.clientRegister.firstNamePh")}
                disabled={isSubmitting}
              />
              {errors.firstName && <p className={errCls}>{errors.firstName}</p>}
            </div>
            <div>
              <label className={labelCls}>
                {t("auth.lawyerRegister.lastName")} *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleCap}
                className={inputCls}
                placeholder={t("auth.clientRegister.lastNamePh")}
                disabled={isSubmitting}
              />
              {errors.lastName && <p className={errCls}>{errors.lastName}</p>}
            </div>
          </div>
          <div className="relative z-20">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-1">
              <Smartphone className="w-4 h-4" />{" "}
              {t("auth.lawyerRegister.mobileDz")} *
            </label>
            <div className="flex gap-2">
              <CustomSelect
                options={countryOptions}
                value={selectedMobileCountry}
                onChange={setSelectedMobileCountry}
                placeholder={
                  locale === "ar" ? toArabicNumerals("+213") : "+213"
                }
                className="w-24 h-12"
                disabled={isSubmitting}
              />
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) handleInput(e);
                }}
                className={inputCls}
                placeholder={t("auth.lawyerRegister.mobileDzPh")}
                disabled={isSubmitting}
              />
            </div>
            {errors.mobile && <p className={errCls}>{errors.mobile}</p>}
          </div>
          <div className="relative z-10">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-[#E8E8E6] mb-1">
              <Phone className="w-4 h-4" />{" "}
              {t("auth.lawyerRegister.mobileIntl")}{" "}
              <span className="text-slate-400 dark:text-[#7A7A78] font-normal text-xs">
                {t("auth.lawyerRegister.websiteOptional")}
              </span>
            </label>
            <div className="flex gap-2">
              <CustomSelect
                options={countryOptions}
                value={selectedCountry}
                onChange={setSelectedCountry}
                placeholder={locale === "ar" ? toArabicNumerals("+33") : "+33"}
                className="w-24 h-12"
                disabled={isSubmitting}
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) handleInput(e);
                }}
                className={inputCls}
                placeholder={t("auth.lawyerRegister.mobileIntlPh")}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>
              {t("auth.lawyerRegister.languages")} *
            </label>
            <MultiSelectWithCheckboxes
              placeholder={t("auth.lawyerRegister.languagesPh")}
              options={langueOptions}
              value={formData.languages}
              onChange={(v) => setFormData((p) => ({ ...p, languages: v }))}
              className="h-12"
              placeholderClassName="text-slate-400 dark:text-[#7A7A78] font-medium text-sm"
              disabled={isSubmitting}
            />
            {errors.languages && <p className={errCls}>{errors.languages}</p>}
          </div>
        </div>
      );

    if (currentStep === 3)
      return (
        <div className="space-y-4">
          <div>
            <label className={labelCls}>
              {t("auth.lawyerRegister.address")} *
            </label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleAddr}
              className={inputCls}
              placeholder={t("auth.lawyerRegister.addressPh")}
              disabled={isSubmitting}
            />
            {errors.street && <p className={errCls}>{errors.street}</p>}
          </div>
          <div className="relative z-40">
            <label className={labelCls}>
              {isFrance
                ? t("auth.lawyerRegister.region")
                : t("auth.lawyerRegister.wilaya")}{" "}
              *
            </label>
            <CustomSelect
              options={isFrance ? regionOptions : wilayaOptions}
              value={formData.address.wilaya || ""}
              onChange={(v) =>
                setFormData((p) => ({
                  ...p,
                  address: { ...p.address, wilaya: v, city: "" },
                }))
              }
              placeholder={
                isFrance
                  ? t("auth.lawyerRegister.regionPh")
                  : t("auth.lawyerRegister.wilayaPh")
              }
              className="h-12"
              disabled={isSubmitting}
            />
            {errors.wilaya && <p className={errCls}>{errors.wilaya}</p>}
          </div>
          <div className="relative z-30">
            <label className={labelCls}>
              {isFrance
                ? t("auth.lawyerRegister.ville")
                : t("auth.lawyerRegister.commune")}{" "}
              *
            </label>
            <CustomSelect
              options={communeOptions}
              value={formData.address.city || ""}
              onChange={(v) =>
                setFormData((p) => ({
                  ...p,
                  address: { ...p.address, city: v },
                }))
              }
              placeholder={
                formData.address.wilaya
                  ? isFrance
                    ? t("auth.lawyerRegister.villePh")
                    : t("auth.lawyerRegister.communePh")
                  : t("auth.lawyerRegister.communePhDisabled")
              }
              className="h-12"
              disabled={isSubmitting || !formData.address.wilaya}
            />
            {errors.city && <p className={errCls}>{errors.city}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={
                primaryProfession === "traducteur" &&
                !(formData as any).isAssermente
                  ? "col-span-2"
                  : ""
              }
            >
              <label className={labelCls}>
                {t("auth.lawyerRegister.postalCode")} *
              </label>
              <input
                type="text"
                name="address.postalCode"
                value={formData.address.postalCode}
                onChange={(e) => {
                  if (
                    /^\d*$/.test(e.target.value) &&
                    e.target.value.length <= 5
                  )
                    handleAddr(e);
                }}
                className={inputCls}
                placeholder={
                  locale === "ar"
                    ? toArabicNumerals(isFrance ? "75001" : "16000")
                    : isFrance
                      ? "75001"
                      : "16000"
                }
                maxLength={5}
                disabled={isSubmitting}
              />
              {errors.postalCode && (
                <p className={errCls}>{errors.postalCode}</p>
              )}
            </div>
            {!(
              primaryProfession === "traducteur" &&
              !(formData as any).isAssermente
            ) && (
              <div>
                <label className={labelCls}>
                  {currentProf?.numLabel}
                  {!isFrance && " *"}
                </label>
                <input
                  type="text"
                  name="barNumber"
                  value={formData.barNumber}
                  onChange={handleInput}
                  className={inputCls}
                  placeholder={
                    isFrance
                      ? t("auth.lawyerRegister.numPlaceholderFrance")
                      : currentProf?.numPlaceholder
                  }
                  disabled={isSubmitting}
                />
                {errors.barNumber && (
                  <p className={errCls}>{errors.barNumber}</p>
                )}
              </div>
            )}
          </div>
          {primaryProfession === "avocat" && (
            <div className="flex items-start gap-3 p-4 border border-amber-200 dark:border-[#5A4A2A] bg-amber-50 dark:bg-[#3D2E1F] rounded-xl">
              <input
                type="checkbox"
                id="cour_supreme"
                checked={(formData as any).isCourtSupreme || false}
                onChange={(e) =>
                  setFormData(
                    (p) => ({ ...p, isCourtSupreme: e.target.checked }) as any
                  )
                }
                disabled={isSubmitting}
                className="w-4 h-4 accent-amber-600 mt-0.5 flex-shrink-0 cursor-pointer"
              />
              <label
                htmlFor="cour_supreme"
                className="text-sm text-amber-800 dark:text-[#E0B568] cursor-pointer"
              >
                <span className="font-semibold">
                  {t("auth.lawyerRegister.courSupremeLabel")}
                </span>
                <p className="text-xs text-amber-600 dark:text-[#E0B568]/80 mt-0.5 font-normal">
                  {t("auth.lawyerRegister.courSupremeNote")}
                </p>
              </label>
            </div>
          )}
          {primaryProfession === "traducteur" && (
            <div className="flex items-start gap-3 p-4 border border-amber-200 dark:border-[#5A4A2A] bg-amber-50 dark:bg-[#3D2E1F] rounded-xl">
              <input
                type="checkbox"
                id="assermente"
                checked={(formData as any).isAssermente || false}
                onChange={(e) =>
                  setFormData(
                    (p) => ({ ...p, isAssermente: e.target.checked }) as any
                  )
                }
                disabled={isSubmitting}
                className="w-4 h-4 accent-amber-600 mt-0.5 flex-shrink-0 cursor-pointer"
              />
              <label
                htmlFor="assermente"
                className="text-sm text-amber-800 dark:text-[#E0B568] cursor-pointer"
              >
                <span className="font-semibold">
                  {t("auth.lawyerRegister.assermenteLabel")}
                </span>
                <p className="text-xs text-amber-600 dark:text-[#E0B568]/80 mt-0.5 font-normal">
                  {t("auth.lawyerRegister.assermenteNote")}
                </p>
              </label>
            </div>
          )}
          <div>
            <label className={labelCls}>
              {t("auth.lawyerRegister.website")}{" "}
              <span className="text-slate-400 dark:text-[#7A7A78] font-normal text-xs">
                {t("auth.lawyerRegister.websiteOptional")}
              </span>
            </label>
            <input
              type="text"
              name="website"
              value={formData.website || ""}
              onChange={(e) =>
                setFormData((p) => ({ ...p, website: e.target.value }))
              }
              className={inputCls}
              placeholder={t("auth.lawyerRegister.websitePh")}
              disabled={isSubmitting}
            />
            <p className="text-xs text-slate-400 dark:text-[#7A7A78] mt-1">
              {t("auth.lawyerRegister.websiteNote")}
            </p>
          </div>
        </div>
      );

    if (currentStep === 4)
      return (
        <div className="space-y-4">
          <div>
            <label className={labelCls}>
              {primaryProfession === "avocat"
                ? t("auth.lawyerRegister.specialitiesAvocat")
                : t("auth.lawyerRegister.specialitiesOther")}{" "}
              *
            </label>
            <MultiSelectWithCheckboxes
              placeholder={
                primaryProfession === "avocat"
                  ? t("auth.lawyerRegister.specialitiesPhAvocat")
                  : t("auth.lawyerRegister.specialitiesPhOther")
              }
              options={domaineOptions}
              value={formData.specializations}
              onChange={(v) =>
                setFormData((p) => ({ ...p, specializations: v }))
              }
              className="h-12"
              placeholderClassName="text-slate-400 dark:text-[#7A7A78] font-medium text-sm"
              disabled={isSubmitting}
              showSelectAll
            />
            {errors.specializations && (
              <p className={errCls}>{errors.specializations}</p>
            )}
          </div>
          <div>
            <label className={labelCls}>
              {t(
                `auth.lawyerRegister.inscriptionYearLabels.${PROF_KEY[primaryProfession || "avocat"]}`
              )}{" "}
              *
            </label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value) && e.target.value.length <= 4)
                  handleInput(e);
              }}
              className={inputCls}
              placeholder={t("auth.lawyerRegister.inscriptionYearPlaceholder")}
              maxLength={4}
              disabled={isSubmitting}
            />
            {errors.experience && <p className={errCls}>{errors.experience}</p>}
          </div>
        </div>
      );

    if (currentStep === 5)
      return (
        <div className="space-y-4">
          <div>
            <label className={labelCls}>
              {t("auth.lawyerRegister.email")} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInput}
              className={inputCls}
              placeholder={t("auth.lawyerRegister.emailPh")}
              disabled={isSubmitting}
            />
            {errors.email && <p className={errCls}>{errors.email}</p>}
          </div>
          <div>
            <label className={labelCls}>
              {t("auth.lawyerRegister.password")} *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInput}
                className={`${inputCls} pe-12`}
                placeholder={t("auth.lawyerRegister.passwordPh")}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#7A7A78] hover:text-slate-600 dark:hover:text-[#E8E8E6]"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && <p className={errCls}>{errors.password}</p>}
          </div>
          <div>
            <label className={labelCls}>
              {t("auth.lawyerRegister.confirmPassword")} *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInput}
                className={`${inputCls} pe-12`}
                placeholder={t("auth.lawyerRegister.confirmPasswordPh")}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="cursor-pointer absolute end-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#7A7A78] hover:text-slate-600 dark:hover:text-[#E8E8E6]"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className={errCls}>{errors.confirmPassword}</p>
            )}
          </div>
          <div className="bg-slate-50 dark:bg-[#1c1c1e] rounded-xl p-4 text-xs text-slate-500 dark:text-[#A8A8A6] leading-relaxed">
            {t.rich("auth.lawyerRegister.termsNote", {
              cgu: (chunks) => (
                <Link
                  href="/cgu"
                  className="text-teal-600 dark:text-[#6fcf9f] hover:underline"
                >
                  {chunks}
                </Link>
              ),
              privacy: (chunks) => (
                <Link
                  href="/privacy"
                  className="text-teal-600 dark:text-[#6fcf9f] hover:underline"
                >
                  {chunks}
                </Link>
              ),
            })}
          </div>
        </div>
      );
    return null;
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-100 via-white to-teal-100 dark:bg-none">
      <div className="max-w-md mx-auto px-4 py-24" ref={containerRef}>
        <div className="text-center mb-8">
          <h1 className="page-title text-2xl font-bold text-slate-800 dark:text-[#F5F5F4] mb-2">
            {professions.length > 0
              ? t("auth.lawyerRegister.registerTitle", {
                  profession: currentProf?.label || "",
                })
              : t("auth.lawyerRegister.joinTitle")}
          </h1>
          <p className="page-subtitle text-slate-600 dark:text-[#E8E8E6]">
            {professions.length > 0
              ? t("auth.lawyerRegister.registerSubtitle")
              : t("auth.lawyerRegister.joinSubtitle")}
          </p>
        </div>

        <div className="register-form bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-lg dark:shadow-none p-6 border border-slate-100 dark:border-[#1c2220]">
          {currentStep > 0 && <StepIndicator />}
          {currentStep > 0 && (
            <div className="mb-6">
              <span className="text-xs font-semibold text-teal-600 dark:text-[#6fcf9f] uppercase tracking-wide">
                {t("auth.lawyerRegister.stepOf", {
                  step:
                    locale === "ar"
                      ? toArabicNumerals(String(currentStep))
                      : currentStep,
                })}
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F5F4]">
                {stepMeta[currentStep]?.title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-[#A8A8A6]">
                {stepMeta[currentStep]?.sub}
              </p>
            </div>
          )}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-[#3D1F1F] border border-red-200 dark:border-[#5A2A2A] rounded-lg">
              <p className="text-red-600 dark:text-[#E08585] text-sm">
                {errors.general}
              </p>
            </div>
          )}
          {renderStep()}
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={handleBack}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 dark:border-[#1c2220] text-slate-600 dark:text-[#E8E8E6] hover:bg-slate-50 dark:hover:bg-[#1c2220] transition-all cursor-pointer ${currentStep === 0 ? "invisible pointer-events-none" : ""}`}
            >
              <ChevronLeft className="w-4 h-4" />{" "}
              {t("auth.lawyerRegister.back")}
            </button>
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={
                  (currentStep === 0 && !formData.country_practice) ||
                  (currentStep === 1 && professions.length === 0)
                }
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-semibold bg-teal-600 hover:bg-teal-700 dark:bg-[#0F6E56] dark:hover:bg-[#085041] disabled:opacity-40 text-white transition-all cursor-pointer"
              >
                {t("auth.lawyerRegister.continue")}{" "}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-semibold bg-teal-600 hover:bg-teal-700 dark:bg-[#0F6E56] dark:hover:bg-[#085041] disabled:opacity-60 text-white transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />{" "}
                    {t("auth.lawyerRegister.submitting")}
                  </>
                ) : (
                  <>
                    {t("auth.lawyerRegister.submit")}{" "}
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        <div className="text-center mt-4">
          <span className="text-sm text-slate-600 dark:text-[#E8E8E6]">
            {t("auth.lawyerRegister.hasAccount")}{" "}
          </span>
          <Link
            href="/auth/lawyer/login"
            className="text-sm text-teal-600 dark:text-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#6fcf9f] font-medium"
          >
            {t("auth.lawyerRegister.login")}
          </Link>
        </div>
      </div>
    </div>
  );
}
