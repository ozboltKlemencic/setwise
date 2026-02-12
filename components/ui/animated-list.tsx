"use client"

import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useMemo,
  useState,
} from "react"
import { AnimatePresence, motion, MotionProps } from "motion/react"

import { cn } from "@/lib/utils"
import { ChevronRight, CalendarDays, TrendingUp } from "lucide-react"
import DialogStickyFooterDemo from "@/components/dialog"


export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const animations: MotionProps = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  }

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  )
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode
  delay?: number
  start?: boolean
  initialItemCount?: number
}

export const AnimatedList = React.memo(
  ({ children, className, delay = 1000, start = true, initialItemCount = 1, ...props }: AnimatedListProps) => {
    const [index, setIndex] = useState(initialItemCount - 1)
    const childrenArray = useMemo(
      () => React.Children.toArray(children),
      [children]
    )

    useEffect(() => {
      if (start && index < childrenArray.length - 1) {
        const timeout = setTimeout(() => {
          setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length)
        }, delay)

        return () => clearTimeout(timeout)
      }
    }, [index, delay, childrenArray.length, start])

    const itemsToShow = useMemo(() => {
      const result = childrenArray.slice(0, index + 1).reverse()
      return result
    }, [index, childrenArray])

    return (
      <div
        className={cn(`flex flex-col items-center gap-4 `, className)}
        {...props}
      >
        <AnimatePresence initial={false}>
          {itemsToShow.map((item) => (
            <AnimatedListItem key={(item as React.ReactElement).key}>
              {item}
            </AnimatedListItem>
          ))}

        </AnimatePresence>
      </div>
    )
  }
)

AnimatedList.displayName = "AnimatedList"

export interface WorkoutItem {
  name: string
  date: string
  duration: string
  volume: string
  status: string
  highlight?: boolean
  isTrending?: boolean
}

export const WorkoutNotification = ({ name, date, duration, volume, status, highlight, isTrending }: WorkoutItem) => {
  const Content = (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full md:max-w-[360px]  lg:max-w-[400px] cursor-pointer rounded-xl lg:rounded-2xl p-(--space-3)  lg:p-(--space-4)",
        "transition-all duration-(--duration-fast) ease-(--ease-apple)",
        "bg-card border border-surface-200 shadow-(--shadow-sm)",
        highlight && "bg-linear-to-b from-brand-500/10  to-card border-brand-500"
      )}
    >
      {highlight && (
        <div className="absolute -top-2.5 right-(--space-8) lg:right-(--space-10) border border-brand-500 bg-card text-surface-800 text-[8px] font-bold px-(--space-2) py-0.5 z-(--z-raised) tracking-wider rounded-full shadow-(--shadow-xs) antialiased">
          Click
        </div>
      )}
      <div className="flex flex-col gap-(--space-2) lg:gap-(--space-3)">
        {/* Header */}
        <div className="flex flex-row items-center justify-between">
          <span className="text-footnote md:text-footnote lg:text-subheadline font-semibold text-surface-900">{name}</span>
          <ChevronRight className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-surface-400" />
        </div>

        {/* Date */}
        <div className="flex flex-row items-center gap-1.5 text-caption-2 lg:text-caption-1 text-surface-500">
          <CalendarDays className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
          <span>{date}</span>
        </div>

        {/* Stats & Status */}
        <div className="flex flex-row items-end justify-between mt-(--space-1)">
          <div className="flex flex-row">
            <div className="flex flex-col gap-0.5">
              <span className="text-caption-2 font-bold text-surface-500 tracking-wider uppercase">DURATION</span>
              <span className="text-caption-1 lg:text-subheadline font-medium text-surface-900">{duration}</span>
            </div>
            <div className="h-auto w-px bg-surface-300/60 mx-(--space-2) lg:mx-(--space-4)"></div>
            <div className="flex flex-col gap-0.5">
              <span className="text-caption-2 font-bold text-surface-500 tracking-wider uppercase">VOLUME</span>
              <span className="text-caption-1 lg:text-subheadline font-medium text-surface-900">{volume}</span>
            </div>
          </div>

          {isTrending ? (
            <div className="px-(--space-2) lg:px-2.5 py-0.5 lg:py-(--space-1) rounded-sm bg-success-light border border-success/20 text-success-dark flex items-center gap-(--space-1)">
              <TrendingUp className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
              <span className="text-caption-2 font-bold">{status}</span>
            </div>
          ) : (
            <div className="px-(--space-2) lg:px-2.5 py-0.5 lg:py-(--space-1) rounded-sm bg-surface-100 dark:bg-surface-300 border border-surface-200 dark:border-surface-400 text-caption-2 font-bold text-surface-600 tracking-wider uppercase">
              {status}
            </div>
          )}
        </div>
      </div>
    </figure>
  )

  if (highlight) {
    return <DialogStickyFooterDemo trigger={Content} />
  }

  return Content
}
