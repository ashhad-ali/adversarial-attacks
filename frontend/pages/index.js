import Link from "next/link"
import Head from "next/head"

const attacks = [
  {
    slug: "fgsm",
    name: "FGSM",
    full: "Fast Gradient Sign Method",
    description: "Perturbs every pixel by a small amount in the direction that maximally increases the model's loss.",
    tag: "gradient · single step",
    paper: "Goodfellow et al., 2014",
    ready: true,
  },
  {
    slug: "pgd",
    name: "PGD",
    full: "Projected Gradient Descent",
    description: "Iterates FGSM multiple times with small steps, projecting back into the allowed perturbation budget each time.",
    tag: "gradient · iterative",
    paper: "Madry et al., 2017",
    ready: true,
  },
  {
    slug: "deepfool",
    name: "DeepFool",
    full: "DeepFool",
    description: "Finds the minimum perturbation needed to cross the model's decision boundary. Produces near-invisible noise.",
    tag: "gradient · minimal norm",
    paper: "Moosavi-Dezfooli et al., 2016",
    ready: true,
  },
  {
    slug: "cw",
    name: "C&W",
    full: "Carlini & Wagner",
    description: "Optimization-based attack that minimizes perturbation size while ensuring misclassification. One of the strongest known attacks.",
    tag: "optimization · L2",
    paper: "Carlini & Wagner, 2017",
    ready: true,
  },
  {
    slug: "one-pixel",
    name: "One-Pixel",
    full: "One-Pixel Attack",
    description: "Modifies exactly one pixel to cause misclassification. Demonstrates how fragile neural networks can be.",
    tag: "black-box · extreme",
    paper: "Su et al., 2019",
    ready: false,
  },
  {
    slug: "patch",
    name: "Adv. Patch",
    full: "Adversarial Patch",
    description: "Generates a printable patch that causes misclassification when physically placed anywhere in a scene.",
    tag: "physical world · localized",
    paper: "Brown et al., 2017",
    ready: false,
  },
]

const steps = [
  {
    number: "01",
    title: "Upload an image",
    description: "Any image works — the model will classify it using ResNet-18 trained on 1000 ImageNet categories.",
  },
  {
    number: "02",
    title: "Choose an attack",
    description: "Each attack uses a different strategy to fool the model — from gradient-based to physical world patches.",
  },
  {
    number: "03",
    title: "Watch it fail",
    description: "The perturbed image looks identical to the original but the model predicts a completely different class.",
  },
]

export default function Home() {
  return (
    <>
      <Head>
        <title>Adversarial Attacks</title>
      </Head>

      <main style={{
        maxWidth: 920,
        margin: "0 auto",
        padding: "72px 24px 96px",
      }}>

        {/* Hero */}
        <header style={{ marginBottom: 80 }}>
          <h1 style={{
            fontFamily: "var(--sans)",
            fontSize: "clamp(32px, 6vw, 56px)",
            fontWeight: 300,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "var(--text)",
            marginBottom: 24,
          }}>
            Neural networks are<br />
            <span style={{ fontWeight: 500 }}>surprisingly fragile.</span>
          </h1>

          <p style={{
            fontFamily: "var(--sans)",
            fontSize: 17,
            color: "var(--muted)",
            maxWidth: 520,
            lineHeight: 1.7,
            marginBottom: 16,
          }}>
            Adversarial attacks add tiny, invisible perturbations to images
            that reliably fool state-of-the-art neural networks — while
            looking completely normal to humans.
          </p>

          <p style={{
            fontFamily: "var(--mono)",
            fontSize: 12,
            color: "var(--muted)",
            maxWidth: 480,
            lineHeight: 1.7,
          }}>
            Pick an attack below and try it on any image.
          </p>
        </header>

        {/* Attack grid */}
        <section style={{ marginBottom: 80 }}>
          <div style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 20,
          }}>
            Available Attacks
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}>
            {attacks.map((attack) => (
              <div
                key={attack.slug}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  opacity: attack.ready ? 1 : 0.5,
                  position: "relative",
                }}
              >
                {/* Coming soon badge */}
                {!attack.ready && (
                  <div style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    fontFamily: "var(--mono)",
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    padding: "3px 7px",
                    borderRadius: 4,
                  }}>
                    soon
                  </div>
                )}

                {/* Attack name */}
                <div>
                  <div style={{
                    fontFamily: "var(--mono)",
                    fontSize: 18,
                    fontWeight: 500,
                    color: "var(--text)",
                    letterSpacing: "-0.01em",
                    marginBottom: 2,
                  }}>
                    {attack.name}
                  </div>
                  <div style={{
                    fontFamily: "var(--sans)",
                    fontSize: 11,
                    color: "var(--muted)",
                  }}>
                    {attack.full}
                  </div>
                </div>

                {/* Description */}
                <p style={{
                  fontFamily: "var(--sans)",
                  fontSize: 13,
                  color: "var(--muted)",
                  lineHeight: 1.6,
                  flexGrow: 1,
                }}>
                  {attack.description}
                </p>

                {/* Footer row */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 12,
                  borderTop: "1px solid var(--border)",
                }}>
                  <span style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--muted)",
                    letterSpacing: "0.04em",
                  }}>
                    {attack.tag}
                  </span>

                  {attack.ready ? (
                    <Link
                      href={`/attacks/${attack.slug}`}
                      style={{ textDecoration: "none" }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 11,
                          color: "var(--accent)",
                          letterSpacing: "0.06em",
                          cursor: "pointer",
                        }}
                        onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                        onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                      >
                        try it →
                      </span>
                    </Link>
                  ) : (
                    <span style={{
                      fontFamily: "var(--mono)",
                      fontSize: 10,
                      color: "var(--muted)",
                      letterSpacing: "0.04em",
                    }}>
                      {attack.paper}
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section style={{
          paddingTop: 48,
          borderTop: "1px solid var(--border)",
        }}>
          <div style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 28,
          }}>
            How It Works
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 24,
          }}>
            {steps.map(({ number, title, description }) => (
              <div key={number}>
                <div style={{
                  fontFamily: "var(--mono)",
                  fontSize: 28,
                  fontWeight: 300,
                  color: "var(--border)",
                  letterSpacing: "-0.02em",
                  marginBottom: 12,
                  lineHeight: 1,
                }}>
                  {number}
                </div>
                <div style={{
                  fontFamily: "var(--sans)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--text)",
                  marginBottom: 8,
                }}>
                  {title}
                </div>
                <p style={{
                  fontFamily: "var(--sans)",
                  fontSize: 13,
                  color: "var(--muted)",
                  lineHeight: 1.6,
                }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </>
  )
}