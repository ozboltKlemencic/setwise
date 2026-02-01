"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface SmartSimpleBrilliantProps {
  width?: number | string
  height?: number | string
  className?: string
  theme?: "light" | "dark"
}

// Cubic Bezier helper
function getCubicBezierY(t: number, p0y: number, c0y: number, c1y: number, p1y: number) {
  const oneMinusT = 1 - t
  return (
    Math.pow(oneMinusT, 3) * p0y +
    3 * Math.pow(oneMinusT, 2) * t * c0y +
    3 * oneMinusT * Math.pow(t, 2) * c1y +
    Math.pow(t, 3) * p1y
  )
}

export default function SmartSimpleBrilliant({
  width = "100%",
  height = "100%",
  className = "",
  theme = "light",
}: SmartSimpleBrilliantProps) {
  // --- Graph Configuration ---
  // The Path: M0,200 C80,180 120,190 180,140 S300,160 400,100
  // Segment 1 (x: 0 to 180): P0(0,200), C0(80,180), C1(120,190), P1(180,140)
  // Segment 2 (x: 180 to 400): P0(180,140), C0(240,90)*, C1(300,160), P1(400,100)
  // *Reflected control point: P1 + (P1 - C1_prev) = 180 + (180 - 120) = 240, 140 + (140 - 190) = 90

  // Default "featured" point
  const defaultPoint = { x: 180, y: 140, maxLift: 145, volume: 3833 }
  const [activePoint, setActivePoint] = useState(defaultPoint)

  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    // Map container X to viewBox X (0-400)
    const viewBoxX = (x / rect.width) * 400

    let viewBoxY = 0

    // Calculate Y based on which segment we're in
    if (viewBoxX <= 180) {
      // Segment 1: 0 to 180
      const t = viewBoxX / 180
      viewBoxY = getCubicBezierY(t, 200, 180, 190, 140)
    } else {
      // Segment 2: 180 to 400
      const t = (viewBoxX - 180) / (400 - 180)
      // Note: First control point is reflection of previous C1 relative to P1
      // P1(180,140), Previous C1(120,190) -> Diff(60, -50) -> Reflected(240, 90)
      viewBoxY = getCubicBezierY(t, 140, 90, 160, 100)
    }

    // Map Y to value (arbitrary scale, e.g., lower Y/higher height = higher value)
    const normalizedHeight = (300 - viewBoxY) / 200 // 0 to 1 scale roughly
    const volume = Math.round(1000 + normalizedHeight * 4000)
    const maxLift = Math.round(60 + normalizedHeight * 100)

    setActivePoint({ x: viewBoxX, y: viewBoxY, maxLift, volume })
  }

  const handleMouseLeave = () => {
    setActivePoint(defaultPoint)
  }

  // Point coordinates percentages for CSS positioning
  const pointXPercent = (activePoint.x / 400) * 100
  const pointYPercent = (activePoint.y / 300) * 100

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative w-full h-full flex items-center justify-center overflow-hidden cursor-crosshair", className)}
      style={{ width, height }}
    >
      {/* Background Graph SVG */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
        className="w-full h-full absolute inset-0 pointer-events-none"
      >
        <defs>
          <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path
          d="M0,200 C80,180 120,190 180,140 S300,160 400,100 V300 H0 Z"
          fill="url(#blue-gradient)"
        />

        {/* The Curve Line */}
        <path
          d="M0,200 C80,180 120,190 180,140 S300,160 400,100"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Overlays positioned at the active point */}
      <div
        className="absolute w-full h-full pointer-events-none transition-all duration-75 ease-linear"
        style={{ left: 0, top: 0 }}
      >
        {/* Vertical Line Container */}
        <div
          className="absolute"
          style={{
            left: `${pointXPercent}%`,
            top: `${pointYPercent}%`,
            bottom: 0,
            width: '1px'
          }}
        >
          {/* The vertical dashed line */}
          <div className="w-px h-full border-l-[1.5px] border-blue-500 border-dashed opacity-50"></div>
        </div>

        {/* The Point and Tooltip Container */}
        <div
          className="absolute"
          style={{
            left: `${pointXPercent}%`,
            top: `${pointYPercent}%`,
            transform: 'translate(-50%, -50%)' // Center the dot on the coordinate
          }}
        >
          {/* Main Blue Dot */}
          <div className="relative w-3 h-3 bg-blue-500 rounded-full ring-4 ring-blue-500/20 shadow-sm z-10 flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            {/* Pulsating ring only when at default point */}
            {activePoint.x === 180 && (
              <div className="absolute inset-0 w-full h-full rounded-full border border-blue-500/30 animate-ping opacity-75 sm:scale-150"></div>
            )}
          </div>

          {/* Tooltip */}
          <div
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 whitespace-nowrap z-20"
          >
            <div className="bg-white text-neutral-700 border border-neutral-300/70 text-[10px] font-medium px-3 py-2 rounded-sm shadow-md flex flex-col gap-0.5 min-w-[100px] transition-all duration-75 text-left">
              <div className="text-neutral-800  font-semibold mb-0.5 uppercase tracking-wider text-[9px]">Stats</div>
              <div>Max lift: <span className="font-bold text-neutral-900">{activePoint.maxLift} kg</span></div>
              <div>Volume: <span className="font-bold text-neutral-900">{activePoint.volume.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
