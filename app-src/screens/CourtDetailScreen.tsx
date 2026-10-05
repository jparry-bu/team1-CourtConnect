import { useState, useCallback } from "react"
import type { GameDivision, PlayerDivision } from "../types/HostedGame"
import ReportModal from "../components/ReportModal"
import Toast from "../components/Toast"

const courtData: Record<string, {
  name: string
  location: string
  distance: string
  rating: number
  courts: number
  surface: string
  lights: boolean
  active: number
  image: string
  about: string
  website: string
  access: {
    status: string
    detail: string
    links: {
      label: string
      url: string
      placeholder?: boolean
    }[]
  }
  games: {
    time: string
    format: string
    skill: string
    spots: number
    total: number
    host: string
    division: GameDivision
  }[]
}> = {
  hoyt: {
    name: "Hoyt Field",
    location: "12 Gilmore St, Cambridge, MA",
    distance: "0.3 mi",
    rating: 4.9,
    courts: 4,
    surface: "Asphalt",
    lights: true,
    active: 12,
    image: "photo-1546519638405-a9f3e2a716e0",
    about:
      "A neighborhood park near Central Square with outdoor basketball courts and open recreation space for Cambridge players.",
    website: "https://www.cambridgema.gov/CDD/parks/parksinfo/Parks/hoytfield",
    access: {
      status: "Public court · No membership required",
      detail: "Open play is generally available during park hours. Organized events may require a permit.",
      links: [
        { label: "Court rules & permits", url: "https://example.com/hoyt-field-permits", placeholder: true },
      ],
    },
    games: [
      {
        time: "Today 6:00 PM",
        format: "5v5 Full Court",
        skill: "Pro",
        spots: 2,
        total: 10,
        host: "Marcus W.",
        division: "Men's",
      },
      {
        time: "Today 8:00 PM",
        format: "3v3 Half Court",
        skill: "Intermediate",
        spots: 4,
        total: 6,
        host: "Dre K.",
        division: "Co-ed",
      },
      {
        time: "Tomorrow 5:00 PM",
        format: "5v5 Full Court",
        skill: "All Levels",
        spots: 7,
        total: 10,
        host: "James T.",
        division: "Women's",
      },
    ],
  },
  sennott: {
    name: "Sennott Park",
    location: "305 Broadway, Cambridge, MA",
    distance: "0.8 mi",
    rating: 4.7,
    courts: 2,
    surface: "Asphalt",
    lights: false,
    active: 8,
    image: "photo-1504450758481-7338eba7524a",
    about:
      "A renovated neighborhood park between Central and Kendall squares with basketball courts and flexible community recreation space.",
    website: "https://www.cambridgema.gov/CDD/parks/parksinfo/Parks/sennottpark",
    access: {
      status: "Public court · Drop-in access",
      detail: "No membership is shown for casual play. League and event reservations may have separate requirements.",
      links: [
        { label: "Reservation requirements", url: "https://example.com/sennott-park-reservations", placeholder: true },
      ],
    },
    games: [
      {
        time: "Today 7:00 PM",
        format: "3v3 Half Court",
        skill: "Competitive",
        spots: 1,
        total: 6,
        host: "Tony R.",
        division: "Women's",
      },
      {
        time: "Tomorrow 12:00 PM",
        format: "5v5 Full Court",
        skill: "Intermediate",
        spots: 5,
        total: 10,
        host: "Sean M.",
        division: "Co-ed",
      },
    ],
  },
  ringer: {
    name: "Ringer Playground",
    location: "85 Allston St, Allston, MA",
    distance: "1.2 mi",
    rating: 4.5,
    courts: 3,
    surface: "Concrete",
    lights: true,
    active: 5,
    image: "photo-1519861531473-9200262188bf",
    about:
      "A busy neighborhood playground in Allston with outdoor basketball courts and space for pickup games across skill levels.",
    website: "https://www.boston.gov/departments/parks-and-recreation",
    access: {
      status: "Park facility · Pass may be required",
      detail: "Access policies can vary by program and facility hours. Confirm pass or registration requirements before arriving.",
      links: [
        { label: "View access information", url: "https://example.com/ringer-playground-access", placeholder: true },
        { label: "Facility use policy", url: "https://example.com/ringer-playground-policy", placeholder: true },
      ],
    },
    games: [
      {
        time: "Tomorrow 5:00 PM",
        format: "5v5 Full Court",
        skill: "Recreational",
        spots: 8,
        total: 10,
        host: "Andre B.",
        division: "Women's",
      },
    ],
  },
  malcolmx: {
    name: "Malcolm X Park",
    location: "141 Martin Luther King Jr Blvd, Roxbury, MA",
    distance: "2.1 mi",
    rating: 4.8,
    courts: 5,
    surface: "Asphalt",
    lights: false,
    active: 18,
    image: "photo-1558618666-fcd25c85cd64",
    about:
      "A Roxbury neighborhood park with outdoor courts and a strong community pickup scene close to the Southwest Corridor.",
    website: "https://www.boston.gov/departments/parks-and-recreation",
    access: {
      status: "Public court · No membership required",
      detail: "Drop-in play is generally available. Tournaments, lessons, and reserved use may require authorization.",
      links: [
        { label: "Special-use permits", url: "https://example.com/malcolm-x-park-permits", placeholder: true },
      ],
    },
    games: [
      {
        time: "Today 5:00 PM",
        format: "5v5 Full Court",
        skill: "Pro",
        spots: 0,
        total: 10,
        host: "Kyle J.",
        division: "Men's",
      },
      {
        time: "Today 6:30 PM",
        format: "3v3 Half Court",
        skill: "Intermediate",
        spots: 3,
        total: 6,
        host: "Mia C.",
        division: "Women's",
      },
      {
        time: "Tomorrow 10:00 AM",
        format: "5v5 Full Court",
        skill: "All Levels",
        spots: 6,
        total: 10,
        host: "Rio T.",
        division: "Co-ed",
      },
    ],
  },
}

