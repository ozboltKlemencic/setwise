"use client"

import React, { useRef, useEffect } from "react"
import ReviewCard from "./ui/cards/ReviewCard"
import { motion, useMotionValue, useAnimationFrame, useAnimate, type AnimationPlaybackControls } from "framer-motion"
import { SparklesText } from "./ui/sparkles-text";
import DownloadButton from "./ui/buttons/DownloadButton";
import { useTranslations } from "next-intl"

interface ReviewItem {
    name: string
    role: string
    company: string
    reviewText: string
    avatarUrl?: string
    rating?: number
}

function ScaledCard({ children, containerRef }: { children: React.ReactNode, containerRef: React.RefObject<HTMLDivElement | null> }) {
    const cardRef = useRef<HTMLDivElement>(null)
    const scale = useMotionValue(1)
    const opacity = useMotionValue(1)

    useAnimationFrame(() => {
        if (!cardRef.current || !containerRef.current) return

        const containerRect = containerRef.current.getBoundingClientRect()
        const cardRect = cardRef.current.getBoundingClientRect()

        const containerCenter = containerRect.top + containerRect.height / 2
        const cardCenter = cardRect.top + cardRect.height / 2

        const distanceFromCenter = Math.abs(containerCenter - cardCenter)
        const maxDistance = containerRect.height / 2

        let newScale = 1 - (distanceFromCenter / maxDistance) * 0.05
        newScale = Math.max(0.9, Math.min(1, newScale))

        let newOpacity = 1 - (distanceFromCenter / maxDistance) * 0.1
        newOpacity = Math.max(0.8, Math.min(1, newOpacity))

        scale.set(newScale)
        opacity.set(newOpacity)
    })

    return (
        <motion.div
            ref={cardRef}
            style={{
                scale,
                opacity,
                willChange: "transform, opacity",
                transform: "translateZ(0)"
            }}
            className="w-full"
        >
            {children}
        </motion.div>
    )
}

/** Reusable diagonal pattern stripe */
function DiagonalPattern({ count = 300 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
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
        </>
    )
}

/** Reusable side decorative column (bento-grid pattern) */
function SideDecoration({ count = 200 }: { count?: number }) {
    return (
        <div className="w-40.5 -left-14.5 -top-30 absolute flex flex-col justify-start items-start">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="self-stretch h-(--space-4) -rotate-45 origin-top-left outline-[0.5px] outline-border/30 outline-offset-[-0.25px]"
                />
            ))}
        </div>
    )
}

