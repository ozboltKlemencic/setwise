"use client"

import React, { forwardRef, useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion, useInView } from "framer-motion"
import { AnimatedBeam } from "@/components/ui/animated-beam"
import StarBorder from "./StarBorder"

import { Database, Smartphone, WifiOff } from "lucide-react"
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
const MotionCard = motion(Card)


export default function YourWorkInSync({
  width = "100%",
  height = "100%",
  className = "",
  theme = "light",
}: YourWorkInSyncProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.2 })
  const leftRef = useRef<HTMLDivElement>(null)
  const centerRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Detect mobile screen
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const gradientLength = isMobile ? 8 : 16
  const XOffset = isMobile ? 24 : 32


  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#F7F5F3]", className)}
      style={{ width, height }}
    >
      {/* Dotted Background */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#e1e3e6 1px, transparent 1px)',
          backgroundSize: '10px 10px',
          maskImage: 'radial-gradient(circle at center, black 25%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 25%, transparent 70%)'
        }}>
      </div>

      {/* Cards Row */}
      <div className="flex items-center justify-center gap-12 sm:gap-20 mb-10">
        {/* Left Card */}
        <MotionCard
          ref={leftRef}
          className="size-12 sm:size-16 text-neutral-500/70 opacity-60  border border-neutral-300"
          initial={{ opacity: 0.6, scale: 0.8 }}
          animate={{ scale: isInView ? 1 : 0.9 }}
          transition={{ duration: 0.5, delay: 0, ease: "easeOut" }}
        >
          <WifiOff className="size-4 sm:size-6" />
        </MotionCard>


        <MotionCard
          ref={centerRef}
          className="size-16 sm:size-24 bg-linear-to-tr from-blue-500/10 via-blue-100/5 to-blue-500/10 text-neutral-400 overflow-hidden p-0 relative "
          initial={{ opacity: 1, scale: 0.8 }}
          animate={{ scale: isInView ? 1 : 0.9 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <Smartphone className="size-8 sm:size-10" />
          <BorderBeam
            duration={2}
            borderWidth={1}
            size={50}
            className="from-blue-500/10  via-blue-500 to-blue-500/10 md:from-blue-500/60 md:via-blue-500 md:to-blue-500/60"
          />
          <BorderBeam
            duration={2}
            delay={1}
            size={50}
            borderWidth={1}
            className="from-blue-500/10  via-blue-500 to-blue-500/10 md:from-blue-500/60 md:via-blue-500 md:to-blue-500/60"
          />
        </MotionCard>

        {/* Right Card */}
        <MotionCard
          ref={rightRef}
          className="size-12 sm:size-16 text-neutral-500/70 opacity-60  border border-neutral-300 "
          initial={{ scale: 0.8 }}
          animate={{ scale: isInView ? 1 : 0.9 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        >
          <Database className="size-4 sm:size-6" />
        </MotionCard>
      </div>

      {/* Connected Badge */}
      <motion.div
        ref={bottomRef}
        className="z-10 bg-white border opacity-60 border-emerald-200/70 text-neutral-600/80  text-xs font-medium px-4 py-1.5 rounded-md flex items-center justify-center shadow-md"
        initial={{ scale: 0.8 }}
        animate={{ scale: isInView ? 1 : 0.9 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        Works Offline
      </motion.div>

      {/* Animated Beams */}
      {/* leva do sreda */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={leftRef}
        toRef={centerRef}
        curvature={0}
        startYOffset={0}
        endYOffset={0}
        startXOffset={XOffset}
        endXOffset={XOffset}
        duration={2}
        delay={0}
        gradientStartColor="#828282"
        gradientStopColor="#828282"
        gradientLength={gradientLength}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={leftRef}
        toRef={centerRef}
        curvature={0}
        startYOffset={0}
        endYOffset={0}
        startXOffset={XOffset}
        endXOffset={XOffset}
        duration={2}
        delay={1}
        gradientStartColor="#828282"
        gradientStopColor="#828282"
        gradientLength={gradientLength}
      />

      {/* sredo do desno */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={rightRef}
        toRef={centerRef}
        curvature={0}
        startYOffset={0}
        endYOffset={0}
        startXOffset={-XOffset}
        endXOffset={-XOffset}
        duration={2}
        delay={0}
        gradientStartColor="#828282"
        gradientStopColor="#828282"
        gradientLength={gradientLength}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={rightRef}
        toRef={centerRef}
        curvature={0}
        startYOffset={0}
        endYOffset={0}
        startXOffset={-XOffset}
        endXOffset={-XOffset}
        duration={2}
        delay={1}
        gradientStartColor="#828282"
        gradientStopColor="#828282"
        gradientLength={gradientLength}
      />

      {/*  spondji beam */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={bottomRef}
        toRef={centerRef}
        curvature={0}
        startYOffset={-16}
        endYOffset={-16}
        startXOffset={0}
        endXOffset={0}
        duration={2}
        delay={0}
        gradientStartColor="#828282"
        gradientStopColor="#828282"
        gradientLength={gradientLength}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={bottomRef}
        toRef={centerRef}
        curvature={0}
        startYOffset={-16}
        endYOffset={-16}
        startXOffset={0}
        endXOffset={0}
        duration={2}
        delay={1}
        gradientStartColor="#828282"
        gradientStopColor="#828282"
        gradientLength={gradientLength}
      />
    </div >
  )
}
