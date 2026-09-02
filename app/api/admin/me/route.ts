import { cookies } from "next/headers"
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session"
import { json } from "@/lib/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Middleware already gated this route; this just echoes the session identity.
export async function GET() {
  const jar = await cookies()
  const session = await verifySessionToken(jar.get(SESSION_COOKIE)?.value)
  if (!session) return json({ error: "Unauthorized" }, 401)
  return json({ user: { username: session.username } })
}
