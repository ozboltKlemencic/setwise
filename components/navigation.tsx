"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import ButtonRotatingGradient from "./ui/buttons/ButtonRotatingGradient"
import Blur from "./ui/Blur"
import BetaSignupDialog from "./beta-signup-dialog"
import LanguageSwitcher from "./layout/LanguageSwitcher"
import ThemeToggler from "./layout/ThemeToggler"

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isBetaDialogOpen, setIsBetaDialogOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState("#")
    const t = useTranslations('Navigation')
    const tCommon = useTranslations('Common')

    const navLinks = [
        { href: "#how-it-works", label: t('howItWorks'), sectionId: "how-it-works" },
        { href: "#testimonials", label: t('testimonials'), sectionId: "testimonials" },
        { href: "#features", label: t('features'), sectionId: "features" },
        { href: "#faq", label: t('faq'), sectionId: "faq" },
    ]

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 400)
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        handleScroll()

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        const handleScrollActive = () => {
            const scrollPosition = window.scrollY + 150

            if (window.scrollY < 100) {
                setActiveSection("#")
                return
            }

            let lastPassedSection = "#"

            for (const link of navLinks) {
                const element = document.getElementById(link.sectionId)
                if (element) {
                    const offsetTop = element.offsetTop
                    if (scrollPosition >= offsetTop) {
                        lastPassedSection = link.href
                    }
                }
            }

            setActiveSection(lastPassedSection)
        }

        window.addEventListener("scroll", handleScrollActive, { passive: true })
        handleScrollActive()

        return () => window.removeEventListener("scroll", handleScrollActive)
    }, [])

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, sectionId: string) => {
        e.preventDefault()
        setIsMenuOpen(false)

        if (href === "#") {
            window.scrollTo({ top: 0, behavior: "smooth" })
        } else {
            const element = document.getElementById(sectionId)
            if (element) {
                element.scrollIntoView({ behavior: "smooth" })
            }
        }
    }

    return (
        <>
            <nav className="fixed md:backdrop-blur-none backdrop-blur-(--blur-thin) md:relative top-0 left-0 w-screen md:w-full md:max-w-6xl px-(--space-6) md:px-(--space-8) py-(--space-2\.5) md:py-(--space-3) flex justify-between border-b border-border/60 md:border-0 items-center z-(--z-overlay) overflow-hidden bg-background/60 md:bg-transparent">

                <Blur className="md:hidden top-0 right-0 w-2/5 h-full translate-y-1/3 translate-x-1/2 bg-brand-500/5" />
                <Blur className="md:hidden top-0 left-0 w-3/5 h-full translate-x-1/3 translate-y-1/3 bg-brand-500/5" />
                <Blur className="md:hidden top-0 left-0 w-2/5 h-full -translate-y-1/3 -translate-x-1/2 bg-brand-500/5" />

                <button onClick={scrollToTop} className="flex items-center gap-(--space-2) cursor-pointer">
                    <img src="/setwise-logo.png" alt="SetWise" className="size-(--space-6) md:size-(--space-8) rounded-sm" />
                    <span className="text-callout md:text-body font-bold text-foreground font-sans">SetWise</span>
                </button>

                <div className="hidden md:flex items-center gap-(--space-2) px-(--space-8) py-(--space-2\.5) rounded-full">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href, link.sectionId)}
                            className={`px-(--space-3) py-(--space-1\.5) duration-(--duration-normal) rounded-full text-footnote font-medium transition-colors ${activeSection === link.href
                                ? "bg-surface-100/90 border border-border/80 text-foreground"
                                : "hover:bg-surface-200/60 text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-(--space-1\.5)">
                    <ThemeToggler />
                    <LanguageSwitcher />
                    <BetaSignupDialog trigger={<ButtonRotatingGradient />} />
                </div>

                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="md:hidden flex flex-col justify-center items-center size-(--space-10) gap-(--space-1)"
                    aria-label="Open menu"
                >
                    <span className="w-(--space-5) h-0.5 bg-surface-500 rounded-full"></span>
                    <span className="w-(--space-5) h-0.5 bg-surface-500 rounded-full"></span>
                    <span className="w-(--space-5) h-0.5 bg-surface-500 rounded-full"></span>
                </button>
            </nav>

            <AnimatePresence>
                {isScrolled && (
                    <motion.nav
                        initial={{ y: -100, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -100, opacity: 0, scale: 0.9 }}
                        transition={{
                            type: "spring",
                            stiffness: 280,
                            damping: 24,
                            mass: 0.9
                        }}
                        className="hidden md:flex fixed top-(--space-4) left-1/2 -translate-x-1/2 z-(--z-overlay) bg-background/85 backdrop-blur-(--blur-thick) border border-border/70 rounded-full px-(--space-2) py-(--space-2) shadow-(--shadow-lg) items-center gap-x-(--space-20)"
                    >
                        <a href="/" onClick={(e) => handleNavClick(e, "/", "hero")} className="flex items-center gap-(--space-2) pl-(--space-2\.5)">
                            <img src="/setwise-logo.png" alt="SetWise" className="size-(--space-6) rounded-sm" />
                            <span className="text-footnote font-bold text-foreground font-sans">SetWise</span>
                        </a>

                        <div className="flex items-center gap-(--space-1)">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href, link.sectionId)}
                                    className="relative px-(--space-3) py-(--space-1\.5) rounded-full text-footnote font-medium transition-colors duration-(--duration-normal)"
                                    style={{ color: activeSection === link.href ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                                >
                                    {activeSection === link.href && (
                                        <motion.div
                                            layoutId="activeNavIndicator"
                                            className="absolute inset-0 bg-surface-100/90 border border-border/80 rounded-full"
                                            transition={{
                                                type: "spring",
                                                stiffness: 380,
                                                damping: 30
                                            }}
                                        />
                                    )}
                                    <span className="relative z-(--z-raised) hover:text-foreground transition-colors duration-(--duration-normal)">{link.label}</span>
                                </a>
                            ))}
                        </div>

                        <div className="flex items-center gap-(--space-1\.5)">
                            <ThemeToggler />
                            <LanguageSwitcher />
                            <BetaSignupDialog trigger={<ButtonRotatingGradient />} />
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-(--blur-thin) z-(--z-modal) md:hidden"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        <motion.div
                            initial={{ y: "100%", opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: "100%", opacity: 0, scale: 0.9 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 22,
                                mass: 0.9
                            }}
                            className="fixed bottom-0 left-0 right-0 z-(--z-toast) md:hidden"
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
                                className="mx-(--space-4) mb-(--space-4) bg-background rounded-3xl shadow-(--shadow-2xl) overflow-hidden"
                            >
                                <div className="flex items-center justify-between px-(--space-6) py-(--space-4)">
                                    <a href="/" onClick={(e) => handleNavClick(e, "/", "hero")} className="flex items-center gap-(--space-2) cursor-pointer">
                                        <img src="/setwise-logo.png" alt="SetWise" className="size-(--space-6) rounded-sm" />
                                        <span className="text-callout font-bold text-foreground">SetWise</span>
                                    </a>
                                    <div className="flex items-center gap-(--space-1)">
                                        <ThemeToggler />
                                        <LanguageSwitcher />
                                        <motion.button
                                            onClick={() => setIsMenuOpen(false)}
                                            className="size-(--space-9) flex items-center justify-center rounded-full hover:bg-surface-100 transition-colors duration-(--duration-normal) text-foreground"
                                            aria-label="Close menu"
                                            whileTap={{ scale: 0.9 }}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <svg
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
                                </div>

                                <div className="px-(--space-4)">
                                    {navLinks.map((link, index) => (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 24,
                                                delay: index * 0.05
                                            }}
                                        >
                                            <a
                                                href={link.href}
                                                onClick={(e) => handleNavClick(e, link.href, link.sectionId)}
                                                className={`block px-(--space-3) py-(--space-4) text-callout font-medium rounded-xl transition-colors ${activeSection === link.href
                                                    ? "text-foreground bg-surface-50"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-surface-50"
                                                    }`}
                                            >
                                                {link.label}
                                            </a>
                                            {index < navLinks.length - 1 && (
                                                <div className="h-px bg-border mx-(--space-3)"></div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.div
                                    className="px-(--space-6) py-(--space-5)"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 24,
                                        delay: 0.2
                                    }}
                                >
                                    <ButtonRotatingGradient
                                        onClick={() => {
                                            setIsMenuOpen(false)
                                            setTimeout(() => setIsBetaDialogOpen(true), 50)
                                        }}
                                        className="w-full h-(--space-12)"
                                    >
                                        {tCommon('buttons.downloadFree')}
                                    </ButtonRotatingGradient>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <BetaSignupDialog
                open={isBetaDialogOpen}
                onOpenChange={setIsBetaDialogOpen}
            />
        </>
    )
}
