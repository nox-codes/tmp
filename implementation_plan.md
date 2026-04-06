# Implementation Plan

[Overview]
Rebuild the UniLock frontend landing pages with a premium design system using Tailwind CSS v4, proper font loading via @fontsource, and semantic CSS classes — eliminating the next/font/google build failure.

The current codebase has a CSS pipeline crash caused by `next/font/google` failing to fetch Plus Jakarta Sans during build. Additionally, there are inline Tailwind utility classes scattered across JSX files violating the design system rules. This plan restructures the entire frontend to use `@fontsource/plus-jakarta-sans`, semantic CSS in `globals.css` via `@layer components`, and a clean component architecture with exactly one file per section.

[Types]
No TypeScript type changes are required — all components remain as existing React functional components with standard props.

The project already has proper TypeScript configuration. All section components will be React.FC returning JSX. The `dynamicNav.jsx` and `conditionalSideBar.jsx` stay as `.jsx` to preserve existing logic without type migration overhead.

[Files]

**FILES TO DELETE (all under app/componenets/landing/ and root):**
- `app/componenets/landing/HeroSection.tsx` (rebuild from scratch)
- `app/componenets/landing/FeaturesSection.tsx` (rebuild from scratch)
- `app/componenets/landing/HowItWorksSection.tsx` (rebuild from scratch)
- `app/componenets/landing/PricingSection.tsx` (rebuild from scratch)
- `app/componenets/landing/SocialProofSection.tsx` (rebuild from scratch)
- `app/componenets/landing/CTASection.tsx` (rebuild from scratch)
- `app/componenets/landing/Footer.tsx` (rebuild from scratch)
- `app/componenets/navBar.tsx` (rebuild as landing nav)
- `app/componenets/Ui/Button.tsx` (replaced by CSS classes)
- `app/componenets/scrollReveal.tsx` (will be rebuilt as single utility)
- `app/globals.css` (rebuild from scratch with correct @source directive)
- `app/page.tsx` (rebuild — no nav, only section composition)

**FILES TO MODIFY:**
- `app/layout.tsx` — Remove `Plus_Jakarta_Sans` import and font variable. Remove inline className Tailwind utilities. Keep DynamicNav and ConditionalSideBar imports. Add `fontFamily` CSS variable pointing to `--font-sans`.

**FILES TO CREATE/KEEP:**
- `app/globals.css` — Complete rewrite with `@import "tailwindcss"`, `@source`, font import, `@layer base`, `@layer components` with all semantic class names
- `app/layout.tsx` — Stripped of font imports, minimal root layout
- `app/page.tsx` — Fragment-wrapped section imports only, NO NavBar
- `app/componenets/dynamicNav.jsx` — KEEP AS-IS (already has PUBLIC_ROUTES logic)
- `app/componenets/conditionalSideBar.jsx` — KEEP AS-IS
- `app/componenets/sideBar.tsx` — KEEP (placeholder, may need redesign later)
- `app/componenets/userNav.tsx` — KEEP (dashboard nav already built)
- `app/componenets/navBar.tsx` — REBUILD for landing page navigation
- `app/componenets/scrollReveal.tsx` — Single Intersection Observer utility
- `app/componenets/landing/HeroSection.tsx` — Premium hero with mockup
- `app/componenets/landing/FeaturesSection.tsx` — 6 feature cards
- `app/componenets/landing/HowItWorksSection.tsx` — 3 steps connected
- `app/componenets/landing/PricingSection.tsx` — 4 tiers
- `app/componenets/landing/SocialProofSection.tsx` — Stats + testimonials
- `app/componenets/landing/CTASection.tsx` — Full-width gradient CTA
- `app/componenets/landing/Footer.tsx` — Dark footer columns

[Functions]

**layout.tsx changes:**
- Remove `import { Plus_Jakarta_Sans } from "next/font/google"`
- Remove `const font = Plus_Jakarta_Sans(...)`
- Change `<html className={\`\${font.variable} h-full antialiased\`}>` to `<html lang="en" className="h-full">`
- Change `<body className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">` to `<body className="min-h-screen flex flex-col">`
- Keep DynamicNav, ConditionalSideBar imports

**page.tsx changes:**
- Remove ALL NavBar import
- Import all 7 landing section components
- Return fragment containing sections only: `<> <HeroSection /> <FeaturesSection /> ... <Footer /> </>`

