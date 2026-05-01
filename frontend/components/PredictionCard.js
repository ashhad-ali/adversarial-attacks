export default function PredictionCard({ label, value, color }) {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 8,
      padding: "14px 18px",
    }}>
      <div style={{
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--muted)",
        marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "var(--mono)",
        fontSize: 14,
        fontWeight: 500,
        color: color || "var(--text)",
      }}>
        {value}
      </div>
    </div>
  )
}