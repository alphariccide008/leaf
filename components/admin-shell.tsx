"use client"

import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminGuard } from "@/components/admin-guard"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === "/admin/login") {
    return <div style={{ background: "#0B0F0D" }}>{children}</div>
  }

  return (
    <div className="min-h-screen" style={{ background: "#0B0F0D" }}>
      <AdminSidebar />
      <div className="lg:pl-60">
        <div className="pt-16 lg:pt-0">
          <AdminGuard>{children}</AdminGuard>
        </div>
      </div>
    </div>
  )
}
