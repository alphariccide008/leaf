import { SignJWT, jwtVerify } from "jose"

export const SESSION_COOKIE = "oak_admin_session"
const MAX_AGE_SECONDS = 60 * 60 * 12 // 12 hours

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET
  if (!s) throw new Error("ADMIN_SESSION_SECRET is not set.")
  return new TextEncoder().encode(s)
}

export interface SessionPayload {
  sub: string // admin user id
  username: string
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ username: payload.username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret())
}

export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret())
    if (!payload.sub || typeof payload.username !== "string") return null
    return { sub: payload.sub, username: payload.username }
  } catch {
    return null
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE_SECONDS,
}
