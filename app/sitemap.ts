import type { MetadataRoute } from "next"

const SITE_URL = "https://oakleafpartnersconsulting.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const routes = ["", "/about", "/services", "/shop", "/contact"]
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "monthly" : "yearly",
    priority: path === "" ? 1 : 0.7,
  }))
}
