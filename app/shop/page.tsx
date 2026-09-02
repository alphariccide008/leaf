"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getProducts, PRODUCT_CATEGORIES, type Product } from "@/lib/products-store"
import { formatPrice } from "@/lib/utils"

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filter, setFilter] = useState<string>("All")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setMounted(true))
  }, [])

  const filtered = products.filter((p) => filter === "All" || p.category === filter)

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      <Header />

      <section className="relative pt-36 pb-16 overflow-hidden" style={{ background: "var(--background)" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(194,161,91,0.13), transparent)" }}
        />
        <div className="container-wide relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px" style={{ background: "var(--primary)" }} />
            <span className="eyebrow">Services &amp; Packages</span>
          </div>
          <h1
            className="font-display font-semibold tracking-tight leading-[1.02] mb-6 text-white"
            style={{ fontSize: "clamp(2.3rem,7vw,5rem)" }}
          >
            Ways to work
            <br />
            <span style={{ color: "var(--primary)" }}>with us.</span>
          </h1>
          <p className="text-base md:text-lg max-w-xl leading-relaxed" style={{ color: "var(--text-2)" }}>
            Structured consulting and design packages across wardrobe, clothing design, and engineering advisory. Every
            engagement is tailored after an initial consultation.
          </p>
        </div>
      </section>

      <section className="pb-24" style={{ background: "var(--background)" }}>
        <div className="container-wide">
          <div className="flex flex-wrap gap-2 mb-10">
            {["All", ...PRODUCT_CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                style={
                  filter === c
                    ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                    : { background: "var(--surface-2)", color: "var(--text-3)", border: "1px solid var(--border)" }
                }
              >
                {c}
              </button>
            ))}
          </div>

          {!mounted ? null : filtered.length === 0 ? (
            <div className="py-20 text-center text-sm" style={{ color: "var(--text-4)" }}>
              No packages in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="group flex flex-col rounded-2xl overflow-hidden hover-lift"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {p.featured && (
                      <span
                        className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                      >
                        Featured
                      </span>
                    )}
                    {!p.inStock && (
                      <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/70 text-white/70">
                        Waitlist
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-[9px] font-bold uppercase tracking-[0.28em] mb-2" style={{ color: "var(--primary)" }}>
                      {p.category}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-white mb-2">{p.name}</h3>
                    <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-3)" }}>
                      {p.description}
                    </p>
                    <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                      <span className="font-display text-lg font-semibold text-white">
                        {p.price > 0 ? formatPrice(p.price) : "On request"}
                      </span>
                      <Link
                        href="/contact"
                        className="text-xs font-semibold px-4 py-2 rounded-full transition-all hover:opacity-90"
                        style={{ background: "rgba(194,161,91,0.14)", color: "var(--primary)" }}
                      >
                        Enquire
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
