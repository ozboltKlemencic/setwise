"use client"

import { useEffect, useRef } from "react"

interface ParticleTextProps {
    text: string
    className?: string
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

export function ParticleText({ text, className }: ParticleTextProps) {
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

        const init = () => {
            const width = container.clientWidth
            const height = container.clientHeight
            const density = 5 // Gap between particles. Smaller = more particles.

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
            // Use a bold sans-serif font
            offCtx.font = "bold 160px system-ui, -apple-system, sans-serif"
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
                    // Bottom (y=height) = most visible, Top (y=0) = least visible
                    const normalizedY = y / height
                    const gradientStats = isActive
                        ? { base: 1.0, target: 0.2 }
                        : {
                            base: 0.4 * normalizedY,
                            target: 0.1 * normalizedY
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

            particles.forEach(p => {
                // Update phase
                p.phase += p.speed

                // Calculate dynamic alpha using sine wave
                // Map sine [-1, 1] to [minAlpha, maxAlpha]
                // Actually, just oscillate between base and target
                const opacityRange = Math.abs(p.baseAlpha - p.targetAlpha)
                const alpha = Math.min(p.baseAlpha, p.targetAlpha) + (Math.sin(p.phase) + 1) / 2 * opacityRange

                ctx.fillStyle = p.isActive
                    ? `rgba(205, 205, 205, ${alpha})` // Lighter grey for text blue je 194, 215, 255
                    : `rgba(200, 200, 200, ${alpha})` // Light grey for background

                // Draw particle (square)
                ctx.fillRect(p.x, p.y, 3, 3)
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
    }, [text])

    return (
        <div ref={containerRef} className={`w-full h-full min-h-[150px] ${className}`}>
            <canvas ref={canvasRef} className="block" />
        </div>
    )
}
