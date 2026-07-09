"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations, useLocale } from "next-intl";
import { Plus, X, Save, CheckCircle } from "lucide-react";

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
  const t = useTranslations("availabilityManager");
  const locale = useLocale();
  const timeLang = locale === "ar" ? "ar" : locale === "en" ? "en" : "fr";

  const JOURS = [
    { label: t("days.1"), dow: 1 },
    { label: t("days.2"), dow: 2 },
    { label: t("days.3"), dow: 3 },
    { label: t("days.4"), dow: 4 },
    { label: t("days.5"), dow: 5 },
    { label: t("days.6"), dow: 6 },
    { label: t("days.0"), dow: 0 },
  ];

  const [enabled, setEnabled] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });
  const [slots, setSlots] = useState<Record<number, Plage[]>>({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  });
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
      const newEnabled: Record<number, boolean> = {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      };
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
        newEnabled[s.day_of_week] = true;
        newSlots[s.day_of_week].push({
          start: s.start_time.slice(0, 5),
          end: s.end_time.slice(0, 5),
        });
      });
      setEnabled(newEnabled);
      setSlots(newSlots);
    } else {
      setEnabled({
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      });
      setSlots({ 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] });
    }
    setLoading(false);
  };

  const toggle = (dow: number, on: boolean) => {
    setEnabled((prev) => ({ ...prev, [dow]: on }));
    if (on && (slots[dow] || []).length === 0) {
      setSlots((prev) => ({
        ...prev,
        [dow]: [{ start: "09:00", end: "17:00" }],
      }));
    }
  };

  const addPlage = (dow: number) => {
    if ((slots[dow] || []).length >= 3) return;
    setSlots((prev) => ({
      ...prev,
      [dow]: [...(prev[dow] || []), { start: "09:00", end: "12:00" }],
    }));
  };

  const updatePlage = (
    dow: number,
    idx: number,
    field: "start" | "end",
    val: string
  ) => {
    setSlots((prev) => {
      const next = [...(prev[dow] || [])];
      next[idx] = { ...next[idx], [field]: val };
      return { ...prev, [dow]: next };
    });
  };

  const removePlage = (dow: number, idx: number) => {
    setSlots((prev) => {
      const next = (prev[dow] || []).filter((_, i) => i !== idx);
      if (next.length === 0) setEnabled((e) => ({ ...e, [dow]: false }));
      return { ...prev, [dow]: next };
    });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("availability_slots").delete().eq("lawyer_id", user.id);
    const toInsert: any[] = [];
    JOURS.forEach(({ dow }) => {
      if (!enabled[dow]) return;
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
    if (toInsert.length > 0)
      await supabase.from("availability_slots").insert(toInsert);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const activeJours = JOURS.filter(
    (j) =>
      enabled[j.dow] &&
      (slots[j.dow] || []).some((p) => p.start && p.end && p.start < p.end)
  );
  const totalSlots = activeJours.reduce(
    (acc, j) =>
      acc +
      (slots[j.dow] || [])
        .filter((p) => p.start && p.end && p.start < p.end)
        .reduce(
          (a, p) =>
            a + Math.floor((timeToMin(p.end) - timeToMin(p.start)) / duration),
          0
        ),
    0
  );
  const totalH = Math.floor((totalSlots * duration) / 60);

  if (loading)
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-600 dark:border-[#6fcf9f] border-t-transparent" />
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-500 dark:text-[#A8A8A6]">
          {t("hint")}
        </p>
        <div className="flex border border-slate-200 dark:border-[#1c2220] rounded-lg overflow-hidden">
          {([30, 60] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${duration === d ? "bg-teal-600 dark:bg-[#0F6E56] text-white" : "bg-white dark:bg-[#1c1c1e] text-slate-500 dark:text-[#A8A8A6] hover:bg-slate-50 dark:hover:bg-[#1c2220]"}`}
            >
              {d === 30 ? t("duration30") : t("duration60")}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4 flex items-start gap-2 bg-teal-50 dark:bg-[#0F6E56]/15 border border-teal-100 dark:border-[#6fcf9f]/25 rounded-lg px-3 py-2">
        <p className="text-[11px] text-teal-700 dark:text-[#6fcf9f] leading-relaxed">
          {t("timezoneNote")}
        </p>
      </div>

      <div className="border border-slate-200 dark:border-[#1c2220] rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-[#1c2220]">
        {JOURS.map(({ label, dow }) => {
          const on = enabled[dow];
          const plages = slots[dow] || [];
          return (
            <div
              key={dow}
              className={`flex items-start gap-3 px-4 py-3 transition-colors ${on ? "bg-white dark:bg-[#1c1c1e]" : "bg-slate-50 dark:bg-[#141415]"}`}
            >
              <label className="relative inline-flex items-center cursor-pointer mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={(e) => toggle(dow, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-[18px] rounded-full bg-slate-200 dark:bg-[#3a3a3d] peer-checked:bg-teal-600 dark:peer-checked:bg-[#0F6E56] transition-colors after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:w-[14px] after:h-[14px] after:transition-all peer-checked:after:translate-x-[14px]" />
              </label>

              <span
                className={`text-sm font-medium w-20 flex-shrink-0 pt-0.5 ${on ? "text-slate-800 dark:text-[#F5F5F4]" : "text-slate-400 dark:text-[#3a3a3d]"}`}
              >
                {label}
              </span>

              {!on ? (
                <span className="text-xs text-slate-400 dark:text-[#7A7A78] pt-0.5">
                  {t("unavailable")}
                </span>
              ) : (
                <div className="flex-1 space-y-2">
                  {plages.map((p, idx) => (
                    <div
                      key={idx}
                      className="grid items-center gap-2"
                      style={{ gridTemplateColumns: "1fr 14px 1fr 26px" }}
                    >
                      <input
                        type="time"
                        lang={timeLang}
                        value={p.start}
                        onChange={(e) =>
                          updatePlage(dow, idx, "start", e.target.value)
                        }
                        className="h-8 px-2 text-xs border border-slate-200 dark:border-[#3a3a3d] rounded-lg bg-slate-50 dark:bg-[#141415] text-slate-800 dark:text-[#F5F5F4] focus:border-teal-500 dark:focus:border-[#6fcf9f] outline-none transition-colors w-full"
                      />
                      <span className="text-[11px] text-slate-300 dark:text-[#3a3a3d] text-center">
                        –
                      </span>
                      <input
                        type="time"
                        lang={timeLang}
                        value={p.end}
                        onChange={(e) =>
                          updatePlage(dow, idx, "end", e.target.value)
                        }
                        className="h-8 px-2 text-xs border border-slate-200 dark:border-[#3a3a3d] rounded-lg bg-slate-50 dark:bg-[#141415] text-slate-800 dark:text-[#F5F5F4] focus:border-teal-500 dark:focus:border-[#6fcf9f] outline-none transition-colors w-full"
                      />
                      <button
                        onClick={() => removePlage(dow, idx)}
                        disabled={plages.length <= 1}
                        className="w-6 h-6 flex items-center justify-center text-slate-300 dark:text-[#3a3a3d] hover:text-red-400 dark:hover:text-red-400 disabled:opacity-30 cursor-pointer transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {plages.length === 0 && (
                    <p className="text-xs text-slate-400 dark:text-[#7A7A78]">
                      {t("noRange")}{" "}
                      <button
                        onClick={() => addPlage(dow)}
                        className="text-teal-600 dark:text-[#6fcf9f] font-medium cursor-pointer hover:underline"
                      >
                        {t("addFirst")}
                      </button>
                    </p>
                  )}
                  {plages.length > 0 && plages.length < 3 && (
                    <button
                      onClick={() => addPlage(dow)}
                      className="flex items-center gap-1 text-[11px] text-teal-600 dark:text-[#6fcf9f] font-medium cursor-pointer hover:underline"
                    >
                      <Plus className="w-3 h-3" /> {t("addRange")}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-[#141415]">
          <p className="text-xs text-slate-500 dark:text-[#A8A8A6]">
            {activeJours.length > 0 ? (
              <>
                <span className="font-semibold text-slate-700 dark:text-[#E8E8E6]">
                  {activeJours.length}
                </span>{" "}
                {activeJours.length > 1 ? t("dayPlural") : t("daySingular")} ·{" "}
                <span className="font-semibold text-teal-600 dark:text-[#6fcf9f]">
                  {totalSlots} {t("slotsLabel")}
                </span>{" "}
                · {t("hoursPerWeek", { n: totalH })}
              </>
            ) : (
              t("noConfig")
            )}
          </p>
          <button
            onClick={handleSave}
            disabled={saving || activeJours.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 dark:bg-[#0F6E56] hover:bg-teal-700 dark:hover:bg-[#085041] disabled:opacity-40 text-white text-xs font-semibold rounded-lg cursor-pointer transition-all"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
            ) : saved ? (
              <>
                <CheckCircle className="w-3 h-3" /> {t("saved")}
              </>
            ) : (
              <>
                <Save className="w-3 h-3" /> {t("save")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
