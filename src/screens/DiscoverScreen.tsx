import { useState } from "react"

const courts = [
  {
    id: "hoyt",
    name: "Hoyt Field",
    location: "Cambridge, MA",
    distance: "0.3 mi",
    rating: 4.9,
    courts: 4,
    surface: "Asphalt",
    lights: true,
    active: 12,
    nextGame: "Today 6PM",
    tags: ["Pro Level", "Legendary"],
    image: "photo-1546519638405-a9f3e2a716e0",
  },
  {
    id: "sennott",
    name: "Sennott Park",
    location: "Cambridge, MA",
    distance: "0.8 mi",
    rating: 4.7,
    courts: 2,
    surface: "Asphalt",
    lights: false,
    active: 8,
    nextGame: "Today 7PM",
    tags: ["Competitive", "Outdoor"],
    image: "photo-1504450758481-7338eba7524a",
  },
  {
    id: "ringer",
    name: "Ringer Playground",
    location: "Allston, MA",
    distance: "1.2 mi",
    rating: 4.5,
    courts: 3,
    surface: "Concrete",
    lights: true,
    active: 5,
    nextGame: "Tomorrow 5PM",
    tags: ["Recreational", "All Ages"],
    image: "photo-1519861531473-9200262188bf",
  },
  {
    id: "malcolmx",
    name: "Malcolm X Park",
    location: "Roxbury, MA",
    distance: "2.1 mi",
    rating: 4.8,
    courts: 5,
    surface: "Asphalt",
    lights: false,
    active: 18,
    nextGame: "Today 5PM",
    tags: ["Scenic", "Pro Level"],
    image: "photo-1558618666-fcd25c85cd64",
  },
]

const filters = ["All", "Open Now", "Lit Courts", "Nearby", "Pro Level"]

interface Props {
  onCourtSelect: (id: string) => void
  onCalendar: () => void
  onMessages: () => void
  onNotifications: () => void
  unreadNotifications: number
}

