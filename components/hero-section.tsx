"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { Iphone } from "@/components/ui/mobileDevices/Phone"
import { ShimmerButton } from "./ui/shimmer-button"

export default function HeroSection() {
  const t = useTranslations('HomePage')

  return (
    <div className="relative w-[98%] lg:max-w-6xl lg:w-[71.5rem]  mx-auto ">
      <div className="absolute top-0 -left-3 w-3 h-full  bg-linear-to-b from-[#F7F5F3] to-transparent "></div>
      <div className="absolute top-0 -right-3 w-3 h-full  bg-linear-to-b from-[#F7F5F3] to-transparent "></div>
      <div className="w-full  shadow-[rgba(55,50,47,0.12)] m-1 rounded-b-lg  md:px-16 px-1 md:py-4 py-2  bg-linear-to-t from-blue-500/20 to-transparent mx-auto flex flex-col md:flex-row justify-between  gap-y-8 md:gap-x-12 items-center relative z-10">
        <div className="absolute top-0 left-0 w-full h-full -z-10 blur-md -translate-y-[0%]" style={{ background: 'radial-gradient(circle at center, rgba(247, 245, 243,0.8) 0%, rgba(247, 245, 243,0) 80%)' }} />
        <div className="absolute top-0 left-0 w-full h-full -z-10 -translate-x-[5%] -translate-y-[20%] blur-xl" style={{ background: 'radial-gradient(circle at center, rgba(247, 245, 243,0.9) 0%, rgba(247, 245, 243,0) 80%)' }} />
        <div className="absolute top-0 left-0 w-full h-full -z-10 translate-x-[5%]  -translate-y-[20%] blur-xl" style={{ background: 'radial-gradient(circle at center, rgba(247, 245, 243,0.8) 0%, rgba(247, 245, 243,0) 80%)' }} />

        {/* Left Column: Text */}
        <div className="flex md:w-1/2 w-full lg:pb-8 pt-20 md:pt-0 py-2  gap-y-4 flex-col md:items-start items-center md:text-left text-center px-2 md:px-0">
          {/* Badge */}

          <ShimmerButton className=" border border-neutral-200" shimmerDuration={"3s"} shimmerSize={"0.07em"} background={"rgba(247, 245, 243, 1)"} shimmerColor={"#689efc"}>
            <span className="text-center text-xs leading-none font-medium tracking-tight whitespace-pre-wrap text-gray-600  ">
              {t('badge')}
            </span>
          </ShimmerButton>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold text-center md:text-left text-[#1A1A1A] tracking-tight  leading-[1.05] font-sans">
            {t('hero.title1')} <br />
            <span className="font-bold px-1 pl-1 bg-linear-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">{t('hero.title2')}</span> <br />
            {t('hero.title3')}
          </h1>

          {/* Subtext */}
          <p className="text-sm text-center md:text-left text-gray-600 max-w-xl  leading-relaxed font-sans">
            {t('hero.subtitle')}
          </p>

          {/* Store Buttons */}
          <div className="flex flex-row items-center gap-1 md:gap-3 h-[36px] md:h-[42px]">
            {/* App Store Button */}
            <Image src="/apple.png" alt="App Store" className="h-full w-auto object-contain" width={120} height={40} />
            {/* Google Play Button */}
            <Image src="/google.png" alt="Google Play" className="h-full w-auto object-contain" width={135} height={40} />
          </div>

          {/* Social Proof */}
          <div className="flex flex-col items-center md:items-start gap-2 mt-2">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full border border-white overflow-hidden bg-gray-200">
                    <img src="/jernej.png" alt="User" className="w-full h-full object-cover grayscale" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-700 font-medium leading-none mb-1">{t('socialProof.topTracker')}</span>
                <span className="text-[11px] text-gray-600 leading-none">{t('socialProof.downloadedBy')}</span>
              </div>
            </div>

            <div className="flex items-center justify-center  gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ))}
              </div>
              <span className="text-[11px] font-medium text-gray-600">{t('socialProof.reviews')}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Phones */}
        <div className="relative h-[458px]  md:w-1/2 w-full md:h-[540px]  flex items-center justify-center md:justify-end perspective-1000">
          {/* Back Phone */}
          <div className="absolute top-10 md:top-12 right-2  w-[200px] md:w-[230px] transform-gpu will-change-transform z-10">
            <Iphone src="/workout.png" priority />
          </div>

          {/* Front Phone */}
          <div className="absolute top-0 md:top-8 left-2 md:left-12 w-[200px] md:w-[230px] transform-gpu will-change-transform rotate-[0deg] ">
            <Iphone src="/home.png" priority />
          </div>
        </div>
      </div>

    </div>
  )
}
