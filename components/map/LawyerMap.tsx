"use client";

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
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  if (!address) return null;

  if (!key) {
    return (
      <div className="flex items-center justify-center h-32 bg-slate-50 text-xs text-slate-400 border-t border-slate-100">
        Clé Google Maps manquante — vérifier NEXT_PUBLIC_GOOGLE_MAPS_KEY
      </div>
    );
  }

  const base = "https://www.google.com/maps/embed/v1/place";
  const planUrl = `${base}?key=${key}&q=${encodeURIComponent(address)}&zoom=15&language=fr`;
  const satUrl = `${base}?key=${key}&q=${encodeURIComponent(address)}&zoom=15&maptype=satellite&language=fr`;

  return (
    <div>
      <div className="relative w-full h-52 sm:h-64 bg-slate-100">
        {/* Iframe Plan par défaut — satellite se charge via switcher */}
        <iframe
          id="mizan-map-plan"
          src={planUrl}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          title="Localisation du cabinet"
          style={{ display: "block" }}
        />
        <iframe
          id="mizan-map-sat"
          src={satUrl}
          className="w-full h-full border-0 absolute inset-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          title="Localisation du cabinet satellite"
          style={{ display: "none" }}
        />

        {/* Switcher Plan / Satellite */}
        <div className="absolute top-2 left-2 z-10 flex rounded-lg overflow-hidden border border-slate-200 shadow-sm text-[11px] font-semibold">
          <button
            id="btn-plan"
            className="px-3 py-1 cursor-pointer bg-white text-slate-800 transition-colors"
            onClick={() => {
              const p = document.getElementById(
                "mizan-map-plan"
              ) as HTMLIFrameElement;
              const s = document.getElementById(
                "mizan-map-sat"
              ) as HTMLIFrameElement;
              const bp = document.getElementById("btn-plan")!;
              const bs = document.getElementById("btn-sat")!;
              if (p) p.style.display = "block";
              if (s) s.style.display = "none";
              bp.className =
                "px-3 py-1 cursor-pointer bg-white text-slate-800 transition-colors";
              bs.className =
                "px-3 py-1 cursor-pointer border-l border-slate-200 bg-slate-100 text-slate-400 hover:bg-white transition-colors";
            }}
          >
            Plan
          </button>
          <button
            id="btn-sat"
            className="px-3 py-1 cursor-pointer border-l border-slate-200 bg-slate-100 text-slate-400 hover:bg-white transition-colors"
            onClick={() => {
              const p = document.getElementById(
                "mizan-map-plan"
              ) as HTMLIFrameElement;
              const s = document.getElementById(
                "mizan-map-sat"
              ) as HTMLIFrameElement;
              const bp = document.getElementById("btn-plan")!;
              const bs = document.getElementById("btn-sat")!;
              if (p) p.style.display = "none";
              if (s) s.style.display = "block";
              bp.className =
                "px-3 py-1 cursor-pointer bg-slate-100 text-slate-400 hover:bg-white transition-colors";
              bs.className =
                "px-3 py-1 cursor-pointer border-l border-slate-200 bg-white text-slate-800 transition-colors";
            }}
          >
            Satellite
          </button>
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
