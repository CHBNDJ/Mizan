"use client";
import { useRouter } from "next/navigation";
import { Video, Mic } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  consultationId: string;
  canal: string;
}

export function JoinCallButton({ consultationId, canal }: Props) {
  const router = useRouter();
  const t = useTranslations("joinCallButton");

  const isVideo = canal.startsWith("video");
  const isAudio = canal === "phone";

  if (!isVideo && !isAudio) return null;

  const mode = isAudio ? "audio" : "video";
  const label = isAudio ? t("joinAudio") : t("joinVideo");
  const Icon = isAudio ? Mic : Video;

  return (
    <button
      onClick={() =>
        router.push(`/consultation/${consultationId}/video?mode=${mode}`)
      }
      className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 dark:bg-[#0F6E56] dark:hover:bg-[#085041] text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-all shadow-sm dark:shadow-none"
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
