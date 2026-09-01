import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a consultation with OAKLEAF PARTNERS LLC. Share your wardrobe goals, design brief, or engineering project — we respond within 24 hours.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact · OAKLEAF PARTNERS LLC",
    description: "Book a consultation — we respond within 24 hours.",
    url: "/contact",
  },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      <Header />

      <section className="relative pt-36 pb-14 overflow-hidden" style={{ background: "var(--background)" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(194,161,91,0.13), transparent)" }}
        />
        <div className="container-wide relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px" style={{ background: "var(--primary)" }} />
            <span className="eyebrow">Contact</span>
          </div>
          <h1
            className="font-display font-semibold tracking-tight leading-[1.02] mb-6 text-white"
            style={{ fontSize: "clamp(2.3rem,7vw,5rem)" }}
          >
            Let&apos;s talk.
          </h1>
          <p className="text-base md:text-lg max-w-xl leading-relaxed" style={{ color: "var(--text-2)" }}>
            Share your wardrobe goals, your design brief, or your engineering project. We respond within 24 hours.
          </p>
        </div>
      </section>

      <ContactForm />
      <Footer />
    </main>
  )
}
