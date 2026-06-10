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
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const CANAUX = [
  {
    type: "message",
    icon: MessageSquare,
    label: "Message écrit",
    desc: "Réponse par messagerie sous 24-48h",
    duration: null,
  },
  {
    type: "phone",
    icon: Phone,
    label: "Téléphonique",
    desc: "Appel vocal — 30 min",
    duration: "30 min",
  },
  {
    type: "video_30",
    icon: Video,
    label: "Vidéo 30 min",
    desc: "Consultation vidéo",
    duration: "30 min",
  },
  {
    type: "video_60",
    icon: Video,
    label: "Vidéo 1h",
    desc: "Consultation vidéo",
    duration: "1h",
  },
  {
    type: "email",
    icon: Mail,
    label: "Email",
    desc: "Échange email sécurisé sous 48h",
    duration: null,
  },
];

export default function PricingManager() {
  const supabase = createClient();
  const { user } = useAuth();
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [ids, setIds] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("consultation_pricing")
      .select("*")
      .eq("lawyer_id", user.id)
      .then(({ data }) => {
        const p: Record<string, string> = {};
        const i: Record<string, string> = {};
        CANAUX.forEach((c) => {
          const row = data?.find((d) => d.type === c.type);
          p[c.type] = row?.base_price?.toString() || "";
          if (row?.id) i[c.type] = row.id;
        });
        setPrices(p);
        setIds(i);
        setLoading(false);
      });
  }, [user]);

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
        Indiquez votre tarif indicatif en DA pour chaque canal. Laissez vide
        pour afficher "Tarif sur demande". Tous les canaux sont visibles par les
        clients — vous fixez uniquement le prix.
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
                placeholder="Sur demande"
                className="w-32 h-9 px-3 text-sm border border-slate-200 rounded-lg bg-white focus:border-teal-400 outline-none text-right"
              />
              <span className="text-xs text-slate-400">DA</span>
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
            Enregistré
          </>
        ) : saving ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            Sauvegarde...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Enregistrer les tarifs
          </>
        )}
      </button>
    </div>
  );
}
