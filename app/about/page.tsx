import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Team } from "@/components/team"
import { Leadership } from "@/components/leadership"
import { CtaSection } from "@/components/cta-section"

export const metadata: Metadata = {
  title: "About",
  description:
    "OAKLEAF PARTNERS LLC brings together creativity, professionalism, technical knowledge, and personalized consulting across the fashion and engineering sectors. Led by CEO Cindy Kahn.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About · OAKLEAF PARTNERS LLC",
    description:
      "One practice, two sectors — the people and values behind OAKLEAF PARTNERS LLC.",
    url: "/about",
  },
}

const values = [
  {
    num: "01",
    title: "Understanding First",
    desc: "We believe in understanding each client's unique needs before recommending a solution. No template engagements.",
  },
  {
    num: "02",
    title: "Creativity & Craft",
    desc: "Whether it's a wardrobe, a garment, or a project plan, the work is made with genuine creative care.",
  },
  {
    num: "03",
    title: "Technical Discipline",
    desc: "Professional judgement and technical knowledge underpin everything, especially our engineering advisory work.",
  },
  {
    num: "04",
    title: "Practical Quality",
    desc: "Solutions that combine quality, creativity, practicality, and professionalism — and that actually work in real life.",
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      <Header />

      <section className="relative pt-36 pb-20 overflow-hidden" style={{ background: "var(--background)" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(194,161,91,0.14), transparent)" }}
        />
        <div className="container-wide relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px" style={{ background: "var(--primary)" }} />
            <span className="eyebrow">About OAKLEAF PARTNERS</span>
          </div>
          <h1
            className="font-display font-semibold tracking-tight leading-[1.02] mb-8 text-white"
            style={{ fontSize: "clamp(2.3rem,7vw,5.5rem)" }}
          >
            Creativity and
            <br />
            <span style={{ color: "var(--primary)" }}>technical knowledge</span>
            <br />
            in the same room.
          </h1>
          <p className="text-base md:text-lg max-w-2xl leading-relaxed" style={{ color: "var(--text-2)" }}>
            OAKLEAF PARTNERS LLC is a diversified consulting and design company offering professional services in wardrobe
            consulting, clothing design, and engineering consulting.
          </p>
        </div>
      </section>

      <section className="py-20" style={{ background: "var(--surface-2)" }}>
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px" style={{ background: "var(--primary)" }} />
                <span className="eyebrow">Company Overview</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight mb-6 text-white">
                One practice, two sectors.
              </h2>
              <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                <p>
                  Our wardrobe and fashion services focus on helping individuals and clients develop a polished, confident,
                  and personalized appearance. We provide wardrobe consultations, style guidance, clothing design, and
                  personalized fashion solutions tailored to each client&apos;s needs, preferences, and lifestyle.
                </p>
                <p>
                  In addition, OAKLEAF PARTNERS LLC provides consulting services for engineering works and projects. We
                  offer professional guidance and consulting support to help clients effectively plan, evaluate, and
                  execute engineering-related work.
                </p>
                <p>
                  Our goal is to bring together creativity, professionalism, technical knowledge, and personalized
                  consulting to provide high-quality solutions across both the fashion and engineering sectors.
                </p>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden" style={{ height: 460 }}>
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80&auto=format&fit=crop"
                alt="OAKLEAF PARTNERS at work"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(11,15,13,0.55), transparent 55%)" }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ background: "var(--background)" }}>
        <div className="container-wide">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-px" style={{ background: "var(--primary)" }} />
              <span className="eyebrow">What We Stand For</span>
              <div className="w-8 h-px" style={{ background: "var(--primary)" }} />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-white">Our values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.map((v) => (
              <div key={v.num} className="p-8 rounded-2xl" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <div className="font-display text-2xl font-semibold mb-4" style={{ color: "var(--primary)" }}>
                  {v.num}
                </div>
                <h3 className="font-display text-xl font-semibold mb-3 text-white">{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-3)" }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Leadership />
      <Team />
      <CtaSection />
      <Footer />
    </main>
  )
}
