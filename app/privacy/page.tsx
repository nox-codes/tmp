import Link from "next/link"
import ScrollReveal from "../componenets/scrollReveal"
import Footer from "../componenets/landing/Footer"

export default function Privacy() {
  return (
    <>
      <section className="about-hero">
        <div className="hero-grid-bg" />
        <div className="hero-glow" />
        <div className="section-container about-hero-inner">
          <ScrollReveal>
            <span className="section-label">Policy</span>
            <h1 className="about-hero-heading">
              Privacy <span className="hero-heading-accent">Policy</span>
            </h1>
            <p className="about-hero-sub">Last updated: July 2026</p>
          </ScrollReveal>
        </div>
      </section>

      <section className="about-section">
        <div className="section-container" style={{ maxWidth: 720 }}>
          <ScrollReveal>
            <h2 className="section-heading">What we collect</h2>
            <p className="about-mission-text" style={{ marginTop: '1rem' }}>
              When you sign up, we collect your email address, display name, academic details (faculty, department,
              level), and your course enrolment data. If you sign in with Google, we also receive your name and email
              from your Google profile.
            </p>
            <p className="about-mission-text" style={{ marginTop: '0.75rem' }}>
              We collect usage data — which courses you view, questions you attempt, your scores, and study patterns —
              to personalise your experience and improve our platform.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="section-heading" style={{ marginTop: '3rem' }}>How we use it</h2>
            <p className="about-mission-text" style={{ marginTop: '1rem' }}>
              Your data powers the product: study streaks, performance analytics, personalised question recommendations,
              and progress tracking. We also use your email to send account notifications, study reminders, and
              occasional product updates.
            </p>
            <p className="about-mission-text" style={{ marginTop: '0.75rem' }}>
              We never sell your data. We never share your personal information with third parties for their own
              marketing purposes.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="section-heading" style={{ marginTop: '3rem' }}>Payments</h2>
            <p className="about-mission-text" style={{ marginTop: '1rem' }}>
              All payments are processed by Paystack. We do not store your card details. Paystack handles all payment
              data in accordance with PCI-DSS standards.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="section-heading" style={{ marginTop: '3rem' }}>Cookies</h2>
            <p className="about-mission-text" style={{ marginTop: '1rem' }}>
              We use cookies to keep you signed in and to maintain your session. You can control cookie preferences
              in your browser settings, but disabling cookies may affect how UniLock works.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="section-heading" style={{ marginTop: '3rem' }}>Your rights</h2>
            <p className="about-mission-text" style={{ marginTop: '1rem' }}>
              You can request a copy of your data, ask us to delete your account, or update your information at any
              time by contacting us. We will respond within 30 days.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="section-heading" style={{ marginTop: '3rem' }}>Contact</h2>
            <p className="about-mission-text" style={{ marginTop: '1rem' }}>
              Questions about this policy? Reach us at{" "}
              <Link href="mailto:privacy@unilock.app" className="auth-link">support@unilock.online</Link>.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </>
  )
}
