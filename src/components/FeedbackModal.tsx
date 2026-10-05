import { useState } from "react"

interface Props {
  onClose: () => void
  onSubmit: (rating: number, category: string, detail: string) => void
}

const categories = ["Bug report", "Feature request", "Court data issue", "General feedback"]

export default function FeedbackModal({ onClose, onSubmit }: Props) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [category, setCategory] = useState("")
  const [detail, setDetail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = rating > 0 && category !== ""

  function handleSubmit() {
    if (!canSubmit) return
    onSubmit(rating, category, detail.trim())
    setSubmitted(true)
  }

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"]

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
                background: "rgba(255,92,0,0.12)",
                border: "1px solid rgba(255,92,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#ff5c00" strokeWidth={2.5} style={{ width: 24, height: 24 }}>
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "Barlow Condensed", fontSize: 22, fontWeight: 800, color: "#f5f5f5", marginBottom: 6 }}>
              FEEDBACK SENT
            </h2>
            <p style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, maxWidth: 260, margin: "0 auto 24px" }}>
              Your input helps make CourtConnect better for everyone in Boston. Thanks for taking the time.
            </p>
            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 12,
                border: "none",
                background: "#ff5c00",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "Barlow Condensed",
                letterSpacing: "0.06em",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(255,92,0,0.3)",
              }}
            >
              DONE
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontFamily: "Inter", fontSize: 10, fontWeight: 700, color: "#ff5c00", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                Help us improve
              </p>
              <h2 style={{ fontFamily: "Barlow Condensed", fontSize: 24, fontWeight: 800, color: "#f5f5f5", lineHeight: 1 }}>
                SHARE FEEDBACK
              </h2>
            </div>

            {/* Star rating */}
            <p style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>
              How's your experience?
            </p>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= (hovered || rating)
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
                    aria-label={`Rate ${star} out of 5`}
                  >
                    <svg viewBox="0 0 24 24" fill={active ? "#ff5c00" : "none"} stroke={active ? "#ff5c00" : "rgba(255,255,255,0.2)"} strokeWidth={1.5} style={{ width: 32, height: 32, transition: "all 0.1s" }}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                )
              })}
              {(hovered || rating) > 0 && (
                <span style={{ fontFamily: "Inter", fontSize: 12, color: "#ff5c00", fontWeight: 600, marginLeft: 4 }}>
                  {ratingLabels[hovered || rating]}
                </span>
              )}
            </div>

            {/* Category */}
            <p style={{ fontFamily: "Inter", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10, marginTop: 16 }}>
              Type of feedback
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 20,
                    border: category === cat ? "1px solid rgba(255,92,0,0.6)" : "1px solid rgba(255,255,255,0.1)",
                    background: category === cat ? "rgba(255,92,0,0.12)" : "var(--card)",
                    color: category === cat ? "#ff5c00" : "rgba(255,255,255,0.5)",
                    fontFamily: "Inter",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Detail */}
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Tell us more — what worked, what didn't, what you'd love to see..."
              rows={3}
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
                lineHeight: 1.5,
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
                disabled={!canSubmit}
                style={{
                  flex: 2,
                  padding: "13px",
                  borderRadius: 12,
                  border: "none",
                  background: canSubmit ? "#ff5c00" : "rgba(255,255,255,0.06)",
                  color: canSubmit ? "#fff" : "rgba(255,255,255,0.2)",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "Barlow Condensed",
                  letterSpacing: "0.06em",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  transition: "all 0.15s",
                  boxShadow: canSubmit ? "0 4px 16px rgba(255,92,0,0.3)" : "none",
                }}
              >
                SEND FEEDBACK
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
