import Image from "next/image"
import Link from "next/link"

const productLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "CBT Mode", href: "#" },
  { label: "Study Groups", href: "#" },
]

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "#" },
  { label: "Careers", href: "#" },
]

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
]

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <Link href="/" className="footer-brand">
              <Image width={32} height={32} src="/logo.svg" alt="UniLock" />
              <span className="footer-brand-text">UniLock</span>
            </Link>
            <p className="footer-brand-description">
              The #1 academic platform for UNILAG students. Study smarter, not harder.
            </p>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Product</h4>
            <div className="footer-links">
              {productLinks.map((link) => (
                <Link key={link.label} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Company</h4>
            <div className="footer-links">
              {companyLinks.map((link) => (
                <Link key={link.label} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Legal</h4>
            <div className="footer-links">
              {legalLinks.map((link) => (
                <Link key={link.label} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} UniLock. All rights reserved. Built for UNILAG.</p>
        </div>
      </div>
    </footer>
  )
}