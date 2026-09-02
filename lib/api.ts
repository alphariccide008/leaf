// Small typed fetch helper for client components.

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  })
  const data = res.status === 204 ? null : await res.json().catch(() => null)
  if (!res.ok) {
    throw new ApiError((data as { error?: string })?.error ?? `Request failed (${res.status})`, res.status)
  }
  return data as T
}

export const apiGet = <T>(url: string) => request<T>(url)
export const apiPost = <T>(url: string, body?: unknown) =>
  request<T>(url, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) })
export const apiPatch = <T>(url: string, body?: unknown) =>
  request<T>(url, { method: "PATCH", body: body === undefined ? undefined : JSON.stringify(body) })
export const apiDelete = <T>(url: string) => request<T>(url, { method: "DELETE" })
