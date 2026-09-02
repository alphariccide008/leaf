import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ServicesOverview } from "@/components/services-overview"
import { Approach } from "@/components/approach"
import { Leadership } from "@/components/leadership"
import { Team } from "@/components/team"
import { CtaSection } from "@/components/cta-section"
import { ContactForm } from "@/components/contact-form"
import { Footer } from "@/components/footer"

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "OAKLEAF PARTNERS LLC",
  description:
    "A diversified consulting and design company offering wardrobe & fashion consulting, clothing design, and engineering consulting.",
  url: "https://oakleafpartnersconsulting.com",
  email: "info@oakleafpartnersconsulting.com",
  founder: { "@type": "Person", name: "Cindy Kahn", jobTitle: "Chief Executive Officer" },
  areaServed: "Worldwide",
  knowsAbout: [
    "Wardrobe consulting",
    "Image and style consulting",
    "Clothing design",
    "Engineering project consulting",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Consulting & Design Services",
    itemListElement: [
      { "@type": "OfferCatalog", name: "Wardrobe & Fashion Consulting" },
      { "@type": "OfferCatalog", name: "Clothing Design" },
      { "@type": "OfferCatalog", name: "Engineering Consulting" },
    ],
  },
}

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Header />
      <Hero />

      {/* Company overview */}
      <section className="section-padding" style={{ background: "var(--background)" }}>
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px" style={{ background: "var(--primary)" }} />
                <span className="eyebrow">Who We Are</span>
              </div>
              <h2 className="font-display font-semibold tracking-tight text-white" style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", lineHeight: 1.1 }}>
                A diversified consulting and design company.
              </h2>
            </div>
            <div className="lg:col-span-8 space-y-5">
              <p className="text-sm md:text-base leading-relaxed" style={{ color: "var(--text-2)" }}>
                OAKLEAF PARTNERS LLC offers professional services in wardrobe consulting, clothing design, and engineering
                consulting. Our wardrobe and fashion services focus on helping individuals and clients develop a polished,
                confident, and personalized appearance — through consultations, style guidance, clothing design, and
                fashion solutions tailored to each client&apos;s needs, preferences, and lifestyle.
              </p>
              <p className="text-sm md:text-base leading-relaxed" style={{ color: "var(--text-2)" }}>
                Alongside our fashion and wardrobe work, we provide consulting services for engineering works and
                projects — professional guidance and support that helps clients effectively plan, evaluate, and execute
                engineering-related work. Our goal is to bring together creativity, professionalism, technical knowledge,
                and personalized consulting to deliver high-quality solutions across both sectors.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ServicesOverview />
      <Approach />
      <Leadership />
      <Team />
      <CtaSection />
      <ContactForm />
      <Footer />
    </main>
  )
}
