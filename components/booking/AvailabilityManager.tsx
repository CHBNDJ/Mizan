"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Trash2, Save, CheckCircle } from "lucide-react";

const DAYS = [
  { label: "Lundi", dow: 1 },
  { label: "Mardi", dow: 2 },
  { label: "Mercredi", dow: 3 },
  { label: "Jeudi", dow: 4 },
  { label: "Vendredi", dow: 5 },
  { label: "Samedi", dow: 6 },
  { label: "Dimanche", dow: 0 },
];

interface Range {
  start: string;
  end: string;
}

export default function AvailabilityManager() {
  const supabase = createClient();
  const { user } = useAuth();

  const [dayEnabled, setDayEnabled] = useState<Record<number, boolean>>({
    0: false,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: false,
  });
  const [ranges, setRanges] = useState<Range[]>([
    { start: "09:00", end: "12:00" },
    { start: "14:00", end: "17:00" },
  ]);
  const [duration, setDuration] = useState<30 | 45 | 60>(30);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadAvailability();
  }, [user]);

  const loadAvailability = async () => {
    const { data } = await supabase
      .from("availability_slots")
      .select("*")
      .eq("lawyer_id", user!.id)
      .eq("is_active", true)
      .order("day_of_week");

    if (data && data.length > 0) {
      setDuration((data[0].duration_min as 30 | 45 | 60) || 30);
      const enabled: Record<number, boolean> = {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      };
      data.forEach((s: any) => {
        enabled[s.day_of_week] = true;
      });
      setDayEnabled(enabled);

      const firstDow = data[0].day_of_week;
      const firstDaySlots = data.filter((s: any) => s.day_of_week === firstDow);
      setRanges(
        firstDaySlots.map((s: any) => ({
          start: s.start_time.slice(0, 5),
          end: s.end_time.slice(0, 5),
        }))
      );
    }
    setLoading(false);
  };

  const toggleDay = (dow: number) => {
    setDayEnabled((prev) => ({ ...prev, [dow]: !prev[dow] }));
  };

  const updateRange = (idx: number, field: "start" | "end", val: string) => {
    setRanges((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const addRange = () => {
    if (ranges.length >= 4) return;
    setRanges((prev) => [...prev, { start: "08:00", end: "10:00" }]);
  };

  const removeRange = (idx: number) => {
    if (ranges.length <= 1) return;
    setRanges((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("availability_slots").delete().eq("lawyer_id", user.id);

    const toInsert: any[] = [];
    DAYS.forEach(({ dow }) => {
      if (!dayEnabled[dow]) return;
      ranges.forEach((r) => {
        if (r.start && r.end && r.start < r.end) {
          toInsert.push({
            lawyer_id: user.id,
            day_of_week: dow,
            start_time: r.start,
            end_time: r.end,
            duration_min: duration,
            is_active: true,
          });
        }
      });
    });

    if (toInsert.length > 0) {
      await supabase.from("availability_slots").insert(toInsert);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const activeDays = DAYS.filter((d) => dayEnabled[d.dow]);
  const totalSlots = activeDays.length;

  if (loading)
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-600 dark:border-[#6fcf9f] border-t-transparent" />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Jours */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 dark:text-[#7A7A78] uppercase tracking-widest mb-3">
          Jours actifs
        </p>
        <div className="divide-y divide-slate-100 dark:divide-[#1c2220] border border-slate-200 dark:border-[#1c2220] rounded-xl overflow-hidden">
          {DAYS.map(({ label, dow }) => (
            <div
              key={dow}
              className={`flex items-center justify-between px-4 py-3 transition-colors ${
                dayEnabled[dow]
                  ? "bg-white dark:bg-[#1c1c1e]"
                  : "bg-slate-50 dark:bg-[#141415]"
              }`}
            >
              <span
                className={`text-sm font-medium transition-colors ${
                  dayEnabled[dow]
                    ? "text-slate-800 dark:text-[#F5F5F4]"
                    : "text-slate-400 dark:text-[#3a3a3d]"
                }`}
              >
                {label}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dayEnabled[dow]}
                  onChange={() => toggleDay(dow)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 rounded-full bg-slate-200 dark:bg-[#3a3a3d] peer-checked:bg-teal-600 dark:peer-checked:bg-[#0F6E56] transition-colors after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </div>
        {totalSlots > 0 && (
          <p className="text-xs text-teal-600 dark:text-[#6fcf9f] mt-2">
            {activeDays.map((d) => d.label.slice(0, 3)).join(", ")}
          </p>
        )}
      </div>

      {/* Plages horaires */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 dark:text-[#7A7A78] uppercase tracking-widest mb-3">
          Plages horaires
        </p>
        <div className="space-y-2">
          {ranges.map((range, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-xl px-3 py-2.5"
            >
              <div className="flex-1 grid grid-cols-2 gap-2 items-center">
                <div>
                  <label className="block text-[10px] text-slate-400 dark:text-[#7A7A78] mb-1">
                    Début
                  </label>
                  <input
                    type="time"
                    value={range.start}
                    onChange={(e) => updateRange(idx, "start", e.target.value)}
                    className="w-full h-9 px-2.5 text-sm border border-slate-200 dark:border-[#3a3a3d] rounded-lg bg-slate-50 dark:bg-[#141415] text-slate-800 dark:text-[#F5F5F4] focus:border-teal-500 dark:focus:border-[#6fcf9f] focus:ring-1 focus:ring-teal-500/20 dark:focus:ring-[#6fcf9f]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 dark:text-[#7A7A78] mb-1">
                    Fin
                  </label>
                  <input
                    type="time"
                    value={range.end}
                    onChange={(e) => updateRange(idx, "end", e.target.value)}
                    className="w-full h-9 px-2.5 text-sm border border-slate-200 dark:border-[#3a3a3d] rounded-lg bg-slate-50 dark:bg-[#141415] text-slate-800 dark:text-[#F5F5F4] focus:border-teal-500 dark:focus:border-[#6fcf9f] focus:ring-1 focus:ring-teal-500/20 dark:focus:ring-[#6fcf9f]/20 outline-none transition-all"
                  />
                </div>
              </div>
              {ranges.length > 1 && (
                <button
                  onClick={() => removeRange(idx)}
                  className="mt-4 p-1.5 text-slate-300 dark:text-[#3a3a3d] hover:text-red-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg cursor-pointer transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
          {ranges.length < 4 && (
            <button
              onClick={addRange}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-dashed border-slate-200 dark:border-[#1c2220] rounded-xl text-xs text-slate-400 dark:text-[#7A7A78] hover:border-teal-400 dark:hover:border-[#6fcf9f]/40 hover:text-teal-600 dark:hover:text-[#6fcf9f] hover:bg-teal-50 dark:hover:bg-[#6fcf9f]/5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter une plage
            </button>
          )}
        </div>
      </div>

      {/* Durée */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 dark:text-[#7A7A78] uppercase tracking-widest mb-3">
          Durée des créneaux
        </p>
        <div className="flex gap-2">
          {([30, 45, 60] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border-2 ${
                duration === d
                  ? "border-teal-600 dark:border-[#6fcf9f] bg-teal-50 dark:bg-[#6fcf9f]/10 text-teal-700 dark:text-[#6fcf9f]"
                  : "border-slate-200 dark:border-[#1c2220] bg-white dark:bg-[#1c1c1e] text-slate-400 dark:text-[#7A7A78] hover:border-slate-300 dark:hover:border-[#3a3a3d]"
              }`}
            >
              {d === 30 ? "30 min" : d === 45 ? "45 min" : "1h"}
            </button>
          ))}
        </div>
      </div>

      {/* Résumé */}
      {totalSlots > 0 && ranges.length > 0 && (
        <div className="bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-100 dark:border-[#6fcf9f]/20 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-teal-700 dark:text-[#6fcf9f] mb-1">
            Récapitulatif
          </p>
          <p className="text-xs text-teal-600 dark:text-[#6fcf9f]/80">
            {activeDays.map((d) => d.label).join(", ")}
          </p>
          <p className="text-xs text-teal-600 dark:text-[#6fcf9f]/80 mt-0.5">
            {ranges
              .filter((r) => r.start && r.end && r.start < r.end)
              .map((r) => `${r.start} – ${r.end}`)
              .join(" · ")}{" "}
            · créneaux de {duration} min
          </p>
        </div>
      )}

      {totalSlots === 0 && (
        <p className="text-xs text-amber-600 dark:text-[#E0B568] bg-amber-50 dark:bg-[#3D2E1F] border border-amber-200 dark:border-[#5A4A2A] rounded-xl px-4 py-3">
          Activez au moins un jour pour configurer votre calendrier.
        </p>
      )}

      {/* Bouton */}
      <button
        onClick={handleSave}
        disabled={saving || totalSlots === 0 || ranges.length === 0}
        className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 dark:bg-[#0F6E56] hover:bg-teal-700 dark:hover:bg-[#085041] disabled:opacity-40 text-white font-semibold text-sm rounded-xl cursor-pointer transition-all"
      >
        {saving ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        ) : saved ? (
          <>
            <CheckCircle className="w-4 h-4" /> Enregistré
          </>
        ) : (
          <>
            <Save className="w-4 h-4" /> Enregistrer mes disponibilités
          </>
        )}
      </button>
    </div>
  );
}
