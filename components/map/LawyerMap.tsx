"use client";
import { useEffect, useRef, useState } from "react";

interface LawyerMapProps {
  address: string; // adresse texte à géocoder
  showContact?: boolean; // connecté → bouton "Ouvrir dans Maps"
  googleMapsUrl?: string; // URL google.com/maps pour le bouton connecté
  onLockedClick?: () => void;
}

// Marker rouge SVG Mizan — aucun label, aucun texte
const RED_MARKER_SVG = `
<svg width="24" height="36" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 24 12 24S24 20.4 24 12C24 5.4 18.6 0 12 0z" fill="#e24b4a"/>
  <circle cx="12" cy="12" r="5" fill="white"/>
</svg>`;

export default function LawyerMap({
  address,
  showContact = false,
  googleMapsUrl,
  onLockedClick,
}: LawyerMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [layer, setLayer] = useState<"plan" | "satellite">("plan");
  const layerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [error, setError] = useState(false);

  // Geocodage Nominatim (gratuit, sans clé API)
  useEffect(() => {
    if (!address) return;
    const q = encodeURIComponent(address);
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`,
      {
        headers: { "Accept-Language": "fr" },
      }
    )
      .then((r) => r.json())
      .then((data) => {
        if (data?.[0]) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [address]);

  // Init Leaflet dès qu'on a les coordonnées
  useEffect(() => {
    if (!coords || !mapRef.current || mapInstance.current) return;

    import("leaflet").then((L) => {
      // Leaflet CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
        document.head.appendChild(link);
      }

      const map = (L as any)
        .map(mapRef.current, {
          zoomControl: true,
          attributionControl: false,
          scrollWheelZoom: false,
        })
        .setView(coords, 15);

      // Tile Plan (OSM)
      const planTile = (L as any).tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { maxZoom: 19 }
      );

      // Tile Satellite (Esri — gratuit)
      const satTile = (L as any).tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19 }
      );

      planTile.addTo(map);
      layerRef.current = { plan: planTile, satellite: satTile, L, map };

      // Marker rouge custom — aucun label
      const icon = (L as any).divIcon({
        html: RED_MARKER_SVG,
        className: "",
        iconSize: [24, 36],
        iconAnchor: [12, 36],
      });
      (L as any).marker(coords, { icon }).addTo(map);

      mapInstance.current = map;
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [coords]);

  // Switcher Plan / Satellite
  const switchLayer = (mode: "plan" | "satellite") => {
    if (!layerRef.current || mode === layer) return;
    const { plan, satellite, map } = layerRef.current;
    if (mode === "satellite") {
      map.removeLayer(plan);
      satellite.addTo(map);
    } else {
      map.removeLayer(satellite);
      plan.addTo(map);
    }
    setLayer(mode);
  };

  // Plein écran
  const handleFullscreen = () => {
    if (!mapRef.current) return;
    document.fullscreenElement
      ? document.exitFullscreen()
      : mapRef.current.requestFullscreen?.();
  };

  if (error) return null;

  return (
    <div>
      {/* Carte */}
      <div className="relative w-full h-52 sm:h-64 bg-slate-100">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-100">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-600 border-t-transparent" />
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />

        {/* Switcher Plan / Satellite */}
        <div className="absolute top-2 left-2 z-[400] flex rounded-lg overflow-hidden border border-slate-300 shadow-sm">
          <button
            onClick={() => switchLayer("plan")}
            className={`px-2.5 py-1 text-[11px] font-semibold cursor-pointer transition-colors ${
              layer === "plan"
                ? "bg-white text-slate-800"
                : "bg-slate-100 text-slate-500 hover:bg-white"
            }`}
          >
            Plan
          </button>
          <button
            onClick={() => switchLayer("satellite")}
            className={`px-2.5 py-1 text-[11px] font-semibold cursor-pointer transition-colors border-l border-slate-300 ${
              layer === "satellite"
                ? "bg-white text-slate-800"
                : "bg-slate-100 text-slate-500 hover:bg-white"
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Bouton plein écran */}
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

      {/* Bouton bas — connecté : ouvrir Maps / non-connecté : lock */}
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
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Connectez-vous pour l'itinéraire
        </button>
      )}
    </div>
  );
}
