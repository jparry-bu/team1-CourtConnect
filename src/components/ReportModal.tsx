import { useState } from "react"

type ReportContext = "message" | "court"

interface Props {
  context: ReportContext
  targetLabel: string
  onClose: () => void
  onSubmit: (category: string, detail: string) => void
}

const messageCategories = [
  "Harassment or threats",
  "Hate speech",
  "Spam or scam",
  "Inappropriate content",
  "Other",
]

const courtCategories = [
  "Wrong location or address",
  "Court no longer exists",
  "Incorrect hours or access info",
  "Misleading photos",
  "Other",
]

export default function ReportModal({ context, targetLabel, onClose, onSubmit }: Props) {
  const [selected, setSelected] = useState("")
  const [detail, setDetail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const categories = context === "message" ? messageCategories : courtCategories
  const title = context === "message" ? "REPORT MESSAGE" : "REPORT COURT INFO"
  const subtitle = context === "message"
    ? "Help keep CourtConnect safe"
    : "Help us keep court information accurate"

  function handleSubmit() {
    if (!selected) return
    onSubmit(selected, detail.trim())
    setSubmitted(true)
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "flex-end",
        background: "rgba(0,0,0,0.7)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          width: "100%",
          background: "#131315",
          borderRadius: "20px 20px 0 0",
          border: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "none",
          padding: "24px 20px 36px",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>

        {submitted ? (
          <div style={{ textAlign: "center", paddingTop: 12, paddingBottom: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(34,197,94,0.15)",
                border: "1px solid rgba(34,197,94,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth={2.5} style={{ width: 24, height: 24 }}>
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "Barlow Condensed", fontSize: 22, fontWeight: 800, color: "#f5f5f5", marginBottom: 6 }}>
              REPORT SUBMITTED
            </h2>
            <p style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, maxWidth: 260, margin: "0 auto 24px" }}>
              Thanks for keeping CourtConnect safe. We review all reports within 24 hours.
            </p>
            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 12,
                border: "none",
                background: "var(--secondary)",
                color: "rgba(255,255,255,0.7)",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "Barlow Condensed",
                letterSpacing: "0.06em",
                cursor: "pointer",
              }}
            >
              DONE
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontFamily: "Inter", fontSize: 10, fontWeight: 700, color: "#ff5c00", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                {subtitle}
              </p>
              <h2 style={{ fontFamily: "Barlow Condensed", fontSize: 24, fontWeight: 800, color: "#f5f5f5", lineHeight: 1 }}>
                {title}
              </h2>
              {targetLabel && (
                <p style={{ fontFamily: "Inter", fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
                  {targetLabel}
                </p>
              )}
            </div>

            <p style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>
              What's the issue?
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelected(cat)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: selected === cat ? "1px solid rgba(255,92,0,0.5)" : "1px solid rgba(255,255,255,0.07)",
                    background: selected === cat ? "rgba(255,92,0,0.08)" : "var(--card)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: selected === cat ? "5px solid #ff5c00" : "1.5px solid rgba(255,255,255,0.25)",
                    flexShrink: 0,
                    transition: "all 0.15s",
                  }} />
                  <span style={{ fontFamily: "Inter", fontSize: 13, color: selected === cat ? "#f5f5f5" : "rgba(255,255,255,0.6)" }}>
                    {cat}
                  </span>
                </button>
              ))}
            </div>

            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Additional details (optional)..."
              rows={2}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.07)",
                background: "var(--card)",
                color: "#f5f5f5",
                fontFamily: "Inter",
                fontSize: 13,
                resize: "none",
                outline: "none",
                marginBottom: 16,
              }}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "13px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "Barlow Condensed",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                }}
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selected}
                style={{
                  flex: 2,
                  padding: "13px",
                  borderRadius: 12,
                  border: "none",
                  background: selected ? "#ff5c00" : "rgba(255,255,255,0.06)",
                  color: selected ? "#fff" : "rgba(255,255,255,0.2)",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "Barlow Condensed",
                  letterSpacing: "0.06em",
                  cursor: selected ? "pointer" : "not-allowed",
                  transition: "all 0.15s",
                  boxShadow: selected ? "0 4px 16px rgba(255,92,0,0.3)" : "none",
                }}
              >
                SUBMIT REPORT
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
