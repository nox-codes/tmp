'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./lib/auth-context"
import HeroSection from "./componenets/landing/HeroSection"
import FeaturesSection from "./componenets/landing/FeaturesSection"
import HowItWorksSection from "./componenets/landing/HowItWorksSection"
import PricingSection from "./componenets/landing/PricingSection"
import SocialProofSection from "./componenets/landing/SocialProofSection"
import CTASection from "./componenets/landing/CTASection"
import Footer from "./componenets/landing/Footer"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard")
    }
  }, [user, loading, router])

  if (loading) return null
  if (user) return null

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <SocialProofSection />
      <CTASection />
      <Footer />
    </>
  )
}
