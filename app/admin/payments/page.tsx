"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, X, Mail, Plus, Check } from "lucide-react"
import {
  getPayments,
  addPayment,
  updatePayment,
  PAYMENT_METHODS,
  type Payment,
  type PaymentStatus,
} from "@/lib/payments-store"
import { timeAgo, formatPrice } from "@/lib/utils"

const STATUSES: PaymentStatus[] = ["pending", "received", "refunded"]

const statusColor: Record<PaymentStatus, string> = {
  pending: "bg-yellow-500/15 text-yellow-400",
  received: "bg-emerald-500/15 text-emerald-400",
  refunded: "bg-white/8 text-white/40",
}

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 transition-colors placeholder:text-white/25"

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | PaymentStatus>("all")
  const [selected, setSelected] = useState<Payment | null>(null)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ name: "", email: "", amount: "", method: "bank_transfer", reference: "", note: "" })
  const [saving, setSaving] = useState(false)

  const reload = () => {
    getPayments().then(setPayments).catch(() => {})
  }

  useEffect(() => {
    reload()
    const t = setInterval(reload, 5000)
    return () => clearInterval(t)
  }, [])

  const setStatus = async (id: number, status: PaymentStatus) => {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
    setSelected((s) => (s && s.id === id ? { ...s, status } : s))
    await updatePayment(id, { status })
    reload()
  }

  const submitNew = async () => {
    const amount = Number(draft.amount)
    if (!draft.name.trim() || !draft.email.trim() || !(amount > 0)) return
    setSaving(true)
    try {
      await addPayment({
        name: draft.name.trim(),
        email: draft.email.trim(),
        amount,
        method: draft.method,
        reference: draft.reference.trim(),
        note: draft.note.trim(),
      })
      setDraft({ name: "", email: "", amount: "", method: "bank_transfer", reference: "", note: "" })
      setAdding(false)
      reload()
    } finally {
      setSaving(false)
    }
  }

  const totals = useMemo(() => {
    const received = payments.filter((p) => p.status === "received").reduce((s, p) => s + p.amount, 0)
    const pending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0)
    return { received, pending }
  }, [payments])

  const filtered = payments.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false
    const q = search.toLowerCase()
    return !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.reference.toLowerCase().includes(q)
  })

  return (
    <div className="p-6 lg:p-10 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Payments</h1>
          <p className="text-white/35 text-sm mt-1">
            {formatPrice(totals.received)} received · {formatPrice(totals.pending)} pending
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          <Plus className="h-4 w-4" /> Record Payment
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payments..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
              style={
                filter === s
                  ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                  : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["From", "Amount", "Method", "Reference", "Status", "Received"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-widest text-white/25 font-bold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="admin-row-hover transition-colors cursor-pointer"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-white/90">{p.name}</p>
                    <p className="text-[11px] text-white/30">{p.email}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-white/80 font-mono whitespace-nowrap">{formatPrice(p.amount)}</td>
                  <td className="px-5 py-4 text-xs text-white/45 capitalize whitespace-nowrap">{p.method.replace("_", " ")}</td>
                  <td className="px-5 py-4 text-xs text-white/35 max-w-[160px] truncate">{p.reference || "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusColor[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-white/30 whitespace-nowrap">{timeAgo(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-16 text-center text-white/25 text-sm">No payments found</div>}
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div
            className="relative w-full max-w-md h-full overflow-y-auto p-8"
            style={{ background: "#12160F", borderLeft: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="font-display text-xl font-semibold text-white">{formatPrice(selected.amount)}</h2>
                <p className="text-xs text-white/35 mt-1">Recorded {timeAgo(selected.createdAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/8">
                <X className="h-4 w-4 text-white/50" />
              </button>
            </div>

            <div className="space-y-3 mb-8">
              <p className="text-sm font-semibold text-white/90">{selected.name}</p>
              <a href={`mailto:${selected.email}`} className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors">
                <Mail className="h-4 w-4" style={{ color: "var(--primary)" }} /> {selected.email}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/35 mb-1">Method</p>
                <p className="text-sm text-white/80 capitalize">{selected.method.replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/35 mb-1">Reference</p>
                <p className="text-sm text-white/80 break-words">{selected.reference || "—"}</p>
              </div>
            </div>

            {selected.note && (
              <div className="mb-8">
                <p className="text-[10px] uppercase tracking-widest text-white/35 mb-2">Note</p>
                <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{selected.note}</p>
              </div>
            )}

            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/35 mb-3">Status</p>
              <div className="grid grid-cols-3 gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(selected.id, s)}
                    className="px-3 py-2.5 rounded-lg text-xs font-semibold capitalize transition-all"
                    style={
                      selected.status === s
                        ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                        : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add payment modal */}
      {adding && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setAdding(false)} />
          <div className="relative w-full max-w-lg rounded-2xl p-6" style={{ background: "#12160F", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-base font-semibold text-white">Record a Payment</h3>
              <button onClick={() => setAdding(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/8">
                <X className="h-4 w-4 text-white/50" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input className={inputCls} placeholder="Payer name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                <input className={inputCls} placeholder="Email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className={inputCls}
                  placeholder="Amount (USD)"
                  value={draft.amount}
                  onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
                />
                <select
                  className={inputCls}
                  style={{ background: "#141A16" }}
                  value={draft.method}
                  onChange={(e) => setDraft({ ...draft, method: e.target.value })}
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <input className={inputCls} placeholder="Reference (optional)" value={draft.reference} onChange={(e) => setDraft({ ...draft, reference: e.target.value })} />
              <textarea className={inputCls} rows={3} placeholder="Note (optional)" value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} />
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setAdding(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white/40 hover:text-white/70 transition-colors">
                Cancel
              </button>
              <button
                onClick={submitNew}
                disabled={saving || !draft.name.trim() || !draft.email.trim() || !(Number(draft.amount) > 0)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 transition-all hover:opacity-90"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                {saving ? <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" /> : <Check className="h-4 w-4" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
