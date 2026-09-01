# OAKLEAF PARTNERS LLC — Consulting & Design Website

A professional marketing site + admin console for OAKLEAF PARTNERS LLC, covering
wardrobe & fashion consulting, clothing design, and engineering consulting.

Design language and architecture are drawn from the BlackLine reference project
(Next.js 15 App Router, Tailwind, dark editorial aesthetic, single accent colour,
localStorage-backed admin, a live chat widget wired to the admin inbox).

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript
- Tailwind CSS 3
- lucide-react icons
- No backend yet — all admin data lives in `localStorage` (see below)

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Public site

| Route        | Purpose |
|--------------|---------|
| `/`          | Home — hero, company overview, services, approach, leadership, team carousel, contact form |
| `/about`     | Company overview, values, leadership (Cindy Kahn, CEO), team |
| `/services`  | The three service groups with full "what's included" lists |
| `/shop`      | Service & package catalogue (populated from the admin Products screen) |
| `/contact`   | Consultation request form (writes to the admin Consultations table) |

A **live chat widget** sits on every public page. Visitors enter their name,
email and topic; messages are stored and polled by the admin Live Chat screen.

## Admin console — `/admin`

Login: **`/admin/login`**

- Username: `admin`
- Password: `oakleaf@2026`

(Defined in `lib/auth.ts` — swap `verifyCredentials` for a real API call later.)

| Screen | What it does |
|--------|--------------|
| Dashboard | KPIs + recent consultation requests table + live chat feed |
| Consultations | Full table of contact-form submissions; open a request, change its status (new / contacted / scheduled / closed), delete |
| Products | Create / edit / delete packages, upload an image (file → data URL, or paste a URL), toggle **Featured** and **Available**. Published instantly to `/shop` |
| Live Chat | Two-pane inbox — read visitor messages and reply in real time (polling); replies appear in the visitor's chat widget |
| Settings | Admin profile + notification preferences (demo only) |

## localStorage keys

| Key | Contents |
|-----|----------|
| `oak_admin_auth` | `"true"` when signed in |
| `oak_products` | Product catalogue (`lib/products-store.ts`) |
| `oak_leads` | Consultation requests (`lib/leads-store.ts`) |
| `oak_live_chats` | Chat sessions + messages (`lib/chat-store.ts`) |
| `oak_chat_session_id` | (sessionStorage) current visitor's chat session |

Clearing these in the browser resets the app to its seeded demo data.

## Replacing localStorage with a backend

Each store module (`lib/*-store.ts`) exposes plain functions
(`getProducts`, `addLead`, `adminReply`, …). Swap their bodies for `fetch`
calls to your API and the UI needs no changes.
