import { useState } from "react"
import type { GameDivision, PlayerDivision } from "../types/HostedGame"

interface Props {
  onBack: () => void
  playerDivision: PlayerDivision
}

const days = Array.from({ length: 30 }, (_, index) => index + 1)
const agenda = [
  {
    day: "TODAY",
    date: "12",
    time: "6:00 PM",
    court: "Hoyt Field",
    format: "5v5 Full Court",
    status: "Confirmed",
    division: "Men's" as GameDivision,
  },
  {
    day: "TOMORROW",
    date: "13",
    time: "7:00 PM",
    court: "Sennott Park",
    format: "3v3 · Hosting",
    status: "Hosting",
    division: "Co-ed" as GameDivision,
  },
  {
    day: "MON",
    date: "16",
    time: "5:30 PM",
    court: "Ringer Playground",
    format: "5v5 Full Court",
    status: "Waitlist",
    division: "Women's" as GameDivision,
  },
]

export default function CalendarScreen({ onBack, playerDivision }: Props) {
  const [selectedDay, setSelectedDay] = useState(12)
  const visibleAgenda = agenda.filter((game) => game.division === playerDivision || game.division === "Co-ed")
  const visibleGameDays = visibleAgenda.map((game) => Number(game.date))

  return (
    <div className="px-5 pb-8 pt-2">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div>
          <p className="font-['Inter'] text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
            Your schedule
          </p>
          <h1 className="font-['Barlow_Condensed'] text-3xl font-extrabold leading-none text-foreground">
            GAME CALENDAR
          </h1>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="font-['Barlow_Condensed'] text-lg font-bold text-foreground">
            SEPTEMBER 2026
          </p>
          <span className="rounded-md bg-primary/15 px-2 py-1 font-['Inter'] text-[9px] font-bold uppercase tracking-wider text-primary">
            {visibleAgenda.length} games
          </span>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1 text-center">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <span
              key={`${day}-${index}`}
              className="pb-2 font-['Inter'] text-[9px] font-bold text-muted-foreground"
            >
              {day}
            </span>
          ))}
          <span />
          <span />
          {days.map((day) => {
            const hasGame = visibleGameDays.includes(day)
            const selected = selectedDay === day
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className="relative flex aspect-square items-center justify-center rounded-lg font-['Inter'] text-[11px] font-semibold"
                style={{
                  background: selected ? "var(--primary)" : "transparent",
                  color: selected
                    ? "var(--primary-foreground)"
                    : hasGame
                      ? "var(--foreground)"
                      : "var(--muted-foreground)",
                }}
              >
                {day}
                {hasGame && !selected && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="font-['Barlow_Condensed'] text-xl font-bold text-foreground">
          UPCOMING
        </h2>
        <span className="font-['Inter'] text-[10px] text-muted-foreground">
          September 12–16
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {visibleAgenda.map((game, index) => (
          <div
            key={game.court}
            className="flex gap-3 rounded-xl border bg-card p-3"
            style={{
              borderColor:
                index === 0 ? "rgba(255,92,0,0.35)" : "var(--border)",
            }}
          >
            <div className="flex w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-secondary py-2">
              <span className="font-['Inter'] text-[8px] font-bold text-primary">
                {game.day}
              </span>
              <span className="font-['Barlow_Condensed'] text-xl font-extrabold leading-none text-foreground">
                {game.date}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate font-['Barlow_Condensed'] text-base font-bold text-foreground">
                  {game.court.toUpperCase()}
                </p>
                <span className="shrink-0 font-['Inter'] text-[9px] font-bold text-primary">
                  {game.time}
                </span>
              </div>
              <p className="mt-1 font-['Inter'] text-[10px] text-muted-foreground">
                {game.format} · {game.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
