'use client'

import { useState } from "react"
import ScrollReveal from "../componenets/scrollReveal"
import Footer from "../componenets/landing/Footer"
import ComingSoonAction from "../componenets/ComingSoonAction"
import {
  HiOutlineMail,
  HiOutlineChat,
  HiOutlineLocationMarker,
  HiOutlinePhone,
} from "react-icons/hi"

const faqs = [
  { q: "Do I need a UNILAG email to sign up?", a: "It helps us verify you're a student and unlock UNILAG-specific course content faster, but you can sign up with any email and verify later via your matric number." },
  { q: "Is the free plan really free forever?", a: "Yes. You get 3 courses, 20 daily CBT questions, basic analytics, and streak tracking with no time limit. You can upgrade whenever you're ready." },
  { q: "Where do the past questions come from?", a: "From a mix of official UNILAG archives, contributions by course reps, and verified senior-student uploads. Every question is reviewed before going live." },
  { q: "Can my whole department use UniLock together?", a: "Absolutely. Our Department plan gives a whole department a private leaderboard, bulk enrollment, and an admin dashboard. Contact us." },
  { q: "How do I cancel?", a: "From Settings → Billing. No emails, no phone calls, no guilt trips. One click." },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    ;(e.target as HTMLFormElement).reset()
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <>
      <section className="contact-hero">
        <div className="hero-grid-bg" />
        <div className="hero-glow" />
        <div className="section-container contact-hero-inner">
          <ScrollReveal>
            <span className="section-label">Contact</span>
            <h1 className="about-hero-heading">
              Let&apos;s talk. <span className="hero-heading-accent">We actually read every message.</span>
            </h1>
            <p className="about-hero-sub">
              Found a bug, have a feature idea, want to partner with us, or just want to say hi? Pick any path below.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="about-section">
        <div className="section-container">
          <div className="contact-grid">
            {/* Left: form */}
            <ScrollReveal>
              <form className="contact-card" onSubmit={onSubmit}>
                <h2 className="contact-card-title">Send us a message</h2>
                <p className="contact-card-sub">Typical response time: under 12 hours.</p>

                <div className="contact-field-row">
                  <div className="contact-field">
                    <label htmlFor="name">Full name</label>
                    <input id="name" name="name" type="text" placeholder="Ayodele Adekunle" required />
                  </div>
                  <div className="contact-field">
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" placeholder="you@unilag.edu.ng" required />
                  </div>
                </div>

                <div className="contact-field">
                  <label htmlFor="topic">Topic</label>
                  <select id="topic" name="topic" defaultValue="general">
                    <option value="general">General enquiry</option>
                    <option value="support">Support / bug</option>
                    <option value="partnership">Partnership</option>
                    <option value="department">Department plan</option>
                    <option value="press">Press</option>
                  </select>
                </div>

                <div className="contact-field">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={5} placeholder="Tell us what's on your mind..." required />
                </div>

                <button type="submit" className="btn btn-primary contact-submit">
                  {submitted ? "✓ Sent — we'll reply soon" : "Send message"}
                </button>
              </form>
            </ScrollReveal>

            {/* Right: channels + office */}
            <div className="contact-side">
              <ScrollReveal>
                <div className="contact-channels">
                  <a href="mailto:support@unilock.online" className="contact-channel">
                    <div className="contact-channel-icon"><HiOutlineMail /></div>
                    <div>
                      <p className="contact-channel-label">Email</p>
                      <p className="contact-channel-value">support@unilock.online</p>
                    </div>
                  </a>
                  <ComingSoonAction className="contact-channel" title="Live chat">
                    <div className="contact-channel-icon"><HiOutlineChat /></div>
                    <div>
                      <p className="contact-channel-label">Live chat</p>
                      <p className="contact-channel-value">Mon–Sat · 9am–10pm WAT</p>
                    </div>
                  </ComingSoonAction>
                  <a href="tel:+2348000000000" className="contact-channel">
                    <div className="contact-channel-icon"><HiOutlinePhone /></div>
                    <div>
                      <p className="contact-channel-label">Phone</p>
                      <p className="contact-channel-value">+234 800 000 0000</p>
                    </div>
                  </a>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="contact-office">
                  <div className="contact-office-icon"><HiOutlineLocationMarker /></div>
                  <div>
                    <p className="contact-office-title">Find us in Akoka</p>
                    <p className="contact-office-text">
                      UniLock HQ · UNILAG Innovation Hub<br />
                      Akoka, Yaba, Lagos · Nigeria
                    </p>
                    <p className="contact-office-hours">Open most days. Just send a DM first.</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="about-section contact-faq-section">
        <div className="section-container">
          <ScrollReveal>
            <div className="text-center">
              <span className="section-label">FAQ</span>
              <h2 className="section-heading">Quick answers</h2>
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
