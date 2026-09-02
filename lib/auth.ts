"use client"

import { apiGet, apiPost } from "@/lib/api"

/** Server-backed admin auth. The session lives in an httpOnly cookie. */

export async function login(username: string, password: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await apiPost("/api/admin/login", { username, password })
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Login failed" }
  }
}

export async function logout(): Promise<void> {
  try {
    await apiPost("/api/admin/logout")
  } catch {
    /* ignore */
  }
}

export async function isAuthed(): Promise<boolean> {
  try {
    await apiGet("/api/admin/me")
    return true
  } catch {
    return false
  }
}
