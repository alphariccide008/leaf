import { deleteLead, updateLeadStatus } from "@/lib/repo"
import type { LeadStatus } from "@/lib/types"
import { HttpError, json, readJson, serverError } from "@/lib/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const STATUSES: LeadStatus[] = ["new", "contacted", "scheduled", "closed"]

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const body = await readJson(req)
    const status = body.status as LeadStatus
    if (!STATUSES.includes(status)) throw new HttpError("Invalid status")
    await updateLeadStatus(Number(id), status)
    return json({ ok: true })
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status)
    console.error("PATCH /api/admin/leads/[id]", e)
    return serverError()
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    await deleteLead(Number(id))
    return json({ ok: true })
  } catch (e) {
    console.error("DELETE /api/admin/leads/[id]", e)
    return serverError()
  }
}
