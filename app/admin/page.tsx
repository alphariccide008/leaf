"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users, Package, MessageCircle, Star, ArrowUpRight, Eye } from "lucide-react"
import { getLeads, type Lead } from "@/lib/leads-store"
import { getProducts, type Product } from "@/lib/products-store"
import { getSessions, type ChatSession } from "@/lib/chat-store"
import { timeAgo } from "@/lib/utils"

const statusColor: Record<string, string> = {
  new: "bg-emerald-500/15 text-emerald-400",
  contacted: "bg-yellow-500/15 text-yellow-400",
  scheduled: "bg-sky-500/15 text-sky-400",
  closed: "bg-white/8 text-white/40",
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [sessions, setSessions] = useState<ChatSession[]>([])

  useEffect(() => {
    const load = () => {
      setLeads(getLeads())
      setProducts(getProducts())
      setSessions(getSessions())
    }
    load()
    const t = setInterval(load, 2500)
    return () => clearInterval(t)
  }, [])

  const unread = sessions.filter((s) => !s.read).length
  const newLeads = leads.filter((l) => l.status === "new").length

  const kpis = [
    { label: "Consultation Requests", value: leads.length, icon: Users, delta: `${newLeads} new` },
    { label: "Products Published", value: products.length, icon: Package, delta: `${products.filter((p) => p.featured).length} featured` },
    { label: "Live Chats", value: sessions.length, icon: MessageCircle, delta: `${unread} unread` },
    { label: "Featured Packages", value: products.filter((p) => p.featured).length, icon: Star, delta: "on homepage / shop" },
  ]

  return (
    <div className="p-6 lg:p-10 min-h-screen">
      <div className="mb-10">
        <h1 className="font-display text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-white/35 text-sm mt-1">Welcome back, Admin</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {kpis.map(({ label, value, icon: Icon, delta }) => (
          <div key={label} className="admin-card p-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(194,161,91,0.2)" }}>
              <Icon className="h-4 w-4" style={{ color: "var(--primary)" }} />
            </div>
            <div className="font-display text-3xl font-semibold text-white mb-1">{value}</div>
            <div className="text-xs font-semibold text-white/50 mb-1">{label}</div>
            <div className="text-[10px] text-white/25">{delta}</div>
          </div>
        ))}
      </div>

      {/* Consultation requests table */}
      <div className="admin-card overflow-hidden mb-6">
        <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <h2 className="font-display text-sm font-semibold text-white">Recent Consultation Requests</h2>
          <Link href="/admin/leads" className="text-xs font-semibold flex items-center gap-1 hover:opacity-80 transition" style={{ color: "var(--primary)" }}>
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["Client", "Service", "Status", "Received"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] uppercase tracking-widest text-white/25 font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 6).map((l) => (
                <tr key={l.id} className="admin-row-hover transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-white/85">{l.name}</p>
                    <p className="text-[11px] text-white/30">{l.email}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-white/45">{l.service}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusColor[l.status]}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-white/30">{timeAgo(l.createdAt)}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-white/25 text-sm">
                    No requests yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live chat panel */}
      <div className="admin-card overflow-hidden">
        <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-sm font-semibold text-white">Live Chat Sessions</h2>
            {unread > 0 && (
              <span className="text-[10px] font-bold bg-emerald-500 text-white rounded-full px-2 py-0.5">{unread} new</span>
            )}
          </div>
          <Link href="/admin/messages" className="text-xs font-semibold flex items-center gap-1 hover:opacity-80 transition" style={{ color: "var(--primary)" }}>
            Open inbox <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {sessions.length === 0 ? (
          <div className="p-10 text-center text-white/25 text-sm">No live sessions yet</div>
        ) : (
          <div className="p-4">
            {sessions
              .slice()
              .reverse()
              .slice(0, 5)
              .map((s) => (
                <Link
                  key={s.id}
                  href="/admin/messages"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/4 transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: "rgba(194,161,91,0.4)" }}
                    >
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    {!s.read && (
                      <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0B0F0D]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{s.name}</p>
                    <p className="text-xs text-white/30 truncate">
                      {s.messages[s.messages.length - 1]?.text ?? "No messages yet"}
                    </p>
                  </div>
                  <Eye className="h-4 w-4 text-white/20 flex-shrink-0" />
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
