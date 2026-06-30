"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, X, Save, CheckCircle } from "lucide-react";

const JOURS = [
  { short: "Lu", label: "Lundi", dow: 1 },
  { short: "Ma", label: "Mardi", dow: 2 },
  { short: "Me", label: "Mercredi", dow: 3 },
  { short: "Je", label: "Jeudi", dow: 4 },
  { short: "Ve", label: "Vendredi", dow: 5 },
  { short: "Sa", label: "Samedi", dow: 6 },
  { short: "Di", label: "Dimanche", dow: 0 },
];

interface Plage {
  start: string;
  end: string;
}

function timeToMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export default function AvailabilityManager() {
  const supabase = createClient();
  const { user } = useAuth();

  const [selected, setSelected] = useState<number>(1);
  const [duration, setDuration] = useState<30 | 60>(30);
  const [slots, setSlots] = useState<Record<number, Plage[]>>({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  });
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
      setDuration((data[0].duration_min as 30 | 60) || 30);
      const newSlots: Record<number, Plage[]> = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
      };
      data.forEach((s: any) => {
        newSlots[s.day_of_week].push({
          start: s.start_time.slice(0, 5),
          end: s.end_time.slice(0, 5),
        });
      });
      setSlots(newSlots);
      const firstWithSlots = data[0].day_of_week;
      setSelected(firstWithSlots);
    }
    setLoading(false);
  };

  const addSlot = () => {
    setSlots((prev) => ({
      ...prev,
      [selected]: [...(prev[selected] || []), { start: "09:00", end: "12:00" }],
    }));
  };

  const updateSlot = (idx: number, field: "start" | "end", val: string) => {
    setSlots((prev) => {
      const next = [...(prev[selected] || [])];
      next[idx] = { ...next[idx], [field]: val };
      return { ...prev, [selected]: next };
    });
  };

  const removeSlot = (idx: number) => {
    setSlots((prev) => ({
      ...prev,
      [selected]: (prev[selected] || []).filter((_, i) => i !== idx),
    }));
  };

  const clearDay = () => setSlots((prev) => ({ ...prev, [selected]: [] }));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("availability_slots").delete().eq("lawyer_id", user.id);

    const toInsert: any[] = [];
    JOURS.forEach(({ dow }) => {
      (slots[dow] || []).forEach((p) => {
        if (p.start && p.end && p.start < p.end) {
          toInsert.push({
            lawyer_id: user.id,
            day_of_week: dow,
            start_time: p.start,
            end_time: p.end,
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

  const activeJours = JOURS.filter((j) => (slots[j.dow] || []).length > 0);
  const totalSlots = activeJours.reduce((acc, j) => {
    return (
      acc +
      (slots[j.dow] || [])
        .filter((p) => p.start && p.end && p.start < p.end)
        .reduce(
          (a, p) =>
            a + Math.floor((timeToMin(p.end) - timeToMin(p.start)) / duration),
          0
        )
    );
  }, 0);
  const totalH = Math.floor((totalSlots * duration) / 60);
  const currentSlots = slots[selected] || [];

  if (loading)
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-600 dark:border-[#6fcf9f] border-t-transparent" />
      </div>
    );

  return (
    <div className="space-y-4">
      {/* Header durée */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 dark:text-[#A8A8A6]">
          Cliquez sur un jour pour configurer ses horaires
        </p>
        <div className="flex border border-slate-200 dark:border-[#1c2220] rounded-lg overflow-hidden">
          {([30, 60] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                duration === d
                  ? "bg-teal-600 dark:bg-[#0F6E56] text-white"
                  : "bg-white dark:bg-[#1c1c1e] text-slate-500 dark:text-[#A8A8A6] hover:bg-slate-50 dark:hover:bg-[#1c2220]"
              }`}
            >
              {d === 30 ? "30 min" : "1h"}
            </button>
          ))}
        </div>
      </div>

      {/* Grille jours */}
      <div className="grid grid-cols-7 gap-1.5">
        {JOURS.map(({ short, label, dow }) => {
          const hasSlots = (slots[dow] || []).length > 0;
          const isSelected = selected === dow;
          return (
            <button
              key={dow}
              onClick={() => setSelected(dow)}
              title={label}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? "border-teal-600 dark:border-[#6fcf9f] bg-teal-50 dark:bg-[#6fcf9f]/10"
                  : "border-slate-200 dark:border-[#1c2220] bg-white dark:bg-[#1c1c1e] hover:border-teal-300 dark:hover:border-[#6fcf9f]/30"
              }`}
            >
              <span
                className={`text-[11px] font-bold ${
                  isSelected
                    ? "text-teal-700 dark:text-[#6fcf9f]"
                    : "text-slate-600 dark:text-[#E8E8E6]"
                }`}
              >
                {short}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  hasSlots
                    ? "bg-teal-500 dark:bg-[#6fcf9f]"
                    : "bg-slate-200 dark:bg-[#3a3a3d]"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Panel jour sélectionné */}
      <div className="border border-slate-200 dark:border-[#1c2220] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-[#141415] border-b border-slate-200 dark:border-[#1c2220]">
          <span className="text-sm font-semibold text-slate-800 dark:text-[#F5F5F4]">
            {JOURS.find((j) => j.dow === selected)?.label}
          </span>
          <div className="flex items-center gap-3">
            {currentSlots.length > 0 && (
              <button
                onClick={clearDay}
                className="text-xs text-slate-400 dark:text-[#7A7A78] hover:text-red-400 dark:hover:text-red-400 cursor-pointer transition-colors"
              >
                Effacer
              </button>
            )}
            <span className="text-xs text-slate-400 dark:text-[#7A7A78]">
              {currentSlots.length === 0
                ? "Aucune plage"
                : `${currentSlots.length} plage${currentSlots.length > 1 ? "s" : ""}`}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-2 bg-white dark:bg-[#1c1c1e]">
          {currentSlots.length === 0 ? (
            <p className="text-center text-sm text-slate-400 dark:text-[#7A7A78] py-4">
              Pas de consultation ce jour —{" "}
              <button
                onClick={addSlot}
                className="text-teal-600 dark:text-[#6fcf9f] font-medium cursor-pointer hover:underline"
              >
                ajouter une plage
              </button>
            </p>
          ) : (
            currentSlots.map((slot, idx) => (
              <div
                key={idx}
                className="grid items-center gap-2"
                style={{ gridTemplateColumns: "1fr 20px 1fr 28px" }}
              >
                <input
                  type="time"
                  value={slot.start}
                  onChange={(e) => updateSlot(idx, "start", e.target.value)}
                  className="h-9 px-2.5 text-sm border border-slate-200 dark:border-[#3a3a3d] rounded-lg bg-slate-50 dark:bg-[#141415] text-slate-800 dark:text-[#F5F5F4] focus:border-teal-500 dark:focus:border-[#6fcf9f] focus:ring-1 focus:ring-teal-500/20 outline-none transition-all w-full"
                />
                <span className="text-xs text-slate-400 dark:text-[#7A7A78] text-center">
                  →
                </span>
                <input
                  type="time"
                  value={slot.end}
                  onChange={(e) => updateSlot(idx, "end", e.target.value)}
                  className="h-9 px-2.5 text-sm border border-slate-200 dark:border-[#3a3a3d] rounded-lg bg-slate-50 dark:bg-[#141415] text-slate-800 dark:text-[#F5F5F4] focus:border-teal-500 dark:focus:border-[#6fcf9f] focus:ring-1 focus:ring-teal-500/20 outline-none transition-all w-full"
                />
                <button
                  onClick={() => removeSlot(idx)}
                  disabled={currentSlots.length <= 1}
                  className="w-7 h-7 flex items-center justify-center text-slate-300 dark:text-[#3a3a3d] hover:text-red-400 dark:hover:text-red-400 disabled:opacity-30 cursor-pointer transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
          {currentSlots.length > 0 && currentSlots.length < 3 && (
            <button
              onClick={addSlot}
              className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-[#6fcf9f] font-medium cursor-pointer hover:underline mt-1"
            >
              <Plus className="w-3 h-3" /> Ajouter une plage
            </button>
          )}
        </div>
      </div>

      {/* Récap */}
      {activeJours.length > 0 && (
        <div className="border border-slate-200 dark:border-[#1c2220] rounded-xl overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-[#1c2220]">
            <div className="px-4 py-3 text-center">
              <p className="text-[10px] text-slate-400 dark:text-[#7A7A78] mb-1">
                Jours actifs
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-[#F5F5F4]">
                {activeJours.length}
              </p>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-[10px] text-slate-400 dark:text-[#7A7A78] mb-1">
                Créneaux / semaine
              </p>
              <p className="text-sm font-bold text-teal-600 dark:text-[#6fcf9f]">
                {totalSlots}
              </p>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-[10px] text-slate-400 dark:text-[#7A7A78] mb-1">
                Heures / semaine
              </p>
              <p className="text-sm font-bold text-teal-600 dark:text-[#6fcf9f]">
                {totalH}h
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bouton */}
      <button
        onClick={handleSave}
        disabled={saving || activeJours.length === 0}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-600 dark:bg-[#0F6E56] hover:bg-teal-700 dark:hover:bg-[#085041] disabled:opacity-40 text-white font-semibold text-sm rounded-xl cursor-pointer transition-all"
      >
        {saving ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        ) : saved ? (
          <>
            <CheckCircle className="w-4 h-4" /> Enregistré
          </>
        ) : (
          <>
            <Save className="w-4 h-4" /> Enregistrer
          </>
        )}
      </button>
    </div>
  );
}
