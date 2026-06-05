"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── Types basés sur TES vraies tables ────────────────────────
interface LawyerWithUser {
  // Depuis table lawyers
  id: string;
  bar_number: string | null;
  specializations: string[];
  wilayas: string[];
  experience_years: number | null;
  is_verified: boolean;
  is_rejected: boolean | null;
  rejection_reason: string | null;
  rating_google: string | null;
  reviews_count_google: number;
  rating_mizan: string | null;
  reviews_count_mizan: number;
  consultation_price: number | null;
  created_at: string;
  // Depuis table users (via join)
  users: {
    email: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    mobile: string | null;
    location: string | null;
    avatar_url: string | null;
    gender: string | null;
    languages: string[];
  };
}

// ── Design tokens ────────────────────────────────────────────
const C = {
  teal: "#0D9488",
  tealLight: "#14B8A6",
  tealPale: "#F0FDFA",
  tealBorder: "#99F6E4",
  tealDark: "#0F766E",
  ink: "#0C1116",
  inkSoft: "#1A2332",
  slate: "#64748B",
  slateLight: "#94A3B8",
  border: "#E2E8F0",
  offWhite: "#F8FAFC",
  white: "#FFFFFF",
  red: "#EF4444",
  redPale: "#FEF2F2",
  redBorder: "#FECACA",
  green: "#22C55E",
  greenPale: "#F0FDF4",
  greenBorder: "#BBF7D0",
  amber: "#F59E0B",
  amberPale: "#FFFBEB",
  amberBorder: "#FDE68A",
  blue: "#3B82F6",
  bluePale: "#EFF6FF",
};

const G = {
  teal: "linear-gradient(135deg, #0D9488 0%, #0891B2 100%)",
  dark: "linear-gradient(160deg, #0C1116 0%, #1A2332 100%)",
};

// ── Helpers ───────────────────────────────────────────────────
function timeAgo(date: string): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
  return `Il y a ${Math.floor(diff / 86400)} jours`;
}

function fullName(u: LawyerWithUser["users"]): string {
  return `${u.first_name} ${u.last_name}`.trim();
}

function StatusBadge({ l }: { l: LawyerWithUser }) {
  if (l.is_verified)
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          background: C.greenPale,
          color: C.green,
          border: `1px solid ${C.greenBorder}`,
          padding: "3px 10px",
          borderRadius: 100,
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        ✓ Vérifié
      </span>
    );
  if (l.is_rejected)
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          background: C.redPale,
          color: C.red,
          border: `1px solid ${C.redBorder}`,
          padding: "3px 10px",
          borderRadius: 100,
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        ✗ Rejeté
      </span>
    );
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: C.amberPale,
        color: C.amber,
        border: `1px solid ${C.amberBorder}`,
        padding: "3px 10px",
        borderRadius: 100,
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      ⏳ En attente
    </span>
  );
}

