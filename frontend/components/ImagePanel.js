export default function ImagePanel({
  title,
  subtitle,
  imageSrc,
  isReady,
  onChangeImage,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  dragOver,
  children,
}) {
  return (
    <div className="panel" style={{
      opacity: isReady ? 1 : 0.4,
      transition: "opacity 0.3s",
    }}>

      {/* Panel header */}
      <div className="panel-label">
        <span>{title}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {subtitle && (
            <span style={{ color: "var(--accent)" }}>{subtitle}</span>
          )}
          {onChangeImage && (
            <button
              onClick={onChangeImage}
              style={{
                background: "none",
                border: "none",
                fontFamily: "var(--mono)",
                fontSize: 10,
                letterSpacing: "0.08em",
                color: "var(--accent)",
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
              }}
            >
              change image
            </button>
          )}
        </div>
      </div>

      {/* Drop zone — only shown when no image */}
      {!imageSrc && onDrop && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={onClick}
          style={{
            minHeight: 280,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: "pointer",
            background: dragOver ? "var(--accent-bg)" : "var(--surface)",
            transition: "background 0.15s",
            padding: 32,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5"
            style={{ color: dragOver ? "var(--accent)" : "var(--muted)" }}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span style={{
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: dragOver ? "var(--accent)" : "var(--muted)",
            textAlign: "center",
            lineHeight: 1.8,
          }}>
            drop image here<br />
            or <span style={{ color: "var(--accent)", textDecoration: "underline" }}>browse</span>
          </span>
        </div>
      )}

      {/* Image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={title}
          style={{ width: "100%", display: "block" }}
        />
      )}

      {/* Slot for controls (epsilon slider, button etc) */}
      {children && (
        <div style={{
          padding: "20px 18px",
          borderTop: imageSrc ? "1px solid var(--border)" : "none",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}>
          {children}
        </div>
      )}

    </div>
  )
}