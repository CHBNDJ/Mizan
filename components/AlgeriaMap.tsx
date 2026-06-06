"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// Correspondance ID wilaya → nom français
const WILAYA_NAMES: Record<string, string> = {
  "01": "Adrar",
  "02": "Chlef",
  "03": "Laghouat",
  "04": "Oum El Bouaghi",
  "05": "Batna",
  "06": "Béjaïa",
  "07": "Biskra",
  "08": "Béchar",
  "09": "Blida",
  "10": "Bouira",
  "11": "Tamanrasset",
  "12": "Tébessa",
  "13": "Tlemcen",
  "14": "Tiaret",
  "15": "Tizi Ouzou",
  "16": "Alger",
  "17": "Djelfa",
  "18": "Jijel",
  "19": "Sétif",
  "20": "Saïda",
  "21": "Skikda",
  "22": "Sidi Bel Abbès",
  "23": "Annaba",
  "24": "Guelma",
  "25": "Constantine",
  "26": "Médéa",
  "27": "Mostaganem",
  "28": "M'Sila",
  "29": "Mascara",
  "30": "Ouargla",
  "31": "Oran",
  "32": "El Bayadh",
  "33": "Illizi",
  "34": "Bordj Bou Arréridj",
  "35": "Boumerdès",
  "36": "El Tarf",
  "37": "Tindouf",
  "38": "Tissemsilt",
  "39": "El Oued",
  "40": "Khenchela",
  "41": "Souk Ahras",
  "42": "Tipaza",
  "43": "Mila",
  "44": "Aïn Defla",
  "45": "Naâma",
  "46": "Aïn Témouchent",
  "47": "Ghardaïa",
  "48": "Relizane",
  "49": "Timimoun",
  "50": "Bordj Badji Mokhtar",
  "51": "Ouled Djellal",
  "52": "Béni Abbès",
  "53": "In Salah",
  "54": "In Guezzam",
  "55": "Touggourt",
  "56": "Djanet",
  "57": "El M'Ghair",
  "58": "El Meniaa",
  "59": "Aflou",
  "60": "El Abiodh Sidi Cheikh",
  "61": "El Aricha",
  "62": "El Kantara",
  "63": "Barika",
  "64": "Bou Saâda",
  "65": "Bir El Ater",
  "66": "Ksar El Boukhari",
  "67": "Ksar Chellala",
  "68": "Aïn Oussera",
  "69": "M'saâd",
};

const NEW_WILAYAS = new Set([
  "49",
  "50",
  "51",
  "52",
  "53",
  "54",
  "55",
  "56",
  "57",
  "58",
  "59",
  "60",
  "61",
  "62",
  "63",
  "64",
  "65",
  "66",
  "67",
  "68",
  "69",
]);

interface AlgeriaMapProps {
  selectedWilaya?: string;
  onSelect: (wilaya: string) => void;
}

export function AlgeriaMap({ selectedWilaya, onSelect }: AlgeriaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  // Charger le SVG depuis /algeria-map.svg (à placer dans /public)
  useEffect(() => {
    fetch("/algeria-map.svg")
      .then((r) => r.text())
      .then((text) => {
        // Extraire le contenu interne du SVG (les paths)
        const match = text.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
        if (match) setSvgContent(match[1]);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const getWilayaIdFromElement = (el: Element | null): string | null => {
    if (!el) return null;
    const path = el.closest("path[id]") as SVGPathElement | null;
    if (!path) return null;
    const id = path.getAttribute("id");
    return id && WILAYA_NAMES[id] ? id : null;
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const id = getWilayaIdFromElement(e.target as Element);
    setHovered(id);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect)
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseLeave = useCallback(() => setHovered(null), []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const id = getWilayaIdFromElement(e.target as Element);
      if (!id) return;
      const name = WILAYA_NAMES[id];
      onSelect(selectedWilaya === name ? "" : name);
    },
    [selectedWilaya, onSelect]
  );

  // Trouver l'ID de la wilaya sélectionnée
  const selectedId = selectedWilaya
    ? Object.entries(WILAYA_NAMES).find(([, v]) => v === selectedWilaya)?.[0]
    : null;

  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-xs font-semibold text-slate-600">
          Sélectionnez une wilaya
        </p>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-teal-300 inline-block" />
            Wilaya
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-200 inline-block" />
            2025
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50"
        style={{ paddingBottom: "97%" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {loaded && svgContent && (
          <svg
            viewBox="0 0 9968 9644.45"
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            style={{ cursor: "pointer" }}
          >
            <defs>
              <style>{`
                #algeria-real-map path {
                  fill: #d1fae5;
                  stroke: #ffffff;
                  stroke-width: 12;
                  transition: fill 0.12s ease;
                }
                #algeria-real-map path.new-wilaya { fill: #fef3c7; }
                #algeria-real-map path.hovered    { fill: #5eead4; }
                #algeria-real-map path.selected   { fill: #0d9488; stroke: #0f766e; stroke-width: 18; }
              `}</style>
            </defs>
            <g
              id="algeria-real-map"
              dangerouslySetInnerHTML={{
                __html: svgContent
                  .replace(/<g[^>]*>|<\/g>/g, "")
                  .replace(/class="cls-1"/g, ""),
              }}
            />
          </svg>
        )}

        {/* Classes dynamiques via un style tag injecté */}
        {(hovered || selectedId) && (
          <style>{`
            ${selectedId ? `#algeria-real-map path#\\3${selectedId.charAt(0)} ${selectedId.slice(1)} { fill: #0d9488 !important; stroke: #0f766e !important; }` : ""}
            ${hovered && hovered !== selectedId ? `#algeria-real-map path#\\3${hovered.charAt(0)} ${hovered.slice(1)} { fill: #5eead4 !important; }` : ""}
          `}</style>
        )}

        {/* Tooltip */}
        {hovered && WILAYA_NAMES[hovered] && (
          <div
            className="absolute pointer-events-none z-10 bg-white border border-teal-200 text-teal-800 text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-md whitespace-nowrap"
            style={{
              left: Math.min(
                tooltipPos.x + 12,
                containerRef.current?.clientWidth
                  ? containerRef.current.clientWidth - 120
                  : tooltipPos.x
              ),
              top: Math.max(tooltipPos.y - 36, 4),
            }}
          >
            {NEW_WILAYAS.has(hovered) && (
              <span className="text-amber-500 mr-1">★</span>
            )}
            {WILAYA_NAMES[hovered]}
          </div>
        )}
      </div>

      {selectedWilaya ? (
        <div className="mt-2 flex items-center justify-between bg-teal-50 border border-teal-200 rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-600" />
            <span className="text-sm font-semibold text-teal-700">
              {selectedWilaya}
            </span>
          </div>
          <button
            onClick={() => onSelect("")}
            className="text-xs text-teal-400 hover:text-teal-600 cursor-pointer transition-colors font-medium"
          >
            Effacer ✕
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center mt-2">
          69 wilayas · frontières officielles
        </p>
      )}
    </div>
  );
}
