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

export default function Feature2({
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
    const phoneRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(phoneRef, { once: true, margin: "-100px" })
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div className="w-full relative group flex flex-col justify-center items-center overflow-hidden">

            {/* Content */}
            <div className={`self-stretch ${isReverse ? 'md:flex-row-reverse flex-col-reverse' : 'md:flex-row flex-col'} flex justify-start items-center relative z-(--z-raised) md:h-150 md:max-h-150`}>

                {/* ── Text Section ── */}
                <div className="w-full p-(--space-8) md:max-w-146.5 py-(--space-12) md:w-1/2 md:pl-(--space-12) md:pr-(--space-16) border-r md:py-(--space-8) overflow-hidden flex flex-col justify-center  items-center gap-(--space-6) relative z-(--z-dropdown) h-full border-b border-border dark:border-border/40">
                    <div className="self-stretch flex flex-col justify-start items-start gap-(--space-3)">

                        {/* Title — Apple HIG responsive typography */}
                        <h2 className="self-stretch  text-center md:text-left text-surface-900 text-title-1 md:text-large-title lg:text-display font-semibold font-sans">
                            {title}
                        </h2>

                        {/* Description — Apple HIG body/subheadline */}
                        <p className="self-stretch text-center md:text-left text-surface-600 text-subheadline md:text-callout font-sans font-medium">
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
                <div
                    className="w-full h-100 md:w-1/2 relative md:h-full overflow-hidden group/phone border-b border-border dark:border-border/40"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Background diagonal pattern */}
                    <div className="w-full h-full relative opacity-(--opacity-hover)">
                        {Array.from({ length: 300 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute h-(--space-4) w-full -rotate-45 origin-top-left outline-[0.5px] outline-border/30 outline-offset-[-0.25px]"
                                style={{
                                    top: `${i * 16 - 120}px`,
                                    left: "-100%",
                                    width: "300%",
                                }}
                            />
                        ))}
                    </div>

                    {/* Brand accent card with phone */}
                    <div className="absolute top-(--space-2) left-(--space-2) right-(--space-2) bottom-(--space-2) overflow-hidden bg-brand-500 dark:bg-brand-500/60 rounded-lg shadow-(--shadow-lg)">

                        {/* Inner diagonal pattern (masked) */}
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

                        {/* iPhone — animated on scroll + hover */}
                        <motion.div
                            ref={phoneRef}
                            initial={{ y: "-80%" }}
                            animate={{ y: isHovered ? "-35%" : isInView ? "25%" : "-50%" }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="absolute top-0 left-0 translate-x-[17%] md:translate-x-1/2 md:w-75 w-[75%] transform-gpu will-change-transform"
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

                        {/* Ambient glow — top right */}
                        <div className="absolute top-0 right-0 w-3/5 -translate-y-1/2 translate-x-1/2 h-full bg-white/20 dark:bg-white/10 blur-(--blur-heavy) rounded-full pointer-events-none" />
                        {/* Ambient glow — bottom left */}
                        <div className="absolute bottom-0 left-0 w-2/5 translate-y-1/2 -translate-x-1/2 h-3/4 bg-white/10 dark:bg-white/5 blur-(--blur-ultra) rounded-full pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    )
}
