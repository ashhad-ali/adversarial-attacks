import PredictionCard from "./PredictionCard"

export default function AttackLayout({
  tag,
  title,
  formula,
  description,
  result,
  children,
}) {
  return (
    <main style={{
      maxWidth: 920,
      margin: "0 auto",
      padding: "64px 24px 96px",
    }}>

      {/* Header */}
      <header style={{ marginBottom: 48 }}>
        <div style={{
          display: "inline-block",
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--accent)",
          background: "var(--accent-bg)",
          padding: "4px 10px",
          borderRadius: 4,
          marginBottom: 16,
        }}>
          {tag}
        </div>
        <h1 style={{
          fontFamily: "var(--sans)",
          fontSize: "clamp(28px, 5vw, 42px)",
          fontWeight: 300,
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          color: "var(--text)",
          marginBottom: 12,
        }}>
          {title}
        </h1>
        <p style={{
          color: "var(--muted)",
          fontFamily: "var(--mono)",
          fontSize: 13,
          maxWidth: 480,
        }}>
          {description}{" "}
          {formula && (
            <span style={{ whiteSpace: "nowrap" }}>{formula}</span>
          )}
        </p>
      </header>

      {/* Prediction labels */}
      {result && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 12,
        }}>
          <PredictionCard
            label="Original"
            value={result.original_label}
            color="var(--text)"
          />
          <PredictionCard
            label="Adversarial"
            value={result.adversarial_label}
            color="var(--accent)"
          />
        </div>
      )}

      {/* Two-panel grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        alignItems: "start",
      }}>
        {children}
      </div>

    </main>
  )
}