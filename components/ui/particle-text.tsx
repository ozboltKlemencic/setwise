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
        let isDestroyed = false
        let isVisible = false

        const isDarkMode = () => {
            return document.documentElement.classList.contains('dark')
        }

        const init = () => {
            if (isDestroyed) return
            const width = container.clientWidth
            const height = container.clientHeight
            if (width === 0 || height === 0) return

            const isMobile = width < 768
            const density = isMobile ? 4 : 5

            // Cap DPR to 2 — iPhone 3x Retina creates canvases that exceed
            // iOS Safari's ~16 MP canvas memory limit and crash the page
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.scale(dpr, dpr)

            const offscreen = document.createElement("canvas")
            offscreen.width = width
            offscreen.height = height
            const offCtx = offscreen.getContext("2d")
            if (!offCtx) return

            offCtx.fillStyle = "black"
            const fontSize = isMobile
                ? (manualFontSizeMobile || (manualFontSize ? manualFontSize / 2 : 70))
                : (manualFontSize || 160)

            offCtx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`
            offCtx.textAlign = "center"
            offCtx.textBaseline = "bottom"
            offCtx.fillText(text, width / 2, height)

            let imageData: Uint8ClampedArray
            try {
                imageData = offCtx.getImageData(0, 0, width, height).data
            } catch {
                // iOS Safari can throw if canvas exceeds memory limits
                return
            }
            // Release offscreen canvas memory immediately
            offscreen.width = 0
            offscreen.height = 0

            particles = []
            for (let y = 0; y < height; y += density) {
                for (let x = 0; x < width; x += density) {
                    const index = (y * width + x) * 4
                    const alpha = imageData[index + 3]
                    const isActive = alpha > 128

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
                        speed: 0.05 + Math.random() * 0.05
                    })
                }
            }
        }

        const animate = () => {
            if (isDestroyed || !isVisible) return

            const width = canvas.width / (window.devicePixelRatio || 1)
            const height = canvas.height / (window.devicePixelRatio || 1)
            if (width === 0 || height === 0 || particles.length === 0) return

            ctx.clearRect(0, 0, width, height)

            const dark = isDarkMode()

            const txtBrightDark = textBrightness?.dark ?? 130
            const txtBrightLight = textBrightness?.light ?? 200
            const bgBrightDark = backgroundBrightness?.dark ?? 160
            const bgBrightLight = backgroundBrightness?.light ?? 200

            const groups = new Map<string, Particle[]>()

            particles.forEach(p => {
                p.phase += p.speed
                const opacityRange = Math.abs(p.baseAlpha - p.targetAlpha)
                const alpha = Math.min(p.baseAlpha, p.targetAlpha) + (Math.sin(p.phase) + 1) / 2 * opacityRange

                const val = p.isActive
                    ? (dark ? txtBrightDark : txtBrightLight)
                    : (dark ? bgBrightDark : bgBrightLight)

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

        const startAnimation = () => {
            if (!isDestroyed && isVisible && particles.length > 0) {
                cancelAnimationFrame(animationFrameId)
                animate()
            }
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting
                if (isVisible) {
                    startAnimation()
                }
            },
            { threshold: 0 }
        )
        observer.observe(container)

        init()
        if (isVisible && particles.length > 0) {
            animate()
        }

        const handleResize = () => {
            init()
            startAnimation()
        }

        window.addEventListener("resize", handleResize)

        return () => {
            isDestroyed = true
            observer.disconnect()
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
