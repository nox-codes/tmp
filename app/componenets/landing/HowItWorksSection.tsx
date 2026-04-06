import ScrollReveal from "../scrollReveal"

const steps = [
  {
    number: 1,
    title: "Sign Up with UNILAG Email",
    description: "Create your free account using your UNILAG student email for instant verification and access.",
  },
  {
    number: 2,
    title: "Access Your Study Materials",
    description: "Browse courses, select your department, and unlock curated content, past questions, and study guides.",
  },
  {
    number: 3,
    title: "Study Smarter with Analytics",
    description: "Track your progress, identify weak areas, and focus on what matters most before exams.",
  },
]

export default function HowItWorksSection() {
  return (
    <section className="how-it-works-section">
      <div className="section-container">
        <ScrollReveal>
          <div className="text-center">
            <span className="section-label">How It Works</span>
            <h2 className="section-heading">Three Steps to Better Grades</h2>
            <p className="section-subtext">
              Getting started takes less than 60 seconds. No credit card required.
            </p>
          </div>
        </ScrollReveal>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={step.number} className="step">
              <ScrollReveal>
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </ScrollReveal>
              {index < steps.length - 1 && (
                <div className="step-connector-line">
                  <svg viewBox="0 0 280 20" className="step-connector-svg">
                    <path
                      d="M0 10 Q70 0, 140 10 Q210 20, 280 10"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}