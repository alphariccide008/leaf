// Canonical shared types. Client-safe (no server imports).

export type LeadStatus = "new" | "contacted" | "scheduled" | "closed"

export interface Lead {
  id: number
  name: string
  email: string
  phone: string
  service: string
  message: string
  status: LeadStatus
  createdAt: number
  /** Total payments recorded against this request, if any. */
  paidAmount?: number
}

export type PaymentStatus = "pending" | "received" | "refunded"
export type PaymentMethod = "bank_transfer" | "card" | "cash" | "other"

export interface Payment {
  id: number
  leadId: number | null
  name: string
  email: string
  amount: number
  method: PaymentMethod
  reference: string
  status: PaymentStatus
  note: string
  createdAt: number
}

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

export type ChatRole = "client" | "admin"

export interface ChatMsg {
  role: ChatRole
  text: string
  ts: number
}

export interface ChatSession {
  id: string
  name: string
  email: string
  topic: string
  messages: ChatMsg[]
  createdAt: number
  read: boolean
}

export const LEAD_SERVICES = [
  "Wardrobe & Fashion Consulting",
  "Clothing Design",
  "Engineering Consulting",
  "General Enquiry",
] as const

export const PRODUCT_CATEGORIES = [
  "Wardrobe Consulting",
  "Clothing Design",
  "Style Package",
  "Engineering Advisory",
  "Capsule Collection",
] as const

export const PAYMENT_METHODS: PaymentMethod[] = ["bank_transfer", "card", "cash", "other"]
