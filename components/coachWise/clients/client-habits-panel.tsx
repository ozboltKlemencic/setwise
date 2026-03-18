"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import {
  BarChart3,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  Clock3,
  Droplets,
  Flame,
  Footprints,
  MoreVertical,
  MoonStar,
  Pencil,
  Plus,
  Rocket,
  Sprout,
  Trash2,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { type DateRange } from "react-day-picker"

type HabitPoint = {
  date: string
  label: string
  value: number
}

type HabitEntry = {
  id: string
  date: string
  value: number
  memo: string
}

type HabitPeriod = "week" | "month" | "year" | "custom"

type HabitDefinition = {
  id: string
  title: string
  target: string
  templateDescription: string
  goalValue: string
  goalUnit: "steps" | "liters" | "hours" | "minutes"
  goalPeriod: "daily" | "weekly"
  icon: LucideIcon
  iconClassName: string
  iconWrapClassName: string
  chartColor: string
  streak: number
  stats: {
    currentStreak: string
    longestStreak: string
    completed: string
    completionRate: string
  }
  chartData: HabitPoint[]
  yearlyData: HabitPoint[]
  entries: HabitEntry[]
}

const habitsSubTabTriggerClassName =
  "h-auto flex-none gap-1.5 rounded-none border-0 bg-transparent px-0 py-2.5 text-[13px] font-normal text-neutral-500 shadow-none after:hidden hover:text-neutral-700 data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none [&_svg]:size-3.5 [&_svg]:text-neutral-400 data-[state=active]:[&_svg]:text-brand-600"

const createHabitTabTriggerClassName =
  "relative top-[2px] -mb-[6px] h-auto flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 py-2 text-[13px] font-normal text-neutral-500 shadow-none after:hidden hover:text-neutral-700 data-[state=active]:border-brand-500 data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none"

function buildYearlyHabitData(year: number, values: number[]) {
  return values.map((value, index) => ({
    date: `${year}-${String(index + 1).padStart(2, "0")}-01`,
    label: new Date(year, index, 1).toLocaleDateString("sl-SI", {
      month: "short",
    }),
    value,
  }))
}

