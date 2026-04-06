import Link from "next/link"
import ScrollReveal from "../scrollReveal"
import HeroDashboard from "./HeroDashboard"
import { DottedSurface } from "../ui/dotted-surface"

export default function HeroSection() {
  return (
    <section className="relative hero-section">
      <DottedSurface className="absolute inset-0" />
      <div className="hero-bg-gradient" />
      <div className="hero-glow" />
      
      {/* Grid Background */}
      <div className="hero-grid-bg" />

      {/* Floating Orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      <div className="relative z-10 section-container hero-content">
        <ScrollReveal>
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Built for UNILAG Students
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <h1 className="hero-heading">
            Lock Into Your University's{" "}
            <span className="hero-heading-accent">Resources With Ease</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal>
          <p className="hero-subtext">
            Access curated course materials, practice past questions with CBT simulation,
            track your academic performance, and study smarter &mdash; all in one platform
            designed specifically for UNILAG students.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="hero-cta-group">
            <Link href="/register" className="btn btn-primary">
              Get Started Free
              <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/pricing" className="btn btn-secondary">
              View Pricing
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="hero-mockup-wrapper">
            <HeroDashboard />
            <div className="hero-mockup-glow" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}