"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Trash2, Save, CheckCircle, HardDrive } from "lucide-react";

const DAYS = [
  { short: "Lu", label: "Lundi", dow: 1 },
  { short: "Ma", label: "Mardi", dow: 2 },
  { short: "Me", label: "Mercredi", dow: 3 },
  { short: "Je", label: "Jeudi", dow: 4 },
  { short: "Ve", label: "Vendredi", dow: 5 },
  { short: "Sa", label: "Samedi", dow: 6 },
  { short: "Di", label: "Dimanche", dow: 0 },
];

interface Range {
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

  const [dayEnabled, setDayEnabled] = useState<Record<number, boolean>>({
    0: false,
    1: true,
    2: true,
    3: false,
    4: true,
    5: true,
    6: false,
  });
  const [ranges, setRanges] = useState<Range[]>([
    { start: "09:00", end: "12:00" },
    { start: "14:00", end: "17:00" },
  ]);
  const [duration, setDuration] = useState<30 | 60>(30);
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

  const toggleDay = (dow: number) =>
    setDayEnabled((prev) => ({ ...prev, [dow]: !prev[dow] }));

  const updateRange = (idx: number, field: "start" | "end", val: string) =>
    setRanges((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });

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
  const validRanges = ranges.filter((r) => r.start && r.end && r.start < r.end);

  const calcSlots = (r: Range) => {
    const mins = timeToMin(r.end) - timeToMin(r.start);
    return mins > 0 ? Math.floor(mins / duration) : 0;
  };

  const slotsPerDay = validRanges.reduce((acc, r) => acc + calcSlots(r), 0);
  const totalSlots = slotsPerDay * activeDays.length;
  const totalMins = totalSlots * duration;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  const hoursLabel = h > 0 ? (m > 0 ? `${h}h${m}` : `${h}h`) : `${m} min`;

  if (loading)
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-600 dark:border-[#6fcf9f] border-t-transparent" />
      </div>
    );

  return (
    <div className="space-y-5">
      {/* Jours — chips horizontales */}
      <div>
        <p className="text-[10px] font-semibold text-slate-400 dark:text-[#7A7A78] uppercase tracking-widest mb-2.5">
          Jours de consultation
        </p>
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS.map(({ short, label, dow }) => {
            const on = dayEnabled[dow];
            return (
              <button
                key={dow}
                onClick={() => toggleDay(dow)}
                title={label}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl border transition-all cursor-pointer ${
                  on
                    ? "bg-teal-600 dark:bg-[#0F6E56] border-teal-600 dark:border-[#0F6E56]"
                    : "bg-white dark:bg-[#1c1c1e] border-slate-200 dark:border-[#1c2220] hover:border-teal-400 dark:hover:border-[#6fcf9f]/40"
                }`}
              >
                <span
                  className={`text-[11px] font-semibold ${on ? "text-white" : "text-slate-500 dark:text-[#7A7A78]"}`}
                >
                  {short}
                </span>
                <span
                  className={`w-1 h-1 rounded-full ${on ? "bg-white/50" : "bg-slate-300 dark:bg-[#3a3a3d]"}`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Plages + Durée côte à côte */}
      <div className="grid grid-cols-2 gap-4">
        {/* Plages horaires */}
        <div>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-[#7A7A78] uppercase tracking-widest mb-2.5">
            Plages horaires
          </p>
          <div className="space-y-2">
            {ranges.map((range, idx) => (
              <div
                key={idx}
                className="grid gap-1.5 items-center bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-xl px-2.5 py-2"
                style={{ gridTemplateColumns: "1fr 10px 1fr 24px" }}
              >
                <input
                  type="time"
                  value={range.start}
                  onChange={(e) => updateRange(idx, "start", e.target.value)}
                  className="w-full h-8 px-2 text-xs border border-slate-200 dark:border-[#3a3a3d] rounded-lg bg-slate-50 dark:bg-[#141415] text-slate-800 dark:text-[#F5F5F4] focus:border-teal-500 dark:focus:border-[#6fcf9f] outline-none transition-colors"
                />
                <span className="text-[10px] text-slate-300 dark:text-[#3a3a3d] text-center">
                  –
                </span>
                <input
                  type="time"
                  value={range.end}
                  onChange={(e) => updateRange(idx, "end", e.target.value)}
                  className="w-full h-8 px-2 text-xs border border-slate-200 dark:border-[#3a3a3d] rounded-lg bg-slate-50 dark:bg-[#141415] text-slate-800 dark:text-[#F5F5F4] focus:border-teal-500 dark:focus:border-[#6fcf9f] outline-none transition-colors"
                />
                <button
                  onClick={() => removeRange(idx)}
                  disabled={ranges.length <= 1}
                  className="w-6 h-6 flex items-center justify-center text-slate-300 dark:text-[#3a3a3d] hover:text-red-400 dark:hover:text-red-400 disabled:opacity-0 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {ranges.length < 4 && (
              <button
                onClick={addRange}
                className="w-full flex items-center justify-center gap-1 py-2 border border-dashed border-slate-200 dark:border-[#1c2220] rounded-xl text-[11px] text-slate-400 dark:text-[#7A7A78] hover:border-teal-400 dark:hover:border-[#6fcf9f]/40 hover:text-teal-600 dark:hover:text-[#6fcf9f] transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Ajouter
              </button>
            )}
          </div>
        </div>

        {/* Durée + compteur */}
        <div>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-[#7A7A78] uppercase tracking-widest mb-2.5">
            Durée des créneaux
          </p>
          <div className="flex gap-1.5 mb-3">
            {([30, 60] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border-2 ${
                  duration === d
                    ? "border-teal-600 dark:border-[#6fcf9f] bg-teal-50 dark:bg-[#6fcf9f]/10 text-teal-700 dark:text-[#6fcf9f]"
                    : "border-slate-200 dark:border-[#1c2220] bg-white dark:bg-[#1c1c1e] text-slate-400 dark:text-[#7A7A78]"
                }`}
              >
                {d === 30 ? "30 min" : "1 heure"}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-xl p-3">
            <p className="text-[10px] text-slate-400 dark:text-[#7A7A78] mb-1">
              Créneaux générés
            </p>
            <p className="text-2xl font-bold text-slate-800 dark:text-[#F5F5F4] leading-none">
              {totalSlots}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-[#7A7A78] mt-1">
              {totalSlots > 0 ? `${hoursLabel} / semaine` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Récap */}
      {activeDays.length > 0 && validRanges.length > 0 && (
        <div className="flex items-start gap-2 bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-100 dark:border-[#6fcf9f]/20 rounded-xl px-3 py-2.5">
          <CheckCircle className="w-3.5 h-3.5 text-teal-600 dark:text-[#6fcf9f] mt-0.5 flex-shrink-0" />
          <p className="text-xs text-teal-700 dark:text-[#6fcf9f] leading-relaxed">
            {activeDays.map((d) => d.short).join(", ")}
            {" · "}
            {validRanges.map((r) => `${r.start}–${r.end}`).join(", ")}
            {" · "}
            créneaux de {duration} min
          </p>
        </div>
      )}

      {activeDays.length === 0 && (
        <p className="text-xs text-amber-600 dark:text-[#E0B568] bg-amber-50 dark:bg-[#3D2E1F] border border-amber-200 dark:border-[#5A4A2A] rounded-xl px-3 py-2.5">
          Sélectionnez au moins un jour pour activer votre calendrier.
        </p>
      )}

      {/* Bouton */}
      <button
        onClick={handleSave}
        disabled={saving || activeDays.length === 0 || validRanges.length === 0}
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
