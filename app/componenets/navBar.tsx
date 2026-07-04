'use client'

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <nav className="nav-bar">
      <div className="nav-container">
        <Link href="/" className="nav__logo">
          <Image width={32} height={32} src="/logo-nobg.png" alt="UniLock" />
          <span className="nav__logo-text">UniLock</span>
        </Link>

        <div className="nav__links">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
          <Link href="https://unilag.edu.ng" target="_blank" rel="noopener" className="nav-link">
            UNILAG Portal
          </Link>
        </div>

        <div className="nav__actions">
          <Link href="/login" className="btn btn-ghost btn-sm">
            Log In
          </Link>
          <Link href="/register" className="btn btn-primary btn-sm">
            Get Started Free
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="nav__hamburger"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="nav__mobile-menu">
          <div className="nav__mobile-links">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="nav__mobile-link"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://unilag.edu.ng"
              target="_blank"
              rel="noopener"
              onClick={() => setMobileOpen(false)}
              className="nav__mobile-link"
            >
              UNILAG Portal
            </Link>
          </div>
          <div className="nav__mobile-actions">
            <Link href="/login" onClick={() => setMobileOpen(false)} className="btn btn-ghost">
              Log In
            </Link>
            <Link href="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary">
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}