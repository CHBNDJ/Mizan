"use client";
import { useEffect, useState } from "react";

interface Props {
  address: string;
  showContact?: boolean;
  googleMapsUrl?: string;
  onLockedClick?: () => void;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

export default function LawyerMap({
  address,
  showContact = false,
  googleMapsUrl,
  onLockedClick,
}: Props) {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [layer, setLayer] = useState<"plan" | "satellite">("plan");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Géocodage Nominatim → coordonnées → embed Google avec pin propre sans label
  useEffect(() => {
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      { headers: { "Accept-Language": "fr" } }
    )
      .then((r) => r.json())
      .then((data) => {
        if (!data?.[0]) {
          setError(true);
          setLoading(false);
          return;
        }
        setCoords({
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        });
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [address]);

  // URL embed Google Maps Embed API — coordonnées = pin rouge sans texte parasite
  const embedUrl = coords
    ? `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${coords.lat},${coords.lon}&zoom=15&maptype=${layer === "satellite" ? "satellite" : "roadmap"}&language=fr`
    : null;

  if (error) return null;

  return (
    <div>
      <div className="relative w-full h-52 sm:h-64 bg-slate-100">
        {(loading || !embedUrl) && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-100">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-600 border-t-transparent" />
          </div>
        )}

        {embedUrl && (
          <iframe
            key={`${coords?.lat}-${coords?.lon}-${layer}`}
            src={embedUrl}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            title="Localisation du cabinet"
          />
        )}

        {/* Switcher Plan / Satellite */}
        <div className="absolute top-2 left-2 z-10 flex rounded-lg overflow-hidden border border-slate-200 shadow-sm text-[11px] font-semibold">
          {(["plan", "satellite"] as const).map((m, i) => (
            <button
              key={m}
              onClick={() => setLayer(m)}
              className={`px-3 py-1 cursor-pointer transition-colors
                ${i === 1 ? "border-l border-slate-200" : ""}
                ${
                  layer === m
                    ? "bg-white text-slate-800"
                    : "bg-slate-100 text-slate-400 hover:bg-white"
                }`}
            >
              {m === "plan" ? "Plan" : "Satellite"}
            </button>
          ))}
        </div>
      </div>

      {/* Bouton bas */}
      {showContact && googleMapsUrl ? (
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-100"
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
          className="w-full flex items-center justify-center gap-2 py-3 text-xs font-medium text-slate-400 hover:bg-slate-50 transition-colors border-t border-slate-100 cursor-pointer"
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
