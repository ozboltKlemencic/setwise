"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { Iphone } from "@/components/ui/mobileDevices/Phone"
import { ShimmerButton } from "./ui/shimmer-button"
import Blur from "./ui/Blur"

export default function HeroSection() {
  const t = useTranslations('HomePage')

  return (
    <div className="relative w-full self-stretch">

      <div className="absolute top-0 -left-(--space-3) w-(--space-3) h-full bg-linear-to-b from-background to-transparent dark:to-background/20" />
      <div className="absolute top-0 -right-(--space-3) w-(--space-3) h-full bg-linear-to-b from-background to-transparent dark:to-background/20" />

      <div className="w-full m-(--space-1) rounded-b-lg  md:px-(--space-8) lg:px-(--space-16) py-(--space-4) md:py-(--space-6) bg-linear-to-t from-brand-500/20  to-transparent mx-auto flex flex-col md:flex-row justify-between gap-y-(--space-8) md:gap-x-(--space-12) items-center relative z-(--z-raised)">

        <Blur
          className="inset-0 -z-1 rounded-none opacity-(--opacity-hover)"
          style={{ background: 'radial-gradient(circle at center, var(--background) 0%, transparent 80%)' }}
        />
        <Blur
          className="inset-0 -z-1 -translate-x-[5%] -translate-y-[20%] blur-(--blur-ultra) rounded-none opacity-(--opacity-muted)"
          style={{ background: 'radial-gradient(circle at center, var(--background) 0%, transparent 80%)' }}
        />
        <Blur
          className="inset-0 -z-1 translate-x-[5%] -translate-y-[20%] blur-(--blur-ultra) rounded-none opacity-(--opacity-hover)"
          style={{ background: 'radial-gradient(circle at center, var(--background) 0%, transparent 80%)' }}
        />

        <div className="flex md:w-1/2 w-full lg:pb-(--space-8) pt-(--space-20) md:pt-0 py-(--space-4) gap-y-(--space-5) flex-col md:items-start items-center md:text-left text-center px-(--space-2) md:px-0">

          <ShimmerButton
            className="border border-border"
            shimmerDuration="3s"
            shimmerSize="0.07em"
            background="var(--background)"
            shimmerColor="var(--brand-300)"
          >
            <span className="text-center text-caption-1 font-medium whitespace-pre-wrap text-muted-foreground leading-none">
              {t('badge')}
            </span>
          </ShimmerButton>

          <h1 className="text-large-title sm:text-display-sm lg:text-display font-bold text-center md:text-left text-foreground font-sans">
            {t('hero.title1')} <br />
            <span className="font-bold primaryGradient">{t('hero.title2')}</span> <br />
            {t('hero.title3')}
          </h1>

          <p className="text-subheadline text-center md:text-left text-muted-foreground max-w-xl font-sans">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-row items-center gap-(--space-2) md:gap-(--space-3) h-9 md:h-11">
            <Image
              src="/apple.png"
              alt="App Store"
              className="h-full w-auto object-contain "
              width={120}
              height={40}
            />
            <Image
              src="/google.png"
              alt="Google Play"
              className="h-full w-auto object-contain "
              width={135}
              height={40}
            />
           
          </div>

          <div className="flex flex-col items-center md:items-start gap-(--space-2) mt-(--space-3)">
            <div className="flex flex-col md:flex-row items-center gap-(--space-2)">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-white dark:border-surface-300 overflow-hidden bg-surface-200"
                  >
                    <img src="/jernej.png" alt="User" className="w-full h-full object-cover grayscale" />
                  </div>
                ))}
              </div>

              <div className="flex flex-col">
                <span className="text-caption-1 text-surface-800 font-medium leading-none mb-(--space-1)">
                  {t('socialProof.topTracker')}
                </span>
                <span className="text-caption-2 text-surface-600 leading-none">
                  {t('socialProof.downloadedBy')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5">
              <div className="flex items-center gap-(--space-1)">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="var(--star)" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ))}
              </div>
              <span className="text-caption-2 font-medium text-surface-600">{t('socialProof.reviews')}</span>
            </div>
          </div>
        </div>

        <div className="relative h-[458px] md:w-1/2 w-full md:h-[540px] flex items-center justify-center md:justify-end perspective-1000">
          <div className="absolute top-(--space-10) md:top-(--space-12) right-(--space-2) w-[200px] md:w-[230px] transform-gpu will-change-transform z-(--z-raised)">
            <div className="dark:hidden">
              <Iphone src="/workout.png" priority />
            </div>
            <div className="hidden dark:block">
              <Iphone src="/home-dark.png" priority />
            </div>
          </div>
          <div className="absolute top-0 md:top-(--space-8) left-(--space-2) md:left-(--space-12) w-[200px] md:w-[230px] transform-gpu will-change-transform">
            <div className="dark:hidden">
              <Iphone src="/home.png" priority />
            </div>
            <div className="hidden dark:block">
              <Iphone src="/home-dark.png" priority />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
