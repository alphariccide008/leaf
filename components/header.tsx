"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, Shirt, Scissors, HardHat } from "lucide-react"
import { LogoMark, Wordmark } from "@/components/logo"

const services = [
  { name: "Wardrobe & Fashion Consulting", href: "/services#wardrobe", icon: Shirt },
  { name: "Clothing Design", href: "/services#design", icon: Scissors },
  { name: "Engineering Consulting", href: "/services#engineering", icon: HardHat },
]

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/shop", label: "Services & Packages" },
  { href: "/contact", label: "Contact" },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))
  const navColor = (href: string) => (isActive(href) ? "var(--primary)" : "rgba(236,234,227,0.72)")

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled ? "shadow-lg" : ""}`}
      style={{
        background: scrolled ? "rgba(11,15,13,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
      }}
    >
      <div className="container-wide">
        <div className="flex h-20 items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <LogoMark />
            <Wordmark />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.slice(0, 2).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium transition-colors duration-300 hover:text-white"
                style={{ color: navColor(l.href) }}
              >
                {l.label}
              </Link>
            ))}

            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className="flex items-center gap-1 text-sm font-medium transition-colors duration-300 hover:text-white"
                style={{ color: pathname.startsWith("/services") ? "var(--primary)" : "rgba(236,234,227,0.72)" }}
              >
                Services
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`} />
              </button>

              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[420px] max-w-[calc(100vw-2rem)] transition-all duration-300 ${
                  servicesOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <div
                  className="rounded-2xl shadow-2xl p-4"
                  style={{ background: "#141A16", border: "1px solid rgba(255,255,255,0.09)" }}
                >
                  <div
                    className="h-0.5 w-full rounded-full mb-4"
                    style={{ background: "linear-gradient(90deg,var(--primary),transparent)" }}
                  />
                  <div className="space-y-1">
                    {services.map((s) => {
                      const Icon = s.icon
                      return (
                        <Link
                          key={s.href}
                          href={s.href}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-white/5"
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(194,161,91,0.12)" }}
                          >
                            <Icon className="h-4 w-4" style={{ color: "var(--primary)" }} />
                          </div>
                          <span className="text-sm font-medium" style={{ color: "#ECEAE3" }}>
                            {s.name}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {links.slice(2).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium transition-colors duration-300 hover:text-white"
                style={{ color: navColor(l.href) }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:opacity-90"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Book a Consultation
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.07)",
                color: "#ECEAE3",
              }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            className="lg:hidden py-6 animate-slide-down"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(11,15,13,0.98)",
              backdropFilter: "blur(20px)",
            }}
          >
            <nav className="space-y-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    color: isActive(l.href) ? "var(--primary)" : "rgba(236,234,227,0.7)",
                    background: isActive(l.href) ? "rgba(194,161,91,0.12)" : "transparent",
                  }}
                >
                  {l.label}
                </Link>
              ))}

              <div>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{ color: "rgba(236,234,227,0.7)" }}
                >
                  Services
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${mobileServicesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileServicesOpen && (
                  <div className="mt-1 ml-4 space-y-1 animate-slide-down">
                    {services.map((s) => {
                      const Icon = s.icon
                      return (
                        <Link
                          key={s.href}
                          href={s.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:text-white"
                          style={{ color: "rgba(236,234,227,0.55)" }}
                        >
                          <Icon className="h-4 w-4" style={{ color: "var(--primary)" }} /> {s.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </nav>
            <div className="mt-6 pt-6 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full py-3.5 rounded-full text-sm font-semibold"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
