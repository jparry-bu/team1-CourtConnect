import type { GameNotification } from "../types/GameActivity"

interface Props {
  onBack: () => void
  notifications: GameNotification[]
  readIds: string[]
  onMarkRead: (ids: string[]) => void
  onOpenChat: (gameId: number) => void
}

export default function NotificationsScreen({ onBack, notifications, readIds, onMarkRead, onOpenChat }: Props) {
  const unread = notifications.filter((item) => !readIds.includes(item.id))

  return (
    <div className="px-5 pb-8 pt-2">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        </button>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">{unread.length} unread</p>
          <h1 className="font-['Barlow_Condensed'] text-3xl font-extrabold leading-none text-foreground">NOTIFICATIONS</h1>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Game reminders and host updates in this browser. No push notifications are sent.</p>
      {unread.length > 0 && <button type="button" onClick={() => onMarkRead(unread.map((item) => item.id))} className="mt-4 text-xs font-semibold text-primary">Mark all as read</button>}
      {notifications.length === 0 && <p className="mt-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">No notifications yet. Join or host a game to see updates here.</p>}
      <div className="mt-4 flex flex-col gap-3">
        {notifications.map((item) => {
          const read = readIds.includes(item.id)
          return <div key={item.id} className={`rounded-xl border p-4 ${read ? "border-border bg-card" : "border-primary/40 bg-primary/10"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-['Barlow_Condensed'] text-lg font-bold text-foreground">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.detail}</p>
              </div>
              {!read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
            </div>
            <div className="mt-3 flex gap-4">
              <button type="button" onClick={() => { onMarkRead([item.id]); onOpenChat(item.gameId) }} className="text-xs font-semibold text-primary">Open game chat</button>
              {!read && <button type="button" onClick={() => onMarkRead([item.id])} className="text-xs text-muted-foreground">Mark read</button>}
            </div>
          </div>
        })}
      </div>
    </div>
  )
}
