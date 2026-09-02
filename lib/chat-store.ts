"use client"

import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api"
import type { ChatMsg, ChatSession } from "@/lib/types"

export type { ChatMsg, ChatSession }

const SESSION_ID_KEY = "oak_chat_session_id"

/* ---------------- client-side (chat widget) ---------------- */

export function getMySessionId(): string {
  if (typeof window === "undefined") return ""
  return sessionStorage.getItem(SESSION_ID_KEY) ?? ""
}

function newSessionId(): string {
  return `oak_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export async function startSession(name: string, email: string, topic: string): Promise<ChatSession> {
  let id = getMySessionId()
  if (!id) {
    id = newSessionId()
    sessionStorage.setItem(SESSION_ID_KEY, id)
  }
  const { session } = await apiPost<{ session: ChatSession }>("/api/chat/session", { id, name, email, topic })
  return session
}

export async function pushClientMessage(text: string): Promise<ChatMsg[]> {
  const sessionId = getMySessionId()
  if (!sessionId) return []
  const { messages } = await apiPost<{ messages: ChatMsg[] }>("/api/chat/messages", { sessionId, text })
  return messages
}

export async function getMyMessages(): Promise<ChatMsg[]> {
  const sessionId = getMySessionId()
  if (!sessionId) return []
  const { messages } = await apiGet<{ messages: ChatMsg[] }>(
    `/api/chat/messages?sessionId=${encodeURIComponent(sessionId)}`,
  )
  return messages
}

/* ---------------------- admin-side ---------------------- */

export async function getSessions(): Promise<ChatSession[]> {
  const { sessions } = await apiGet<{ sessions: ChatSession[] }>("/api/admin/chat")
  return sessions
}

export async function adminReply(id: string, text: string): Promise<ChatSession | null> {
  const { session } = await apiPost<{ session: ChatSession | null }>(`/api/admin/chat/${id}`, { text })
  return session
}

export async function markRead(id: string): Promise<void> {
  await apiPatch(`/api/admin/chat/${id}`)
}

export async function deleteSession(id: string): Promise<void> {
  await apiDelete(`/api/admin/chat/${id}`)
}
