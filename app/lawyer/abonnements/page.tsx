"use client";
import { useState } from "react";
import { Check, ArrowRight, Bell } from "lucide-react";

const PLANS = [
  {
    id: "3mois",
    duration: "3 mois",
    price: 18000,
    monthly: 6000,
    badge: null,
    popular: false,
    savings: null,
  },
  {
    id: "6mois",
    duration: "6 mois",
    price: 33000,
    monthly: 5500,
    badge: "Le plus choisi",
    popular: true,
    savings: "Économisez 3 000 DZD",
  },
  {
    id: "12mois",
    duration: "12 mois",
    price: 60000,
    monthly: 5000,
    badge: "Meilleure offre",
    popular: false,
    savings: "Économisez 12 000 DZD",
  },
];

const FEATURES_BASE = [
  "Profil visible sur Mizan",
  "Accès aux demandes clients",
  "Messagerie intégrée",
  "Avis clients vérifiés",
  "Support prioritaire",
];

const FEATURES_EXTRA: Record<string, string[]> = {
  "6mois": ["Badge profil mis en avant"],
  "12mois": [
    "Badge profil mis en avant",
    "Tête de liste dans la recherche",
    "Statistiques de visibilité",
  ],
};

const fmt = (n: number) => n.toLocaleString("fr-DZ") + " DZD";

