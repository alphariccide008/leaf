"use client"

import { useState } from "react"
import { Save, Shield } from "lucide-react"

export default function AdminSettings() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    displayName: "OAKLEAF Admin",
    email: "admin@oakleafpartners.com",
    currentPw: "",
    newPw: "",
    confirmPw: "",
    notifyLeads: true,
    notifyChats: true,
    notifyWeekly: false,
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-6 lg:p-10 min-h-screen max-w-2xl">
      <div className="mb-10">
        <h1 className="font-display text-2xl font-semibold text-white">Settings</h1>
        <p className="text-white/35 text-sm mt-1">Manage your admin profile and preferences</p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div className="admin-card p-6">
          <h2 className="font-display text-sm font-semibold text-white mb-6">Profile</h2>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
              O
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{form.displayName}</p>
              <p className="text-xs text-white/35">{form.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: "Display Name", key: "displayName", type: "text" },
              { label: "Email Address", key: "email", type: "email" },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-[10px] uppercase tracking-widest text-white/35 mb-2">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form] as string}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-4 w-4" style={{ color: "var(--primary)" }} />
            <h2 className="font-display text-sm font-semibold text-white">Security</h2>
          </div>
          <p className="text-xs text-white/30 mb-4">
            Password changes from this screen aren&apos;t wired up yet. To rotate the admin password, update
            <span className="text-white/45"> ADMIN_PASSWORD</span> and re-run
            <span className="text-white/45"> npm run db:setup</span>.
          </p>
          <div className="space-y-4">
            {[
              { label: "Current Password", key: "currentPw" },
              { label: "New Password", key: "newPw" },
              { label: "Confirm Password", key: "confirmPw" },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-[10px] uppercase tracking-widest text-white/35 mb-2">{label}</label>
                <input
                  type="password"
                  value={form[key as keyof typeof form] as string}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card p-6">
          <h2 className="font-display text-sm font-semibold text-white mb-6">Notifications</h2>
          <div className="space-y-4">
            {[
              { key: "notifyLeads", label: "New consultation requests", desc: "Alert when a visitor submits the contact form" },
              { key: "notifyChats", label: "New live chat messages", desc: "Alert when a visitor starts or replies in chat" },
              { key: "notifyWeekly", label: "Weekly summary report", desc: "A digest every Monday morning" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-white/30 mt-0.5">{desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, [key]: !form[key as keyof typeof form] })}
                  className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
                  style={{ background: form[key as keyof typeof form] ? "var(--primary)" : "rgba(255,255,255,0.1)" }}
                >
                  <span
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
                    style={{ left: form[key as keyof typeof form] ? "calc(100% - 1.25rem)" : "0.25rem" }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition hover:opacity-90"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </form>
    </div>
  )
}
