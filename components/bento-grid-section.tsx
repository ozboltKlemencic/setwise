"use client"


import React, { useRef } from "react"
import Image from "next/image"
import { useInView } from "framer-motion"
import { useTranslations } from "next-intl"
import SmartSimpleBrilliant from "./smart-simple-brilliant"
import YourWorkInSync from "./your-work-in-sync"
import NumbersThatSpeak from "./numbers-that-speak"
import { OrbitingCircles } from "@/components/ui/orbiting-circles"
import { AnimatedList } from "@/components/ui/animated-list"
import { cn } from "@/lib/utils"
import { Dumbbell, Timer, Zap, TrendingUp, NotebookPen, Ruler, ArrowUpDown, ChevronRight, Calendar, CalendarDays, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShimmerButton } from "./ui/shimmer-button"
import DialogStickyFooterDemo from "./dialog"

// Orbiting Circles with fixed radius - animates when in view
function DynamicOrbitingCircles() {
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })

    // Detect mobile screen
    const [isMobile, setIsMobile] = React.useState(false)

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const radius = isMobile ? 145 : 200
    const innerRadius = isMobile ? 85 : 120
    const outerIconSize = isMobile ? 52 : 64
    const innerIconSize = isMobile ? 42 : 48

    return (
        <div ref={containerRef} className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
            <OrbitingCircles
                iconSize={outerIconSize}
                radius={radius}
                speed={1.5}
                pathClassName={cn("origin-center transition-all duration-700 ease-out delay-300", !isInView ? "scale-0 opacity-0" : "scale-100 opacity-100")}
            >
                <div className={cn("flex items-center justify-center rounded-full bg-linear-to-br  from-brand-100/80 to-card dark:from-brand-200/40 backdrop-blur-(--blur-thin) shadow-(--shadow-sm) border border-surface-200 p-1.5 md:p-(--space-2)", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0.9s' }}>
                    <Timer className="h-4 w-4 md:h-5 md:w-5 text-surface-400" />
                </div>
                <div className={cn("flex items-center justify-center rounded-full bg-linear-to-tr from-brand-100/80  to-card shadow-(--shadow-sm) border border-surface-200 p-1.5 md:p-(--space-2)", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0.95s' }}>
                    <Zap className="h-4 w-4 md:h-5 md:w-5 text-surface-400" />
                </div>
                <div className={cn("flex items-center justify-center rounded-full bg-linear-to-br from-brand-100/80 to-card dark:from-brand-200/40 backdrop-blur-(--blur-thin) shadow-(--shadow-sm) border border-surface-200 p-1.5 md:p-(--space-2)", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0.9s' }}>
                    <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-surface-400" />
                </div>
                <div className={cn("flex items-center justify-center rounded-full bg-linear-to-tr from-brand-100/80 to-card dark:from-brand-200/40 backdrop-blur-(--blur-thin) shadow-(--shadow-sm) border border-surface-200 p-1.5 md:p-(--space-2)", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0.95s' }}>
                    <NotebookPen className="h-4 w-4 md:h-5 md:w-5 text-surface-400" />
                </div>
            </OrbitingCircles>
            <OrbitingCircles
                iconSize={innerIconSize}
                radius={innerRadius}
                reverse
                speed={1}
                pathClassName={cn("origin-center transition-all duration-700 ease-out delay-200", !isInView ? "scale-0 opacity-0" : "scale-100 opacity-100")}
            >
                <div className={cn("flex items-center justify-center rounded-full bg-linear-to-bl from-brand-100/80 to-card dark:from-brand-200/40 backdrop-blur-(--blur-thin) shadow-(--shadow-sm) border border-surface-200 p-(--space-1) md:p-1.5", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0.9s' }}>
                    <Ruler className="h-3 w-3 md:h-4 md:w-4 text-surface-400" />
                </div>
                <div className={cn("flex items-center justify-center rounded-full bg-linear-to-tl from-brand-100/80 to-card dark:from-brand-200/40 backdrop-blur-(--blur-thin) shadow-(--shadow-sm) border border-surface-200 p-(--space-1) md:p-1.5", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0.95s' }}>
                    <ArrowUpDown className="h-3 w-3 md:h-4 md:w-4 text-surface-400" />
                </div>
                <div className={cn("flex items-center justify-center rounded-full bg-linear-to-bl from-brand-100/80 to-card dark:from-brand-200/40 backdrop-blur-(--blur-thin) shadow-(--shadow-sm) border border-surface-200 p-(--space-1) md:p-1.5", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '1.0s' }}>
                    <Dumbbell className="h-3 w-3 md:h-4 md:w-4 text-surface-400" />
                </div>
            </OrbitingCircles>

            {/* Center Icon */}
            <div className={cn("absolute flex items-center justify-center rounded-full bg-brand-500 border border-surface-300 p-(--space-6) md:p-(--space-8) z-(--z-raised)", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0s' }}>
                <Image src="/setwise-logo.png" width={50} height={50} alt="SetWise Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
            </div>
        </div >
    )
}


// Workout notification item interface
interface WorkoutItem {
    name: string
    date: string
    duration: string
    volume: string
    status: string
    highlight?: boolean
    isTrending?: boolean
}

const notifications: WorkoutItem[] = [
    {
        name: "Chest & Triceps",
        date: "Mon, Feb 2 • 05:12 PM",
        duration: "55 min",
        volume: "2.1k kg",
        status: "HIGH VOL",
    },
    {
        name: "Upper 2",
        date: "Wed, Feb 4 • 03:48 PM",
        duration: "42 min",
        volume: "1.7k kg",
        status: "+1%",
        isTrending: true,
    },
    {
        name: "Lower 1",
        date: "Thu, Jan 28 • 06:30 PM",
        duration: "65 min",
        volume: "4.2k kg",
        status: "STEADY",
        highlight: true,
    },
]

const WorkoutNotification = ({ name, date, duration, volume, status, highlight, isTrending }: WorkoutItem) => {
    const Content = (
        <figure
            className={cn(
                "relative mx-auto min-h-fit w-full md:max-w-[400px] cursor-pointer rounded-xl md:rounded-2xl p-(--space-3) md:p-(--space-4)",
                "transition-all duration-(--duration-fast) ease-(--ease-apple)",
                "bg-card border border-surface-200 shadow-(--shadow-sm)",
                highlight && "bg-linear-to-b from-brand-500/10  to-card border-brand-500"
            )}
        >
            {highlight && (
                <div className="absolute -top-2.5 right-(--space-8) md:right-(--space-10) border border-brand-500 bg-card text-surface-800 text-[8px] font-bold px-(--space-2) py-0.5 z-(--z-raised) tracking-wider rounded-full shadow-(--shadow-xs) antialiased">
                    Click
                </div>
            )}
            <div className="flex flex-col gap-(--space-2) md:gap-(--space-3)">
                {/* Header */}
                <div className="flex flex-row items-center justify-between">
                    <span className="text-subheadline font-semibold text-surface-900">{name}</span>
                    <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4 text-surface-400" />
                </div>

                {/* Date */}
                <div className="flex flex-row items-center gap-1.5 text-caption-2 md:text-caption-1 text-surface-500">
                    <CalendarDays className="h-3 w-3 md:h-3.5 md:w-3.5" />
                    <span>{date}</span>
                </div>

                {/* Stats & Status */}
                <div className="flex flex-row items-end justify-between mt-(--space-1)">
                    <div className="flex flex-row">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-caption-2 font-bold text-surface-500 tracking-wider uppercase">DURATION</span>
                            <span className="text-caption-1 md:text-subheadline font-medium text-surface-900">{duration}</span>
                        </div>
                        <div className="h-auto w-px bg-surface-300/60 mx-(--space-2) md:mx-(--space-4)"></div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-caption-2 font-bold text-surface-500 tracking-wider uppercase">VOLUME</span>
                            <span className="text-caption-1 md:text-subheadline font-medium text-surface-900">{volume}</span>
                        </div>
                    </div>

                    {isTrending ? (
                        <div className="px-(--space-2) md:px-2.5 py-0.5 md:py-(--space-1) rounded-sm bg-success-light border border-success/20 text-success-dark flex items-center gap-(--space-1)">
                            <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3" />
                            <span className="text-caption-2 font-bold">{status}</span>
                        </div>
                    ) : (
                        <div className="px-(--space-2) md:px-2.5 py-0.5 md:py-(--space-1) rounded-sm bg-surface-100 dark:bg-surface-300 border border-surface-200 dark:border-surface-400 text-caption-2 font-bold text-surface-600 tracking-wider uppercase">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </figure>
    )

    if (highlight) {
        return <DialogStickyFooterDemo trigger={Content} />
    }

    return Content
}

// Animated workout history list
function WorkoutHistoryList() {
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, margin: "-50px" })

    return (
        <div ref={containerRef} className="relative flex h-full w-full flex-col">
            <AnimatedList className="overflow-visible pt-(--space-4)" start={isInView}>
                {notifications.map((item, idx) => (
                    <WorkoutNotification {...item} key={idx} />
                ))}

            </AnimatedList>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/8 bg-linear-to-t from-background to-transparent"></div>
        </div>
    )
}

export default function BentoGridSection() {
    const t = useTranslations('BentoGrid')

    return (
        <div className="w-full border-b border-t border-border dark:border-border/40 flex flex-col justify-center items-center">
            {/* Header Section */}
            <div className="self-stretch px-(--space-4) md:px-(--space-6) lg:px-0 w-full py-(--space-12) md:py-(--space-16) border-b border-border dark:border-border/40 flex justify-center items-center gap-(--space-6)">
                <div className="w-full max-w-[616px] lg:w-[616px] px-(--space-4) md:px-(--space-6) py-(--space-4) md:py-(--space-5) overflow-hidden rounded-lg flex flex-col justify-center items-center gap-(--space-3)">
                    <ShimmerButton
                        className="border border-border"
                        shimmerDuration="3s"
                        shimmerSize="0.05em"
                        background="var(--background)"
                        shimmerColor="var(--brand-300)"
                    >
                        <span className="flex items-center gap-1.5 text-center text-caption-2 font-medium whitespace-pre-wrap text-muted-foreground leading-none">
                            <Sparkles className="h-3 w-3" />
                            {t('badge')}
                        </span>
                    </ShimmerButton>
                    <h2 className="w-full max-w-[530px] text-center text-surface-900 text-title-1 sm:text-title-1 md:text-large-title lg:text-display font-semibold">
                        {t('title')} <span className="primaryGradient font-bold">{t('titleHighlight')}</span>
                    </h2>
                    <div className="max-w-md text-center text-surface-600 text-subheadline md:text-callout">
                        {t('subtitle')}
                    </div>
                </div>
            </div>

            {/* Bento Grid Content */}
            <div className="self-stretch flex justify-center items-start">
                <div className="w-(--space-2) md:w-(--space-6) self-stretch relative overflow-hidden">
                    {/* Left decorative pattern */}
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                        {Array.from({ length: 200 }).map((_, i) => (
                            <div
                                key={i}
                                className="self-stretch h-(--space-3) sm:h-(--space-4) -rotate-45 origin-top-left outline-[0.5px] outline-border/30 outline-offset-[-0.25px]"
                            />
                        ))}
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 border-l border-r border-border dark:border-border/40">
                    {/* Top Left - Smart. Simple. Brilliant. */}
                    <div className="border-b border-r-0 md:border-r border-border dark:border-border/40 flex flex-col justify-start items-start min-h-[380px] max-h-[380px] md:min-h-[550px] md:max-h-[550px]">
                        <div className="flex flex-col gap-(--space-3) p-(--space-6) md:p-(--space-8) pb-0">
                            <h3 className="text-surface-800 text-title-3 font-semibold">
                                {t('cards.trackAnalyze.title')}
                            </h3>
                            <p className="text-surface-600 text-subheadline">
                                {t('cards.trackAnalyze.description')}
                            </p>
                        </div>
                        <div className="w-full h-full rounded-lg flex items-center justify-center overflow-hidden">
                            <SmartSimpleBrilliant
                                width="100%"
                                height="100%"
                                theme="light"
                                className="w-full h-full"
                            />
                        </div>
                    </div>

                    {/* Top Right - Your work, in sync */}
                    <div className="border-b border-border dark:border-border/40 flex flex-col justify-start items-start md:min-h-[550px] md:max-h-[550px] max-h-[380px] min-h-[380px]">
                        <div className="flex flex-col gap-(--space-3) p-(--space-6) md:p-(--space-8) pb-0">
                            <h3 className="text-surface-800 text-title-3 font-semibold">
                                {t('cards.offline.title')}
                            </h3>
                            <p className="text-surface-600 text-subheadline">
                                {t('cards.offline.description')}
                            </p>
                        </div>
                        <div className="w-full h-full flex overflow-hidden text-right items-center justify-center">
                            <YourWorkInSync
                                width="100%"
                                height="100%"
                                theme="light"
                                className=""
                            />
                        </div>
                    </div>

                    {/* Bottom Left - Effortless integration */}
                    <div className="md:min-h-[550px] md:max-h-[550px] md:border-r border-border border-b md:border-b-0 dark:border-border/40 flex flex-col overflow-hidden justify-start min-h-[380px] max-h-[380px] relative items-start">
                        <div className="flex flex-col gap-(--space-3) p-(--space-6) md:p-(--space-8) pb-0">
                            <h3 className="text-surface-800 text-title-3 font-semibold">
                                {t('cards.details.title')}
                            </h3>
                            <p className="text-surface-600 text-subheadline">
                                {t('cards.details.description')}
                            </p>
                        </div>
                        <div className="absolute bottom-0 pt-(--space-8) translate-y-1/3 w-full h-full rounded-lg flex overflow-hidden justify-center items-center">
                            <DynamicOrbitingCircles />
                            {/* Gradient mask for soft bottom edge */}
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-background to-transparent pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Bottom Right - Workout History */}
                    <div className="flex flex-col min-h-[380px] max-h-[380px] md:min-h-[550px] md:max-h-[550px] justify-start items-start">
                        <div className="flex flex-col w-full gap-(--space-3) p-(--space-6) md:p-(--space-8) pb-0">
                            <h3 className="text-surface-800 text-title-3 font-semibold">
                                {t('cards.progress.title')}
                            </h3>
                            <p className="text-surface-600 text-subheadline">
                                {t('cards.progress.description')}
                            </p>
                        </div>
                        <div className="w-full h-full rounded-lg pt-(--space-4) md:pt-(--space-6) px-(--space-4) flex overflow-hidden items-center justify-center relative">
                            <WorkoutHistoryList />
                        </div>
                    </div>
                </div>

                <div className="w-(--space-2) md:w-(--space-6) self-stretch relative overflow-hidden">
                    {/* Right decorative pattern */}
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                        {Array.from({ length: 200 }).map((_, i) => (
                            <div
                                key={i}
                                className="self-stretch h-(--space-3) sm:h-(--space-4) -rotate-45 origin-top-left outline-[0.5px] outline-border/30 outline-offset-[-0.25px]"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div >
    )
}
