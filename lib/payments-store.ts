"use client"

import { apiGet, apiPatch, apiPost } from "@/lib/api"
import type { Payment, PaymentStatus } from "@/lib/types"

export type { Payment, PaymentStatus }
export { PAYMENT_METHODS } from "@/lib/types"

export async function getPayments(): Promise<Payment[]> {
  const { payments } = await apiGet<{ payments: Payment[] }>("/api/admin/payments")
  return payments
}

export async function addPayment(input: {
  name: string
  email: string
  amount: number
  method?: string
  reference?: string
  note?: string
  leadId?: number | null
}): Promise<Payment> {
  const { payment } = await apiPost<{ payment: Payment }>("/api/admin/payments", input)
  return payment
}

export async function updatePayment(
  id: number,
  patch: { status?: PaymentStatus; note?: string },
): Promise<void> {
  await apiPatch(`/api/admin/payments/${id}`, patch)
}
