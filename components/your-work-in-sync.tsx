"use client"

import React, { forwardRef, useRef } from "react"
import { cn } from "@/lib/utils"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import StarBorder from "./StarBorder"
import { BorderBeam } from "./ui/border-beam"

interface YourWorkInSyncProps {
  width?: number | string
  height?: number | string
  className?: string
  theme?: "light" | "dark"
}

// Card component with forwarded ref
const Card = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "z-10 flex items-center justify-center bg-white rounded-sm shadow-sm ",
          className
        )}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = "Card"

// Custom "Connect" Icon (Two squares)
const ConnectIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-black">
    <rect x="4" y="4" width="7" height="7" rx="2" />
    <rect x="13" y="13" width="7" height="7" rx="2" />
    <path d="M11 11L13 13" stroke="currentColor" strokeWidth="2" />
  </svg>
)

export default function YourWorkInSync({
  width = "100%",
  height = "100%",
  className = "",
  theme = "light",
}: YourWorkInSyncProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const centerRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#F7F5F3]", className)}
      style={{ width, height }}
    >
      {/* Dotted Background */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)',
          backgroundSize: '12px 12px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
        }}>
      </div>

      {/* Cards Row */}
      <div className="flex items-center justify-center gap-12 sm:gap-16 mb-8">
        {/* Left Card */}
        <Card ref={leftRef} className="w-12 h-12 sm:size-14">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
            <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
            <path d="M3 12h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7-.7.7m0 11.4.7.7m-12.1-.7-.7.7" />
          </svg>
        </Card>


        <Card ref={centerRef} className="size-12 sm:size-20 overflow-hidden p-0 relative ">
          <ConnectIcon />
          <BorderBeam
            duration={3}
            borderWidth={1.5}
            size={50}
            className="from-transparent via-blue-600 to-transparent"
          />
          <BorderBeam
            duration={3}
            delay={1.5}
            size={50}
            borderWidth={1.5}
            className="from-transparent via-blue-600 to-transparent"
          />
        </Card>

        {/* Right Card */}
        <Card ref={rightRef} className="size-12 sm:size-14">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M12 12h.01" />
            <path d="M7 7h.01" />
            <path d="M17 17h.01" />
            <path d="M17 7h.01" />
            <path d="M7 17h.01" />
          </svg>
        </Card>
      </div>

      {/* Connected Badge */}
      <div
        ref={bottomRef}
        className="z-10 bg-white border border-blue-200 text-blue-500 text-xs font-medium px-4 py-1.5 rounded-md shadow-sm"
      >
        Connected
      </div>

      {/* Animated Beams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={leftRef}
        toRef={centerRef}
        curvature={0}
        startYOffset={12}
        endYOffset={12}
        duration={3}
        delay={0}
        gradientStartColor="#3B82F6"
        gradientStopColor="#60A5FA"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={rightRef}
        curvature={0}
        startYOffset={12}
        endYOffset={12}
        startXOffset={10}
        endXOffset={10}
        duration={3}
        delay={0.5}
        gradientStartColor="#3B82F6"
        gradientStopColor="#60A5FA"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={bottomRef}
        curvature={0}
        startYOffset={12}
        endYOffset={12}
        startXOffset={22}
        endXOffset={22}
        duration={5}
        delay={0}
        gradientStartColor="#3B82F6"
        gradientStopColor="#60A5FA"
      />
    </div>
  )
}
