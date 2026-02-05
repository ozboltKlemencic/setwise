"use client"

import FAQSection from "../components/faq-section"
import CTASection from "../components/cta-section"
import BlueCTASection from "../components/blue-cta-section"
import SplitBlueSection from "../components/split-blue-section"
import FooterSection from "../components/footer-section"
import TestimonialsSection from "@/components/TestimonialsSection"
import Feature from "@/components/feature"
import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import BentoGridSection from "@/components/bento-grid-section"

export default function LandingPage() {

  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
      <div className="relative flex flex-col justify-start items-center w-full">
        {/* Navigation */}
        <Navigation />
        {/* Main container with proper margins */}
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-6xl relative flex flex-col justify-start items-start min-h-screen  border-l border-r border-[#E0DEDB]/80">

          {/* Hero Section */}

          <HeroSection />

          {/* Bento Grid Section */}
          <BentoGridSection />

          {/* Documentation Section 
              <DocumentationSection />

*/}


          {/* Features Section 
              <FeaturesSection />
*/}
          {/* Feature 1: Smart Logging */}
          <Feature
            isReverse={false}
            title="Train with precision. Progress with proof."
            description={
              <>
                Log sets in seconds — with

                **RPE/RIR, tempo, ROM, and intensifiers**

                built in. Add notes per exercise or per set, then

                **instantly compare every set to your last workout**

                to see what improved.
              </>
            }
            buttonText="Start training"
            imageSrc="/demo-phone-pic.avif"
          />


          {/* Testimonials Section */}
          <TestimonialsSection />
          {/* Feature 2: Analytics */}
          <Feature
            isReverse={false}
            title="From copy-paste to a workout."
            description={
              <>
                Paste your plan we structure it automatically. No more manual setup, no more formatting headaches - just clean, organized workout ready to log.
              </>
            }
            buttonText="Create workout"
            imageSrc="/demo-phone-pic.avif"
          />

          <Feature
            isReverse={true}
            title="See your progress at a glance."
            description={
              <>
                Charts that make trends obvious - filter by exercise and time to track every lift.
              </>
            }
            buttonText="View progress"
            imageSrc="/demo-phone-pic.avif"
          />

          {/* Split Blue Section */}
          <SplitBlueSection />

          {/* Blue CTA Section */}
          <BlueCTASection />

          {/* FAQ Section */}
          <FAQSection />

          {/* CTA Section */}
          <CTASection />

          {/* Footer Section */}
          <FooterSection />
        </div>
      </div>
    </div>

  )
}
