import { ensureSession, getSession } from "@/lib/repo"
import { HttpError, json, readJson, requireStr, serverError, str } from "@/lib/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = await readJson(req)
    const id = requireStr(body.id, "Session id", 80)
    const name = requireStr(body.name, "Name", 200)
    const email = requireStr(body.email, "Email", 200)
    const topic = str(body.topic, 200)

    await ensureSession({ id, name, email, topic })
    const session = await getSession(id)
    return json({ session }, 201)
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status)
    console.error("POST /api/chat/session", e)
    return serverError()
  }
}
