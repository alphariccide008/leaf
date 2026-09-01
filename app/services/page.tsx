import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Approach } from "@/components/approach"
import { SERVICE_GROUPS } from "@/lib/services"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Wardrobe & fashion consulting, clothing design, and engineering consulting from OAKLEAF PARTNERS LLC — three disciplines, one system.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services · OAKLEAF PARTNERS LLC",
    description:
      "Personal wardrobe consultation, custom clothing design, and engineering project advisory.",
    url: "/services",
  },
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      <Header />

      <section className="relative pt-36 pb-20 overflow-hidden" style={{ background: "var(--background)" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(194,161,91,0.14), transparent)" }}
        />
        <div className="container-wide relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px" style={{ background: "var(--primary)" }} />
            <span className="eyebrow">Our Services</span>
          </div>
          <h1
            className="font-display font-semibold tracking-tight leading-[1.02] mb-8 text-white"
            style={{ fontSize: "clamp(2.3rem,7vw,5.5rem)" }}
          >
            Three disciplines.
            <br />
            <span style={{ color: "var(--primary)" }}>One system.</span>
          </h1>
          <p className="text-base md:text-lg max-w-2xl leading-relaxed" style={{ color: "var(--text-2)" }}>
            Every service compounds with the others — combining creativity, professionalism, and technical knowledge to
            deliver high-quality solutions across the fashion and engineering sectors.
          </p>
        </div>
      </section>

      <section className="py-10" style={{ background: "var(--surface-2)" }}>
        <div className="container-wide space-y-5">
          {SERVICE_GROUPS.map((s, i) => {
            const Icon = s.Icon
            return (
              <div
                key={s.id}
                id={s.id}
                className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden scroll-mt-28"
                style={{ border: "1px solid var(--border)", background: "var(--surface-3)" }}
              >
                <div className={`relative overflow-hidden ${i % 2 === 1 ? "lg:order-2" : ""}`} style={{ minHeight: 340 }}>
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(11,15,13,0.5))" }} />
                  <div className="absolute top-5 left-5 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--primary)" }}>
                    <Icon className="h-5 w-5" style={{ color: "var(--primary-foreground)" }} />
                  </div>
                </div>
                <div className={`p-8 lg:p-12 flex flex-col justify-center ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="text-[9px] font-bold uppercase tracking-[0.32em] mb-4" style={{ color: "var(--primary)" }}>
                    {s.tagline}
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4 text-white">{s.title}</h2>
                  <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-2)" }}>
                    {s.summary}
                  </p>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest mb-4" style={{ color: "var(--text-4)" }}>
                      What&apos;s included
                    </p>
                    <ul className="space-y-2.5">
                      {s.items.map((d) => (
                        <li key={d} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-2)" }}>
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--primary)" }} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <Approach />

      <section className="section-padding" style={{ background: "var(--surface-2)" }}>
        <div className="container-wide text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-6 text-white">Ready to begin?</h2>
          <p className="text-sm mb-10 max-w-lg mx-auto" style={{ color: "var(--text-2)" }}>
            Start with a consultation. We&apos;ll scope your needs precisely and recommend the right approach.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold hover:opacity-90 transition-all"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            Book a Consultation
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
