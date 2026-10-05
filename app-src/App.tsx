import { useEffect, useState } from "react"
import type { ReactElement } from "react"
import type { HostedGame } from "./types/HostedGame"
import type { GameRegistrations, PlayerPosition } from "./types/GameRegistration"
import type { GameMessage, GameNotification, GameUpdate } from "./types/GameActivity"
import type { StoredAccount, UserProfile } from "./types/UserAccount"
import DiscoverScreen from "./screens/DiscoverScreen"
import GamesScreen, { demoGames } from "./screens/GamesScreen"
import CreateGameScreen from "./screens/CreateGameScreen"
import ProfileScreen from "./screens/ProfileScreen"
import TeamBuilderScreen from "./screens/TeamBuilderScreen"
import CourtDetailScreen from "./screens/CourtDetailScreen"
import CalendarScreen from "./screens/CalendarScreen"
import MessagesScreen from "./screens/MessagesScreen"
import NotificationsScreen from "./screens/NotificationsScreen"
import RegistrationScreen from "./screens/RegistrationScreen"

export type Screen = "discover" | "games" | "create" | "profile" | "teambuilder" | "court-detail" | "calendar" | "messages" | "notifications"

const legacyCourtNames: Record<string, string> = {
  "Rucker Park": "Hoyt Field",
  "West 4th Street Courts": "Sennott Park",
  "Venice Beach Courts": "Malcolm X Park",
  "Jesse Owens Park": "Ringer Playground",
  "Dyckman Park": "Danehy Park",
}

function loadActivity<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch {
    return fallback
  }
}

function saveActivity(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Keep activity in memory when browser storage is unavailable.
  }
}

async function hashPassword(password: string) {
  const data = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")
}

