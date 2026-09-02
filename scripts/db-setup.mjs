// Creates the schema, seeds demo data, and upserts the admin user.
// Run: npm run db:setup   (loads .env.local via --env-file)

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import pg from "pg"
import bcrypt from "bcryptjs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbDir = join(__dirname, "..", "db")

const connectionString =
  process.env.DATABASE_URL_SESSION || process.env.DATABASE_URL
if (!connectionString) {
  console.error("Missing DATABASE_URL_SESSION / DATABASE_URL. Copy .env.example to .env.local.")
  process.exit(1)
}

const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } })

async function run() {
  await client.connect()
  console.log("connected")

  const schema = readFileSync(join(dbDir, "schema.sql"), "utf8")
  await client.query(schema)
  console.log("schema applied")

  const seed = readFileSync(join(dbDir, "seed.sql"), "utf8")
  await client.query(seed)
  console.log("seed applied")

  const username = process.env.ADMIN_USERNAME || "supaadmin"
  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    console.warn("ADMIN_PASSWORD not set — skipping admin user upsert")
  } else {
    const hash = await bcrypt.hash(password, 12)
    await client.query(
      `insert into admin_users (username, password_hash, display_name, email)
       values ($1, $2, 'OAKLEAF Admin', 'info@oakleafpartnersconsulting.com')
       on conflict (username) do update set password_hash = excluded.password_hash`,
      [username, hash],
    )
    console.log(`admin user "${username}" ready`)
  }

  const counts = await client.query(`
    select
      (select count(*) from leads) as leads,
      (select count(*) from payments) as payments,
      (select count(*) from products) as products,
      (select count(*) from chat_sessions) as chat_sessions,
      (select count(*) from admin_users) as admins
  `)
  console.table(counts.rows[0])

  await client.end()
  console.log("done")
}

run().catch((e) => {
  console.error("setup failed:", e.message)
  process.exit(1)
})
