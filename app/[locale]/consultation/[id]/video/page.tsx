"use client";
import { use, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Video, X, Phone } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VideoConsultationPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();
  const t = useTranslations("videoConsultation");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [consultation, setConsultation] = useState<any>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadConsultation();
  }, [user, id]);

  const loadConsultation = async () => {
    try {
      const { data: consult, error: err } = await supabase
        .from("consultations")
        .select(
          "*, lawyer:lawyer_id(first_name, last_name, profession), client:client_id(first_name, last_name)"
        )
        .eq("id", id)
        .single();

      if (err || !consult) {
        setError(t("notFound"));
        setLoading(false);
        return;
      }
      if (
        !user ||
        (user.id !== consult.lawyer_id && user.id !== consult.client_id)
      ) {
        setError(t("unauthorized"));
        setLoading(false);
        return;
      }

      setConsultation(consult);
      const room = await getOrCreateDailyRoom(id);
      setRoomUrl(room);
    } catch {
      setError(t("loadError"));
    } finally {
      setLoading(false);
    }
  };

  const getOrCreateDailyRoom = async (consultId: string): Promise<string> => {
    const { data: existing } = await supabase
      .from("consultation_rooms")
      .select("room_url")
      .eq("consultation_id", consultId)
      .maybeSingle();

    if (existing?.room_url) return existing.room_url;
    const res = await fetch("/api/daily/create-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consultationId: consultId }),
    });
    const data = await res.json();
    return data.url;
  };

  const handleLeave = async () => {
    await supabase
      .from("consultations")
      .update({ status: "completed", updated_at: new Date().toISOString() })
      .eq("id", id);

    const isLawyerUser = user?.id === consultation?.lawyer_id;
    router.push(isLawyerUser ? "/lawyer/consultations" : "/mes-consultations");
  };

  if (!user)
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white">{t("loginRequired")}</p>
      </div>
    );

  if (loading)
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300 text-sm">{t("connecting")}</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="bg-slate-800 rounded-2xl p-8 text-center max-w-sm w-full">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-white font-semibold mb-2">{error}</p>
          <button
            onClick={() => router.push("/mes-consultations")}
            className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
          >
            {t("backToConsultations")}
          </button>
        </div>
      </div>
    );

  const isLawyer = user.id === consultation?.lawyer_id;
  const otherPerson = isLawyer ? consultation?.client : consultation?.lawyer;
  const otherName = otherPerson
    ? `${otherPerson.first_name} ${otherPerson.last_name}`
    : t("participantFallback");

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <Video className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{t("title")}</p>
            <p className="text-slate-400 text-xs">{otherName}</p>
          </div>
        </div>
        <button
          onClick={handleLeave}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium cursor-pointer"
        >
          <Phone className="w-4 h-4 rotate-[135deg]" />
          <span className="hidden sm:inline">{t("end")}</span>
        </button>
      </div>

      <div className="flex-1 relative">
        {!joined ? (
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="bg-slate-800 rounded-2xl p-8 text-center max-w-sm w-full">
              <div className="w-16 h-16 bg-teal-600/20 border border-teal-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <Video className="w-8 h-8 text-teal-400" />
              </div>
              <p className="text-white font-semibold text-lg mb-2">
                {t("readyToJoin")}
              </p>
              <p className="text-slate-400 text-sm mb-6">
                {t("consultationWith")}{" "}
                <span className="text-white font-medium">{otherName}</span>
              </p>
              <button
                onClick={() => setJoined(true)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-semibold text-sm cursor-pointer"
              >
                {t("joinConsultation")}
              </button>
              <p className="text-slate-500 text-xs mt-4">
                {t("cameraMicNote")}
              </p>
            </div>
          </div>
        ) : roomUrl ? (
          <iframe
            ref={iframeRef}
            src={`${roomUrl}?embed=1`}
            className="w-full h-full border-0"
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            style={{ minHeight: "calc(100vh - 65px)" }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-slate-400">{t("roomLoadError")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
