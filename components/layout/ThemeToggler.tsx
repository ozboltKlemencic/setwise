'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggler() {
    const [isDark, setIsDark] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setIsDark(true)
            document.documentElement.classList.add('dark')
        }
    }, [])

    const toggleTheme = () => {
        const newIsDark = !isDark
        setIsDark(newIsDark)

        if (newIsDark) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }

    // Don't render until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <button
                className="py-2 px-2.5 duration-200 rounded-full text-[10px] md:text-xs font-medium transition-all hover:to-neutral-100 hover:from-neutral-200/80 text-gray-600 hover:text-neutral-800 border hover:border-neutral-300 border-neutral-200/60 shadow-xs backdrop-blur-md bg-linear-to-tr from-neutral-100 to-neutral-200/80 hover:ring-2 hover:ring-offset-1 hover:ring-neutral-200/80 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-neutral-200/80 focus:scale-95 transform-gpu will-change-transform"
                aria-label="Toggle theme"
            >
                <Sun className="size-3.5 md:size-4" />
            </button>
        )
    }

    return (
        <button
            onClick={toggleTheme}
            className="py-2 px-2.5 duration-200 rounded-full text-[10px] md:text-xs font-medium transition-all hover:to-neutral-100 hover:from-neutral-200/80 text-gray-600 hover:text-neutral-800 border hover:border-neutral-300 border-neutral-200/60 shadow-xs backdrop-blur-md bg-linear-to-tr from-neutral-100 to-neutral-200/80 hover:ring-2 hover:ring-offset-1 hover:ring-neutral-200/80 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-neutral-200/80 focus:scale-95 transform-gpu will-change-transform"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <Moon className="size-3.5 md:size-3.5" />
            ) : (
                <Sun className="size-3.5 md:size-3.5" />
            )}
        </button>
    )
}
