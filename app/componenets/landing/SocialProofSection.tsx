import ScrollReveal from "../scrollReveal"

const stats = [
  { value: "10,000+", label: "Active Students" },
  { value: "50,000+", label: "CBT Sessions" },
  { value: "95%", label: "Pass Rate" },
  { value: "4.8", label: "★ Rating" },
]

const testimonials = [
  {
    quote: "This platform completely changed how I study. I went from a 2.8 to a 4.2 GPA in one semester. The CBT mode is a game-changer for exams.",
    name: "Adewale O.",
    role: "Computer Science, 300L",
  },
  {
    quote: "Being able to practice past questions on my phone during commute was incredible. I scored the highest in my department for MTH 101.",
    name: "Fatimah B.",
    role: "Medicine, 200L",
  },
  {
    quote: "The study groups feature helped me connect with serious students in my course. We push each other to study every day with the streak system.",
    name: "Chinedu E.",
    role: "Business Admin, 400L",
  },
]

export default function SocialProofSection() {
  return (
    <section className="social-proof-section">
      <div className="section-container">
        <ScrollReveal>
          <div className="text-center">
            <span className="section-label">Social Proof</span>
            <h2 className="section-heading">Trusted by Thousands of UNILAG Students</h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="stats-grid mt-12">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-item">
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <ScrollReveal key={testimonial.name}>
              <div className="testimonial-card">
                <p className="testimonial-quote">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar"></div>
                  <div>
                    <p className="testimonial-name">{testimonial.name}</p>
                    <p className="testimonial-role">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}