interface Props {
  courtId: string | null
  onBack: () => void
  playerDivision: PlayerDivision
}

const skillColors: Record<string, string> = {
  Pro: "#ff5c00",
  Competitive: "#ef4444",
  Intermediate: "#3b82f6",
  Recreational: "#22c55e",
  "All Levels": "#a855f7",
  "All Ages": "#22c55e",
}

function saveCourtReport(courtName: string, category: string, detail: string) {
  try {
    const existing = JSON.parse(localStorage.getItem("courtconnect-reports") ?? "[]") as unknown[]
    existing.push({ id: crypto.randomUUID(), type: "court", target: courtName, category, detail, createdAt: new Date().toISOString() })
    localStorage.setItem("courtconnect-reports", JSON.stringify(existing))
  } catch {
    // ignore storage errors
  }
}

export default function CourtDetailScreen({ courtId, onBack, playerDivision }: Props) {
  const [activeTab, setActiveTab] = useState<"games" | "info">("games")
  const [joined, setJoined] = useState<number[]>([])
  const [showReport, setShowReport] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const dismissToast = useCallback(() => setToast(null), [])

  const court = courtData[courtId ?? "hoyt"] ?? courtData["hoyt"]
  const visibleGames = court.games.filter((game) => game.division === playerDivision || game.division === "Co-ed")

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Hero image */}
      <div style={{ position: "relative", height: 220 }}>
        <img
          src={`https://images.unsplash.com/${court.image}?w=800&h=440&fit=crop&auto=format`}
          alt={court.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(13,13,15,1) 0%, rgba(13,13,15,0.4) 50%, rgba(13,13,15,0.1) 100%)",
          }}
        />

        <button
          onClick={onBack}
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth={2}
            style={{ width: 16, height: 16 }}
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>

        {/* Report court button */}
        <button
          onClick={() => setShowReport(true)}
          aria-label="Report incorrect court info"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} style={{ width: 15, height: 15 }}>
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
        </button>

        <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#22c55e",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: "#22c55e",
                    fontWeight: 600,
                    fontFamily: "Inter",
                  }}
                >
                  {court.active} ACTIVE NOW
                </span>
              </div>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#fff",
                  fontFamily: "Barlow Condensed",
                  lineHeight: 1,
                  textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                }}
              >
                {court.name.toUpperCase()}
              </h1>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "Inter",
                  marginTop: 3,
                }}
              >
                {court.location}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "rgba(0,0,0,0.5)",
                borderRadius: 8,
                padding: "5px 10px",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="#ff5c00"
                style={{ width: 13, height: 13 }}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "Inter",
                }}
              >
                {court.rating}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div
        className="flex"
        style={{
          margin: "16px 16px",
          background: "var(--secondary)",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        {[
          { label: "Courts", value: court.courts },
          { label: "Surface", value: court.surface },
          { label: "Lights", value: court.lights ? "Yes" : "No" },
          { label: "Distance", value: court.distance },
        ].map((stat, i, arr) => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              padding: "12px 0",
              textAlign: "center",
              borderRight:
                i < arr.length - 1
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "none",
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#f5f5f5",
                fontFamily: "Barlow Condensed",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.35)",
                fontFamily: "Inter",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginTop: 2,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        className="flex mx-4 mb-4"
        style={{ background: "var(--secondary)", borderRadius: 10, padding: 3 }}
      >
        {(["games", "info"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: 8,
              border: "none",
              background: activeTab === t ? "#ff5c00" : "transparent",
              color: activeTab === t ? "#fff" : "rgba(255,255,255,0.4)",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "Barlow Condensed",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {t === "games" ? "Upcoming Games" : "Court Info"}
          </button>
        ))}
      </div>

      {activeTab === "games" && (
        <div className="px-4 flex flex-col gap-3">
          {visibleGames.length === 0 && (
            <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              No {playerDivision.toLowerCase()} or co-ed games are scheduled at this court.
            </p>
          )}
          {visibleGames.map((game, i) => {
            const full = game.spots === 0
            const isJoined = joined.includes(i)
            return (
              <div
                key={i}
                style={{
                  background: "var(--card)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 14,
                  padding: "14px 16px",
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#ff5c00",
                        fontFamily: "Inter",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {game.time.toUpperCase()}
                    </p>
                    <h3
                      style={{
                        fontSize: 19,
                        fontWeight: 700,
                        color: "#f5f5f5",
                        fontFamily: "Barlow Condensed",
                        lineHeight: 1.1,
                      }}
                    >
                      {game.format.toUpperCase()}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded bg-secondary px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-secondary-foreground">{game.division}</span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 5,
                        background: `${skillColors[game.skill]}22`,
                        color: skillColors[game.skill],
                        fontFamily: "Inter",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {game.skill.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth={1.8}
                        style={{ width: 13, height: 13 }}
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.5)",
                          fontFamily: "Inter",
                        }}
                      >
                        {game.total - game.spots}/{game.total}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.35)",
                        fontFamily: "Inter",
                      }}
                    >
                      by {game.host}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      !full &&
                      setJoined((p) =>
                        isJoined ? p.filter((x) => x !== i) : [...p, i],
                      )
                    }
                    style={{
                      padding: "7px 16px",
                      borderRadius: 8,
                      border: isJoined
                        ? "1px solid rgba(255,92,0,0.4)"
                        : full
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "none",
                      background: isJoined
                        ? "rgba(255,92,0,0.12)"
                        : full
                          ? "transparent"
                          : "#ff5c00",
                      color: isJoined
                        ? "#ff5c00"
                        : full
                          ? "rgba(255,255,255,0.2)"
                          : "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "Inter",
                      cursor: full && !isJoined ? "not-allowed" : "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {full && !isJoined
                      ? "Full"
                      : isJoined
                        ? "Joined ✓"
                        : "Join"}
                  </button>
                </div>

                {/* Spots bar */}
                <div
                  style={{
                    marginTop: 10,
                    height: 3,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 2,
                      background: full ? "#ef4444" : "#ff5c00",
                      width: `${((game.total - game.spots) / game.total) * 100}%`,
                      transition: "width 0.3s",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: 10,
                    color: full ? "#ef4444" : "rgba(255,255,255,0.3)",
                    fontFamily: "Inter",
                    marginTop: 4,
                  }}
                >
                  {full
                    ? "Court full"
                    : `${game.spots} spot${game.spots !== 1 ? "s" : ""} left`}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === "info" && (
        <div className="px-4">
          <div
            style={{
              background: "var(--card)",
              borderRadius: 14,
              padding: 16,
              border: "1px solid rgba(255,255,255,0.06)",
              marginBottom: 12,
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#f5f5f5",
                fontFamily: "Barlow Condensed",
                letterSpacing: "0.04em",
                marginBottom: 8,
              }}
            >
              ABOUT
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.6,
                fontFamily: "Inter",
              }}
            >
              {court.about}
            </p>
          </div>
          <div
            style={{
              background: "var(--card)",
              borderRadius: 14,
              padding: 16,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#f5f5f5",
                fontFamily: "Barlow Condensed",
                letterSpacing: "0.04em",
                marginBottom: 12,
              }}
            >
              AMENITIES
            </h3>
            {[
              { icon: "🏀", label: `${court.courts} Full Courts` },
              { icon: "🛣️", label: `${court.surface} Surface` },
              {
                icon: "💡",
                label: court.lights ? "Lights Available" : "No Lighting",
              },
              { icon: "📍", label: court.location },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 mb-3">
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "Inter",
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-border bg-card p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Access requirements
            </p>
            <h3 className="mt-1 font-['Barlow_Condensed'] text-lg font-bold text-foreground">
              {court.access.status}
            </h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {court.access.detail}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={court.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/10 px-3 py-3 text-xs font-bold text-primary"
              >
                Official facility website
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
                  <path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
                </svg>
              </a>
              {court.access.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary px-3 py-3 text-xs font-semibold text-secondary-foreground"
                >
                  <span className="flex items-center gap-2">
                    {link.label}
                    {link.placeholder && (
                      <span className="rounded bg-background px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                        Demo link
                      </span>
                    )}
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 text-muted-foreground" aria-hidden="true">
                    <path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
                  </svg>
                </a>
              ))}
            </div>
            <p className="mt-3 text-[10px] leading-4 text-muted-foreground">
              Demo links illustrate where verified membership, permit, and access information would appear.
            </p>
          </div>
        </div>
      )}

      {showReport && (
        <ReportModal
          context="court"
          targetLabel={court.name}
          onClose={() => setShowReport(false)}
          onSubmit={(category, detail) => {
            saveCourtReport(court.name, category, detail)
            setShowReport(false)
            setToast("Court report submitted — thanks for the correction.")
          }}
        />
      )}

      {toast && <Toast message={toast} onDismiss={dismissToast} />}
    </div>
  )
}
