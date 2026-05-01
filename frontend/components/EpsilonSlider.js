export default function EpsilonSlider({ value, onChange, min = 0.01, max = 1.0, step = 0.01 }) {
  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 10,
      }}>
        <span style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}>
          Epsilon
        </span>
        <span style={{
          fontFamily: "var(--mono)",
          fontSize: 18,
          fontWeight: 500,
          color: "var(--accent)",
          letterSpacing: "-0.02em",
        }}>
          {value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        fontFamily: "var(--mono)",
        fontSize: 10,
        color: "var(--muted)",
        marginTop: 5,
      }}>
        <span>{min} — imperceptible</span>
        <span>{max} — aggressive</span>
      </div>
    </div>
  )
}