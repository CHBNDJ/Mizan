"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LawyerMapProps {
  address: string;
  showContact?: boolean;
  googleMapsUrl?: string;
  onLockedClick?: () => void;
}

const RED_ICON = L.divIcon({
  html: `<svg width="24" height="36" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 24 12 24S24 20.4 24 12C24 5.4 18.6 0 12 0z" fill="#e24b4a"/>
    <circle cx="12" cy="12" r="5" fill="white"/>
  </svg>`,
  className: "",
  iconSize: [24, 36],
  iconAnchor: [12, 36],
});

export default function LawyerMap({
  address,
  showContact = false,
  googleMapsUrl,
  onLockedClick,
}: LawyerMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const planRef = useRef<L.TileLayer | null>(null);
  const satRef = useRef<L.TileLayer | null>(null);
  const [layer, setLayer] = useState<"plan" | "satellite">("plan");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Geocode via Nominatim
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      { headers: { "Accept-Language": "fr" } }
    )
      .then((r) => r.json())
      .then((data) => {
        if (!data?.[0]) {
          setError(true);
          return;
        }

        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        const map = L.map(containerRef.current!, {
          zoomControl: true,
          attributionControl: false,
          scrollWheelZoom: false,
        }).setView([lat, lon], 15);

        const plan = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          { maxZoom: 19 }
        ).addTo(map);

        const sat = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          { maxZoom: 19 }
        );

        L.marker([lat, lon], { icon: RED_ICON }).addTo(map);

        mapRef.current = map;
        planRef.current = plan;
        satRef.current = sat;
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [address]);

  const switchLayer = (mode: "plan" | "satellite") => {
    if (!mapRef.current || mode === layer) return;
    if (mode === "satellite") {
      planRef.current && mapRef.current.removeLayer(planRef.current);
      satRef.current?.addTo(mapRef.current);
    } else {
      satRef.current && mapRef.current.removeLayer(satRef.current);
      planRef.current?.addTo(mapRef.current);
    }
    setLayer(mode);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    document.fullscreenElement
      ? document.exitFullscreen()
      : containerRef.current.requestFullscreen?.();
  };

  if (error) return null;

  return (
    <div>
      <div className="relative w-full h-52 sm:h-64 bg-slate-100">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-[400] bg-slate-100">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-600 border-t-transparent" />
          </div>
        )}

        <div ref={containerRef} className="w-full h-full" />

        {/* Switcher Plan / Satellite */}
        <div className="absolute top-2 left-2 z-[400] flex rounded-lg overflow-hidden border border-slate-300 shadow-sm">
          {(["plan", "satellite"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => switchLayer(mode)}
              className={`px-2.5 py-1 text-[11px] font-semibold cursor-pointer transition-colors
                ${mode === "satellite" ? "border-l border-slate-300" : ""}
                ${layer === mode ? "bg-white text-slate-800" : "bg-slate-100 text-slate-500 hover:bg-white"}`}
            >
              {mode === "plan" ? "Plan" : "Satellite"}
            </button>
          ))}
        </div>

        {/* Plein écran */}
        <button
          onClick={handleFullscreen}
          className="absolute top-2 right-2 w-8 h-8 bg-white border border-slate-300 rounded-lg shadow-sm flex items-center justify-center z-[400] cursor-pointer hover:border-teal-300 hover:text-teal-600 transition-colors text-slate-500"
          title="Agrandir"
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

      {/* Bouton bas */}
      {showContact && googleMapsUrl ? (
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-3 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-100"
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
          Ouvrir dans Google Maps
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
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Connectez-vous pour l'itinéraire
        </button>
      )}
    </div>
  );
}
