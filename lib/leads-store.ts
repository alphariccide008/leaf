export type LeadStatus = "new" | "contacted" | "scheduled" | "closed"

export interface Lead {
  id: number
  name: string
  email: string
  phone: string
  service: string
  message: string
  status: LeadStatus
  createdAt: number
}

export const LEAD_SERVICES = [
  "Wardrobe & Fashion Consulting",
  "Clothing Design",
  "Engineering Consulting",
  "General Enquiry",
]

const KEY = "oak_leads"

const SEED: Lead[] = [
  {
    id: 1,
    name: "Eleanor Whitfield",
    email: "eleanor.w@example.com",
    phone: "+1 202 555 0148",
    service: "Wardrobe & Fashion Consulting",
    message:
      "I'm stepping into a more public leadership role and want my wardrobe to reflect that. Looking for a full audit and ongoing support.",
    status: "scheduled",
    createdAt: Date.now() - 86400000 * 6,
  },
  {
    id: 2,
    name: "Raymond Osei",
    email: "r.osei@example.com",
    phone: "+44 20 7946 0321",
    service: "Engineering Consulting",
    message:
      "We need an independent advisory review on a mid-size civil project before we commit to the execution phase.",
    status: "contacted",
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: 3,
    name: "Priya Anand",
    email: "priya.anand@example.com",
    phone: "+1 415 555 0199",
    service: "Clothing Design",
    message: "Interested in a bespoke capsule collection for a personal brand launch next quarter.",
    status: "new",
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 4,
    name: "Marcus Bell",
    email: "marcus.bell@example.com",
    phone: "+1 312 555 0170",
    service: "General Enquiry",
    message: "Wanted to understand how your retainer engagements are structured.",
    status: "new",
    createdAt: Date.now() - 86400000,
  },
]

export function getLeads(): Lead[] {
  if (typeof window === "undefined") return SEED
  try {
    const stored = localStorage.getItem(KEY)
    if (!stored) {
      localStorage.setItem(KEY, JSON.stringify(SEED))
      return SEED
    }
    return JSON.parse(stored)
  } catch {
    return SEED
  }
}

export function saveLeads(data: Lead[]): void {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function addLead(l: Omit<Lead, "id" | "status" | "createdAt">): Lead {
  const all = getLeads()
  const next: Lead = { ...l, id: Date.now(), status: "new", createdAt: Date.now() }
  saveLeads([next, ...all])
  return next
}

export function updateLeadStatus(id: number, status: LeadStatus): void {
  saveLeads(getLeads().map((l) => (l.id === id ? { ...l, status } : l)))
}

export function deleteLead(id: number): void {
  saveLeads(getLeads().filter((l) => l.id !== id))
}
