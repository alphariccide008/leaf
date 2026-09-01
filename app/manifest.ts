import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OAKLEAF PARTNERS LLC",
    short_name: "OAKLEAF",
    description:
      "A diversified consulting and design company — wardrobe & fashion consulting, clothing design, and engineering consulting.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0F0D",
    theme_color: "#0B0F0D",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon.svg", type: "image/svg+xml", sizes: "180x180" },
    ],
  }
}
