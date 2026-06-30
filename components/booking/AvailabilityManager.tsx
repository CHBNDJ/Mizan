"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Trash2, Save, Clock, CheckCircle } from "lucide-react";

const DAYS = [
  { value: 1, label: "Lundi" },
  { value: 2, label: "Mardi" },
  { value: 3, label: "Mercredi" },
  { value: 4, label: "Jeudi" },
  { value: 5, label: "Vendredi" },
  { value: 6, label: "Samedi" },
  { value: 0, label: "Dimanche" },
];

interface SlotRow {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  duration_min: number;
  is_active: boolean;
}

export default function AvailabilityManager() {
  const supabase = createClient();
  const { user } = useAuth();

  const [activeDays, setActiveDays] = useState<number[]>([]);
  const [duration, setDuration] = useState<30 | 60>(30);
  const [ranges, setRanges] = useState([
    { start: "09:00", end: "12:00" },
    { start: "14:00", end: "17:00" },
  ]);
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
      const uniqueDays = [...new Set(data.map((s: SlotRow) => s.day_of_week))];
      setActiveDays(uniqueDays);
      setDuration((data[0].duration_min as 30 | 60) || 30);
      const firstDaySlots = data.filter(
        (s: SlotRow) => s.day_of_week === data[0].day_of_week
      );
      setRanges(
        firstDaySlots.map((s: SlotRow) => ({
          start: s.start_time.slice(0, 5),
          end: s.end_time.slice(0, 5),
        }))
      );
    }
    setLoading(false);
  };

  const toggleDay = (day: number) => {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const updateRange = (idx: number, field: "start" | "end", value: string) => {
    setRanges((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const addRange = () => {
    setRanges((prev) => [...prev, { start: "08:00", end: "10:00" }]);
  };

  const removeRange = (idx: number) => {
    setRanges((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!user || activeDays.length === 0 || ranges.length === 0) return;
    setSaving(true);

    await supabase.from("availability_slots").delete().eq("lawyer_id", user.id);

    const toInsert: Omit<SlotRow, "id">[] = [];
    activeDays.forEach((day) => {
      ranges.forEach((range) => {
        if (range.start && range.end && range.start < range.end) {
          toInsert.push({
            day_of_week: day,
            start_time: range.start,
            end_time: range.end,
            duration_min: duration,
            is_active: true,
          });
        }
      });
    });

    if (toInsert.length > 0) {
      await supabase
        .from("availability_slots")
        .insert(toInsert.map((s) => ({ ...s, lawyer_id: user.id })));
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    loadAvailability();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-600 dark:border-[#6fcf9f] border-t-transparent" />
      </div>
    );

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-[#A8A8A6] uppercase tracking-wide mb-3">
          Jours disponibles
        </p>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((d) => {
            const active = activeDays.includes(d.value);
            return (
              <button
                key={d.value}
                onClick={() => toggleDay(d.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                  active
                    ? "bg-teal-600 dark:bg-[#0F6E56] text-white border-teal-600 dark:border-[#0F6E56]"
                    : "bg-white dark:bg-[#1c1c1e] text-slate-600 dark:text-[#E8E8E6] border-slate-200 dark:border-[#1c2220] hover:border-teal-300 dark:hover:border-[#6fcf9f]/30"
                }`}
              >
                {d.label.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-[#A8A8A6] uppercase tracking-wide mb-3">
          Plages horaires
        </p>
        <div className="space-y-2">
          {ranges.map((range, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 dark:text-[#7A7A78] mb-1">
                    Début
                  </label>
                  <input
                    type="time"
                    value={range.start}
                    onChange={(e) => updateRange(idx, "start", e.target.value)}
                    className="w-full h-9 px-3 text-sm border border-slate-200 dark:border-[#3a3a3d] rounded-lg bg-white dark:bg-[#1c1c1e] text-slate-700 dark:text-[#F5F5F4] focus:border-teal-400 dark:focus:border-[#6fcf9f] outline-none transition-colors"
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
                    className="w-full h-9 px-3 text-sm border border-slate-200 dark:border-[#3a3a3d] rounded-lg bg-white dark:bg-[#1c1c1e] text-slate-700 dark:text-[#F5F5F4] focus:border-teal-400 dark:focus:border-[#6fcf9f] outline-none transition-colors"
                  />
                </div>
              </div>
              {ranges.length > 1 && (
                <button
                  onClick={() => removeRange(idx)}
                  className="mt-5 p-1.5 text-slate-400 dark:text-[#7A7A78] hover:text-red-500 dark:hover:text-red-400 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {ranges.length < 4 && (
            <button
              onClick={addRange}
              className="w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-slate-200 dark:border-[#1c2220] rounded-lg text-xs text-slate-400 dark:text-[#7A7A78] hover:border-teal-300 dark:hover:border-[#6fcf9f]/30 hover:text-teal-600 dark:hover:text-[#6fcf9f] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter une plage
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-[#A8A8A6] uppercase tracking-wide mb-3">
          Durée des créneaux
        </p>
        <div className="flex gap-2">
          {([30, 60] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border-2 ${
                duration === d
                  ? "border-teal-600 dark:border-[#6fcf9f] bg-teal-50 dark:bg-[#6fcf9f]/10 text-teal-700 dark:text-[#6fcf9f]"
                  : "border-slate-200 dark:border-[#1c2220] bg-white dark:bg-[#1c1c1e] text-slate-500 dark:text-[#A8A8A6]"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {d === 30 ? "30 min" : "1 heure"}
            </button>
          ))}
        </div>
      </div>

      {activeDays.length === 0 && (
        <p className="text-xs text-amber-600 dark:text-[#E0B568] bg-amber-50 dark:bg-[#3D2E1F] border border-amber-200 dark:border-[#5A4A2A] rounded-lg px-3 py-2">
          Sélectionnez au moins un jour pour activer votre calendrier.
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={saving || activeDays.length === 0 || ranges.length === 0}
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
