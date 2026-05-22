// 1. Change the default props in the function definition:
export default function EpsilonSlider({ value, onChange, min = 0.001, max = 0.1, step = 0.001 }) {
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
          {/* 2. Change .toFixed(2) to .toFixed(3) so it displays the smaller steps */}
          {value.toFixed(3)}
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
        <span>{max} — extreme</span> {/* Changed "aggressive" to "extreme" to match the visual breakdown */}
      </div>
    </div>
  )
}