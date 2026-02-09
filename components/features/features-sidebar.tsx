"use client"

import { useState } from "react"
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
            { title: "Overview", href: "#overview" },
            { title: "Key Features", href: "#key-features" },
            { title: "Get Started", href: "#get-started" }, // ali "Download"
        ]
    },
    {
        title: "Quick logging",
        href: "/features",
        icon: Zap,
        subItems: [
            { title: "Live Session", href: "#live-session" },
            { title: "Log Manually", href: "#log-manually" },
            { title: "Rest Timer", href: "#rest-timer" },
        ]
    },
    {
        title: "Templates & Programs",
        href: "/features",
        icon: LayoutTemplate,
        subItems: [
            { title: "My Templates", href: "#my-templates" },
            { title: "Public Programs", href: "#public-programs" },
            { title: "Create New", href: "#create-new" },
        ]
    },
    {
        title: "History",
        href: "/features",
        icon: History,
        subItems: [
            { title: "Workout Log", href: "#workout-log" },
            { title: "Personal Records", href: "#personal-records" },
            { title: "Calendar", href: "#calendar" },
        ]
    },
    {
        title: "Progress & Analytics",
        href: "/features",
        icon: TrendingUp,
        subItems: [
            { title: "Volume Charts", href: "#volume-charts" },
            { title: "Strength Curves", href: "#strength-curves" },
            { title: "Muscle Heatmap", href: "#muscle-heatmap" },
        ]
    },
    {
        title: "RPE/RIR, Tempo/ROM",
        href: "/features",
        icon: Gauge,
        subItems: [
            { title: "Exertion Scale", href: "#exertion-scale" },
            { title: "Rep Quality", href: "#rep-quality" },
            { title: "Advanced Metrics", href: "#advanced-metrics" },
        ]
    },
    {
        title: "Intensifiers",
        href: "/features",
        icon: Flame,
        subItems: [
            { title: "Drop Sets", href: "#drop-sets" },
            { title: "Supersets", href: "#supersets" },
            { title: "Cluster Sets", href: "#cluster-sets" },
        ]
    },
    {
        title: "Auto-compare",
        href: "/features",
        icon: GitCompare,
        subItems: [
            { title: "vs Last Session", href: "#vs-last-session" },
            { title: "vs Best All-Time", href: "#vs-best-all-time" },
        ]
    },
    {
        title: "Offline-first + Sync",
        href: "/features",
        icon: WifiOff,
        subItems: [
            { title: "Offline Mode", href: "#offline-mode" },
            { title: "Cloud Sync", href: "#cloud-sync" },
            { title: "Data Export", href: "#data-export" },
        ]
    },
]

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
        <aside className="w-full md:w-64 shrink-0 border-r border-border/40 bg-background dark:bg-surface-100/10 md:min-h-[calc(100vh-2rem)]">
            <div className="p-2 sticky top-0 flex flex-col h-[calc(100vh-1rem)] md:h-[calc(100vh-5rem)]">

                <nav className="flex flex-col gap-2 flex-1 overflow-y-auto thin-scrollbar ">
                    {sidebarItems.map((item) => {
                        const isOpen = openItem === item.title
                        const Icon = item.icon

                        return (
                            <div key={item.title} className="w-full">
                                <button
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
                                    <ChevronDown className={cn("size-3.5 text-muted-foreground/50 transition-transform duration-200", isOpen ? "rotate-180 text-foreground" : "group-hover:text-foreground")} />
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="relative pl-4  space-y-1 py-1" style={{ marginLeft: "25px" }}>
                                                {/* Continuous gray line */}
                                                <div className="absolute left-0 top-0 bottom-0 w-px bg-border dark:bg-border" />

                                                {item.subItems.map((subItem) => {
                                                    const isActive = activeHash === subItem.href
                                                    return (
                                                        <div key={subItem.title} className="relative py-1">
                                                            {isActive && (
                                                                <motion.div
                                                                    layoutId="active-nav-line"
                                                                    className="absolute -left-[16px] top-0 bottom-0 w-px bg-surface-500 "
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    exit={{ opacity: 0 }}
                                                                />
                                                            )}
                                                            <Link
                                                                href={subItem.href as any}
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
                    })}
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
        </aside>
    )
}
