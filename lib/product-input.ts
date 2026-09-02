import type { Product } from "@/lib/types"
import { requireStr, str } from "@/lib/http"

export function parseProductDraft(body: Record<string, unknown>): Omit<Product, "id" | "createdAt"> {
  const name = requireStr(body.name, "Name", 200)
  const description = requireStr(body.description, "Description", 4000)
  const image = requireStr(body.image, "Image", 2_000_000)
  const price = Number(body.price)
  return {
    name,
    category: str(body.category, 120) || "Style Package",
    price: Number.isFinite(price) && price > 0 ? Math.round(price * 100) / 100 : 0,
    description,
    image,
    featured: Boolean(body.featured),
    inStock: body.inStock === undefined ? true : Boolean(body.inStock),
  }
}
