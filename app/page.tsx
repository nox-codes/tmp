import HeroSection from "./componenets/landing/HeroSection"
import FeaturesSection from "./componenets/landing/FeaturesSection"
import HowItWorksSection from "./componenets/landing/HowItWorksSection"
import PricingSection from "./componenets/landing/PricingSection"
import SocialProofSection from "./componenets/landing/SocialProofSection"
import CTASection from "./componenets/landing/CTASection"
import Footer from "./componenets/landing/Footer"

export default function Home() {
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