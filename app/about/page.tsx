import Link from "next/link"
import ScrollReveal from "../componenets/scrollReveal"
import Footer from "../componenets/landing/Footer"

const values = [
  { icon: "🎯", title: "Student-First", text: "Every decision starts with one question: does this actually help a UNILAG student get better grades?" },
  { icon: "🇳🇬", title: "Made in Akoka",  text: "Built on campus by people who've cried over a Yaba bus delay and a 7am lecture in the same morning." },
  { icon: "🔓", title: "Open Knowledge",  text: "Past questions, study guides, and notes shouldn't be hoarded in a dusty WhatsApp group. They should be free, organized, searchable." },
  { icon: "⚡", title: "Move Fast",       text: "We ship updates weekly. If you ask for a feature on Monday, you might see it Friday." },
]

const team = [
  { name: "Ayodele Adekunle", role: "Co-founder · CS '24", initials: "AA", color: "from-teal-500 to-emerald-500" },
  { name: "Fatimah Bello",    role: "Design Lead · MSS '23", initials: "FB", color: "from-amber-500 to-rose-500" },
  { name: "Chinedu Eze",      role: "Engineering · EEE '24", initials: "CE", color: "from-violet-500 to-fuchsia-500" },
  { name: "Halima Yusuf",     role: "Content · ENG '25",     initials: "HY", color: "from-sky-500 to-teal-500" },
]

const milestones = [
  { year: "2023",  title: "Born in a UNILAG hostel",       text: "Three classmates, one cracked laptop, and a shared frustration with how scattered course materials were on campus." },
  { year: "Mar '24", title: "First 100 students",          text: "We launched a tiny beta to friends in CIS. Within two weeks we were begging classmates to stop sharing the link." },
  { year: "Sep '24", title: "1,000 students. CBT mode launches.", text: "We rebuilt past-question practice to feel like the real CBT hall. Pass rates jumped." },
  { year: "Now",     title: "10,000+ students",             text: "Across 12 faculties, with study groups, analytics, and a mission to make UNILAG the easiest big university to study at." },
]

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="about-hero">
        <div className="hero-grid-bg" />
        <div className="hero-glow" />
        <div className="section-container about-hero-inner">
          <ScrollReveal>
            <span className="section-label">Our Story</span>
            <h1 className="about-hero-heading">
              We built UniLock because <span className="hero-heading-accent">studying at UNILAG shouldn&apos;t be this hard.</span>
            </h1>
            <p className="about-hero-sub">
              No more begging seniors for past questions. No more searching five WhatsApp groups for one PDF.
              Just a calm, organized place to lock in and study.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission */}
      <section className="about-section">
        <div className="section-container about-mission">
          <ScrollReveal>
            <span className="section-label">Mission</span>
            <h2 className="section-heading">Make every UNILAG student a confident student.</h2>
          </ScrollReveal>
          <ScrollReveal>
            <p className="about-mission-text">
              Akoka has some of the brightest minds in West Africa &mdash; but talent gets buried under a system that&apos;s
              hard to navigate. Scattered materials. Inconsistent past-question access. Lectures that move too fast.
              UniLock exists to flatten that curve. Whether you&apos;re a 100L bewildered fresher or a final-year student
              chasing a first, you should be able to open one app and know exactly what to study, how to practice it,
              and how close you are to your goal.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="about-section about-values-section">
        <div className="section-container">
          <ScrollReveal>
            <div className="text-center">
              <span className="section-label">Values</span>
              <h2 className="section-heading">What we believe</h2>
            </div>
          </ScrollReveal>
          <div className="about-values-grid">
            {values.map((v) => (
              <ScrollReveal key={v.title}>
                <div className="about-value-card">
                  <div className="about-value-icon">{v.icon}</div>
                  <h3 className="about-value-title">{v.title}</h3>
                  <p className="about-value-text">{v.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="about-section">
        <div className="section-container">
          <ScrollReveal>
            <div className="text-center">
              <span className="section-label">Timeline</span>
              <h2 className="section-heading">From a dorm room to 10,000 students</h2>
            </div>
          </ScrollReveal>
          <div className="about-timeline">
            {milestones.map((m, i) => (
              <ScrollReveal key={m.title}>
                <div className="about-timeline-item">
                  <div className="about-timeline-dot">{i + 1}</div>
                  <div className="about-timeline-content">
                    <span className="about-timeline-year">{m.year}</span>
                    <h3 className="about-timeline-title">{m.title}</h3>
                    <p className="about-timeline-text">{m.text}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-section about-team-section">
        <div className="section-container">
          <ScrollReveal>
            <div className="text-center">
              <span className="section-label">Team</span>
              <h2 className="section-heading">The students behind it</h2>
              <p className="section-subtext mx-auto">
                Every person on this team studied (or is still studying) at UNILAG. We dogfood every feature in our own coursework.
              </p>
            </div>
          </ScrollReveal>
          <div className="about-team-grid">
            {team.map((t) => (
              <ScrollReveal key={t.name}>
                <div className="about-team-card">
                  <div className={`about-team-avatar bg-gradient-to-br ${t.color}`}>{t.initials}</div>
                  <h3 className="about-team-name">{t.name}</h3>
                  <p className="about-team-role">{t.role}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="section-container about-cta-inner">
          <h2 className="cta-heading">Want to build with us?</h2>
          <p className="cta-subtext">We&apos;re always looking for course reps, student ambassadors, and engineers who care about education.</p>
          <div className="cta-cta-group">
            <Link href="/contact" className="btn-cta">Get in touch</Link>
            <Link href="/register" className="btn-cta-ghost">Start studying</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
