import { useState } from "react";
import type { GameDivision, HostedGame, PlayerDivision } from "../types/HostedGame";

const courts = ["Hoyt Field", "Sennott Park", "Malcolm X Park", "Ringer Playground", "Danehy Park"];
const formats = ["5v5 Full Court", "3v3 Half Court", "4v4 Full Court", "2v2 Half Court"];
const skillLevels = ["All Levels", "Recreational", "Intermediate", "Competitive", "Pro"];

type Step = 1 | 2 | 3 | 4;

function today() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

interface Props {
  onCreate: (game: HostedGame) => void;
  onViewGames: () => void;
  playerDivision: PlayerDivision;
}

export default function CreateGameScreen({ onCreate, onViewGames, playerDivision }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    court: "",
    date: today(),
    time: "18:00",
    format: "",
    skill: "",
    division: playerDivision as GameDivision,
    players: 10,
  });
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  const canProceed = (() => {
    if (step === 1) return !!form.court;
    if (step === 2) return !!form.date && !!form.time && new Date(`${form.date}T${form.time}`) > new Date();
    if (step === 3) return !!form.format && !!form.skill;
    return true;
  })();

  if (submitted) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", minHeight: 600 }}>
        <div
          style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "rgba(255,92,0,0.15)",
            border: "2px solid rgba(255,92,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 20,
            boxShadow: "0 0 40px rgba(255,92,0,0.3)",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#ff5c00" strokeWidth={2.5} style={{ width: 36, height: 36 }}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: "#f5f5f5", fontFamily: "Barlow Condensed", textAlign: "center", marginBottom: 8 }}>
          GAME CREATED!
        </h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontFamily: "Inter", textAlign: "center", lineHeight: 1.6, marginBottom: 8 }}>
          Your game at {form.court} has been posted. Players can now find and join your game.
        </p>
        <p style={{ fontSize: 12, color: "#ff5c00", fontFamily: "Inter", fontWeight: 600 }}>
          {form.division} · {form.format} · {form.skill} · {form.players} players
        </p>
        <button
          onClick={() => { setSubmitted(false); setStep(1); setForm({ court: "", date: today(), time: "18:00", format: "", skill: "", division: playerDivision, players: 10 }); }}
          style={{
            marginTop: 32,
            padding: "12px 32px",
            background: "#ff5c00",
            border: "none",
            borderRadius: 12,
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "Barlow Condensed",
            letterSpacing: "0.08em",
            cursor: "pointer",
          }}
        >
          HOST ANOTHER GAME
        </button>
        <button type="button" onClick={onViewGames} className="mt-4 text-sm font-semibold text-primary">
          VIEW IN PICKUP GAMES
        </button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Header */}
      <div className="px-5 pt-2 pb-5">
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "#ff5c00", textTransform: "uppercase", fontFamily: "Inter" }}>
          Step {step} of 4
        </p>
        <h1 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, color: "#f5f5f5", fontFamily: "Barlow Condensed" }}>
          HOST A GAME
        </h1>

        {/* Progress bar */}
        <div style={{ marginTop: 14, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
          <div
            style={{
              height: "100%",
              width: `${(step / 4) * 100}%`,
              background: "#ff5c00",
              borderRadius: 2,
              transition: "width 0.3s",
            }}
          />
        </div>
      </div>

      <div className="px-5">
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f5f5f5", fontFamily: "Barlow Condensed", marginBottom: 4 }}>SELECT A COURT</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "Inter", marginBottom: 16 }}>Where will the game be held?</p>
            <div className="flex flex-col gap-2">
              {courts.map((c) => (
                <button
                  key={c}
                  onClick={() => update("court", c)}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: form.court === c ? "1.5px solid #ff5c00" : "1px solid rgba(255,255,255,0.08)",
                    background: form.court === c ? "rgba(255,92,0,0.08)" : "var(--card)",
                    color: form.court === c ? "#ff5c00" : "rgba(255,255,255,0.7)",
                    textAlign: "left",
                    fontSize: 15,
                    fontWeight: 600,
                    fontFamily: "Barlow Condensed",
                    letterSpacing: "0.03em",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {c.toUpperCase()}
                  {form.court === c && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="#ff5c00" strokeWidth={2.5} style={{ width: 16, height: 16 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f5f5f5", fontFamily: "Barlow Condensed", marginBottom: 4 }}>SET DATE & TIME</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "Inter", marginBottom: 16 }}>When does the game start?</p>

            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="host-game-date" style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter", display: "block", marginBottom: 8 }}>Date</label>
                <input
                  id="host-game-date"
                  type="date"
                  min={today()}
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    background: "var(--card)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "#f5f5f5",
                    fontSize: 15,
                    fontFamily: "Inter",
                    outline: "none",
                    colorScheme: "dark",
                  }}
                />
              </div>
              <div>
                <label htmlFor="host-game-time" style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter", display: "block", marginBottom: 8 }}>Time</label>
                <input
                  id="host-game-time"
                  type="time"
                  value={form.time}
                  onChange={(e) => update("time", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    background: "var(--card)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "#f5f5f5",
                    fontSize: 15,
                    fontFamily: "Inter",
                    outline: "none",
                    colorScheme: "dark",
                  }}
                />
              </div>
            </div>
            {!canProceed && <p className="mt-3 text-xs text-primary">Choose a future date and time to continue.</p>}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f5f5f5", fontFamily: "Barlow Condensed", marginBottom: 4 }}>GAME FORMAT</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "Inter", marginBottom: 16 }}>Choose format and skill level</p>

            <div className="mb-5">
              <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter", display: "block", marginBottom: 8 }}>Format</label>
              <div className="grid grid-cols-2 gap-2">
                {formats.map((f) => (
                  <button
                    key={f}
                    onClick={() => update("format", f)}
                    style={{
                      padding: "12px 8px",
                      borderRadius: 10,
                      border: form.format === f ? "1.5px solid #ff5c00" : "1px solid rgba(255,255,255,0.08)",
                      background: form.format === f ? "rgba(255,92,0,0.08)" : "var(--card)",
                      color: form.format === f ? "#ff5c00" : "rgba(255,255,255,0.6)",
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: "Barlow Condensed",
                      letterSpacing: "0.02em",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "Inter", display: "block", marginBottom: 8 }}>Skill Level</label>
              <div className="flex flex-col gap-2">
                {skillLevels.map((s) => (
                  <button
                    key={s}
                    onClick={() => update("skill", s)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 10,
                      border: form.skill === s ? "1.5px solid #ff5c00" : "1px solid rgba(255,255,255,0.08)",
                      background: form.skill === s ? "rgba(255,92,0,0.08)" : "var(--card)",
                      color: form.skill === s ? "#ff5c00" : "rgba(255,255,255,0.6)",
                      textAlign: "left",
                      fontSize: 14,
                      fontWeight: 600,
                      fontFamily: "Barlow Condensed",
                      letterSpacing: "0.04em",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {s.toUpperCase()}
                    {form.skill === s && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#ff5c00" strokeWidth={2.5} style={{ width: 14, height: 14 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Game division</label>
              <div className="grid grid-cols-2 gap-2">
                {([playerDivision, "Co-ed"] as GameDivision[]).map((division) => (
                  <button
                    key={division}
                    type="button"
                    onClick={() => update("division", division)}
                    className={`rounded-lg border px-3 py-3 text-sm font-bold ${form.division === division ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"}`}
                  >
                    {division}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">You can host games for your player division or create a co-ed game open to both divisions.</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f5f5f5", fontFamily: "Barlow Condensed", marginBottom: 4 }}>PLAYERS NEEDED</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "Inter", marginBottom: 20 }}>How many players are needed total?</p>

            {/* Counter */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 32 }}>
              <button
                onClick={() => update("players", Math.max(2, form.players - 1))}
                style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "var(--secondary)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontSize: 22,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                −
              </button>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 72, fontWeight: 800, color: "#ff5c00", fontFamily: "Barlow Condensed", lineHeight: 1 }}>{form.players}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "Inter" }}>players</div>
              </div>
              <button
                onClick={() => update("players", Math.min(20, form.players + 1))}
                style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "var(--secondary)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontSize: 22,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>

            {/* Summary */}
            <div style={{ background: "var(--card)", borderRadius: 14, padding: 16, border: "1px solid rgba(255,92,0,0.2)" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.5)", fontFamily: "Barlow Condensed", letterSpacing: "0.06em", marginBottom: 12 }}>GAME SUMMARY</h3>
              {[
                { label: "Court", value: form.court },
                { label: "Date", value: new Date(form.date + "T" + form.time).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) },
                { label: "Time", value: new Date("2000-01-01T" + form.time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) },
                { label: "Format", value: form.format },
                { label: "Skill", value: form.skill },
                { label: "Division", value: form.division },
                { label: "Players", value: `${form.players} total` },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "Inter" }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#f5f5f5", fontFamily: "Inter" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              style={{
                flex: 1,
                padding: "13px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent",
                color: "rgba(255,255,255,0.5)",
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "Barlow Condensed",
                letterSpacing: "0.06em",
                cursor: "pointer",
              }}
            >
              BACK
            </button>
          )}
          <button
            onClick={() => {
              if (!canProceed) return;
              if (step === 4) {
                onCreate({ ...form, id: Date.now() });
                setSubmitted(true);
                return;
              }
              setStep((s) => (s + 1) as Step);
            }}
            style={{
              flex: 2,
              padding: "13px",
              borderRadius: 12,
              border: "none",
              background: canProceed ? "#ff5c00" : "rgba(255,255,255,0.06)",
              color: canProceed ? "#fff" : "rgba(255,255,255,0.2)",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "Barlow Condensed",
              letterSpacing: "0.06em",
              cursor: canProceed ? "pointer" : "not-allowed",
              transition: "all 0.15s",
              boxShadow: canProceed ? "0 4px 20px rgba(255,92,0,0.35)" : "none",
            }}
          >
            {step === 4 ? "POST GAME" : "CONTINUE"}
          </button>
        </div>
      </div>
    </div>
  );
}
