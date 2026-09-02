"use client"

import { useEffect, useState } from "react"
import { Search, Trash2, X, Mail, Phone } from "lucide-react"
import {
  getLeads,
  updateLeadStatus,
  deleteLead,
  type Lead,
  type LeadStatus,
} from "@/lib/leads-store"
import { timeAgo, formatPrice } from "@/lib/utils"

const STATUSES: LeadStatus[] = ["new", "contacted", "scheduled", "closed"]

const statusColor: Record<LeadStatus, string> = {
  new: "bg-emerald-500/15 text-emerald-400",
  contacted: "bg-yellow-500/15 text-yellow-400",
  scheduled: "bg-sky-500/15 text-sky-400",
  closed: "bg-white/8 text-white/40",
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | LeadStatus>("all")
  const [selected, setSelected] = useState<Lead | null>(null)
  const [delTarget, setDelTarget] = useState<Lead | null>(null)

  const reload = () => {
    getLeads().then(setLeads).catch(() => {})
  }

  useEffect(() => {
    reload()
    const t = setInterval(reload, 4000)
    return () => clearInterval(t)
  }, [])

  const setStatus = async (id: number, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    setSelected((s) => (s && s.id === id ? { ...s, status } : s))
    await updateLeadStatus(id, status)
    reload()
  }

  const remove = async () => {
    if (!delTarget) return
    const id = delTarget.id
    setDelTarget(null)
    setSelected(null)
    setLeads((prev) => prev.filter((l) => l.id !== id))
    await deleteLead(id)
    reload()
  }

  const filtered = leads.filter((l) => {
    if (filter !== "all" && l.status !== filter) return false
    const q = search.toLowerCase()
    return !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.service.toLowerCase().includes(q)
  })

  return (
    <div className="p-6 lg:p-10 min-h-screen">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-white">Consultations</h1>
        <p className="text-white/35 text-sm mt-1">{leads.length} consultation requests</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search requests..."
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
                {["Client", "Service", "Status", "Received", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-widest text-white/25 font-bold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr
                  key={l.id}
                  onClick={() => setSelected(l)}
                  className="admin-row-hover transition-colors cursor-pointer"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-white/90">{l.name}</p>
                    <p className="text-[11px] text-white/30">{l.email}</p>
                  </td>
                  <td className="px-5 py-4 text-xs text-white/45 whitespace-nowrap">
                    {l.service}
                    {!!l.paidAmount && l.paidAmount > 0 && (
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                        {formatPrice(l.paidAmount)}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusColor[l.status]}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-white/30 whitespace-nowrap">{timeAgo(l.createdAt)}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDelTarget(l)
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-400/50" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-16 text-center text-white/25 text-sm">No requests found</div>}
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
                <h2 className="font-display text-xl font-semibold text-white">{selected.name}</h2>
                <p className="text-xs text-white/35 mt-1">Received {timeAgo(selected.createdAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/8">
                <X className="h-4 w-4 text-white/50" />
              </button>
            </div>

            <div className="space-y-3 mb-8">
              <a href={`mailto:${selected.email}`} className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors">
                <Mail className="h-4 w-4" style={{ color: "var(--primary)" }} /> {selected.email}
              </a>
              {selected.phone && (
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <Phone className="h-4 w-4" style={{ color: "var(--primary)" }} /> {selected.phone}
                </div>
              )}
            </div>

            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-widest text-white/35 mb-2">Service</p>
              <p className="text-sm text-white/80">{selected.service}</p>
            </div>

            {!!selected.paidAmount && selected.paidAmount > 0 && (
              <div className="mb-8">
                <p className="text-[10px] uppercase tracking-widest text-white/35 mb-2">Payment recorded</p>
                <p className="text-sm font-semibold text-emerald-400">{formatPrice(selected.paidAmount)}</p>
                <a href="/admin/payments" className="text-[11px] text-white/40 hover:text-white/70 transition-colors">
                  Manage in Payments →
                </a>
              </div>
            )}

            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-widest text-white/35 mb-2">Message</p>
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                {selected.message || "— no message —"}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/35 mb-3">Status</p>
              <div className="grid grid-cols-2 gap-2">
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

      {delTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDelTarget(null)} />
          <div className="relative w-full max-w-sm rounded-2xl p-6" style={{ background: "#12160F", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h3 className="font-display text-base font-semibold text-white mb-2">Delete request?</h3>
            <p className="text-sm text-white/40 mb-6">The request from &ldquo;{delTarget.name}&rdquo; will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelTarget(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/40 hover:text-white/70 transition-colors border border-white/10">
                Cancel
              </button>
              <button onClick={remove} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600/80 hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
