"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { TEAM } from "@/lib/team"

const N = TEAM.length

function getPos(idx: number, cur: number): string {
  const offset = (idx - cur + N) % N
  if (offset === 0) return "pos-center"
  if (offset === 1) return "pos-right1"
  if (offset === 2) return "pos-right2"
  if (offset === N - 1) return "pos-left1"
  if (offset === N - 2) return "pos-left2"
  return "pos-hidden"
}

export function Team() {
  const [cur, setCur] = useState(0)
  const [busy, setBusy] = useState(false)
  const [visible, setVisible] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback(
    (idx: number) => {
      if (busy) return
      setBusy(true)
      setVisible(false)
      setTimeout(() => {
        setCur(((idx % N) + N) % N)
        setVisible(true)
      }, 280)
      setTimeout(() => setBusy(false), 800)
    },
    [busy],
  )

  useEffect(() => {
    timerRef.current = setInterval(() => goTo(cur + 1), 4800)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [cur, goTo])

  const resetTimer = (idx: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    goTo(idx)
  }

  const member = TEAM[cur]

  return (
    <section id="team" className="py-28 relative overflow-hidden" style={{ background: "var(--surface-2)" }}>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 800,
          height: 400,
          background: "radial-gradient(ellipse at bottom, rgba(194,161,91,0.16), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 select-none pointer-events-none whitespace-nowrap font-display font-semibold uppercase"
        style={{
          fontSize: "clamp(2.6rem,9vw,6.5rem)",
          letterSpacing: "-0.02em",
          background: "linear-gradient(to bottom, rgba(194,161,91,0.16) 30%, rgba(255,255,255,0) 76%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        The Team
      </div>

      <div className="container-wide relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px" style={{ background: "var(--primary)" }} />
            <span className="eyebrow">The People</span>
            <div className="w-8 h-px" style={{ background: "var(--primary)" }} />
          </div>
          <h2 className="font-display font-semibold tracking-tight text-white" style={{ fontSize: "clamp(2rem,5vw,3.6rem)" }}>
            Our Team
          </h2>
          <p className="text-sm max-w-md mx-auto leading-relaxed mt-4" style={{ color: "var(--text-3)" }}>
            Specialists across fashion, design, and engineering — working as one consulting practice.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => resetTimer(cur - 1)}
            aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[var(--primary)]"
            style={{ background: "rgba(194,161,91,0.28)", border: "1px solid rgba(194,161,91,0.36)" }}
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>

          <div className="carousel-wrap mx-auto">
            <div className="carousel-inner">
              {TEAM.map((m, idx) => {
                const pos = getPos(idx, cur)
                const isCenter = pos === "pos-center"
                return (
                  <div
                    key={idx}
                    onClick={() => !isCenter && resetTimer(idx)}
                    className={`c-card ${pos}`}
                    style={{
                      background: "linear-gradient(180deg, #141A16, #0B0F0D)",
                      border: isCenter ? "1px solid rgba(194,161,91,0.28)" : "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <img src={m.image} alt={m.name} />
                    {isCenter && (
                      <>
                        <div
                          className="absolute inset-0"
                          style={{ background: "linear-gradient(to top, rgba(11,15,13,0.92) 0%, transparent 55%)" }}
                        />
                        <div className="absolute bottom-5 left-5 right-5">
                          <p className="text-[9px] uppercase tracking-[0.2em]" style={{ color: "var(--primary)" }}>
                            {m.discipline}
                          </p>
                        </div>
                        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2" style={{ borderColor: "var(--primary)" }} />
                        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2" style={{ borderColor: "var(--primary)" }} />
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <button
            onClick={() => resetTimer(cur + 1)}
            aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-[var(--primary)]"
            style={{ background: "rgba(194,161,91,0.28)", border: "1px solid rgba(194,161,91,0.36)" }}
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="text-center mt-12">
          <div
            className="transition-all duration-300"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)" }}
          >
            <div className="flex items-center justify-center gap-3 sm:gap-6 mb-1">
              <div className="w-8 sm:w-16 h-px flex-shrink-0" style={{ background: "var(--primary)" }} />
              <h3 className="font-display text-xl sm:text-3xl font-semibold text-white tracking-tight">{member.name}</h3>
              <div className="w-8 sm:w-16 h-px flex-shrink-0" style={{ background: "var(--primary)" }} />
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] mt-2" style={{ color: "var(--text-3)" }}>
              {member.role}
            </p>
            <p className="text-sm max-w-md mx-auto mt-4 leading-relaxed" style={{ color: "var(--text-3)" }}>
              {member.bio}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2.5 mt-8">
          {TEAM.map((_, idx) => (
            <button
              key={idx}
              onClick={() => resetTimer(idx)}
              aria-label={`Go to team member ${idx + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: idx === cur ? 28 : 8,
                height: 8,
                background: idx === cur ? "var(--primary)" : "rgba(194,161,91,0.22)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
