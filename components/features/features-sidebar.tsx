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
    ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import ButtonRotatingGradient from "@/components/ui/buttons/ButtonRotatingGradient"
import BetaSignupDialog from "@/components/beta-signup-dialog"
import { ParticleText } from "@/components/ui/particle-text"

const sidebarItems = [
    {
        title: "Quick logging",
        href: "/features",
        icon: Zap,
        subItems: [
            { title: "Live Session", href: "/features" },
            { title: "Log Manually", href: "/features" },
            { title: "Rest Timer", href: "/features" },
        ]
    },
    {
        title: "Templates & Programs",
        href: "/features",
        icon: LayoutTemplate,
        subItems: [
            { title: "My Templates", href: "/features" },
            { title: "Public Programs", href: "/features" },
            { title: "Create New", href: "/features" },
        ]
    },
    {
        title: "History",
        href: "/features",
        icon: History,
        subItems: [
            { title: "Workout Log", href: "/features" },
            { title: "Personal Records", href: "/features" },
            { title: "Calendar", href: "/features" },
        ]
    },
    {
        title: "Progress & Analytics",
        href: "/features",
        icon: TrendingUp,
        subItems: [
            { title: "Volume Charts", href: "/features" },
            { title: "Strength Curves", href: "/features" },
            { title: "Muscle Heatmap", href: "/features" },
        ]
    },
    {
        title: "RPE/RIR, Tempo/ROM",
        href: "/features",
        icon: Gauge,
        subItems: [
            { title: "Exertion Scale", href: "/features" },
            { title: "Rep Quality", href: "/features" },
            { title: "Advanced Metrics", href: "/features" },
        ]
    },
    {
        title: "Intensifiers",
        href: "/features",
        icon: Flame,
        subItems: [
            { title: "Drop Sets", href: "/features" },
            { title: "Supersets", href: "/features" },
            { title: "Cluster Sets", href: "/features" },
        ]
    },
    {
        title: "Auto-compare",
        href: "/features",
        icon: GitCompare,
        subItems: [
            { title: "vs Last Session", href: "/features" },
            { title: "vs Best All-Time", href: "/features" },
        ]
    },
    {
        title: "Offline-first + Sync",
        href: "/features",
        icon: WifiOff,
        subItems: [
            { title: "Offline Mode", href: "/features" },
            { title: "Cloud Sync", href: "/features" },
            { title: "Data Export", href: "/features" },
        ]
    },
]

export function FeaturesSidebar() {
    const pathname = usePathname()
    // State to track open accordions. Defaulting to the first item open.
    const [openItems, setOpenItems] = useState<string[]>(["Quick logging"])

    const toggleItem = (title: string) => {
        setOpenItems(prev =>
            prev.includes(title)
                ? prev.filter(item => item !== title)
                : [...prev, title]
        )
    }

    return (
        <aside className="w-full md:w-64 shrink-0 border-r border-border/40 bg-background dark:bg-surface-100/10 md:min-h-[calc(100vh-4rem)]">
            <div className="p-2 sticky top-0 flex flex-col h-[calc(100vh-1rem)] md:h-[calc(100vh-5rem)]">
                <nav className="flex flex-col gap-2 flex-1 overflow-y-auto thin-scrollbar">
                    {sidebarItems.map((item) => {
                        const isOpen = openItems.includes(item.title)
                        const Icon = item.icon
                        // Check if any sub-item is active (for parent styling if needed, though usually parent is just a toggle)
                        const isChildActive = item.subItems.some(sub => pathname === sub.href && false) // Disabled active check for now as all hrefs are same

                        return (
                            <div key={item.title} className="w-full">
                                <button
                                    onClick={() => toggleItem(item.title)}
                                    className={cn(
                                        "w-full px-4 py-3 flex justify-between items-center text-left transition-colors duration-200 rounded-2xl group cursor-pointer",
                                        isOpen
                                            ? "bg-surface-100 dark:bg-surface-800/50 text-foreground"
                                            : "hover:bg-surface-50 dark:hover:bg-surface-800/30 text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={cn("size-5", isOpen ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                                        <span className="text-sm font-medium font-sans">
                                            {item.title}
                                        </span>
                                    </div>
                                    <ChevronDown className={cn("size-4 text-muted-foreground/50 transition-transform duration-200", isOpen ? "rotate-180 text-foreground" : "group-hover:text-foreground")} />
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
                                            <div className="relative pl-4 ml-4 mt-1 border-l border-border dark:border-border/40 space-y-1 py-1">
                                                {item.subItems.map((subItem) => (
                                                    <Link
                                                        key={subItem.title}
                                                        href={subItem.href as any}
                                                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-surface-100 dark:hover:bg-surface-800/50 rounded-lg transition-colors"
                                                    >
                                                        {subItem.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </nav>

                <div className="mt-auto px-1 pt-4">
                    <div className="relative overflow-hidden rounded-2xl border border-border/60 dark:border-border/40 bg-backgorund ">
                        {/* Background Particles - Passing empty text to get just the background field effect */}
                        <div className="absolute inset-0 z-0  pointer-events-none">
                            <ParticleText text=" " backgroundBrightness={{ dark: 190, light: 100 }} className="h-full w-full" />
                        </div>

                        <div className="relative z-10 p-5 flex flex-col items-start gap-4">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-surface-800 tracking-tight">
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
