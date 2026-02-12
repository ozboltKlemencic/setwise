"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { Iphone } from "@/components/ui/mobileDevices/Phone"
import { ShimmerButton } from "./ui/shimmer-button"
import Blur from "./ui/Blur"
import { Users } from "lucide-react"
import BetaSignupDialog from "./beta-signup-dialog"

export default function HeroSection() {
  const t = useTranslations('HomePage')

  return (
    <div className="relative w-full self-stretch">

      <div className="absolute top-0 -left-(--space-3) w-(--space-3) h-full bg-linear-to-b from-background to-transparent dark:to-background/20" />
      <div className="absolute top-0 -right-(--space-3) w-(--space-3) h-full bg-linear-to-b from-background to-transparent dark:to-background/20" />

      <div className="w-full m-(--space-1) rounded-b-lg px-(--space-4) md:px-(--space-8) lg:px-(--space-16) py-(--space-4) md:py-(--space-6) bg-linear-to-t from-brand-500/20 to-transparent mx-auto flex flex-col lg:flex-row justify-between gap-y-(--space-8) lg:gap-x-(--space-12) items-center relative z-(--z-raised)">
       <div className="">
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
       </div>
        <div className="flex w-full lg:w-1/2 lg:pb-(--space-8) pt-(--space-20) min-[1152px]:pt-0 py-(--space-4) gap-y-(--space-5) flex-col items-center lg:items-start text-center lg:text-left px-(--space-2) md:px-0">

          <ShimmerButton
            className="border border-border"
            shimmerDuration="3s"
            shimmerSize="0.07em"
            background="var(--background)"
            shimmerColor="var(--brand-300)"
          >
            <span className="flex items-center gap-1.5 text-center text-caption-1 font-medium whitespace-pre-wrap text-muted-foreground leading-none">
              <Users className="size-3 text-muted-foreground/80" />
              {t('badge')}
            </span>
          </ShimmerButton>

          <h1 className="text-large-title sm:text-display-sm md:text-display lg:text-display font-bold text-center lg:text-left text-foreground font-sans">
            {t('hero.title1')} <br />
            <span className="font-bold primaryGradient">{t('hero.title2')}</span> <br />
            {t('hero.title3')}
          </h1>

          <p className="text-subheadline md:text-callout text-center  lg:text-left text-muted-foreground max-w-xl  sm:px-(--space-32) lg:px-0  font-sans">
            {t('hero.subtitle')}
          </p>

          <div role="group" aria-label="Download the app" className="flex flex-row items-center  gap-(--space-2) md:gap-(--space-3) h-9 md:h-11">
            <BetaSignupDialog trigger={<Image
              src="/apple.png"
              alt="App Store"
              className="h-full w-auto object-contain"
              width={120}
              height={40}
            />} />

            <BetaSignupDialog trigger={<Image
              src="/google.png"
              alt="Google Play"
              className="h-full w-auto object-contain"
              width={135}
              height={40}
            />} />
          </div>

          <aside aria-label="Social proof" className="flex flex-col items-center lg:items-start gap-(--space-2) mt-(--space-3)">
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
                <p className="text-caption-1 text-surface-800 font-medium leading-none mb-(--space-1)">
                  {t('socialProof.topTracker')}
                </p>
                <p className="text-caption-2 text-surface-600 leading-none">
                  {t('socialProof.downloadedBy')}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5">
              <div role="img" aria-label="Rated 5 out of 5 stars" className="flex items-center gap-(--space-1)">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="var(--star)" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                ))}
              </div>
              <p className="text-caption-2 font-medium text-surface-600">{t('socialProof.reviews')}</p>
            </div>
          </aside>
        </div>

        <figure aria-label="App preview screenshots" className="relative h-[458px] md:h-[520px] w-full lg:w-1/2 min-[1152px]:h-[540px] flex items-center justify-center lg:justify-end perspective-1000">
          <div className="absolute top-(--space-10) md:top-(--space-8) lg:top-(--space-12) right-[calc(50%-150px)] sm:right-[calc(50%-210px)] md:right-[calc(50%-220px)] lg:right-(--space-2) w-[200px] md:w-[220px] min-[1152px]:w-[230px] transform-gpu will-change-transform z-(--z-raised)">
            <div className="dark:hidden">
              <Iphone src="/workout.png" priority />
            </div>
            <div className="hidden dark:block">
              <Iphone src="/home-dark.png" priority />
            </div>
          </div>
          <div className="absolute top-0 md:top-(--space-4) lg:top-(--space-8) left-[calc(50%-150px)] sm:left-[calc(50%-210px)] md:left-[calc(50%-220px)] lg:left-(--space-12) w-[200px] md:w-[220px] min-[1152px]:w-[230px] transform-gpu will-change-transform">
            <div className="dark:hidden">
              <Iphone src="/home.png" priority />
            </div>
            <div className="hidden dark:block">
              <Iphone src="/home-dark.png" priority />
            </div>
          </div>
        </figure>
      </div>
    </div>
  )
}
