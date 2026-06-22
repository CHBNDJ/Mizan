"use client";
import { useState, useEffect } from "react";
import {
  MessageSquare,
  Phone,
  Video,
  Mail,
  Save,
  CheckCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const CANAL_TYPES = [
  { type: "message", icon: MessageSquare, duration: null },
  { type: "phone", icon: Phone, duration: "30 min" },
  { type: "video_30", icon: Video, duration: "30 min" },
  { type: "video_60", icon: Video, duration: "1h" },
  { type: "email", icon: Mail, duration: null },
];

interface Props {
  profession?: string;
}

export default function PricingManager({ profession }: Props) {
  const supabase = createClient();
  const { user } = useAuth();
  const t = useTranslations("pricingManager");
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [ids, setIds] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const CANAUX = CANAL_TYPES.map((c) => ({
    ...c,
    label: t(`canaux.${c.type}.label`),
    desc: t(`canaux.${c.type}.desc`),
  }));

  const activeProfession =
    profession ||
    (typeof window !== "undefined"
      ? localStorage.getItem("activeProfession") || "default"
      : "default");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("consultation_pricing")
      .select("*")
      .eq("lawyer_id", user.id)
      .eq("profession", activeProfession)
      .then(({ data }) => {
        const p: Record<string, string> = {};
        const i: Record<string, string> = {};
        CANAL_TYPES.forEach((c) => {
          const row = data?.find((d) => d.type === c.type);
          p[c.type] = row?.base_price?.toString() || "";
          if (row?.id) i[c.type] = row.id;
        });
        setPrices(p);
        setIds(i);
        setLoading(false);
      });
  }, [user, activeProfession]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      for (const c of CANAUX) {
        const payload = {
          lawyer_id: user.id,
          type: c.type,
          label: c.label,
          duration: c.duration,
          base_price: prices[c.type] ? parseInt(prices[c.type]) : null,
          is_active: true,
          profession: activeProfession,
        };
        if (ids[c.type]) {
          await supabase
            .from("consultation_pricing")
            .update(payload)
            .eq("id", ids[c.type]);
        } else {
          const { data } = await supabase
            .from("consultation_pricing")
            .insert(payload)
            .select("id")
            .single();
          if (data) setIds((prev) => ({ ...prev, [c.type]: data.id }));
        }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-600 border-t-transparent" />
      </div>
    );

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 mb-4">
        {t("intro", {
          profession:
            activeProfession === "expert-comptable"
              ? "Expert Comptable"
              : activeProfession === "comptable"
                ? "Comptable"
                : activeProfession,
        })}
      </p>
      {CANAUX.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.type}
            className="flex items-center gap-4 p-4 bg-teal-50 border border-teal-100 rounded-xl"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-800">
                  {c.label}
                </p>
                {c.duration && (
                  <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                    {c.duration}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{c.desc}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <input
                type="number"
                value={prices[c.type] || ""}
                onChange={(e) =>
                  setPrices((p) => ({ ...p, [c.type]: e.target.value }))
                }
                placeholder={t("pricePh")}
                className="w-32 h-9 px-3 text-sm border border-teal-200 rounded-lg bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-end text-slate-800 placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-xs text-slate-600 font-medium">
                {t("currency")}
              </span>
            </div>
          </div>
        );
      })}
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold cursor-pointer transition-all"
      >
        {saved ? (
          <>
            <CheckCircle className="w-4 h-4" />
            {t("saved")}
          </>
        ) : saving ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            {t("saving")}
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            {t("save")}
          </>
        )}
      </button>
    </div>
  );
}
