"use client";
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { localizedDigits } from "@/lib/arabicNumerals";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lawyerId: string;
  lawyerName: string;
  profession: string;
  onSuccess?: () => void;
}

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function timeToMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export default function BookingModal({
  isOpen,
  onClose,
  lawyerId,
  lawyerName,
  profession,
  onSuccess,
}: Props) {
  const supabase = createClient();
  const { user } = useAuth();
  const t = useTranslations("bookingModal");
  const locale = useLocale();
  const ld = (s: string) => localizedDigits(s, locale);
  const DAYS_FR = t.raw("daysShort") as string[];
  const DAYS_FULL = t.raw("daysFull") as string[];
  const MONTHS_FR = t.raw("months") as string[];

  const [step, setStep] = useState<"date" | "time" | "form" | "done">("date");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7); // commence lundi

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const loadSlots = async (date: Date) => {
    setLoadingSlots(true);
    setSlots([]);
    try {
      const dayOfWeek = date.getDay();
      const dateStr = date.toISOString().split("T")[0];

      const { data: avail } = await supabase
        .from("availability_slots")
        .select("*")
        .eq("lawyer_id", lawyerId)
        .eq("day_of_week", dayOfWeek)
        .eq("is_active", true);

      if (!avail || avail.length === 0) {
        setLoadingSlots(false);
        return;
      }

      const { data: blocks } = await supabase
        .from("availability_blocks")
        .select("*")
        .eq("lawyer_id", lawyerId)
        .eq("blocked_date", dateStr);

      const { data: booked } = await supabase
        .from("appointments")
        .select("start_time, end_time")
        .eq("lawyer_id", lawyerId)
        .eq("appointment_date", dateStr)
        .in("status", ["pending", "accepted", "confirmed"]);

      const allSlots: string[] = [];
      for (const a of avail) {
        const dur = a.duration_min || 30;
        let cur = a.start_time.slice(0, 5);
        while (timeToMin(cur) + dur <= timeToMin(a.end_time.slice(0, 5))) {
          allSlots.push(cur);
          cur = addMinutes(cur, dur);
        }
      }

      const available = allSlots.filter((slot) => {
        const slotMin = timeToMin(slot);
        const dur = avail[0].duration_min || 30;

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
        if (isBooked) return false;

        const slotDate = new Date(date);
        slotDate.setHours(Math.floor(slotMin / 60), slotMin % 60);
        if (slotDate <= new Date()) return false;

        return true;
      });

      setSlots(available);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateSelect = async (date: Date) => {
    if (date < today) return;
    setSelectedDate(date);
    setSelectedSlot(null);
    await loadSlots(date);
    setStep("time");
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedSlot || !subject.trim() || !user) return;
    setSending(true);
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const { data: avail } = await supabase
        .from("availability_slots")
        .select("duration_min")
        .eq("lawyer_id", lawyerId)
        .eq("day_of_week", selectedDate.getDay())
        .single();
      const dur = avail?.duration_min || 30;

      // Le créneau vient de loadSlots(), qui ne propose que des créneaux
      // réellement libres selon les disponibilités du professionnel — pas
      // besoin de validation manuelle, c'est confirmé directement, comme
      // pour les consultations téléphone/vidéo.
      await supabase.from("appointments").insert({
        lawyer_id: lawyerId,
        client_id: user.id,
        appointment_date: dateStr,
        start_time: selectedSlot,
        end_time: addMinutes(selectedSlot, dur),
        subject: subject.trim(),
        client_phone: phone.trim() || null,
        status: "accepted",
        type: "physical",
        channel: "physical",
      });

      fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: lawyerId,
          title: "Rendez-vous confirmé",
          body: `${subject.trim()} le ${selectedDate.toLocaleDateString("fr-FR")} à ${selectedSlot}`,
          url: "/lawyer/consultations",
        }),
      }).catch(() => {});
      fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          title: "Rendez-vous confirmé",
          body: `Rendez-vous avec ${lawyerName} le ${selectedDate.toLocaleDateString("fr-FR")} à ${selectedSlot}`,
          url: "/mes-consultations",
        }),
      }).catch(() => {});

      setStep("done");
      setTimeout(() => {
        onClose();
        setStep("date");
        setSelectedDate(null);
        setSelectedSlot(null);
        setSubject("");
        setPhone("");
        onSuccess?.();
      }, 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const inp =
    "w-full h-11 px-3 text-sm border border-slate-200 dark:border-[#1c2220] rounded-xl bg-white dark:bg-[#1c1c1e] focus:border-teal-400 dark:focus:border-[#6fcf9f] focus:border-2 outline-none transition-all text-slate-700 dark:text-[#E8E8E6] placeholder:text-slate-400 dark:placeholder:text-[#7A7A78]";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-[#1c1c1e] rounded-t-2xl sm:rounded-2xl shadow-xl dark:shadow-none w-full sm:max-w-lg z-10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-[#1c2220]">
          <div className="flex items-center gap-2">
            {step !== "date" && step !== "done" && (
              <button
                onClick={() => setStep(step === "form" ? "time" : "date")}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1c2220] flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-slate-500 dark:text-[#A8A8A6]" />
              </button>
            )}
            <Calendar className="w-4 h-4 text-teal-600 dark:text-[#6fcf9f]" />
            <span className="text-sm font-bold text-slate-900 dark:text-[#F5F5F4]">
              {step === "date"
                ? t("stepChooseDate")
                : step === "time"
                  ? t("stepChooseSlot")
                  : step === "form"
                    ? t("stepConfirm")
                    : t("stepDone")}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 dark:text-[#7A7A78] hover:text-slate-600 dark:hover:text-[#E8E8E6] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {step === "date" && (
            <div>
              <p className="text-xs text-slate-500 dark:text-[#A8A8A6] mb-4">
                {lawyerName} · {profession}
              </p>

              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
                  disabled={weekOffset === 0}
                  className="w-8 h-8 rounded-lg border border-slate-200 dark:border-[#1c2220] flex items-center justify-center cursor-pointer disabled:opacity-30 hover:border-teal-300 dark:hover:border-[#6fcf9f]"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-500 dark:text-[#A8A8A6]" />
                </button>
                <span className="text-sm font-semibold text-slate-700 dark:text-[#E8E8E6]">
                  {MONTHS_FR[weekDays[0].getMonth()]}{" "}
                  {ld(String(weekDays[0].getFullYear()))}
                </span>
                <button
                  onClick={() => setWeekOffset((w) => w + 1)}
                  className="w-8 h-8 rounded-lg border border-slate-200 dark:border-[#1c2220] flex items-center justify-center cursor-pointer hover:border-teal-300 dark:hover:border-[#6fcf9f]"
                >
                  <ChevronRight className="w-4 h-4 text-slate-500 dark:text-[#A8A8A6]" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS_FR.map((d) => (
                  <div
                    key={d}
                    className="text-center text-[10px] font-semibold text-slate-400 dark:text-[#7A7A78] py-1"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((date, i) => {
                  const isPast = date < today;
                  const isSelected =
                    selectedDate?.toDateString() === date.toDateString();
                  const isToday = date.toDateString() === today.toDateString();
                  return (
                    <button
                      key={i}
                      onClick={() => handleDateSelect(date)}
                      disabled={isPast}
                      className={`h-10 rounded-xl text-sm font-medium flex flex-col items-center justify-center cursor-pointer transition-all
                        ${
                          isPast
                            ? "text-slate-300 dark:text-[#5a5a5d] cursor-not-allowed"
                            : isSelected
                              ? "bg-teal-600 dark:bg-[#0F6E56] text-white shadow-sm dark:shadow-none"
                              : isToday
                                ? "border-2 border-teal-300 dark:border-[#6fcf9f] text-teal-700 dark:text-[#6fcf9f] hover:bg-teal-50 dark:hover:bg-[#6fcf9f]/10"
                                : "text-slate-700 dark:text-[#E8E8E6] hover:bg-teal-50 dark:hover:bg-[#6fcf9f]/10 hover:text-teal-700 dark:hover:text-[#6fcf9f]"
                        }`}
                    >
                      <span className="text-[10px] text-inherit opacity-70">
                        {DAYS_FR[date.getDay()]}
                      </span>
                      <span>{ld(String(date.getDate()))}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === "time" && selectedDate && (
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-[#E8E8E6] mb-4">
                {DAYS_FULL[selectedDate.getDay()]}{" "}
                {ld(String(selectedDate.getDate()))}{" "}
                {MONTHS_FR[selectedDate.getMonth()]}
              </p>
              {loadingSlots ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-600 dark:border-[#6fcf9f] border-t-transparent" />
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-10">
                  <Clock className="w-8 h-8 text-slate-300 dark:text-[#5a5a5d] mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-[#A8A8A6]">
                    {t("noSlotsToday")}
                  </p>
                  <button
                    onClick={() => setStep("date")}
                    className="mt-3 text-xs text-teal-600 dark:text-[#6fcf9f] font-medium cursor-pointer"
                  >
                    {t("chooseAnotherDate")}
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer
                          ${
                            selectedSlot === slot
                              ? "bg-teal-600 dark:bg-[#0F6E56] text-white border-teal-600 dark:border-[#0F6E56]"
                              : "border-slate-200 dark:border-[#1c2220] text-slate-700 dark:text-[#E8E8E6] hover:border-teal-300 dark:hover:border-[#6fcf9f] hover:text-teal-700 dark:hover:text-[#6fcf9f]"
                          }`}
                      >
                        {ld(slot)}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => selectedSlot && setStep("form")}
                    disabled={!selectedSlot}
                    className="mt-4 w-full bg-teal-600 hover:bg-teal-700 dark:bg-[#0F6E56] dark:hover:bg-[#085041] disabled:opacity-40 text-white py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
                  >
                    {t("continue")}
                  </button>
                </>
              )}
            </div>
          )}

          {step === "form" && selectedDate && selectedSlot && (
            <div>
              <div className="bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-100 dark:border-[#6fcf9f]/20 rounded-xl p-3 mb-4 flex items-center gap-3">
                <Calendar className="w-4 h-4 text-teal-600 dark:text-[#6fcf9f] flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-teal-800 dark:text-[#6fcf9f]">
                    {DAYS_FULL[selectedDate.getDay()]}{" "}
                    {ld(String(selectedDate.getDate()))}{" "}
                    {MONTHS_FR[selectedDate.getMonth()]} {t("atConnector")}{" "}
                    {ld(selectedSlot)}
                  </p>
                  <p className="text-xs text-teal-600 dark:text-[#6fcf9f]/80">
                    {lawyerName}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-[#A8A8A6] mb-1">
                    {t("subjectLabel")}
                  </label>
                  <textarea
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    rows={3}
                    placeholder={t("subjectPh")}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-[#1c2220] rounded-xl bg-white dark:bg-[#1c1c1e] focus:border-teal-400 dark:focus:border-[#6fcf9f] outline-none transition-all resize-none text-slate-700 dark:text-[#E8E8E6] placeholder:text-slate-400 dark:placeholder:text-[#7A7A78]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-[#A8A8A6] mb-1">
                    {t("phoneLabel")}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("phonePh")}
                    className={inp}
                  />
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={sending || !subject.trim()}
                className="mt-4 w-full bg-teal-600 hover:bg-teal-700 dark:bg-[#0F6E56] dark:hover:bg-[#085041] disabled:opacity-40 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    {t("sending")}
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    {t("confirmAppointment")}
                  </>
                )}
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-teal-50 dark:bg-[#6fcf9f]/10 border border-teal-100 dark:border-[#6fcf9f]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-teal-600 dark:text-[#6fcf9f]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-[#F5F5F4] mb-1">
                {t("doneTitle")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-[#A8A8A6]">
                {t("doneDesc", { lawyerName })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
