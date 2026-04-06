import ScrollReveal from "../scrollReveal"

const features = [
  {
    icon: "📚",
    title: "Curated Course Library",
    description: "Access meticulously organized course materials tailored to your department and level — all aligned with UNILAG curriculum.",
  },
  {
    icon: "🎯",
    title: "CBT Mode",
    description: "Practice with real past exam questions in timed, exam-like conditions that mirror the actual UNILAG CBT experience.",
  },
  {
    icon: "📊",
    title: "Performance Analytics",
    description: "Track your strengths and weaknesses across subjects with detailed analytics and personalized study recommendations.",
  },
  {
    icon: "🧠",
    title: "Focused Study Mode",
    description: "Eliminate distractions with a zen-like study environment built for deep, uninterrupted concentration.",
  },
  {
    icon: "🔥",
    title: "Study Streaks",
    description: "Build and maintain daily study habits with streak tracking, achievement badges, and motivational rewards.",
  },
  {
    icon: "👥",
    title: "Peer Study Groups",
    description: "Join or create study groups with classmates, share notes, compete on leaderboards, and learn together.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="features-section">
      <div className="section-container">
        <ScrollReveal>
          <div className="text-center">
            <span className="section-label">Features</span>
            <h2 className="section-heading">Everything You Need to Study Smarter</h2>
            <p className="section-subtext">
              Built by UNILAG students, for UNILAG students. Every feature is designed to
              improve your grades and make studying less stressful.
            </p>
          </div>
        </ScrollReveal>

        <div className="features-grid">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title}>
              <div className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="feature-icon">
                  <span>{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}