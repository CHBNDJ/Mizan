"use client";
import { useState, useEffect, useRef, useCallback } from "react";

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

interface Props {
  selectedWilaya?: string;
  onSelect: (w: string) => void;
  onSelectAndSearch?: (w: string) => void;
  hideBar?: boolean;
}

export function AlgeriaMap({
  selectedWilaya,
  onSelect,
  onSelectAndSearch,
  hideBar,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/algeria-map.svg")
      .then((r) => r.text())
      .then((text) => {
        const m = text.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
        if (m) setSvgContent(m[1]);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const getId = (el: Element | null): string | null => {
    const p = el?.closest("path[id]") as SVGPathElement | null;
    const id = p?.getAttribute("id");
    return id && WILAYA_NAMES[id] ? id : null;
  };

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setHovered(getId(e.target as Element));
    const r = containerRef.current?.getBoundingClientRect();
    if (r) setTooltipPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const id = getId(e.target as Element);
      if (!id) return;
      const name = WILAYA_NAMES[id];
      if (onSelectAndSearch) {
        onSelectAndSearch(name);
        return;
      }
      onSelect(selectedWilaya === name ? "" : name);
    },
    [selectedWilaya, onSelect, onSelectAndSearch]
  );

  const selId = selectedWilaya
    ? Object.entries(WILAYA_NAMES).find(([, v]) => v === selectedWilaya)?.[0]
    : null;

  const cssId = (id: string | null) =>
    id ? `#algeria-real-map path#\\3${id.charAt(0)} ${id.slice(1)}` : null;

  const isLanding = !!onSelectAndSearch;

  return (
    <div className="w-full select-none">
      <p className="text-xs font-semibold text-slate-600 mb-2">
        {isLanding
          ? "Cliquez sur une wilaya pour rechercher"
          : "Sélectionnez une wilaya"}
      </p>

      <div
        ref={containerRef}
        className="relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50"
        style={{ paddingBottom: "97%" }}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setHovered(null)}
        onClick={onClick}
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
            style={{ cursor: "pointer" }}
          >
            <defs>
              <style>{`
                #algeria-real-map path {
                  fill: #d1fae5; stroke: #ffffff; stroke-width: 12;
                  transition: fill 0.12s ease;
                }
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

        {(hovered || selId) && (
          <style>{`
            ${selId ? `${cssId(selId)}  { fill: #0d9488 !important; stroke: #0f766e !important; stroke-width: 18 !important; }` : ""}
            ${hovered && hovered !== selId ? `${cssId(hovered)} { fill: #5eead4 !important; }` : ""}
          `}</style>
        )}

        {hovered && WILAYA_NAMES[hovered] && (
          <div
            className="absolute pointer-events-none z-10 bg-white border border-teal-200 text-teal-800 text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-md whitespace-nowrap"
            style={{
              left: Math.min(
                tooltipPos.x + 12,
                (containerRef.current?.clientWidth ?? 300) - 130
              ),
              top: Math.max(tooltipPos.y - 36, 4),
            }}
          >
            {WILAYA_NAMES[hovered]}
            {isLanding && (
              <span className="ml-1 text-teal-400 text-[10px]">
                → rechercher
              </span>
            )}
          </div>
        )}
      </div>

      {!isLanding &&
        !hideBar &&
        (selectedWilaya ? (
          <div className="mt-2 flex items-center justify-between bg-teal-50 border border-teal-200 rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-600" />
              <span className="text-sm font-semibold text-teal-700">
                {selectedWilaya}
              </span>
            </div>
            <button
              onClick={() => onSelect("")}
              className="text-xs text-teal-400 hover:text-teal-600 cursor-pointer font-medium"
            >
              Effacer ✕
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center mt-2">
            Cliquez sur une wilaya pour filtrer
          </p>
        ))}
    </div>
  );
}
