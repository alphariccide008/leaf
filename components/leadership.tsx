import { LEADER } from "@/lib/team"

export function Leadership() {
  return (
    <section id="leadership" className="section-padding" style={{ background: "var(--background)" }}>
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden" style={{ height: 440 }}>
              <img src={LEADER.image} alt={LEADER.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(11,15,13,0.7), transparent 55%)" }} />
            </div>
            <div
              className="absolute bottom-6 left-6 right-6 px-5 py-4 rounded-xl"
              style={{ background: "rgba(11,15,13,0.9)", border: "1px solid var(--border)" }}
            >
              <p className="font-display text-lg font-semibold text-white">{LEADER.name}</p>
              <p className="text-[10px] uppercase tracking-[0.22em] mt-1" style={{ color: "var(--primary)" }}>
                {LEADER.role}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px" style={{ background: "var(--primary)" }} />
              <span className="eyebrow">Leadership</span>
            </div>
            <h2 className="font-display font-semibold tracking-tight text-white mb-6" style={{ fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1.1 }}>
              Led with vision.
            </h2>
            <p className="text-sm md:text-base leading-relaxed mb-5" style={{ color: "var(--text-2)" }}>
              {LEADER.bio}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-3)" }}>
              Under her leadership, OAKLEAF PARTNERS LLC combines creativity, professionalism, and technical knowledge to
              provide high-quality solutions across the fashion and engineering sectors.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
