import { deleteProduct, updateProduct } from "@/lib/repo"
import { parseProductDraft } from "@/lib/product-input"
import { HttpError, json, readJson, serverError } from "@/lib/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    await updateProduct(Number(id), parseProductDraft(await readJson(req)))
    return json({ ok: true })
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status)
    console.error("PATCH /api/admin/products/[id]", e)
    return serverError()
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    await deleteProduct(Number(id))
    return json({ ok: true })
  } catch (e) {
    console.error("DELETE /api/admin/products/[id]", e)
    return serverError()
  }
}
