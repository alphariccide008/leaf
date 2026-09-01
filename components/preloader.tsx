"use client"

import { useEffect, useRef, useState } from "react"
import { LogoMark } from "@/components/logo"

export function Preloader() {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<"loading" | "exit" | "done">("loading")
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 16 + 7, 100))
    }, 60)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (progress < 100) return
    if (timerRef.current) clearInterval(timerRef.current)
    const t1 = setTimeout(() => setPhase("exit"), 140)
    const t2 = setTimeout(() => setPhase("done"), 900)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [progress])

  if (phase === "done") return null

  const pct = Math.min(Math.round(progress), 100)

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{
        background: "#080B09",
        transform: phase === "exit" ? "translateY(-100%)" : "translateY(0)",
        transition: phase === "exit" ? "transform 0.7s cubic-bezier(0.76,0,0.24,1)" : "none",
      }}
    >
      {["top-8 left-8", "top-8 right-8", "bottom-8 left-8", "bottom-8 right-8"].map((pos, i) => (
        <div
          key={pos}
          className={`absolute ${pos} w-10 h-10`}
          style={{
            borderTop: i < 2 ? "1px solid rgba(194,161,91,0.5)" : "none",
            borderBottom: i >= 2 ? "1px solid rgba(194,161,91,0.5)" : "none",
            borderLeft: i % 2 === 0 ? "1px solid rgba(194,161,91,0.5)" : "none",
            borderRight: i % 2 === 1 ? "1px solid rgba(194,161,91,0.5)" : "none",
          }}
        />
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <div className="mb-8" style={{ animation: "pl-fade-in 0.5s ease both" }}>
          <LogoMark size={64} />
        </div>

        <div
          className="font-display font-semibold text-white mb-1.5"
          style={{
            fontSize: "clamp(1.5rem, 4.5vw, 2.4rem)",
            letterSpacing: "0.14em",
            animation: "pl-slide-up 0.65s ease 0.2s both",
          }}
        >
          OAKLEAF <span style={{ color: "var(--primary)" }}>PARTNERS</span>
        </div>

        <div
          className="uppercase font-medium mb-12"
          style={{
            fontSize: "0.55rem",
            letterSpacing: "0.42em",
            color: "rgba(236,234,227,0.28)",
            animation: "pl-slide-up 0.65s ease 0.35s both",
          }}
        >
          Consulting &amp; Design
        </div>

        <div style={{ animation: "pl-fade-in 0.5s ease 0.3s both", width: "clamp(150px,18vw,210px)" }}>
          <div
            className="w-full rounded-full overflow-hidden mb-2"
            style={{ height: 1, background: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, #DCC08A, var(--primary))",
                transition: "width 0.08s linear",
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span
              style={{
                fontSize: "0.5rem",
                letterSpacing: "0.24em",
                color: "rgba(255,255,255,0.2)",
                fontFamily: "monospace",
                textTransform: "uppercase",
              }}
            >
              Loading
            </span>
            <span style={{ fontSize: "0.58rem", color: "var(--primary)", fontFamily: "monospace", fontWeight: 700 }}>
              {pct}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
