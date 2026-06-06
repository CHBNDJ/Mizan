"use client";
import { useState } from "react";

// 69 wilayas avec coordonnées optimisées pour la carte
const WILAYAS = [
  // Nord — région côtière
  { id: "16", nom: "Alger", cx: 242, cy: 90, major: true },
  { id: "09", nom: "Blida", cx: 222, cy: 104, major: false },
  { id: "35", nom: "Boumerdès", cx: 260, cy: 86, major: false },
  { id: "42", nom: "Tipaza", cx: 208, cy: 92, major: false },
  { id: "15", nom: "Tizi Ouzou", cx: 274, cy: 86, major: false },
  { id: "06", nom: "Béjaïa", cx: 298, cy: 84, major: false },
  { id: "18", nom: "Jijel", cx: 324, cy: 79, major: false },
  { id: "21", nom: "Skikda", cx: 370, cy: 82, major: false },
  { id: "23", nom: "Annaba", cx: 404, cy: 82, major: true },
  { id: "36", nom: "El Tarf", cx: 420, cy: 88, major: false },
  { id: "31", nom: "Oran", cx: 110, cy: 96, major: true },
  { id: "46", nom: "Aïn Témouchent", cx: 88, cy: 110, major: false },
  { id: "27", nom: "Mostaganem", cx: 152, cy: 98, major: false },
  { id: "02", nom: "Chlef", cx: 196, cy: 106, major: false },
  // Nord — Hauts plateaux
  { id: "13", nom: "Tlemcen", cx: 78, cy: 112, major: false },
  { id: "22", nom: "Sidi Bel Abbès", cx: 106, cy: 134, major: false },
  { id: "29", nom: "Mascara", cx: 142, cy: 128, major: false },
  { id: "48", nom: "Relizane", cx: 162, cy: 118, major: false },
  { id: "38", nom: "Tissemsilt", cx: 192, cy: 128, major: false },
  { id: "44", nom: "Aïn Defla", cx: 202, cy: 112, major: false },
  { id: "26", nom: "Médéa", cx: 226, cy: 118, major: false },
  { id: "10", nom: "Bouira", cx: 258, cy: 100, major: false },
  { id: "34", nom: "Bordj Bou Arréridj", cx: 298, cy: 126, major: false },
  { id: "19", nom: "Sétif", cx: 322, cy: 116, major: true },
  { id: "43", nom: "Mila", cx: 352, cy: 104, major: false },
  { id: "25", nom: "Constantine", cx: 372, cy: 108, major: true },
  { id: "04", nom: "Oum El Bouaghi", cx: 356, cy: 118, major: false },
  { id: "24", nom: "Guelma", cx: 390, cy: 106, major: false },
  { id: "41", nom: "Souk Ahras", cx: 414, cy: 108, major: false },
  { id: "05", nom: "Batna", cx: 360, cy: 146, major: false },
  { id: "40", nom: "Khenchela", cx: 394, cy: 144, major: false },
  { id: "12", nom: "Tébessa", cx: 422, cy: 154, major: false },
  { id: "20", nom: "Saïda", cx: 132, cy: 148, major: false },
  { id: "14", nom: "Tiaret", cx: 175, cy: 144, major: false },
  { id: "45", nom: "Naâma", cx: 88, cy: 192, major: false },
  // Hauts plateaux sud
  { id: "17", nom: "Djelfa", cx: 248, cy: 182, major: false },
  { id: "28", nom: "M'Sila", cx: 292, cy: 166, major: false },
  { id: "07", nom: "Biskra", cx: 338, cy: 196, major: false },
  { id: "32", nom: "El Bayadh", cx: 150, cy: 212, major: false },
  { id: "03", nom: "Laghouat", cx: 230, cy: 216, major: false },
  // Nouvelles wilayas Hauts Plateaux 2025
  { id: "59", nom: "Aflou", cx: 210, cy: 230, major: false },
  { id: "61", nom: "Ksar Chellala", cx: 208, cy: 158, major: false },
  { id: "63", nom: "Aïn Oussera", cx: 232, cy: 162, major: false },
  { id: "68", nom: "Ksar El Boukhari", cx: 222, cy: 150, major: false },
  { id: "62", nom: "Messaad", cx: 262, cy: 202, major: false },
  { id: "64", nom: "Boussaâda", cx: 298, cy: 188, major: false },
  { id: "60", nom: "Barika", cx: 348, cy: 162, major: false },
  { id: "66", nom: "El Kantara", cx: 348, cy: 212, major: false },
  { id: "67", nom: "Bir El Ater", cx: 418, cy: 174, major: false },
  { id: "69", nom: "El Aricha", cx: 72, cy: 142, major: false },
  { id: "65", nom: "El Abiodh Sidi Cheikh", cx: 138, cy: 248, major: false },
  // Sahara nord
  { id: "08", nom: "Béchar", cx: 80, cy: 260, major: false },
  { id: "47", nom: "Ghardaïa", cx: 258, cy: 258, major: false },
  { id: "39", nom: "El Oued", cx: 382, cy: 242, major: false },
  { id: "30", nom: "Ouargla", cx: 322, cy: 290, major: false },
  // Nouvelles wilayas Sahara
  { id: "51", nom: "Ouled Djellal", cx: 312, cy: 220, major: false },
  { id: "49", nom: "El M'Ghair", cx: 368, cy: 218, major: false },
  { id: "55", nom: "Touggourt", cx: 352, cy: 258, major: false },
  // Grand Sahara
  { id: "37", nom: "Tindouf", cx: 42, cy: 324, major: false },
  { id: "01", nom: "Adrar", cx: 128, cy: 382, major: false },
  { id: "53", nom: "Béni Abbès", cx: 80, cy: 308, major: false },
  { id: "54", nom: "Timimoun", cx: 150, cy: 324, major: false },
  { id: "50", nom: "El Meniaa", cx: 230, cy: 324, major: false },
  { id: "11", nom: "Tamanrasset", cx: 254, cy: 502, major: false },
  { id: "33", nom: "Illizi", cx: 432, cy: 392, major: false },
  { id: "57", nom: "In Salah", cx: 210, cy: 412, major: false },
  { id: "56", nom: "Djanet", cx: 442, cy: 454, major: false },
  { id: "52", nom: "Bordj Badji Mokhtar", cx: 110, cy: 474, major: false },
  { id: "58", nom: "In Guezzam", cx: 240, cy: 552, major: false },
];