const habitDefinitions: HabitDefinition[] = [
  {
    id: "steps",
    title: "Daily Steps",
    target: "10000 steps/day",
    templateDescription: "Track daily walking volume and consistency.",
    goalValue: "10000",
    goalUnit: "steps",
    goalPeriod: "daily",
    icon: Footprints,
    iconClassName: "text-violet-600",
    iconWrapClassName: "bg-violet-50 border-violet-200",
    chartColor: "var(--brand-500)",
    streak: 15,
    stats: {
      currentStreak: "15 dni",
      longestStreak: "15 dni",
      completed: "15",
      completionRate: "100%",
    },
    yearlyData: [
      ...buildYearlyHabitData(2025, [11200, 11850, 12110, 12640, 12990, 13210, 13620, 13950, 14110, 13840, 13490, 13120]),
      ...buildYearlyHabitData(2026, [12410, 12790, 13380, 13620, 13940, 14120, 14410, 14630, 14380, 14020, 13790, 14230]),
    ],
    chartData: [
      { date: "2026-03-04", label: "04 Mar", value: 13680 },
      { date: "2026-03-05", label: "05 Mar", value: 10190 },
      { date: "2026-03-06", label: "06 Mar", value: 14810 },
      { date: "2026-03-07", label: "07 Mar", value: 12340 },
      { date: "2026-03-08", label: "08 Mar", value: 11520 },
      { date: "2026-03-09", label: "09 Mar", value: 10060 },
      { date: "2026-03-10", label: "10 Mar", value: 13980 },
      { date: "2026-03-11", label: "11 Mar", value: 13260 },
      { date: "2026-03-12", label: "12 Mar", value: 10870 },
      { date: "2026-03-13", label: "13 Mar", value: 14390 },
      { date: "2026-03-14", label: "14 Mar", value: 13420 },
      { date: "2026-03-15", label: "15 Mar", value: 13690 },
      { date: "2026-03-16", label: "16 Mar", value: 14407 },
      { date: "2026-03-17", label: "17 Mar", value: 12293 },
      { date: "2026-03-18", label: "18 Mar", value: 14045 },
    ],
    entries: [
      { id: "steps-18", date: "2026-03-18", value: 14045, memo: "Dober ritem" },
      { id: "steps-17", date: "2026-03-17", value: 12293, memo: "Lahka hoja" },
      { id: "steps-16", date: "2026-03-16", value: 14407, memo: "Aktiven dan" },
      { id: "steps-15", date: "2026-03-15", value: 13690, memo: "Nedeljski sprehod" },
      { id: "steps-14", date: "2026-03-14", value: 13420, memo: "Brez opomb" },
    ],
  },
  {
    id: "water",
    title: "Water Intake",
    target: "2.5 liters/day",
    templateDescription: "Stay consistent with hydration through the day.",
    goalValue: "2.5",
    goalUnit: "liters",
    goalPeriod: "daily",
    icon: Droplets,
    iconClassName: "text-sky-600",
    iconWrapClassName: "bg-sky-50 border-sky-200",
    chartColor: "#0ea5e9",
    streak: 9,
    stats: {
      currentStreak: "9 dni",
      longestStreak: "12 dni",
      completed: "11",
      completionRate: "73%",
    },
    yearlyData: [
      ...buildYearlyHabitData(2025, [2.1, 2.2, 2.3, 2.4, 2.5, 2.5, 2.6, 2.4, 2.3, 2.4, 2.5, 2.6]),
      ...buildYearlyHabitData(2026, [2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.7, 2.6, 2.8, 2.7, 2.6, 2.8]),
    ],
    chartData: [
      { date: "2026-03-04", label: "04 Mar", value: 2.1 },
      { date: "2026-03-05", label: "05 Mar", value: 1.8 },
      { date: "2026-03-06", label: "06 Mar", value: 2.7 },
      { date: "2026-03-07", label: "07 Mar", value: 2.4 },
      { date: "2026-03-08", label: "08 Mar", value: 2.2 },
      { date: "2026-03-09", label: "09 Mar", value: 1.9 },
      { date: "2026-03-10", label: "10 Mar", value: 2.8 },
      { date: "2026-03-11", label: "11 Mar", value: 2.6 },
      { date: "2026-03-12", label: "12 Mar", value: 2.0 },
      { date: "2026-03-13", label: "13 Mar", value: 2.9 },
      { date: "2026-03-14", label: "14 Mar", value: 2.5 },
      { date: "2026-03-15", label: "15 Mar", value: 2.6 },
      { date: "2026-03-16", label: "16 Mar", value: 2.7 },
      { date: "2026-03-17", label: "17 Mar", value: 2.3 },
      { date: "2026-03-18", label: "18 Mar", value: 2.8 },
    ],
    entries: [
      { id: "water-18", date: "2026-03-18", value: 2.8, memo: "Cilj dosezen" },
      { id: "water-17", date: "2026-03-17", value: 2.3, memo: "Malo pod planom" },
      { id: "water-16", date: "2026-03-16", value: 2.7, memo: "Brez opomb" },
      { id: "water-15", date: "2026-03-15", value: 2.6, memo: "Odlicno" },
      { id: "water-14", date: "2026-03-14", value: 2.5, memo: "Stabilno" },
    ],
  },
  {
    id: "sleep",
    title: "Sleep Duration",
    target: "8 hours/day",
    templateDescription: "Build a steady sleep routine and improve recovery.",
    goalValue: "8",
    goalUnit: "hours",
    goalPeriod: "daily",
    icon: MoonStar,
    iconClassName: "text-orange-600",
    iconWrapClassName: "bg-orange-50 border-orange-200",
    chartColor: "#f59e0b",
    streak: 7,
    stats: {
      currentStreak: "7 dni",
      longestStreak: "10 dni",
      completed: "10",
      completionRate: "67%",
    },
    yearlyData: [
      ...buildYearlyHabitData(2025, [7.0, 7.2, 7.1, 7.3, 7.4, 7.5, 7.4, 7.6, 7.5, 7.3, 7.2, 7.4]),
      ...buildYearlyHabitData(2026, [7.3, 7.4, 7.6, 7.7, 7.8, 7.7, 7.9, 8.0, 7.8, 7.7, 7.6, 7.8]),
    ],
    chartData: [
      { date: "2026-03-04", label: "04 Mar", value: 7.2 },
      { date: "2026-03-05", label: "05 Mar", value: 6.7 },
      { date: "2026-03-06", label: "06 Mar", value: 8.1 },
      { date: "2026-03-07", label: "07 Mar", value: 7.8 },
      { date: "2026-03-08", label: "08 Mar", value: 7.4 },
      { date: "2026-03-09", label: "09 Mar", value: 6.9 },
      { date: "2026-03-10", label: "10 Mar", value: 8.0 },
      { date: "2026-03-11", label: "11 Mar", value: 7.7 },
      { date: "2026-03-12", label: "12 Mar", value: 7.1 },
      { date: "2026-03-13", label: "13 Mar", value: 8.2 },
      { date: "2026-03-14", label: "14 Mar", value: 7.9 },
      { date: "2026-03-15", label: "15 Mar", value: 7.6 },
      { date: "2026-03-16", label: "16 Mar", value: 8.0 },
      { date: "2026-03-17", label: "17 Mar", value: 7.3 },
      { date: "2026-03-18", label: "18 Mar", value: 7.8 },
    ],
    entries: [
      { id: "sleep-18", date: "2026-03-18", value: 7.8, memo: "Dober spanec" },
      { id: "sleep-17", date: "2026-03-17", value: 7.3, memo: "Pozna vecerja" },
      { id: "sleep-16", date: "2026-03-16", value: 8.0, memo: "Brez opomb" },
      { id: "sleep-15", date: "2026-03-15", value: 7.6, memo: "Soliden reset" },
      { id: "sleep-14", date: "2026-03-14", value: 7.9, memo: "Odlicno" },
    ],
  },
]

function formatHabitValue(habit: HabitDefinition, value: number) {
  if (habit.id === "steps") {
    return value.toLocaleString()
  }

  if (habit.id === "water") {
    return `${value.toFixed(1)} L`
  }

  return `${value.toFixed(1)} h`
}

function formatAxisValue(habit: HabitDefinition, value: number) {
  if (habit.id === "steps") {
    return value.toLocaleString()
  }

  return value.toFixed(1)
}

function formatHabitAverage(habit: HabitDefinition) {
  if (!habit.chartData.length) {
    return "-"
  }

  const average =
    habit.chartData.reduce((sum, point) => sum + point.value, 0) /
    habit.chartData.length

  if (habit.id === "steps") {
    return Math.round(average).toLocaleString()
  }

  if (habit.id === "water") {
    return `${average.toFixed(1)} L`
  }

  return `${average.toFixed(1)} h`
}

function parseHabitDate(value: string) {
  const [year, month, day] = value.split("-").map(Number)

  return new Date(year, month - 1, day)
}

function getWeekStart(date: Date) {
  const nextDate = new Date(date)
  const day = nextDate.getDay()
  const diff = day === 0 ? -6 : 1 - day

  nextDate.setDate(nextDate.getDate() + diff)
  nextDate.setHours(0, 0, 0, 0)

  return nextDate
}

function getWeekEnd(date: Date) {
  const nextDate = getWeekStart(date)
  nextDate.setDate(nextDate.getDate() + 6)
  nextDate.setHours(23, 59, 59, 999)

  return nextDate
}

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function getMonthEnd(date: Date) {
  const nextDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  nextDate.setHours(23, 59, 59, 999)

  return nextDate
}

function getYearStart(date: Date) {
  return new Date(date.getFullYear(), 0, 1)
}

function shiftDays(date: Date, days: number) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)

  return nextDate
}

function getNextMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1)
}

function isSameMonth(date: Date, target: Date) {
  return (
    date.getFullYear() === target.getFullYear() &&
    date.getMonth() === target.getMonth()
  )
}

