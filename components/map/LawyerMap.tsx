"use client";
import { useRef } from "react";

interface Props {
  address: string;
  showContact?: boolean;
  googleMapsUrl?: string;
  onLockedClick?: () => void;
}

export default function LawyerMap({
  address,
  showContact = false,
  googleMapsUrl,
  onLockedClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  if (!address) return null;

  if (!key) {
    return (
      <div className="flex items-center justify-center h-32 bg-slate-50 text-xs text-slate-400 dark:text-[#7A7A78] border-t border-slate-100 dark:border-[#1c2220]">
        Clé Google Maps manquante
      </div>
    );
  }

  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${key}&q=${encodeURIComponent(address)}&zoom=15&language=fr`;

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    document.fullscreenElement
      ? document.exitFullscreen()
      : containerRef.current.requestFullscreen?.();
  };

  return (
    <div>
      <div
        ref={containerRef}
        className="relative w-full h-52 sm:h-64 bg-slate-100"
      >
        <iframe
          src={embedUrl}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          title="Localisation du cabinet"
        />

        <button
          onClick={handleFullscreen}
          title="Agrandir"
          className="absolute top-2 right-2 w-8 h-8 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-[#1c2220] rounded-lg shadow-sm dark:shadow-none flex items-center justify-center z-10 cursor-pointer hover:border-teal-300 dark:hover:border-[#6fcf9f] hover:text-teal-600 transition-colors text-slate-500 dark:text-[#A8A8A6]"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
      </div>

      {showContact && googleMapsUrl ? (
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 text-xs font-medium text-slate-600 dark:text-[#E8E8E6] hover:bg-slate-50 transition-colors border-t border-slate-100 dark:border-[#1c2220]"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Ouvrir dans Google Maps · Itinéraire
        </a>
      ) : (
        <button
          onClick={onLockedClick}
          className="w-full flex items-center justify-center gap-2 py-3 text-xs font-medium text-slate-400 dark:text-[#7A7A78] hover:bg-slate-50 transition-colors border-t border-slate-100 dark:border-[#1c2220] cursor-pointer"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Connectez-vous pour l'itinéraire
        </button>
      )}
    </div>
  );
}
