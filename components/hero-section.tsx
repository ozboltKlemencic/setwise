"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { Iphone } from "@/components/ui/mobileDevices/Phone"
import { ShimmerButton } from "./ui/shimmer-button"

export default function HeroSection() {
  const t = useTranslations('HomePage')

  return (
    <div className="relative w-[98%] lg:max-w-6xl lg:w-[71.5rem] mx-auto">
      {/* Side gradient fade strips — warm-100 background bleed */}
      <div className="absolute top-0 -left-3 w-3 h-full bg-linear-to-b from-warm-100 to-transparent"></div>
      <div className="absolute top-0 -right-3 w-3 h-full bg-linear-to-b from-warm-100 to-transparent"></div>

      {/* Main hero container — brand gradient, 8pt grid padding */}
      <div className="w-full shadow-[rgba(55,50,47,0.12)] m-1 rounded-b-lg md:px-16 px-4 md:py-6 py-4 bg-linear-to-t from-brand-500/20 to-transparent mx-auto flex flex-col md:flex-row justify-between gap-y-8 md:gap-x-12 items-center relative z-10">
        {/* Radial gradient overlays — warm-100 ambient glow */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 blur-md" style={{ background: 'radial-gradient(circle at center, rgba(247, 245, 243, 0.8) 0%, rgba(247, 245, 243, 0) 80%)' }} />
        <div className="absolute top-0 left-0 w-full h-full -z-10 -translate-x-[5%] -translate-y-[20%] blur-xl" style={{ background: 'radial-gradient(circle at center, rgba(247, 245, 243, 0.9) 0%, rgba(247, 245, 243, 0) 80%)' }} />
        <div className="absolute top-0 left-0 w-full h-full -z-10 translate-x-[5%] -translate-y-[20%] blur-xl" style={{ background: 'radial-gradient(circle at center, rgba(247, 245, 243, 0.8) 0%, rgba(247, 245, 243, 0) 80%)' }} />

        {/* Left Column: Text — Apple HIG typography & spacing */}
        <div className="flex md:w-1/2 w-full lg:pb-8 pt-20 md:pt-0 py-4 gap-y-5 flex-col md:items-start items-center md:text-left text-center px-2 md:px-0">

          {/* Badge — text-caption-1 (12px, +0.01em tracking) */}
          <ShimmerButton className="border border-warm-300" shimmerDuration={"3s"} shimmerSize={"0.07em"} background={"rgba(247, 245, 243, 1)"} shimmerColor={"var(--brand-300)"}>
            <span className="text-center text-caption-1 font-medium whitespace-pre-wrap text-warm-700 leading-none">
              {t('badge')}
            </span>
          </ShimmerButton>

          {/* Headline — text-display-sm (36px) → sm:text-display (48px)
              Apple HIG: Bold weight, -0.04em tracking, tight line-height.
              Hierarhija: H1 (36-48px) >> P (15px) = jasna vizualna razlika */}
          <h1 className="text-display-sm sm:text-display font-bold text-center md:text-left text-foreground font-sans">
            {t('hero.title1')} <br />
            <span className="font-bold px-1 pl-1 primaryGradient">{t('hero.title2')}</span> <br />
            {t('hero.title3')}
          </h1>

          {/* Subtext — text-subheadline (15px, 0 tracking)
              Apple HIG: Subheadline za secondary info pod naslovom */}
          <p className="text-subheadline text-center md:text-left text-warm-700 max-w-xl font-sans">
            {t('hero.subtitle')}
          </p>

          {/* Store Buttons — md:h-11 = 44px = Apple minimum touch target */}
          <div className="flex flex-row items-center gap-2 md:gap-3 h-9 md:h-11">
            <Image src="/apple.png" alt="App Store" className="h-full w-auto object-contain" width={120} height={40} />
            <Image src="/google.png" alt="Google Play" className="h-full w-auto object-contain" width={135} height={40} />
          </div>

          {/* Social Proof — text-caption-1/2 za hierarhija pod body */}
          <div className="flex flex-col items-center md:items-start gap-2 mt-3">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full border border-white overflow-hidden bg-warm-300">
                    <img src="/jernej.png" alt="User" className="w-full h-full object-cover grayscale" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-caption-1 text-warm-800 font-medium leading-none mb-1">{t('socialProof.topTracker')}</span>
                <span className="text-caption-2 text-warm-700 leading-none">{t('socialProof.downloadedBy')}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="var(--star)" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ))}
              </div>
              <span className="text-caption-2 font-medium text-warm-700">{t('socialProof.reviews')}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Phones */}
        <div className="relative h-[458px] md:w-1/2 w-full md:h-[540px] flex items-center justify-center md:justify-end perspective-1000">
          {/* Back Phone */}
          <div className="absolute top-10 md:top-12 right-2 w-[200px] md:w-[230px] transform-gpu will-change-transform z-10">
            <Iphone src="/workout.png" priority />
          </div>

          {/* Front Phone */}
          <div className="absolute top-0 md:top-8 left-2 md:left-12 w-[200px] md:w-[230px] transform-gpu will-change-transform rotate-0">
            <Iphone src="/home.png" priority />
          </div>
        </div>
      </div>
    </div>
  )
}
