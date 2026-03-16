"use client"

import { useState } from "react"
import {
  IconActivity,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconDots,
  IconLayoutGrid,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ViewMode = "week" | "month"

type WorkoutEvent = {
  id: string
  date: string
  title: string
  exercises: number
  completed?: boolean
}

const weekdayLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const

const todayDate = new Date(2026, 0, 6)
const initialSelectedDate = new Date(2026, 0, 13)

const workoutEvents: WorkoutEvent[] = [
  {
    id: "2026-01-13-chest-shoulder",
    date: "2026-01-13",
    title: "Chest & Shoulder",
    exercises: 6,
    completed: true,
  },
  {
    id: "2026-01-14-back",
    date: "2026-01-14",
    title: "Back",
    exercises: 9,
  },
  {
    id: "2026-01-15-arms",
    date: "2026-01-15",
    title: "Arms",
    exercises: 6,
  },
  {
    id: "2026-01-16-legs",
    date: "2026-01-16",
    title: "Legs",
    exercises: 11,
  },
  {
    id: "2026-01-16-arms",
    date: "2026-01-16",
    title: "Arms",
    exercises: 6,
  },
  {
    id: "2026-01-17-legs",
    date: "2026-01-17",
    title: "Legs",
    exercises: 11,
  },
  {
    id: "2026-01-18-chest-shoulder",
    date: "2026-01-18",
    title: "Chest & Shoulder",
    exercises: 6,
  },
  {
    id: "2026-01-19-back",
    date: "2026-01-19",
    title: "Back",
    exercises: 9,
  },
  {
    id: "2026-01-20-arms",
    date: "2026-01-20",
    title: "Arms",
    exercises: 6,
  },
  {
    id: "2026-01-21-legs",
    date: "2026-01-21",
    title: "Legs",
    exercises: 11,
  },
  {
    id: "2026-01-23-chest-shoulder",
    date: "2026-01-23",
    title: "Chest & Shoulder",
    exercises: 6,
  },
  {
    id: "2026-01-24-back",
    date: "2026-01-24",
    title: "Back",
    exercises: 9,
  },
  {
    id: "2026-01-25-arms",
    date: "2026-01-25",
    title: "Arms",
    exercises: 6,
  },
]

function addDays(date: Date, amount: number) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + amount)
  return nextDate
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function startOfWeek(date: Date) {
  const day = date.getDay()
  const offset = day === 0 ? -6 : 1 - day
  return addDays(date, offset)
}

function endOfWeek(date: Date) {
  return addDays(startOfWeek(date), 6)
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function isSameDay(left: Date, right: Date) {
  return toDateKey(left) === toDateKey(right)
}

function buildMonthDates(date: Date) {
  const monthStart = startOfMonth(date)
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const dates: Date[] = []
  for (
    let cursor = calendarStart;
    toDateKey(cursor) <= toDateKey(calendarEnd);
    cursor = addDays(cursor, 1)
  ) {
    dates.push(cursor)
  }

  return dates
}

function buildWeekDates(date: Date) {
  const weekStart = startOfWeek(date)
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit",
  }).format(date)
}

function getEventsForDate(date: Date) {
  const dateKey = toDateKey(date)
  return workoutEvents.filter((event) => event.date === dateKey)
}

