import { useState, useRef } from "react"
import Head from "next/head"
import AttackLayout from "../../components/AttackLayout"
import ImagePanel from "../../components/ImagePanel"
import RunButton from "../../components/RunButton"
import ErrorMessage from "../../components/ErrorMessage"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function DeepFool() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
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

    try {
      const response = await fetch(`${API_BASE}/attacks/deepfool`, {
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
      <Head><title>DeepFool — Adversarial Attacks</title></Head>

      <AttackLayout
        tag="ResNet-18 · ImageNet · Minimal Perturbation"
        title={<>Deep<span style={{ fontWeight: 500 }}>Fool</span></>}
        description="Finds the smallest possible perturbation that crosses the model's decision boundary — no epsilon needed, the math finds the minimum itself."
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
              {/* No epsilon slider — DeepFool finds minimum perturbation automatically */}
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
                DeepFool computes the minimum perturbation to cross the decision
                boundary — no epsilon needed. Note: on highly confident predictions,
                the boundary may be too far to reach within the step budget.
                This is a known limitation on large models like ResNet-18.
            </div>
              <ErrorMessage message={error} />
              <RunButton onClick={handleAttack} loading={loading} />
            </>
          )}
        </ImagePanel>

        {/* Right panel */}
        <ImagePanel
          title="Adversarial"
          subtitle={result ? "minimum perturbation" : null}
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