function isSameWeek(date: Date, target: Date) {
  return getWeekStart(date).getTime() === getWeekStart(target).getTime()
}

function isSameYear(date: Date, target: Date) {
  return date.getFullYear() === target.getFullYear()
}

function formatHabitMonth(date: Date | undefined) {
  if (!date) {
    return "Izberi mesec"
  }

  return date.toLocaleDateString("sl-SI", {
    month: "long",
    year: "numeric",
  })
}

function formatHabitWeek(date: Date | undefined) {
  if (!date) {
    return "Izberi teden"
  }

  const start = getWeekStart(date)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)

  return `${start.toLocaleDateString("sl-SI", {
    day: "2-digit",
    month: "short",
  })} - ${end.toLocaleDateString("sl-SI", {
    day: "2-digit",
    month: "short",
  })}`
}

function formatHabitWeekRange(range: DateRange | undefined) {
  if (!range?.from) {
    return "Izberi obdobje"
  }

  if (!range.to) {
    return range.from.toLocaleDateString("sl-SI", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const sameYear = range.from.getFullYear() === range.to.getFullYear()

  return `${range.from.toLocaleDateString("sl-SI", {
    day: "2-digit",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  })} - ${range.to.toLocaleDateString("sl-SI", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`
}

function formatHabitPickerLabel(
  period: HabitPeriod,
  date: Date,
  weekRange?: DateRange
) {
  if (period === "week") {
    return `Teden · ${formatHabitWeekRange(weekRange)}`
  }

  if (period === "year") {
    return `Leto · ${date.getFullYear()}`
  }

  return `Mesec · ${formatHabitMonth(date)}`
}

function getDateRangeLengthInDays(range: DateRange | undefined) {
  if (!range?.from || !range?.to) {
    return 0
  }

  const start = new Date(
    range.from.getFullYear(),
    range.from.getMonth(),
    range.from.getDate()
  )
  const end = new Date(range.to.getFullYear(), range.to.getMonth(), range.to.getDate())

  return Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1
}

function isDateInRange(date: Date, range: DateRange | undefined) {
  if (!range?.from || !range?.to) {
    return false
  }

  return date >= range.from && date <= range.to
}

function doesMonthOverlapRange(date: Date, range: DateRange | undefined) {
  if (!range?.from || !range?.to) {
    return false
  }

  return getMonthStart(date) <= range.to && getMonthEnd(date) >= range.from
}

function getHabitPickerLabel(
  period: HabitPeriod,
  date: Date,
  weekRange?: DateRange,
  customRange?: DateRange
) {
  if (period === "week") {
    return `Teden \u00b7 ${formatHabitWeekRange(weekRange)}`
  }

  if (period === "custom") {
    return `Custom \u00b7 ${formatHabitWeekRange(customRange)}`
  }

  if (period === "year") {
    return `Leto \u00b7 ${date.getFullYear()}`
  }

  return `Mesec \u00b7 ${formatHabitMonth(date)}`
}

function HabitDatePicker({
  period,
  onPeriodChange,
  value,
  onChange,
  weekRange,
  onWeekRangeChange,
  customRange,
  onCustomRangeChange,
  availableYears,
}: {
  period: HabitPeriod
  onPeriodChange: (value: HabitPeriod) => void
  value: Date
  onChange: (value: Date) => void
  weekRange: DateRange | undefined
  onWeekRangeChange: (value: DateRange | undefined) => void
  customRange: DateRange | undefined
  onCustomRangeChange: (value: DateRange | undefined) => void
  availableYears: number[]
}) {
  const [open, setOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState<Date>(
    weekRange?.from ?? customRange?.from ?? value
  )
  const [draftCustomRange, setDraftCustomRange] = React.useState<DateRange | undefined>(
    customRange
  )
  const [leftCustomMonth, setLeftCustomMonth] = React.useState<Date>(
    getMonthStart(customRange?.from ?? value)
  )
  const [rightCustomMonth, setRightCustomMonth] = React.useState<Date>(
    getMonthStart(customRange?.to ?? getNextMonth(customRange?.from ?? value))
  )
  const label = getHabitPickerLabel(period, value, weekRange, customRange)
  const triggerWidth = `clamp(11rem, ${Math.max(label.length + 8,)}ch, 18rem)`

  React.useEffect(() => {
    if (period === "week") {
      setViewMonth(weekRange?.from ?? value)
      return
    }

    if (period === "custom") {
      setViewMonth(customRange?.from ?? value)
      return
    }

    setViewMonth(value)
  }, [customRange?.from, period, value, weekRange?.from])

  React.useEffect(() => {
    if (period === "custom" && open) {
      setDraftCustomRange(customRange)
      const nextLeftMonth = getMonthStart(customRange?.from ?? value)
      const nextRightMonth = getMonthStart(
        customRange?.to ?? getNextMonth(customRange?.from ?? value)
      )

      setLeftCustomMonth(nextLeftMonth)
      setRightCustomMonth(
        nextRightMonth < nextLeftMonth ? nextLeftMonth : nextRightMonth
      )
    }
  }, [customRange, open, period])

  const handleLeftCustomMonthChange = React.useCallback((nextMonth: Date) => {
    const normalizedMonth = getMonthStart(nextMonth)

    setLeftCustomMonth(normalizedMonth)
    setRightCustomMonth((currentRightMonth) =>
      normalizedMonth > currentRightMonth ? normalizedMonth : currentRightMonth
    )
  }, [])

  const handleRightCustomMonthChange = React.useCallback((nextMonth: Date) => {
    const normalizedMonth = getMonthStart(nextMonth)

    setRightCustomMonth(normalizedMonth)
    setLeftCustomMonth((currentLeftMonth) =>
      normalizedMonth < currentLeftMonth ? normalizedMonth : currentLeftMonth
    )
  }, [])

  return (
    <div
      className="relative max-w-full shrink-0"
      style={{ width: triggerWidth }}
    >
      <Input
        readOnly
        title={label}
        value={label}
        className="h-9 cursor-pointer rounded-sm border-neutral-200/80  pr-12 text-[13px] font-medium text-neutral-800 capitalize shadow-none focus-visible:border-neutral-300 focus-visible:ring-0 gap-x-2"
        onClick={() => setOpen(true)}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center gap-0.5 rounded-sm text-neutral-400 shadow-none  hover:bg-neutral-100 hover:text-neutral-600"
          >
            <CalendarDays className="size-4" />
            <ChevronDown className="size-3.5" />
            <span className="sr-only">Izberi obdobje</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className={cn(
            "rounded-sm border-neutral-200/80 p-0 shadow-lg shadow-black/5",
            period === "week" || period === "custom"
              ? "w-auto max-w-[calc(100vw-24px)] overflow-hidden"
              : "w-[280px] overflow-hidden"
          )}
        >
          <div className="border-b border-neutral-200 p-2">
            <div className="inline-flex w-full overflow-hidden rounded-sm border border-neutral-200 bg-white">
              {([
                { value: "week", label: "Teden" },
                { value: "month", label: "Mesec" },
                { value: "year", label: "Leto" },
                { value: "custom", label: "Custom" },
              ] as const).map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant="ghost"
                  className={cn(
                    "flex-1 rounded-none px-3 text-[13px] text-neutral-600 shadow-none hover:bg-neutral-50",
                    period === option.value && "bg-brand-50 text-brand-700"
                  )}
                  onClick={() => onPeriodChange(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {period === "year" ? (
            <div className="grid grid-cols-2 gap-2 p-3">
              {availableYears.map((year) => {
                const isActive = value.getFullYear() === year

                return (
                  <Button
                    key={year}
                    type="button"
                    variant="outline"
                    className={cn(
                      "rounded-sm border-neutral-200 text-[13px] shadow-none hover:bg-neutral-50",
                      isActive && "border-brand-300 bg-brand-50 text-brand-700"
                    )}
                    onClick={() => {
                      onChange(new Date(year, 0, 1))
                      setOpen(false)
                    }}
                  >
                    {year}
                  </Button>
                )
              })}
            </div>
          ) : period === "week" ? (
            <Calendar
              mode="range"
              month={viewMonth}
              selected={weekRange}
              numberOfMonths={2}
              startMonth={new Date(Math.min(...availableYears), 0, 1)}
              endMonth={new Date(Math.max(...availableYears), 11, 1)}
              modifiersClassNames={{
                outside: "text-neutral-400",
              }}
              modifiersStyles={{
                outside: {
                  opacity: 0.7,
                },
              }}
              onMonthChange={setViewMonth}
              onDayClick={(anchorDate) => {
                const fullWeekRange = {
                  from: getWeekStart(anchorDate),
                  to: getWeekEnd(anchorDate),
                }

                setViewMonth(fullWeekRange.from)
                onWeekRangeChange(fullWeekRange)
                onChange(fullWeekRange.from)
                setOpen(false)
              }}
            />
          ) : period === "custom" ? (
            <div>
              <div className="grid gap-0 border-b border-neutral-200 md:grid-cols-2">
                <div className="border-neutral-200 md:border-r">
                  <Calendar
                    mode="range"
                    month={leftCustomMonth}
                    selected={draftCustomRange}
                    captionLayout="dropdown"
                    startMonth={new Date(Math.min(...availableYears), 0, 1)}
                    endMonth={new Date(Math.max(...availableYears), 11, 1)}
                    modifiersClassNames={{
                      outside: "text-neutral-400",
                    }}
                    modifiersStyles={{
                      outside: {
                        opacity: 0.7,
                      },
                    }}
                    onMonthChange={handleLeftCustomMonthChange}
                    onSelect={(range) => {
                      setDraftCustomRange(range)
                    }}
                  />
                </div>
                <div>
                  <Calendar
                    mode="range"
                    month={rightCustomMonth}
                    selected={draftCustomRange}
                    captionLayout="dropdown"
                    startMonth={new Date(Math.min(...availableYears), 0, 1)}
                    endMonth={new Date(Math.max(...availableYears), 11, 1)}
                    modifiersClassNames={{
                      outside: "text-neutral-400",
                    }}
                    modifiersStyles={{
                      outside: {
                        opacity: 0.7,
                      },
                    }}
                    onMonthChange={handleRightCustomMonthChange}
                    onSelect={(range) => {
                      setDraftCustomRange(range)
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end border-t border-neutral-200 px-3 py-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={!draftCustomRange?.from || !draftCustomRange?.to}
                  className="rounded-sm bg-linear-to-r from-brand-500 to-brand-600 px-3 text-white shadow-none hover:from-brand-600 hover:to-brand-700 disabled:opacity-45"
                  onClick={() => {
                    if (!draftCustomRange?.from || !draftCustomRange?.to) {
                      return
                    }

                    onCustomRangeChange(draftCustomRange)
                    onChange(draftCustomRange.from)
                    setOpen(false)
                  }}
                >
                  Potrdi
                </Button>
              </div>
            </div>
          ) : (
            <Calendar
              mode="single"
              month={value}
              selected={value}
              captionLayout="dropdown"
              showOutsideDays={false}
              startMonth={new Date(Math.min(...availableYears), 0, 1)}
              endMonth={new Date(Math.max(...availableYears), 11, 1)}
              onSelect={(date) => {
                if (!date) {
                  return
                }

                onChange(getMonthStart(date))
              }}
              onMonthChange={(month) => {
                onChange(getMonthStart(month))
                setOpen(false)
              }}
              classNames={
                period === "month"
                  ? {
                    month: "flex w-full flex-col gap-0",
                    table: "hidden",
                    weekdays: "hidden",
                    week: "hidden",
                  }
                  : undefined
              }
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

function CreateHabitDialog({
  triggerClassName,
}: {
  triggerClassName?: string
}) {
  const featuredHabit = habitDefinitions[0]
  const [open, setOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("new")
  const [habitName, setHabitName] = React.useState("")
  const [habitDescription, setHabitDescription] = React.useState("")
  const [goalValue, setGoalValue] = React.useState("")
  const [goalUnit, setGoalUnit] = React.useState("steps")
  const [goalPeriod, setGoalPeriod] = React.useState("daily")
  const [hasDateRange, setHasDateRange] = React.useState(true)
  const [startDate, setStartDate] = React.useState("2026-03-18")
  const [endDate, setEndDate] = React.useState("2026-04-17")
  const [hasReminder, setHasReminder] = React.useState(true)
  const [reminderTime, setReminderTime] = React.useState("09:00")
  const [reminderNote, setReminderNote] = React.useState("")
  const [draftHabitId, setDraftHabitId] = React.useState(featuredHabit?.id ?? "")
  const [selectedTemplateId, setSelectedTemplateId] = React.useState(
    featuredHabit?.id ?? ""
  )

  const resetDialog = React.useCallback(() => {
    setActiveTab("new")
    setHabitName("")
    setHabitDescription("")
    setGoalValue("")
    setGoalUnit("steps")
    setGoalPeriod("daily")
    setHasDateRange(true)
    setStartDate("2026-03-18")
    setEndDate("2026-04-17")
    setHasReminder(true)
    setReminderTime("09:00")
    setReminderNote("")
    setDraftHabitId(featuredHabit?.id ?? "")
    setSelectedTemplateId(featuredHabit?.id ?? "")
  }, [featuredHabit?.id])

  const draftHabit =
    habitDefinitions.find((habit) => habit.id === draftHabitId) ?? featuredHabit
  const selectedTemplate =
    habitDefinitions.find((habit) => habit.id === selectedTemplateId) ??
    featuredHabit

  const applyTemplate = React.useCallback((habit: HabitDefinition) => {
    setSelectedTemplateId(habit.id)
    setDraftHabitId(habit.id)
    setHabitName(habit.title)
    setHabitDescription(habit.templateDescription)
    setGoalValue(habit.goalValue)
    setGoalUnit(habit.goalUnit)
    setGoalPeriod(habit.goalPeriod)
    setReminderNote(habit.target)
    setActiveTab("new")
  }, [])

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)

        if (!nextOpen) {
          resetDialog()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" size="sm" className={triggerClassName}>
          <Plus className="size-4" />
          New Habit
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-0 overflow-hidden rounded-sm border-neutral-200 bg-white p-0 shadow-2xl shadow-black/10 sm:max-w-[720px]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0">
          <div className="pt-4">
            <div className="px-5">
              <DialogTitle className="flex items-center gap-2 text-[18px] font-semibold text-neutral-950">
                <Sprout className="size-4 text-neutral-500" />
                New Habit
              </DialogTitle>
            </div>

            <div className="mt-3 border-b border-neutral-200 px-5">
              <TabsList
                variant="line"
                className="h-auto w-full justify-start gap-6 rounded-none bg-transparent p-0"
              >
                <TabsTrigger
                  value="new"
                  className={createHabitTabTriggerClassName}
                >
                  New Habit
                </TabsTrigger>
                <TabsTrigger
                  value="templates"
                  className={createHabitTabTriggerClassName}
                >
                  Templates
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="new" className="mt-0 space-y-0">
            <div className="space-y-5 px-5 py-5">
              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-neutral-800">
                  Habit Name <span className="text-rose-500">*</span>
                </label>
                <div className="grid gap-3 md:grid-cols-[52px_minmax(0,1fr)]">
                  <div
                    className={cn(
                      "flex size-[52px] items-center justify-center rounded-sm border border-neutral-200",
                      draftHabit?.iconWrapClassName ?? "bg-violet-50"
                    )}
                  >
                    {draftHabit ? (
                      <draftHabit.icon
                        className={cn("size-5", draftHabit.iconClassName)}
                      />
                    ) : (
                      <Footprints className="size-5 text-violet-600" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Input
                      value={habitName}
                      onChange={(event) => setHabitName(event.target.value)}
                      maxLength={50}
                      placeholder="Name of the habit e.g. Daily Steps"
                      className="h-10 rounded-sm border-neutral-200 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                    />
                    <div className="text-right text-[12px] text-neutral-400">
                      {habitName.length} / 50
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-neutral-800">
                  Habit Description
                </label>
                <textarea
                  value={habitDescription}
                  onChange={(event) => setHabitDescription(event.target.value)}
                  maxLength={1000}
                  placeholder="Enter any additional info"
                  className="min-h-[92px] w-full resize-none rounded-sm border border-neutral-200 bg-white px-3 py-2 text-[14px] text-neutral-700 shadow-none outline-none placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-0"
                />
                <div className="text-right text-[12px] text-neutral-400">
                  {habitDescription.length} / 1000
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-neutral-800">
                  Goal, Unit &amp; Period <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  <Input
                    value={goalValue}
                    onChange={(event) => setGoalValue(event.target.value)}
                    placeholder="Goal"
                    className="h-10 rounded-sm border-neutral-200 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0 md:w-[110px]"
                  />
                  <Select value={goalUnit} onValueChange={setGoalUnit}>
                    <SelectTrigger className="h-10 rounded-sm border-neutral-200 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0 md:w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-md border-neutral-200/70 shadow-lg shadow-black/5">
                      <SelectItem value="steps">steps</SelectItem>
                      <SelectItem value="liters">liters</SelectItem>
                      <SelectItem value="hours">hours</SelectItem>
                      <SelectItem value="minutes">minutes</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="hidden text-neutral-400 md:block">/</span>
                  <div className="inline-flex overflow-hidden rounded-sm border border-neutral-200 bg-white">
                    <Button
                      type="button"
                      variant="ghost"
                      className={cn(
                        "rounded-none px-4 text-neutral-700 shadow-none hover:bg-neutral-50",
                        goalPeriod === "daily" && "bg-brand-50 text-brand-700"
                      )}
                      onClick={() => setGoalPeriod("daily")}
                    >
                      Daily
                    </Button>
                    <div className="w-px bg-neutral-200" />
                    <Button
                      type="button"
                      variant="ghost"
                      className={cn(
                        "rounded-none px-4 text-neutral-700 shadow-none hover:bg-neutral-50",
                        goalPeriod === "weekly" && "bg-brand-50 text-brand-700"
                      )}
                      onClick={() => setGoalPeriod("weekly")}
                    >
                      Weekly
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="block text-[13px] font-medium text-neutral-800">
                    Start Habit Date / Include End Date?
                  </label>
                  <button
                    type="button"
                    onClick={() => setHasDateRange((current) => !current)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full border transition-colors",
                      hasDateRange
                        ? "border-brand-500 bg-brand-500"
                        : "border-neutral-300 bg-neutral-200"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block size-5 rounded-full bg-white shadow-sm transition-transform",
                        hasDateRange ? "translate-x-5" : "translate-x-0.5"
                      )}
                    />
                    <span className="sr-only">Toggle date range</span>
                  </button>
                </div>
                <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_20px_minmax(0,1fr)] md:items-center">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    className="h-10 rounded-sm border-neutral-200 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                  <div className="hidden justify-center text-neutral-400 md:flex">
                    <CalendarDays className="size-4" />
                  </div>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    disabled={!hasDateRange}
                    className="h-10 rounded-sm border-neutral-200 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0 disabled:opacity-45"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="block text-[13px] font-medium text-neutral-800">
                    Set Reminder
                  </label>
                  <button
                    type="button"
                    onClick={() => setHasReminder((current) => !current)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full border transition-colors",
                      hasReminder
                        ? "border-brand-500 bg-brand-500"
                        : "border-neutral-300 bg-neutral-200"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block size-5 rounded-full bg-white shadow-sm transition-transform",
                        hasReminder ? "translate-x-5" : "translate-x-0.5"
                      )}
                    />
                    <span className="sr-only">Toggle reminder</span>
                  </button>
                </div>
                <div className="grid gap-2 md:grid-cols-[128px_minmax(0,1fr)]">
                  <div className="relative">
                    <Input
                      type="time"
                      value={reminderTime}
                      onChange={(event) => setReminderTime(event.target.value)}
                      disabled={!hasReminder}
                      className="h-10 rounded-sm border-neutral-200 bg-white pr-9 text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0 disabled:opacity-45"
                    />
                    <Clock3 className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-neutral-400" />
                  </div>
                  <Input
                    value={reminderNote}
                    onChange={(event) => setReminderNote(event.target.value)}
                    disabled={!hasReminder}
                    placeholder="Reminder note"
                    className="h-10 rounded-sm border-neutral-200 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0 disabled:opacity-45"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-sm px-2 text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
                >
                  Close
                </Button>
              </DialogClose>
              <Button
                type="button"
                disabled={!habitName.trim() || !goalValue.trim()}
                className="rounded-sm bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700 disabled:opacity-45"
              >
                Add Habit
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="templates" className="mt-0 space-y-0">
            <div className="grid gap-3 px-5 py-5 sm:grid-cols-2 lg:grid-cols-3">
              {habitDefinitions.map((habit) => {
                const Icon = habit.icon
                const isActive = habit.id === selectedTemplate?.id

                return (
                  <button
                    key={habit.id}
                    type="button"
                    onClick={() => applyTemplate(habit)}
                    className={cn(
                      "flex items-center gap-3 rounded-sm border px-3 py-3 text-left transition-colors",
                      isActive
                        ? "border-brand-200 bg-brand-50/50"
                        : "border-neutral-200 bg-white hover:bg-neutral-50"
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-sm border",
                        habit.iconWrapClassName
                      )}
                    >
                      <Icon className={cn("size-5", habit.iconClassName)} />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[14px] font-medium text-neutral-900">
                        {habit.title}
                      </div>
                      <div className="mt-0.5 text-[13px] text-neutral-500">
                        {habit.target}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <DialogFooter className="border-t border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-sm px-2 text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
                >
                  Close
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={() => {
                  if (selectedTemplate) {
                    applyTemplate(selectedTemplate)
                  }
                }}
                className="rounded-sm bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700"
              >
                Use Template
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function HabitStatCard({
  icon: Icon,
  label,
  value,
  iconClassName,
}: {
  icon: LucideIcon
  label: string
  value: string
  iconClassName: string
}) {
  return (
    <div className="rounded-sm border border-neutral-200 bg-white px-4 py-3">
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5", iconClassName)}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[13px] text-neutral-500">{label}</div>
          <div className="mt-1 text-[28px] leading-none font-semibold text-neutral-950">
            {value}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ClientHabitsPanel() {
  const currentYear = new Date().getFullYear()
  const [selectedHabitId, setSelectedHabitId] = React.useState(
    habitDefinitions[0]?.id ?? ""
  )
  const [selectedPeriod, setSelectedPeriod] = React.useState<HabitPeriod>("month")
  const [selectedDate, setSelectedDate] = React.useState(() =>
    getMonthStart(
      parseHabitDate(habitDefinitions[0]?.chartData.at(-1)?.date ?? "2026-03-01")
    )
  )
  const [selectedWeekRange, setSelectedWeekRange] = React.useState<DateRange | undefined>(
    () => {
      const baseDate = parseHabitDate(
        habitDefinitions[0]?.chartData.at(-1)?.date ?? "2026-03-01"
      )

      return {
        from: getWeekStart(baseDate),
        to: getWeekEnd(baseDate),
      }
    }
  )
  const [selectedCustomRange, setSelectedCustomRange] = React.useState<
    DateRange | undefined
  >(() => {
    const baseDate = parseHabitDate(
      habitDefinitions[0]?.chartData.at(-1)?.date ?? "2026-03-18"
    )

    return {
      from: shiftDays(baseDate, -13),
      to: baseDate,
    }
  })

  const selectedHabit =
    habitDefinitions.find((habit) => habit.id === selectedHabitId) ??
    habitDefinitions[0]
  const SelectedHabitIcon = selectedHabit.icon
  const availableYears = React.useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => currentYear - 2 + index),
    [currentYear]
  )
  const filteredChartData = React.useMemo(
    () => {
      if (selectedPeriod === "year") {
        return selectedHabit.yearlyData.filter((point) =>
          isSameYear(parseHabitDate(point.date), selectedDate)
        )
      }

      if (selectedPeriod === "custom") {
        const rangeLength = getDateRangeLengthInDays(selectedCustomRange)

        if (rangeLength > 62) {
          return selectedHabit.yearlyData.filter((point) =>
            doesMonthOverlapRange(parseHabitDate(point.date), selectedCustomRange)
          )
        }

        return selectedHabit.chartData.filter((point) =>
          isDateInRange(parseHabitDate(point.date), selectedCustomRange)
        )
      }

      if (selectedPeriod === "week") {
        const from = selectedWeekRange?.from
        const to = selectedWeekRange?.to

        if (!from || !to) {
          return []
        }

        return selectedHabit.chartData.filter((point) =>
          parseHabitDate(point.date) >= from &&
          parseHabitDate(point.date) <= to
        )
      }

      return selectedHabit.chartData.filter((point) =>
        isSameMonth(parseHabitDate(point.date), selectedDate)
      )
    },
    [
      selectedCustomRange,
      selectedDate,
      selectedHabit,
      selectedPeriod,
      selectedWeekRange,
    ]
  )
  const filteredEntries = React.useMemo(
    () => {
      if (selectedPeriod === "year") {
        return selectedHabit.entries.filter((entry) =>
          isSameYear(parseHabitDate(entry.date), selectedDate)
        )
      }

      if (selectedPeriod === "custom") {
        return selectedHabit.entries.filter((entry) =>
          isDateInRange(parseHabitDate(entry.date), selectedCustomRange)
        )
      }

      if (selectedPeriod === "week") {
        const from = selectedWeekRange?.from
        const to = selectedWeekRange?.to

        if (!from || !to) {
          return []
        }

        return selectedHabit.entries.filter((entry) =>
          parseHabitDate(entry.date) >= from &&
          parseHabitDate(entry.date) <= to
        )
      }

      return selectedHabit.entries.filter((entry) =>
        isSameMonth(parseHabitDate(entry.date), selectedDate)
      )
    },
    [
      selectedCustomRange,
      selectedDate,
      selectedHabit,
      selectedPeriod,
      selectedWeekRange,
    ]
  )

  React.useEffect(() => {
    if (selectedPeriod === "year") {
      const fallbackYear = selectedHabit.yearlyData.at(-1)?.date

      if (fallbackYear) {
        setSelectedDate(getYearStart(parseHabitDate(fallbackYear)))
      }

      return
    }

    const fallbackDate = selectedHabit.chartData.at(-1)?.date

    if (!fallbackDate) {
      return
    }

    const parsedDate = parseHabitDate(fallbackDate)
    if (selectedPeriod === "week") {
      setSelectedDate(getWeekStart(parsedDate))
      setSelectedWeekRange({
        from: getWeekStart(parsedDate),
        to: getWeekEnd(parsedDate),
      })
      return
    }

    if (selectedPeriod === "custom") {
      const nextRange = {
        from: shiftDays(parsedDate, -13),
        to: parsedDate,
      }

      setSelectedDate(nextRange.from)
      setSelectedCustomRange(nextRange)
      return
    }

    setSelectedDate(getMonthStart(parsedDate))
  }, [selectedHabitId, selectedHabit, selectedPeriod])

  const chartConfig: ChartConfig = {
    value: {
      label: selectedHabit.title,
      color: selectedHabit.chartColor,
    },
  }

  return (
    <Tabs defaultValue="habits" className="gap-0">
      <div className="border-b border-neutral-200 bg-neutral-50">
        <div className="flex min-h-10 flex-col gap-2.5 px-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <TabsList
              variant="line"
              className="h-auto w-max min-w-max justify-start gap-4 rounded-none bg-transparent p-0"
            >
              <TabsTrigger
                value="habits"
                className={habitsSubTabTriggerClassName}
              >
                <BarChart3 className="size-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className={habitsSubTabTriggerClassName}
              >
                <Footprints className="size-4" />
                Habits
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-sm border-neutral-200 text-neutral-600 shadow-none hover:bg-neutral-50"
            >
              <Pencil className="size-4" />
              Uredi
            </Button>
            <CreateHabitDialog triggerClassName="rounded-sm border-transparent bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700" />
          </div>
        </div>
      </div>

      <TabsContent value="habits" className="mt-0 space-y-0">
        <div className="grid gap-0 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="border-b border-neutral-200 bg-white lg:border-r lg:border-b-0">
            {habitDefinitions.map((habit) => {
              const Icon = habit.icon
              const isActive = habit.id === selectedHabit.id

              return (
                <button
                  key={habit.id}
                  type="button"
                  onClick={() => setSelectedHabitId(habit.id)}
                  className={cn(
                    "flex w-full items-center justify-between border-b border-neutral-200 px-5 py-4 text-left transition-colors last:border-b-0",
                    isActive
                      ? "bg-brand-50/50"
                      : "bg-white hover:bg-neutral-50"
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-sm border",
                        habit.iconWrapClassName
                      )}
                    >
                      <Icon className={cn("size-5", habit.iconClassName)} />
                    </div>
                    <div className="min-w-0">
                      <div
                        className={cn(
                          "truncate text-[14px] font-medium",
                          isActive ? "text-brand-700" : "text-neutral-900"
                        )}
                      >
                        {habit.title}
                      </div>
                      <div className="mt-0.5 text-[13px] text-neutral-500">
                        {habit.target}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[13px] font-medium text-neutral-700">
                    <Flame className="size-4 text-sky-500" />
                    {habit.streak}
                  </div>
                </button>
              )
            })}
          </aside>

          <div className="min-w-0 bg-neutral-50">
            <div className="space-y-4 px-4 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-sm border",
                      selectedHabit.iconWrapClassName
                    )}
                  >
                    <SelectedHabitIcon
                      className={cn("size-5", selectedHabit.iconClassName)}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[28px] leading-none font-semibold text-neutral-950">
                      {selectedHabit.title}
                    </div>
                    <div className="mt-1 text-[13px] text-neutral-500">
                      {selectedHabit.target}
                    </div>
                  </div>
                </div>
                <HabitDatePicker
                  period={selectedPeriod}
                  onPeriodChange={setSelectedPeriod}
                  value={selectedDate}
                  onChange={setSelectedDate}
                  weekRange={selectedWeekRange}
                  onWeekRangeChange={setSelectedWeekRange}
                  customRange={selectedCustomRange}
                  onCustomRangeChange={setSelectedCustomRange}
                  availableYears={availableYears}
                />
              </div>

              <div className="grid gap-3 xl:grid-cols-4">
                <HabitStatCard
                  icon={Flame}
                  label="Current Streak"
                  value={selectedHabit.stats.currentStreak}
                  iconClassName="text-sky-500"
                />
                <HabitStatCard
                  icon={Rocket}
                  label="Longest Streak"
                  value={selectedHabit.stats.longestStreak}
                  iconClassName="text-blue-500"
                />
                <HabitStatCard
                  icon={CheckCircle2}
                  label="Habit Completed"
                  value={selectedHabit.stats.completed}
                  iconClassName="text-cyan-500"
                />
                <HabitStatCard
                  icon={BarChart3}
                  label="Completion Rate"
                  value={selectedHabit.stats.completionRate}
                  iconClassName="text-sky-500"
                />
              </div>

              <div className="rounded-sm border border-neutral-200 bg-white p-4">
                {filteredChartData.length ? (
                  <ChartContainer
                    config={chartConfig}
                    className="h-[360px] w-full aspect-auto"
                  >
                    <AreaChart
                      accessibilityLayer
                      data={filteredChartData}
                      margin={{ left: 12, right: 12, top: 8, bottom: 0 }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        width={54}
                        tickMargin={8}
                        tickFormatter={(value) =>
                          formatAxisValue(selectedHabit, Number(value))
                        }
                      />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            indicator="line"
                            labelFormatter={(_, payload) =>
                              payload?.[0]?.payload?.date ?? ""
                            }
                            formatter={(value) =>
                              formatHabitValue(selectedHabit, Number(value))
                            }
                          />
                        }
                      />
                      <defs>
                        <linearGradient id="fillHabitValue" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="var(--color-value)"
                            stopOpacity={0.35}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-value)"
                            stopOpacity={0.04}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        dataKey="value"
                        type="natural"
                        fill="url(#fillHabitValue)"
                        fillOpacity={1}
                        stroke="var(--color-value)"
                        strokeWidth={2.5}
                      />
                    </AreaChart>
                  </ChartContainer>
                ) : (
                  <div className="flex h-[360px] items-center justify-center rounded-sm bg-neutral-50 text-center">
                    <div>
                      <div className="text-[14px] font-medium text-neutral-900">
                        Ni podatkov za izbran prikaz
                      </div>
                      <div className="mt-1 text-[13px] text-neutral-500">
                        Izberi drug teden, mesec ali leto za prikaz napredka navade.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-4">Value</TableHead>
                      <TableHead>Memo</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-14 pr-4">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.length ? (
                      filteredEntries.map((entry) => (
                        <TableRow key={entry.id} className="bg-white">
                          <TableCell className="pl-4 text-[14px] font-medium text-neutral-900">
                            {formatHabitValue(selectedHabit, entry.value)}
                          </TableCell>
                          <TableCell className="text-[14px] text-neutral-500">
                            {entry.memo}
                          </TableCell>
                          <TableCell className="text-[14px] text-neutral-700">
                            {entry.date}
                          </TableCell>
                          <TableCell className="pr-4 text-right">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon-xs"
                              className="size-8 rounded-sm border-neutral-200 bg-white text-neutral-600 shadow-none hover:bg-neutral-50 hover:text-neutral-900"
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-24 text-center text-[13px] text-neutral-500"
                        >
                          Ni vnosov za izbran prikaz.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="overview" className="mt-0 space-y-0">
        <div className="px-4 py-2">
          <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4 lg:pl-5">
                    <div className="w-[16rem] min-w-[16rem]">Habit</div>
                  </TableHead>
                  <TableHead>Povprecno</TableHead>
                  <TableHead className="px-1 pr-2 lg:pr-3">
                    <div className="w-6" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {habitDefinitions.map((habit) => {
                  const Icon = habit.icon

                  return (
                    <TableRow key={habit.id} className="bg-white">
                      <TableCell className="pl-4 lg:pl-5">
                        <div className="flex w-[18rem] max-w-full items-center gap-3">
                          <div
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded-sm border",
                              habit.iconWrapClassName
                            )}
                          >
                            <Icon
                              className={cn("size-4.5", habit.iconClassName)}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-[14px] font-medium text-neutral-900">
                              {habit.title}
                            </div>
                            <div className="mt-0.5 text-[13px] text-neutral-500">
                              {habit.target}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-[14px] font-medium text-neutral-900">
                        {formatHabitAverage(habit)}
                      </TableCell>
                      <TableCell className="px-1 pr-2 lg:pr-3">
                        <div className="flex w-6 justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon-sm"
                                className="size-6 cursor-pointer rounded-md border-neutral-200/45 bg-transparent text-muted-foreground shadow-none transition-colors hover:border-neutral-200/70 hover:bg-neutral-50/70 hover:text-foreground data-[state=open]:border-neutral-200/70 data-[state=open]:bg-neutral-50/80"
                              >
                                <MoreVertical className="size-3" />
                                <span className="sr-only">
                                  Odpri meni navade
                                </span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              sideOffset={8}
                              className="w-44 rounded-lg border-neutral-200/60 bg-white/95 p-1.5 shadow-lg shadow-black/5 backdrop-blur-sm"
                            >
                              <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-[13px] focus:bg-neutral-50 focus:text-neutral-950">
                                <Pencil className="size-4 text-neutral-500" />
                                Uredi
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-neutral-200/70" />
                              <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-[13px] text-red-600 focus:bg-red-50 focus:text-red-700">
                                <Trash2 className="size-4" />
                                Izbrisi
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
