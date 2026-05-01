export default function RunButton({ onClick, loading, label = "run attack" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <button
        onClick={onClick}
        disabled={loading}
        style={{
          width: "100%",
          padding: "11px 0",
          background: loading ? "var(--border)" : "var(--text)",
          color: loading ? "var(--muted)" : "var(--surface)",
          border: "none",
          borderRadius: 7,
          fontFamily: "var(--mono)",
          fontSize: 12,
          letterSpacing: "0.08em",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.15s",
        }}
      >
        {loading ? "running..." : label}
      </button>
    </div>
  )
}