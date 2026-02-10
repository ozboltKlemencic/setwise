"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function HashScrollHandler() {
    const pathname = usePathname()

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash
            if (hash) {
                const element = document.querySelector(hash)
                const container = document.getElementById("features-content")
                if (element && container) {
                    // Smooth scroll the container to the element
                    // The scroll-margin-top (scroll-mt) on the element handles the offset
                    element.scrollIntoView({ behavior: "smooth" })
                }
            }
        }

        // Initial check on mount
        handleHashChange()

        // Listen for hash changes
        window.addEventListener("hashchange", handleHashChange)

        // Also listen for pathname changes to re-trigger if navigating to a page with a hash
        return () => window.removeEventListener("hashchange", handleHashChange)
    }, [pathname])

    return null
}
