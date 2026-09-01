export interface TeamMember {
  name: string
  role: string
  discipline: "Fashion" | "Design" | "Engineering" | "Leadership"
  image: string
  bio: string
}

export const LEADER: TeamMember = {
  name: "Cindy Kahn",
  role: "Chief Executive Officer",
  discipline: "Leadership",
  image: "/ceo.jpeg",
  bio: "Cindy Kahn is the Chief Executive Officer of OAKLEAF PARTNERS LLC, leading the company's vision and overseeing its consulting and design services. She built the firm around a single idea: that creativity and technical discipline belong in the same room.",
}

export const TEAM: TeamMember[] = [
  {
    name: "Priya Raman",
    role: "Lead Wardrobe & Image Consultant",
    discipline: "Fashion",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=800&q=80&auto=format&fit=crop",
    bio: "Guides clients toward a polished, confident, personalised appearance through wardrobe consultations and image strategy.",
  },
  {
    name: "Sofia Marchetti",
    role: "Head of Clothing Design",
    discipline: "Design",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80&auto=format&fit=crop",
    bio: "Leads custom clothing design and capsule development, translating a client's brief into finished, wearable concepts.",
  },
  {
    name: "Marcus Ellery",
    role: "Principal Engineering Consultant",
    discipline: "Engineering",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=800&q=80&auto=format&fit=crop",
    bio: "Advises clients on planning, evaluating, and executing engineering works with clear, defensible technical judgement.",
  },
  {
    name: "Lena Hart",
    role: "Style & Personal Shopping Consultant",
    discipline: "Fashion",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&q=80&auto=format&fit=crop",
    bio: "Builds outfit systems and styling recommendations tailored to each client's lifestyle, preferences, and goals.",
  },
  {
    name: "David Chen",
    role: "Design Development Lead",
    discipline: "Design",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&q=80&auto=format&fit=crop",
    bio: "Owns the path from concept to specification — patterns, fabrics, and tech packs ready for production.",
  },
  {
    name: "Jessica Keller",
    role: "Senior Project Advisor, Engineering",
    discipline: "Engineering",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80&auto=format&fit=crop",
    bio: "Supports engineering project planning and advisory work, keeping scope, risk, and delivery aligned.",
  },
  {
    name: "James Gunderson",
    role: "Engineering Consultant",
    discipline: "Engineering",
    image: "/engineer.jpeg",
    bio: "Provides technical consulting and guidance on engineering works, helping clients evaluate options and execute with confidence.",
  },
]
