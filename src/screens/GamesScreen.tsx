import { useState } from "react";
import type { HostedGame, PlayerDivision } from "../types/HostedGame";
import { playerPositions, type GameRegistrations, type PlayerPosition } from "../types/GameRegistration";

export const demoGames = [
  {
    id: 1,
    court: "Hoyt Field",
    location: "Cambridge, MA",
    time: "Today",
    timeDetail: "6:00 PM",
    format: "5v5 Full Court",
    skill: "Pro",
    division: "Men's",
    spotsLeft: 2,
    totalSpots: 10,
    host: "Marcus Williams",
    hostAvatar: "MW",
    players: ["DK", "JT", "AR", "SD", "TM", "LJ", "RB"],
    distance: "0.3 mi",
  },
  {
    id: 2,
    court: "Sennott Park",
    location: "Cambridge, MA",
    time: "Today",
    timeDetail: "7:00 PM",
    format: "3v3 Half Court",
    skill: "Competitive",
    division: "Women's",
    spotsLeft: 1,
    totalSpots: 6,
    host: "Tony Reeves",
    hostAvatar: "TR",
    players: ["MK", "SP", "LC", "JR"],
    distance: "0.8 mi",
  },
  {
    id: 3,
    court: "Malcolm X Park",
    location: "Roxbury, MA",
    time: "Today",
    timeDetail: "5:00 PM",
    format: "5v5 Full Court",
    skill: "Pro",
    division: "Men's",
    spotsLeft: 0,
    totalSpots: 10,
    host: "Kyle Jackson",
    hostAvatar: "KJ",
    players: ["AM", "RD", "TK", "JW", "PN", "CS", "MR", "LH"],
    distance: "2.1 mi",
  },
  {
    id: 4,
    court: "Ringer Playground",
    location: "Allston, MA",
    time: "Tomorrow",
    timeDetail: "5:00 PM",
    format: "5v5 Full Court",
    skill: "Recreational",
    division: "Women's",
    spotsLeft: 8,
    totalSpots: 10,
    host: "Andre Brooks",
    hostAvatar: "AB",
    players: ["YT"],
    distance: "1.2 mi",
  },
  {
    id: 5,
    court: "Hoyt Field",
    location: "Cambridge, MA",
    time: "Tomorrow",
    timeDetail: "8:00 PM",
    format: "3v3 Half Court",
    skill: "Intermediate",
    division: "Co-ed",
    spotsLeft: 4,
    totalSpots: 6,
    host: "Dre King",
    hostAvatar: "DK",
    players: ["SJ"],
    distance: "0.3 mi",
  },
];

const skillColors: Record<string, { bg: string; text: string }> = {
  Pro: { bg: "rgba(255,92,0,0.15)", text: "#ff5c00" },
  Competitive: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
  Intermediate: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
  Recreational: { bg: "rgba(34,197,94,0.15)", text: "#22c55e" },
  "All Levels": { bg: "rgba(168,85,247,0.15)", text: "#c084fc" },
};

const days = ["Today", "Tomorrow", "Any day"] as const;
const timeOptions = ["Any time", "Before 6 PM", "6 PM or later"] as const;
const skillOptions = ["Any level", "Recreational", "Intermediate", "Competitive", "Pro"] as const;
const courtLocations: Record<string, string> = {
  "Hoyt Field": "Cambridge, MA",
  "Sennott Park": "Cambridge, MA",
  "Malcolm X Park": "Roxbury, MA",
  "Ringer Playground": "Allston, MA",
  "Danehy Park": "Cambridge, MA",
};

function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dayLabel(date: string) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (date === localDate(today)) return "Today";
  if (date === localDate(tomorrow)) return "Tomorrow";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function minutesFromTime(time: string) {
  const [clock, period] = time.split(" ");
  const [hour, minute] = clock.split(":").map(Number);
  return (hour % 12 + (period === "PM" ? 12 : 0)) * 60 + minute;
}

