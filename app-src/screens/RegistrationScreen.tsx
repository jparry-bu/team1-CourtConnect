import { createElement, useState } from "react"
import type { FormEvent } from "react"
import { playerPositions, type PlayerPosition } from "../types/GameRegistration"
import type { UserProfile } from "../types/UserAccount"
import type { PlayerDivision } from "../types/HostedGame"

const skillLevels: UserProfile["skill"][] = [
  "Beginner",
  "Recreational",
  "Intermediate",
  "Competitive",
  "Pro",
]
const heightFeetOptions = [4, 5, 6, 7, 8]
const heightInchOptions = Array.from({ length: 12 }, (_, index) => index)

interface SelectFieldProps {
  value: string
  placeholder: string
  options: { label: string; value: string }[]
  onChange: (value: string) => void
}

function SelectField({
  value,
  placeholder,
  options,
  onChange,
}: SelectFieldProps) {
  return createElement(
    "select",
    {
      value,
      onChange: (event) =>
        onChange((event.currentTarget as HTMLSelectElement).value),
      className:
        "mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary",
    },
    [
      createElement(
        "option",
        { key: "placeholder", value: "", disabled: true },
        placeholder,
      ),
      ...options.map((option) =>
        createElement(
          "option",
          { key: option.value, value: option.value },
          option.label,
        ),
      ),
    ],
  )
}

interface Props {
  onLogin: (email: string, password: string) => Promise<string | null>
  onSignup: (profile: UserProfile, password: string) => Promise<string | null>
}

