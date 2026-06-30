"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Save, CheckCircle } from "lucide-react";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const DAYS_DOW = [1, 2, 3, 4, 5, 6, 0];
const HOURS: string[] = [];
for (let h = 8; h < 18; h++) {
  HOURS.push(`${String(h).padStart(2, "0")}:00`);
  HOURS.push(`${String(h).padStart(2, "0")}:30`);
}

type SlotGrid = Record<number, Record<string, boolean>>;

function initGrid(active = false): SlotGrid {
  const g: SlotGrid = {};
  DAYS_DOW.forEach((dow) => {
    g[dow] = {};
    HOURS.forEach((h) => {
      g[dow][h] = active;
    });
  });
  return g;
}

export default function AvailabilityManager() {
  const supabase = createClient();
  const { user } = useAuth();

  const [grid, setGrid] = useState<SlotGrid>(initGrid(false));
  const [dayEnabled, setDayEnabled] = useState<Record<number, boolean>>({
    0: false,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: false,
  });
  const [duration, setDuration] = useState<30 | 60>(30);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isDragging = useRef(false);
  const dragValue = useRef<boolean>(false);

  useEffect(() => {
    if (!user) return;
    loadAvailability();
    const up = () => {
      isDragging.current = false;
    };
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, [user]);

  const loadAvailability = async () => {
    const { data } = await supabase
      .from("availability_slots")
      .select("*")
      .eq("lawyer_id", user!.id)
      .eq("is_active", true);

    if (data && data.length > 0) {
      setDuration(data[0].duration_min as 30 | 60);
      const newGrid = initGrid(false);
      const newEnabled: Record<number, boolean> = {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      };

      data.forEach((slot) => {
        const dow = slot.day_of_week;
        newEnabled[dow] = true;
        const start = slot.start_time.slice(0, 5);
        const end = slot.end_time.slice(0, 5);
        HOURS.forEach((h) => {
          if (h >= start && h < end) newGrid[dow][h] = true;
        });
      });

      setGrid(newGrid);
      setDayEnabled(newEnabled);
    }
    setLoading(false);
  };

  const toggleDay = (dow: number, enabled: boolean) => {
    setDayEnabled((prev) => ({ ...prev, [dow]: enabled }));
    if (!enabled) {
      setGrid((prev) => {
        const next = { ...prev, [dow]: { ...prev[dow] } };
        HOURS.forEach((h) => {
          next[dow][h] = false;
        });
        return next;
      });
    }
  };

  const handleCellDown = (dow: number, h: string) => {
    if (!dayEnabled[dow]) return;
    isDragging.current = true;
    const newVal = !grid[dow][h];
    dragValue.current = newVal;
    setGrid((prev) => ({ ...prev, [dow]: { ...prev[dow], [h]: newVal } }));
  };

  const handleCellEnter = (dow: number, h: string) => {
    if (!isDragging.current || !dayEnabled[dow]) return;
    setGrid((prev) => ({
      ...prev,
      [dow]: { ...prev[dow], [h]: dragValue.current },
    }));
  };

  const getTotalSlots = () => {
    let count = 0;
    DAYS_DOW.forEach((dow) => {
      if (!dayEnabled[dow]) return;
      HOURS.forEach((h) => {
        if (grid[dow][h]) count++;
      });
    });
    return count;
  };

  const getTotalHours = () => {
    const total = getTotalSlots() * duration;
    const h = Math.floor(total / 60);
    const m = total % 60;
    return h > 0 ? (m > 0 ? `${h}h${m}` : `${h}h`) : `${m} min`;
  };

  const getActiveDays = () =>
    DAYS_DOW.filter(
      (dow) => dayEnabled[dow] && Object.values(grid[dow]).some((v) => v)
    );

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("availability_slots").delete().eq("lawyer_id", user.id);

    const toInsert: any[] = [];
    DAYS_DOW.forEach((dow) => {
      if (!dayEnabled[dow]) return;
      const activeHours = HOURS.filter((h) => grid[dow][h]);
      if (activeHours.length === 0) return;
      let rangeStart = activeHours[0];
      let prev = activeHours[0];
      for (let i = 1; i <= activeHours.length; i++) {
        const cur = activeHours[i];
        const prevMin =
          parseInt(prev.split(":")[0]) * 60 + parseInt(prev.split(":")[1]);
        const curMin = cur
          ? parseInt(cur.split(":")[0]) * 60 + parseInt(cur.split(":")[1])
          : -1;
        if (curMin !== prevMin + 30) {
          const endMin = prevMin + 30;
          const endTime = `${String(Math.floor(endMin / 60)).padStart(2, "0")}:${String(endMin % 60).padStart(2, "0")}`;
          toInsert.push({
            lawyer_id: user.id,
            day_of_week: dow,
            start_time: rangeStart,
            end_time: endTime,
            duration_min: duration,
            is_active: true,
          });
          if (cur) rangeStart = cur;
        }
        prev = cur || prev;
      }
    });

    if (toInsert.length > 0) {
      await supabase.from("availability_slots").insert(toInsert);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const clearAll = () => {
    setGrid(initGrid(false));
    setDayEnabled({
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
    });
  };

  const activeDayNames = getActiveDays().map(
    (dow) => DAYS[DAYS_DOW.indexOf(dow)]
  );
  const totalSlots = getTotalSlots();

  if (loading)
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-600 dark:border-[#6fcf9f] border-t-transparent" />
      </div>
    );

  return (
    <div
      className="select-none"
      onMouseLeave={() => {
        isDragging.current = false;
      }}
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-[#A8A8A6] uppercase tracking-wide">
            Créneaux de
          </span>
          {([30, 60] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                duration === d
                  ? "bg-teal-600 dark:bg-[#0F6E56] text-white border-teal-600 dark:border-[#0F6E56]"
                  : "bg-white dark:bg-[#1c1c1e] text-slate-500 dark:text-[#A8A8A6] border-slate-200 dark:border-[#1c2220] hover:border-teal-300 dark:hover:border-[#6fcf9f]/30"
              }`}
            >
              {d === 30 ? "30 min" : "1h"}
            </button>
          ))}
        </div>
        {totalSlots > 0 && (
          <span className="text-xs font-medium text-teal-600 dark:text-[#6fcf9f] bg-teal-50 dark:bg-[#6fcf9f]/10 px-2 py-0.5 rounded-full">
            {getTotalHours()} / semaine
          </span>
        )}
      </div>

      <div className="border border-slate-200 dark:border-[#1c2220] rounded-xl overflow-hidden bg-white dark:bg-[#1c1c1e]">
        <div
          className="grid"
          style={{
            gridTemplateColumns: "40px " + DAYS.map(() => "1fr").join(" "),
          }}
        >
          <div className="border-b border-r border-slate-100 dark:border-[#1c2220]" />
          {DAYS.map((d, i) => {
            const dow = DAYS_DOW[i];
            return (
              <div
                key={d}
                className="border-b border-r border-slate-100 dark:border-[#1c2220] px-1 py-2 text-center last:border-r-0"
              >
                <p className="text-[10px] font-semibold text-slate-500 dark:text-[#A8A8A6] mb-1.5">
                  {d}
                </p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dayEnabled[dow]}
                    onChange={(e) => toggleDay(dow, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-7 h-4 rounded-full bg-slate-200 dark:bg-[#3a3a3d] peer-checked:bg-teal-600 dark:peer-checked:bg-[#0F6E56] transition-colors after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:rounded-full after:w-3 after:h-3 after:transition-all peer-checked:after:translate-x-3" />
                </label>
              </div>
            );
          })}

          {HOURS.map((h, hi) => (
            <>
              <div
                key={`lbl-${h}`}
                className="border-b border-r border-slate-100 dark:border-[#1c2220] flex items-center justify-end pr-1.5 last-row:border-b-0"
                style={{ height: 24 }}
              >
                {hi % 2 === 0 && (
                  <span className="text-[9px] text-slate-400 dark:text-[#7A7A78] font-medium">
                    {h}
                  </span>
                )}
              </div>
              {DAYS.map((d, di) => {
                const dow = DAYS_DOW[di];
                const isActive = grid[dow][h] && dayEnabled[dow];
                const isDisabled = !dayEnabled[dow];
                return (
                  <div
                    key={`${d}-${h}`}
                    style={{ height: 24 }}
                    className={`border-b border-r border-slate-100 dark:border-[#1c2220] last:border-r-0 transition-colors ${
                      isDisabled
                        ? "bg-slate-50 dark:bg-[#141415] cursor-not-allowed"
                        : isActive
                          ? "bg-teal-500 dark:bg-[#0F6E56] hover:bg-teal-600 dark:hover:bg-[#085041] cursor-pointer"
                          : "hover:bg-teal-50 dark:hover:bg-[#6fcf9f]/10 cursor-pointer"
                    }`}
                    onMouseDown={() => handleCellDown(dow, h)}
                    onMouseEnter={() => handleCellEnter(dow, h)}
                  />
                );
              })}
            </>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
        <p className="text-xs text-slate-400 dark:text-[#7A7A78]">
          {activeDayNames.length > 0
            ? `${activeDayNames.join(", ")} · ${totalSlots} créneau${totalSlots > 1 ? "x" : ""}`
            : "Aucune disponibilité configurée — glissez pour sélectionner"}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={clearAll}
            className="text-xs text-slate-400 dark:text-[#7A7A78] hover:text-slate-600 dark:hover:text-[#E8E8E6] cursor-pointer transition-colors"
          >
            Tout effacer
          </button>
          <button
            onClick={handleSave}
            disabled={saving || totalSlots === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 dark:bg-[#0F6E56] hover:bg-teal-700 dark:hover:bg-[#085041] disabled:opacity-40 text-white text-xs font-semibold rounded-lg cursor-pointer transition-all"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
            ) : saved ? (
              <>
                <CheckCircle className="w-3 h-3" /> Enregistré
              </>
            ) : (
              <>
                <Save className="w-3 h-3" /> Enregistrer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
