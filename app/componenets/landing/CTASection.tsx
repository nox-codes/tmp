import Link from "next/link"
import ScrollReveal from "../scrollReveal"

export default function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-bg-pattern" />
      <div className="section-container">
        <ScrollReveal>
          <div className="cta-content">
            <h2 className="cta-heading">Ready to Lock Into Better Grades?</h2>
            <p className="cta-subtext">
              Join thousands of UNILAG students already studying smarter. Start free today &mdash; no credit card required.
            </p>
            <div className="cta-cta-group">
              <Link href="/register" className="btn-cta">
                Get Started For Free
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/pricing" className="btn-cta-ghost">
                View Pricing
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}