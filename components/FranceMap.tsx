"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const REGION_NAMES: Record<string, string> = {
  FRIDF: "Île-de-France",
  FRARA: "Auvergne-Rhône-Alpes",
  FRPAC: "Provence-Alpes-Côte d'Azur",
  FRHDF: "Hauts-de-France",
  FRGES: "Grand Est",
  FROCC: "Occitanie",
  FRNAQ: "Nouvelle-Aquitaine",
  FRBFC: "Bourgogne-Franche-Comté",
  FRNOR: "Normandie",
  FRCVL: "Centre-Val de Loire",
  FRPDL: "Pays de la Loire",
  FRBRE: "Bretagne",
  FR20R: "Corse",
};

interface Props {
  selectedRegion?: string;
  onSelect: (r: string) => void;
  readOnly?: boolean;
  activeRegions?: string[];
}

export function FranceMap({
  selectedRegion,
  onSelect,
  readOnly,
  activeRegions,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/france-map.svg")
      .then((r) => r.text())
      .then((text) => {
        const m = text.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
        if (m) setSvgContent(m[1]);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const getId = (el: Element | null): string | null => {
    const p = el?.closest("[id]") as Element | null;
    const id = p?.getAttribute("id");
    return id && REGION_NAMES[id] ? id : null;
  };

  const activeIds = (activeRegions || [])
    .map(
      (name) => Object.entries(REGION_NAMES).find(([, v]) => v === name)?.[0]
    )
    .filter(Boolean) as string[];

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = containerRef.current?.getBoundingClientRect();
    const id = getId(e.target as Element);
    if (id) {
      setHovered(REGION_NAMES[id]);
      if (r) setTooltipPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    } else {
      setHovered(null);
    }
  }, []);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (readOnly) return;
      const id = getId(e.target as Element);
      if (!id) return;
      const name = REGION_NAMES[id];
      onSelect(selectedRegion === name ? "" : name);
    },
    [selectedRegion, onSelect, readOnly]
  );

  const activeSelector = activeIds.map((id) => `#${id}`).join(",");
  const selectedId = selectedRegion
    ? Object.entries(REGION_NAMES).find(([, v]) => v === selectedRegion)?.[0]
    : null;

  return (
    <div className="relative w-full" ref={containerRef}>
      <style>{`
        #france-real-map path { fill: #e2e8f0; stroke: #fff; stroke-width: 1; transition: fill 0.2s; cursor: ${readOnly ? "default" : "pointer"}; }
        .dark #france-real-map path { fill: #232325; stroke: #1c1c1e; }
        #france-real-map circle, #france-real-map [id="points"], #france-real-map [id="label_points"] { display: none; }
        ${activeSelector ? `#france-real-map :is(${activeSelector}) { fill: #6fcf9f !important; }` : ""}
        ${activeSelector && !readOnly ? `#france-real-map :is(${activeSelector}):hover { fill: #0F6E56 !important; }` : ""}
        ${selectedId ? `#france-real-map #${selectedId} { fill: #0F6E56 !important; }` : ""}
      `}</style>
      <div
        onMouseMove={onMouseMove}
        onMouseLeave={() => setHovered(null)}
        onClick={onClick}
      >
        {loaded && svgContent && (
          <svg
            viewBox="0 0 1000 960"
            id="france-real-map"
            className="w-full h-auto max-h-[800px]"
            xmlns="http://www.w3.org/2000/svg"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
      </div>
      {hovered && (
        <div
          className="pointer-events-none absolute z-50 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-lg whitespace-nowrap"
          style={{ left: tooltipPos.x + 12, top: tooltipPos.y + 12 }}
        >
          {hovered}
        </div>
      )}
    </div>
  );
}