export function WorkoutCalendar() {
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate)
  const [visibleMonth, setVisibleMonth] = useState(
    startOfMonth(initialSelectedDate)
  )

  const visibleDates =
    viewMode === "month" ? buildMonthDates(visibleMonth) : buildWeekDates(selectedDate)

  function handlePrevious() {
    if (viewMode === "month") {
      setVisibleMonth((currentMonth) => addMonths(currentMonth, -1))
      return
    }

    setSelectedDate((currentDate) => {
      const nextDate = addDays(currentDate, -7)
      setVisibleMonth(startOfMonth(nextDate))
      return nextDate
    })
  }

  function handleNext() {
    if (viewMode === "month") {
      setVisibleMonth((currentMonth) => addMonths(currentMonth, 1))
      return
    }

    setSelectedDate((currentDate) => {
      const nextDate = addDays(currentDate, 7)
      setVisibleMonth(startOfMonth(nextDate))
      return nextDate
    })
  }

  function handleToday() {
    setSelectedDate(todayDate)
    setVisibleMonth(startOfMonth(todayDate))
    setViewMode("month")
  }

  return (
    <div className="overflow-hidden border-b border-neutral-200 bg-neutral-50">
      <div className="flex flex-col gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-50"
            onClick={handleToday}
          >
            Today
          </Button>

          <div className="inline-flex items-center rounded-md border border-neutral-200 bg-neutral-50 shadow-xs">
            <Button
              variant="ghost"
              size="icon-xs"
              className="size-8 rounded-none text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
              onClick={handlePrevious}
            >
              <IconChevronLeft className="size-4" />
            </Button>

            <div className="flex items-center gap-2 border-x border-neutral-200 px-3 text-sm font-medium text-neutral-900">
              <span>{formatMonthLabel(visibleMonth)}</span>
              <IconLayoutGrid className="size-4 text-neutral-400" />
            </div>

            <Button
              variant="ghost"
              size="icon-xs"
              className="size-8 rounded-none text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
              onClick={handleNext}
            >
              <IconChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="inline-flex h-8 shrink-0 flex-nowrap items-stretch rounded-md border border-neutral-200 bg-white p-0">
          {(["week", "month"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={cn(
                "inline-flex h-full min-w-12 items-center justify-center whitespace-nowrap rounded-none border border-transparent px-3 text-xs font-medium capitalize transition-colors first:rounded-l-[5px] last:rounded-r-[5px]",
                viewMode === mode
                  ? "border-brand-500 bg-brand-500/10 text-brand-600"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[960px]">
          <div className="grid grid-cols-7 border-b border-neutral-200 bg-neutral-50">
            {weekdayLabels.map((label, index) => (
              <div
                key={label}
                className={cn(
                  "px-3 py-2 text-center text-xs font-medium text-neutral-500",
                  index !== weekdayLabels.length - 1 && "border-r border-neutral-200"
                )}
              >
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 bg-neutral-50">
            {visibleDates.map((date, index) => {
              const outsideCurrentMonth = date.getMonth() !== visibleMonth.getMonth()
              const isSelected = isSameDay(date, selectedDate)
              const isToday = isSameDay(date, todayDate)
              const events = getEventsForDate(date)

              return (
                <div
                  key={toDateKey(date)}
                  className={cn(
                    "relative min-h-36 p-2.5 align-top",
                    outsideCurrentMonth ? "bg-neutral-50/60" : "bg-neutral-50",
                    isSelected && "bg-brand-50",
                    index % 7 !== 6 && "border-r border-neutral-200",
                    index < visibleDates.length - 7 && "border-b border-neutral-200",
                    isSelected &&
                    "after:absolute after:inset-x-0 after:top-0 after:h-0.5 after:bg-brand-500"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={cn(
                        "mt-1 size-2 rounded-full",
                        isToday ? "bg-brand-500" : "bg-transparent"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm font-medium text-neutral-700",
                        outsideCurrentMonth && "text-neutral-300",
                        isSelected && !outsideCurrentMonth && "text-brand-600"
                      )}
                    >
                      {date.getDate()}
                    </span>
                  </div>

                  <div className="mt-6 space-y-2">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-lg border border-neutral-200 bg-neutral-50 p-2 shadow-[0_1px_2px_rgba(17,24,39,0.05)]"
                      >
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-brand-500 text-white">
                            <IconActivity className="size-3" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-2">
                              <div className="truncate text-[11px] font-semibold text-neutral-900">
                                {event.title}
                              </div>
                              <IconDots className="ml-auto size-3.5 shrink-0 text-neutral-300" />
                            </div>

                            <div className="mt-1 text-[10px] text-neutral-500">
                              {event.exercises} Exercises
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 flex justify-end">
                          {event.completed ? (
                            <span className="inline-flex size-4 items-center justify-center rounded-full bg-green-100 text-green-600">
                              <IconCheck className="size-3" />
                            </span>
                          ) : (
                            <span className="size-4" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
