import Link from "next/link"
import { Mail, MapPin, Linkedin, Instagram } from "lucide-react"
import { LogoMark } from "@/components/logo"

const nav = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Packages", href: "/shop" },
  { label: "Contact", href: "/contact" },
]

const socials = [
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
  { Icon: Instagram, href: "#", label: "Instagram" },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: "#080B09", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="h-[2px]" style={{ background: "linear-gradient(90deg, var(--primary), rgba(194,161,91,0.35), transparent)" }} />

      <div className="container-wide pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <LogoMark size={30} />
              <span className="font-display text-lg font-semibold tracking-[0.12em] text-white">
                OAKLEAF <span style={{ color: "var(--primary)" }}>PARTNERS</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-[260px]" style={{ color: "var(--text-3)" }}>
              A diversified consulting and design company — wardrobe consulting, clothing design, and engineering
              consulting under one roof.
            </p>
            <div className="flex gap-3 mt-6">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-md flex items-center justify-center transition-all duration-300 hover:bg-[var(--primary)] hover:border-[var(--primary)] hover:text-black"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-3)" }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[8px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: "var(--text-4)" }}>
              Navigation
            </h4>
            <ul className="space-y-3">
              {nav.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-xs hover:text-white transition-colors duration-200" style={{ color: "var(--text-3)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[8px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: "var(--text-4)" }}>
              Contact
            </h4>
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <Mail className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--primary)" }} />
                <span className="text-xs" style={{ color: "var(--text-3)" }}>hello@oakleafpartners.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--primary)" }} />
                <span className="text-xs" style={{ color: "var(--text-3)" }}>By appointment · Remote &amp; in-person</span>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 text-[9px] font-bold uppercase tracking-widest rounded-md hover:opacity-85 transition-all"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Book a Consultation
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-[9px] uppercase tracking-widest" style={{ color: "var(--text-4)" }}>
            © {new Date().getFullYear()} OAKLEAF PARTNERS LLC — All rights reserved
          </p>
          <div className="flex gap-6">
            <span className="text-[9px] uppercase tracking-widest" style={{ color: "var(--text-4)" }}>Privacy Policy</span>
            <span className="text-[9px] uppercase tracking-widest" style={{ color: "var(--text-4)" }}>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
