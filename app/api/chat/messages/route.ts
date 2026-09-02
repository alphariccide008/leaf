import { addMessage, getSession } from "@/lib/repo"
import { HttpError, json, readJson, requireStr, serverError } from "@/lib/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Client polls its own thread.
export async function GET(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get("sessionId")?.trim()
    if (!id) return json({ messages: [] })
    const session = await getSession(id)
    return json({ messages: session?.messages ?? [] })
  } catch (e) {
    console.error("GET /api/chat/messages", e)
    return serverError()
  }
}

// Client sends a message into its own thread.
export async function POST(req: Request) {
  try {
    const body = await readJson(req)
    const sessionId = requireStr(body.sessionId, "Session id", 80)
    const text = requireStr(body.text, "Message", 2000)

    const session = await getSession(sessionId)
    if (!session) throw new HttpError("Chat session not found", 404)

    await addMessage(sessionId, "client", text)
    const updated = await getSession(sessionId)
    return json({ messages: updated?.messages ?? [] }, 201)
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status)
    console.error("POST /api/chat/messages", e)
    return serverError()
  }
}
