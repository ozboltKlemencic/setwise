"use client"

import { useState, useRef, useMemo, memo, useEffect, useCallback } from "react"
import { Link, usePathname } from "@/i18n/navigation"
import { ChevronDown, AlignLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// ── Types ──────────────────────────────────────────────────────
export type SidebarSubItem = {
    title: string
    href: string
}

export type SidebarItem = {
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    subItems: SidebarSubItem[]
}

// ── Internal link component ────────────────────────────────────
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

// ── Main Sidebar Component ─────────────────────────────────────
export function Sidebar({ items, children }: { items: SidebarItem[]; children?: React.ReactNode }) {
    const pathname = usePathname()

    // Derive which sidebar item is active based on URL (stable, no flicker)
    const activeTitle = useMemo(() => {
        // Exact match for base path (first item)
        const firstItem = items[0]
        if (firstItem && (pathname === firstItem.href || pathname.endsWith(firstItem.href))) return firstItem.title
        // Match other items by path prefix
        const found = items.find(
            (item, idx) => idx !== 0 && (pathname === item.href || pathname.endsWith(item.href))
        )
        return found?.title ?? null
    }, [pathname, items])

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
    // Track last hash pushed to history to avoid redundant replaceState calls
    // (iOS Safari throws SecurityError if replaceState is called >100×/30s)
    const lastPushedHash = useRef("")

    // Read initial hash on mount
    useEffect(() => {
        const hash = window.location.hash
        if (hash) {
            setActiveHash(pathname + hash)
            lastPushedHash.current = hash
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // ── Scroll Spy ─────────────────────────────────────────────
    useEffect(() => {
        const currentItem = items.find((item) => item.title === activeTitle)
        if (!currentItem) return

        const sections = currentItem.subItems
            .map((sub) => {
                const hashIdx = sub.href.indexOf("#")
                if (hashIdx === -1) return null
                const id = sub.href.substring(hashIdx + 1)
                const el = document.getElementById(id)
                return el ? { id, href: sub.href, el } : null
            })
            .filter(Boolean) as { id: string; href: string; el: HTMLElement }[]

        if (sections.length === 0) return

        let ticking = false
        const handleScroll = () => {
            if (ticking || isClickScrolling.current) return
            ticking = true
            requestAnimationFrame(() => {
                const detectionY = window.innerHeight * 0.25

                let active = sections[0]
                for (const section of sections) {
                    if (section.el.getBoundingClientRect().top <= detectionY) {
                        active = section
                    }
                }

                if (active) {
                    setActiveHash(active.href)
                    // Only update URL hash when it actually changes
                    const newHash = "#" + active.id
                    if (lastPushedHash.current !== newHash) {
                        lastPushedHash.current = newHash
                        try {
                            window.history.replaceState(null, "", newHash)
                        } catch {
                            // iOS Safari: SecurityError if rate-limited
                        }
                    }
                }
                ticking = false
            })
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        handleScroll()

        return () => window.removeEventListener("scroll", handleScroll)
    }, [activeTitle, pathname, items])

    // Toggle accordion
    const toggleItem = useCallback((title: string) => {
        setOpenItem((prev) => {
            if (prev === title && title === activeTitle) return prev
            return prev === title ? null : title
        })
    }, [activeTitle])

    // Handle sub-item click
    const handleSubItemClick = useCallback((href: string) => {
        isClickScrolling.current = true
        setActiveHash(href)

        const hashIndex = href.indexOf("#")
        if (hashIndex !== -1) {
            const hash = href.substring(hashIndex)
            window.history.replaceState(null, "", hash)

            requestAnimationFrame(() => {
                const el = document.querySelector(hash)
                if (el) {
                    el.scrollIntoView({ behavior: "smooth" })
                }
            })
        }

        setTimeout(() => {
            isClickScrolling.current = false
        }, 800)
    }, [])

    return (
        <div className="w-full h-full flex flex-col">
            <div className="p-2 flex flex-col flex-1">
                <nav className="flex flex-col gap-2 flex-1 thin-scrollbar">
                    {items.map((item) => (
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
                {children && (
                    <div className="mt-auto px-1 pt-4">
                        {children}
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Mobile Sidebar (bottom sheet — matches navigation mobile menu) ──
export function MobileSidebar({ items, title }: { items: SidebarItem[]; title?: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    // Derive active item for the floating button label
    const activeItem = useMemo(() => {
        const firstItem = items[0]
        if (firstItem && (pathname === firstItem.href || pathname.endsWith(firstItem.href))) return firstItem
        return items.find(
            (item, idx) => idx !== 0 && (pathname === item.href || pathname.endsWith(item.href))
        ) ?? null
    }, [pathname, items])

    // Close sheet on page navigation
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => { document.body.style.overflow = "" }
    }, [isOpen])

    return (
        <>
            {/* ── Floating trigger button ── */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-5 right-5 z-40 min-[1152px]:hidden flex items-center gap-2 px-4 py-3 bg-card/70 backdrop-blur-(--blur-thick) border border-border/60 rounded-2xl shadow-(--shadow-lg) cursor-pointer"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
            >
                <AlignLeft className="size-4 text-foreground" />
                <span className="text-footnote font-medium text-foreground">
                    {activeItem?.title ?? "Menu"}
                </span>
            </motion.button>

            {/* ── Bottom sheet overlay ── */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            aria-hidden="true"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-(--blur-thin) z-(--z-modal) min-[1152px]:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Sheet */}
                        <motion.div
                            role="dialog"
                            aria-label="Sidebar navigation"
                            aria-modal="true"
                            initial={{ y: "100%", opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: "100%", opacity: 0, scale: 0.9 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 22,
                                mass: 0.9
                            }}
                            className="fixed bottom-0 md:bottom-[8%] left-0 right-0 z-(--z-toast) min-[1152px]:hidden max-w-md mx-auto"
                        >
                            <motion.div
                                initial={{ scale: 0.92 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.92 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 350,
                                    damping: 20
                                }}
                                className="mx-(--space-4) mb-(--space-4) bg-card/95 rounded-3xl shadow-(--shadow-2xl) overflow-hidden border border-border/60 relative"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-(--space-6) py-(--space-4)">
                                    <div className="flex items-center gap-(--space-2)">
                                        <AlignLeft className="size-4 text-muted-foreground" />
                                        <span className="text-callout font-bold text-foreground">{title ?? "Menu"}</span>
                                    </div>
                                    <motion.button
                                        onClick={() => setIsOpen(false)}
                                        className="size-(--space-9) flex items-center justify-center rounded-full hover:bg-surface-100 transition-colors duration-(--duration-normal) text-foreground cursor-pointer"
                                        aria-label="Close menu"
                                        whileTap={{ scale: 0.9 }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <svg
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </motion.button>
                                </div>

                                {/* Links */}
                                <nav aria-label="Mobile sidebar" className="px-(--space-4) max-h-[60vh] overflow-y-auto thin-scrollbar">
                                    {items.map((item, index) => {
                                        const Icon = item.icon
                                        const isActive = activeItem?.title === item.title
                                        return (
                                            <motion.div
                                                key={item.title}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 24,
                                                    delay: index * 0.04
                                                }}
                                            >
                                                <Link
                                                    href={item.href as any}
                                                    prefetch={true}
                                                    onClick={() => setIsOpen(false)}
                                                    className={cn(
                                                        "flex items-center gap-3 px-(--space-3) py-(--space-4) text-callout font-medium rounded-xl transition-colors",
                                                        isActive
                                                            ? "text-foreground dark:bg-surface-300/30 bg-surface-300/25"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-surface-50"
                                                    )}
                                                >
                                                    <Icon className={cn("size-4 shrink-0", isActive ? "text-foreground" : "text-muted-foreground")} />
                                                    {item.title}
                                                </Link>
                                                {index < items.length - 1 && (
                                                    <div role="separator" className="h-px bg-border mx-(--space-3)" />
                                                )}
                                            </motion.div>
                                        )
                                    })}
                                </nav>

                                {/* Bottom padding */}
                                <div className="h-(--space-4)" />
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
