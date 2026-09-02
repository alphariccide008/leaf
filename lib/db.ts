import "server-only"
import { Pool, type QueryResultRow } from "pg"

/**
 * Single shared pg Pool. On Vercel each serverless instance keeps a tiny pool
 * against the Supabase transaction pooler (port 6543), which is built for this.
 */
declare global {
  // eslint-disable-next-line no-var
  var __oakPool: Pool | undefined
}

function makePool() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local (see .env.example).")
  }
  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  })
}

export const pool: Pool = global.__oakPool ?? makePool()
if (process.env.NODE_ENV !== "production") global.__oakPool = pool

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const res = await pool.query<T>(text, params as never)
  return res.rows
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] ?? null
}
