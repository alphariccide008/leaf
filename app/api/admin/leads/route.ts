import { listLeads } from "@/lib/repo"
import { json, serverError } from "@/lib/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    return json({ leads: await listLeads() })
  } catch (e) {
    console.error("GET /api/admin/leads", e)
    return serverError()
  }
}