export default function DiscoverScreen({
  onCourtSelect,
  onCalendar,
  onMessages,
  onNotifications,
  unreadNotifications,
}: Props) {
  const [activeFilter, setActiveFilter] = useState("All")
  const [following, setFollowing] = useState<string[]>(["hoyt"])
  const [search, setSearch] = useState("")
  const [aiQuery, setAiQuery] = useState("")
  const [view, setView] = useState<"list" | "map">("list")
  const [selectedPin, setSelectedPin] = useState("hoyt")

  const filteredCourts = courts.filter((court) => {
    const term = aiQuery.toLowerCase()
    const matchesSearch =
      !term ||
      `${court.name} ${court.location} ${court.tags.join(" ")} ${court.surface}`
        .toLowerCase()
        .includes(term) ||
      (term.includes("light") && court.lights) ||
      (term.includes("near") && Number.parseFloat(court.distance) < 1)
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Lit Courts" && court.lights) ||
      (activeFilter === "Nearby" && Number.parseFloat(court.distance) < 1) ||
      (activeFilter === "Pro Level" && court.tags.includes("Pro Level")) ||
      activeFilter === "Open Now"
    return matchesSearch && matchesFilter
  })

  function runAiSearch(query = search) {
    setSearch(query)
    setAiQuery(query.trim())
  }

  return (
    <div style={{ paddingBottom: 8 }}>
      {/* Header */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "#ff5c00",
                textTransform: "uppercase",
                fontFamily: "Inter",
              }}
            >
              Boston / Cambridge, MA
            </p>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 800,
                lineHeight: 1,
                color: "#f5f5f5",
                fontFamily: "Barlow Condensed",
              }}
            >
              FIND A COURT
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onNotifications}
              aria-label={`Open notifications${unreadNotifications ? `, ${unreadNotifications} unread` : ""}`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-secondary-foreground"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4" aria-hidden="true">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />
              </svg>
              {unreadNotifications > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground" aria-hidden="true">{unreadNotifications}</span>}
            </button>
            <button
              onClick={onCalendar}
              aria-label="Open game calendar"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-secondary-foreground"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="h-4 w-4"
              >
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M8 2v4M16 2v4M3 10h18" />
              </svg>
            </button>
            <button
              onClick={onMessages}
              aria-label="Open messages"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="h-4 w-4"
              >
                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* AI Search */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            marginBottom: 14,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--primary)"
            strokeWidth={1.8}
            style={{ width: 16, height: 16, flexShrink: 0 }}
          >
            <path d="M12 3 10.6 7.1a5.3 5.3 0 0 1-3.5 3.5L3 12l4.1 1.4a5.3 5.3 0 0 1 3.5 3.5L12 21l1.4-4.1a5.3 5.3 0 0 1 3.5-3.5L21 12l-4.1-1.4a5.3 5.3 0 0 1-3.5-3.5Z" />
          </svg>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && runAiSearch()}
            placeholder="Ask AI: lit courts under 1 mile..."
            className="min-w-0 flex-1 bg-transparent font-['Inter'] text-xs text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => runAiSearch()}
            className="rounded-md bg-primary px-2 py-1 font-['Inter'] text-[9px] font-bold uppercase tracking-wider text-primary-foreground"
          >
            Ask
          </button>
        </div>

        {aiQuery && (
          <div className="mb-3 flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/8 px-3 py-2.5">
            <span className="mt-0.5 font-['Inter'] text-[9px] font-bold uppercase tracking-wider text-primary">
              AI
            </span>
            <p className="font-['Inter'] text-[10px] leading-4 text-secondary-foreground">
              I found {filteredCourts.length} court
              {filteredCourts.length === 1 ? "" : "s"} matching “{aiQuery}”.
              Results prioritize distance, amenities, and active games.
            </p>
            <button
              onClick={() => {
                setSearch("")
                setAiQuery("")
              }}
              className="ml-auto text-muted-foreground"
              aria-label="Clear AI search"
            >
              ×
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div
            className="flex min-w-0 flex-1 gap-2 overflow-x-auto"
            style={{ scrollbarWidth: "none", paddingBottom: 2 }}
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  flexShrink: 0,
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "Inter",
                  letterSpacing: "0.02em",
                  border:
                    activeFilter === f
                      ? "none"
                      : "1px solid rgba(255,255,255,0.1)",
                  background:
                    activeFilter === f ? "#ff5c00" : "rgba(255,255,255,0.04)",
                  color: activeFilter === f ? "#fff" : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex shrink-0 rounded-lg border border-border bg-card p-0.5">
            {(["list", "map"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setView(option)}
                className="rounded-md px-2 py-1.5 font-['Inter'] text-[9px] font-bold uppercase"
                style={{
                  background:
                    view === option ? "var(--primary)" : "transparent",
                  color:
                    view === option
                      ? "var(--primary-foreground)"
                      : "var(--muted-foreground)",
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map preview */}
      <div
        style={{
          margin: "0 20px 20px",
          borderRadius: 16,
          overflow: "hidden",
          height: view === "map" ? 300 : 140,
          background: "#1a1a1d",
          position: "relative",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=700&h=280&fit=crop&auto=format"
          alt="Map view of courts"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.4,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(255,92,0,0.1) 0%, transparent 60%)",
          }}
        />
        {/* Court pins */}
        {[
          { id: "hoyt", x: 30, y: 40 },
          { id: "sennott", x: 55, y: 60 },
          { id: "ringer", x: 70, y: 30 },
          { id: "malcolmx", x: 20, y: 70 },
        ].map((pos, i) => (
          <button
            key={pos.id}
            onClick={() => setSelectedPin(pos.id)}
            aria-label={`Select ${courts.find((court) => court.id === pos.id)?.name}`}
            style={{
              position: "absolute",
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
              width: selectedPin === pos.id ? 22 : 14,
              height: selectedPin === pos.id ? 22 : 14,
              borderRadius: "50%",
              background:
                selectedPin === pos.id ? "#ff5c00" : "rgba(255,92,0,0.5)",
              border: `${selectedPin === pos.id ? 2.5 : 1.5}px solid ${
                selectedPin === pos.id ? "#fff" : "rgba(255,255,255,0.4)"
              }`,
              boxShadow:
                selectedPin === pos.id ? "0 0 16px rgba(255,92,0,0.8)" : "none",
            }}
          />
        ))}
        {view === "map" && (
          <button
            onClick={() => onCourtSelect(selectedPin)}
            className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl border border-border bg-background/90 px-4 py-3 text-left backdrop-blur"
          >
            <div>
              <p className="font-['Barlow_Condensed'] text-base font-bold text-foreground">
                {courts
                  .find((court) => court.id === selectedPin)
                  ?.name.toUpperCase()}
              </p>
              <p className="font-['Inter'] text-[10px] text-muted-foreground">
                {courts.find((court) => court.id === selectedPin)?.distance} ·{" "}
                {courts.find((court) => court.id === selectedPin)?.active}{" "}
                active now
              </p>
            </div>
            <span className="font-['Inter'] text-[10px] font-bold uppercase text-primary">
              View court
            </span>
          </button>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            background: "rgba(0,0,0,0.7)",
            borderRadius: 8,
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 600,
            color: "#ff5c00",
            fontFamily: "Inter",
            letterSpacing: "0.04em",
          }}
        >
          {filteredCourts.length} COURTS NEARBY
        </div>
      </div>

      {/* Court list */}
      {view === "list" && (
        <div className="px-5">
          <div className="flex items-center justify-between mb-3">
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#f5f5f5",
                fontFamily: "Barlow Condensed",
                letterSpacing: "0.02em",
              }}
            >
              NEARBY COURTS
            </h2>
            <span
              style={{
                fontSize: 12,
                color: "#ff5c00",
                fontWeight: 600,
                fontFamily: "Inter",
              }}
            >
              {filteredCourts.length} found
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {filteredCourts.map((court) => (
              <div
                key={court.id}
                role="button"
                tabIndex={0}
                aria-label={`View ${court.name}`}
                onClick={() => onCourtSelect(court.id)}
                onKeyDown={(event) => {
                  if (
                    event.target === event.currentTarget &&
                    (event.key === "Enter" || event.key === " ")
                  ) {
                    event.preventDefault()
                    onCourtSelect(court.id)
                  }
                }}
                style={{
                  background: "var(--card)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  overflow: "hidden",
                  textAlign: "left",
                  cursor: "pointer",
                  width: "100%",
                  transition: "transform 0.15s, border-color 0.15s",
                }}
              >
                <div style={{ position: "relative", height: 120 }}>
                  <img
                    src={`https://images.unsplash.com/${court.image}?w=700&h=240&fit=crop&auto=format`}
                    alt={court.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(13,13,15,0.9) 0%, rgba(13,13,15,0.2) 60%)",
                    }}
                  />
                  {court.nextGame && (
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        background: "#ff5c00",
                        borderRadius: 6,
                        padding: "3px 8px",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#fff",
                        fontFamily: "Inter",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {court.nextGame.toUpperCase()}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFollowing((prev) =>
                        prev.includes(court.id)
                          ? prev.filter((f) => f !== court.id)
                          : [...prev, court.id],
                      )
                    }}
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.5)",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    aria-label={`${following.includes(court.id) ? "Unfollow" : "Follow"} ${court.name}`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill={following.includes(court.id) ? "#ff5c00" : "none"}
                      stroke={
                        following.includes(court.id)
                          ? "#ff5c00"
                          : "rgba(255,255,255,0.7)"
                      }
                      strokeWidth={1.8}
                      style={{ width: 14, height: 14 }}
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>

                  <div style={{ position: "absolute", bottom: 10, left: 12 }}>
                    <div className="flex gap-1.5 mb-1">
                      {court.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: "rgba(255,255,255,0.7)",
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: 4,
                            padding: "2px 6px",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            fontFamily: "Inter",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ padding: "12px 14px 14px" }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: "#f5f5f5",
                          fontFamily: "Barlow Condensed",
                          lineHeight: 1.1,
                        }}
                      >
                        {court.name.toUpperCase()}
                      </h3>
                      <p
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.4)",
                          fontFamily: "Inter",
                          marginTop: 1,
                        }}
                      >
                        {court.location} · {court.distance}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        flexShrink: 0,
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="#ff5c00"
                        style={{ width: 12, height: 12 }}
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#f5f5f5",
                          fontFamily: "Inter",
                        }}
                      >
                        {court.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
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
                          color: "rgba(255,255,255,0.5)",
                          fontFamily: "Inter",
                        }}
                      >
                        {court.active} active
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "Inter",
                      }}
                    >
                      {court.courts} courts
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "Inter",
                      }}
                    >
                      {court.surface}
                    </div>
                    {court.lights && (
                      <div className="flex items-center gap-1">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#facc15"
                          strokeWidth={2}
                          style={{ width: 11, height: 11 }}
                        >
                          <circle cx="12" cy="12" r="4" />
                          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                        </svg>
                        <span
                          style={{
                            fontSize: 11,
                            color: "#facc15",
                            fontFamily: "Inter",
                          }}
                        >
                          Lit
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredCourts.length === 0 && (
              <div className="rounded-2xl border border-border bg-card px-5 py-8 text-center">
                <p className="font-['Barlow_Condensed'] text-lg font-bold text-foreground">
                  NO COURTS FOUND
                </p>
                <p className="mt-1 font-['Inter'] text-[11px] text-muted-foreground">
                  Try a broader AI search or clear your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ height: 24 }} />
    </div>
  )
}
