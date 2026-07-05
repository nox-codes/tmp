'use client'

import Link from "next/link"
import { useState } from "react"
import ScrollReveal from "../componenets/scrollReveal"
import Footer from "../componenets/landing/Footer"
import { HiCheck, HiX } from "react-icons/hi"
import { checkout, Tier } from "../lib/api"
import { useAuth } from "../lib/auth-context"
import { useRouter } from "next/navigation"
import ComingSoonAction from "../componenets/ComingSoonAction"

type Cycle = "monthly" | "yearly"

const monthlyPlans = [
  {
    name: "Free",
    price: "₦0",
    period: "/forever",
    description: "Perfect for first-years finding their feet.",
    features: ["3 courses", "20 CBT questions / day", "Basic analytics", "Study streaks", "Community access"],
    cta: "Get started",
    href: "/register",
    tier: null,
    popular: false,
  },
  {
    name: "Basic",
    price: "₦500",
    period: "/month",
    description: "For the serious student who wants every tool.",
    features: ["All courses", "Unlimited CBT", "Full analytics dashboard", "Performance tracking", "Study groups", "Priority support"],
    cta: "Start 7-day trial",
    href: "/register",
    tier: "HALF" as Tier,
    popular: true,
  },
  {
    name: "Premium",
    price: "₦1,000",
    period: "/month",
    description: "Everything in Basic plus coaching.",
    features: ["Everything in Basic", "1-on-1 study coaching", "Custom study plans", "Offline downloads", "Early feature access"],
    cta: "Get Pro",
    href: "/register",
    tier: "FULL" as Tier,
    popular: false,
  },
  {
    name: "Department",
    price: "₦15,000",
    period: "/session",
    description: "Whole-department plan with admin tools.",
    features: ["Everything in Pro", "Department-wide analytics", "Department leaderboard", "Admin dashboard", "Bulk enrollment"],
    cta: "Contact sales",
    href: "/contact",
    tier: null,
    popular: false,
  },
]

const yearlyPlans = monthlyPlans.map(p => {
  if (p.name === "Basic") return { ...p, price: "₦4,800", period: "/year", description: "20% off vs monthly. Best value." }
  if (p.name === "Premium") return { ...p, price: "₦9,600", period: "/year", description: "Lock in a full session of savings." }
  return p
})

const comparisonRows: { feature: string; values: (string | boolean)[] }[] = [
  { feature: "Courses available",          values: ["3", "All", "All", "All"] },
  { feature: "CBT questions per day",      values: ["20", "Unlimited", "Unlimited", "Unlimited"] },
  { feature: "Past questions archive",     values: [false, true, true, true] },
  { feature: "Performance analytics",      values: ["Basic", "Full", "Full + Coaching", "Department-wide"] },
  { feature: "Study groups",               values: [false, true, true, true] },
  { feature: "Offline downloads",          values: [false, false, true, true] },
  { feature: "1-on-1 study coaching",      values: [false, false, true, true] },
  { feature: "Priority support",           values: [false, true, true, true] },
  { feature: "Admin dashboard",            values: [false, false, false, true] },
]

const faqs = [
  { q: "Is there a free trial on paid plans?", a: "Yes — Basic and Pro both come with a 7-day free trial. We don't charge until day 8 and you can cancel anytime." },
  { q: "What payment methods do you accept?",  a: "All major Nigerian debit cards, bank transfer, and USSD — all secured via Paystack." },
  { q: "Can I switch plans later?",            a: "Yes, upgrade or downgrade anytime from Settings → Billing. We prorate fairly." },
  { q: "Do you offer student discounts?",      a: "Every plan IS the student discount. We don't have separate pricing for non-students because we don't sell to non-students." },
]

