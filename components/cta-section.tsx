"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Iphone } from "./ui/mobileDevices/Phone"
import DownloadButton from "./ui/buttons/DownloadButton"
import { useTranslations } from "next-intl"

export default function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [isHovered, setIsHovered] = useState(false)
  const t = useTranslations('CTA')

  return (
    <div className="w-full relative group flex flex-col justify-center items-center gap-(--space-2) overflow-hidden">
      {/* Content */}
      <div
        ref={containerRef}
        className="self-stretch flex-col md:flex-row min-h-[380px] md:min-h-[420px] lg:min-h-[500px] px-(--space-4) md:px-(--space-10) lg:px-(--space-24) py-(--space-10) md:py-(--space-10) lg:py-(--space-12) border-t border-b border-surface-200 flex justify-center md:justify-start items-center gap-(--space-6) relative z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background hatching pattern */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="w-full h-full relative bg-brand-500/10 dark:bg-brand-500/5 mask-[radial-gradient(600px_circle_at_center,white,transparent)]">
            {Array.from({ length: 300 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-(--space-4) w-full -rotate-45 origin-top-left outline-[0.5px] outline-surface-300/50 dark:outline-surface-400/30 outline-offset-[-0.25px]"
                style={{
                  top: `${i * 16 - 120}px`,
                  left: "-100%",
                  width: "300%",
                }}
              />
            ))}
          </div>
        </div>

        {/* Text content */}
        <div className="w-full md:max-w-[586px] pb-(--space-20) md:pb-0 md:w-1/2 px-(--space-4) md:px-(--space-4) lg:px-(--space-6) py-(--space-5) md:py-(--space-6) lg:py-(--space-8) overflow-hidden rounded-lg flex flex-col justify-start items-center md:items-start gap-(--space-4) md:gap-(--space-4) lg:gap-(--space-6) relative z-20">
          <div className="self-stretch flex flex-col justify-start items-center md:items-start gap-(--space-2) md:gap-(--space-3)">
            {/* Title — Apple HIG responsive typography */}
            <h2 className="self-stretch text-center md:text-left text-surface-900 text-title-2 md:text-title-1 lg:text-display-sm font-semibold font-sans">
              {t('title')}
            </h2>
            {/* Subtitle — Apple HIG subheadline/callout */}
            <p className="self-stretch text-center md:text-left text-surface-600 text-subheadline md:text-callout font-medium font-sans">
              {t('subtitle')}
            </p>
          </div>
          <div className="w-full max-w-[497px] flex flex-col justify-start items-center md:items-start gap-(--space-12)">
            <div className="flex justify-start items-center gap-(--space-4)">
              <DownloadButton openBetaDialog={true} text={t('button')} />
            </div>
          </div>
        </div>

        {/* iPhone — desktop animated */}
        <motion.div
          initial={{ y: "-80%" }}
          animate={{ y: isHovered ? "-35%" : isInView ? "25%" : "-50%" }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-[250px] md:w-[240px] lg:w-[334px] absolute md:top-[-2rem] lg:top-[-4rem] top-[40%] right-12 md:right-[3rem] lg:right-[6rem] transform-gpu will-change-transform hidden md:block"
        >
          <Iphone src="/app-screens/light/progres/analyze-volume.png" darkSrc="/app-screens/dark/progres/analyze-volume.png" />
        </motion.div>

        {/* iPhone — mobile static */}
        <div className="w-[250px] absolute top-[75%] right-12 transform-gpu will-change-transform block md:hidden">
          <Iphone src="/app-screens/light/progres/analyze-volume.png" darkSrc="/app-screens/dark/progres/analyze-volume.png" />
        </div>
      </div>
    </div>
  )
}
