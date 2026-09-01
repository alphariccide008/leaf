export type ChatMsg = { role: "client" | "admin"; text: string; ts: number }

export type ChatSession = {
  id: string
  name: string
  email: string
  topic: string
  messages: ChatMsg[]
  createdAt: number
  read: boolean
}

const SESSIONS_KEY = "oak_live_chats"
const SESSION_ID_KEY = "oak_chat_session_id"

export function getSessions(): ChatSession[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY) ?? "[]")
  } catch {
    return []
  }
}

export function saveSessions(s: ChatSession[]): void {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(s))
}

export function unreadCount(): number {
  return getSessions().filter((s) => !s.read).length
}

/* ---- client-side helpers (chat widget) ---- */

export function getMySessionId(): string {
  return sessionStorage.getItem(SESSION_ID_KEY) ?? ""
}

export function getOrCreateSession(name: string, email: string, topic: string): ChatSession {
  const id = getMySessionId()
  const all = getSessions()
  const existing = all.find((s) => s.id === id)
  if (existing) return existing

  const newId = `oak_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  sessionStorage.setItem(SESSION_ID_KEY, newId)
  const s: ChatSession = {
    id: newId,
    name,
    email,
    topic,
    messages: [],
    createdAt: Date.now(),
    read: false,
  }
  saveSessions([...all, s])
  return s
}

export function pushClientMessage(text: string): void {
  const id = getMySessionId()
  const all = getSessions()
  const idx = all.findIndex((s) => s.id === id)
  if (idx < 0) return
  all[idx].messages.push({ role: "client", text, ts: Date.now() })
  all[idx].read = false
  saveSessions(all)
}

export function pushAdminMessageToMine(text: string): void {
  const id = getMySessionId()
  const all = getSessions()
  const idx = all.findIndex((s) => s.id === id)
  if (idx < 0) return
  all[idx].messages.push({ role: "admin", text, ts: Date.now() })
  saveSessions(all)
}

export function getMyMessages(): ChatMsg[] {
  const id = getMySessionId()
  return getSessions().find((s) => s.id === id)?.messages ?? []
}

/* ---- admin-side helpers ---- */

export function markRead(id: string): void {
  const all = getSessions()
  const idx = all.findIndex((s) => s.id === id)
  if (idx >= 0) {
    all[idx].read = true
    saveSessions(all)
  }
}

export function adminReply(id: string, text: string): void {
  const all = getSessions()
  const idx = all.findIndex((s) => s.id === id)
  if (idx >= 0) {
    all[idx].messages.push({ role: "admin", text, ts: Date.now() })
    all[idx].read = true
    saveSessions(all)
  }
}

export function deleteSession(id: string): void {
  saveSessions(getSessions().filter((s) => s.id !== id))
}