export default function TestimonialsSection() {
    const t = useTranslations('Testimonials')

    const translatedReviews = t.raw('reviews') as Array<{ name: string; role: string; company: string; reviewText: string }>

    // Rating and avatarUrl per review (same order as translations)
    const reviewMeta = [
        { rating: 5, avatarUrl: "/testimonials/liam-fabian.png" },
        { rating: 5, avatarUrl: "/testimonials/martin-zust.png" },
        { rating: 5, avatarUrl: "/testimonials/liam-fabian.png" },

    ]

    const reviews: ReviewItem[] = translatedReviews.map((item, i) => ({
        ...item,
        ...reviewMeta[i],
    }))

    const duplicatedReviews = [...reviews, ...reviews];
    const containerRef = useRef<HTMLDivElement>(null)
    const [scope, animate] = useAnimate()
    const animationRef = useRef<AnimationPlaybackControls | null>(null)

    useEffect(() => {
        const animation = animate(scope.current, { y: ["-50%", "0%"] }, {
            duration: 25,
            ease: "linear",
            repeat: Infinity
        })
        animationRef.current = animation
        return () => animation.stop()
    }, [animate])

    return (
        <div>
            {/* ── Top decorative stripe ── */}
            <div className="w-full md:h-(--space-6) h-(--space-2) relative opacity-(--opacity-hover) border-b border-border dark:border-border/40 overflow-hidden">
                <DiagonalPattern />
            </div>

            {/* ── Main section ── */}
            <div className="w-full flex flex-col lg:h-160 lg:flex-row justify-center items-center relative">

                {/* Left decorative column */}
                <div className="absolute left-0 top-0 w-(--space-2) md:w-(--space-6) h-full overflow-hidden z-(--z-raised) border-r border-border dark:border-border/40">
                    <SideDecoration />
                </div>

                {/* Right decorative column */}
                <div className="absolute right-0 top-0 w-(--space-2) md:w-(--space-6) h-full overflow-hidden z-(--z-raised) border-l border-border dark:border-border/40">
                    <SideDecoration />
                </div>

                {/* ── Content ── */}
                <div className="flex-1 flex flex-col lg:flex-row justify-center items-center lg:py-(--space-12) h-full gap-y-(--space-6) px-(--space-4) md:px-(--space-6) lg:px-0 pb-(--space-6) lg:pb-0">

                    {/* ── Text Section ── */}
                    <div className="lg:max-w-146.5 lg:ml-(--space-6) w-full lg:w-1/2 md:px-(--space-8) lg:px-(--space-10) lg:pl-(--space-12) lg:py-(--space-8) overflow-hidden rounded-lg flex flex-col justify-start items-center h-full relative z-(--z-dropdown) p-(--space-6) gap-y-(--space-4) py-(--space-12)">
                        <div className="w-full h-full flex flex-col justify-center items-center lg:items-start gap-(--space-3) lg:pb-(--space-8)">

                            {/* Title — Apple HIG responsive typography */}
                            <h2 className="self-stretch text-center lg:text-left text-surface-900 text-title-1 md:text-large-title lg:text-display font-semibold font-sans">
                                <SparklesText shapes={['heart', 'star']} colors={{ first: "var(--star)", second: "var(--warning)" }}>{t('headline')}</SparklesText> {t('headlineRest')}
                            </h2>

                            {/* Description — Apple HIG subheadline/callout */}
                            <p className="self-stretch text-center lg:text-left  text-surface-600 max-w-[500px] lg:max-w-none  text-subheadline md:text-callout font-sans font-medium">
                                {t('description')}
                            </p>

                            <DownloadButton openBetaDialog={true} text={t('button')} />
                        </div>
                    </div>

                    {/* ── Scrolling Reviews Column ── */}
                    <div
                        ref={containerRef}
                        className="lg:w-1/2 lg:mr-(--space-6) relative overflow-hidden lg:h-full h-100 md:h-120 flex flex-col lg:pl-(--space-6) lg:my-(--space-6) py-(--space-4)"
                        onMouseEnter={() => animationRef.current?.pause()}
                        onMouseLeave={() => animationRef.current?.play()}
                    >
                        {/* Gradient fade overlays — semantic bg */}
                        <div className="absolute top-0 left-0 w-full h-(--space-20) bg-linear-to-b from-background to-transparent z-(--z-raised) pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-full h-(--space-20) bg-linear-to-t from-background to-transparent z-(--z-raised) pointer-events-none" />

                        <motion.div
                            ref={scope}
                            className="flex flex-col px-(--space-2) md:px-(--space-4) lg:pl-(--space-8) lg:pr-(--space-6) pointer-events-none md:pointer-events-auto"
                            style={{
                                willChange: "transform",
                                transform: "translateZ(0)"
                            }}
                        >
                            {duplicatedReviews.map((review, index) => (
                                <ScaledCard key={index} containerRef={containerRef}>
                                    <ReviewCard
                                        name={review.name}
                                        role={review.role}
                                        company={review.company}
                                        reviewText={review.reviewText}
                                        rating={review.rating || 5}
                                        avatarUrl={review.avatarUrl || "/jernej.png"}
                                        className="w-full shrink-0 md:my-(--space-2) lg:my-(--space-3)"
                                    />
                                </ScaledCard>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ── Bottom decorative stripe ── */}
            <div className="w-full md:h-(--space-6) h-(--space-2) relative opacity-(--opacity-hover) border-t border-b border-border dark:border-border/40 overflow-hidden">
                <DiagonalPattern />
            </div>
        </div>
    );
}