// ── Modal ─────────────────────────────────────────────────────
function Modal({
  lawyer,
  onClose,
  onValidate,
  onReject,
}: {
  lawyer: LawyerWithUser;
  onClose: () => void;
  onValidate: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const u = lawyer.users;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 20,
      }}
    >
      <div
        style={{
          background: C.white,
          borderRadius: 16,
          padding: 28,
          maxWidth: 540,
          width: "100%",
          boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: 4,
              }}
            >
              Vérifier le profil
            </h3>
            <p style={{ fontSize: 12, color: C.slate }}>
              Inscrit {timeAgo(lawyer.created_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: C.offWhite,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              width: 32,
              height: 32,
              cursor: "pointer",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Infos depuis users */}
        <div
          style={{
            background: C.offWhite,
            borderRadius: 12,
            padding: 18,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: C.slate,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 12,
            }}
          >
            Informations personnelles
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {[
              ["👤 Nom", fullName(u)],
              ["📧 Email", u.email],
              ["📱 Mobile", u.mobile || u.phone || "—"],
              ["📍 Ville", u.location || "—"],
              [
                "⚧ Genre",
                u.gender === "female"
                  ? "Femme"
                  : u.gender === "male"
                    ? "Homme"
                    : "—",
              ],
              ["🌐 Langues", (u.languages || []).join(", ") || "—"],
            ].map(([l, v]) => (
              <div key={l}>
                <div
                  style={{
                    fontSize: 10,
                    color: C.slate,
                    fontWeight: 600,
                    marginBottom: 2,
                  }}
                >
                  {l}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>
                  {v}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Infos depuis lawyers */}
        <div
          style={{
            background: C.offWhite,
            borderRadius: 12,
            padding: 18,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: C.slate,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 12,
            }}
          >
            Informations professionnelles
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 12,
            }}
          >
            {[
              ["⚖️ N° Barreau", lawyer.bar_number || "—"],
              [
                "📅 Expérience",
                lawyer.experience_years
                  ? `${lawyer.experience_years} ans`
                  : "—",
              ],
              [
                "⭐ Note Google",
                lawyer.rating_google
                  ? `${parseFloat(lawyer.rating_google).toFixed(1)} (${lawyer.reviews_count_google} avis)`
                  : "—",
              ],
              [
                "💰 Tarif",
                lawyer.consultation_price
                  ? `${lawyer.consultation_price.toLocaleString("fr-DZ")} DZD`
                  : "Sur demande",
              ],
            ].map(([l, v]) => (
              <div key={l}>
                <div
                  style={{
                    fontSize: 10,
                    color: C.slate,
                    fontWeight: 600,
                    marginBottom: 2,
                  }}
                >
                  {l}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>
                  {v}
                </div>
              </div>
            ))}
          </div>
          {(lawyer.specializations || []).length > 0 && (
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: C.slate,
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                SPÉCIALISATIONS
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {lawyer.specializations.map((s) => (
                  <span
                    key={s}
                    style={{
                      background: C.tealPale,
                      color: C.teal,
                      border: `1px solid ${C.tealBorder}`,
                      padding: "3px 9px",
                      borderRadius: 100,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Checklist */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: C.slate,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 10,
            }}
          >
            Checklist de vérification
          </div>
          {[
            [
              `N° barreau ${lawyer.bar_number} à vérifier`,
              !!lawyer.bar_number && lawyer.bar_number !== "___",
            ],
            ["Photo de profil présente", !!u.avatar_url],
            ["Email valide", u.email?.includes("@")],
            ["Numéro de téléphone renseigné", !!(u.phone || u.mobile)],
            [
              "Spécialisations renseignées",
              (lawyer.specializations || []).length > 0,
            ],
          ].map(([label, ok]) => (
            <div
              key={label as string}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                background: (ok as boolean) ? C.greenPale : C.amberPale,
                borderRadius: 8,
                border: `1px solid ${(ok as boolean) ? C.greenBorder : C.amberBorder}`,
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 14 }}>
                {(ok as boolean) ? "✅" : "⚠️"}
              </span>
              <span style={{ fontSize: 12, color: C.ink }}>
                {label as string}
              </span>
            </div>
          ))}
        </div>

        {/* Zone rejet */}
        {rejecting && (
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.slate,
                display: "block",
                marginBottom: 6,
              }}
            >
              Motif du rejet *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Ex: N° de barreau introuvable, informations incomplètes..."
              style={{
                width: "100%",
                padding: "10px 12px",
                border: `1.5px solid ${C.redBorder}`,
                borderRadius: 9,
                fontSize: 12,
                fontFamily: "inherit",
                outline: "none",
                resize: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          {!rejecting ? (
            <>
              <button
                onClick={async () => {
                  setLoading(true);
                  await onValidate(lawyer.id);
                  setLoading(false);
                  onClose();
                }}
                disabled={loading}
                style={{
                  flex: 2,
                  padding: "11px",
                  background: G.teal,
                  color: "white",
                  border: "none",
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Validation..." : "✓ Valider le profil"}
              </button>
              <button
                onClick={() => setRejecting(true)}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: C.redPale,
                  color: C.red,
                  border: `1px solid ${C.redBorder}`,
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                ✗ Rejeter
              </button>
            </>
          ) : (
            <>
              <button
                onClick={async () => {
                  if (!reason.trim()) return;
                  setLoading(true);
                  await onReject(lawyer.id, reason);
                  setLoading(false);
                  onClose();
                }}
                disabled={!reason.trim() || loading}
                style={{
                  flex: 2,
                  padding: "11px",
                  background: C.red,
                  color: "white",
                  border: "none",
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  opacity: !reason.trim() || loading ? 0.5 : 1,
                }}
              >
                {loading ? "Rejet..." : "✗ Confirmer le rejet"}
              </button>
              <button
                onClick={() => setRejecting(false)}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: C.offWhite,
                  color: C.slate,
                  border: `1px solid ${C.border}`,
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Annuler
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────
export default function AdminValidationPage() {
  const [lawyers, setLawyers] = useState<LawyerWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "pending" | "all" | "verified" | "rejected"
  >("pending");
  const [selected, setSelected] = useState<LawyerWithUser | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch : JOIN lawyers + users ──────────────────────────
  const fetchLawyers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("lawyers")
      .select(
        `
        id,
        bar_number,
        specializations,
        wilayas,
        experience_years,
        is_verified,
        is_rejected,
        rejection_reason,
        rating_google,
        reviews_count_google,
        rating_mizan,
        reviews_count_mizan,
        consultation_price,
        created_at,
        users (
          email,
          first_name,
          last_name,
          phone,
          mobile,
          location,
          avatar_url,
          gender,
          languages
        )
      `
      )
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLawyers(data as unknown as LawyerWithUser[]);
    } else {
      console.error("Erreur fetch:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

  // ── Valider ───────────────────────────────────────────────
  const handleValidate = async (id: string) => {
    const { error } = await supabase
      .from("lawyers")
      .update({
        is_verified: true,
        is_rejected: false,
        rejection_reason: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      showToast("Erreur lors de la validation", "error");
      return;
    }
    // Le webhook Supabase envoie l'email automatiquement via Resend
    showToast("✓ Profil validé — email envoyé automatiquement par webhook");
    fetchLawyers();
  };

  // ── Rejeter ───────────────────────────────────────────────
  const handleReject = async (id: string, reason: string) => {
    const { error } = await supabase
      .from("lawyers")
      .update({
        is_verified: false,
        is_rejected: true,
        rejection_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      showToast("Erreur lors du rejet", "error");
      return;
    }
    showToast("Profil rejeté", "error");
    fetchLawyers();
  };

  // ── Filtres ───────────────────────────────────────────────
  const filtered = lawyers.filter((l) => {
    const u = l.users;
    const statusOk =
      filter === "all" ||
      (filter === "pending" && !l.is_verified && !l.is_rejected) ||
      (filter === "verified" && l.is_verified) ||
      (filter === "rejected" && l.is_rejected);
    const searchOk =
      !search ||
      fullName(u).toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      (u.location || "").toLowerCase().includes(search.toLowerCase()) ||
      (l.bar_number || "").toLowerCase().includes(search.toLowerCase());
    return statusOk && searchOk;
  });

  const counts = {
    all: lawyers.length,
    pending: lawyers.filter((l) => !l.is_verified && !l.is_rejected).length,
    verified: lawyers.filter((l) => l.is_verified).length,
    rejected: lawyers.filter((l) => l.is_rejected ?? false).length,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.offWhite,
        fontFamily: "-apple-system,'SF Pro Text',system-ui,sans-serif",
      }}
    >
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 200,
            background: toast.type === "success" ? C.ink : C.red,
            color: "white",
            padding: "12px 20px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <Modal
          lawyer={selected}
          onClose={() => setSelected(null)}
          onValidate={handleValidate}
          onReject={handleReject}
        />
      )}

      {/* Header */}
      <div
        style={{
          background: G.dark,
          padding: "20px 32px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: G.teal,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "white", fontSize: 18, fontWeight: 800 }}>
                م
              </span>
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "-0.02em",
                }}
              >
                Mizan · Admin
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                Validation des profils avocats
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {counts.pending > 0 && (
              <span
                style={{
                  background: C.amber,
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: 100,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {counts.pending} en attente
              </span>
            )}
            <button
              onClick={fetchLawyers}
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "7px 14px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              ↻ Actualiser
            </button>
            <a
              href="/admin/validation"
              style={{
                background: G.teal,
                color: "white",
                padding: "7px 14px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              mizan-dz.com →
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 32px" }}>
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {[
            {
              label: "Total avocats",
              value: counts.all,
              color: C.ink,
              icon: "👥",
            },
            {
              label: "En attente",
              value: counts.pending,
              color: C.amber,
              icon: "⏳",
            },
            {
              label: "Vérifiés",
              value: counts.verified,
              color: C.green,
              icon: "✅",
            },
            {
              label: "Rejetés",
              value: counts.rejected,
              color: C.red,
              icon: "❌",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "16px 18px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: C.slate,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {s.label}
                </span>
                <span style={{ fontSize: 16 }}>{s.icon}</span>
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: s.color,
                  fontFamily: "monospace",
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            {(["pending", "all", "verified", "rejected"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 100,
                  border: `1.5px solid ${filter === f ? C.teal : C.border}`,
                  background: filter === f ? C.tealPale : "white",
                  color: filter === f ? C.teal : C.slate,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                }}
              >
                {
                  {
                    pending: "⏳ En attente",
                    all: "👥 Tous",
                    verified: "✅ Vérifiés",
                    rejected: "❌ Rejetés",
                  }[f]
                }{" "}
                ({counts[f]})
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher nom, email, ville, n° barreau..."
            style={{
              flex: 1,
              minWidth: 200,
              padding: "8px 14px",
              border: `1.5px solid ${C.border}`,
              borderRadius: 9,
              fontSize: 13,
              outline: "none",
              fontFamily: "inherit",
              background: "white",
            }}
          />
        </div>

        {/* Tableau */}
        <div
          style={{
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  borderBottom: `2px solid ${C.border}`,
                  background: C.offWhite,
                }}
              >
                {[
                  "Avocat",
                  "Email / Mobile",
                  "Barreau",
                  "Note Google",
                  "Inscrit",
                  "Statut",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "11px 14px",
                      fontSize: 10,
                      color: C.slate,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: C.slate,
                      fontSize: 13,
                    }}
                  >
                    Chargement...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: C.slate,
                      fontSize: 13,
                    }}
                  >
                    Aucun avocat trouvé
                  </td>
                </tr>
              ) : (
                filtered.map((lawyer, i) => {
                  const u = lawyer.users;
                  const isPending = !lawyer.is_verified && !lawyer.is_rejected;
                  return (
                    <tr
                      key={lawyer.id}
                      style={{
                        borderBottom:
                          i < filtered.length - 1
                            ? `1px solid ${C.border}`
                            : "none",
                        background: isPending
                          ? "rgba(245,158,11,0.04)"
                          : "white",
                      }}
                    >
                      <td style={{ padding: "14px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          {u.avatar_url ? (
                            <img
                              src={u.avatar_url}
                              alt=""
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 9,
                                objectFit: "cover",
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                background: C.tealPale,
                                borderRadius: 9,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 16,
                                flexShrink: 0,
                              }}
                            >
                              {u.gender === "female" ? "👩‍⚖️" : "👨‍⚖️"}
                            </div>
                          )}
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700 }}>
                              {fullName(u)}
                            </div>
                            <div style={{ fontSize: 11, color: C.slate }}>
                              📍 {u.location || "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px" }}>
                        <div style={{ fontSize: 12 }}>{u.email}</div>
                        <div style={{ fontSize: 11, color: C.slate }}>
                          {u.mobile || u.phone || "—"}
                        </div>
                      </td>
                      <td style={{ padding: "14px" }}>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            fontFamily: "monospace",
                          }}
                        >
                          {lawyer.bar_number && lawyer.bar_number !== "___"
                            ? `N° ${lawyer.bar_number}`
                            : "—"}
                        </div>
                        <div style={{ fontSize: 11, color: C.slate }}>
                          {lawyer.experience_years
                            ? `${lawyer.experience_years} ans`
                            : "—"}
                        </div>
                      </td>
                      <td style={{ padding: "14px" }}>
                        {lawyer.rating_google &&
                        parseFloat(lawyer.rating_google) > 0 ? (
                          <div>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: C.amber,
                              }}
                            >
                              ⭐ {parseFloat(lawyer.rating_google).toFixed(1)}
                            </div>
                            <div style={{ fontSize: 11, color: C.slate }}>
                              {lawyer.reviews_count_google} avis
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: C.slate }}>
                            —
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "14px",
                          fontSize: 12,
                          color: C.slate,
                        }}
                      >
                        {timeAgo(lawyer.created_at)}
                      </td>
                      <td style={{ padding: "14px" }}>
                        <StatusBadge l={lawyer} />
                      </td>
                      <td style={{ padding: "14px" }}>
                        <button
                          onClick={() => setSelected(lawyer)}
                          style={{
                            background: isPending ? G.teal : C.offWhite,
                            color: isPending ? "white" : C.slate,
                            border: `1px solid ${C.border}`,
                            padding: "7px 14px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          {isPending ? "⚡ Vérifier" : "👁 Voir"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
