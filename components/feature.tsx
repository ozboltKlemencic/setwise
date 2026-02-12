"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Iphone } from "./ui/mobileDevices/Phone"
import DownloadButton from "./ui/buttons/DownloadButton"

interface FeatureProps {
    isReverse?: boolean
    title?: React.ReactNode
    description?: React.ReactNode
    buttonText?: string
    imageSrc?: string
    /** Dark mode image source (optional — falls back to imageSrc) */
    imageSrcDark?: string
}

export default function Feature({
    isReverse = true,
    title = "Ready to transform your business?",
    description = (
        <>
            Join thousands of businesses streamlining their operations,
            <br />
            managing schedules, and growing with data-driven insights.
        </>
    ),
    buttonText = "Start for free",
    imageSrc = "/workout.png",
    imageSrcDark,
}: FeatureProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, margin: "-0px" })
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div className="w-full relative group  md:max-h-[480px] lg:max-h-[560px] flex flex-col justify-center items-center gap-(--space-2) overflow-hidden">

            {/* Content */}
            <div className={`self-stretch ${isReverse ? 'md:flex-row-reverse flex-col' : 'md:flex-row flex-col'} border-b border-border dark:border-border/40 flex justify-center items-center relative z-(--z-raised) md:h-145 md:max-h-145`}>

                {/* ── Text Section ── */}
                <div className="w-full p-(--space-8) md:max-w-146.5 md:w-1/2 h-full md:px-(--space-8) lg:px-(--space-16) md:py-(--space-6) lg:py-(--space-8) overflow-hidden rounded-lg flex flex-col justify-center items-center gap-(--space-6) relative z-(--z-dropdown)">
                    <div className="self-stretch flex flex-col justify-start items-start gap-(--space-3)">

                        {/* Title — Apple HIG responsive typography */}
                        <h2 className="self-stretch text-center md:text-left text-surface-900 text-title-1 md:text-large-title lg:text-display font-semibold font-sans">
                            {title}
                        </h2>

                        {/* Description — Apple HIG body/subheadline */}
                        <p className="self-stretch md:text-left text-center text-surface-600 text-subheadline md:text-callout font-sans font-medium">
                            {description}
                        </p>
                    </div>

                    <div className="w-full max-w-124.25 flex flex-col justify-center items-center md:items-start gap-(--space-12)">
                        <div className="flex justify-start items-center gap-(--space-4)">
                            <DownloadButton openBetaDialog={true} text={buttonText} />
                        </div>
                    </div>
                </div>

                {/* ── Phone / Visual Section ── */}
                <div className="w-full h-100 md:w-1/2 md:h-full p-(--space-4)">
                    <div
                        ref={containerRef}
                        className="w-full relative h-full bg-brand-500 dark:bg-brand-500/60 shadow-(--shadow-lg) rounded-2xl overflow-hidden group/phone"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Background diagonal pattern (masked) */}
                        <div className="absolute inset-0 w-full h-full">
                            <div className="w-full h-full relative mask-[radial-gradient(300px_circle_at_center,white,transparent)]">
                                {Array.from({ length: 300 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute h-(--space-4) w-full -rotate-45 origin-top-left outline-[0.5px] outline-surface-950/40 dark:outline-surface-50/20 outline-offset-[-0.25px]"
                                        style={{
                                            top: `${i * 16 - 120}px`,
                                            left: "-100%",
                                            width: "300%",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Ambient glow — top right */}
                        <div className="absolute top-0 right-0 w-3/5 -translate-y-1/2 translate-x-1/2 h-full bg-white/15 dark:bg-white/8 blur-(--blur-heavy) rounded-full pointer-events-none" />
                        {/* Ambient glow — bottom left */}
                        <div className="absolute bottom-0 left-0 w-3/5 translate-y-1/2 -translate-x-1/2 h-full bg-white/10 dark:bg-white/5 blur-(--blur-heavy) rounded-full pointer-events-none" />

                        {/* iPhone — animated on scroll + hover */}
                        <motion.div
                            initial={{ y: "70%" }}
                            animate={{ y: isHovered ? "15%" : isInView ? "-35%" : "-5%" }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] md:w-[55%] lg:w-75 transform-gpu will-change-transform"
                        >
                            {imageSrcDark ? (
                                <>
                                    <div className="dark:hidden">
                                        <Iphone src={imageSrc} />
                                    </div>
                                    <div className="hidden dark:block">
                                        <Iphone src={imageSrcDark} />
                                    </div>
                                </>
                            ) : (
                                <Iphone src={imageSrc} />
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
