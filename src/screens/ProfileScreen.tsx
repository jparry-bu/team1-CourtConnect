import { useState, useCallback } from "react"
import type { UserProfile } from "../types/UserAccount"
import FeedbackModal from "../components/FeedbackModal"
import Toast from "../components/Toast"

const positions = ["PG", "SG", "SF", "PF", "C"] as const
const skillLabels = [
  "Beginner",
  "Recreational",
  "Intermediate",
  "Competitive",
  "Pro",
]

const gameHistory = [
  {
    court: "Hoyt Field",
    date: "Sep 8",
    result: "W",
    score: "21–17",
    format: "5v5",
    skill: "Pro",
  },
  {
    court: "Sennott Park",
    date: "Sep 5",
    result: "L",
    score: "18–21",
    format: "3v3",
    skill: "Competitive",
  },
  {
    court: "Malcolm X Park",
    date: "Aug 31",
    result: "W",
    score: "21–14",
    format: "5v5",
    skill: "Pro",
  },
  {
    court: "Ringer Playground",
    date: "Aug 28",
    result: "W",
    score: "21–19",
    format: "5v5",
    skill: "Intermediate",
  },
  {
    court: "Hoyt Field",
    date: "Aug 22",
    result: "L",
    score: "16–21",
    format: "5v5",
    skill: "Pro",
  },
]

const upcomingGames = [
  {
    court: "Hoyt Field",
    location: "Cambridge, MA",
    day: "12",
    month: "SEP",
    when: "Today · 6:00 PM",
    format: "5v5 Full Court",
    role: "Player",
    players: 8,
    capacity: 10,
  },
  {
    court: "Sennott Park",
    location: "Cambridge, MA",
    day: "13",
    month: "SEP",
    when: "Tomorrow · 7:00 PM",
    format: "3v3 Half Court",
    role: "Host",
    players: 5,
    capacity: 6,
  },
  {
    court: "Ringer Playground",
    location: "Allston, MA",
    day: "16",
    month: "SEP",
    when: "Monday · 5:30 PM",
    format: "5v5 Full Court",
    role: "Waitlist",
    players: 10,
    capacity: 10,
  },
]

const followedCourts = [
  { name: "Hoyt Field", nextGame: "Today 6PM", active: 12 },
  { name: "Sennott Park", nextGame: "Today 7PM", active: 8 },
]

function formatHeight(totalInches?: number) {
  if (
    typeof totalInches !== "number" ||
    !Number.isInteger(totalInches) ||
    totalInches < 1
  ) {
    return "Not set"
  }
  return `${Math.floor(totalInches / 12)}'${totalInches % 12}"`
}

interface Props {
  profile: UserProfile
  onLogout: () => void
}

