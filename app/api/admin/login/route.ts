import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { findAdminByUsername } from "@/lib/repo"
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session"
import { HttpError, json, readJson, requireStr, serverError } from "@/lib/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = await readJson(req)
    const username = requireStr(body.username, "Username", 120)
    const password = requireStr(body.password, "Password", 200)

    const admin = await findAdminByUsername(username)
    const ok = admin ? await bcrypt.compare(password, admin.password_hash) : false
    if (!admin || !ok) throw new HttpError("Invalid username or password", 401)

    const token = await createSessionToken({ sub: admin.id, username: admin.username })
    const jar = await cookies()
    jar.set(SESSION_COOKIE, token, sessionCookieOptions)

    return json({ user: { username: admin.username, displayName: admin.display_name } })
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status)
    console.error("POST /api/admin/login", e)
    return serverError()
  }
}
