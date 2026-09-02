import { query } from "@/lib/db"
import { json, serverError } from "@/lib/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const [row] = await query<{
      leads_total: string; leads_new: string
      products_total: string; products_featured: string
      chats_total: string; chats_unread: string
      payments_total: string; payments_pending: string
      revenue_received: string | null; revenue_pending: string | null
    }>(`
      select
        (select count(*) from leads) as leads_total,
        (select count(*) from leads where status = 'new') as leads_new,
        (select count(*) from products) as products_total,
        (select count(*) from products where featured) as products_featured,
        (select count(*) from chat_sessions) as chats_total,
        (select count(*) from chat_sessions where not read) as chats_unread,
        (select count(*) from payments) as payments_total,
        (select count(*) from payments where status = 'pending') as payments_pending,
        (select coalesce(sum(amount), 0) from payments where status = 'received') as revenue_received,
        (select coalesce(sum(amount), 0) from payments where status = 'pending') as revenue_pending
    `)

    return json({
      leads: { total: +row.leads_total, new: +row.leads_new },
      products: { total: +row.products_total, featured: +row.products_featured },
      chats: { total: +row.chats_total, unread: +row.chats_unread },
      payments: {
        total: +row.payments_total,
        pending: +row.payments_pending,
        revenueReceived: Number(row.revenue_received ?? 0),
        revenuePending: Number(row.revenue_pending ?? 0),
      },
    })
  } catch (e) {
    console.error("GET /api/admin/stats", e)
    return serverError()
  }
}
