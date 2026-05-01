export default function ErrorMessage({ message }) {
  if (!message) return null

  return (
    <div style={{
      fontFamily: "var(--mono)",
      fontSize: 11,
      color: "var(--accent)",
      padding: "10px 12px",
      background: "var(--accent-bg)",
      border: "1px solid var(--accent)",
      borderRadius: 6,
    }}>
      {message}
    </div>
  )
}