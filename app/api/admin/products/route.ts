import { createProduct, listProducts } from "@/lib/repo"
import { parseProductDraft } from "@/lib/product-input"
import { HttpError, json, readJson, serverError } from "@/lib/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    return json({ products: await listProducts() })
  } catch (e) {
    console.error("GET /api/admin/products", e)
    return serverError()
  }
}

export async function POST(req: Request) {
  try {
    const product = await createProduct(parseProductDraft(await readJson(req)))
    return json({ product }, 201)
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status)
    console.error("POST /api/admin/products", e)
    return serverError()
  }
}
