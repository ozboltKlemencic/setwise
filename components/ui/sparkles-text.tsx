"use client"

import { CSSProperties, ReactElement, useEffect, useState } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

interface Sparkle {
  id: string
  x: string
  y: string
  color: string
  delay: number
  scale: number
  lifespan: number
  shape: "star" | "dumbbell" | "heart"
}

const Sparkle: React.FC<Sparkle> = ({ id, x, y, color, delay, scale, shape }) => {
  const getPath = () => {
    switch (shape) {
      case "dumbbell":
        return "M2 9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9zm16 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V9zM7 11h10v2H7v-2z"
      case "heart":
        return "M10.5 18.35L9.23 17.2C4.7 13.1 1.7 10.4 1.7 7.1C1.7 4.4 3.8 2.3 6.5 2.3C8.03 2.3 9.5 3 10.5 4.15C11.5 3 12.97 2.3 14.5 2.3C17.2 2.3 19.3 4.4 19.3 7.1C19.3 10.4 16.3 13.1 11.76 17.2L10.5 18.35Z"
      default: // star
        return "M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
    }
  }

  // Adjust viewBox for different shapes if needed, but 0 0 21 21 works for centered similar sized icons. 
  // Heart uses 0 0 24 24 usually, resizing path or viewbox. Dumbbell too.
  // Standardizing path to fit ~21x21 box is best, or changing viewbox.
  // Let's use standard paths and scale them or use appropriate viewbox per shape? 
  // For simplicity, let's assume paths are roughly compatible or I'll provide compatible paths.

  // Dumbbell path (simplified relative to 24x24):
  const dumbbellPath = "M6 6h12v12H6z" // placeholder if I can't find complex one quick. 
  // Better Dumbbell (Lucide style adapted): 
  // M 6.5 4 ... is messy. 
  // Let's use Lucide icons as SVGs directly? No, I need single path for simple color fill.
  // Actually, Lucide icons are strokes usually. User probably wants filled shapes for "sparkles".
  // I will use these specific paths:

  let d = ""
  let viewBox = "0 0 21 21"

  if (shape === "dumbbell") {
    // Simple dumbbell shape filled
    d = "M2 9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9zm16 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V9zM7 11h10v2H7v-2z"
    viewBox = "0 0 24 24"
  } else if (shape === "heart") {
    d = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
    viewBox = "0 0 24 24"
  } else {
    d = "M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
    viewBox = "0 0 21 21"
  }

  return (
    <motion.svg
      key={id}
      className="pointer-events-none absolute z-20"
      initial={{ opacity: 0, left: x, top: y }}
      animate={{
        opacity: [0, 0.86, 0],
        scale: [0, scale, 0],
        rotate: [75, 120, 150],
      }}
      transition={{ duration: 3, repeat: Infinity, delay }}
      width="16"
      height="16"
      viewBox={viewBox}
    >
      <path d={d} fill={color} />
    </motion.svg>
  )
}

interface SparklesTextProps {
  /**
   * @default <div />
   * @type ReactElement
   * @description
   * The component to be rendered as the text
   * */
  as?: ReactElement

  /**
   * @default ""
   * @type string
   * @description
   * The className of the text
   */
  className?: string

  /**
   * @required
   * @type ReactNode
   * @description
   * The content to be displayed
   * */
  children: React.ReactNode

  /**
   * @default 10
   * @type number
   * @description
   * The count of sparkles
   * */
  sparklesCount?: number

  /**
   * @default "{first: '#9E7AFF', second: '#FE8BBB'}"
   * @type string
   * @description
   * The colors of the sparkles
   * */
  colors?: {
    first: string
    second: string
  }
  shapes?: Array<"star" | "dumbbell" | "heart">
}

export const SparklesText: React.FC<SparklesTextProps> = ({
  children,
  colors = { first: "#3864f5", second: "#2b7cff" },
  className,
  sparklesCount = 7,
  shapes: propShapes,
  ...props
}) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    const generateStar = (): Sparkle => {
      const starX = `${Math.random() * 100}%`
      const starY = `${Math.random() * 100}%`

      const shapes: Array<"star" | "dumbbell" | "heart"> = propShapes || ["star", "dumbbell", "heart"]
      const shape = shapes[Math.floor(Math.random() * shapes.length)]

      let color = Math.random() > 0.5 ? colors.first : colors.second
      if (shape === "heart") {
        color = "#EF4444"
      }

      const delay = Math.random() * 2
      const scale = Math.random() * 1 + 0.3
      const lifespan = Math.random() * 40 + 5
      const id = `${starX}-${starY}-${Date.now()}`

      return { id, x: starX, y: starY, color, delay, scale, lifespan, shape }
    }

    const initializeStars = () => {
      const newSparkles = Array.from({ length: sparklesCount }, generateStar)
      setSparkles(newSparkles)
    }

    const updateStars = () => {
      setSparkles((currentSparkles) =>
        currentSparkles.map((star) => {
          if (star.lifespan <= 0) {
            return generateStar()
          } else {
            return { ...star, lifespan: star.lifespan - 0.1 }
          }
        })
      )
    }

    initializeStars()
    const interval = setInterval(updateStars, 100)

    return () => clearInterval(interval)
  }, [colors.first, colors.second, sparklesCount])

  return (
    <div
      className={cn("text-3xl  md:text-5xl  ", className)}
      {...props}
      style={
        {
          "--sparkles-first-color": `${colors.first}`,
          "--sparkles-second-color": `${colors.second}`,
        } as CSSProperties
      }
    >
      <span className="relative inline-block">
        {sparkles.map((sparkle) => (
          <Sparkle key={sparkle.id} {...sparkle} />
        ))}
        {children}
      </span>
    </div>
  )
}
