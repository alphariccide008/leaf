import { cookies } from "next/headers"
import { SESSION_COOKIE } from "@/lib/session"
import { json } from "@/lib/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST() {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
  return json({ ok: true })
}
