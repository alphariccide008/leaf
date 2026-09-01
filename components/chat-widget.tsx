"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { usePathname } from "next/navigation"
import { MessageCircle, X, Send, ChevronLeft, ArrowRight } from "lucide-react"
import {
  getOrCreateSession,
  pushClientMessage,
  pushAdminMessageToMine,
  getMyMessages,
  getMySessionId,
  type ChatMsg,
} from "@/lib/chat-store"

const topics = [
  "Wardrobe & Fashion Consulting",
  "Clothing Design",
  "Engineering Consulting",
  "Something else",
]

export function ChatWidget() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [screen, setScreen] = useState<"home" | "chat">("home")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [topic, setTopic] = useState(topics[0])
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [typing, setTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const [started, setStarted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const syncMessages = useCallback(() => {
    const msgs = getMyMessages()
    setMessages((prev) => {
      const prevAdmin = prev.filter((m) => m.role === "admin").length
      const nextAdmin = msgs.filter((m) => m.role === "admin").length
      if (!open && nextAdmin > prevAdmin) setUnread((u) => u + (nextAdmin - prevAdmin))
      return msgs
    })
  }, [open])

  useEffect(() => {
    // Resume an in-progress session on reload
    if (getMySessionId() && getMyMessages().length > 0) {
      setStarted(true)
      setScreen("chat")
      setMessages(getMyMessages())
    }
  }, [])

  useEffect(() => {
    if (!started) return
    pollRef.current = setInterval(syncMessages, 1500)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [started, syncMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  useEffect(() => {
    if (open) setUnread(0)
  }, [open])

  // Hide widget entirely inside the admin area
  if (pathname?.startsWith("/admin")) return null

  const startChat = () => {
    if (!name.trim() || !email.trim()) return
    getOrCreateSession(name.trim(), email.trim(), topic)
    setStarted(true)
    setScreen("chat")

    setTimeout(() => {
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        pushAdminMessageToMine(
          `Hi ${name.trim().split(" ")[0]} — welcome to OAKLEAF PARTNERS. Thanks for reaching out about ${topic.toLowerCase()}. How can we help?`,
        )
        syncMessages()
      }, 1300)
    }, 800)
  }

  const send = (text = input.trim()) => {
    if (!text) return
    pushClientMessage(text)
    setInput("")
    syncMessages()
    setTyping(true)
    setTimeout(() => setTyping(false), 1800)
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105"
        style={{ background: "var(--primary)" }}
      >
        {open ? <X className="h-5 w-5" style={{ color: "var(--primary-foreground)" }} /> : <MessageCircle className="h-5 w-5" style={{ color: "var(--primary-foreground)" }} />}
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      <div
        className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right ${
          open ? "scale-100 opacity-100 pointer-events-auto" : "scale-90 opacity-0 pointer-events-none"
        }`}
        style={{ background: "#0B0F0D", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {screen === "home" && (
          <div>
            <div
              className="relative px-6 pt-8 pb-10 overflow-hidden"
              style={{ background: "linear-gradient(135deg, var(--primary) 0%, #8A6F3C 100%)" }}
            >
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(255,255,255,0.15)" }}>
                  <MessageCircle className="h-5 w-5" style={{ color: "#0B0F0D" }} />
                </div>
                <h3 className="font-display text-lg font-semibold mb-1" style={{ color: "#0B0F0D" }}>
                  OAKLEAF Support
                </h3>
                <p className="text-xs" style={{ color: "rgba(11,15,13,0.6)" }}>
                  Usually replies within a few minutes
                </p>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">OAKLEAF Team</p>
                  <p className="text-[10px] text-white/35">Online now</p>
                </div>
              </div>

              <p className="text-xs text-white/50 mb-4">Enter your details to start the conversation:</p>

              <div className="space-y-3 mb-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email address"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onKeyDown={(e) => e.key === "Enter" && startChat()}
                />
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition"
                  style={{ background: "#141A16", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {topics.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={startChat}
                disabled={!name.trim() || !email.trim()}
                className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 hover:opacity-90"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                Start Chat <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {screen === "chat" && (
          <div className="flex flex-col h-[520px]">
            <div className="flex items-center gap-3 px-4 py-3" style={{ background: "var(--primary)" }}>
              <button onClick={() => setScreen("home")} style={{ color: "rgba(11,15,13,0.6)" }} className="hover:opacity-80 transition-opacity">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="w-8 h-8 rounded-full bg-black/15 flex items-center justify-center">
                <span className="text-xs font-bold" style={{ color: "#0B0F0D" }}>
                  OP
                </span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold" style={{ color: "#0B0F0D" }}>
                  OAKLEAF Team
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span className="text-[10px]" style={{ color: "rgba(11,15,13,0.6)" }}>
                    Online
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "client" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-[75%] px-4 py-2.5 text-xs leading-relaxed"
                    style={{
                      background: m.role === "client" ? "var(--primary)" : "rgba(255,255,255,0.08)",
                      color: m.role === "client" ? "#0B0F0D" : "rgba(255,255,255,0.85)",
                      borderRadius: m.role === "client" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div
                    className="flex items-center gap-1 px-4 py-3"
                    style={{ background: "rgba(255,255,255,0.08)", borderRadius: "16px 16px 16px 4px" }}
                  >
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
                        style={{ background: "var(--primary)", animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
                />
                <button
                  onClick={() => send()}
                  disabled={!input.trim()}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: "var(--primary)" }}
                  aria-label="Send"
                >
                  <Send className="h-3.5 w-3.5" style={{ color: "var(--primary-foreground)" }} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
