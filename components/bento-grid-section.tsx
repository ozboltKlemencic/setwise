"use client"

import type React from "react"
import { useRef } from "react"
import { useInView } from "framer-motion"
import SmartSimpleBrilliant from "./smart-simple-brilliant"
import YourWorkInSync from "./your-work-in-sync"
import NumbersThatSpeak from "./numbers-that-speak"
import { OrbitingCircles } from "@/components/ui/orbiting-circles"
import { AnimatedList } from "@/components/ui/animated-list"
import { cn } from "@/lib/utils"
import { Dumbbell, Activity, Heart, Watch, Smartphone } from "lucide-react"
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
            <OrbitingCircles iconSize={64} radius={radius} speed={1.5}>
                <div className={cn("flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 p-2", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0.2s' }}>
                    <Watch className="h-5 w-5 text-blue-600" />
                </div>
                <div className={cn("flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 p-2", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0.25s' }}>
                    <Activity className="h-5 w-5 text-green-500" />
                </div>
                <div className={cn("flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 p-2", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0.3s' }}>
                    <Heart className="h-5 w-5 text-red-500" />
                </div>
                <div className={cn("flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 p-2", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0.35s' }}>
                    <Smartphone className="h-5 w-5 text-purple-500" />
                </div>
            </OrbitingCircles>
            <OrbitingCircles iconSize={36} radius={innerRadius} reverse speed={1}>
                <div className={cn("flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 p-1.5", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0.05s' }}>
                    <Dumbbell className="h-4 w-4 text-orange-500" />
                </div>
                <div className={cn("flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 p-1.5", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0.1s' }}>
                    <Activity className="h-4 w-4 text-teal-500" />
                </div>
                <div className={cn("flex items-center justify-center rounded-full bg-white shadow-md border border-gray-100 p-1.5", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0.15s' }}>
                    <Activity className="h-4 w-4 text-teal-500" />
                </div>
            </OrbitingCircles>
            {/* Center Icon */}
            <div className={cn("absolute flex items-center justify-center rounded-full bg-blue-600 border border-gray-200 p-4 z-10", !isInView && "opacity-0 scale-0", isInView && "animate-scale-in-bounce")} style={{ animationDelay: '0s' }}>
                <Dumbbell className="h-8 w-8 text-white" />
            </div>
        </div>
    )
}


// Workout notification item interface
interface WorkoutItem {
    name: string
    description: string
    icon: string
    color: string
    time: string
    highlight?: boolean
}

// Sample workout history data
const workoutHistory: WorkoutItem[] = [
    {
        name: "Chest & Triceps",
        description: "Completed 8 exercises",
        time: "2h ago",
        icon: "💪",
        color: "#3B82F6",
    },
    {
        name: "Personal Record!",
        description: "Bench Press 100kg",
        time: "2h ago",
        icon: "🏆",
        color: "#F59E0B",
    },
    {
        name: "Morning Run",
        description: "5.2km in 28 minutes",
        time: "Yesterday",
        icon: "🏃",
        color: "#10B981",
    },
    {
        name: "Leg Day",
        description: "Completed 6 exercises",
        time: "2 days ago",
        icon: "🦵",
        color: "#8B5CF6",
        highlight: true,
    },
]

// Single iteration of workout history
const notifications = workoutHistory

// Workout notification component
const WorkoutNotification = ({ name, description, icon, color, time, highlight }: WorkoutItem) => {
    const Content = (
        <figure
            className={cn(
                "relative mx-auto min-h-fit w-full  max-w-[400px] cursor-pointer  rounded-sm p-3",
                "transition-all duration-200 ease-in-out ",

                "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
                highlight && "border border-blue-500 hover:bg-linear-to-b hover:from-blue-500/5 hover:-translate-y-px hover:to-white transition-all duration-300 "
            )}
        >
            {highlight && (
                <div className="absolute -top-2.5 right-8 border border-blue-500 bg-white text-neutral-800 text-[9px] font-bold px-2 py-0.5 z-10 font-sans tracking-wide rounded-full shadow-sm antialiased transition-all duration-200 ease-in-out">
                    Klikni
                </div>
            )}
            <div className="flex flex-row items-center gap-3 ">
                <div
                    className="flex size-10 items-center justify-center rounded-sm"
                    style={{ backgroundColor: color }}
                >
                    <span className="text-lg">{icon}</span>
                </div>
                <div className="flex flex-col overflow-hidden flex-1">
                    <div className="flex flex-row items-center justify-between">
                        <figcaption className="flex flex-row items-center text-base font-medium whitespace-pre">
                            <span className="text-sm">{name}</span>
                            <span className="mx-1 text-gray-400">·</span>
                            <span className="text-xs text-gray-500">{time}</span>
                        </figcaption>
                    </div>

                    <p className="text-xs font-normal text-gray-500">
                        {description}
                    </p>
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
    return (
        <div className="relative flex h-full w-full flex-col">
            <AnimatedList className="overflow-visible pt-4">
                {notifications.map((item, idx) => (
                    <WorkoutNotification {...item} key={idx} />
                ))}
            </AnimatedList>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#F7F5F3] to-transparent"></div>
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
            <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] py-8 sm:py-12 md:py-12 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
                <div className="w-full max-w-[616px] lg:w-[616px] px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
                    <Badge
                        icon={
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                                <rect x="7" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                                <rect x="1" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                                <rect x="7" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                            </svg>
                        }
                        text="Bento grid"
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
                    <div className="border-b border-r-0 md:border-r border-[rgba(55,50,47,0.12)]  flex flex-col justify-start items-start">
                        <div className="flex flex-col gap-2 p-4 sm:p-6 md:p-8 lg:p-12">
                            <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                                Track. Analyze. Improve.
                            </h3>
                            <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                                Turn workout data into progress. You can see your progress in real-time on graphs and make adjustments to your workout plan to get the results you want.
                            </p>
                        </div>
                        <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex items-center justify-center overflow-hidden">
                            <SmartSimpleBrilliant
                                width="100%"
                                height="100%"
                                theme="light"
                                className="w-full h-full"
                            />
                        </div>
                    </div>

                    {/* Top Right - Your work, in sync */}
                    <div className="border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-start items-start gap-4 sm:gap-6">
                        <div className="flex flex-col gap-2 p-4 sm:p-6 md:p-8 lg:p-12 pb-0 lg:pb-0">
                            <h3 className="text-[#37322F] font-semibold leading-tight font-sans text-lg sm:text-xl">
                                No internet. No excuses.
                            </h3>
                            <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                                Track sessions, sets, and timers offline — everything saves automatically.
                            </p>
                        </div>
                        <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex overflow-hidden text-right items-center justify-center">
                            <YourWorkInSync
                                width="400"
                                height="250"
                                theme="light"
                                className="scale-60 sm:scale-75 md:scale-90"
                            />
                        </div>
                    </div>

                    {/* Bottom Left - Effortless integration */}
                    <div className="border-r-0 md:border-r border-[rgba(55,50,47,0.12)]  flex flex-col overflow-hidden justify-start    relative  items-start">
                        <div className="flex flex-col gap-2 p-4 sm:p-6 md:p-8 lg:p-12">
                            <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                                Connect your devices
                            </h3>
                            <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                                Sync with fitness trackers, smartwatches, and health apps seamlessly.
                            </p>
                        </div>
                        <div className="absolute bottom-0 translate-y-1/3 w-full h-[430px]  rounded-lg flex overflow-hidden justify-center items-center  ">
                            <DynamicOrbitingCircles />
                            {/* Gradient mask for soft bottom edge */}
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-[#F7F5F3] to-transparent pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Bottom Right - Workout History */}
                    <div className="flex flex-col justify-start items-start gap-4 sm:gap-6">
                        <div className="flex flex-col gap-2 p-4 sm:p-6 md:p-8 lg:p-12 pb-0 lg:pb-0 md:pb-4   ">
                            <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                                Zgodovina treningov
                            </h3>
                            <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                                Pregled vseh tvojih treningov in napredka na enem mestu.
                            </p>
                        </div>
                        <div className="w-full h-[200px] sm:h-[250px] md:h-[300px]  rounded-lg flex overflow-hidden items-center justify-center relative">
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
