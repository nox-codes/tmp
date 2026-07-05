import Link from "next/link"
import ScrollReveal from "../componenets/scrollReveal"
import Footer from "../componenets/landing/Footer"

export default function Terms() {
  return (
    <>
      <section className="about-hero">
        <div className="hero-grid-bg" />
        <div className="hero-glow" />
        <div className="section-container about-hero-inner">
          <ScrollReveal>
            <span className="section-label">Terms</span>
            <h1 className="about-hero-heading">
              Terms of <span className="hero-heading-accent">Service</span>
            </h1>
            <p className="about-hero-sub">Last updated: July 2026</p>
          </ScrollReveal>
        </div>
      </section>

      <section className="about-section">
        <div className="section-container" style={{ maxWidth: 720 }}>
          <ScrollReveal>
            <h2 className="section-heading">Acceptance</h2>
            <p className="about-mission-text" style={{ marginTop: '1rem' }}>
              By creating a UniLock account, you agree to these terms. If you do not agree, do not use the service.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="section-heading" style={{ marginTop: '3rem' }}>Eligibility</h2>
            <p className="about-mission-text" style={{ marginTop: '1rem' }}>
              UniLock is built for students of the University of Lagos. You must be a current or former student,
              or have a valid UNILAG email address (or an email registered through an approved partner programme).
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="section-heading" style={{ marginTop: '3rem' }}>Account</h2>
            <p className="about-mission-text" style={{ marginTop: '1rem' }}>
              You are responsible for keeping your password secure and for all activity under your account. If you
              suspect unauthorised access, reset your password immediately and notify us.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="section-heading" style={{ marginTop: '3rem' }}>Subscriptions &amp; Billing</h2>
            <p className="about-mission-text" style={{ marginTop: '1rem' }}>
              Paid plans (Basic, Premium) are billed monthly, per-semester, or yearly as selected at checkout.
              Payments are processed by Paystack. You can cancel anytime — access continues until the end of your
              current billing period. Refunds are handled on a case-by-case basis.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="section-heading" style={{ marginTop: '3rem' }}>Acceptable Use</h2>
            <p className="about-mission-text" style={{ marginTop: '1rem' }}>
              Do not share your account, attempt to game the study algorithms, scrape content, upload malicious
              material, or use UniLock for anything other than personal academic study. We reserve the right to
              terminate accounts that violate these rules.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="section-heading" style={{ marginTop: '3rem' }}>Content</h2>
            <p className="about-mission-text" style={{ marginTop: '1rem' }}>
              Past questions and study materials on UniLock are sourced from student contributions and public-domain
              archives. We do not claim ownership of UNILAG&apos;s past examination papers. If you believe content
              infringes your copyright, contact us and we will review promptly.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="section-heading" style={{ marginTop: '3rem' }}>Limitation of Liability</h2>
            <p className="about-mission-text" style={{ marginTop: '1rem' }}>
              UniLock provides study tools and practice materials. We do not guarantee exam performance. To the
              maximum extent permitted by law, we are not liable for any indirect or consequential loss arising
              from your use of the platform.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="section-heading" style={{ marginTop: '3rem' }}>Changes</h2>
            <p className="about-mission-text" style={{ marginTop: '1rem' }}>
              We may update these terms from time to time. Registered users will be notified of significant changes
              by email. Continued use after changes take effect means you accept the updated terms.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <h2 className="section-heading" style={{ marginTop: '3rem' }}>Contact</h2>
            <p className="about-mission-text" style={{ marginTop: '1rem' }}>
              Questions? Write to{" "}
              <Link href="mailto:support@unilock.online" className="auth-link">support@unilock.online</Link>.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </>
  )
}
