import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { SERVICE_GROUPS } from "@/lib/services"
import { SectionHeading } from "@/components/section-heading"

export function ServicesOverview() {
  return (
    <section id="services" className="section-padding" style={{ background: "var(--surface-2)" }}>
      <div className="container-wide">
        <SectionHeading
          eyebrow="Our Services"
          title={
            <>
              Three disciplines,
              <br />
              one standard of work.
            </>
          }
          intro="We bring together creativity, professionalism, technical knowledge, and personalized consulting to deliver high-quality solutions across both the fashion and engineering sectors."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-14">
          {SERVICE_GROUPS.map((s) => {
            const Icon = s.Icon
            return (
              <Link
                key={s.id}
                href={`/services#${s.id}`}
                className="group relative flex flex-col rounded-2xl overflow-hidden hover-lift"
                style={{ background: "var(--surface-3)", border: "1px solid var(--border)" }}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(11,15,13,0.9), transparent 70%)" }} />
                  <div
                    className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--primary)" }}
                  >
                    <Icon className="h-5 w-5" style={{ color: "var(--primary-foreground)" }} />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-[9px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: "var(--primary)" }}>
                    {s.tagline}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white mb-3">{s.title}</h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-3)" }}>
                    {s.summary}
                  </p>
                  <div
                    className="flex items-center gap-1.5 text-xs font-semibold mt-5 transition-colors"
                    style={{ color: "var(--primary)" }}
                  >
                    Learn more
                    <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
