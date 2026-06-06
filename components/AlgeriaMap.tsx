"use client";
import { useState } from "react";

const WILAYAS_DATA = [
  { id: "01", nom: "Adrar", cx: 130, cy: 380 },
  { id: "02", nom: "Chlef", cx: 195, cy: 108 },
  { id: "03", nom: "Laghouat", cx: 230, cy: 215 },
  { id: "04", nom: "Oum El Bouaghi", cx: 355, cy: 120 },
  { id: "05", nom: "Batna", cx: 360, cy: 148 },
  { id: "06", nom: "Béjaïa", cx: 295, cy: 88 },
  { id: "07", nom: "Biskra", cx: 338, cy: 198 },
  { id: "08", nom: "Béchar", cx: 80, cy: 260 },
  { id: "09", nom: "Blida", cx: 218, cy: 100 },
  { id: "10", nom: "Bouira", cx: 258, cy: 100 },
  { id: "11", nom: "Tamanrasset", cx: 255, cy: 500 },
  { id: "12", nom: "Tébessa", cx: 422, cy: 155 },
  { id: "13", nom: "Tlemcen", cx: 80, cy: 110 },
  { id: "14", nom: "Tiaret", cx: 175, cy: 145 },
  { id: "15", nom: "Tizi Ouzou", cx: 272, cy: 88 },
  { id: "16", nom: "Alger", cx: 240, cy: 86 },
  { id: "17", nom: "Djelfa", cx: 248, cy: 182 },
  { id: "18", nom: "Jijel", cx: 322, cy: 82 },
  { id: "19", nom: "Sétif", cx: 322, cy: 118 },
  { id: "20", nom: "Saïda", cx: 132, cy: 148 },
  { id: "21", nom: "Skikda", cx: 368, cy: 84 },
  { id: "22", nom: "Sidi Bel Abbès", cx: 106, cy: 135 },
  { id: "23", nom: "Annaba", cx: 402, cy: 84 },
  { id: "24", nom: "Guelma", cx: 388, cy: 108 },
  { id: "25", nom: "Constantine", cx: 372, cy: 110 },
  { id: "26", nom: "Médéa", cx: 226, cy: 118 },
  { id: "27", nom: "Mostaganem", cx: 152, cy: 100 },
  { id: "28", nom: "M'Sila", cx: 292, cy: 168 },
  { id: "29", nom: "Mascara", cx: 142, cy: 128 },
  { id: "30", nom: "Ouargla", cx: 322, cy: 290 },
  { id: "31", nom: "Oran", cx: 112, cy: 98 },
  { id: "32", nom: "El Bayadh", cx: 150, cy: 212 },
  { id: "33", nom: "Illizi", cx: 432, cy: 390 },
  { id: "34", nom: "Bordj Bou Arréridj", cx: 298, cy: 128 },
  { id: "35", nom: "Boumerdès", cx: 258, cy: 84 },
  { id: "36", nom: "El Tarf", cx: 418, cy: 90 },
  { id: "37", nom: "Tindouf", cx: 44, cy: 322 },
  { id: "38", nom: "Tissemsilt", cx: 192, cy: 128 },
  { id: "39", nom: "El Oued", cx: 382, cy: 242 },
  { id: "40", nom: "Khenchela", cx: 392, cy: 145 },
  { id: "41", nom: "Souk Ahras", cx: 412, cy: 110 },
  { id: "42", nom: "Tipaza", cx: 208, cy: 90 },
  { id: "43", nom: "Mila", cx: 352, cy: 106 },
  { id: "44", nom: "Aïn Defla", cx: 202, cy: 110 },
  { id: "45", nom: "Naâma", cx: 90, cy: 192 },
  { id: "46", nom: "Aïn Témouchent", cx: 90, cy: 112 },
  { id: "47", nom: "Ghardaïa", cx: 258, cy: 258 },
  { id: "48", nom: "Relizane", cx: 162, cy: 118 },
  { id: "49", nom: "El M'Ghair", cx: 368, cy: 218 },
  { id: "50", nom: "El Meniaa", cx: 232, cy: 322 },
  { id: "51", nom: "Ouled Djellal", cx: 312, cy: 220 },
  { id: "52", nom: "Bordj Badji Mokhtar", cx: 112, cy: 472 },
  { id: "53", nom: "Béni Abbès", cx: 82, cy: 308 },
  { id: "54", nom: "Timimoun", cx: 152, cy: 322 },
  { id: "55", nom: "Touggourt", cx: 352, cy: 258 },
  { id: "56", nom: "Djanet", cx: 442, cy: 452 },
  { id: "57", nom: "In Salah", cx: 212, cy: 410 },
  { id: "58", nom: "In Guezzam", cx: 242, cy: 550 },
  { id: "59", nom: "Aflou", cx: 210, cy: 228 },
  { id: "60", nom: "Barika", cx: 348, cy: 162 },
  { id: "61", nom: "Ksar Chellala", cx: 208, cy: 158 },
  { id: "62", nom: "Messaad", cx: 262, cy: 202 },
  { id: "63", nom: "Aïn Oussera", cx: 232, cy: 162 },
  { id: "64", nom: "Boussaâda", cx: 298, cy: 188 },
  { id: "65", nom: "El Abiodh Sidi Cheikh", cx: 138, cy: 248 },
  { id: "66", nom: "El Kantara", cx: 348, cy: 212 },
  { id: "67", nom: "Bir El Ater", cx: 418, cy: 175 },
  { id: "68", nom: "Ksar El Boukhari", cx: 222, cy: 150 },
  { id: "69", nom: "El Aricha", cx: 74, cy: 142 },
];