export default function RegistrationScreen({ onLogin, onSignup }: Props) {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [handle, setHandle] = useState("")
  const [city, setCity] = useState("")
  const [position, setPosition] = useState<PlayerPosition>("PG")
  const [playerDivision, setPlayerDivision] = useState<PlayerDivision>("Men's")
  const [skill, setSkill] = useState<UserProfile["skill"]>("Competitive")
  const [heightFeet, setHeightFeet] = useState("")
  const [heightInches, setHeightInches] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  function switchMode(nextMode: "login" | "signup") {
    setMode(nextMode)
    setError("")
    setPassword("")
    setConfirmPassword("")
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail.includes("@")) {
      setError("Enter a valid email address.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (mode === "signup" && (!name.trim() || !handle.trim() || !city.trim())) {
      setError("Complete your name, username, and city.")
      return
    }
    if (mode === "signup" && !/^[a-zA-Z0-9_]{3,20}$/.test(handle.trim())) {
      setError("Username must be 3–20 letters, numbers, or underscores.")
      return
    }
    if (mode === "signup" && (!heightFeet || heightInches === "")) {
      setError("Select your height in feet and inches.")
      return
    }
    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setSubmitting(true)
    const message = mode === "login"
      ? await onLogin(normalizedEmail, password)
      : await onSignup({
          name: name.trim(),
          email: normalizedEmail,
          handle: handle.trim().replace(/^@/, ""),
          city: city.trim(),
          position,
          playerDivision,
          heightInches: Number(heightFeet) * 12 + Number(heightInches),
          skill,
        }, password)
    setSubmitting(false)
    if (message) setError(message)
  }

  const fieldClass = "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
  const labelClass = "mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground"

  return (
    <div className="min-h-full px-6 pb-10 pt-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6 text-primary-foreground" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M3.5 9h17M3.5 15h17M9 3.5c2 2.3 2.8 5.1 2.8 8.5S11 18.2 9 20.5M15 3.5c-2 2.3-2.8 5.1-2.8 8.5s.8 6.2 2.8 8.5" />
          </svg>
        </div>
        <div>
          <p className="font-['Barlow_Condensed'] text-xl font-extrabold tracking-wide text-foreground">COURTCONNECT</p>
          <p className="text-xs text-muted-foreground">Find your court. Build your game.</p>
        </div>
      </div>

      <div className="mt-9">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">{mode === "login" ? "Welcome back" : "Join the community"}</p>
        <h1 className="mt-1 font-['Barlow_Condensed'] text-4xl font-extrabold leading-none text-foreground">
          {mode === "login" ? "GET BACK IN THE GAME." : "CREATE YOUR PLAYER PROFILE."}
        </h1>
        <p className="mt-3 text-sm leading-5 text-muted-foreground">
          {mode === "login" ? "Sign in to manage your games, chats, and notifications." : "Tell players how you play, then start finding games near you."}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 rounded-xl bg-secondary p-1" role="tablist" aria-label="Account access">
        {(["login", "signup"] as const).map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={mode === item}
            onClick={() => switchMode(item)}
            className={`rounded-lg py-2.5 text-sm font-bold transition-colors ${mode === item ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            {item === "login" ? "Log in" : "Sign up"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
        {mode === "signup" && (
          <>
            <label className={labelClass}>Full name
              <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Jordan Smith" className={`mt-2 ${fieldClass}`} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={labelClass}>Username
                <input autoComplete="username" value={handle} onChange={(event) => setHandle(event.target.value)} placeholder="jordansmith" className={`mt-2 ${fieldClass}`} />
              </label>
              <label className={labelClass}>Home city
                <input autoComplete="address-level2" value={city} onChange={(event) => setCity(event.target.value)} placeholder="Cambridge, MA" className={`mt-2 ${fieldClass}`} />
              </label>
            </div>
          </>
        )}

        <label className={labelClass}>Email address
          <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className={`mt-2 ${fieldClass}`} />
        </label>

        {mode === "signup" && (
          <>
          <label className={labelClass}>Player division
            <select value={playerDivision} onChange={(event) => setPlayerDivision(event.target.value as PlayerDivision)} className={`mt-2 ${fieldClass}`}>
              <option>Men's</option>
              <option>Women's</option>
            </select>
            <span className="mt-2 block normal-case tracking-normal text-muted-foreground">Controls which games are visible. Both divisions can see co-ed games.</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={labelClass}>Position
              <select value={position} onChange={(event) => setPosition(event.target.value as PlayerPosition)} className={`mt-2 ${fieldClass}`}>
                {playerPositions.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className={labelClass}>Skill level
              <select value={skill} onChange={(event) => setSkill(event.target.value as UserProfile["skill"])} className={`mt-2 ${fieldClass}`}>
                {skillLevels.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <fieldset className="rounded-xl border border-border bg-card p-3">
            <legend className="px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Height</legend>
            <div className="grid grid-cols-2 gap-3">
              <label className={labelClass}>Feet
                <SelectField
                  value={heightFeet}
                  placeholder="Select feet"
                  options={heightFeetOptions.map((feet) => ({
                    label: `${feet} ft`,
                    value: String(feet),
                  }))}
                  onChange={setHeightFeet}
                />
              </label>
              <label className={labelClass}>Inches
                <SelectField
                  value={heightInches}
                  placeholder="Select inches"
                  options={heightInchOptions.map((inches) => ({
                    label: `${inches} in`,
                    value: String(inches),
                  }))}
                  onChange={setHeightInches}
                />
              </label>
            </div>
          </fieldset>
          </>
        )}

        <label className={labelClass}>Password
          <input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" className={`mt-2 ${fieldClass}`} />
        </label>

        {mode === "signup" && (
          <label className={labelClass}>Confirm password
            <input type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Re-enter your password" className={`mt-2 ${fieldClass}`} />
          </label>
        )}

        {error && <p role="alert" className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">{error}</p>}

        <button type="submit" disabled={submitting} className="mt-1 w-full rounded-xl bg-primary py-3.5 font-['Barlow_Condensed'] text-base font-bold tracking-wider text-primary-foreground disabled:opacity-50">
          {submitting ? "PLEASE WAIT…" : mode === "login" ? "LOG IN" : "CREATE ACCOUNT"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
        {mode === "login" ? "New to CourtConnect? " : "Already have an account? "}
        <button type="button" onClick={() => switchMode(mode === "login" ? "signup" : "login")} className="font-semibold text-primary">
          {mode === "login" ? "Create your profile" : "Log in"}
        </button>
      </p>
      <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
        Prototype accounts are stored only in this browser.
      </p>
    </div>
  )
}
