import { listSessionsWithMessages } from "@/lib/repo"
import { json, serverError } from "@/lib/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    return json({ sessions: await listSessionsWithMessages() })
  } catch (e) {
    console.error("GET /api/admin/chat", e)
    return serverError()
  }
}
