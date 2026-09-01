import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section className="section-padding relative overflow-hidden" style={{ background: "var(--surface-2)" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(194,161,91,0.12), transparent)" }}
      />
      <div className="container-wide relative z-10 text-center">
        <h2 className="font-display font-semibold tracking-tight text-white mb-5" style={{ fontSize: "clamp(2rem,5vw,3.4rem)" }}>
          Let&apos;s work on it together.
        </h2>
        <p className="text-sm md:text-base leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: "var(--text-2)" }}>
          Tell us about your wardrobe, your collection, or your engineering project. We&apos;ll respond within 24 hours with
          a clear next step.
        </p>
        <Link
          href="/contact"
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          Book a Consultation
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
