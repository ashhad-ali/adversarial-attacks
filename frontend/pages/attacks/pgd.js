import { useState, useRef } from "react"
import Head from "next/head"
import AttackLayout from "../../components/AttackLayout"
import ImagePanel from "../../components/ImagePanel"
import EpsilonSlider from "../../components/EpsilonSlider"
import RunButton from "../../components/RunButton"
import ErrorMessage from "../../components/ErrorMessage"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function PGD() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [epsilon, setEpsilon] = useState(0.05)
  const [steps, setSteps] = useState(40)
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
    formData.append("steps", steps)

    try {
      const response = await fetch(`${API_BASE}/attacks/pgd`, {
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
      <Head><title>PGD — Adversarial Attacks</title></Head>

      <AttackLayout
        tag="ResNet-18 · ImageNet · Iterative"
        title={<>Projected Gradient<br /><span style={{ fontWeight: 500 }}>Descent</span></>}
        description="Runs FGSM iteratively — each step moves in the gradient direction by α, then projects back within the ε-ball."
        formula="xₜ₊₁ = Πε(xₜ + α · sign(∇ₓJ))"
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
              <EpsilonSlider value={epsilon} onChange={setEpsilon} />

              {/* Steps slider — PGD specific */}
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
                    Steps
                  </span>
                  <span style={{
                    fontFamily: "var(--mono)",
                    fontSize: 18,
                    fontWeight: 500,
                    color: "var(--accent)",
                    letterSpacing: "-0.02em",
                  }}>
                    {steps}
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={steps}
                  onChange={(e) => setSteps(parseInt(e.target.value))}
                />
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  color: "var(--muted)",
                  marginTop: 5,
                }}>
                  <span>5 — faster</span>
                  <span>100 — stronger</span>
                </div>
              </div>

              <ErrorMessage message={error} />
              <RunButton onClick={handleAttack} loading={loading} />
            </>
          )}
        </ImagePanel>

        {/* Right panel */}
        <ImagePanel
          title="Adversarial"
          subtitle={result ? `ε = ${epsilon.toFixed(2)} · ${steps} steps` : null}
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