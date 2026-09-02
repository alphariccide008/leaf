"use client"

import { useState } from "react"
import { ArrowRight, Check, Mail, MapPin, Clock, Phone } from "lucide-react"
import { submitLead, LEAD_SERVICES } from "@/lib/leads-store"

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
  color: "#ECEAE3",
}

const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "card", label: "Card" },
  { value: "cash", label: "Cash" },
  { value: "other", label: "Other" },
]

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: LEAD_SERVICES[0] as string,
    message: "",
    amount: "",
    paymentMethod: "bank_transfer",
    paymentReference: "",
  })
  const [sendPayment, setSendPayment] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const update = (key: keyof typeof form, val: string) => setForm((p) => ({ ...p, [key]: val }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    setError("")
    setSubmitting(true)
    try {
      const amount = sendPayment ? Number(form.amount) : 0
      await submitLead({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        service: form.service,
        message: form.message.trim(),
        amount: amount > 0 ? amount : undefined,
        paymentMethod: sendPayment ? form.paymentMethod : undefined,
        paymentReference: sendPayment ? form.paymentReference.trim() : undefined,
      })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
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
                { Icon: Mail, label: "info@oakleafpartnersconsulting.com" },
                { Icon: Phone, label: "+1 (469) 879-9826" },
                { Icon: Phone, label: "+1 (405) 213-7499" },
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
                    Thank you, {form.name.split(" ")[0]}. A consultant will reach you within 24 hours
                    {sendPayment && Number(form.amount) > 0
                      ? ". We'll confirm your payment once it clears."
                      : "."}
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
                  rows={5}
                  className="w-full px-5 py-3.5 rounded-lg text-sm outline-none resize-none transition-colors placeholder:text-white/30"
                  style={inputStyle}
                />

                <div className="rounded-lg p-4" style={{ border: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.03)" }}>
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sendPayment}
                      onChange={(e) => setSendPayment(e.target.checked)}
                      className="h-4 w-4 accent-[var(--primary)]"
                    />
                    <span className="text-sm text-white/80">I&apos;m sending a payment / deposit with this request</span>
                  </label>

                  {sendPayment && (
                    <div className="mt-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="Amount (USD)"
                          value={form.amount}
                          onChange={(e) => update("amount", e.target.value)}
                          className="w-full px-4 py-3 rounded-lg text-sm outline-none placeholder:text-white/30"
                          style={inputStyle}
                        />
                        <select
                          value={form.paymentMethod}
                          onChange={(e) => update("paymentMethod", e.target.value)}
                          className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                          style={{ ...inputStyle, background: "#141A16" }}
                        >
                          {PAYMENT_METHODS.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        placeholder="Payment reference / transfer note (optional)"
                        value={form.paymentReference}
                        onChange={(e) => update("paymentReference", e.target.value)}
                        className="w-full px-4 py-3 rounded-lg text-sm outline-none placeholder:text-white/30"
                        style={inputStyle}
                      />
                      <p className="text-[10px] leading-relaxed" style={{ color: "var(--text-4)" }}>
                        This records the amount against your request so our team can reconcile it. No card is charged here —
                        a consultant will confirm payment details with you.
                      </p>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex items-center gap-3 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.18em] rounded-lg hover:opacity-90 transition-all disabled:opacity-60"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  {submitting ? "Sending..." : "Submit Request"}
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
