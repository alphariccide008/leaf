import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services & Packages",
  description:
    "Structured consulting and design packages from OAKLEAF PARTNERS LLC — wardrobe audits, bespoke clothing design, style packages, and engineering advisory. Every engagement is tailored after an initial consultation.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Services & Packages · OAKLEAF PARTNERS LLC",
    description:
      "Ways to work with us across wardrobe consulting, clothing design, and engineering advisory.",
    url: "/shop",
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
