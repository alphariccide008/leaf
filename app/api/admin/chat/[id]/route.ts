import { addMessage, deleteSession, getSession, markSessionRead } from "@/lib/repo"
import { HttpError, json, readJson, requireStr, serverError } from "@/lib/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// PATCH = mark read, POST = admin reply, DELETE = remove session
export async function PATCH(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    await markSessionRead(id)
    return json({ ok: true })
  } catch (e) {
    console.error("PATCH /api/admin/chat/[id]", e)
    return serverError()
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const body = await readJson(req)
    const text = requireStr(body.text, "Reply", 2000)
    const session = await getSession(id)
    if (!session) throw new HttpError("Chat session not found", 404)
    await addMessage(id, "admin", text)
    const updated = await getSession(id)
    return json({ session: updated }, 201)
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status)
    console.error("POST /api/admin/chat/[id]", e)
    return serverError()
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    await deleteSession(id)
    return json({ ok: true })
  } catch (e) {
    console.error("DELETE /api/admin/chat/[id]", e)
    return serverError()
  }
}