export default function AbonnementsPage() {
  const [selected, setSelected] = useState("6mois");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const plan = PLANS.find((p) => p.id === selected)!;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8F7F5",
        fontFamily: "'Syne', 'Helvetica Neue', system-ui, sans-serif",
      }}
    >
      <style>{`
        @import url('https:
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .card { transition: transform 0.22s cubic-bezier(.4,0,.2,1), box-shadow 0.22s; cursor: pointer; }
        .card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,0,0,0.08); }
        .card.on { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,0,0,0.12); }

        .pill { display: inline-flex; align-items: center; gap: 6px; background: white; border: 1px solid #E2E2E0; border-radius: 100px; padding: 6px 16px; font-size: 11px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; }

        .soon-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%);
          border: 1px solid #FDE68A;
          color: #92400E;
          padding: 8px 18px; border-radius: 100px;
          font-size: 12px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase;
        }

        .notify-input { border: 1.5px solid #E2E2E0; border-radius: 10px; padding: 13px 16px; font-size: 14px; font-family: inherit; outline: none; transition: border-color .2s; background: white; width: 100%; }
        .notify-input:focus { border-color: #0D9488; }

        .notify-btn { background: #0C1116; color: white; border: none; padding: 13px 24px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 8px; white-space: nowrap; transition: all .2s; }
        .notify-btn:hover { background: #0D9488; transform: translateY(-1px); }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade { animation: fadeIn .5s ease both; }
        .fade-1 { animation-delay: .05s; }
        .fade-2 { animation-delay: .1s; }
        .fade-3 { animation-delay: .15s; }
        .fade-4 { animation-delay: .2s; }
        .fade-5 { animation-delay: .25s; }
      `}</style>

      <div
        style={{ maxWidth: 860, margin: "0 auto", padding: "80px 24px 80px" }}
      >
        {/* Badge coming soon */}
        <div
          className="fade"
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <span className="soon-badge">
            <span style={{ fontSize: 14 }}>⏳</span>
            Paiement en ligne bientôt disponible
          </span>
        </div>

        {/* Header */}
        <div
          className="fade fade-1"
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <h1
            style={{
              fontSize: "clamp(38px, 6vw, 60px)",
              fontWeight: 800,
              color: "#0C1116",
              letterSpacing: "-0.04em",
              lineHeight: 1.04,
              marginBottom: 18,
            }}
          >
            Votre cabinet,
            <br />
            <span style={{ color: "#0D9488" }}>visible partout.</span>
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#71717A",
              maxWidth: 400,
              margin: "0 auto",
              lineHeight: 1.75,
            }}
          >
            Un abonnement fixe. Zéro commission sur vos honoraires. Annulable à
            tout moment.
          </p>
        </div>

        {/* Plans */}
        <div
          className="fade fade-2"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 14,
            marginBottom: 20,
          }}
        >
          {PLANS.map((p) => {
            const on = selected === p.id;
            const extras = FEATURES_EXTRA[p.id] || [];
            return (
              <div
                key={p.id}
                className={`card${on ? " on" : ""}`}
                onClick={() => setSelected(p.id)}
                style={{
                  background: on ? "#0C1116" : "white",
                  border: `1.5px solid ${on ? "#0C1116" : "#E2E2E0"}`,
                  borderRadius: 18,
                  padding: "26px 22px",
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {/* Badge */}
                {p.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: -11,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: p.popular ? "#0D9488" : "#F59E0B",
                      color: "white",
                      padding: "3px 13px",
                      borderRadius: 100,
                      fontSize: 10,
                      fontWeight: 800,
                      whiteSpace: "nowrap",
                      letterSpacing: ".05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {p.badge}
                  </div>
                )}

                {/* Duration */}
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: on ? "rgba(255,255,255,.4)" : "#A1A1AA",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    marginBottom: 14,
                  }}
                >
                  {p.duration}
                </div>

                {/* Price */}
                <div style={{ marginBottom: 4 }}>
                  <span
                    style={{
                      fontSize: 44,
                      fontWeight: 800,
                      color: on ? "white" : "#0C1116",
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                    }}
                  >
                    {p.monthly.toLocaleString("fr-DZ")}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: on ? "rgba(255,255,255,.35)" : "#A1A1AA",
                      marginLeft: 4,
                    }}
                  >
                    DZD/mois
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: on ? "rgba(255,255,255,.3)" : "#A1A1AA",
                    marginBottom: p.savings ? 6 : 20,
                  }}
                >
                  {fmt(p.price)} total
                </div>

                {p.savings && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: on ? "#4ADE80" : "#059669",
                      background: on ? "rgba(74,222,128,.12)" : "#F0FDF4",
                      padding: "3px 10px",
                      borderRadius: 100,
                      marginBottom: 20,
                    }}
                  >
                    {p.savings}
                  </div>
                )}

                {/* Divider */}
                <div
                  style={{
                    height: 1,
                    background: on ? "rgba(255,255,255,.08)" : "#F4F4F5",
                    marginBottom: 18,
                  }}
                />

                {/* Features */}
                <ul
                  style={{
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 9,
                  }}
                >
                  {[...FEATURES_BASE, ...extras].map((f) => (
                    <li
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                        fontSize: 12,
                        color: on ? "rgba(255,255,255,.7)" : "#3F3F46",
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: on ? "rgba(13,148,136,.25)" : "#F0FDFA",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Check
                          size={9}
                          color={on ? "#4ADE80" : "#0D9488"}
                          strokeWidth={3}
                        />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Selected indicator */}
                {on && (
                  <div
                    style={{
                      marginTop: 22,
                      paddingTop: 16,
                      borderTop: "1px solid rgba(255,255,255,.08)",
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#4ADE80",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,.5)",
                        fontWeight: 600,
                      }}
                    >
                      Plan sélectionné
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary bar */}
        <div
          className="fade fade-3"
          style={{
            background: "white",
            border: "1px solid #E2E2E0",
            borderRadius: 14,
            padding: "18px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 48,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#A1A1AA",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".07em",
                marginBottom: 4,
              }}
            >
              Récapitulatif
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#0C1116",
                letterSpacing: "-0.02em",
              }}
            >
              {plan.duration} ·{" "}
              <span style={{ color: "#0D9488" }}>{fmt(plan.price)}</span>
            </div>
            <div style={{ fontSize: 12, color: "#A1A1AA", marginTop: 2 }}>
              {fmt(plan.monthly)}/mois · Sans engagement · Sans commission
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#FFF7ED",
              border: "1px solid #FDE68A",
              borderRadius: 10,
              padding: "10px 16px",
            }}
          >
            <span style={{ fontSize: 16 }}>⏳</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#92400E" }}>
                Paiement bientôt disponible
              </div>
              <div style={{ fontSize: 11, color: "#B45309" }}>
                Notifiez-moi ci-dessous
              </div>
            </div>
          </div>
        </div>

        {/* Notify section */}
        <div
          className="fade fade-4"
          style={{
            background: "#0C1116",
            borderRadius: 20,
            padding: "40px 36px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              background:
                "radial-gradient(circle, rgba(13,148,136,.15) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -40,
              left: -40,
              width: 160,
              height: 160,
              background:
                "radial-gradient(circle, rgba(245,158,11,.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>🔔</div>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "white",
                letterSpacing: "-0.03em",
                marginBottom: 8,
              }}
            >
              Soyez le premier informé
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,.45)",
                marginBottom: 28,
                maxWidth: 380,
                margin: "0 auto 28px",
              }}
            >
              Le paiement en ligne via CIB et Edahabia arrive bientôt. Laissez
              votre email pour être notifié dès l'ouverture.
            </p>

            {!submitted ? (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  maxWidth: 420,
                  margin: "0 auto",
                }}
              >
                <input
                  className="notify-input"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && email) setSubmitted(true);
                  }}
                  style={{
                    background: "rgba(255,255,255,.06)",
                    border: "1.5px solid rgba(255,255,255,.1)",
                    color: "white",
                    borderRadius: 10,
                    padding: "13px 16px",
                    fontSize: 14,
                    fontFamily: "inherit",
                    outline: "none",
                    flex: 1,
                  }}
                />
                <button
                  className="notify-btn"
                  onClick={() => {
                    if (email) setSubmitted(true);
                  }}
                  style={{
                    background: "#0D9488",
                    color: "white",
                    border: "none",
                    padding: "13px 22px",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    whiteSpace: "nowrap",
                  }}
                >
                  <Bell size={15} />
                  Me notifier
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(74,222,128,.12)",
                  border: "1px solid rgba(74,222,128,.3)",
                  padding: "14px 24px",
                  borderRadius: 12,
                }}
              >
                <Check size={18} color="#4ADE80" strokeWidth={2.5} />
                <span
                  style={{ fontSize: 14, color: "#4ADE80", fontWeight: 600 }}
                >
                  Parfait — vous serez notifié dès l'ouverture !
                </span>
              </div>
            )}

            <div
              style={{
                marginTop: 20,
                fontSize: 12,
                color: "rgba(255,255,255,.2)",
              }}
            >
              En attendant, contactez-nous à{" "}
              <a
                href="mailto:contact@mizan-dz.com"
                style={{
                  color: "rgba(255,255,255,.4)",
                  textDecoration: "none",
                }}
              >
                contact@mizan-dz.com
              </a>
            </div>
          </div>
        </div>

        {/* Garanties */}
        <div
          className="fade fade-5"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 10,
            marginTop: 14,
          }}
        >
          {[
            [
              "🔒",
              "Sans engagement",
              "Résiliable à l'expiration de votre plan.",
            ],
            [
              "💯",
              "Zéro commission",
              "Vos honoraires vous appartiennent entièrement.",
            ],
            [
              "✅",
              "Profil vérifié",
              "Badge Mizan visible sur votre profil public.",
            ],
          ].map(([icon, title, desc]) => (
            <div
              key={title}
              style={{
                background: "white",
                border: "1px solid #E2E2E0",
                borderRadius: 12,
                padding: "16px 16px",
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 18 }}>{icon}</span>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#0C1116",
                    marginBottom: 3,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{ fontSize: 11, color: "#A1A1AA", lineHeight: 1.5 }}
                >
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
