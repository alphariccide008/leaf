export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = false,
}: {
  eyebrow: string
  title: React.ReactNode
  intro?: string
  center?: boolean
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <div className={`flex items-center gap-3 mb-6 ${center ? "justify-center" : ""}`}>
        <div className="w-8 h-px" style={{ background: "var(--primary)" }} />
        <span className="eyebrow">{eyebrow}</span>
        {center && <div className="w-8 h-px" style={{ background: "var(--primary)" }} />}
      </div>
      <h2
        className="font-display font-semibold tracking-tight text-white"
        style={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)", lineHeight: 1.05 }}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`text-sm md:text-base leading-relaxed mt-5 ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
          style={{ color: "var(--text-2)" }}
        >
          {intro}
        </p>
      )}
    </div>
  )
}
