"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Send, Search, RefreshCw, Trash2, ArrowLeft } from "lucide-react"
import {
  getSessions,
  adminReply,
  markRead,
  deleteSession,
  type ChatSession,
} from "@/lib/chat-store"
import { timeAgo } from "@/lib/utils"

export default function AdminMessages() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [reply, setReply] = useState("")
  const [search, setSearch] = useState("")
  const [view, setView] = useState<"list" | "chat">("list")
  const bottomRef = useRef<HTMLDivElement>(null)

  const sync = useCallback(() => {
    getSessions().then(setSessions).catch(() => {})
  }, [])

  useEffect(() => {
    sync()
    const t = setInterval(sync, 3000)
    return () => clearInterval(t)
  }, [sync])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selected, sessions])

  const open = async (id: string) => {
    setSelected(id)
    setView("chat")
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, read: true } : s)))
    await markRead(id)
    sync()
  }

  const send = async () => {
    if (!reply.trim() || !selected) return
    const text = reply.trim()
    setReply("")
    const updated = await adminReply(selected, text)
    if (updated) setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    sync()
  }

  const del = async (id: string) => {
    if (selected === id) {
      setSelected(null)
      setView("list")
    }
    setSessions((prev) => prev.filter((s) => s.id !== id))
    await deleteSession(id)
    sync()
  }

  const filtered = sessions
    .slice()
    .reverse()
    .filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()),
    )

  const current = sessions.find((s) => s.id === selected)

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`${view === "chat" ? "hidden" : "flex"} lg:flex flex-col w-full lg:w-80 flex-shrink-0`}
        style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h1 className="font-display text-base font-semibold text-white mb-3">Live Chat</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-white/25 outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-white/25 text-sm">No chat sessions yet</div>
          ) : (
            filtered.map((s) => (
              <button
                key={s.id}
                onClick={() => open(s.id)}
                className={`w-full flex items-start gap-3 px-4 py-4 hover:bg-white/4 transition-colors text-left ${
                  selected === s.id ? "bg-white/6" : ""
                }`}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
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
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-semibold text-white truncate">{s.name}</p>
                    <span className="text-[10px] text-white/25 flex-shrink-0 ml-2">{timeAgo(s.createdAt)}</span>
                  </div>
                  <p className="text-[11px] text-white/35 truncate">{s.topic}</p>
                  <p className="text-xs text-white/25 truncate mt-0.5">
                    {s.messages[s.messages.length - 1]?.text ?? "No messages"}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className={`${view === "list" ? "hidden" : "flex"} lg:flex flex-1 flex-col overflow-hidden`}>
        {!current ? (
          <div className="flex-1 flex items-center justify-center text-white/20 text-sm">Select a conversation</div>
        ) : (
          <>
            <div
              className="flex items-center gap-3 px-6 py-4 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setView("list")}>
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: "rgba(194,161,91,0.4)" }}
              >
                {current.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{current.name}</p>
                <p className="text-xs text-white/35 truncate">
                  {current.email} · {current.topic}
                </p>
              </div>
              <button onClick={sync} className="text-white/30 hover:text-white transition-colors">
                <RefreshCw className="h-4 w-4" />
              </button>
              <button onClick={() => del(current.id)} className="text-white/30 hover:text-red-400 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {current.messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "admin" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-[70%] px-4 py-2.5 text-sm leading-relaxed"
                    style={{
                      background: m.role === "admin" ? "var(--primary)" : "rgba(255,255,255,0.08)",
                      color: m.role === "admin" ? "#0B0F0D" : "rgba(255,255,255,0.88)",
                      borderRadius: m.role === "admin" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="p-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex gap-2">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                  placeholder="Type a reply..."
                  className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
                <button
                  onClick={send}
                  disabled={!reply.trim()}
                  className="px-4 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition disabled:opacity-40"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
