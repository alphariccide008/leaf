"use client"

import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api"
import type { Lead, LeadStatus } from "@/lib/types"

export type { Lead, LeadStatus }
export { LEAD_SERVICES } from "@/lib/types"

export interface NewLeadInput {
  name: string
  email: string
  phone?: string
  service?: string
  message?: string
  /** Optional payment the visitor is sending with the request. */
  amount?: number
  paymentMethod?: string
  paymentReference?: string
}

/** Public — submit a consultation request (and optionally a payment). */
export async function submitLead(input: NewLeadInput): Promise<void> {
  await apiPost("/api/leads", input)
}

/** Admin — list all consultation requests. */
export async function getLeads(): Promise<Lead[]> {
  const { leads } = await apiGet<{ leads: Lead[] }>("/api/admin/leads")
  return leads
}

export async function updateLeadStatus(id: number, status: LeadStatus): Promise<void> {
  await apiPatch(`/api/admin/leads/${id}`, { status })
}

export async function deleteLead(id: number): Promise<void> {
  await apiDelete(`/api/admin/leads/${id}`)
}
