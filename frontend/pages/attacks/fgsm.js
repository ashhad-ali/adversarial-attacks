import { useState, useRef } from "react"
import Head from "next/head"
import AttackLayout from "../../components/AttackLayout"
import ImagePanel from "../../components/ImagePanel"
import EpsilonSlider from "../../components/EpsilonSlider"
import RunButton from "../../components/RunButton"
import ErrorMessage from "../../components/ErrorMessage"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function FGSM() {
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
      const response = await fetch(`${API_BASE}/attacks/fgsm`, {
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
      <Head><title>FGSM — Adversarial Attacks</title></Head>

      <AttackLayout
        tag="ResNet-18 · ImageNet · Single Step"
        title={<>Adversarial Attack<br /><span style={{ fontWeight: 500 }}>Visualizer</span></>}
        description="Fast Gradient Sign Method — perturb an image by"
        formula="ε · sign(∇ₓJ)"
        result={result}
      >

        {/* Left panel — upload + controls */}
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
              <ErrorMessage message={error} />
              <RunButton onClick={handleAttack} loading={loading} />
            </>
          )}
        </ImagePanel>

        {/* Right panel — adversarial result */}
        <ImagePanel
          title="Adversarial"
          subtitle={result ? `ε = ${epsilon.toFixed(2)}` : null}
          imageSrc={result
            ? `data:image/png;base64,${result.adversarial_image}`
            : preview || null
          }
          isReady={!!result}
        />

      </AttackLayout>

      {/* Hidden file input */}
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