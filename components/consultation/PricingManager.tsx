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
    desc: "Appel vocal",
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

interface PricingRow {
  id?: string;
  type: string;
  base_price: string;
  is_active: boolean;
}

export default function PricingManager() {
  const supabase = createClient();
  const { user } = useAuth();
  const [rows, setRows] = useState<Record<string, PricingRow>>({});
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
        const map: Record<string, PricingRow> = {};
        CANAUX.forEach((c) => {
          const existing = data?.find((d) => d.type === c.type);
          map[c.type] = {
            id: existing?.id,
            type: c.type,
            base_price: existing?.base_price?.toString() || "",
            is_active: existing?.is_active ?? false,
          };
        });
        setRows(map);
        setLoading(false);
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      for (const c of CANAUX) {
        const row = rows[c.type];
        if (!row) continue;
        const payload = {
          lawyer_id: user.id,
          type: c.type,
          label: c.label,
          duration: c.duration,
          base_price: row.base_price ? parseInt(row.base_price) : null,
          is_active: row.is_active,
        };
        if (row.id) {
          await supabase
            .from("consultation_pricing")
            .update(payload)
            .eq("id", row.id);
        } else if (row.is_active) {
          const { data } = await supabase
            .from("consultation_pricing")
            .insert(payload)
            .select("id")
            .single();
          if (data)
            setRows((p) => ({ ...p, [c.type]: { ...p[c.type], id: data.id } }));
        }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const toggle = (type: string) =>
    setRows((p) => ({
      ...p,
      [type]: { ...p[type], is_active: !p[type].is_active },
    }));

  const setPrice = (type: string, val: string) =>
    setRows((p) => ({ ...p, [type]: { ...p[type], base_price: val } }));

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-600 border-t-transparent" />
      </div>
    );

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 mb-4">
        Activez les canaux que vous proposez et indiquez un tarif indicatif en
        DA. Le client verra "à partir de X DA" sur votre profil. Laissez le
        tarif vide pour afficher "Tarif sur demande".
      </p>

      {CANAUX.map((c) => {
        const row = rows[c.type];
        const Icon = c.icon;
        return (
          <div
            key={c.type}
            className={`border rounded-xl p-4 transition-all ${row?.is_active ? "bg-teal-50 border-teal-100" : "bg-white border-slate-200"}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${row?.is_active ? "bg-teal-600" : "bg-slate-100"}`}
              >
                <Icon
                  className={`w-4 h-4 ${row?.is_active ? "text-white" : "text-slate-400"}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-800">
                    {c.label}
                  </p>
                  {c.duration && (
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {c.duration}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{c.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={row?.is_active || false}
                  onChange={() => toggle(c.type)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 peer-checked:bg-teal-600 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>
            {row?.is_active && (
              <div className="mt-3 flex items-center gap-2">
                <label className="text-xs font-medium text-slate-600 whitespace-nowrap">
                  Tarif indicatif (DA)
                </label>
                <input
                  type="number"
                  value={row.base_price}
                  onChange={(e) => setPrice(c.type, e.target.value)}
                  placeholder="ex: 3000"
                  className="flex-1 h-9 px-3 text-sm border border-slate-200 rounded-lg bg-white focus:border-teal-400 outline-none transition-all"
                />
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  laisser vide = sur demande
                </span>
              </div>
            )}
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
            Enregistrer
          </>
        )}
      </button>
    </div>
  );
}
