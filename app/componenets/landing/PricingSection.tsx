import Link from "next/link"
import ScrollReveal from "../scrollReveal"

const plans = [
  {
    name: "Free",
    price: "₦0",
    period: "/month",
    description: "Perfect for getting started",
    features: ["Access 3 courses", "20 CBT questions/day", "Basic analytics", "Study streaks", "Community access"],
    cta: "Get Started",
    href: "/register",
    popular: false,
  },
  {
    name: "Basic",
    price: "₦2,500",
    period: "/month",
    description: "Most popular for serious students",
    features: ["All courses", "Unlimited CBT", "Full analytics dashboard", "Performance tracking", "Study groups", "Priority support"],
    cta: "Start Free Trial",
    href: "/register",
    popular: true,
  },
  {
    name: "Premium",
    price: "₦7,000",
    period: "/semester",
    description: "Save 20% for longer commitment",
    features: ["Everything in Basic", "1-on-1 study coaching", "Custom study plans", "Offline access", "Early feature access"],
    cta: "Get Pro",
    href: "/register",
    popular: false,
  },
  {
    name: "Department",
    price: "₦15,000",
    period: "/session",
    description: "Group plan for departments",
    features: ["Everything in Pro", "Department-wide analytics", "Department leaderboard", "Admin dashboard", "Bulk enrollment"],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
]

const CheckIcon = () => (
  <svg className="h-4 w-4 pricing-feature-check" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

export default function PricingSection() {
  return (
    <section className="pricing-section">
      <div className="section-container">
        <ScrollReveal>
          <div className="text-center">
            <span className="section-label">Pricing</span>
            <h2 className="section-heading">Plans That Fit Every Budget</h2>
            <p className="section-subtext">
              Start free and upgrade when you're ready. All paid plans come with a 7-day free trial.
            </p>
          </div>
        </ScrollReveal>

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
                      <CheckIcon />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`btn ${plan.popular ? "btn-primary" : "btn-secondary"} pricing-cta`}>
                  {plan.cta}
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="pricing-paystack">
          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Secure payments powered by Paystack</span>
        </div>
      </div>
    </section>
  )
}