**globals.css complete rebuild:**
```css
@import "tailwindcss";
@source "../app/**/*.{tsx,jsx,ts,js}";
@import "@fontsource/plus-jakarta-sans";
```
Then `@layer base` for font-family, colors. `@layer components` for ALL component styles: `.nav-bar`, `.nav-container`, `.nav__logo`, `.nav__logo-text`, `.nav__links`, `.nav-link`, `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.hero-section`, `.hero-content`, `.hero-badge`, `.hero-heading`, `.hero-subtext`, `.hero-cta-group`, `.hero-mockup`, `.features-section`, `.section-label`, `.section-heading`, `.section-subtext`, `.feature-card`, `.how-it-works-section`, `.steps-container`, `.step`, `.step-number`, `.step-content`, `.step-connector`, `.pricing-section`, `.pricing-grid`, `.pricing-card`, `.pricing-badge`, `.social-proof-section`, `.stats-grid`, `.stat-item`, `.stat-value`, `.stat-label`, `.testimonial-card`, `.cta-section`, `.footer-section`, etc.

All CSS `@keyframes` for animations: `fadeIn`, `float`, `slideUp`, `pulse`, `glow`, `scrollReveal`.

**scrollReveal.tsx:**
```tsx
'use client'
import { useEffect, useRef, type ReactNode } from 'react'
export function ScrollReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('scroll-reveal-visible'); observer.unobserve(el) } },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className={className}>{children}</div>
}
```

**navBar.tsx rebuild:**
Public landing nav with: UniLock logo + text link, nav links (About, Features, Pricing, Contact), and action buttons (Sign In, Get Started). All using semantic class names from globals.css.

**HeroSection.tsx:**
- Badge pill: "Built for UNILAG Students"
- H1: "Lock Into Your University's Resources With Ease"
- Subtext describing the platform
- Two CTAs: "Get Started Free" (primary), "View Pricing" (secondary)
- Floating dashboard mockup card with animated stats

**FeaturesSection.tsx:**
- Section label, heading, subtext
- 6 cards in 3x2 grid: Curated Course Library, CBT Mode, Performance Analytics, Focused Study Mode, Study Streaks, Peer Study Groups
- Each card: icon, title, description

**HowItWorksSection.tsx:**
- 3 steps with numbered circles
- Horizontal connector line between steps
- Steps: Sign Up with UNILAG Email, Access Your Study Materials, Study Smarter with Analytics

**PricingSection.tsx:**
- 4 tiers: Free, Essentials (Most Popular badge), Pro, Enterprise
- Each with price, features list, CTA button
- Paystack security badge below grid

**SocialProofSection.tsx:**
- Stats row: 10,000+ students, 50,000+ CBT sessions, 95% pass rate, 4.8★ rating
- 3 testimonial cards with name, course, quote

**CTASection.tsx:**
- Full-width gradient background
- Headline, subtext, single CTA button
- Subtle animated background element

**Footer.tsx:**
- Dark background
- 4 columns: Logo + description, Product links, Company links, Legal links
- Copyright bar at bottom

[Classes]
No changes to existing classes. All new CSS class names follow BEM-inspired convention (block-element-modifier) defined in `globals.css` `@layer components`.

[Dependencies]
Add `@fontsource/plus-jakarta-sans` via `npm install @fontsource/plus-jakarta-sans`. No other new packages required. Remove `next/font/google` usage entirely. No animation libraries — all CSS `@keyframes`.

[Testing]
After all files are written, run `npm run dev` and verify: (1) dev server starts without CSS errors, (2) Network tab shows CSS chunk with `@fontsource` content, (3) all sections render, (4) animations trigger on scroll, (5) responsive layout works on mobile.

[Implementation Order]
1. Install `@fontsource/plus-jakarta-sans`
2. Delete old component files, old globals.css, old page.tsx
3. Rewrite `globals.css` with complete design system
4. Rewrite `layout.tsx` without font imports
5. Create `scrollReveal.tsx` utility
6. Rebuild `navBar.tsx`
7. Create `HeroSection.tsx`
8. Create `FeaturesSection.tsx`
9. Create `HowItWorksSection.tsx`
10. Create `PricingSection.tsx`
11. Create `SocialProofSection.tsx`
12. Create `CTASection.tsx`
13. Create `Footer.tsx`
14. Create `page.tsx` composing all sections
15. Run `npm run dev` and verify CSS chunk loads correctly