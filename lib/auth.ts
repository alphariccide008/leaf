"use client"

/**
 * LocalStorage-backed admin auth.
 * Phase 1: credentials checked client-side. A real backend can replace
 * `verifyCredentials` and the token handling later without touching the UI.
 */

export const AUTH_KEY = "oak_admin_auth"

const ADMIN_USER = "admin"
const ADMIN_PASS = "oakleaf@2026"

export function verifyCredentials(username: string, password: string): boolean {
  return username.trim().toLowerCase() === ADMIN_USER && password === ADMIN_PASS
}

export function login(): void {
  localStorage.setItem(AUTH_KEY, "true")
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY)
}

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(AUTH_KEY) === "true"
}
