"use client"


import React, { useRef } from "react"
import Image from "next/image"
import { useInView } from "framer-motion"
import SmartSimpleBrilliant from "./smart-simple-brilliant"
import YourWorkInSync from "./your-work-in-sync"
import NumbersThatSpeak from "./numbers-that-speak"
import { OrbitingCircles } from "@/components/ui/orbiting-circles"
import { AnimatedList } from "@/components/ui/animated-list"
import { cn } from "@/lib/utils"
import { Dumbbell, Timer, Zap, TrendingUp, NotebookPen, Ruler, ArrowUpDown, ChevronRight, Calendar, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import DialogStickyFooterDemo from "./dialog"

// Orbiting Circles with fixed radius - animates when in view
function DynamicOrbitingCircles() {
    const radius = 180
    const innerRadius = 100
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })

    return (
        <div ref={containerRef} className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
            <OrbitingCircles
                iconSize={64}
                radius={radius}
                speed={1.5}
                pathClassName={cn("origin-center transition-all duration-700 ease-out delay-300", !isInView ? "scale-0 opacity-0" : "scale-100 opacity-100")}
            >
                <div className={cn("flex items-center justify-center rounded-full bg-linear-to-br from-blue-100/80 to-white shadow-md border border-neutral-200 p-2", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0.9s' }}>
                    <Timer className="h-5 w-5 text-neutral-400" />
                </div>
                <div className={cn("flex items-center justify-center rounded-full bg-linear-to-tr from-blue-100/80 to-white shadow-md border border-neutral-300 p-2", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0.95s' }}>
                    <Zap className="h-5 w-5 text-neutral-400" />
                </div>
                <div className={cn("flex items-center justify-center rounded-full  bg-linear-to-br from-blue-100/80 to-white  shadow-md border border-neutral-200 p-2", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0.9s' }}>
                    <TrendingUp className="h-5 w-5 text-neutral-400" />
                </div>
                <div className={cn("flex items-center justify-center rounded-full  bg-linear-to-tr from-blue-100/80 to-white  shadow-md border border-neutral-200 p-2", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0.95s' }}>
                    <NotebookPen className="h-5 w-5 text-neutral-400" />
                </div>
            </OrbitingCircles>
            <OrbitingCircles
                iconSize={36}
                radius={innerRadius}
                reverse
                speed={1}
                pathClassName={cn("origin-center transition-all duration-700 ease-out delay-200", !isInView ? "scale-0 opacity-0" : "scale-100 opacity-100")}
            >
                <div className={cn("flex items-center justify-center rounded-full  bg-linear-to-bl from-blue-100/80 to-white  shadow-md border border-neutral-200 p-1.5", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0.9s' }}>
                    <Ruler className="h-4 w-4 text-neutral-400" />
                </div>
                <div className={cn("flex items-center justify-center rounded-full  bg-linear-to-tl from-blue-100/80 to-white  shadow-md border border-neutral-200 p-1.5", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0.95s' }}>
                    <ArrowUpDown className="h-4 w-4 text-neutral-400" />
                </div>
                <div className={cn("flex items-center justify-center rounded-full  bg-linear-to-bl from-blue-100/80 to-white  shadow-md border border-neutral-200 p-1.5", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '1.0s' }}>
                    <Dumbbell className="h-4 w-4 text-neutral-400" />
                </div>
            </OrbitingCircles>

            {/* Center Icon */}
            <div className={cn("absolute flex items-center justify-center rounded-full bg-[#0263ff] border border-neutral-300 p-4 z-10", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0s' }}>
                <Image src="/setwise-logo.png" width={40} height={40} alt="SetWise Logo" className="w-10 h-10 object-contain" />
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
                "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer rounded-2xl p-4",
                "transition-all duration-200 ease-in-out ",
                "bg-white border border-neutral-200 shadow-md",
                highlight && "bg-linear-to-b from-blue-500/10 to-white border-blue-500"
            )}
        >
            {highlight && (
                <div className="absolute -top-2.5 right-10 border border-blue-500 bg-white text-neutral-800 text-[9px] font-bold px-2 py-0.5 z-10 font-sans tracking-wide rounded-full shadow-sm antialiased transition-all duration-200 ease-in-out">
                    Click
                </div>
            )}
            <div className="flex flex-col gap-3">
                {/* Header */}
                <div className="flex flex-row items-center justify-between">
                    <span className="text-base font-semibold text-gray-900">{name}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>

                {/* Date */}
                <div className="flex flex-row items-center gap-1.5 text-xs text-gray-500">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{date}</span>
                </div>

                {/* Stats & Status */}
                <div className="flex flex-row items-end justify-between mt-1">
                    <div className="flex flex-row">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">DURATION</span>
                            <span className="text-sm font-medium text-gray-900">{duration}</span>
                        </div>
                        <div className="h-auto w-px bg-neutral-200/70 mx-4"></div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">VOLUME</span>
                            <span className="text-sm font-medium text-gray-900">{volume}</span>
                        </div>
                    </div>

                    {isTrending ? (
                        <div className="px-2.5 py-1 rounded-md bg-emerald-100/50 border border-emerald-200 text-emerald-600 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span className="text-[11px] font-bold">{status}</span>
                        </div>
                    ) : (
                        <div className="px-2.5 py-1 rounded-md bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-600 tracking-wide uppercase">
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
            <AnimatedList className="overflow-visible pt-4" start={isInView}>
                {notifications.map((item, idx) => (
                    <WorkoutNotification {...item} key={idx} />
                ))}
            </AnimatedList>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/8 bg-gradient-to-t from-[#F7F5F3] to-transparent"></div>
        </div>
    )
}

// Reusable Badge Component
function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="px-[14px] py-[6px] bg-white  overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] ">
            <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">{icon}</div>
            <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3 font-sans">
                {text}
            </div>
        </div>
    )
}

export default function BentoGridSection() {
    return (
        <div className="w-full border-b border-t border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
            {/* Header Section */}
            <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-0 w-full py-8 sm:py-12 md:py-12 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
                <div className="w-full max-w-[616px] lg:w-[616px] px-4 sm:px-6 py-4 sm:py-5 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4">
                    <Badge
                        icon={
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                                <rect x="7" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                                <rect x="1" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                                <rect x="7" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                            </svg>
                        }
                        text="Features"
                    />
                    <div className="w-full max-w-[598.06px] lg:w-[598.06px] text-center flex justify-center flex-col text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
                        Your fitness journey, simplified and powerful
                    </div>
                    <div className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
                        Track every rep, monitor every metric, and celebrate
                        <br />
                        every milestone with tools built for your success.
                    </div>
                </div>
            </div>

            {/* Bento Grid Content */}
            <div className="self-stretch flex justify-center items-start">
                <div className="w-6  self-stretch relative overflow-hidden">
                    {/* Left decorative pattern */}
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                        {Array.from({ length: 200 }).map((_, i) => (
                            <div
                                key={i}
                                className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                            />
                        ))}
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 border-l border-r border-[rgba(55,50,47,0.12)]">
                    {/* Top Left - Smart. Simple. Brilliant. */}
                    <div className="border-b border-r-0 md:border-r border-[rgba(55,50,47,0.12)]  flex flex-col justify-start items-start lg:min-h-[550px] lg:max-h-[550px]">
                        <div className="flex flex-col gap-2 p-4 sm:p-6 md:p-8 lg:p-12 lg:pb-4 ">
                            <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                                Track. Analyze. Improve.
                            </h3>
                            <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                                Turn workout data into progress. You can see your progress in real-time on graphs.
                            </p>
                        </div>
                        <div className="w-full h-[200px] sm:h-[250px] md:h-full rounded-lg flex  items-center justify-center overflow-hidden">
                            <SmartSimpleBrilliant
                                width="100%"
                                height="100%"
                                theme="light"
                                className="w-full h-full"
                            />
                        </div>
                    </div>

                    {/* Top Right - Your work, in sync */}
                    <div className="border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-start items-start lg:min-h-[550px] lg:max-h-[550px]">
                        <div className="flex flex-col gap-2 p-4 sm:p-6 md:p-8 lg:p-12 pb-0 lg:pb-4  ">
                            <h3 className="text-[#37322F] font-semibold leading-tight font-sans text-lg sm:text-xl">
                                No internet. No excuses.
                            </h3>
                            <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                                Track sessions, sets, and timers offline - everything saves automatically.
                            </p>
                        </div>
                        <div className="w-full h-[200px] sm:h-[250px] md:h-full  rounded-lg flex overflow-hidden text-right items-center justify-center">
                            <YourWorkInSync
                                width="400"
                                height="250"
                                theme="light"
                                className="scale-60 sm:scale-75 md:scale-90"
                            />
                        </div>
                    </div>

                    {/* Bottom Left - Effortless integration */}
                    <div className="border-r-0 lg:min-h-[550px] lg:max-h-[550px] md:border-r border-[rgba(55,50,47,0.12)]  flex flex-col overflow-hidden justify-start    relative  items-start">
                        <div className="flex flex-col gap-2 p-4 sm:p-6 md:p-8 lg:p-12 lg:pb-4 ">
                            <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                                Details drive progress
                            </h3>
                            <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                                Reps and weight don’t tell the full story. Capture tempo, ROM, and intensifiers with quick notes, and turn every session into actionable progress.
                            </p>
                        </div>
                        <div className="absolute bottom-0 translate-y-1/3 w-full h-[430px]  rounded-lg flex overflow-hidden justify-center items-center  ">
                            <DynamicOrbitingCircles />
                            {/* Gradient mask for soft bottom edge */}
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-[#F7F5F3] to-transparent pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Bottom Right - Workout History */}
                    <div className="flex flex-col lg:min-h-[550px] lg:max-h-[550px] justify-start items-start ">
                        <div className="flex flex-col w-full gap-2 p-4 sm:p-6 md:p-8 lg:p-12 pb-0 lg:pb-4 md:pb-4   ">
                            <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                                Progress Overview
                            </h3>
                            <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                                See trends, spot patterns, and push past plateaus. Every rep counts, every set matters.
                            </p>
                        </div>
                        <div className="w-full h-[200px] sm:h-[250px] md:h-full rounded-lg lg:pt-8 flex overflow-hidden items-center justify-center relative">
                            <WorkoutHistoryList />
                        </div>
                    </div>
                </div>

                <div className="w-6  self-stretch relative overflow-hidden">
                    {/* Right decorative pattern */}
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                        {Array.from({ length: 200 }).map((_, i) => (
                            <div
                                key={i}
                                className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
