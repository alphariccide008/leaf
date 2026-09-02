"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, Package, MessageCircle, Settings, LogOut, Menu, X, ExternalLink, CreditCard } from "lucide-react"
import { LogoMark } from "@/components/logo"
import { logout } from "@/lib/auth"
import { apiGet } from "@/lib/api"

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/leads", icon: Users, label: "Consultations" },
  { href: "/admin/payments", icon: CreditCard, label: "Payments" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/messages", icon: MessageCircle, label: "Live Chat", badge: true },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let active = true
    const tick = async () => {
      try {
        const s = await apiGet<{ chats: { unread: number } }>("/api/admin/stats")
        if (active) setUnread(s.chats.unread)
      } catch {
        /* ignore */
      }
    }
    tick()
    const t = setInterval(tick, 5000)
    return () => {
      active = false
      clearInterval(t)
    }
  }, [])

  const doLogout = async () => {
    await logout()
    router.replace("/admin/login")
  }

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href))

  const Content = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/admin" className="flex items-center gap-2.5">
          <LogoMark size={28} />
          <div className="flex flex-col leading-none">
            <span className="font-display text-sm font-semibold text-white tracking-[0.1em]">OAKLEAF</span>
            <span className="text-[9px] tracking-widest text-white/30 uppercase">Admin</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active ? "text-white" : "text-white/40 hover:text-white/80 hover:bg-white/5"
              }`}
              style={active ? { background: "rgba(194,161,91,0.2)" } : {}}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
              {badge && unread > 0 && (
                <span className="ml-auto text-[10px] font-bold bg-emerald-500 text-white rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {unread}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-6 pt-4 space-y-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
        >
          <ExternalLink className="h-4 w-4" />
          View Site
        </a>
        <button
          onClick={doLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside
        className="hidden lg:flex flex-col w-60 h-screen fixed left-0 top-0 z-40"
        style={{ background: "#0A0D0B", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Content />
      </aside>

      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4"
        style={{ background: "#0A0D0B", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Link href="/admin" className="flex items-center gap-2.5">
          <LogoMark size={24} />
          <span className="font-display text-sm font-semibold text-white tracking-[0.1em]">OAKLEAF Admin</span>
        </Link>
        <button onClick={() => setOpen(!open)} className="text-white/60 hover:text-white">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside
            className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-60 flex flex-col"
            style={{ background: "#0A0D0B", borderRight: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Content />
          </aside>
        </>
      )}
    </>
  )
}
