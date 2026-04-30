import { useState, useRef } from "react"
import Head from "next/head"

export default function Home() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [epsilon, setEpsilon] = useState(0.05)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  function handleFileChange(e) {
    const selected = e.target.files[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setResult(null)
    setError(null)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (!dropped) return
    setFile(dropped)
    setPreview(URL.createObjectURL(dropped))
    setResult(null)
    setError(null)
  }

  function handleChangeImage() {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    setTimeout(() => fileInputRef.current?.click(), 50)
  }

  async function handleAttack() {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("epsilon", epsilon)

    try {
      const response = await fetch("https://ashhadali-adversarial-attacks.hf.space/attack", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) throw new Error("Attack failed. Is the backend running?")
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>FGSM Attack</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:        #f7f6f3;
          --surface:   #ffffff;
          --border:    #e4e2dc;
          --text:      #1a1916;
          --muted:     #8a8880;
          --accent:    #c8622a;
          --accent-bg: #fdf2ec;
          --mono:      'DM Mono', monospace;
          --sans:      'DM Sans', sans-serif;
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--sans);
          font-size: 15px;
          line-height: 1.6;
          min-height: 100vh;
        }

        input[type=range] {
          -webkit-appearance: none;
          width: 100%;
          height: 2px;
          background: var(--border);
          outline: none;
          border-radius: 2px;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent);
          cursor: pointer;
          border: 2px solid var(--surface);
          box-shadow: 0 0 0 1px var(--accent);
          transition: transform 0.15s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .panel-label {
          padding: 12px 18px;
          border-bottom: 1px solid var(--border);
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>

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
            ResNet-18 · ImageNet
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
            Adversarial Attack<br />
            <span style={{ fontWeight: 500 }}>Visualizer</span>
          </h1>
          <p style={{
            color: "var(--muted)",
            fontFamily: "var(--mono)",
            fontSize: 13,
            maxWidth: 480,
          }}>
            Fast Gradient Sign Method — perturb an image by{" "}
            <span style={{ whiteSpace: "nowrap" }}>ε · sign(∇ₓJ)</span>
            {" "}and watch a neural network fail.
          </p>
        </header>

        {/* Prediction labels — only shown after attack runs */}
        {result && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 12,
          }}>
            {[
              { label: "Original", value: result.original_label, color: "var(--text)" },
              { label: "Adversarial", value: result.adversarial_label, color: "var(--accent)" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
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
                  color,
                }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Two-panel layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          alignItems: "start",
        }}>

          {/* LEFT PANEL — upload + controls */}
          <div className="panel">
            <div className="panel-label">
              <span>Original</span>
              {file && (
                <button
                  onClick={handleChangeImage}
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

            {/* Upload zone — only shown before image is selected */}
            {!preview && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
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
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: dragOver ? "var(--accent)" : "var(--muted)" }}>
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

            {/* Image preview */}
            {preview && (
              <img
                src={result ? `data:image/png;base64,${result.original_image}` : preview}
                alt="original"
                style={{ width: "100%", display: "block" }}
              />
            )}

            {/* Controls — appear once image is loaded */}
            {file && (
              <div style={{
                padding: "20px 18px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}>

                {/* Epsilon */}
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
                      {epsilon.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="1.0"
                    step="0.01"
                    value={epsilon}
                    onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                  />
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--muted)",
                    marginTop: 5,
                  }}>
                    <span>0.01 — imperceptible</span>
                    <span>1.0 — aggressive</span>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    color: "var(--accent)",
                    padding: "10px 12px",
                    background: "var(--accent-bg)",
                    border: "1px solid var(--accent)",
                    borderRadius: 6,
                  }}>
                    {error}
                  </div>
                )}

                {/* Run button */}
                <button
                  onClick={handleAttack}
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
                  {loading ? "running attack..." : "run attack"}
                </button>

              </div>
            )}
          </div>

          {/* RIGHT PANEL — adversarial result */}
          <div className="panel" style={{
            opacity: result ? 1 : 0.4,
            transition: "opacity 0.3s",
          }}>
            <div className="panel-label">
              <span>Adversarial</span>
              {result && (
                <span style={{ color: "var(--accent)" }}>
                  ε = {epsilon.toFixed(2)}
                </span>
              )}
            </div>

            {!result && (
              <div style={{
                minHeight: 280,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {preview ? (
                  <img
                    src={preview}
                    alt="awaiting attack"
                    style={{ width: "100%", display: "block", filter: "grayscale(100%)" }}
                  />
                ) : (
                  <span style={{
                    fontFamily: "var(--mono)",
                    fontSize: 12,
                    color: "var(--muted)",
                  }}>
                    awaiting attack...
                  </span>
                )}
              </div>
            )}

            {result && (
              <img
                src={`data:image/png;base64,${result.adversarial_image}`}
                alt="adversarial"
                style={{ width: "100%", display: "block" }}
              />
            )}
          </div>

        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Resources */}
        <div style={{
          marginTop: 80,
          paddingTop: 32,
          borderTop: "1px solid var(--border)",
        }}>
          <div style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 16,
          }}>
            Further Reading
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                title: "Explaining and Harnessing Adversarial Examples",
                author: "Goodfellow et al., 2014",
                url: "https://arxiv.org/abs/1412.6572",
              },
              {
                title: "FGSM Tutorial — PyTorch Official",
                author: "pytorch.org",
                url: "https://pytorch.org/tutorials/beginner/fgsm_tutorial.html",
              },
              {
                title: "Deep Residual Learning for Image Recognition",
                author: "He et al., 2015",
                url: "https://arxiv.org/abs/1512.03385",
              },
            ].map(({ title, author, url }) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  padding: "12px 16px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  textDecoration: "none",
                  transition: "border-color 0.15s",
                  gap: 16,
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <span style={{
                  fontFamily: "var(--sans)",
                  fontSize: 13,
                  color: "var(--text)",
                  fontWeight: 400,
                }}>
                  {title}
                </span>
                <span style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--muted)",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}>
                  {author}
                </span>
              </a>
            ))}
          </div>
        </div>

      </main>
    </>
  )
}