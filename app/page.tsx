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
import Feature2 from "@/components/feature2"

export default function LandingPage() {

  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
      <div className="relative flex flex-col justify-start items-center w-full">
        {/* Navigation */}
        <Navigation />
        {/* Main container with proper margins */}
        <div className="   md:px-8 lg:px-0 w-[94vw] md:w-6xl max-w-6xl relative flex flex-col justify-start items-start min-h-screen  border-l border-r border-[#E0DEDB]/80">

          {/* Hero Section */}

          <HeroSection />

          {/* Bento Grid Section */}
          <BentoGridSection />

          <Feature2
            isReverse={false}
            title={
              <h2 className="" >
                Train with precision.
                <span className="font-bold px-1 pl-2 bg-linear-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Progress</span>  with <span className="font-bold px-1">proof.</span>
              </h2>
            }
            description={
              <>
                Log sets in seconds - with

                <span className="font-bold px-1">RPE/RIR, tempo, ROM, and intensifiers</span>

                built in. Add notes per exercise or per set, then

                <span className="font-bold px-1">instantly compare every set to your last workout</span>

                to see what improved.
              </>
            }
            buttonText="Start training"
            imageSrc="/workout.png"
          />


          {/* Testimonials Section */}
          <TestimonialsSection />
          {/* Feature 2: Analytics */}
          <Feature
            isReverse={false}
            title={<h2>From  <span className="font-bold px-1 pl-1 bg-linear-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">copy-paste</span>  to a workout.</h2>}

            description={
              <>
                Paste your plan we structure it automatically. No more manual setup, no more formatting headaches - just clean, organized workout ready to log.
              </>
            }
            buttonText="Create workout"
            imageSrc="/workout-in-progres.png"
          />

          <Feature
            isReverse={true}
            title={<h2>See your <span className="font-bold px-1 pl-1 bg-linear-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">progress</span> at a glance</h2>}
            description={
              <>
                Charts that make trends obvious - filter by exercise and time to track every lift. Advanced analytics help you understand your performance patterns and make informed training decisions.
              </>
            }
            buttonText="View progress"
            imageSrc="/workout.png"
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
