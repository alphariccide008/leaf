import { NextResponse } from "next/server"

export const json = <T>(data: T, init?: number | ResponseInit) =>
  NextResponse.json(data, typeof init === "number" ? { status: init } : init)

export const badRequest = (message: string) => json({ error: message }, 400)
export const serverError = (message = "Something went wrong") => json({ error: message }, 500)

export function str(v: unknown, max = 5000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : ""
}

export function requireStr(v: unknown, field: string, max = 5000): string {
  const s = str(v, max)
  if (!s) throw new HttpError(`${field} is required`)
  return s
}

export class HttpError extends Error {
  constructor(message: string, public status = 400) {
    super(message)
  }
}

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const body = await req.json()
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}
