"use client"

import { useEffect, useRef } from "react"

interface ParticleTextProps {
    text: string
    className?: string
    fontSize?: number // Optional manual font size
    fontSizeMobile?: number // Optional manual mobile font size
    reverse?: boolean
}

interface Particle {
    x: number
    y: number
    isActive: boolean
    baseAlpha: number
    targetAlpha: number
    phase: number
    speed: number
}

export function ParticleText({
    text,
    className,
    fontSize: manualFontSize,
    fontSizeMobile: manualFontSizeMobile,
    size: manualParticleSize,
    textBrightness,
    backgroundBrightness,
    reverse = false
}: ParticleTextProps & {
    size?: number
    textBrightness?: { dark: number; light: number }
    backgroundBrightness?: { dark: number; light: number }
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []

        // Detect dark mode (check CSS class set by next-themes)
        const isDarkMode = () => {
            return document.documentElement.classList.contains('dark')
        }

        const init = () => {
            const width = container.clientWidth
            const height = container.clientHeight
            // Responsive density - larger gap on mobile = fewer particles
            const isMobile = width < 768
            const density = isMobile ? 3 : 5 // Gap between particles. Smaller = more particles.

            // Set canvas resolution for high DPI displays
            const dpr = window.devicePixelRatio || 1
            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.scale(dpr, dpr)

            // Create offscreen canvas for text analysis
            const offscreen = document.createElement("canvas")
            offscreen.width = width
            offscreen.height = height
            const offCtx = offscreen.getContext("2d")
            if (!offCtx) return

            offCtx.fillStyle = "black"
            // Use a bold sans-serif font - smaller on mobile
            // Use manual font size if provided, otherwise default responsive sizes
            // If manualFontSizeMobile is provided, use it for mobile. Otherwise fall back to manualFontSize (if provided) or default mobile size
            const fontSize = isMobile
                ? (manualFontSizeMobile || (manualFontSize ? manualFontSize / 2 : 70))
                : (manualFontSize || 160)

            offCtx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`
            offCtx.textAlign = "center"
            offCtx.textBaseline = "bottom"
            // Position text at the bottom with some padding
            offCtx.fillText(text, width / 2, height)

            const imageData = offCtx.getImageData(0, 0, width, height).data

            particles = []
            for (let y = 0; y < height; y += density) {
                for (let x = 0; x < width; x += density) {
                    const index = (y * width + x) * 4
                    const alpha = imageData[index + 3]
                    const isActive = alpha > 128

                    // Gradient for background particles
                    // Default: Bottom (y=height) = more visible, Top (y=0) = less visible
                    // Reverse: Top (y=0) = more visible, Bottom (y=height) = less visible
                    const normalizedY = y / height
                    const yRatio = reverse ? (1 - normalizedY) : normalizedY

                    const gradientStats = isActive
                        ? { base: 1.0, target: 0.2 }
                        : {
                            base: 0.4 * yRatio,
                            target: 0.1 * yRatio
                        }

                    particles.push({
                        x,
                        y,
                        isActive,
                        baseAlpha: gradientStats.base,
                        targetAlpha: gradientStats.target,
                        phase: Math.random() * Math.PI * 2,
                        speed: 0.05 + Math.random() * 0.05 // Much faster animation
                    })
                }
            }
        }

        const animate = () => {
            const width = canvas.width / (window.devicePixelRatio || 1)
            const height = canvas.height / (window.devicePixelRatio || 1)

            ctx.clearRect(0, 0, width, height)

            const dark = isDarkMode()

            // Default values
            const txtBrightDark = textBrightness?.dark ?? 130
            const txtBrightLight = textBrightness?.light ?? 200
            const bgBrightDark = backgroundBrightness?.dark ?? 160
            const bgBrightLight = backgroundBrightness?.light ?? 200

            // Grouping by color to minimize fillStyle calls
            // Using a Map to group by the color value (val) and alpha (rounded for grouping)
            const groups = new Map<string, Particle[]>()

            particles.forEach(p => {
                p.phase += p.speed
                const opacityRange = Math.abs(p.baseAlpha - p.targetAlpha)
                const alpha = Math.min(p.baseAlpha, p.targetAlpha) + (Math.sin(p.phase) + 1) / 2 * opacityRange

                const val = p.isActive
                    ? (dark ? txtBrightDark : txtBrightLight)
                    : (dark ? bgBrightDark : bgBrightLight)

                // Round alpha to 2 decimal places to allow grouping while maintaining quality
                const roundedAlpha = Math.round(alpha * 20) / 20
                const key = `${val},${roundedAlpha}`

                if (!groups.has(key)) groups.set(key, [])
                groups.get(key)!.push(p)
            })

            let particleSize = manualParticleSize
            if (particleSize === undefined) {
                particleSize = canvas.width < 768 * (window.devicePixelRatio || 1) ? 2 : 3
            }

            groups.forEach((groupParticles, key) => {
                const [val, alpha] = key.split(",")
                ctx.fillStyle = `rgba(${val}, ${val}, ${val}, ${alpha})`
                groupParticles.forEach(p => {
                    ctx.fillRect(p.x, p.y, particleSize!, particleSize!)
                })
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        init()
        animate()

        const handleResize = () => {
            init()
        }

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [text, manualFontSize, manualFontSizeMobile, manualParticleSize, textBrightness, backgroundBrightness, reverse])

    return (
        <div ref={containerRef} className={`w-full h-full min-h-[150px] ${className}`}>
            <canvas ref={canvasRef} className="block" />
        </div>
    )
}
