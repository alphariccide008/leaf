export interface Product {
  id: number
  name: string
  category: string
  price: number
  description: string
  image: string
  featured: boolean
  inStock: boolean
  createdAt: number
}

export const PRODUCT_CATEGORIES = [
  "Wardrobe Consulting",
  "Clothing Design",
  "Style Package",
  "Engineering Advisory",
  "Capsule Collection",
]

const KEY = "oak_products"

const SEED: Product[] = [
  {
    id: 1,
    name: "Signature Wardrobe Audit",
    category: "Wardrobe Consulting",
    price: 850,
    description:
      "A full assessment of your existing wardrobe with a tailored edit, gap analysis, and a season-ready styling plan built around your lifestyle.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80&auto=format&fit=crop",
    featured: true,
    inStock: true,
    createdAt: Date.now() - 86400000 * 9,
  },
  {
    id: 2,
    name: "Bespoke Evening Piece",
    category: "Clothing Design",
    price: 2400,
    description:
      "Custom-designed occasion wear developed from concept sketches to final fitting, cut to your measurements and personal aesthetic.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=80&auto=format&fit=crop",
    featured: true,
    inStock: true,
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: 3,
    name: "Executive Image Package",
    category: "Style Package",
    price: 1600,
    description:
      "Image and style consulting for leaders and public-facing professionals: colour analysis, silhouette guidance, and a curated shopping list.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80&auto=format&fit=crop",
    featured: true,
    inStock: true,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 4,
    name: "Capsule Collection Concept",
    category: "Clothing Design",
    price: 3200,
    description:
      "A cohesive 12-piece capsule wardrobe designed and specified for production, including fabric direction and a full tech pack.",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80&auto=format&fit=crop",
    featured: false,
    inStock: true,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 5,
    name: "Engineering Project Review",
    category: "Engineering Advisory",
    price: 1950,
    description:
      "Independent technical review of an engineering project scope, feasibility, and execution plan with a written advisory report.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900&q=80&auto=format&fit=crop",
    featured: false,
    inStock: true,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 6,
    name: "Seasonal Styling Retainer",
    category: "Style Package",
    price: 4500,
    description:
      "Ongoing quarterly styling support: seasonal refreshes, event dressing, and priority access to your consultant throughout the year.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&q=80&auto=format&fit=crop",
    featured: false,
    inStock: true,
    createdAt: Date.now() - 86400000,
  },
]

export function getProducts(): Product[] {
  if (typeof window === "undefined") return SEED
  try {
    const stored = localStorage.getItem(KEY)
    if (!stored) {
      localStorage.setItem(KEY, JSON.stringify(SEED))
      return SEED
    }
    return JSON.parse(stored)
  } catch {
    return SEED
  }
}

export function saveProducts(data: Product[]): void {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function addProduct(p: Omit<Product, "id" | "createdAt">): Product {
  const all = getProducts()
  const next: Product = { ...p, id: Date.now(), createdAt: Date.now() }
  saveProducts([next, ...all])
  return next
}

export function updateProduct(updated: Product): void {
  saveProducts(getProducts().map((p) => (p.id === updated.id ? updated : p)))
}

export function deleteProduct(id: number): void {
  saveProducts(getProducts().filter((p) => p.id !== id))
}