export default function Pricing() {
  const { user } = useAuth()
  const router = useRouter()
  const [cycle, setCycle] = useState<Cycle>("monthly")
  const [loadingPlan, setLoadingPlan] = useState("")
  const [error, setError] = useState("")
  const plans = cycle === "yearly" ? yearlyPlans : monthlyPlans

  async function handleCheckout(planName: string, tier: Tier | null) {
    if (!tier || tier === "FREE") return

    if (!user) {
      sessionStorage.setItem("pending_checkout", tier)
      router.push("/login")
      return
    }

    setError("")
    setLoadingPlan(planName)
    try {
      const response = await checkout(tier)
      window.location.href = response.checkoutUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start checkout right now.")
    } finally {
      setLoadingPlan("")
    }
  }

  return (
    <>
      <section className="pricing-page-hero">
        <div className="hero-grid-bg" />
        <div className="hero-glow" />
        <div className="section-container text-center pricing-page-hero-inner">
          <ScrollReveal>
            <span className="section-label">Pricing</span>
            <h1 className="about-hero-heading">
              Pricing that <span className="hero-heading-accent">a student can actually afford.</span>
            </h1>
            <p className="about-hero-sub mx-auto">
              No hidden charges. No annoying upsells. Cancel any time, no questions asked.
            </p>

            <div className="pricing-toggle">
              <button
                onClick={() => setCycle("monthly")}
                className={`pricing-toggle-btn ${cycle === "monthly" ? "pricing-toggle-active" : ""}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setCycle("yearly")}
                className={`pricing-toggle-btn ${cycle === "yearly" ? "pricing-toggle-active" : ""}`}
              >
                Yearly <span className="pricing-toggle-save">Save 20%</span>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="pricing-section pricing-page-tiers">
        <div className="section-container">
          <div className="pricing-grid">
            {plans.map((plan) => (
              <ScrollReveal key={plan.name}>
                <div className={`pricing-card ${plan.popular ? "pricing-card--popular" : ""}`}>
                  {plan.popular && <span className="pricing-popular-badge">Most Popular</span>}
                  <p className="pricing-tier-name">{plan.name}</p>
                  <p className="pricing-price">
                    {plan.price}
                    <span className="pricing-period">{plan.period}</span>
                  </p>
                  <p className="pricing-description">{plan.description}</p>
                  <div className="pricing-divider" />
                  <ul className="pricing-features">
                    {plan.features.map((feature) => (
                      <li key={feature} className="pricing-feature">
                        <HiCheck className="pricing-feature-check h-4 w-4" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.tier ? (
                    <button
                      type="button"
                      onClick={() => handleCheckout(plan.name, plan.tier)}
                      className={`btn ${plan.popular ? "btn-primary" : "btn-secondary"} pricing-cta`}
                    >
                      {loadingPlan === plan.name ? "Opening checkout..." : plan.cta}
                    </button>
                  ) : plan.name === "Department" ? (
                    <ComingSoonAction
                      className="btn btn-secondary pricing-cta"
                      title="Department billing"
                      message="The backend currently supports individual tier checkout. Department sales and bulk enrollment do not have API routes yet."
                    >
                      {plan.cta}
                    </ComingSoonAction>
                  ) : (
                    <Link href={plan.href} className={`btn ${plan.popular ? "btn-primary" : "btn-secondary"} pricing-cta`}>
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          {error && <p className="pricing-feedback">{error}</p>}

          <div className="pricing-paystack">
            <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secure payments powered by Paystack</span>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="about-section pricing-compare-section">
        <div className="section-container">
          <ScrollReveal>
            <div className="text-center">
              <span className="section-label">Compare plans</span>
              <h2 className="section-heading">Pick what matches your level</h2>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="pricing-compare-wrap">
              <table className="pricing-compare">
                <thead>
                  <tr>
                    <th></th>
                    <th>Free</th>
                    <th>Basic</th>
                    <th>Pro</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.feature}>
                      <td className="pricing-compare-feature">{row.feature}</td>
                      {row.values.map((v, i) => (
                        <td key={i}>
                          {typeof v === "boolean" ? (
                            v ? <HiCheck className="pricing-compare-check" /> : <HiX className="pricing-compare-x" />
                          ) : (
                            <span>{v}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="about-section contact-faq-section">
        <div className="section-container">
          <ScrollReveal>
            <div className="text-center">
              <span className="section-label">FAQ</span>
              <h2 className="section-heading">Common questions</h2>
            </div>
          </ScrollReveal>
          <div className="contact-faq">
            {faqs.map((f) => (
              <ScrollReveal key={f.q}>
                <details className="contact-faq-item">
                  <summary>
                    <span>{f.q}</span>
                    <span className="contact-faq-chev">+</span>
                  </summary>
                  <p>{f.a}</p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
