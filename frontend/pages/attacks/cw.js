import { useState, useRef } from "react"
import Head from "next/head"
import AttackLayout from "../../components/AttackLayout"
import ImagePanel from "../../components/ImagePanel"
import RunButton from "../../components/RunButton"
import ErrorMessage from "../../components/ErrorMessage"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function CW() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [confidence, setConfidence] = useState(0)
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
    formData.append("confidence", confidence)
    formData.append("steps", 1000)

    try {
      const response = await fetch(`${API_BASE}/attacks/cw`, {
        method: "POST",
        body: formData,
      })
      if (!response.ok) {
        const errText = await response.text()
        throw new Error(`Attack failed: ${errText}`)
      }
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
      <Head><title>C&W — Adversarial Attacks</title></Head>

      <AttackLayout
        tag="ResNet-18 · ImageNet · Optimization"
        title={<>Carlini &amp;<br /><span style={{ fontWeight: 500 }}>Wagner</span></>}
        description="Finds the smallest possible L2 perturbation that causes misclassification by solving an optimization problem with Adam."
        formula="min ||δ||₂ + c · f(x + δ)"
        result={result}
      >

        {/* Left panel */}
        <ImagePanel
          title="Original"
          imageSrc={result
            ? `data:image/png;base64,${result.original_image}`
            : preview || null
          }
          isReady={true}
          onChangeImage={file ? handleChangeImage : null}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          dragOver={dragOver}
        >
          {file && (
            <>
              {/* Confidence slider */}
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
                    Confidence (κ)
                  </span>
                  <span style={{
                    fontFamily: "var(--mono)",
                    fontSize: 18,
                    fontWeight: 500,
                    color: "var(--accent)",
                    letterSpacing: "-0.02em",
                  }}>
                    {confidence}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={confidence}
                  onChange={(e) => setConfidence(parseInt(e.target.value))}
                />
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  color: "var(--muted)",
                  marginTop: 5,
                }}>
                  <span>0 — minimal perturbation</span>
                  <span>40 — confidently wrong</span>
                </div>
              </div>

              {/* Info box */}
              <div style={{
                padding: "10px 12px",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--muted)",
                lineHeight: 1.6,
              }}>
                C&W runs 1000 optimization steps — expect 30-60 seconds.
              </div>

              <ErrorMessage message={error} />
              <RunButton onClick={handleAttack} loading={loading} label="run attack" />
            </>
          )}
        </ImagePanel>

        {/* Right panel */}
        <ImagePanel
          title="Adversarial"
          subtitle={result ? `κ = ${confidence}` : null}
          imageSrc={result
            ? `data:image/png;base64,${result.adversarial_image}`
            : preview || null
          }
          isReady={!!result}
        />

      </AttackLayout>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </>
  )
}