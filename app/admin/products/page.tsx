"use client"

import { useEffect, useRef, useState } from "react"
import { Plus, Pencil, Trash2, X, Check, Search, Upload, Star } from "lucide-react"
import {
  getProductsAdmin,
  addProduct,
  updateProduct,
  deleteProduct,
  PRODUCT_CATEGORIES,
  type Product,
  type ProductDraft as Draft,
} from "@/lib/products-store"
import { formatPrice } from "@/lib/utils"

const toDraft = (p: Product): Draft => ({
  name: p.name,
  category: p.category,
  price: p.price,
  description: p.description,
  image: p.image,
  featured: p.featured,
  inStock: p.inStock,
})

const EMPTY: Draft = {
  name: "",
  category: PRODUCT_CATEGORIES[0],
  price: 0,
  description: "",
  image: "",
  featured: false,
  inStock: true,
}

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-white/30 transition-colors placeholder:text-white/20"

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-white/40 mb-1.5">
        {label} {required && <span style={{ color: "var(--primary)" }}>*</span>}
      </label>
      {children}
    </div>
  )
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")
  const [modal, setModal] = useState<{ mode: "add" | "edit"; id?: number; data: Draft } | null>(null)
  const [delTarget, setDelTarget] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const reload = () => {
    getProductsAdmin().then(setProducts).catch(() => {})
  }

  useEffect(() => {
    reload()
  }, [])

  const openAdd = () => setModal({ mode: "add", data: { ...EMPTY } })
  const openEdit = (p: Product) =>
    setModal({ mode: "edit", id: p.id, data: toDraft(p) })

  const patch = (key: keyof Draft, val: unknown) => {
    if (!modal) return
    setModal({ ...modal, data: { ...modal.data, [key]: val } })
  }

  const onFile = (file: File | undefined) => {
    if (!file || !modal) return
    if (file.size > 2_500_000) {
      alert("Please choose an image under 2.5MB.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => patch("image", String(reader.result))
    reader.readAsDataURL(file)
  }

  const valid = (d: Draft) => d.name.trim() && d.description.trim() && d.image.trim()

  const save = async () => {
    if (!modal || !valid(modal.data)) return
    setSaving(true)
    try {
      if (modal.mode === "add") {
        await addProduct(modal.data)
      } else if (modal.id != null) {
        await updateProduct(modal.id, modal.data)
      }
      reload()
      setModal(null)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!delTarget) return
    const id = delTarget.id
    setDelTarget(null)
    setProducts((prev) => prev.filter((p) => p.id !== id))
    await deleteProduct(id)
    reload()
  }

  const toggleFeatured = async (p: Product) => {
    setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, featured: !x.featured } : x)))
    await updateProduct(p.id, { ...toDraft(p), featured: !p.featured })
    reload()
  }

  const filtered = products.filter((p) => {
    const q = search.toLowerCase()
    return !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  })

  return (
    <div className="p-6 lg:p-10 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Products</h1>
          <p className="text-white/35 text-sm mt-1">{products.length} packages published to the site</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-white/25 transition-colors"
        />
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Product", "Category", "Price", "Featured", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-widest text-white/25 font-bold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="admin-row-hover transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-12 h-9 rounded-lg object-cover flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-white/90">{p.name}</p>
                        <p className="text-[10px] text-white/30 line-clamp-2 max-w-[240px]">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-white/45 whitespace-nowrap">{p.category}</td>
                  <td className="px-5 py-4 text-sm text-white/70 font-mono whitespace-nowrap">
                    {p.price > 0 ? formatPrice(p.price) : "On request"}
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleFeatured(p)} aria-label="Toggle featured">
                      <Star
                        className="h-4 w-4"
                        style={{ color: p.featured ? "var(--primary)" : "rgba(255,255,255,0.2)" }}
                        fill={p.featured ? "var(--primary)" : "none"}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                      style={
                        p.inStock
                          ? { background: "rgba(16,185,129,0.15)", color: "#34d399" }
                          : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }
                      }
                    >
                      {p.inStock ? "Available" : "Waitlist"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/8">
                        <Pencil className="h-3.5 w-3.5 text-white/40" />
                      </button>
                      <button onClick={() => setDelTarget(p)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10">
                        <Trash2 className="h-3.5 w-3.5 text-red-400/50" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-16 text-center text-white/25 text-sm">No products found</div>}
        </div>
      </div>

      {/* Add / edit modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl flex flex-col"
            style={{ background: "#12160F", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div
              className="flex items-center justify-between p-6 sticky top-0 z-10"
              style={{ background: "#12160F", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <h2 className="font-display text-base font-semibold text-white">
                {modal.mode === "add" ? "Add Product" : "Edit Product"}
              </h2>
              <button onClick={() => setModal(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/8">
                <X className="h-4 w-4 text-white/50" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Name" required>
                  <input className={inputCls} placeholder="e.g. Signature Wardrobe Audit" value={modal.data.name} onChange={(e) => patch("name", e.target.value)} />
                </Field>
                <Field label="Category">
                  <select className={inputCls} style={{ background: "#141A16" }} value={modal.data.category} onChange={(e) => patch("category", e.target.value)}>
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (USD, 0 = on request)">
                  <input
                    type="number"
                    min={0}
                    className={inputCls}
                    placeholder="850"
                    value={modal.data.price || ""}
                    onChange={(e) => patch("price", Number(e.target.value))}
                  />
                </Field>
                <div className="flex items-end gap-5 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div
                      className={`w-10 h-5 rounded-full relative transition-colors ${modal.data.featured ? "bg-[var(--primary)]" : "bg-white/10"}`}
                      onClick={() => patch("featured", !modal.data.featured)}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${modal.data.featured ? "left-5" : "left-0.5"}`} />
                    </div>
                    <span className="text-xs text-white/50 font-semibold">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div
                      className={`w-10 h-5 rounded-full relative transition-colors ${modal.data.inStock ? "bg-emerald-600" : "bg-white/10"}`}
                      onClick={() => patch("inStock", !modal.data.inStock)}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${modal.data.inStock ? "left-5" : "left-0.5"}`} />
                    </div>
                    <span className="text-xs text-white/50 font-semibold">Available</span>
                  </label>
                </div>
              </div>

              <Field label="Description" required>
                <textarea
                  className={inputCls}
                  rows={4}
                  placeholder="Describe what this package includes..."
                  value={modal.data.description}
                  onChange={(e) => patch("description", e.target.value)}
                />
              </Field>

              <Field label="Image" required>
                <div className="flex flex-col gap-3">
                  {modal.data.image && (
                    <img src={modal.data.image} alt="preview" className="w-full h-40 object-cover rounded-xl" />
                  )}
                  <div className="flex gap-2">
                    <input
                      className={inputCls}
                      placeholder="Paste an image URL, or upload →"
                      value={modal.data.image.startsWith("data:") ? "" : modal.data.image}
                      onChange={(e) => patch("image", e.target.value)}
                    />
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onFile(e.target.files?.[0])}
                    />
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 flex-shrink-0 hover:opacity-90 transition-opacity"
                      style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                    >
                      <Upload className="h-3.5 w-3.5" /> Upload
                    </button>
                  </div>
                </div>
              </Field>
            </div>

            <div
              className="flex items-center justify-end gap-3 p-6 sticky bottom-0"
              style={{ background: "#12160F", borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <button onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white/40 hover:text-white/70 transition-colors">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving || !valid(modal.data)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40 transition-all hover:opacity-90"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                {saving ? (
                  <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                {modal.mode === "add" ? "Add Product" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {delTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDelTarget(null)} />
          <div className="relative w-full max-w-sm rounded-2xl p-6" style={{ background: "#12160F", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h3 className="font-display text-base font-semibold text-white mb-2">Delete product?</h3>
            <p className="text-sm text-white/40 mb-6">&ldquo;{delTarget.name}&rdquo; will be removed from the site.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelTarget(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/40 hover:text-white/70 transition-colors border border-white/10">
                Cancel
              </button>
              <button onClick={remove} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600/80 hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
