import { useReveal } from '../hooks/useReveal'
import Nav from '../components/landing/Nav'
import Hero from '../components/landing/Hero'
import StatBand from '../components/landing/StatBand'
import FeaturesBento from '../components/landing/FeaturesBento'
import HowItWorks from '../components/landing/HowItWorks'
import GalleryMarquee from '../components/landing/GalleryMarquee'
import ModeShowcase from '../components/landing/ModeShowcase'
import FAQ from '../components/landing/FAQ'
import CTABand from '../components/landing/CTABand'
import Footer from '../components/landing/Footer'

export default function Landing() {
  useReveal()

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <Nav />
      <main>
        <Hero />
        <StatBand />
        <FeaturesBento />
        <HowItWorks />
        <GalleryMarquee />
        <ModeShowcase />
        <FAQ />
        <CTABand />
      </main>
      <Footer />
    </div>
  )
}
