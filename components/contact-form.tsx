"use client"

import { useState } from "react"
import { ArrowRight, Check, Mail, MapPin, Clock } from "lucide-react"
import { addLead, LEAD_SERVICES } from "@/lib/leads-store"

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
  color: "#ECEAE3",
}

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: LEAD_SERVICES[0], message: "" })
  const [submitted, setSubmitted] = useState(false)

  const update = (key: keyof typeof form, val: string) => setForm((p) => ({ ...p, [key]: val }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    addLead({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      service: form.service,
      message: form.message.trim(),
    })
    setSubmitted(true)
  }

  return (
    <section id="contact" className="section-padding relative overflow-hidden" style={{ background: "var(--surface-2)" }}>
      <div
        className="absolute top-0 left-0 w-1/2 h-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse at left, rgba(194,161,91,0.1), transparent 65%)" }}
      />
      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px" style={{ background: "var(--primary)" }} />
              <span className="eyebrow">Book a Consultation</span>
            </div>
            <h2 className="font-display font-semibold tracking-tight text-white mb-6" style={{ fontSize: "clamp(2rem,4.5vw,3.2rem)", lineHeight: 1.05 }}>
              Start a<br />conversation
            </h2>
            <p className="text-sm leading-relaxed mb-12 max-w-sm" style={{ color: "var(--text-2)" }}>
              Tell us what you&apos;re working on. A consultant will review your request and get back to you personally.
            </p>

            <div className="space-y-5">
              {[
                { Icon: Mail, label: "hello@oakleafpartners.com" },
                { Icon: MapPin, label: "Remote & in-person — by appointment" },
                { Icon: Clock, label: "Response within 24 hours" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ border: "1px solid rgba(194,161,91,0.3)", background: "rgba(194,161,91,0.12)" }}
                  >
                    <Icon className="h-4 w-4" style={{ color: "var(--primary)" }} />
                  </div>
                  <span className="text-sm" style={{ color: "var(--text-2)" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="h-full flex items-center justify-center py-16">
                <div className="text-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-8"
                    style={{ border: "1px solid rgba(194,161,91,0.5)", background: "rgba(194,161,91,0.15)" }}
                  >
                    <Check className="h-6 w-6" style={{ color: "var(--primary)" }} />
                  </div>
                  <h3 className="font-display text-2xl font-semibold mb-3 text-white">Request received</h3>
                  <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: "var(--text-3)" }}>
                    Thank you, {form.name.split(" ")[0]}. A consultant will reach you within 24 hours.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    required
                    className="w-full px-5 py-3.5 rounded-lg text-sm outline-none transition-colors placeholder:text-white/30"
                    style={inputStyle}
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    required
                    className="w-full px-5 py-3.5 rounded-lg text-sm outline-none transition-colors placeholder:text-white/30"
                    style={inputStyle}
                  />
                </div>

                <input
                  placeholder="Phone (optional)"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="w-full px-5 py-3.5 rounded-lg text-sm outline-none transition-colors placeholder:text-white/30"
                  style={inputStyle}
                />

                <select
                  value={form.service}
                  onChange={(e) => update("service", e.target.value)}
                  className="w-full px-5 py-3.5 rounded-lg text-sm outline-none transition-colors"
                  style={{ ...inputStyle, background: "#141A16" }}
                >
                  {LEAD_SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <textarea
                  placeholder="Tell us about your needs, preferences, and goals."
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  rows={6}
                  className="w-full px-5 py-3.5 rounded-lg text-sm outline-none resize-none transition-colors placeholder:text-white/30"
                  style={inputStyle}
                />

                <button
                  type="submit"
                  className="group flex items-center gap-3 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.18em] rounded-lg hover:opacity-90 transition-all"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  Submit Request
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-[9px] uppercase tracking-widest pt-1" style={{ color: "var(--text-4)" }}>
                  Your details are used only to respond to this request.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
