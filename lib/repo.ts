import "server-only"
import { query, queryOne } from "@/lib/db"
import type {
  ChatMsg,
  ChatSession,
  Lead,
  LeadStatus,
  Payment,
  PaymentMethod,
  PaymentStatus,
  Product,
} from "@/lib/types"

const ts = (v: unknown) => new Date(v as string).getTime()
const num = (v: unknown) => (v == null ? 0 : Number(v))

/* ----------------------------- leads ----------------------------- */

interface LeadRow {
  id: number; name: string; email: string; phone: string; service: string
  message: string; status: LeadStatus; created_at: string; paid_amount: string | null
}

const mapLead = (r: LeadRow): Lead => ({
  id: Number(r.id),
  name: r.name,
  email: r.email,
  phone: r.phone,
  service: r.service,
  message: r.message,
  status: r.status,
  createdAt: ts(r.created_at),
  paidAmount: num(r.paid_amount),
})

const LEAD_SELECT = `
  select l.*, coalesce((
    select sum(p.amount) from payments p
    where p.lead_id = l.id and p.status <> 'refunded'
  ), 0) as paid_amount
  from leads l
`

export async function listLeads(): Promise<Lead[]> {
  const rows = await query<LeadRow>(`${LEAD_SELECT} order by l.created_at desc`)
  return rows.map(mapLead)
}

export async function createLead(input: {
  name: string; email: string; phone?: string; service?: string; message?: string
}): Promise<Lead> {
  const row = await queryOne<LeadRow>(
    `with ins as (
       insert into leads (name, email, phone, service, message)
       values ($1, $2, $3, $4, $5) returning *
     )
     select ins.*, 0 as paid_amount from ins`,
    [
      input.name,
      input.email,
      input.phone ?? "",
      input.service ?? "General Enquiry",
      input.message ?? "",
    ],
  )
  return mapLead(row!)
}

export async function updateLeadStatus(id: number, status: LeadStatus): Promise<void> {
  await query(`update leads set status = $2 where id = $1`, [id, status])
}

export async function deleteLead(id: number): Promise<void> {
  await query(`delete from leads where id = $1`, [id])
}

/* ---------------------------- payments ---------------------------- */

interface PaymentRow {
  id: number; lead_id: number | null; name: string; email: string; amount: string
  method: PaymentMethod; reference: string; status: PaymentStatus; note: string; created_at: string
}

const mapPayment = (r: PaymentRow): Payment => ({
  id: Number(r.id),
  leadId: r.lead_id == null ? null : Number(r.lead_id),
  name: r.name,
  email: r.email,
  amount: num(r.amount),
  method: r.method,
  reference: r.reference,
  status: r.status,
  note: r.note,
  createdAt: ts(r.created_at),
})

export async function listPayments(): Promise<Payment[]> {
  const rows = await query<PaymentRow>(`select * from payments order by created_at desc`)
  return rows.map(mapPayment)
}

export async function createPayment(input: {
  leadId?: number | null; name: string; email: string; amount: number
  method?: PaymentMethod; reference?: string; note?: string
}): Promise<Payment> {
  const row = await queryOne<PaymentRow>(
    `insert into payments (lead_id, name, email, amount, method, reference, note)
     values ($1, $2, $3, $4, $5, $6, $7) returning *`,
    [
      input.leadId ?? null,
      input.name,
      input.email,
      input.amount,
      input.method ?? "bank_transfer",
      input.reference ?? "",
      input.note ?? "",
    ],
  )
  return mapPayment(row!)
}

export async function updatePayment(
  id: number,
  patch: { status?: PaymentStatus; note?: string },
): Promise<void> {
  const sets: string[] = []
  const vals: unknown[] = [id]
  if (patch.status !== undefined) { sets.push(`status = $${vals.push(patch.status)}`) }
  if (patch.note !== undefined) { sets.push(`note = $${vals.push(patch.note)}`) }
  if (!sets.length) return
  await query(`update payments set ${sets.join(", ")} where id = $1`, vals)
}

/* ---------------------------- products ---------------------------- */

interface ProductRow {
  id: number; name: string; category: string; price: string; description: string
  image: string; featured: boolean; in_stock: boolean; created_at: string
}

const mapProduct = (r: ProductRow): Product => ({
  id: Number(r.id),
  name: r.name,
  category: r.category,
  price: num(r.price),
  description: r.description,
  image: r.image,
  featured: r.featured,
  inStock: r.in_stock,
  createdAt: ts(r.created_at),
})

