import { useEffect } from "react"

interface Props {
  message: string
  onDismiss: () => void
}

export default function Toast({ message, onDismiss }: Props) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div
      style={{
        position: "fixed",
        bottom: 100,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 300,
        background: "#1f1f22",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        padding: "11px 18px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
      <span style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 500, color: "#f5f5f5" }}>
        {message}
      </span>
    </div>
  )
}
