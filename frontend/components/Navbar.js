import Link from "next/link"
import { useRouter } from "next/router"

export default function Navbar() {
  const router = useRouter()

  return (
    <nav style={{
      borderBottom: "1px solid var(--border)",
      background: "var(--surface)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 920,
        margin: "0 auto",
        padding: "0 24px",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>

        {/* Logo / site name */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{
            fontFamily: "var(--mono)",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text)",
            letterSpacing: "-0.01em",
          }}>
            adversarial<span style={{ color: "var(--accent)" }}>.attacks</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {[
            { label: "attacks", href: "/" },
            { label: "about", href: "/about" },
          ].map(({ label, href }) => (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <span style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: (href === "/" ? router.pathname === "/" : router.pathname.startsWith(href))
                ? "var(--accent)" : "var(--muted)",
                transition: "color 0.15s",
              }}>
                {label}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </nav>
  )
}