"use client"

import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api"
import type { Product } from "@/lib/types"

export type { Product }
export { PRODUCT_CATEGORIES } from "@/lib/types"

export type ProductDraft = Omit<Product, "id" | "createdAt">

/** Public — list every published package (shop + homepage). */
export async function getProducts(): Promise<Product[]> {
  const { products } = await apiGet<{ products: Product[] }>("/api/products")
  return products
}

/** Admin — same data, via the guarded endpoint. */
export async function getProductsAdmin(): Promise<Product[]> {
  const { products } = await apiGet<{ products: Product[] }>("/api/admin/products")
  return products
}

export async function addProduct(draft: ProductDraft): Promise<Product> {
  const { product } = await apiPost<{ product: Product }>("/api/admin/products", draft)
  return product
}

export async function updateProduct(id: number, draft: ProductDraft): Promise<void> {
  await apiPatch(`/api/admin/products/${id}`, draft)
}

export async function deleteProduct(id: number): Promise<void> {
  await apiDelete(`/api/admin/products/${id}`)
}
