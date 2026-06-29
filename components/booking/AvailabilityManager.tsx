"use client";
import { useState, useEffect } from "react";
import { Clock, Plus, Trash2, CheckCircle, Calendar, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { localizedDigits } from "@/lib/arabicNumerals";

const DURATIONS = [15, 30, 45, 60];

interface Slot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  duration_min: number;
  is_active: boolean;
}
interface Block {
  id: string;
  blocked_date: string;
  start_time?: string;
  end_time?: string;
  reason?: string;
}

export default function AvailabilityManager() {
  const supabase = createClient();
  const { user } = useAuth();
  const t = useTranslations("availabilityManager");
  const locale = useLocale();
  const ld = (s: string) => localizedDigits(s, locale);
  const dateLocale =
    locale === "ar" ? "ar-DZ" : locale === "en" ? "en-US" : "fr-DZ";
  const DAYS = t.raw("days") as string[];

  const [slots, setSlots] = useState<Slot[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"schedule" | "blocks">("schedule");

  const [newDay, setNewDay] = useState(1);
  const [newStart, setNewStart] = useState("09:00");
  const [newEnd, setNewEnd] = useState("17:00");
  const [newDur, setNewDur] = useState(30);

  const [blockDate, setBlockDate] = useState("");
  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [allDay, setAllDay] = useState(true);

  useEffect(() => {
    if (user) {
      loadSlots();
      loadBlocks();
    }
  }, [user]);

  const loadSlots = async () => {
    const { data } = await supabase
      .from("availability_slots")
      .select("*")
      .eq("lawyer_id", user!.id)
      .order("day_of_week")
      .order("start_time");
    setSlots(data || []);
    setLoading(false);
  };

  const loadBlocks = async () => {
    const { data } = await supabase
      .from("availability_blocks")
      .select("*")
      .eq("lawyer_id", user!.id)
      .gte("blocked_date", new Date().toISOString().split("T")[0])
      .order("blocked_date");
    setBlocks(data || []);
  };

  const addSlot = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("availability_slots").insert({
      lawyer_id: user.id,
      day_of_week: newDay,
      start_time: newStart,
      end_time: newEnd,
      duration_min: newDur,
    });
    await loadSlots();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  };

  const deleteSlot = async (id: string) => {
    await supabase.from("availability_slots").delete().eq("id", id);
    setSlots((s) => s.filter((x) => x.id !== id));
  };

  const toggleSlot = async (id: string, active: boolean) => {
    await supabase
      .from("availability_slots")
      .update({ is_active: !active })
      .eq("id", id);
    setSlots((s) =>
      s.map((x) => (x.id === id ? { ...x, is_active: !active } : x))
    );
  };

  const addBlock = async () => {
    if (!user || !blockDate) return;
    setSaving(true);
    await supabase.from("availability_blocks").insert({
      lawyer_id: user.id,
      blocked_date: blockDate,
      start_time: allDay ? null : blockStart || null,
      end_time: allDay ? null : blockEnd || null,
      reason: blockReason || null,
    });
    await loadBlocks();
    setBlockDate("");
    setBlockStart("");
    setBlockEnd("");
    setBlockReason("");
    setAllDay(true);
    setSaving(false);
  };

  const deleteBlock = async (id: string) => {
    await supabase.from("availability_blocks").delete().eq("id", id);
    setBlocks((b) => b.filter((x) => x.id !== id));
  };

  const inp =
    "h-10 px-3 text-sm border border-slate-200 dark:border-[#1c2220] rounded-xl bg-white dark:bg-[#1c1c1e] focus:border-teal-400 dark:focus:border-[#6fcf9f] outline-none transition-all w-full text-slate-700 dark:text-[#E8E8E6]";
  const sel =
    "h-10 px-3 text-sm border border-slate-200 dark:border-[#1c2220] rounded-xl bg-white dark:bg-[#1c1c1e] focus:border-teal-400 dark:focus:border-[#6fcf9f] outline-none transition-all cursor-pointer text-slate-700 dark:text-[#E8E8E6]";

  const slotsByDay = DAYS.map((_, i) => ({
    day: i,
    label: DAYS[i],
    slots: slots.filter((s) => s.day_of_week === i),
  }));

  if (loading)
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-600 dark:border-[#6fcf9f] border-t-transparent" />
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["schedule", "blocks"] as const).map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all
              ${tab === tb ? "bg-teal-600 dark:bg-[#0F6E56] text-white" : "bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] text-slate-600 dark:text-[#E8E8E6] hover:border-teal-300 dark:hover:border-[#6fcf9f]"}`}
          >
            {tb === "schedule" ? t("tabSchedule") : t("tabBlocks")}
          </button>
        ))}
      </div>

      {tab === "schedule" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-2xl p-4">
            <p className="text-sm font-bold text-slate-800 dark:text-[#F5F5F4] mb-3">
              {t("addSlotTitle")}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              <div>
                <label className="block text-xs text-slate-500 dark:text-[#A8A8A6] mb-1">
                  {t("dayLabel")}
                </label>
                <select
                  value={newDay}
                  onChange={(e) => setNewDay(+e.target.value)}
                  className={sel}
                >
                  {DAYS.map((d, i) => (
                    <option key={i} value={i}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-[#A8A8A6] mb-1">
                  {t("startLabel")}
                </label>
                <input
                  type="time"
                  value={newStart}
                  onChange={(e) => setNewStart(e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-[#A8A8A6] mb-1">
                  {t("endLabel")}
                </label>
                <input
                  type="time"
                  value={newEnd}
                  onChange={(e) => setNewEnd(e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-[#A8A8A6] mb-1">
                  {t("slotDurationLabel")}
                </label>
                <select
                  value={newDur}
                  onChange={(e) => setNewDur(+e.target.value)}
                  className={sel}
                >
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>
                      {t("minutesShort", { n: ld(String(d)) })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={addSlot}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 dark:bg-[#0F6E56] dark:hover:bg-[#085041] text-white rounded-xl text-sm font-semibold cursor-pointer transition-all disabled:opacity-50"
            >
              {saved ? (
                <>
                  <CheckCircle className="w-4 h-4" /> {t("added")}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> {t("add")}
                </>
              )}
            </button>
          </div>

          {slotsByDay
            .filter((d) => d.slots.length > 0)
            .map(({ day, label, slots: ds }) => (
              <div
                key={day}
                className="bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-2xl p-4"
              >
                <p className="text-sm font-bold text-slate-800 dark:text-[#F5F5F4] mb-3">
                  {label}
                </p>
                <div className="space-y-2">
                  {ds.map((s) => (
                    <div
                      key={s.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all
                    ${s.is_active ? "bg-teal-50 dark:bg-[#6fcf9f]/10 border-teal-100 dark:border-[#6fcf9f]/20" : "bg-slate-50 dark:bg-[#141415] border-slate-200 dark:border-[#1c2220] opacity-60"}`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-teal-600 dark:text-[#6fcf9f]" />
                        <span className="text-sm font-medium text-slate-800 dark:text-[#F5F5F4]">
                          {ld(s.start_time.slice(0, 5))} –{" "}
                          {ld(s.end_time.slice(0, 5))}
                        </span>
                        <span className="text-xs text-teal-600 dark:text-[#6fcf9f] bg-white dark:bg-[#1c1c1e] border border-teal-100 dark:border-[#6fcf9f]/20 px-2 py-0.5 rounded-full">
                          {t("perSlot", { n: ld(String(s.duration_min)) })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSlot(s.id, s.is_active)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all
                          ${s.is_active ? "bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] text-slate-500 dark:text-[#A8A8A6] hover:text-slate-700 dark:hover:text-[#E8E8E6]" : "bg-teal-600 dark:bg-[#0F6E56] text-white"}`}
                        >
                          {s.is_active ? t("deactivate") : t("activate")}
                        </button>
                        <button
                          onClick={() => deleteSlot(s.id)}
                          className="w-7 h-7 rounded-lg hover:bg-red-50 dark:hover:bg-[#3D1F1F] flex items-center justify-center text-slate-400 dark:text-[#7A7A78] hover:text-red-500 dark:hover:text-[#E08585] cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          {slots.length === 0 && (
            <div className="text-center py-8 text-sm text-slate-400 dark:text-[#7A7A78]">
              {t("noSlots")}
            </div>
          )}
        </div>
      )}

      {tab === "blocks" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-2xl p-4">
            <p className="text-sm font-bold text-slate-800 dark:text-[#F5F5F4] mb-3">
              {t("blockDateTitle")}
            </p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-500 dark:text-[#A8A8A6] mb-1">
                    {t("dateLabel")}
                  </label>
                  <input
                    type="date"
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className={inp}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allDay}
                      onChange={(e) => setAllDay(e.target.checked)}
                      className="w-4 h-4 accent-teal-600 dark:accent-[#0F6E56]"
                    />
                    <span className="text-sm text-slate-600 dark:text-[#E8E8E6]">
                      {t("allDay")}
                    </span>
                  </label>
                </div>
              </div>
              {!allDay && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-[#A8A8A6] mb-1">
                      {t("fromLabel")}
                    </label>
                    <input
                      type="time"
                      value={blockStart}
                      onChange={(e) => setBlockStart(e.target.value)}
                      className={inp}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-[#A8A8A6] mb-1">
                      {t("toLabel")}
                    </label>
                    <input
                      type="time"
                      value={blockEnd}
                      onChange={(e) => setBlockEnd(e.target.value)}
                      className={inp}
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs text-slate-500 dark:text-[#A8A8A6] mb-1">
                  {t("reasonLabel")}
                </label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder={t("reasonPh")}
                  className={inp}
                />
              </div>
              <button
                onClick={addBlock}
                disabled={!blockDate || saving}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 dark:bg-[#0F6E56] dark:hover:bg-[#085041] disabled:opacity-40 text-white rounded-xl text-sm font-semibold cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" /> {t("blockThisDate")}
              </button>
            </div>
          </div>

          {blocks.length > 0 && (
            <div className="bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-[#1c2220]">
                <p className="text-sm font-bold text-slate-800 dark:text-[#F5F5F4]">
                  {t("upcomingBlocked")}
                </p>
              </div>
              {blocks.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-[#1c2220] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-amber-500 dark:text-[#E0B568]" />
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-[#F5F5F4]">
                        {new Date(b.blocked_date).toLocaleDateString(
                          dateLocale,
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          }
                        )}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-[#7A7A78]">
                        {!b.start_time
                          ? t("allDayLabel")
                          : `${ld(b.start_time?.slice(0, 5) || "")} – ${ld(b.end_time?.slice(0, 5) || "")}`}
                        {b.reason ? ` · ${b.reason}` : ""}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteBlock(b.id)}
                    className="w-7 h-7 rounded-lg hover:bg-red-50 dark:hover:bg-[#3D1F1F] flex items-center justify-center text-slate-400 dark:text-[#7A7A78] hover:text-red-500 dark:hover:text-[#E08585] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
