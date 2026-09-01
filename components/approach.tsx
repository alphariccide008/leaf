import { APPROACH_STEPS } from "@/lib/services"
import { SectionHeading } from "@/components/section-heading"

export function Approach() {
  return (
    <section id="approach" className="section-padding relative overflow-hidden" style={{ background: "var(--background)" }}>
      <div className="absolute inset-0 grid-lines pointer-events-none opacity-60" />
      <div className="container-wide relative z-10">
        <SectionHeading
          eyebrow="Our Approach"
          center
          title={<>How we work</>}
          intro="We believe in understanding each client's unique needs and delivering solutions that combine quality, creativity, practicality, and professionalism."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
          {APPROACH_STEPS.map((step) => (
            <div
              key={step.num}
              className="p-7 rounded-2xl"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
            >
              <div className="font-display text-3xl font-semibold mb-4" style={{ color: "var(--primary)" }}>
                {step.num}
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-3)" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
