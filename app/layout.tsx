import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Preloader } from "@/components/preloader"
import { ChatWidget } from "@/components/chat-widget"

const SITE_URL = "https://oakleafpartners.com"
const DESCRIPTION =
  "OAKLEAF PARTNERS LLC is a diversified consulting and design company offering professional services in wardrobe & fashion consulting, clothing design, and engineering consulting."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OAKLEAF PARTNERS LLC — Consulting & Design",
    template: "%s · OAKLEAF PARTNERS LLC",
  },
  description: DESCRIPTION,
  applicationName: "OAKLEAF PARTNERS LLC",
  authors: [{ name: "OAKLEAF PARTNERS LLC" }],
  creator: "OAKLEAF PARTNERS LLC",
  publisher: "OAKLEAF PARTNERS LLC",
  keywords: [
    "wardrobe consulting",
    "fashion consulting",
    "image consulting",
    "personal stylist",
    "clothing design",
    "custom clothing",
    "capsule wardrobe",
    "engineering consulting",
    "engineering advisory",
    "project consulting",
    "OAKLEAF PARTNERS",
  ],
  category: "business",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "OAKLEAF PARTNERS LLC",
    url: SITE_URL,
    locale: "en_US",
    title: "OAKLEAF PARTNERS LLC — Consulting & Design",
    description:
      "Bringing together creativity, professionalism, technical knowledge, and personalized consulting across the fashion and engineering sectors.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OAKLEAF PARTNERS LLC — Consulting & Design",
    description:
      "Wardrobe & fashion consulting, clothing design, and engineering consulting — one practice, two sectors.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
}

export const viewport: Viewport = {
  themeColor: "#0B0F0D",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased overflow-x-hidden">
        <Preloader />
        {children}
        <ChatWidget />
      </body>
    </html>
  )
}