export default function ProfileScreen({ profile, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<"history" | "courts" | "edit">(
    "history",
  )
  const [participationView, setParticipationView] =
    useState<"upcoming" | "past">("upcoming")
  const [pos, setPos] = useState(profile.position)
  const [skill, setSkill] = useState(Math.max(1, skillLabels.indexOf(profile.skill) + 1))
  const [showFeedback, setShowFeedback] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const dismissToast = useCallback(() => setToast(null), [])
  const initials = profile.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()

  function saveFeedback(rating: number, category: string, detail: string) {
    try {
      const existing = JSON.parse(localStorage.getItem("courtconnect-feedback") ?? "[]") as unknown[]
      existing.push({ id: crypto.randomUUID(), rating, category, detail, createdAt: new Date().toISOString() })
      localStorage.setItem("courtconnect-feedback", JSON.stringify(existing))
    } catch {
      // ignore storage errors
    }
  }

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Profile hero */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            height: 90,
            background:
              "linear-gradient(135deg, rgba(255,92,0,0.4) 0%, rgba(255,92,0,0.05) 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        />
        <div style={{ position: "absolute", bottom: -40, left: 20 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ff5c00, #ff8c42)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "3px solid var(--background)",
              fontSize: 28,
              fontWeight: 800,
              color: "#fff",
              fontFamily: "Barlow Condensed",
            }}
          >
            {initials}
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="absolute right-5 top-5 rounded-lg border border-border bg-background/80 px-3 py-2 text-xs font-semibold text-muted-foreground"
        >
          Log out
        </button>
      </div>

      <div
        style={{
          paddingTop: 48,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 0,
        }}
      >
        <div className="flex items-end justify-between mb-1">
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#f5f5f5",
                fontFamily: "Barlow Condensed",
                lineHeight: 1,
              }}
            >
              {profile.name.toUpperCase()}
            </h1>
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.4)",
                fontFamily: "Inter",
              }}
            >
              @{profile.handle} · {profile.city} · {profile.playerDivision}
            </p>
          </div>
          <div
            style={{
              padding: "5px 12px",
              borderRadius: 6,
              background: "rgba(255,92,0,0.12)",
              border: "1px solid rgba(255,92,0,0.3)",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#ff5c00",
                fontFamily: "Inter",
              }}
            >
              {profile.skill.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-5 mt-4 mb-4">
          {[
            { label: "Games", value: 48 },
            { label: "Wins", value: 31 },
            { label: "Win %", value: "65%" },
            { label: "Courts", value: 7 },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#f5f5f5",
                  fontFamily: "Barlow Condensed",
                  lineHeight: 1,
                }}
              >
                {s.value}
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
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Position & preferences */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <div
            style={{
              flex: 1,
              padding: "10px 12px",
              background: "var(--card)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.35)",
                fontFamily: "Inter",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Position
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#ff5c00",
                fontFamily: "Barlow Condensed",
              }}
            >
              {pos}
            </span>
          </div>
          <div
            style={{
              flex: 1,
              padding: "10px 12px",
              background: "var(--card)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.35)",
                fontFamily: "Inter",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Level
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#ff5c00",
                fontFamily: "Barlow Condensed",
              }}
            >
              {skillLabels[skill - 1]}
            </span>
          </div>
          <div
            style={{
              flex: 1,
              padding: "10px 12px",
              background: "var(--card)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.35)",
                fontFamily: "Inter",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Height
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#f5f5f5",
                fontFamily: "Barlow Condensed",
              }}
            >
              {formatHeight(profile.heightInches)}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex mb-4"
          style={{
            background: "var(--secondary)",
            borderRadius: 10,
            padding: 3,
          }}
        >
          {(["history", "courts", "edit"] as const).map((t) => (
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
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "Barlow Condensed",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {t === "history"
                ? "Games"
                : t === "courts"
                  ? "Following"
                  : "Edit"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5">
        {activeTab === "history" && (
          <div>
            <div
              className="flex items-center justify-between"
              style={{
                background: "var(--secondary)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: 3,
                marginBottom: 14,
              }}
            >
              {(["upcoming", "past"] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setParticipationView(view)}
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    borderRadius: 8,
                    border: "none",
                    background:
                      participationView === view
                        ? "var(--card)"
                        : "transparent",
                    color:
                      participationView === view
                        ? "var(--foreground)"
                        : "var(--muted-foreground)",
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "Inter",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    boxShadow:
                      participationView === view
                        ? "0 2px 8px rgba(0,0,0,0.25)"
                        : "none",
                  }}
                >
                  {view === "upcoming"
                    ? `Upcoming ${upcomingGames.length}`
                    : "Past 48"}
                </button>
              ))}
            </div>

            {participationView === "upcoming" && (
              <div className="flex flex-col gap-3">
                <div className="flex items-end justify-between">
                  <div>
                    <p
                      style={{
                        fontSize: 10,
                        color: "var(--primary)",
                        fontFamily: "Inter",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      Your schedule
                    </p>
                    <p
                      style={{
                        fontSize: 21,
                        color: "var(--foreground)",
                        fontFamily: "Barlow Condensed",
                        fontWeight: 700,
                        lineHeight: 1.1,
                      }}
                    >
                      NEXT ON THE COURT
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--muted-foreground)",
                      fontFamily: "Inter",
                    }}
                  >
                    3 games · 5 days
                  </span>
                </div>

                {upcomingGames.map((game, i) => {
                  const waitlisted = game.role === "Waitlist"
                  const hosting = game.role === "Host"

                  return (
                    <div
                      key={`${game.court}-${game.when}`}
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        background: "var(--card)",
                        border: `1px solid ${
                          i === 0 ? "rgba(255,92,0,0.35)" : "var(--border)"
                        }`,
                        borderRadius: 14,
                        padding: "14px",
                      }}
                    >
                      {i === 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: 3,
                            height: "100%",
                            background: "var(--primary)",
                          }}
                        />
                      )}
                      <div className="flex gap-3">
                        <div
                          style={{
                            width: 48,
                            height: 54,
                            flexShrink: 0,
                            borderRadius: 10,
                            background:
                              i === 0
                                ? "rgba(255,92,0,0.12)"
                                : "var(--secondary)",
                            border: `1px solid ${
                              i === 0 ? "rgba(255,92,0,0.25)" : "var(--border)"
                            }`,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 10,
                              color:
                                i === 0
                                  ? "var(--primary)"
                                  : "var(--muted-foreground)",
                              fontFamily: "Inter",
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                            }}
                          >
                            {game.month}
                          </span>
                          <span
                            style={{
                              fontSize: 24,
                              color: "var(--foreground)",
                              fontFamily: "Barlow Condensed",
                              fontWeight: 800,
                              lineHeight: 0.9,
                            }}
                          >
                            {game.day}
                          </span>
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="flex items-start justify-between gap-2">
                            <div style={{ minWidth: 0 }}>
                              <p
                                style={{
                                  fontSize: 16,
                                  color: "var(--foreground)",
                                  fontFamily: "Barlow Condensed",
                                  fontWeight: 700,
                                  lineHeight: 1.05,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {game.court.toUpperCase()}
                              </p>
                              <p
                                style={{
                                  fontSize: 10,
                                  color: "var(--muted-foreground)",
                                  fontFamily: "Inter",
                                  marginTop: 2,
                                }}
                              >
                                {game.location}
                              </p>
                            </div>
                            <span
                              style={{
                                flexShrink: 0,
                                borderRadius: 5,
                                padding: "3px 6px",
                                background: waitlisted
                                  ? "rgba(250,204,21,0.12)"
                                  : hosting
                                    ? "rgba(96,165,250,0.12)"
                                    : "rgba(34,197,94,0.12)",
                                color: waitlisted
                                  ? "#facc15"
                                  : hosting
                                    ? "#60a5fa"
                                    : "#22c55e",
                                fontSize: 9,
                                fontFamily: "Inter",
                                fontWeight: 700,
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                              }}
                            >
                              {waitlisted
                                ? "Waitlisted"
                                : hosting
                                  ? "Hosting"
                                  : "Confirmed"}
                            </span>
                          </div>

                          <div
                            className="flex items-center gap-2"
                            style={{ marginTop: 10 }}
                          >
                            <span
                              style={{
                                fontSize: 11,
                                color: "var(--primary)",
                                fontFamily: "Inter",
                                fontWeight: 600,
                              }}
                            >
                              {game.when}
                            </span>
                            <span
                              style={{
                                color: "var(--muted-foreground)",
                                fontSize: 9,
                              }}
                            >
                              •
                            </span>
                            <span
                              style={{
                                fontSize: 10,
                                color: "var(--muted-foreground)",
                                fontFamily: "Inter",
                              }}
                            >
                              {game.players}/{game.capacity} players
                            </span>
                          </div>
                          <p
                            style={{
                              fontSize: 10,
                              color: "rgba(255,255,255,0.45)",
                              fontFamily: "Inter",
                              marginTop: 3,
                            }}
                          >
                            {game.format} · {game.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {participationView === "past" && (
              <div className="flex flex-col gap-2">
                <div
                  className="flex items-end justify-between"
                  style={{ marginBottom: 4 }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 10,
                        color: "var(--primary)",
                        fontFamily: "Inter",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      This season
                    </p>
                    <p
                      style={{
                        fontSize: 21,
                        color: "var(--foreground)",
                        fontFamily: "Barlow Condensed",
                        fontWeight: 700,
                        lineHeight: 1.1,
                      }}
                    >
                      GAME HISTORY
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--muted-foreground)",
                      fontFamily: "Inter",
                    }}
                  >
                    31–17 record
                  </span>
                </div>

                {gameHistory.map((g, i) => (
                  <div
                    key={i}
                    style={{
                      background: "var(--card)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 12,
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background:
                          g.result === "W"
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(239,68,68,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        fontWeight: 800,
                        color: g.result === "W" ? "#22c55e" : "#ef4444",
                        fontFamily: "Barlow Condensed",
                        flexShrink: 0,
                      }}
                    >
                      {g.result}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#f5f5f5",
                          fontFamily: "Barlow Condensed",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {g.court.toUpperCase()}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.35)",
                          fontFamily: "Inter",
                        }}
                      >
                        {g.format} · {g.skill} · {g.score}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.3)",
                        fontFamily: "Inter",
                        flexShrink: 0,
                      }}
                    >
                      {g.date}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "courts" && (
          <div className="flex flex-col gap-3">
            {followedCourts.map((c, i) => (
              <div
                key={i}
                style={{
                  background: "var(--card)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#f5f5f5",
                      fontFamily: "Barlow Condensed",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {c.name.toUpperCase()}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#22c55e",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.4)",
                        fontFamily: "Inter",
                      }}
                    >
                      {c.active} active · {c.nextGame}
                    </span>
                  </div>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  fill="#ff5c00"
                  style={{ width: 16, height: 16 }}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
            ))}
          </div>
        )}

        {activeTab === "edit" && (
          <div className="flex flex-col gap-5">
            <div>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontFamily: "Inter",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Primary Position
              </label>
              <div className="flex gap-2">
                {positions.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPos(p)}
                    style={{
                      flex: 1,
                      padding: "10px 0",
                      borderRadius: 8,
                      border:
                        pos === p ? "none" : "1px solid rgba(255,255,255,0.08)",
                      background: pos === p ? "#ff5c00" : "var(--card)",
                      color: pos === p ? "#fff" : "rgba(255,255,255,0.4)",
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: "Barlow Condensed",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontFamily: "Inter",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Skill Level — {skillLabels[skill - 1]}
              </label>
              <input
                type="range"
                min={1}
                max={5}
                value={skill}
                onChange={(e) => setSkill(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#ff5c00" }}
              />
              <div className="flex justify-between mt-1">
                {skillLabels.map((l) => (
                  <span
                    key={l}
                    style={{
                      fontSize: 9,
                      color: "rgba(255,255,255,0.25)",
                      fontFamily: "Inter",
                    }}
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>

            <button
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 12,
                border: "none",
                background: "#ff5c00",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "Barlow Condensed",
                letterSpacing: "0.08em",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(255,92,0,0.35)",
              }}
            >
              SAVE PROFILE
            </button>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />

            {/* Feedback */}
            <button
              type="button"
              onClick={() => setShowFeedback(true)}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "transparent",
                color: "rgba(255,255,255,0.5)",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "Barlow Condensed",
                letterSpacing: "0.08em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: 15, height: 15 }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              SHARE FEEDBACK
            </button>
          </div>
        )}
      </div>

      {showFeedback && (
        <FeedbackModal
          onClose={() => setShowFeedback(false)}
          onSubmit={(rating, category, detail) => {
            saveFeedback(rating, category, detail)
            setShowFeedback(false)
            setToast("Feedback received — thank you!")
          }}
        />
      )}

      {toast && <Toast message={toast} onDismiss={dismissToast} />}
    </div>
  )
}
