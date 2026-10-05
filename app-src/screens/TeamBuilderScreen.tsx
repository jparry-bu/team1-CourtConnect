import { useState } from "react";

const allPlayers = [
  { id: 1, name: "Marcus Williams", pos: "PG", skill: 9, exp: "5 yrs", height: `6'1"`, avatar: "MW", checked: true },
  { id: 2, name: "Dre King", pos: "SG", skill: 8, exp: "4 yrs", height: `6'3"`, avatar: "DK", checked: true },
  { id: 3, name: "James Thompson", pos: "SF", skill: 7, exp: "3 yrs", height: `6'6"`, avatar: "JT", checked: true },
  { id: 4, name: "Aaron Richards", pos: "PF", skill: 8, exp: "6 yrs", height: `6'8"`, avatar: "AR", checked: true },
  { id: 5, name: "Sam Davis", pos: "C", skill: 7, exp: "4 yrs", height: `6'11"`, avatar: "SD", checked: true },
  { id: 6, name: "Tony Reeves", pos: "PG", skill: 6, exp: "2 yrs", height: `5'11"`, avatar: "TR", checked: true },
  { id: 7, name: "Leon Jackson", pos: "SG", skill: 7, exp: "3 yrs", height: `6'4"`, avatar: "LJ", checked: true },
  { id: 8, name: "Roy Barnes", pos: "SF", skill: 6, exp: "2 yrs", height: `6'5"`, avatar: "RB", checked: true },
  { id: 9, name: "Mike Kelly", pos: "PF", skill: 5, exp: "1 yr", height: `6'7"`, avatar: "MK", checked: true },
  { id: 10, name: "Sean Park", pos: "C", skill: 8, exp: "5 yrs", height: `7'0"`, avatar: "SP", checked: true },
];

type Player = (typeof allPlayers)[0];

function generateTeams(players: Player[]) {
  const sorted = [...players].sort((a, b) => b.skill - a.skill);
  const team1: Player[] = [];
  const team2: Player[] = [];
  sorted.forEach((p, i) => (i % 2 === 0 ? team1 : team2).push(p));
  return { team1, team2 };
}

const posColors: Record<string, string> = {
  PG: "#3b82f6",
  SG: "#8b5cf6",
  SF: "#22c55e",
  PF: "#f59e0b",
  C: "#ef4444",
};

