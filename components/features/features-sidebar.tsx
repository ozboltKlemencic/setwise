"use client"

import { useState, useRef, useMemo, memo } from "react"
import { usePathname } from "next/navigation"
import { Link } from "@/i18n/navigation"
import {
    Zap,
    LayoutTemplate,
    History,
    TrendingUp,
    Gauge,
    Flame,
    GitCompare,
    WifiOff,
    ChevronDown,
    Sparkles,
    Home,
    Info
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import ButtonRotatingGradient from "@/components/ui/buttons/ButtonRotatingGradient"
import BetaSignupDialog from "@/components/beta-signup-dialog"
import { ParticleText } from "@/components/ui/particle-text"

const sidebarItems = [
    {
        title: "Intro",
        href: "/features",
        icon: Info,
        subItems: [
            { title: "Overview", href: "/features#overview" },
            { title: "Key Features", href: "/features#key-features" },
            { title: "Get Started", href: "/features#get-started" },
        ]
    },
    {
        title: "Quick logging",
        href: "/features/quick-logging",
        icon: Zap,
        subItems: [
            { title: "Live Session", href: "/features/quick-logging#live-session" },
            { title: "Log Manually", href: "/features/quick-logging#log-manually" },
            { title: "Rest Timer", href: "/features/quick-logging#rest-timer" },
        ]
    },
    {
        title: "Templates & Programs",
        href: "/features/templates-programs",
        icon: LayoutTemplate,
        subItems: [
            { title: "My Templates", href: "/features/templates-programs#my-templates" },
            { title: "Public Programs", href: "/features/templates-programs#public-programs" },
            { title: "Create New", href: "/features/templates-programs#create-new" },
        ]
    },
    {
        title: "History",
        href: "/features/history",
        icon: History,
        subItems: [
            { title: "Workout Log", href: "/features/history#workout-log" },
            { title: "Personal Records", href: "/features/history#personal-records" },
            { title: "Calendar", href: "/features/history#calendar" },
        ]
    },
    {
        title: "Progress & Analytics",
        href: "/features/progress-analytics",
        icon: TrendingUp,
        subItems: [
            { title: "Volume Charts", href: "/features/progress-analytics#volume-charts" },
            { title: "Strength Curves", href: "/features/progress-analytics#strength-curves" },
            { title: "Muscle Heatmap", href: "/features/progress-analytics#muscle-heatmap" },
        ]
    },
    {
        title: "RPE/RIR, Tempo/ROM",
        href: "/features/advanced-metrics",
        icon: Gauge,
        subItems: [
            { title: "Exertion Scale", href: "/features/advanced-metrics#exertion-scale" },
            { title: "Rep Quality", href: "/features/advanced-metrics#rep-quality" },
            { title: "Advanced Metrics", href: "/features/advanced-metrics#advanced-metrics" },
        ]
    },
    {
        title: "Intensifiers",
        href: "/features/intensifiers",
        icon: Flame,
        subItems: [
            { title: "Drop Sets", href: "/features/intensifiers#drop-sets" },
            { title: "Supersets", href: "/features/intensifiers#supersets" },
            { title: "Cluster Sets", href: "/features/intensifiers#cluster-sets" },
        ]
    },
    {
        title: "Auto-compare",
        href: "/features/auto-compare",
        icon: GitCompare,
        subItems: [
            { title: "vs Last Session", href: "/features/auto-compare#vs-last-session" },
            { title: "vs Best All-Time", href: "/features/auto-compare#vs-best-all-time" },
        ]
    },
    {
        title: "Offline-first + Sync",
        href: "/features/offline-sync",
        icon: WifiOff,
        subItems: [
            { title: "Offline Mode", href: "/features/offline-sync#offline-mode" },
            { title: "Cloud Sync", href: "/features/offline-sync#cloud-sync" },
            { title: "Data Export", href: "/features/offline-sync#data-export" },
        ]
    },
]

const SidebarLinkItem = memo(({ item, isOpen, activeHash, handleLinkClick, toggleItem, pathname }: any) => {
    const Icon = item.icon
    return (
        <div className="w-full">
            <div className="relative group">
                <Link
                    href={item.href as any}
                    prefetch={true}
                    onClick={() => toggleItem(item.title)}
                    className={cn(
                        "w-full px-4 py-3 flex justify-between items-center text-left transition-colors duration-200 rounded-2xl group cursor-pointer",
                        isOpen
                            ? "bg-surface-200/80 border border-border dark:bg-surface-300/40 text-foreground"
                            : "hover:bg-surface-200 dark:hover:bg-surface-300/20 text-muted-foreground hover:text-foreground"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Icon className={cn("size-4", isOpen ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                        <span className="text-[13px] font-medium font-sans">
                            {item.title}
                        </span>
                    </div>
                    <ChevronDown
                        className={cn("size-3.5 text-muted-foreground/50 transition-transform duration-200", isOpen ? "rotate-180 text-foreground" : "group-hover:text-foreground")}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleItem(item.title)
                        }}
                    />
                </Link>
            </div>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="relative pl-4 space-y-1 py-1" style={{ marginLeft: "25px" }}>
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-border dark:bg-border" />

                            {item.subItems.map((subItem: any) => {
                                const isActive = activeHash === subItem.href || (pathname + activeHash === subItem.href)
                                return (
                                    <div key={subItem.title} className="relative py-0.5">
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-nav-line"
                                                className="absolute -left-[16px] top-1.5 bottom-1.5 w-px bg-surface-500 "
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            />
                                        )}
                                        <Link
                                            href={subItem.href as any}
                                            prefetch={true}
                                            onClick={() => handleLinkClick(subItem.href)}
                                            className={cn(
                                                "block px-4 py-2 text-[13px] text-muted-foreground hover:text-foreground hover:bg-surface-200/80 dark:hover:bg-surface-300/20 rounded-lg transition-colors",
                                                isActive && "bg-surface-200/50 dark:bg-surface-300/20 text-foreground font-medium"
                                            )}
                                        >
                                            {subItem.title}
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
})
SidebarLinkItem.displayName = "SidebarLinkItem"

export function FeaturesSidebar() {
    const pathname = usePathname()
    // State to track open accordions. Defaulting to the first item open.
    const [openItem, setOpenItem] = useState<string | null>("Quick logging")
    const [activeHash, setActiveHash] = useState("")

    // Set initial active hash on mount
    useState(() => {
        if (typeof window !== "undefined") {
            setActiveHash(window.location.hash)
        }
    })

    const toggleItem = (title: string) => {
        setOpenItem(prev => (prev === title ? null : title))
    }

    const handleLinkClick = (href: string) => {
        setActiveHash(href)
    }

    return (
        <div className="w-full h-full flex flex-col">
            <div className="p-2 flex flex-col flex-1">
                <nav className="flex flex-col gap-2 flex-1 bg-red-400 thin-scrollbar">
                    {sidebarItems.map((item) => (
                        <SidebarLinkItem
                            key={item.title}
                            item={item}
                            isOpen={openItem === item.title}
                            activeHash={activeHash}
                            handleLinkClick={handleLinkClick}
                            toggleItem={toggleItem}
                            pathname={pathname}
                        />
                    ))}
                </nav>
                {/* card*/}
                <div className="mt-auto px-1 pt-4">
                    <div className="relative overflow-hidden rounded-2xl border border-border/60 dark:border-border/40 bg-backgorund ">
                        {/* Background Particles - Passing empty text to get just the background field effect */}
                        <div className="absolute inset-0 z-0  pointer-events-none">
                            <ParticleText text=" " backgroundBrightness={{ dark: 190, light: 100 }} className="h-full w-full" />
                        </div>

                        <div className="relative z-10 p-5 flex flex-col items-start gap-4">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-surface-700 tracking-tight">
                                    Get Beta Access
                                </h3>
                                <p className="text-sm text-surface-600 dark:text-surface-600 leading-relaxed font-sans">
                                    Download app and track your progress with precision.
                                </p>
                            </div>

                            <BetaSignupDialog
                                trigger={
                                    <ButtonRotatingGradient className="w-full text-base font-semibold">
                                        Try for Free
                                    </ButtonRotatingGradient>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
