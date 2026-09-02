import { updatePayment } from "@/lib/repo"
import type { PaymentStatus } from "@/lib/types"
import { HttpError, json, readJson, serverError, str } from "@/lib/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const STATUSES: PaymentStatus[] = ["pending", "received", "refunded"]

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const body = await readJson(req)
    const patch: { status?: PaymentStatus; note?: string } = {}
    if (body.status !== undefined) {
      if (!STATUSES.includes(body.status as PaymentStatus)) throw new HttpError("Invalid status")
      patch.status = body.status as PaymentStatus
    }
    if (body.note !== undefined) patch.note = str(body.note, 500)
    await updatePayment(Number(id), patch)
    return json({ ok: true })
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status)
    console.error("PATCH /api/admin/payments/[id]", e)
    return serverError()
  }
}
