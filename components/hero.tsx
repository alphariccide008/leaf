"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import Link from "next/link"

const slides = [
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1900&q=85&auto=format&fit=crop",
    label: "Wardrobe & Fashion Consulting",
    headline: ["A Polished,", "Confident You."],
    sub: "Wardrobe consultations, style guidance, and personalised fashion solutions — tailored to your needs, preferences, and lifestyle.",
    cta: { label: "Explore Consulting", href: "/services#wardrobe" },
  },
  {
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1900&q=85&auto=format&fit=crop",
    label: "Clothing Design",
    headline: ["Designed", "Around You."],
    sub: "Custom clothing design and personalised concepts, developed from first sketch to finished garment.",
    cta: { label: "See Design Services", href: "/services#design" },
  },
  {
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1900&q=85&auto=format&fit=crop",
    label: "Engineering Consulting",
    headline: ["Plan. Evaluate.", "Execute."],
    sub: "Professional guidance and consulting support to help you plan, evaluate, and execute engineering works and projects.",
    cta: { label: "Engineering Advisory", href: "/services#engineering" },
  },
]

const stats = [
  { value: "3", label: "Disciplines" },
  { value: "1", label: "Unified System" },
  { value: "100%", label: "Tailored Engagements" },
  { value: "24h", label: "Response Time" },
]

export function Hero() {
  const [cur, setCur] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [animating, setAnim] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = useCallback(
    (idx: number) => {
      if (animating) return
      const next = ((idx % slides.length) + slides.length) % slides.length
      setAnim(true)
      setPrev(cur)
      setCur(next)
      setTimeout(() => {
        setPrev(null)
        setAnim(false)
      }, 800)
    },
    [animating, cur],
  )

  const next = useCallback(() => goTo(cur + 1), [cur, goTo])
  const back = useCallback(() => goTo(cur - 1), [cur, goTo])

  useEffect(() => {
    timerRef.current = setTimeout(next, 6500)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [cur, next])

  const s = slides[cur]

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: 760 }}>
      {slides.map((sl, i) => (
        <div
          key={i}
          className="absolute inset-0 will-change-transform"
          style={{
            zIndex: i === cur ? 2 : i === prev ? 1 : 0,
            opacity: i === cur || i === prev ? 1 : 0,
            transition: i === cur ? "opacity 0.8s ease" : "none",
          }}
        >
          <img
            src={sl.image}
            alt=""
            className="w-full h-full object-cover"
            style={{ animation: i === cur ? "ken-burns 9s ease-in-out forwards" : "none" }}
          />
        </div>
      ))}

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, rgba(8,11,9,0.85) 0%, rgba(8,11,9,0.55) 55%, rgba(8,11,9,0.2) 100%)" }}
      />
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(8,11,9,0.75) 0%, transparent 42%)" }}
      />

      <div className="absolute inset-0 z-20 flex flex-col justify-center" style={{ paddingTop: 96, paddingBottom: 150 }}>
        <div className="container-wide">
          <div className="max-w-3xl">
            <div
              key={`label-${cur}`}
              className="flex items-center gap-3 mb-7"
              style={{ animation: "fade-in-up 0.6s ease-out forwards", opacity: 0 }}
            >
              <span className="h-px w-10 block flex-shrink-0" style={{ background: "var(--primary)" }} />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.7)" }}>
                {s.label}
              </span>
            </div>

            <div key={`h-${cur}`} style={{ minHeight: "clamp(8rem, 13vw, 12rem)" }}>
              {s.headline.map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <h1
                    className="block font-display font-semibold text-white leading-[0.98] tracking-tight"
                    style={{
                      fontSize: "clamp(2.3rem, 5.4vw, 5.4rem)",
                      animation: `fade-in-up 0.7s ease-out ${0.08 + i * 0.1}s forwards`,
                      opacity: 0,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {line}
                  </h1>
                </div>
              ))}
            </div>

            <p
              key={`sub-${cur}`}
              className="text-base md:text-lg leading-relaxed mt-7 mb-10 max-w-xl"
              style={{ color: "rgba(255,255,255,0.72)", animation: "fade-in-up 0.7s ease-out 0.28s forwards", opacity: 0 }}
            >
              {s.sub}
            </p>

            <div
              key={`cta-${cur}`}
              className="flex flex-wrap gap-4"
              style={{ animation: "fade-in-up 0.7s ease-out 0.38s forwards", opacity: 0 }}
            >
              <Link
                href={s.cta.href}
                className="group flex items-center gap-3 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                {s.cta.label}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3.5 rounded-full text-sm font-semibold text-white border transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5"
                style={{ borderColor: "rgba(255,255,255,0.3)" }}
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={back}
        className="absolute left-5 top-[44%] md:top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/20"
        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(8px)" }}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-5 top-[44%] md:top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/20"
        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(8px)" }}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 text-white" />
      </button>

      <div className="absolute bottom-28 right-8 z-30 font-mono text-xs tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.45)" }}>
        {String(cur + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 z-30"
        style={{ background: "rgba(8,11,9,0.8)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {stats.map((st) => (
              <div key={st.label} className="flex flex-col items-center py-5 px-4">
                <span className="font-display text-2xl md:text-3xl font-semibold leading-none" style={{ color: "var(--primary)" }}>
                  {st.value}
                </span>
                <span className="text-[10px] uppercase tracking-[0.22em] mt-1.5" style={{ color: "rgba(255,255,255,0.42)" }}>
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
