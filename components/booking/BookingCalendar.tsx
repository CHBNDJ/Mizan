"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ChevronLeft, ChevronRight, Clock, Calendar } from "lucide-react";
import { useLocale } from "next-intl";

interface AvailSlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
  duration_min: number;
}

interface Props {
  lawyerId: string;
  profession?: string;
  onSelect: (date: string, time: string) => void;
  selectedDate?: string;
  selectedTime?: string;
}

const PROF_LABELS: Record<string, string> = {
  avocat: "l'avocat",
  notaire: "le notaire",
  huissier: "l'huissier",
  comptable: "le comptable",
  "expert-comptable": "l'expert-comptable",
};

const DEFAULT_DAYS = [1, 2, 3, 4, 5, 6];
const DEFAULT_START = "08:00";
const DEFAULT_END = "18:00";
const DEFAULT_DURATION = 30;

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function timeToMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function generateSlots(start: string, end: string, duration: number): string[] {
  const slots: string[] = [];
  let cur = start.slice(0, 5);
  while (timeToMin(cur) + duration <= timeToMin(end.slice(0, 5))) {
    slots.push(cur);
    cur = addMinutes(cur, duration);
  }
  return slots;
}

export default function BookingCalendar({
  lawyerId,
  profession,
  onSelect,
  selectedDate,
  selectedTime,
}: Props) {
  const supabase = createClient();
  const locale = useLocale();

  const [availability, setAvailability] = useState<AvailSlot[]>([]);
  const [hasCustomAvail, setHasCustomAvail] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    loadAvailability();
  }, [lawyerId]);

  const loadAvailability = async () => {
    const { data } = await supabase
      .from("availability_slots")
      .select("day_of_week, start_time, end_time, duration_min")
      .eq("lawyer_id", lawyerId)
      .eq("is_active", true);

    if (data && data.length > 0) {
      setAvailability(data);
      setHasCustomAvail(true);
    } else {
      setHasCustomAvail(false);
      setAvailability(
        DEFAULT_DAYS.map((d) => ({
          day_of_week: d,
          start_time: DEFAULT_START,
          end_time: DEFAULT_END,
          duration_min: DEFAULT_DURATION,
        }))
      );
    }
    setLoading(false);
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayRaw = new Date(year, month, 1).getDay();
  const offset = firstDayRaw === 0 ? 6 : firstDayRaw - 1;

  const availableDows = availability.map((s) => s.day_of_week);

  const isDateAvailable = (day: number): boolean => {
    const date = new Date(year, month, day);
    if (date < today) return false;
    return availableDows.includes(date.getDay());
  };

  const loadSlotsForDay = async (day: number) => {
    setLoadingSlots(true);
    const date = new Date(year, month, day);
    const dow = date.getDay();
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const daySlots = availability.filter((s) => s.day_of_week === dow);
    if (daySlots.length === 0) {
      setTimeSlots([]);
      setLoadingSlots(false);
      return;
    }

    const [{ data: blocks }, { data: booked }] = await Promise.all([
      supabase
        .from("availability_blocks")
        .select("start_time, end_time")
        .eq("lawyer_id", lawyerId)
        .eq("blocked_date", dateStr),
      supabase
        .from("appointments")
        .select("start_time, end_time")
        .eq("lawyer_id", lawyerId)
        .eq("appointment_date", dateStr)
        .in("status", ["pending", "confirmed"]),
    ]);

    const allSlots: string[] = [];
    daySlots.forEach((s) => {
      allSlots.push(
        ...generateSlots(
          s.start_time,
          s.end_time,
          s.duration_min || DEFAULT_DURATION
        )
      );
    });

    const now = new Date();
    const available = [...new Set(allSlots)].sort().filter((slot) => {
      const slotMin = timeToMin(slot);
      const dur = daySlots[0].duration_min || DEFAULT_DURATION;

      const slotDate = new Date(year, month, day);
      slotDate.setHours(Math.floor(slotMin / 60), slotMin % 60);
      if (slotDate <= now) return false;

      const isBlocked = blocks?.some((b) => {
        if (!b.start_time) return true;
        return (
          slotMin >= timeToMin(b.start_time.slice(0, 5)) &&
          slotMin < timeToMin(b.end_time.slice(0, 5))
        );
      });
      if (isBlocked) return false;

      const isBooked = booked?.some(
        (b) =>
          slotMin < timeToMin(b.end_time.slice(0, 5)) &&
          slotMin + dur > timeToMin(b.start_time.slice(0, 5))
      );
      return !isBooked;
    });

    setTimeSlots(available);
    setLoadingSlots(false);
  };

  const handleDayClick = (day: number) => {
    if (!isDateAvailable(day)) return;
    if (activeDay === day) {
      setActiveDay(null);
      setTimeSlots([]);
      return;
    }
    setActiveDay(day);
    loadSlotsForDay(day);
  };

  const selectedDateStr = activeDay
    ? `${year}-${String(month + 1).padStart(2, "0")}-${String(activeDay).padStart(2, "0")}`
    : null;

  const dateLocale =
    locale === "ar" ? "ar-DZ" : locale === "en" ? "en-US" : "fr-FR";
  const monthLabel = currentMonth.toLocaleDateString(dateLocale, {
    month: "long",
    year: "numeric",
  });
  const formatDayLabel = (day: number) =>
    new Date(year, month, day).toLocaleDateString(dateLocale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  const WEEKDAYS =
    locale === "ar"
      ? ["ن", "ث", "ر", "خ", "ج", "س", "ح"]
      : locale === "en"
        ? ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
        : ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

  const profLabel = PROF_LABELS[profession || "avocat"] || "le professionnel";

  if (loading)
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-600 dark:border-[#6fcf9f] border-t-transparent" />
      </div>
    );

  return (
    <div className="space-y-3">
      {!hasCustomAvail && (
        <div className="flex items-start gap-2 bg-amber-50 dark:bg-[#3D2E1F] border border-amber-200 dark:border-[#5A4A2A] rounded-lg px-3 py-2">
          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-[#E0B568] mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700 dark:text-[#E0B568]">
            Proposez un créneau, {profLabel} confirmera directement.
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-[#1c2220]">
          <button
            onClick={() => {
              setCurrentMonth(new Date(year, month - 1, 1));
              setActiveDay(null);
              setTimeSlots([]);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-[#2a2a2d] text-slate-600 dark:text-[#E8E8E6] cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <p className="text-sm font-semibold text-slate-800 dark:text-[#F5F5F4] capitalize">
            {monthLabel}
          </p>
          <button
            onClick={() => {
              setCurrentMonth(new Date(year, month + 1, 1));
              setActiveDay(null);
              setTimeSlots([]);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-[#2a2a2d] text-slate-600 dark:text-[#E8E8E6] cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3">
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[11px] font-semibold text-slate-400 dark:text-[#7A7A78] py-1"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: offset }).map((_, i) => (
              <div key={`e-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const avail = isDateAvailable(day);
              const isSelected = activeDay === day;
              const isToday =
                new Date(year, month, day).toDateString() ===
                new Date().toDateString();

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  disabled={!avail}
                  className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-teal-600 dark:bg-[#0F6E56] text-white"
                      : avail
                        ? "hover:bg-teal-50 dark:hover:bg-[#6fcf9f]/10 text-slate-800 dark:text-[#F5F5F4] cursor-pointer"
                        : "text-slate-300 dark:text-[#3a3a3d] cursor-default"
                  } ${
                    isToday && !isSelected
                      ? "ring-1 ring-teal-400 dark:ring-[#6fcf9f]"
                      : ""
                  }`}
                >
                  {day}
                  {avail && !isSelected && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-500 dark:bg-[#6fcf9f]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeDay && (
        <div className="bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-[#1c2220] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600 dark:text-[#6fcf9f]" />
            <p className="text-sm font-semibold text-slate-800 dark:text-[#F5F5F4] capitalize">
              {formatDayLabel(activeDay)}
            </p>
          </div>
          <div className="p-3">
            {loadingSlots ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-teal-600 dark:border-[#6fcf9f] border-t-transparent" />
              </div>
            ) : timeSlots.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-[#7A7A78] text-center py-4">
                Aucun créneau disponible ce jour
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((time) => {
                  const isSelected =
                    selectedDate === selectedDateStr && selectedTime === time;
                  return (
                    <button
                      key={time}
                      onClick={() =>
                        selectedDateStr && onSelect(selectedDateStr, time)
                      }
                      className={`py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border-2 flex flex-col items-center gap-0.5 ${
                        isSelected
                          ? "bg-teal-600 dark:bg-[#0F6E56] text-white border-teal-600 dark:border-[#0F6E56]"
                          : "bg-white dark:bg-[#1c1c1e] text-slate-700 dark:text-[#E8E8E6] border-slate-200 dark:border-[#1c2220] hover:border-teal-400 dark:hover:border-[#6fcf9f] hover:bg-teal-50 dark:hover:bg-[#6fcf9f]/10"
                      }`}
                    >
                      <Clock
                        className={`w-3 h-3 ${isSelected ? "text-white" : "text-teal-500 dark:text-[#6fcf9f]"}`}
                      />
                      {time}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