const MAJOR_LABELS = ["Alger", "Oran", "Constantine", "Annaba", "Sétif"];
const isNew = (id: string) => parseInt(id) >= 59;

interface Props {
  selectedWilaya?: string;
  onSelect: (w: string) => void;
}

export function AlgeriaMapV2({ selectedWilaya, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="w-full select-none">
      {/* Légende */}
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-xs font-semibold text-slate-600">
          Sélectionnez une wilaya
        </p>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block" />
            Wilaya
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-300 inline-block" />
            2025
          </span>
        </div>
      </div>

      {/* SVG Map */}
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-slate-100"
        style={{ paddingBottom: "115%" }}
      >
        <svg
          viewBox="0 0 480 600"
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(170deg,#e0f2fe 0%,#f0fdf4 40%,#fefce8 100%)",
          }}
        >
          {/* Algérie outline */}
          <path
            d="M68,58 L82,52 L105,48 L148,46 L192,43 L235,40 L272,40 L308,43 L345,49 L384,56 L422,66 L442,82 L446,102 L442,124 L434,142 L436,172 L442,204 L446,234 L446,262 L440,292 L422,314 L402,342 L382,372 L370,404 L350,444 L328,486 L308,524 L288,558 L268,568 L250,570 L230,562 L210,548 L190,524 L168,494 L148,462 L128,432 L108,402 L88,370 L68,342 L54,312 L44,280 L40,250 L42,220 L46,190 L52,160 L58,128 L62,100 L66,76 Z"
            fill="white"
            fillOpacity="0.7"
            stroke="#99f6e4"
            strokeWidth="1.5"
          />
          {/* Sahara zone */}
          <path
            d="M54,252 L88,237 L188,228 L288,226 L388,234 L442,254 L446,284 L422,314 L402,342 L382,372 L370,404 L350,444 L288,558 L250,570 L210,548 L168,494 L128,432 L88,370 L54,312 L40,272 Z"
            fill="#fefce8"
            fillOpacity="0.5"
            stroke="none"
          />
          {/* Nord / côte highlight */}
          <path
            d="M68,58 L422,66 L446,102 L442,124 L140,124 L68,58 Z"
            fill="#e0f2fe"
            fillOpacity="0.3"
            stroke="none"
          />

          {/* Mer Méditerranée */}
          <text
            x="240"
            y="26"
            textAnchor="middle"
            fontSize="8"
            fill="#0891b2"
            opacity="0.4"
            fontStyle="italic"
          >
            Mer Méditerranée
          </text>

          {/* Wilayas */}
          {WILAYAS.map((w) => {
            const sel = selectedWilaya === w.nom;
            const hov = hovered === w.nom;
            const newW = isNew(w.id);
            const majr = MAJOR_LABELS.includes(w.nom);

            const r = sel ? 8 : hov ? 7 : majr ? 5.5 : newW ? 4 : 3.5;
            const fill = sel
              ? "#0D9488"
              : hov
                ? "#14B8A6"
                : newW
                  ? "#d8b4fe"
                  : majr
                    ? "#5eead4"
                    : "#99f6e4";
            const stroke = sel
              ? "#0D9488"
              : hov
                ? "#14B8A6"
                : newW
                  ? "#a855f7"
                  : "#34d399";
            const sw = sel || hov ? 1.5 : 0.8;

            return (
              <g
                key={w.id}
                style={{ cursor: "pointer" }}
                onClick={() => onSelect(sel ? "" : w.nom)}
                onMouseEnter={() => setHovered(w.nom)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Zone de clic élargie invisible */}
                <circle cx={w.cx} cy={w.cy} r={12} fill="transparent" />

                {/* Halo sélection */}
                {sel && (
                  <circle
                    cx={w.cx}
                    cy={w.cy}
                    r={14}
                    fill="#0D9488"
                    opacity={0.12}
                  />
                )}

                {/* Point */}
                <circle
                  cx={w.cx}
                  cy={w.cy}
                  r={r}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={sw}
                  style={{ transition: "all 0.15s ease" }}
                />

                {/* Label major toujours visible */}
                {majr && !sel && !hov && (
                  <text
                    x={w.cx}
                    y={w.cy - 7}
                    textAnchor="middle"
                    fontSize="5.5"
                    fontWeight="600"
                    fill="#0F766E"
                    style={{ pointerEvents: "none" }}
                  >
                    {w.nom}
                  </text>
                )}

                {/* Label hover/selected */}
                {(sel || hov) && (
                  <>
                    <rect
                      x={w.cx - 28}
                      y={w.cy - 20}
                      width={56}
                      height={12}
                      rx={3}
                      fill="white"
                      fillOpacity="0.92"
                      stroke="#99f6e4"
                      strokeWidth="0.5"
                    />
                    <text
                      x={w.cx}
                      y={w.cy - 11}
                      textAnchor="middle"
                      fontSize="6"
                      fontWeight="700"
                      fill={sel ? "#0D9488" : "#0F766E"}
                      style={{ pointerEvents: "none" }}
                    >
                      {w.nom}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Wilaya sélectionnée */}
      {selectedWilaya ? (
        <div className="mt-2 flex items-center justify-between bg-teal-50 border border-teal-200 rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="text-sm font-semibold text-teal-700">
              {selectedWilaya}
            </span>
          </div>
          <button
            onClick={() => onSelect("")}
            className="text-xs text-teal-400 hover:text-teal-600 font-medium cursor-pointer transition-colors"
          >
            Effacer ✕
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center mt-2">
          69 wilayas · cliquez sur la carte
        </p>
      )}
    </div>
  );
}
