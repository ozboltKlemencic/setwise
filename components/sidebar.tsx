"use client"

import { useState, useRef, useMemo, memo, useEffect, useCallback } from "react"
import { Link, usePathname } from "@/i18n/navigation"
import { ChevronDown } from "lucide-react"
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

    // Read initial hash on mount
    useEffect(() => {
        const hash = window.location.hash
        if (hash) {
            setActiveHash(pathname + hash)
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
                    window.history.replaceState(null, "", "#" + active.id)
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
