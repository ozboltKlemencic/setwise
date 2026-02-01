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

        {/* Main container with proper margins */}
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen border border-l border-r border-[#E0DEDB]/80">

          {/* Navigation */}
          <Navigation />

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
            title="Smart Workout Logging"
            description={
              <>
                Log your sets with ease using our intuitive interface.
                <br />
                Track RPE, rest times, and supersets without the hassle.
              </>
            }
            buttonText="Start Logging"
            imageSrc="/demo-phone-pic.avif"
          />


          {/* Testimonials Section */}
          <TestimonialsSection />
          {/* Feature 2: Analytics */}
          <Feature
            isReverse={true}
            title="Deep Performance Analytics"
            description={
              <>
                Visualize your progress with advanced charts and heatmaps.
                <br />
                Understand your strengths and optimize your training.
              </>
            }
            buttonText="View Analytics"
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