function profileFromAccount(account: StoredAccount): UserProfile {
  return {
    name: account.name,
    email: account.email,
    handle: account.handle,
    city: account.city,
    position: account.position,
    skill: account.skill,
    playerDivision: account.playerDivision ?? "Men's",
    heightInches: account.heightInches,
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Screen>("discover")
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null)
  const [prevTab, setPrevTab] = useState<Screen>("discover")
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const sessionEmail = loadActivity<string | null>("courtconnect-session", null)
    const account = loadActivity<StoredAccount[]>("courtconnect-accounts", []).find((item) => item.email === sessionEmail)
    if (!account) return null
    return profileFromAccount(account)
  })
  const [hostedGames, setHostedGames] = useState<HostedGame[]>(() => {
    try {
      const saved = localStorage.getItem("courtconnect-hosted-games")
      const games = saved ? JSON.parse(saved) as HostedGame[] : []
      return games.map((game) => ({
        ...game,
        court: legacyCourtNames[game.court] ?? game.court,
      }))
    } catch {
      return []
    }
  })
  const [gameRegistrations, setGameRegistrations] = useState<GameRegistrations>(() => {
    try {
      const saved = localStorage.getItem("courtconnect-game-registrations")
      return saved ? JSON.parse(saved) as GameRegistrations : {}
    } catch {
      return {}
    }
  })
  const [gameMessages, setGameMessages] = useState<GameMessage[]>(() => loadActivity("courtconnect-game-messages", []))
  const [gameUpdates, setGameUpdates] = useState<GameUpdate[]>(() => loadActivity("courtconnect-game-updates", []))
  const [readNotifications, setReadNotifications] = useState<string[]>(() => loadActivity("courtconnect-read-notifications", []))
  const [selectedGameChat, setSelectedGameChat] = useState<number | null>(null)

  useEffect(() => { saveActivity("courtconnect-game-messages", gameMessages) }, [gameMessages])
  useEffect(() => { saveActivity("courtconnect-game-updates", gameUpdates) }, [gameUpdates])
  useEffect(() => { saveActivity("courtconnect-read-notifications", readNotifications) }, [readNotifications])

  useEffect(() => {
    try {
      localStorage.setItem("courtconnect-hosted-games", JSON.stringify(hostedGames))
    } catch {
      // Games remain available for this session if browser storage is unavailable.
    }
  }, [hostedGames])

  useEffect(() => {
    try {
      localStorage.setItem("courtconnect-game-registrations", JSON.stringify(gameRegistrations))
    } catch {
      // Registrations remain available for this session if browser storage is unavailable.
    }
  }, [gameRegistrations])

  function updateRegistration(gameId: number, position: PlayerPosition | null) {
    setGameRegistrations((current) => {
      const next = { ...current }
      if (position) next[gameId] = position
      else delete next[gameId]
      return next
    })
  }

  async function login(email: string, password: string) {
    const accounts = loadActivity<StoredAccount[]>("courtconnect-accounts", [])
    const account = accounts.find((item) => item.email === email)
    if (!account || account.passwordHash !== await hashPassword(password)) {
      return "Email or password is incorrect."
    }
    saveActivity("courtconnect-session", account.email)
    setCurrentUser(profileFromAccount(account))
    setActiveTab("discover")
    return null
  }

  async function signup(profile: UserProfile, password: string) {
    const accounts = loadActivity<StoredAccount[]>("courtconnect-accounts", [])
    if (accounts.some((account) => account.email === profile.email)) {
      return "An account with this email already exists."
    }
    if (accounts.some((account) => account.handle.toLowerCase() === profile.handle.toLowerCase())) {
      return "That username is already taken."
    }
    const account: StoredAccount = { ...profile, passwordHash: await hashPassword(password) }
    saveActivity("courtconnect-accounts", [...accounts, account])
    saveActivity("courtconnect-session", profile.email)
    setCurrentUser(profile)
    setActiveTab("discover")
    return null
  }

  function logout() {
    try {
      localStorage.removeItem("courtconnect-session")
    } catch {
      // The in-memory session still ends if browser storage is unavailable.
    }
    setCurrentUser(null)
    setActiveTab("discover")
  }

  function updateHostedGame(gameId: number, change: { date: string; time: string } | { cancelled: true }) {
    const game = hostedGames.find((item) => item.id === gameId)
    if (!game || game.cancelled) return
    const createdAt = new Date().toISOString()
    if ("cancelled" in change) {
      setHostedGames((current) => current.map((item) => item.id === gameId ? { ...item, cancelled: true } : item))
      setGameUpdates((current) => [...current, { id: crypto.randomUUID(), gameId, kind: "cancelled", detail: `${game.court} has been cancelled by the host.`, createdAt }])
    } else if (change.date !== game.date || change.time !== game.time) {
      setHostedGames((current) => current.map((item) => item.id === gameId ? { ...item, ...change } : item))
      const when = new Date(`${change.date}T${change.time}`).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
      setGameUpdates((current) => [...current, { id: crypto.randomUUID(), gameId, kind: "rescheduled", detail: `${game.court} was moved to ${when}.`, createdAt }])
    }
  }

  const visibleHostedGames = currentUser
    ? hostedGames.filter((game) => (game.division ?? "Co-ed") === currentUser.playerDivision || (game.division ?? "Co-ed") === "Co-ed")
    : []
  const chatGames = [
    ...visibleHostedGames.filter((game) => !game.hostEmail || game.hostEmail === currentUser?.email || !!gameRegistrations[game.id]).map((game) => ({ id: game.id, court: game.court, when: new Date(`${game.date}T${game.time}`).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }), cancelled: !!game.cancelled })),
    ...demoGames.filter((game) => !!gameRegistrations[game.id] && currentUser && (game.division === currentUser.playerDivision || game.division === "Co-ed")).map((game) => ({ id: game.id, court: game.court, when: `${game.time} · ${game.timeDetail}`, cancelled: false })),
  ]
  const notifications: GameNotification[] = [
    ...gameUpdates.filter((update) => chatGames.some((game) => game.id === update.gameId)).map((update) => ({
      id: `update-${update.id}`, gameId: update.gameId, title: update.kind === "cancelled" ? "Game cancelled" : "Schedule changed", detail: update.detail, createdAt: update.createdAt, kind: update.kind,
    })),
    ...chatGames.filter((game) => !game.cancelled && !hostedGames.some((hosted) => hosted.id === game.id && new Date(`${hosted.date}T${hosted.time}`).getTime() < Date.now())).map((game) => ({
      id: `upcoming-${game.id}-${game.when}`, gameId: game.id, title: "Upcoming game", detail: `${game.court} · ${game.when}`, createdAt: "", kind: "upcoming" as const,
    })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const unreadCount = notifications.filter((item) => !readNotifications.includes(item.id)).length

  function openMessages(gameId: number | null) {
    setSelectedGameChat(gameId)
    navigate("messages")
  }

  function navigate(screen: Screen, court?: string) {
    setPrevTab(activeTab)
    if (court) setSelectedCourt(court)
    setActiveTab(screen)
  }

  function goBack() {
    setActiveTab(prevTab)
  }

  const tabs: { id: Screen; label: string; icon: ReactElement }[] = [
    {
      id: "discover",
      label: "Courts",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="w-5 h-5"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      ),
    },
    {
      id: "games",
      label: "Games",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="w-5 h-5"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      ),
    },
    {
      id: "create",
      label: "Host",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="w-5 h-5"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      ),
    },
    {
      id: "teambuilder",
      label: "Teams",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="w-5 h-5"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="w-5 h-5"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      ),
    },
  ]

  const isDetailScreen = ["court-detail", "calendar", "messages", "notifications"].includes(
    activeTab,
  )

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#060607]">
      {/* Mobile shell */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: 390,
          height: 844,
          background: "var(--background)",
          borderRadius: 44,
          boxShadow:
            "0 0 0 10px #111113, 0 0 0 11px #2a2a2e, 0 40px 120px rgba(0,0,0,0.9)",
        }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-8 pt-4 pb-2 flex-shrink-0">
          <span
            style={{
              fontFamily: "Inter",
              fontSize: 13,
              fontWeight: 600,
              color: "#f5f5f5",
            }}
          >
            9:41
          </span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5 items-end h-3">
              {[3, 5, 7, 9].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 3,
                    height: h,
                    background: i < 3 ? "#f5f5f5" : "rgba(255,255,255,0.3)",
                    borderRadius: 1,
                  }}
                />
              ))}
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3.5 h-3.5 text-white"
            >
              <path d="M1.5 8.5c5.8-5.8 15.2-5.8 21 0M5 12c4-4 10-4 14 0M8.5 15.5c2.2-2.2 5.8-2.2 8 0M12 19h.01" />
            </svg>
            <div
              style={{
                width: 24,
                height: 12,
                border: "1.5px solid rgba(255,255,255,0.5)",
                borderRadius: 3,
                padding: "1.5px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "80%",
                  height: "100%",
                  background: "#f5f5f5",
                  borderRadius: 1.5,
                }}
              />
            </div>
          </div>
        </div>

        {/* Screen content */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {!currentUser ? (
            <RegistrationScreen
              onLogin={login}
              onSignup={signup}
            />
          ) : (
            <>
              {activeTab === "discover" && (
                <DiscoverScreen
                  onCourtSelect={(id) => navigate("court-detail", id)}
                  onCalendar={() => navigate("calendar")}
                  onMessages={() => openMessages(null)}
                  onNotifications={() => navigate("notifications")}
                  unreadNotifications={unreadCount}
                />
              )}
              {activeTab === "games" && (
                <GamesScreen
                  hostedGames={hostedGames}
                  registrations={gameRegistrations}
                  onRegistrationChange={updateRegistration}
                  onOpenMessages={openMessages}
                  onReschedule={(gameId, date, time) => updateHostedGame(gameId, { date, time })}
                  onCancel={(gameId) => updateHostedGame(gameId, { cancelled: true })}
                  playerDivision={currentUser.playerDivision}
                  currentUserEmail={currentUser.email}
                />
              )}
              {activeTab === "create" && (
                <CreateGameScreen
                  onCreate={(game) => setHostedGames((current) => [{ ...game, hostEmail: currentUser.email }, ...current])}
                  onViewGames={() => setActiveTab("games")}
                  playerDivision={currentUser.playerDivision}
                />
              )}
              {activeTab === "teambuilder" && <TeamBuilderScreen />}
              {activeTab === "profile" && <ProfileScreen profile={currentUser} onLogout={logout} />}
              {activeTab === "calendar" && <CalendarScreen onBack={goBack} playerDivision={currentUser.playerDivision} />}
              {activeTab === "messages" && <MessagesScreen onBack={goBack} games={chatGames} initialGameId={selectedGameChat} messages={gameMessages} updates={gameUpdates} onSend={(gameId, body) => {
                if (!chatGames.some((game) => game.id === gameId) || !body.trim()) return
                setGameMessages((current) => [...current, { id: crypto.randomUUID(), gameId, body: body.trim(), createdAt: new Date().toISOString() }])
              }} />}
              {activeTab === "notifications" && <NotificationsScreen onBack={goBack} notifications={notifications} readIds={readNotifications} onMarkRead={(ids) => setReadNotifications((current) => [...new Set([...current, ...ids])])} onOpenChat={openMessages} />}
              {activeTab === "court-detail" && (
                <CourtDetailScreen courtId={selectedCourt} onBack={goBack} playerDivision={currentUser.playerDivision} />
              )}
            </>
          )}
        </div>

        {/* Bottom tab bar */}
        {currentUser && !isDetailScreen && (
          <div
            className="flex-shrink-0 flex items-stretch"
            style={{
              background: "rgba(16,16,19,0.95)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingBottom: 20,
              paddingTop: 8,
            }}
          >
            {tabs.map((tab) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex flex-col items-center gap-1 transition-all"
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {tab.id === "create" ? (
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: active ? "#ff5c00" : "rgba(255,92,0,0.15)",
                        border: active
                          ? "none"
                          : "1.5px solid rgba(255,92,0,0.4)",
                        color: active ? "#fff" : "#ff5c00",
                        marginTop: -16,
                        boxShadow: active
                          ? "0 4px 20px rgba(255,92,0,0.5)"
                          : "none",
                        transition: "all 0.2s",
                      }}
                    >
                      {tab.icon}
                    </div>
                  ) : (
                    <div
                      style={{
                        color: active ? "#ff5c00" : "rgba(255,255,255,0.35)",
                        transition: "color 0.15s",
                      }}
                    >
                      {tab.icon}
                    </div>
                  )}
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      fontFamily: "Inter",
                      color:
                        tab.id === "create"
                          ? active
                            ? "#ff5c00"
                            : "rgba(255,92,0,0.6)"
                          : active
                            ? "#ff5c00"
                            : "rgba(255,255,255,0.3)",
                      textTransform: "uppercase",
                      transition: "color 0.15s",
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