interface Props {
  hostedGames: HostedGame[];
  registrations: GameRegistrations;
  onRegistrationChange: (gameId: number, position: PlayerPosition | null) => void;
  onOpenMessages: (gameId: number) => void;
  onReschedule: (gameId: number, date: string, time: string) => void;
  onCancel: (gameId: number) => void;
  playerDivision: PlayerDivision;
  currentUserEmail: string;
}

export default function GamesScreen({ hostedGames, registrations, onRegistrationChange, onOpenMessages, onReschedule, onCancel, playerDivision, currentUserEmail }: Props) {
  const [activeDay, setActiveDay] = useState<(typeof days)[number]>("Any day");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [preferredTime, setPreferredTime] = useState<(typeof timeOptions)[number]>("Any time");
  const [skillLevel, setSkillLevel] = useState<(typeof skillOptions)[number]>("Any level");
  const [choosingGame, setChoosingGame] = useState<number | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<PlayerPosition | null>(null);
  const [editingGame, setEditingGame] = useState<number | null>(null);
  const [draftDate, setDraftDate] = useState("");
  const [draftTime, setDraftTime] = useState("");
  const [confirmCancel, setConfirmCancel] = useState<number | null>(null);

  const activeFilters = Number(location.trim().length > 0) + Number(preferredTime !== "Any time") + Number(skillLevel !== "Any level");
  const listings = [
    ...hostedGames.map((game) => ({
      id: game.id,
      court: game.court,
      location: courtLocations[game.court] ?? "Location not listed",
      time: dayLabel(game.date),
      timeDetail: new Date(`${game.date}T${game.time}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      format: game.format,
      skill: game.skill,
      division: game.division ?? "Co-ed",
      spotsLeft: game.players,
      totalSpots: game.players,
      host: !game.hostEmail || game.hostEmail === currentUserEmail ? "You" : "Community host",
      players: [] as string[],
      distance: "",
      cancelled: !!game.cancelled,
      date: game.date,
      clockTime: game.time,
    })),
    ...demoGames.map((game) => ({ ...game, cancelled: false, date: "", clockTime: "" })),
  ];
  const filtered = listings.filter((game) => {
    const search = location.trim().toLowerCase();
    const gameTime = minutesFromTime(game.timeDetail);
    return (activeDay === "Any day" || game.time === activeDay) &&
      (game.division === playerDivision || game.division === "Co-ed") &&
      (!search || `${game.court} ${game.location}`.toLowerCase().includes(search)) &&
      (preferredTime === "Any time" || (preferredTime === "Before 6 PM" ? gameTime < 18 * 60 : gameTime >= 18 * 60)) &&
      (skillLevel === "Any level" || game.skill === skillLevel || game.skill === "All Levels");
  });

  function clearFilters() {
    setActiveDay("Any day");
    setLocation("");
    setPreferredTime("Any time");
    setSkillLevel("Any level");
  }

  return (
    <div style={{ paddingBottom: 8 }}>
      {/* Header */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "#ff5c00", textTransform: "uppercase", fontFamily: "Inter" }}>
              {filtered.length} Games
            </p>
            <h1 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, color: "#f5f5f5", fontFamily: "Barlow Condensed" }}>
              PICKUP GAMES
            </h1>
            <p className="mt-1 text-[10px] text-muted-foreground">{playerDivision} + Co-ed</p>
          </div>
          <button
            type="button"
            aria-label={`Filter games${activeFilters ? `, ${activeFilters} active` : ""}`}
            aria-expanded={filtersOpen}
            aria-controls="game-filters"
            onClick={() => setFiltersOpen((open) => !open)}
            style={{ width: 40, height: 40, borderRadius: "50%", background: filtersOpen || activeFilters ? "rgba(255,92,0,0.15)" : "rgba(255,255,255,0.05)", border: filtersOpen || activeFilters ? "1px solid #ff5c00" : "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke={filtersOpen || activeFilters ? "#ff5c00" : "rgba(255,255,255,0.5)"} strokeWidth={1.8} style={{ width: 18, height: 18 }}>
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
        </div>

        {/* Day selector */}
        <div className="flex gap-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              style={{
                padding: "8px 20px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "Barlow Condensed",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                border: activeDay === day ? "none" : "1px solid rgba(255,255,255,0.1)",
                background: activeDay === day ? "#ff5c00" : "rgba(255,255,255,0.04)",
                color: activeDay === day ? "#fff" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {day}
            </button>
          ))}
        </div>

        {filtersOpen && (
          <div id="game-filters" className="mt-4 rounded-xl border border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">FIND YOUR RUN</h2>
              <button type="button" onClick={clearFilters} className="text-xs font-semibold text-primary">Clear all</button>
            </div>
            <label htmlFor="game-location" className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Court or location</label>
            <input
              id="game-location"
              type="search"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Search city, area or court"
              className="mb-4 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <label htmlFor="game-time" className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Preferred time</label>
            <select
              id="game-time"
              value={preferredTime}
              onChange={(event) => setPreferredTime(event.target.value as (typeof timeOptions)[number])}
              className="mb-4 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              {timeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <label htmlFor="game-skill" className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Skill level</label>
            <select
              id="game-skill"
              value={skillLevel}
              onChange={(event) => setSkillLevel(event.target.value as (typeof skillOptions)[number])}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              {skillOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">Showing games that match all your selections.</p>
          </div>
        )}
      </div>

      {/* Game cards */}
      <div className="px-5 flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-border bg-card px-5 py-8 text-center">
            <p className="text-xl font-bold text-foreground" style={{ fontFamily: "Barlow Condensed" }}>NO GAMES FOUND</p>
            <p className="mt-2 text-sm leading-5 text-muted-foreground">Try another location, time, or skill level. Only {playerDivision.toLowerCase()} and co-ed games are shown.</p>
            <button type="button" onClick={clearFilters} className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Show all games</button>
          </div>
        )}
        {filtered.map((game) => {
          const isHost = hostedGames.some((hosted) => hosted.id === game.id && (!hosted.hostEmail || hosted.hostEmail === currentUserEmail));
          const joinedPosition = registrations[game.id];
          const spotsLeft = Math.max(0, game.spotsLeft - Number(!!joinedPosition));
          const full = spotsLeft === 0 && !joinedPosition;
          const sk = skillColors[game.skill] ?? skillColors["All Levels"];
          const fillPct = ((game.totalSpots - spotsLeft) / game.totalSpots) * 100;
          const openPositions = Object.fromEntries(playerPositions.map((position) => [position, 0])) as Record<PlayerPosition, number>;
          for (let slot = game.totalSpots - game.spotsLeft; slot < game.totalSpots; slot++) {
            openPositions[playerPositions[slot % playerPositions.length]]++;
          }
          if (joinedPosition) openPositions[joinedPosition] = Math.max(0, openPositions[joinedPosition] - 1);

          return (
            <div
              key={game.id}
              style={{
                background: "var(--card)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              {/* Top accent bar */}
              <div style={{ height: 3, background: `linear-gradient(to right, ${sk.text}, transparent)` }} />

              <div style={{ padding: "14px 16px 16px" }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#ff5c00", fontFamily: "Inter", letterSpacing: "0.04em" }}>
                        {game.time.toUpperCase()} · {game.timeDetail.toUpperCase()}
                      </span>
                      {game.distance && (
                        <>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "Inter" }}>·</span>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "Inter" }}>{game.distance}</span>
                        </>
                      )}
                    </div>
                    <h3 style={{ fontSize: 21, fontWeight: 700, color: "#f5f5f5", fontFamily: "Barlow Condensed", lineHeight: 1.05 }}>
                      {game.format.toUpperCase()}
                    </h3>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "Inter", marginTop: 2 }}>
                      {game.court} · {game.location}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="rounded bg-secondary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">
                      {game.division}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 5,
                        background: sk.bg,
                        color: sk.text,
                        fontFamily: "Inter",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {game.skill.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Player avatars */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex" style={{ marginRight: 4 }}>
                    {game.players.slice(0, 5).map((p, i) => (
                      <div
                        key={i}
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          background: `hsl(${i * 40 + 200}, 60%, 35%)`,
                          border: "2px solid var(--card)",
                          marginLeft: i > 0 ? -8 : 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 9,
                          fontWeight: 700,
                          color: "#fff",
                          fontFamily: "Inter",
                          zIndex: 5 - i,
                          position: "relative",
                        }}
                      >
                        {p}
                      </div>
                    ))}
                    {game.players.length > 5 && (
                      <div
                        style={{
                          width: 26, height: 26, borderRadius: "50%",
                          background: "rgba(255,255,255,0.08)",
                          border: "2px solid var(--card)",
                          marginLeft: -8,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.5)", fontFamily: "Inter",
                          position: "relative",
                        }}
                      >
                        +{game.players.length - 5}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "Inter" }}>
                    Hosted by {game.host}
                  </span>
                </div>

                {/* Capacity */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "Inter" }}>
                      {game.totalSpots - spotsLeft} / {game.totalSpots} players
                    </span>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: "Inter",
                      color: full ? "#ef4444" : spotsLeft <= 2 ? "#facc15" : "#22c55e",
                    }}>
                      {full ? "Full" : `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left`}
                    </span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${fillPct}%`,
                        background: full ? "#ef4444" : "#ff5c00",
                        borderRadius: 2,
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                </div>

                <div className="mb-3 flex items-start justify-between gap-2 text-xs">
                  <span className="shrink-0 font-semibold uppercase tracking-wider text-muted-foreground">Open positions</span>
                  <span className="text-right font-semibold text-foreground">
                    {playerPositions.filter((position) => openPositions[position] > 0).map((position) => `${position} ${openPositions[position]}`).join(" · ") || "None"}
                  </span>
                </div>

                {choosingGame === game.id && !joinedPosition && (
                  <div className="mb-3 rounded-xl border border-border bg-background p-3">
                    <p className="font-['Barlow_Condensed'] text-base font-bold tracking-wide text-foreground">CHOOSE YOUR POSITION</p>
                    <p className="mb-3 text-xs text-muted-foreground">Select an open position to register for this game.</p>
                    <div className="grid grid-cols-5 gap-1" role="group" aria-label="Available positions">
                      {playerPositions.map((position) => (
                        <button
                          key={position}
                          type="button"
                          disabled={openPositions[position] === 0}
                          aria-pressed={selectedPosition === position}
                          onClick={() => setSelectedPosition(position)}
                          className={`rounded-lg border py-2 text-center font-['Inter'] text-xs font-semibold ${selectedPosition === position ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground"} disabled:cursor-not-allowed disabled:opacity-30`}
                        >
                          {position}
                          <span className="block text-[10px] font-normal">{openPositions[position]} open</span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        disabled={!selectedPosition || openPositions[selectedPosition] === 0}
                        onClick={() => {
                          if (selectedPosition && openPositions[selectedPosition] > 0) {
                            onRegistrationChange(game.id, selectedPosition);
                            setChoosingGame(null);
                          }
                        }}
                        className="flex-1 rounded-lg bg-primary py-2.5 font-['Barlow_Condensed'] text-sm font-bold tracking-wide text-primary-foreground disabled:opacity-30"
                      >
                        CONFIRM REGISTRATION
                      </button>
                      <button type="button" onClick={() => setChoosingGame(null)} className="text-xs text-muted-foreground">Cancel</button>
                    </div>
                  </div>
                )}

                {game.cancelled && <p className="mb-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">Cancelled by the host</p>}
                {isHost && !game.cancelled && (
                  <div className="mb-3 rounded-xl border border-border bg-background p-3">
                    {editingGame === game.id ? (
                      <form onSubmit={(event) => {
                        event.preventDefault();
                        if (draftDate && draftTime && (draftDate !== game.date || draftTime !== game.clockTime)) {
                          onReschedule(game.id, draftDate, draftTime);
                        }
                        setEditingGame(null);
                      }} className="space-y-3">
                        <p className="text-sm font-semibold text-foreground">Change game schedule</p>
                        <label className="block text-xs text-muted-foreground">Date
                          <input type="date" required min={localDate(new Date())} value={draftDate} onChange={(event) => setDraftDate(event.target.value)} className="mt-1 block w-full rounded-lg border border-border bg-card p-2 text-foreground" />
                        </label>
                        <label className="block text-xs text-muted-foreground">Time
                          <input type="time" required value={draftTime} onChange={(event) => setDraftTime(event.target.value)} className="mt-1 block w-full rounded-lg border border-border bg-card p-2 text-foreground" />
                        </label>
                        <div className="flex gap-3">
                          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Save schedule</button>
                          <button type="button" onClick={() => setEditingGame(null)} className="text-xs text-muted-foreground">Back</button>
                        </div>
                      </form>
                    ) : confirmCancel === game.id ? (
                      <div>
                        <p className="text-sm text-foreground">Cancel this game? Participants will see a cancellation notice.</p>
                        <div className="mt-3 flex gap-3">
                          <button type="button" onClick={() => { onCancel(game.id); setConfirmCancel(null); }} className="rounded-lg bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground">Confirm cancellation</button>
                          <button type="button" onClick={() => setConfirmCancel(null)} className="text-xs text-muted-foreground">Keep game</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <button type="button" onClick={() => { setEditingGame(game.id); setDraftDate(game.date); setDraftTime(game.clockTime); }} className="text-xs font-semibold text-primary">Change schedule</button>
                        <button type="button" onClick={() => setConfirmCancel(game.id)} className="text-xs font-semibold text-destructive">Cancel game</button>
                      </div>
                    )}
                  </div>
                )}
                {/* Action */}
                <button
                  type="button"
                  disabled={!!full || (game.cancelled && !joinedPosition) || isHost}
                  onClick={() => {
                    if (joinedPosition) {
                      onRegistrationChange(game.id, null);
                    } else {
                      setChoosingGame(game.id);
                      setSelectedPosition(playerPositions.find((position) => openPositions[position] > 0) ?? null);
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: 10,
                    border: joinedPosition ? "1.5px solid rgba(255,92,0,0.5)" : full ? "1px solid rgba(255,255,255,0.08)" : "none",
                    background: joinedPosition ? "rgba(255,92,0,0.1)" : full ? "rgba(255,255,255,0.03)" : "#ff5c00",
                    color: joinedPosition ? "#ff5c00" : full ? "rgba(255,255,255,0.2)" : "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "Barlow Condensed",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    cursor: full || (game.cancelled && !joinedPosition) || isHost ? "not-allowed" : "pointer",
                    transition: "all 0.15s",
                    boxShadow: !joinedPosition && !full ? "0 4px 16px rgba(255,92,0,0.3)" : "none",
                  }}
                >
                  {game.cancelled ? joinedPosition ? "GAME CANCELLED · LEAVE GAME" : "GAME CANCELLED" : isHost ? "YOU'RE HOSTING" : joinedPosition ? `JOINED AS ${joinedPosition} · TAP TO LEAVE` : full ? "GAME FULL" : "JOIN GAME"}
                </button>
                {(isHost || joinedPosition) && (
                  <button type="button" onClick={() => onOpenMessages(game.id)} className="mt-3 w-full rounded-lg border border-primary/40 bg-primary/10 py-2.5 text-sm font-semibold text-primary">
                    Open game chat
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ height: 24 }} />
    </div>
  );
}
