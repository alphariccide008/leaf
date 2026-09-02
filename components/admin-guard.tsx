"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthed } from "@/lib/auth"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    isAuthed().then((ok) => {
      if (!active) return
      if (ok) setReady(true)
      else router.replace("/admin/login")
    })
    return () => {
      active = false
    }
  }, [router])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0B0F0D" }}>
        <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-[var(--primary)] animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