interface AlgeriaMapProps {
  selectedWilaya?: string;
  onSelect: (wilaya: string) => void;
}

export function AlgeriaMap({ selectedWilaya, onSelect }: AlgeriaMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const isNew = (id: string) => parseInt(id) >= 59;

  return (
    <div className="w-full">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 text-center">
        Sélectionner une wilaya
      </p>
      <div className="relative w-full" style={{ paddingBottom: "108%" }}>
        <svg
          viewBox="0 0 480 580"
          className="absolute inset-0 w-full h-full rounded-xl"
          style={{
            background: "linear-gradient(180deg,#e0f2fe 0%,#f0fdfa 100%)",
          }}
        >
          <path
            d="M70,60 L80,55 L100,50 L140,48 L180,45 L220,42 L260,40 L300,42 L340,48 L380,55 L420,65 L440,80 L445,100 L440,120 L430,140 L435,170 L440,200 L445,230 L445,260 L440,290 L420,310 L400,340 L380,370 L370,400 L350,440 L330,480 L310,520 L290,555 L270,565 L250,568 L230,560 L210,545 L190,520 L170,490 L150,460 L130,430 L110,400 L90,370 L70,340 L55,310 L45,280 L40,250 L42,220 L45,190 L50,160 L55,130 L60,100 L65,75 Z"
            fill="#f0fdfa"
            stroke="#99f6e4"
            strokeWidth="1.5"
          />
          <path
            d="M55,250 L90,235 L180,225 L280,222 L380,232 L440,250 L445,290 L420,340 L380,400 L340,480 L290,555 L250,568 L210,545 L170,490 L130,430 L90,370 L55,310 L42,260 Z"
            fill="#fefce8"
            opacity="0.45"
          />
          <text
            x="240"
            y="28"
            textAnchor="middle"
            fontSize="7.5"
            fill="#0891b2"
            opacity="0.5"
            fontStyle="italic"
          >
            Mer Méditerranée
          </text>

          {WILAYAS_DATA.map((w) => {
            const sel = selectedWilaya === w.nom;
            const hov = hovered === w.nom;
            const act = sel || hov;
            const newW = isNew(w.id);
            return (
              <g
                key={w.id}
                style={{ cursor: "pointer" }}
                onClick={() => onSelect(sel ? "" : w.nom)}
                onMouseEnter={() => setHovered(w.nom)}
                onMouseLeave={() => setHovered(null)}
              >
                {sel && (
                  <circle
                    cx={w.cx}
                    cy={w.cy}
                    r={12}
                    fill="#0D9488"
                    opacity={0.15}
                  />
                )}
                <circle
                  cx={w.cx}
                  cy={w.cy}
                  r={act ? 7 : newW ? 4.5 : 4}
                  fill={
                    sel
                      ? "#0D9488"
                      : hov
                        ? "#14B8A6"
                        : newW
                          ? "#e9d5ff"
                          : "#99f6e4"
                  }
                  stroke={act ? "#0D9488" : newW ? "#a855f7" : "#5eead4"}
                  strokeWidth={act ? 1.5 : 0.8}
                  style={{ transition: "all 0.15s" }}
                />
                {act && (
                  <text
                    x={w.cx}
                    y={w.cy - 11}
                    textAnchor="middle"
                    fontSize="6.5"
                    fontWeight="700"
                    fill="#0F766E"
                    style={{ pointerEvents: "none" }}
                  >
                    {w.nom}
                  </text>
                )}
              </g>
            );
          })}
          <g>
            <circle
              cx="38"
              cy="556"
              r="4"
              fill="#e9d5ff"
              stroke="#a855f7"
              strokeWidth="0.8"
            />
            <text x="46" y="559" fontSize="5.5" fill="#64748b">
              Nouvelles wilayas 2025
            </text>
          </g>
        </svg>
      </div>

      {selectedWilaya ? (
        <div className="mt-2 flex items-center justify-between bg-teal-50 border border-teal-200 rounded-xl px-3 py-2">
          <span className="text-sm font-semibold text-teal-700">
            📍 {selectedWilaya}
          </span>
          <button
            onClick={() => onSelect("")}
            className="text-xs text-teal-500 hover:text-teal-700 font-medium cursor-pointer"
          >
            ✕
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center mt-1">
          69 wilayas · cliquez pour sélectionner
        </p>
      )}
    </div>
  );
}