export default function TeamBuilderScreen() {
  const [players, setPlayers] = useState(allPlayers);
  const [generated, setGenerated] = useState(false);
  const [teams, setTeams] = useState<{ team1: Player[]; team2: Player[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const selected = players.filter((p) => p.checked);

  function togglePlayer(id: number) {
    setGenerated(false);
    setTeams(null);
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p)));
  }

  function handleGenerate() {
    if (selected.length < 2) return;
    setLoading(true);
    setTimeout(() => {
      setTeams(generateTeams(selected));
      setGenerated(true);
      setLoading(false);
    }, 1400);
  }

  function teamAvg(team: Player[]) {
    return (team.reduce((s, p) => s + p.skill, 0) / team.length).toFixed(1);
  }

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Header */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5c00", boxShadow: "0 0 8px #ff5c00" }} />
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "#ff5c00", textTransform: "uppercase", fontFamily: "Inter" }}>
            AI Powered
          </p>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, color: "#f5f5f5", fontFamily: "Barlow Condensed" }}>
          TEAM BUILDER
        </h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "Inter", marginTop: 4 }}>
          Select players and let AI balance the teams
        </p>
      </div>

      {!generated ? (
        <div className="px-5">
          {/* Info bar */}
          <div
            style={{
              background: "rgba(255,92,0,0.08)",
              border: "1px solid rgba(255,92,0,0.2)",
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#ff5c00" strokeWidth={1.8} style={{ width: 16, height: 16, flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "Inter" }}>
              {selected.length} players selected — AI will balance by skill, position & experience
            </p>
          </div>

          {/* Player list */}
          <div className="flex flex-col gap-2">
            {players.map((player) => (
              <button
                key={player.id}
                onClick={() => togglePlayer(player.id)}
                style={{
                  background: player.checked ? "var(--card)" : "rgba(255,255,255,0.02)",
                  border: player.checked ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.04)",
                  borderRadius: 12,
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "left",
                  cursor: "pointer",
                  opacity: player.checked ? 1 : 0.4,
                  transition: "all 0.15s",
                  width: "100%",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: `hsl(${player.id * 37 + 180}, 55%, 30%)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "Inter",
                    flexShrink: 0,
                  }}
                >
                  {player.avatar}
                </div>

                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#f5f5f5", fontFamily: "Barlow Condensed", letterSpacing: "0.02em" }}>
                      {player.name.toUpperCase()}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: `${posColors[player.pos]}22`,
                        color: posColors[player.pos],
                        fontFamily: "Inter",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {player.pos}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "Inter" }}>{player.height}</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "Inter" }}>{player.exp}</span>
                  </div>
                </div>

                {/* Skill rating */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: player.checked ? "#f5f5f5" : "rgba(255,255,255,0.3)", fontFamily: "Barlow Condensed", lineHeight: 1 }}>
                    {player.skill}
                  </div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "Inter", letterSpacing: "0.06em" }}>SKILL</div>
                </div>

                {/* Checkbox */}
                <div
                  style={{
                    width: 20, height: 20, borderRadius: 6,
                    border: player.checked ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                    background: player.checked ? "#ff5c00" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.15s",
                  }}
                >
                  {player.checked && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} style={{ width: 11, height: 11 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={selected.length < 2 || loading}
            style={{
              width: "100%",
              marginTop: 20,
              padding: "15px",
              borderRadius: 14,
              border: "none",
              background: selected.length >= 2 ? "#ff5c00" : "rgba(255,255,255,0.06)",
              color: selected.length >= 2 ? "#fff" : "rgba(255,255,255,0.2)",
              fontSize: 16,
              fontWeight: 700,
              fontFamily: "Barlow Condensed",
              letterSpacing: "0.1em",
              cursor: selected.length >= 2 ? "pointer" : "not-allowed",
              boxShadow: selected.length >= 2 ? "0 6px 24px rgba(255,92,0,0.4)" : "none",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loading ? (
              <>
                <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                BUILDING BALANCED TEAMS...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 16, height: 16 }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                BUILD BALANCED TEAMS
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="px-5">
          {/* Balance score */}
          <div
            style={{
              background: "rgba(255,92,0,0.08)",
              border: "1px solid rgba(255,92,0,0.25)",
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ fontSize: 11, color: "#ff5c00", fontWeight: 600, fontFamily: "Inter", letterSpacing: "0.06em", textTransform: "uppercase" }}>Balance Score</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "Inter" }}>AI-optimized for fairness</p>
            </div>
            <div style={{ fontSize: 40, fontWeight: 800, color: "#ff5c00", fontFamily: "Barlow Condensed", lineHeight: 1 }}>97%</div>
          </div>

          {teams && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "TEAM 1", players: teams.team1, color: "#ff5c00" },
                { label: "TEAM 2", players: teams.team2, color: "#3b82f6" },
              ].map(({ label, players: tp, color }) => (
                <div
                  key={label}
                  style={{
                    background: "var(--card)",
                    border: `1px solid ${color}33`,
                    borderRadius: 14,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ background: `${color}18`, padding: "10px 12px", borderBottom: `1px solid ${color}22` }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color, fontFamily: "Barlow Condensed", letterSpacing: "0.06em" }}>{label}</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "Inter" }}>Avg skill: {teamAvg(tp)}</p>
                  </div>
                  <div style={{ padding: "10px 12px" }}>
                    {tp.map((p) => (
                      <div key={p.id} className="flex items-center gap-2 mb-2.5">
                        <div
                          style={{
                            width: 28, height: 28, borderRadius: "50%",
                            background: `hsl(${p.id * 37 + 180}, 55%, 30%)`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 9, fontWeight: 700, color: "#fff", fontFamily: "Inter",
                            flexShrink: 0,
                          }}
                        >
                          {p.avatar}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 11, fontWeight: 600, color: "#f5f5f5", fontFamily: "Barlow Condensed", letterSpacing: "0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {p.name.split(" ")[0].toUpperCase()}
                          </p>
                          <p style={{ fontSize: 9, color: posColors[p.pos], fontFamily: "Inter", fontWeight: 600 }}>{p.pos}</p>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.6)", fontFamily: "Barlow Condensed", flexShrink: 0 }}>{p.skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => { setGenerated(false); setTeams(null); }}
            style={{
              width: "100%",
              marginTop: 14,
              padding: "12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent",
              color: "rgba(255,255,255,0.5)",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "Barlow Condensed",
              letterSpacing: "0.06em",
              cursor: "pointer",
            }}
          >
            REGENERATE TEAMS
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
