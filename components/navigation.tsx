"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import ButtonRotatingGradient from "./ui/buttons/ButtonRotatingGradient"
import BetaSignupDialog from "./beta-signup-dialog"
import LanguageSwitcher from "./layout/LanguageSwitcher"

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

    // Track active section based on scroll position
    useEffect(() => {
        const handleScrollActive = () => {
            const scrollPosition = window.scrollY + 150 // offset for nav height

            // If at top of page, set to Home
            if (window.scrollY < 100) {
                setActiveSection("#")
                return
            }

            // Find the last section that we've scrolled past
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
        handleScrollActive() // Check initial position

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
            <nav className="fixed md:backdrop-blur-none backdrop-blur-sm md:relative top-0 left-0 w-screen md:w-full md:max-w-6xl px-6 md:px-8 py-2.5 md:py-3 flex justify-between border-b border-neutral-200/60 md:border-0 items-center z-50 overflow-hidden bg-white/60  md:bg-transparent">

                <div className="absolute md:hidden top-0 right-0 w-2/5 translate-y-1/3 translate-x-1/2 h-full bg-blue-500/5 blur-md rounded-full pointer-events-none"></div>
                <div className="absolute md:hidden top-0 left-0 w-3/5  translate-x-1/3 translate-y-1/3    h-full bg-blue-500/5 blur-md rounded-full pointer-events-none"></div>
                <div className="absolute md:hidden top-0 left-0 w-2/5 -translate-y-1/3 -translate-x-1/2 h-full bg-blue-500/5 blur-md rounded-full pointer-events-none"></div>
                {/* Logo - clickable to scroll to top */}
                <button onClick={scrollToTop} className="flex items-center gap-2 cursor-pointer">
                    <img src="/setwise-logo.png" alt="SetWise" className="size-6 md:size-8 rounded-sm " />
                    <span className="md:text-lg text-base font-bold text-[#1A1A1A] font-sans">SetWise</span>
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-2 px-8 py-2.5 rounded-full">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href, link.sectionId)}
                            className={`px-3 py-1.5 duration-200 rounded-full text-sm font-medium transition-colors ${activeSection === link.href
                                ? "bg-neutral-100/90 border border-neutral-200/80 text-[#1A1A1A]"
                                : "hover:bg-neutral-200/60 text-gray-600 hover:text-[#1A1A1A]"
                                }`}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Desktop Button */}
                <div className="hidden md:flex items-center gap-1.5">
                    <LanguageSwitcher />
                    <BetaSignupDialog trigger={<ButtonRotatingGradient />} />
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1"
                    aria-label="Open menu"
                >
                    <span className="w-5 h-0.5 bg-neutral-500 rounded-full"></span>
                    <span className="w-5 h-0.5 bg-neutral-500 rounded-full"></span>
                    <span className="w-5 h-0.5 bg-neutral-500 rounded-full"></span>
                </button>
            </nav>

            {/* Desktop Floating Navigation - appears on scroll */}
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
                        className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/85 backdrop-blur-lg border border-neutral-200/70 rounded-full px-2 py-2 shadow-lg shadow-black/5 items-center gap-x-12"
                    >
                        {/* Logo */}
                        <a href="/" onClick={(e) => handleNavClick(e, "/", "hero")} className="flex items-center gap-2 pl-2.5 ">
                            <img src="/setwise-logo.png" alt="SetWise" className="size-6 rounded-sm" />
                            <span className="text-sm font-bold text-neutral-800 font-sans">SetWise</span>
                        </a>


                        {/* Navigation Links */}
                        <div className="flex items-center gap-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href, link.sectionId)}
                                    className="relative px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 "
                                    style={{ color: activeSection === link.href ? '#1A1A1A' : '#6b7280' }}
                                >
                                    {activeSection === link.href && (
                                        <motion.div
                                            layoutId="activeNavIndicator"
                                            className="absolute inset-0 bg-neutral-100/90 border border-neutral-200/80 rounded-full h"
                                            transition={{
                                                type: "spring",
                                                stiffness: 380,
                                                damping: 30
                                            }}
                                        />
                                    )}
                                    <span className="relative z-10 hover:text-neutral-800 transition-colors duration-200">{link.label}</span>
                                </a>
                            ))}
                        </div>


                        {/* CTA Button */}
                        <div className="flex items-center gap-1.5">
                            <LanguageSwitcher />
                            <BetaSignupDialog trigger={<ButtonRotatingGradient />} />
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Mobile Navigation Overlay - Blurred dark background */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100 md:hidden"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Mobile Navigation Bottom Sheet */}
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
                            className="fixed bottom-0 left-0 right-0 z-101 md:hidden"
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
                                className="mx-4 mb-4 bg-white rounded-3xl shadow-2xl overflow-hidden"
                            >
                                {/* Header with Logo, Language Switcher and Close */}
                                <div className="flex items-center justify-between px-6 py-4">
                                    <a href="/" onClick={(e) => handleNavClick(e, "/", "hero")} className="flex items-center gap-2 cursor-pointer">
                                        <img src="/setwise-logo.png" alt="SetWise" className="size-6 rounded-sm" />
                                        <span className="text-base font-bold text-[#1A1A1A]">SetWise</span>
                                    </a>
                                    <div className="flex items-center gap-2">
                                        <LanguageSwitcher />
                                        <motion.button
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
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

                                {/* Navigation Links with dividers - staggered animation */}
                                <div className="px-4">
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
                                                className={`block px-3 py-4 text-base font-medium rounded-xl transition-colors ${activeSection === link.href
                                                    ? "text-neutral-900 bg-neutral-50"
                                                    : "text-gray-700 hover:text-[#1A1A1A] hover:bg-neutral-50"
                                                    }`}
                                            >
                                                {link.label}
                                            </a>
                                            {index < navLinks.length - 1 && (
                                                <div className="h-px bg-neutral-200 mx-3"></div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Bottom CTA Button */}
                                <motion.div
                                    className="px-6 py-5"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 24,
                                        delay: 0.2
                                    }}
                                >
                                    <motion.button
                                        onClick={() => {
                                            setIsMenuOpen(false)
                                            setTimeout(() => setIsBetaDialogOpen(true), 50)
                                        }}
                                        className="w-full relative inline-flex h-12 overflow-hidden rounded-full p-[2px]"
                                        whileTap={{ scale: 0.98 }}
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ccdbfc_0%,#155dfc_60%,#ccdbfc_100%)]" />
                                        <span className="relative inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-blue-600 px-8 py-1 text-base font-semibold text-white backdrop-blur-3xl">
                                            {tCommon('buttons.downloadFree')}
                                        </span>
                                        <div className="absolute top-0 left-0 w-2/5 translate-y-1/3 -translate-x-1/2 h-full bg-white/20 blur-md rounded-full"></div>
                                        <div className="absolute top-0 right-0 w-2/5 -translate-y-1/3 translate-x-1/2 h-full bg-white/15 blur-md rounded-full"></div>
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Mobile Beta Dialog - outside AnimatePresence to prevent unmounting issues */}
            <BetaSignupDialog
                open={isBetaDialogOpen}
                onOpenChange={setIsBetaDialogOpen}
            />
        </>
    )
}

