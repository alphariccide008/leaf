import { listProducts } from "@/lib/repo"
import { json, serverError } from "@/lib/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Public: every product is shown on the shop; the client filters featured itself.
export async function GET() {
  try {
    return json({ products: await listProducts() })
  } catch (e) {
    console.error("GET /api/products", e)
    return serverError()
  }
}