export async function listProducts(): Promise<Product[]> {
  const rows = await query<ProductRow>(`select * from products order by created_at desc`)
  return rows.map(mapProduct)
}

export async function createProduct(input: Omit<Product, "id" | "createdAt">): Promise<Product> {
  const row = await queryOne<ProductRow>(
    `insert into products (name, category, price, description, image, featured, in_stock)
     values ($1, $2, $3, $4, $5, $6, $7) returning *`,
    [input.name, input.category, input.price, input.description, input.image, input.featured, input.inStock],
  )
  return mapProduct(row!)
}

export async function updateProduct(id: number, input: Omit<Product, "id" | "createdAt">): Promise<void> {
  await query(
    `update products set name=$2, category=$3, price=$4, description=$5, image=$6, featured=$7, in_stock=$8
     where id=$1`,
    [id, input.name, input.category, input.price, input.description, input.image, input.featured, input.inStock],
  )
}

export async function deleteProduct(id: number): Promise<void> {
  await query(`delete from products where id = $1`, [id])
}

/* ------------------------------ chat ------------------------------ */

interface SessionRow {
  id: string; name: string; email: string; topic: string; read: boolean; created_at: string
}
interface MessageRow { session_id: string; role: ChatMsg["role"]; body: string; created_at: string }

const mapMsg = (r: MessageRow): ChatMsg => ({ role: r.role, text: r.body, ts: ts(r.created_at) })

async function messagesFor(sessionIds: string[]): Promise<Record<string, ChatMsg[]>> {
  if (!sessionIds.length) return {}
  const rows = await query<MessageRow>(
    `select * from chat_messages where session_id = any($1::text[]) order by created_at asc`,
    [sessionIds],
  )
  const out: Record<string, ChatMsg[]> = {}
  for (const r of rows) (out[r.session_id] ??= []).push(mapMsg(r))
  return out
}

export async function listSessionsWithMessages(): Promise<ChatSession[]> {
  const sessions = await query<SessionRow>(`select * from chat_sessions order by created_at asc`)
  const msgs = await messagesFor(sessions.map((s) => s.id))
  return sessions.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    topic: s.topic,
    read: s.read,
    createdAt: ts(s.created_at),
    messages: msgs[s.id] ?? [],
  }))
}

export async function getSession(id: string): Promise<ChatSession | null> {
  const s = await queryOne<SessionRow>(`select * from chat_sessions where id = $1`, [id])
  if (!s) return null
  const msgs = await messagesFor([id])
  return {
    id: s.id, name: s.name, email: s.email, topic: s.topic, read: s.read,
    createdAt: ts(s.created_at), messages: msgs[id] ?? [],
  }
}

export async function ensureSession(input: {
  id: string; name: string; email: string; topic: string
}): Promise<{ created: boolean }> {
  const row = await queryOne<{ id: string }>(
    `insert into chat_sessions (id, name, email, topic)
     values ($1, $2, $3, $4)
     on conflict (id) do nothing
     returning id`,
    [input.id, input.name, input.email, input.topic],
  )
  const created = !!row
  if (created) {
    const first = input.name.trim().split(" ")[0] || "there"
    const topic = input.topic ? input.topic.toLowerCase() : "your enquiry"
    await query(
      `insert into chat_messages (session_id, role, body) values ($1, 'admin', $2)`,
      [input.id, `Hi ${first} — welcome to OAKLEAF PARTNERS. Thanks for reaching out about ${topic}. How can we help?`],
    )
    // keep it flagged unread so the admin notices the new visitor
    await query(`update chat_sessions set read = false where id = $1`, [input.id])
  }
  return { created }
}

export async function addMessage(sessionId: string, role: ChatMsg["role"], text: string): Promise<void> {
  await query(`insert into chat_messages (session_id, role, body) values ($1, $2, $3)`, [sessionId, role, text])
  // A client message marks the thread unread for the admin; an admin reply marks it read.
  await query(`update chat_sessions set read = $2 where id = $1`, [sessionId, role === "admin"])
}

export async function markSessionRead(id: string): Promise<void> {
  await query(`update chat_sessions set read = true where id = $1`, [id])
}

export async function deleteSession(id: string): Promise<void> {
  await query(`delete from chat_sessions where id = $1`, [id])
}

/* ------------------------------ admin ----------------------------- */

export interface AdminRow {
  id: string
  username: string
  password_hash: string
  display_name: string
  email: string | null
}

export async function findAdminByUsername(username: string): Promise<AdminRow | null> {
  return queryOne<AdminRow>(`select * from admin_users where lower(username) = lower($1)`, [username])
}
