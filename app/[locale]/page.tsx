"use client"

import FAQSection from "@/components/faq-section"
import CTASection from "@/components/cta-section"
import BlueCTASection from "@/components/blue-cta-section"
import SplitBlueSection from "@/components/split-blue-section"
import FooterSection from "@/components/footer-section"
import TestimonialsSection from "@/components/TestimonialsSection"
import Feature from "@/components/feature"
import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import BentoGridSection from "@/components/bento-grid-section"
import Feature2 from "@/components/feature2"
import { useTranslations } from "next-intl"

export default function LandingPage() {
    const t = useTranslations('HomePage')

    return (
        <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
            <div className="relative flex flex-col justify-start items-center w-full">
                {/* Navigation */}
                <Navigation />
                {/* Main container with proper margins */}
                <div className="md:px-8 lg:px-0 w-[94vw] md:w-6xl max-w-6xl relative flex flex-col justify-start items-start min-h-screen border-l border-r border-[#E0DEDB]/80">

                    {/* Hero Section */}
                    <section id="hero">
                        <HeroSection />
                    </section>

                    {/* Bento Grid Section - How it Works */}
                    <section id="how-it-works" className="w-full">
                        <BentoGridSection />
                    </section>

                    <Feature2
                        isReverse={false}
                        title={
                            <h2 className="">
                                {t('feature1.title')}
                                <span className="inline-block font-bold px-0.5 bg-linear-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">{t('feature1.titleHighlight')}</span> {t('feature1.titleEnd')}
                            </h2>
                        }
                        description={<>{t('feature1.description')}</>}
                        buttonText={t('feature1.button')}
                        imageSrc="/workout.png"
                    />




                    {/* Features Section */}
                    <section id="features" className="w-full">
                        <Feature
                            isReverse={true}
                            title={
                                <h2>
                                    {t('feature2.title')} <span className="font-bold px-1 pl-1 bg-linear-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">{t('feature2.titleHighlight')}</span> {t('feature2.titleEnd')}
                                </h2>
                            }
                            description={<>{t('feature2.description')}</>}
                            buttonText={t('feature2.button')}
                            imageSrc="/workout-in-progres.png"
                        />
                    </section>

                    <Feature
                        isReverse={false}
                        title={
                            <h2>
                                {t('feature3.title')} <span className="font-bold px-1 pl-1 bg-linear-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">{t('feature3.titleHighlight')}</span> {t('feature3.titleEnd')}
                            </h2>
                        }
                        description={<>{t('feature3.description')}</>}
                        buttonText={t('feature3.button')}
                        imageSrc="/workout.png"
                    />

                    {/* Testimonials Section */}
                    <section id="testimonials" className="w-full">
                        <TestimonialsSection />
                    </section>

                    {/* Split Blue Section */}
                    <SplitBlueSection />

                    {/* Blue CTA Section */}
                    <BlueCTASection />

                    {/* FAQ Section */}
                    <section id="faq" className="w-full">
                        <FAQSection />
                    </section>

                    {/* CTA Section */}
                    <CTASection />

                    {/* Footer Section */}
                    <FooterSection />
                </div>
            </div>
        </div>
    )
}
