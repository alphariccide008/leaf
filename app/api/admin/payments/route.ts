import { createPayment, listPayments } from "@/lib/repo"
import type { PaymentMethod } from "@/lib/types"
import { PAYMENT_METHODS } from "@/lib/types"
import { HttpError, json, readJson, requireStr, serverError, str } from "@/lib/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    return json({ payments: await listPayments() })
  } catch (e) {
    console.error("GET /api/admin/payments", e)
    return serverError()
  }
}

// Admin can log a payment manually (e.g. a bank transfer that came in separately).
export async function POST(req: Request) {
  try {
    const body = await readJson(req)
    const name = requireStr(body.name, "Name", 200)
    const email = requireStr(body.email, "Email", 200)
    const amount = Number(body.amount)
    if (!Number.isFinite(amount) || amount <= 0) throw new HttpError("Enter an amount greater than 0")
    const method = str(body.method, 40)
    const payment = await createPayment({
      leadId: body.leadId ? Number(body.leadId) : null,
      name,
      email,
      amount: Math.round(amount * 100) / 100,
      method: (PAYMENT_METHODS.includes(method as PaymentMethod) ? method : "bank_transfer") as PaymentMethod,
      reference: str(body.reference, 120),
      note: str(body.note, 500),
    })
    return json({ payment }, 201)
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status)
    console.error("POST /api/admin/payments", e)
    return serverError()
  }
}
