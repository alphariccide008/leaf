import { createLead, createPayment } from "@/lib/repo"
import { HttpError, json, readJson, requireStr, serverError, str } from "@/lib/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const body = await readJson(req)
    const name = requireStr(body.name, "Name", 200)
    const email = requireStr(body.email, "Email", 200)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError("Enter a valid email address")

    const lead = await createLead({
      name,
      email,
      phone: str(body.phone, 60),
      service: str(body.service, 120) || "General Enquiry",
      message: str(body.message, 4000),
    })

    const amount = Number(body.amount)
    let payment = null
    if (Number.isFinite(amount) && amount > 0) {
      payment = await createPayment({
        leadId: lead.id,
        name,
        email,
        amount: Math.round(amount * 100) / 100,
        method: (str(body.paymentMethod, 40) as never) || "bank_transfer",
        reference: str(body.paymentReference, 120),
      })
    }

    return json({ lead, payment }, 201)
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status)
    console.error("POST /api/leads", e)
    return serverError()
  }
}
