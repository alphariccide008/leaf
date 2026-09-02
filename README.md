# OAKLEAF PARTNERS LLC — Consulting & Design Website

A professional marketing site + admin console for OAKLEAF PARTNERS LLC, covering
wardrobe & fashion consulting, clothing design, and engineering consulting.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript
- Tailwind CSS 3 · lucide-react icons
- **Supabase Postgres** backend, accessed from Next.js Route Handlers via `pg`
- Admin auth: bcrypt-hashed credential in the DB + an httpOnly JWT session cookie (`jose`), enforced in `middleware.ts`

## Setup

```bash
npm install
cp .env.example .env.local     # then fill in the values
npm run db:setup               # creates tables, seeds demo data, creates the admin user
npm run dev                    # http://localhost:3000
```

### Environment variables

| Var | Purpose |
|-----|---------|
| `DATABASE_URL` | Supabase **transaction pooler** string (port `6543`). Used by the app at runtime. |
| `DATABASE_URL_SESSION` | Supabase **session pooler** string (port `5432`). Used only by `npm run db:setup`. |
| `ADMIN_SESSION_SECRET` | Random 32+ byte hex. Signs the admin session cookie; change it to force re-login. |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Seed admin login, applied by `npm run db:setup`. |

> **Why the pooler?** The direct host `db.<ref>.supabase.co` is IPv6-only and does
> not resolve from Vercel or most machines. Always use the pooler hostname
> (`aws-0-<region>.pooler.supabase.com`) with user `postgres.<project-ref>`.
> URL-encode `$` in the password as `%24`. Do **not** put `?sslmode=require` in the
> string — recent `pg` reads that as `verify-full` and rejects Supabase's chain;
> TLS is already enabled in code via `ssl: { rejectUnauthorized: false }`.

### Deploying to Vercel

1. Add `DATABASE_URL`, `ADMIN_SESSION_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`
   in **Project Settings → Environment Variables** (all environments).
2. Run `npm run db:setup` once locally (or from a machine with `DATABASE_URL_SESSION`)
   to migrate + seed the database.
3. Deploy. Route handlers run on the Node.js runtime; `pg` is listed in
   `serverExternalPackages`.

To rotate the admin password: change `ADMIN_PASSWORD`, re-run `npm run db:setup`.

## Public site

| Route | Purpose |
|-------|---------|
| `/` | Home — hero, overview, services, approach, leadership, team, contact form |
| `/about` | Company overview, values, leadership, team |
| `/services` | The three service groups with full "what's included" lists |
| `/shop` | Package catalogue — served from the `products` table |
| `/contact` | Consultation request form. Optionally records a **payment / deposit** with the request. |

A **live chat widget** sits on every public page. Sessions and messages are stored
in Postgres (`chat_sessions`, `chat_messages`) and polled by the admin Live Chat screen.

## Admin console — `/admin`

Login at `/admin/login` with `ADMIN_USERNAME` / `ADMIN_PASSWORD`.

| Screen | What it does |
|--------|--------------|
| Dashboard | KPIs (requests, payments + revenue, chats, products), recent payments, recent requests, live chat feed |
| Consultations | Every contact-form submission; open one, change status (new / contacted / scheduled / closed), delete. Shows any payment recorded against it. |
| Payments | Every payment sent through the contact form, plus **Record Payment** for money that arrived out of band. Mark `pending → received → refunded`. |
| Products | Create / edit / delete packages, image upload (file → data URL or paste URL), toggle Featured / Available. Published instantly to `/shop`. |
| Live Chat | Two-pane inbox — read visitor messages and reply (polling). |
| Settings | Admin profile + notification preferences (display only). |

## Data model

| Table | Contents |
|-------|----------|
| `admin_users` | Panel logins (bcrypt `password_hash`) |
| `leads` | Consultation requests |
| `payments` | Money sent with a request (`lead_id`) or logged manually |
| `products` | `/shop` catalogue |
| `chat_sessions` / `chat_messages` | Live chat |

Schema lives in `db/schema.sql`, demo rows in `db/seed.sql` (both idempotent).

## API surface

Public: `POST /api/leads`, `GET /api/products`, `POST /api/chat/session`,
`GET|POST /api/chat/messages`.

Admin (cookie-gated by `middleware.ts`): `POST /api/admin/login|logout`,
`GET /api/admin/me|stats`, `GET|PATCH|DELETE /api/admin/leads[/:id]`,
`GET|POST|PATCH /api/admin/payments[/:id]`,
`GET|POST|PATCH|DELETE /api/admin/products[/:id]`,
`GET /api/admin/chat`, `PATCH|POST|DELETE /api/admin/chat/:id`.

Client components talk to these through the `lib/*-store.ts` modules.
