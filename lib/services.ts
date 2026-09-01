import { Shirt, Scissors, HardHat, type LucideIcon } from "lucide-react"

export interface ServiceGroup {
  id: string
  Icon: LucideIcon
  title: string
  tagline: string
  summary: string
  items: string[]
  image: string
}

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: "wardrobe",
    Icon: Shirt,
    title: "Wardrobe & Fashion Consulting",
    tagline: "A polished, confident, personalised appearance.",
    summary:
      "We help individuals and clients develop a wardrobe that works for their life. Every recommendation is tailored to your needs, preferences, and lifestyle — nothing generic, nothing off the shelf.",
    items: [
      "Personal wardrobe consultation",
      "Style and image consulting",
      "Wardrobe planning and organization",
      "Outfit and styling recommendations",
      "Personalized fashion guidance",
    ],
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=80&auto=format&fit=crop",
  },
  {
    id: "design",
    Icon: Scissors,
    title: "Clothing Design",
    tagline: "Personalised clothing concepts, made real.",
    summary:
      "From first sketch to finished garment, we design clothing around the person who will wear it. We also advise on planning and developing collections and personal lines.",
    items: [
      "Custom clothing design",
      "Design consultation",
      "Personalized clothing concepts",
      "Fashion planning and development",
    ],
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1000&q=80&auto=format&fit=crop",
  },
  {
    id: "engineering",
    Icon: HardHat,
    title: "Engineering Consulting",
    tagline: "Plan, evaluate, and execute with confidence.",
    summary:
      "We provide professional guidance and consulting support for engineering works and projects, helping clients move from intent to a sound, executable plan.",
    items: [
      "Engineering project consulting",
      "Technical consulting and guidance",
      "Engineering work planning and support",
      "Project-related advisory services",
    ],
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1000&q=80&auto=format&fit=crop",
  },
]

export const APPROACH_STEPS = [
  {
    num: "01",
    title: "Understand",
    desc: "We start by understanding each client's unique needs, context, and goals — before recommending anything.",
  },
  {
    num: "02",
    title: "Design the Solution",
    desc: "We combine creativity, professionalism, and technical knowledge to shape a solution that fits the brief precisely.",
  },
  {
    num: "03",
    title: "Guide Execution",
    desc: "We stay involved through delivery, providing practical, personalised consulting support at every stage.",
  },
  {
    num: "04",
    title: "Deliver Quality",
    desc: "The result is high-quality work that balances quality, creativity, practicality, and professionalism.",
  },
]
