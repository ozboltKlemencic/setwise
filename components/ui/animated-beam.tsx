"use client"

import { RefObject, useEffect, useId, useState } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export interface AnimatedBeamProps {
  className?: string
  containerRef: RefObject<HTMLElement | null> // Container ref
  fromRef: RefObject<HTMLElement | null>
  toRef: RefObject<HTMLElement | null>
  curvature?: number
  reverse?: boolean
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
  delay?: number
  duration?: number
  startXOffset?: number
  startYOffset?: number
  endXOffset?: number
  endYOffset?: number
  gradientLength?: number
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false, // Include the reverse prop
  duration = Math.random() * 3 + 4,
  delay = 0,
  pathColor = "gray",
  pathWidth = 1,
  pathOpacity = 0.3,
  gradientStartColor = "#9c40ff",
  gradientStopColor = "#9c40ff",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
  gradientLength = 10,
}) => {
  const id = useId()
  const [pathD, setPathD] = useState("")
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 })

  // Manually calculate start/end points using logic similar to updatePath
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const rectA = fromRef.current.getBoundingClientRect()
        const rectB = toRef.current.getBoundingClientRect()

        const svgWidth = containerRect.width
        const svgHeight = containerRect.height
        setSvgDimensions({ width: svgWidth, height: svgHeight })

        const startX =
          rectA.left - containerRect.left + rectA.width / 2 + startXOffset
        const startY =
          rectA.top - containerRect.top + rectA.height / 2 + startYOffset
        const endX =
          rectB.left - containerRect.left + rectB.width / 2 + endXOffset
        const endY =
          rectB.top - containerRect.top + rectB.height / 2 + endYOffset

        const controlY = startY - curvature
        const d = curvature === 0
          ? `M ${startX},${startY} L ${endX},${endY}`
          : `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`
        setPathD(d)
        setStartPoint({ x: startX, y: startY })
        setEndPoint({ x: endX, y: endY })
      }
    }

    // Initialize ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      updatePath()
    })

    // Observe the container element
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    // Call the updatePath initially to set the initial path
    updatePath()

    // Clean up the observer on component unmount
    return () => {
      resizeObserver.disconnect()
    }
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ])

  // Calculate Gradient Keyframes
  // Assume curvature=0 for gradient calculation (linear)
  const dx = endPoint.x - startPoint.x
  const dy = endPoint.y - startPoint.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx)

  // Gradient length vector components
  // To keep it simple, we animate the gradient line from start to end.
  // We want the gradient to be `gradientLength` long.
  // The 'visual' beam is defined by the stops (here 0 -> 100% of the linearGradient usage).
  // But wait, <linearGradient> coordinates are x1,y1,x2,y2. 
  // If we set x1,y1 to the 'tail' and x2,y2 to the 'head' of the beam:
  // The effective beam logic needs properly spaced stops or moving coordinates.
  // 
  // Let's effectively move a segment of length `gradientLength` along the path.
  // Segment Vector: (cos(angle)*len, sin(angle)*len)
  const gradientLenX = Math.cos(angle) * gradientLength
  const gradientLenY = Math.sin(angle) * gradientLength

  // We animate the "Tail" of the gradient.
  // Tail start: StartPoint - SegmentVector (so it's just entering) - wait, user wants repeated flow?
  // Usually these beams fade in/out. 
  // Let's emulate the previous logic's visual window but with fixed pixels.
  // Previous logic: gradient covered the whole path, and stops animated.
  // New logic: Gradient coordinates (x1, y1) -> (x2, y2) define the beam ITSELF.
  // So the gradient box IS the beam. Stops are fixed (e.g. 0% transp, 50% color, 100% transp).

  const initialX = reverse ? endPoint.x + gradientLenX : startPoint.x - gradientLenX
  const initialY = reverse ? endPoint.y + gradientLenY : startPoint.y - gradientLenY
  const finalX = reverse ? startPoint.x : endPoint.x
  const finalY = reverse ? startPoint.y : endPoint.y

  // Actually, to fully clear the path:
  // Start: Head at StartPoint. Tail at StartPoint - Len.
  // End: Tail at EndPoint. Head at EndPoint + Len.
  // So animated coordinate "tail" travels from (Start - Len) to (End).

  // Correction for precise "flow": 
  // If reverse: Start at End, go to Start.
  // tailStart = EndPoint
  // tailEnd = StartPoint - GradientVector

  // Let's refine for "reverse" logic simplified: just swap start/end logic conceptually.
  const startX = reverse ? endPoint.x : startPoint.x
  const startY = reverse ? endPoint.y : startPoint.y
  const endX = reverse ? startPoint.x : endPoint.x
  const endY = reverse ? startPoint.y : endPoint.y

  // Recalculate diffs for direction
  const dX = endX - startX
  const dY = endY - startY
  // magnitude of direction
  const mag = Math.sqrt(dX * dX + dY * dY)
  // unit vector
  const uX = mag ? dX / mag : 0
  const uY = mag ? dY / mag : 0

  // Determine start/end states for the animation
  const startKeyFrame = {
    x1: startX - uX * gradientLength,
    y1: startY - uY * gradientLength,
    x2: startX,
    y2: startY,
  }

  const endKeyFrame = {
    x1: endX,
    y1: endY,
    x2: endX + uX * gradientLength,
    y2: endY + uY * gradientLength,
  }

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "pointer-events-none absolute top-0 left-0 transform-gpu stroke-2",
        className
      )}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
    >
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      <path
        d={pathD}
        strokeWidth={pathWidth}
        stroke={`url(#${id})`}
        strokeOpacity="1"
        strokeLinecap="round"
      />
      <defs>
        <motion.linearGradient
          className="transform-gpu"
          id={id}
          gradientUnits={"userSpaceOnUse"}
          initial={{
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
          }}
          animate={{
            x1: [startKeyFrame.x1, endKeyFrame.x1],
            y1: [startKeyFrame.y1, endKeyFrame.y1],
            x2: [startKeyFrame.x2, endKeyFrame.x2],
            y2: [startKeyFrame.y2, endKeyFrame.y2],
          }}
          transition={{
            delay,
            duration,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 0,
          }}
        >
          <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0"></stop>
          <stop offset="50%" stopColor={gradientStartColor} stopOpacity="1"></stop>
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0"></stop>
        </motion.linearGradient>
      </defs>
    </svg>
  )
}
