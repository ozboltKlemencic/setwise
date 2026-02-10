"use client"

import { useState, useRef, useMemo, memo, useEffect, useCallback } from "react"
import { Link, usePathname } from "@/i18n/navigation"
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

const SidebarLinkItem = memo(({ item, isOpen, isActive, activeHash, handleSubItemClick, toggleItem, pathname }: any) => {
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
                        isActive
                            ? "bg-surface-200/80 border border-border dark:bg-surface-300/40 text-foreground"
                            : "hover:bg-surface-200 border border-border/0 dark:hover:bg-surface-300/20 text-muted-foreground hover:text-foreground"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Icon className={cn("size-4", isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
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
                                    <div key={subItem.title} className="py-0.5">
                                        <button
                                            type="button"
                                            onClick={() => handleSubItemClick(subItem.href)}
                                            className={cn(
                                                "relative block w-full text-left px-4 py-2 text-[13px] text-muted-foreground hover:text-foreground hover:bg-surface-200/80 dark:hover:bg-surface-300/20 rounded-lg transition-colors cursor-pointer",
                                                isActive && "bg-surface-200/50 dark:bg-surface-300/20 text-foreground font-medium"
                                            )}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-nav-line"
                                                    className="absolute -left-4 top-1 bottom-1 w-0.5 rounded-full bg-surface-500"
                                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                />
                                            )}
                                            {subItem.title}
                                        </button>
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

    // Derive which sidebar item is active based on URL (stable, no flicker)
    const activeTitle = useMemo(() => {
        // Exact match for /features (Intro)
        if (pathname === "/features" || pathname.endsWith("/features")) return "Intro"
        // Match other items by path prefix
        const found = sidebarItems.find(
            (item) => item.href !== "/features" && (pathname === item.href || pathname.endsWith(item.href))
        )
        return found?.title ?? null
    }, [pathname])

    // Accordion open/close state — defaults to the active item
    const [openItem, setOpenItem] = useState<string | null>(activeTitle)
    const [activeHash, setActiveHash] = useState("")

    // When pathname changes (page navigation), open the new active item
    useEffect(() => {
        if (activeTitle) {
            setOpenItem(activeTitle)
        }
    }, [activeTitle])

    // Guard ref — prevents scroll-spy from fighting with click-initiated scrolls
    const isClickScrolling = useRef(false)

    // Read initial hash on mount
    useEffect(() => {
        const hash = window.location.hash
        if (hash) {
            setActiveHash(pathname + hash)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // ── Scroll Spy ─────────────────────────────────────────────
    // Observe each section on the current page and update activeHash
    // as the user scrolls past them.
    useEffect(() => {
        const activeItem = sidebarItems.find((item) => item.title === activeTitle)
        if (!activeItem) return

        // Collect section IDs from the active item's sub-items
        const sectionIds = activeItem.subItems
            .map((sub) => {
                const hashIdx = sub.href.indexOf("#")
                return hashIdx !== -1 ? sub.href.substring(hashIdx + 1) : null
            })
            .filter(Boolean) as string[]

        const elements = sectionIds
            .map((id) => document.getElementById(id))
            .filter(Boolean) as HTMLElement[]

        if (elements.length === 0) return

        const observer = new IntersectionObserver(
            (entries) => {
                // Skip updates during click-initiated scrolls
                if (isClickScrolling.current) return

                // Find entries that are entering the detection zone
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

                if (visible.length > 0) {
                    const id = visible[0].target.id
                    const subItem = activeItem.subItems.find((sub) =>
                        sub.href.endsWith("#" + id)
                    )
                    if (subItem) {
                        setActiveHash(subItem.href)
                        window.history.replaceState(null, "", "#" + id)
                    }
                }
            },
            {
                // Detection zone = top 35% of viewport
                rootMargin: "0px 0px -65% 0px",
                threshold: 0,
            }
        )

        elements.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [activeTitle, pathname])

    // Toggle accordion — but never close the active (URL-matched) item
    const toggleItem = useCallback((title: string) => {
        setOpenItem((prev) => {
            if (prev === title && title === activeTitle) return prev // keep active open
            return prev === title ? null : title
        })
    }, [activeTitle])

    // Handle sub-item click without triggering Next.js navigation.
    // Separates state update (indicator animation) from scroll.
    const handleSubItemClick = useCallback((href: string) => {
        // 1. Guard — block scroll-spy during click-scroll animation
        isClickScrolling.current = true

        // 2. Update active state — triggers the indicator animation
        setActiveHash(href)

        // 3. Extract the hash and scroll to the target element
        const hashIndex = href.indexOf("#")
        if (hashIndex !== -1) {
            const hash = href.substring(hashIndex)

            // Update URL without triggering navigation/re-render
            window.history.replaceState(null, "", hash)

            // Scroll after micro-delay so indicator animation starts first
            requestAnimationFrame(() => {
                const el = document.querySelector(hash)
                if (el) {
                    el.scrollIntoView({ behavior: "smooth" })
                }
            })
        }

        // 4. Release guard after smooth scroll completes (~800ms)
        setTimeout(() => {
            isClickScrolling.current = false
        }, 800)
    }, [])

    return (
        <div className="w-full h-full flex flex-col">
            <div className="p-2 flex flex-col flex-1">
                <nav className="flex flex-col gap-2 flex-1 thin-scrollbar">
                    {sidebarItems.map((item) => (
                        <SidebarLinkItem
                            key={item.title}
                            item={item}
                            isOpen={openItem === item.title}
                            isActive={activeTitle === item.title}
                            activeHash={activeHash}
                            handleSubItemClick={handleSubItemClick}
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
