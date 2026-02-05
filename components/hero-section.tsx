"use client"

import Image from "next/image"
import { Iphone } from "@/components/ui/mobileDevices/Phone"
import { ShimmerButton } from "./ui/shimmer-button"

export default function HeroSection() {
  return (
    <div className="relative max-w-6xl  mx-auto">
      <div className="absolute top-0 -left-3 w-3 h-full  bg-linear-to-b from-[#F7F5F3] to-transparent "></div>
      <div className="absolute top-0 -right-3 w-3 h-full  bg-linear-to-b from-[#F7F5F3] to-transparent "></div>
      <div className="w-full  shadow-[rgba(55,50,47,0.12)] m-1 rounded-b-lg  px-16  py-4 bg-linear-to-t from-blue-500/20 to-transparent mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="absolute top-0 left-0 w-full h-full -z-10 blur-md -translate-y-[0%]" style={{ background: 'radial-gradient(circle at center, rgba(247, 245, 243,0.8) 0%, rgba(247, 245, 243,0) 80%)' }} />
        <div className="absolute top-0 left-0 w-full h-full -z-10 -translate-x-[5%] -translate-y-[20%] blur-xl" style={{ background: 'radial-gradient(circle at center, rgba(247, 245, 243,0.9) 0%, rgba(247, 245, 243,0) 80%)' }} />
        <div className="absolute top-0 left-0 w-full h-full -z-10 translate-x-[5%]  -translate-y-[20%] blur-xl" style={{ background: 'radial-gradient(circle at center, rgba(247, 245, 243,0.8) 0%, rgba(247, 245, 243,0) 80%)' }} />

        {/* Left Column: Text */}
        <div className="flex flex-col items-start text-left">
          {/* Badge */}

          <ShimmerButton className="mb-8 border border-neutral-200" shimmerDuration={"3s"} shimmerSize={"0.05em"} background={"rgba(247, 245, 243, 1)"} shimmerColor={"#689efc"}>
            <span className="text-center text-xs leading-none font-medium tracking-tight whitespace-pre-wrap text-gray-600  ">
              Introducing intelligent tracking
            </span>
          </ShimmerButton>

          {/* Headline */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl font-bold text-left text-[#1A1A1A] tracking-tight mb-2.5 leading-[1.05] font-sans">
            Log Workouts <br />
            <span className="text-blue-600">Get Stronger</span> <br />
            Stay disciplined
          </h1>

          {/* Subtext */}
          <p className="text-sm text-gray-600 text-left max-w-xl mb-4 leading-relaxed font-sans">
            SetWise is the ultimate workout tracker for serious lifters.
            Build routines, track progress, and reach your goals with AI-powered insights.
          </p>

          {/* Store Buttons */}
          <div className="flex flex-row items-center gap-3 mb-8 h-[42px]">
            {/* App Store Button */}
            <Image src="/apple.png" alt="App Store" className="h-full w-auto object-contain" width={120} height={40} />
            {/* Google Play Button */}
            <Image src="/google.png" alt="Google Play" className="h-full w-auto object-contain" width={135} height={40} />
          </div>

          {/* Social Proof */}
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full border border-white overflow-hidden bg-gray-200">
                    <img src="/jernej.png" alt="User" className="w-full h-full object-cover grayscale" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-700 font-medium leading-none mb-1">The #1 workout tracker</span>
                <span className="text-[11px] text-gray-600 leading-none">Downloaded by 100+ fitness enthusiasts</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ))}
              </div>
              <span className="text-[11px] font-medium text-gray-600">2+ Great reviews</span>
            </div>
          </div>
        </div>

        {/* Right Column: Phones */}
        <div className="relative h-[500px] md:h-[600px] w-full flex items-center justify-center md:justify-end perspective-1000">
          {/* Back Phone */}
          <div className="absolute top-28 right-0  w-[200px] md:w-[230px] transform-gpu will-change-transform z-10">
            <Iphone src="/workout.png" priority />
          </div>

          {/* Front Phone */}
          <div className="absolute top-16 right-12 md:right-44 w-[200px] md:w-[230px] transform-gpu will-change-transform rotate-[0deg] ">
            <Iphone src="/workout.png" priority />
          </div>
        </div>
      </div>

    </div>
  )
}
