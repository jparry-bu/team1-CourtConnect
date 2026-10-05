import { useState, useCallback } from "react"
import type { FormEvent } from "react"
import type { GameMessage, GameUpdate } from "../types/GameActivity"
import ReportModal from "../components/ReportModal"
import Toast from "../components/Toast"

interface ChatGame {
  id: number
  court: string
  when: string
  cancelled: boolean
}

interface Props {
  onBack: () => void
  games: ChatGame[]
  initialGameId: number | null
  messages: GameMessage[]
  updates: GameUpdate[]
  onSend: (gameId: number, body: string) => void
}

function saveReport(category: string, detail: string, target: string) {
  try {
    const existing = JSON.parse(localStorage.getItem("courtconnect-reports") ?? "[]") as unknown[]
    existing.push({ id: crypto.randomUUID(), type: "message", target, category, detail, createdAt: new Date().toISOString() })
    localStorage.setItem("courtconnect-reports", JSON.stringify(existing))
  } catch {
    // ignore storage errors
  }
}

export default function MessagesScreen({ onBack, games, initialGameId, messages, updates, onSend }: Props) {
  const [activeGameId, setActiveGameId] = useState<number | null>(initialGameId)
  const [draft, setDraft] = useState("")
  const [reportTarget, setReportTarget] = useState<{ id: string; body: string } | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const activeGame = games.find((game) => game.id === activeGameId)

  const dismissToast = useCallback(() => setToast(null), [])

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!activeGame || !draft.trim()) return
    onSend(activeGame.id, draft)
    setDraft("")
  }

  const activity = activeGame ? [
    ...messages.filter((message) => message.gameId === activeGame.id).map((message) => ({ id: `message-${message.id}`, rawId: message.id, body: message.body, createdAt: message.createdAt, system: false })),
    ...updates.filter((update) => update.gameId === activeGame.id).map((update) => ({ id: `update-${update.id}`, rawId: update.id, body: update.detail, createdAt: update.createdAt, system: true })),
  ].sort((a, b) => a.createdAt.localeCompare(b.createdAt)) : []

  return (
    <div className="flex min-h-full flex-col px-5 pb-8 pt-2">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => activeGame ? setActiveGameId(null) : onBack()} aria-label={activeGame ? "Back to game chats" : "Back"} className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        </button>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">{activeGame ? "Game chat" : "Your conversations"}</p>
          <h1 className="font-['Barlow_Condensed'] text-3xl font-extrabold leading-none text-foreground">{activeGame ? activeGame.court.toUpperCase() : "MESSAGES"}</h1>
        </div>
      </div>

      {activeGame ? (
        <>
          <p className="mt-3 text-xs text-muted-foreground">{activeGame.when}{activeGame.cancelled ? " · Cancelled" : ""}</p>
          <div className="mt-5 flex flex-1 flex-col gap-3" role="log" aria-label="Game chat messages">
            {activity.length === 0 && <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">No messages yet. Start the conversation with your game group.</p>}
            {activity.map((item) => (
              <div key={item.id} className={item.system ? "self-center rounded-xl bg-secondary px-4 py-2 text-center text-xs text-secondary-foreground" : "group relative max-w-[85%] self-end"}>
                {item.system ? (
                  <>
                    <p className="break-words">{item.body}</p>
                    <time dateTime={item.createdAt} className="mt-1 block opacity-70">{new Date(item.createdAt).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" })}</time>
                  </>
                ) : (
                  <div className="flex items-end gap-2">
                    {/* Report flag — appears on hover */}
                    <button
                      type="button"
                      onClick={() => setReportTarget({ id: item.rawId, body: item.body })}
                      aria-label="Report message"
                      className="mb-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1.8} style={{ width: 14, height: 14 }}>
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                        <line x1="4" y1="22" x2="4" y2="15" />
                      </svg>
                    </button>
                    <div className="rounded-2xl bg-primary px-4 py-3 text-xs text-primary-foreground flex-1">
                      <p className="mb-1 font-semibold">You</p>
                      <p className="break-words">{item.body}</p>
                      <time dateTime={item.createdAt} className="mt-1 block opacity-70">{new Date(item.createdAt).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" })}</time>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={send} className="mt-6 flex gap-2 border-t border-border pt-3">
            <input value={draft} onChange={(event) => setDraft(event.target.value)} aria-label="Message the game group" placeholder="Message the game group..." className="min-w-0 flex-1 rounded-xl border border-border bg-card px-4 py-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary" />
            <button type="submit" disabled={!draft.trim()} className="rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-50">Send</button>
          </form>
        </>
      ) : (
        <>
          <p className="mt-4 text-xs text-muted-foreground">Chats for games you joined or host. Messages are saved in this browser only.</p>
          {games.length === 0 && <p className="mt-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">Join or host a game to start a game chat.</p>}
          <div className="mt-4 flex flex-col">
            {games.map((game) => {
              const lastMessage = messages.filter((item) => item.gameId === game.id).at(-1)
              return <button key={game.id} type="button" onClick={() => setActiveGameId(game.id)} className="flex items-center gap-3 border-b border-border py-4 text-left">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground" aria-hidden="true">{game.court.slice(0, 2).toUpperCase()}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-['Barlow_Condensed'] text-lg font-bold text-foreground">{game.court} · Game chat</span>
                  <span className="block truncate text-xs text-muted-foreground">{lastMessage ? `You: ${lastMessage.body}` : game.cancelled ? "Cancelled · Open to coordinate" : game.when}</span>
                </span>
                <span className="text-primary" aria-hidden="true">›</span>
              </button>
            })}
          </div>
        </>
      )}

      {reportTarget && (
        <ReportModal
          context="message"
          targetLabel={`"${reportTarget.body.slice(0, 60)}${reportTarget.body.length > 60 ? "…" : ""}"`}
          onClose={() => setReportTarget(null)}
          onSubmit={(category, detail) => {
            saveReport(category, detail, reportTarget.id)
            setReportTarget(null)
            setToast("Report submitted — thank you.")
          }}
        />
      )}

      {toast && <Toast message={toast} onDismiss={dismissToast} />}
    </div>
  )
}
