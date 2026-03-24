"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { IconDots } from "@tabler/icons-react"
import {
  CalendarDays,
  CalendarIcon,
  ChevronLeft,
  ChevronDown,
  Dumbbell,
  Filter,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { type DateRange } from "react-day-picker"

import {
  HabitPeriodPicker,
  getMonthStart,
  getWeekEnd,
  getWeekStart,
  type HabitPeriod,
  type HabitPeriodSelection,
} from "@/components/coachWise/clients/habit-period-picker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

type ExerciseSet = {
  set: number
  weight: number
  reps: number
}

type ExerciseHistoryPoint = {
  date: string
  weight: number
  reps: number
}

type WorkoutExercise = {
  id: string
  name: string
  currentSets: ExerciseSet[]
  history: ExerciseHistoryPoint[]
}

type WorkoutTrend = "up" | "down" | "steady"

type ProgramWorkout = {
  id: string
  dateKey: string
  title: string
  dateLabel: string
  duration: string
  volume: string
  trend: WorkoutTrend
  changeLabel: string
  monthLabel: string
  exercises: WorkoutExercise[]
}

type ProgramWorkoutExerciseEntry = WorkoutExercise & {
  entryId: string
  workoutId: string
  workoutTitle: string
  workoutDateLabel: string
  monthLabel: string
}

const exerciseHistoryChartConfig = {
  weight: {
    label: "Weight",
    color: "#2563eb",
  },
  reps: {
    label: "Reps",
    color: "#8b5cf6",
  },
} satisfies ChartConfig

const programWorkouts: ProgramWorkout[] = [
  {
    id: "upper-a-0318",
    dateKey: "2026-03-18",
    title: "Upper A",
    dateLabel: "Sre, 18. mar - 17:30",
    duration: "42 min",
    volume: "1.7k kg",
    trend: "up",
    changeLabel: "+3%",
    monthLabel: "Marec - 2026",
    exercises: [
      {
        id: "db-bench",
        name: "Dumbbell Bench Press",
        currentSets: [
          { set: 1, weight: 30, reps: 10 },
          { set: 2, weight: 30, reps: 9 },
          { set: 3, weight: 30, reps: 8 },
        ],
        history: [
          { date: "04 Mar", weight: 26, reps: 12 },
          { date: "08 Mar", weight: 28, reps: 11 },
          { date: "12 Mar", weight: 28, reps: 10 },
          { date: "18 Mar", weight: 30, reps: 10 },
        ],
      },
      {
        id: "incline-bench",
        name: "Barbell Incline Bench Press",
        currentSets: [
          { set: 1, weight: 55, reps: 8 },
          { set: 2, weight: 55, reps: 8 },
          { set: 3, weight: 50, reps: 10 },
        ],
        history: [
          { date: "04 Mar", weight: 45, reps: 10 },
          { date: "08 Mar", weight: 50, reps: 9 },
          { date: "12 Mar", weight: 52.5, reps: 8 },
          { date: "18 Mar", weight: 55, reps: 8 },
        ],
      },
      {
        id: "lateral-raise",
        name: "Dumbbell Seated Lateral Raise",
        currentSets: [
          { set: 1, weight: 9, reps: 14 },
          { set: 2, weight: 9, reps: 13 },
          { set: 3, weight: 8, reps: 15 },
        ],
        history: [
          { date: "04 Mar", weight: 7, reps: 15 },
          { date: "08 Mar", weight: 8, reps: 14 },
          { date: "12 Mar", weight: 8, reps: 14 },
          { date: "18 Mar", weight: 9, reps: 14 },
        ],
      },
      {
        id: "crossover",
        name: "Cable Standing Crossover",
        currentSets: [
          { set: 1, weight: 20, reps: 12 },
          { set: 2, weight: 20, reps: 12 },
          { set: 3, weight: 20, reps: 11 },
        ],
        history: [
          { date: "04 Mar", weight: 16, reps: 14 },
          { date: "08 Mar", weight: 18, reps: 13 },
          { date: "12 Mar", weight: 18, reps: 12 },
          { date: "18 Mar", weight: 20, reps: 12 },
        ],
      },
    ],
  },
  {
    id: "lower-a-0315",
    dateKey: "2026-03-15",
    title: "Lower A",
    dateLabel: "Ned, 15. mar - 10:00",
    duration: "55 min",
    volume: "2.3k kg",
    trend: "steady",
    changeLabel: "Steady",
    monthLabel: "Marec - 2026",
    exercises: [
      {
        id: "back-squat",
        name: "Back Squat",
        currentSets: [
          { set: 1, weight: 90, reps: 6 },
          { set: 2, weight: 90, reps: 6 },
          { set: 3, weight: 85, reps: 8 },
        ],
        history: [
          { date: "02 Mar", weight: 85, reps: 8 },
          { date: "08 Mar", weight: 87.5, reps: 7 },
          { date: "12 Mar", weight: 90, reps: 6 },
          { date: "15 Mar", weight: 90, reps: 6 },
        ],
      },
      {
        id: "rdl",
        name: "Romanian Deadlift",
        currentSets: [
          { set: 1, weight: 80, reps: 8 },
          { set: 2, weight: 80, reps: 8 },
          { set: 3, weight: 75, reps: 10 },
        ],
        history: [
          { date: "02 Mar", weight: 70, reps: 10 },
          { date: "08 Mar", weight: 75, reps: 9 },
          { date: "12 Mar", weight: 80, reps: 8 },
          { date: "15 Mar", weight: 80, reps: 8 },
        ],
      },
      {
        id: "leg-press",
        name: "Leg Press",
        currentSets: [
          { set: 1, weight: 150, reps: 12 },
          { set: 2, weight: 150, reps: 12 },
          { set: 3, weight: 140, reps: 14 },
        ],
        history: [
          { date: "02 Mar", weight: 130, reps: 15 },
          { date: "08 Mar", weight: 140, reps: 14 },
          { date: "12 Mar", weight: 145, reps: 12 },
          { date: "15 Mar", weight: 150, reps: 12 },
        ],
      },
    ],
  },
  {
    id: "upper-b-0309",
    dateKey: "2026-03-09",
    title: "Upper B",
    dateLabel: "Pon, 09. mar - 18:10",
    duration: "47 min",
    volume: "1.6k kg",
    trend: "down",
    changeLabel: "-1%",
    monthLabel: "Marec - 2026",
    exercises: [
      {
        id: "lat-pulldown",
        name: "Lat Pulldown",
        currentSets: [
          { set: 1, weight: 55, reps: 10 },
          { set: 2, weight: 55, reps: 9 },
          { set: 3, weight: 50, reps: 11 },
        ],
        history: [
          { date: "21 Feb", weight: 50, reps: 12 },
          { date: "28 Feb", weight: 52.5, reps: 11 },
          { date: "05 Mar", weight: 55, reps: 10 },
          { date: "09 Mar", weight: 55, reps: 10 },
        ],
      },
      {
        id: "row",
        name: "Chest Supported Row",
        currentSets: [
          { set: 1, weight: 28, reps: 12 },
          { set: 2, weight: 28, reps: 12 },
          { set: 3, weight: 26, reps: 14 },
        ],
        history: [
          { date: "21 Feb", weight: 24, reps: 14 },
          { date: "28 Feb", weight: 26, reps: 13 },
          { date: "05 Mar", weight: 28, reps: 12 },
          { date: "09 Mar", weight: 28, reps: 12 },
        ],
      },
      {
        id: "bicep-curl",
        name: "Incline Bicep Curl",
        currentSets: [
          { set: 1, weight: 12, reps: 10 },
          { set: 2, weight: 12, reps: 10 },
          { set: 3, weight: 10, reps: 12 },
        ],
        history: [
          { date: "21 Feb", weight: 10, reps: 12 },
          { date: "28 Feb", weight: 10, reps: 12 },
          { date: "05 Mar", weight: 12, reps: 10 },
          { date: "09 Mar", weight: 12, reps: 10 },
        ],
      },
    ],
  },
  {
    id: "lower-b-0226",
    dateKey: "2026-02-26",
    title: "Lower B",
    dateLabel: "Cet, 26. feb - 16:50",
    duration: "51 min",
    volume: "2.1k kg",
    trend: "up",
    changeLabel: "+1%",
    monthLabel: "Februar - 2026",
    exercises: [
      {
        id: "front-squat",
        name: "Front Squat",
        currentSets: [
          { set: 1, weight: 65, reps: 8 },
          { set: 2, weight: 65, reps: 8 },
          { set: 3, weight: 60, reps: 10 },
        ],
        history: [
          { date: "05 Feb", weight: 55, reps: 10 },
          { date: "12 Feb", weight: 60, reps: 9 },
          { date: "19 Feb", weight: 62.5, reps: 8 },
          { date: "26 Feb", weight: 65, reps: 8 },
        ],
      },
      {
        id: "hip-thrust",
        name: "Barbell Hip Thrust",
        currentSets: [
          { set: 1, weight: 100, reps: 10 },
          { set: 2, weight: 100, reps: 10 },
          { set: 3, weight: 95, reps: 12 },
        ],
        history: [
          { date: "05 Feb", weight: 85, reps: 12 },
          { date: "12 Feb", weight: 90, reps: 12 },
          { date: "19 Feb", weight: 95, reps: 11 },
          { date: "26 Feb", weight: 100, reps: 10 },
        ],
      },
      {
        id: "hamstring-curl",
        name: "Seated Hamstring Curl",
        currentSets: [
          { set: 1, weight: 40, reps: 12 },
          { set: 2, weight: 40, reps: 12 },
          { set: 3, weight: 35, reps: 14 },
        ],
        history: [
          { date: "05 Feb", weight: 32, reps: 15 },
          { date: "12 Feb", weight: 35, reps: 14 },
          { date: "19 Feb", weight: 37.5, reps: 12 },
          { date: "26 Feb", weight: 40, reps: 12 },
        ],
      },
    ],
  },
]

function getTrendBadgeClassName(trend: WorkoutTrend) {
  if (trend === "up") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700"
  }

  if (trend === "down") {
    return "border-rose-200 bg-rose-50 text-rose-700"
  }

  return "border-neutral-200 bg-neutral-100 text-neutral-600"
}

function getGroupedWorkouts() {
  return programWorkouts.reduce<Record<string, ProgramWorkout[]>>((groups, workout) => {
    if (!groups[workout.monthLabel]) {
      groups[workout.monthLabel] = []
    }

    groups[workout.monthLabel].push(workout)
    return groups
  }, {})
}

const historyWeekdayLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const

function addCalendarDays(date: Date, amount: number) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + amount)
  return nextDate
}

function getHistoryStartOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function getHistoryEndOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function getHistoryStartOfWeek(date: Date) {
  const day = date.getDay()
  const offset = day === 0 ? -6 : 1 - day
  return addCalendarDays(date, offset)
}

function getHistoryEndOfWeek(date: Date) {
  return addCalendarDays(getHistoryStartOfWeek(date), 6)
}

function toHistoryDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function buildHistoryMonthDates(date: Date) {
  const monthStart = getHistoryStartOfMonth(date)
  const monthEnd = getHistoryEndOfMonth(date)
  const calendarStart = getHistoryStartOfWeek(monthStart)
  const calendarEnd = getHistoryEndOfWeek(monthEnd)

  const dates: Date[] = []
  for (
    let cursor = calendarStart;
    toHistoryDateKey(cursor) <= toHistoryDateKey(calendarEnd);
    cursor = addCalendarDays(cursor, 1)
  ) {
    dates.push(cursor)
  }

  return dates
}

function getHistoryVisibleMonth() {
  const latestWorkout = [...programWorkouts].sort((left, right) =>
    right.dateKey.localeCompare(left.dateKey)
  )[0]

  return getHistoryStartOfMonth(
    latestWorkout ? new Date(`${latestWorkout.dateKey}T00:00:00`) : new Date(2026, 2, 1)
  )
}

function getWorkoutById(workoutId: string) {
  return programWorkouts.find((workout) => workout.id === workoutId)
}

function getWorkoutExerciseEntries(
  workouts: ProgramWorkout[]
): ProgramWorkoutExerciseEntry[] {
  return workouts.flatMap((workout) =>
    workout.exercises.map((exercise) => ({
      ...exercise,
      entryId: `${workout.id}-${exercise.id}`,
      workoutId: workout.id,
      workoutTitle: workout.title,
      workoutDateLabel: workout.dateLabel,
      monthLabel: workout.monthLabel,
    }))
  )
}

function useProgramsPeriodPickerState(
  initialDate?: Date,
  onConfirm?: (selection: HabitPeriodSelection) => void
) {
  const currentYear = new Date().getFullYear()
  const baseDate = initialDate ?? new Date(2026, 2, 18)
  const [period, setPeriod] = React.useState<HabitPeriod>("month")
  const [value, setValue] = React.useState<Date>(() => getMonthStart(baseDate))
  const [weekRange, setWeekRange] = React.useState<DateRange | undefined>(() => ({
    from: getWeekStart(baseDate),
    to: getWeekEnd(baseDate),
  }))
  const [customRange, setCustomRange] = React.useState<DateRange | undefined>(() => ({
    from: new Date(2026, 2, 5),
    to: new Date(2026, 2, 18),
  }))

  const availableYears = React.useMemo(
    () => Array.from({ length: 8 }, (_, index) => currentYear - 2 + index),
    [currentYear]
  )

  return {
    period,
    onPeriodChange: setPeriod,
    value,
    onChange: setValue,
    weekRange,
    onWeekRangeChange: setWeekRange,
    customRange,
    onCustomRangeChange: setCustomRange,
    availableYears,
    onConfirm,
  }
}

function ProgramWorkoutCard({
  workout,
  active = false,
  compact = false,
  onClick,
}: {
  workout: ProgramWorkout
  active?: boolean
  compact?: boolean
  onClick?: () => void
}) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div
            className={cn(
              "font-semibold text-neutral-950",
              compact ? "text-[14px]" : "text-[16px]"
            )}
          >
            {workout.title}
          </div>
          <div
            className={cn(
              "text-neutral-500",
              compact ? "mt-1 text-[11px]" : "mt-2 text-[13px]"
            )}
          >
            {workout.dateLabel}
          </div>
        </div>
        <div className={cn("text-neutral-300", compact && "text-[12px]")}>{">"}</div>
      </div>

      <div
        className={cn(
          "grid grid-cols-[1fr_1fr_auto] items-end",
          compact ? "mt-3 gap-2" : "mt-4 gap-3"
        )}
      >
        <div className={cn("border-r border-neutral-200", compact ? "pr-2" : "pr-3")}>
          <div
            className={cn(
              "font-medium uppercase tracking-[0.08em] text-neutral-400",
              compact ? "text-[10px]" : "text-[11px]"
            )}
          >
            Duration
          </div>
          <div
            className={cn(
              "mt-1 font-semibold text-neutral-950",
              compact ? "text-[13px]" : "text-[14px]"
            )}
          >
            {workout.duration}
          </div>
        </div>
        <div>
          <div
            className={cn(
              "font-medium uppercase tracking-[0.08em] text-neutral-400",
              compact ? "text-[10px]" : "text-[11px]"
            )}
          >
            Volume
          </div>
          <div
            className={cn(
              "mt-1 font-semibold text-neutral-950",
              compact ? "text-[13px]" : "text-[14px]"
            )}
          >
            {workout.volume}
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            compact
              ? "rounded-md px-2 py-0.5 text-[11px] font-medium"
              : "rounded-md px-2.5 py-1 text-[12px] font-medium",
            getTrendBadgeClassName(workout.trend)
          )}
        >
          {workout.trend === "up" ? (
            <TrendingUp className={cn("mr-1", compact ? "size-3" : "size-3.5")} />
          ) : workout.trend === "down" ? (
            <TrendingDown className={cn("mr-1", compact ? "size-3" : "size-3.5")} />
          ) : null}
          {workout.changeLabel}
        </Badge>
      </div>
    </>
  )

  const className = cn(
    "w-full rounded-2xl border text-left shadow-[0_1px_2px_rgba(17,24,39,0.05)] transition-colors",
    compact ? "px-3 py-2.5" : "px-5 py-4",
    active
      ? "border-brand-500 bg-brand-500/10"
      : "border-neutral-200 bg-white hover:bg-neutral-50"
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    )
  }

  return <div className={className}>{content}</div>
}

function ProgramWorkoutsList({
  onSelectWorkout,
  centered = false,
}: {
  onSelectWorkout?: (workoutId: string) => void
  centered?: boolean
}) {
  const groupedWorkouts = React.useMemo(() => getGroupedWorkouts(), [])

  return (
    <div className={cn("space-y-5", centered && "mx-auto max-w-[430px]")}>
      {Object.entries(groupedWorkouts).map(([monthLabel, workouts]) => (
        <div key={monthLabel} className="space-y-2.5">
          <div className="px-1 text-[12px] font-medium text-neutral-500">{monthLabel}</div>

          <div className="space-y-3">
            {workouts.map((workout) => (
              <ProgramWorkoutCard
                key={workout.id}
                workout={workout}
                onClick={
                  onSelectWorkout ? () => onSelectWorkout(workout.id) : undefined
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function useExerciseExplorerState(exercises: ProgramWorkoutExerciseEntry[]) {
  const [selectedMetric, setSelectedMetric] = React.useState<"weight" | "reps">(
    "weight"
  )
  const [exerciseSearch, setExerciseSearch] = React.useState("")
  const [selectedExerciseId, setSelectedExerciseId] = React.useState(
    exercises[0]?.entryId ?? ""
  )

  const filteredExercises = React.useMemo(() => {
    return exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(exerciseSearch.toLowerCase())
    )
  }, [exerciseSearch, exercises])

  React.useEffect(() => {
    if (!filteredExercises.some((exercise) => exercise.entryId === selectedExerciseId)) {
      setSelectedExerciseId(filteredExercises[0]?.entryId ?? exercises[0]?.entryId ?? "")
    }
  }, [exercises, filteredExercises, selectedExerciseId])

  const selectedExercise =
    filteredExercises.find((exercise) => exercise.entryId === selectedExerciseId) ??
    exercises[0]

  return {
    selectedMetric,
    setSelectedMetric,
    exerciseSearch,
    setExerciseSearch,
    filteredExercises,
    selectedExercise,
    selectedExerciseId,
    setSelectedExerciseId,
  }
}

function ExerciseExplorer({
  exercises,
  rightTopContent,
}: {
  exercises: ProgramWorkoutExerciseEntry[]
  rightTopContent?: React.ReactNode
}) {
  const {
    selectedMetric,
    setSelectedMetric,
    exerciseSearch,
    setExerciseSearch,
    filteredExercises,
    selectedExercise,
    selectedExerciseId,
    setSelectedExerciseId,
  } = useExerciseExplorerState(exercises)

  if (!selectedExercise) {
    return null
  }

  return (
    <div className="grid gap-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 xl:grid-cols-[300px_minmax(0,1fr)]">
      <div className="border-r border-neutral-200 bg-white p-3">
        <div className="relative">
          <Input
            value={exerciseSearch}
            onChange={(event) => setExerciseSearch(event.target.value)}
            placeholder="Search exercise"
            className="h-10 rounded-sm border-neutral-200 bg-white pl-10 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
          />
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
        </div>

        <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-white">
          {filteredExercises.map((exercise) => (
            <button
              key={exercise.entryId}
              type="button"
              onClick={() => setSelectedExerciseId(exercise.entryId)}
              className={cn(
                "flex w-full items-center justify-between border-b border-neutral-200 px-4 py-4 text-left last:border-b-0",
                exercise.entryId === selectedExercise.entryId
                  ? "bg-brand-50 text-brand-700"
                  : "bg-white text-neutral-800 hover:bg-neutral-50"
              )}
            >
              <span className="text-[15px] font-medium">{exercise.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="min-w-0 space-y-4 bg-neutral-50 p-3">
        {rightTopContent}

        <Card className="rounded-xl border-neutral-200 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-[16px] font-semibold text-neutral-950">
                  {selectedExercise.name}
                </CardTitle>
                <div className="mt-1 text-[13px] text-neutral-500">
                  {selectedExercise.workoutTitle} - {selectedExercise.workoutDateLabel}
                </div>
              </div>

              <div className="inline-flex rounded-sm border border-neutral-200 bg-white p-0.5 shadow-none">
                {(["weight", "reps"] as const).map((metric) => (
                  <Button
                    key={metric}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMetric(metric)}
                    className={cn(
                      "rounded-sm px-4 text-[13px] font-medium capitalize shadow-none",
                      selectedMetric === metric
                        ? "bg-neutral-100 text-neutral-950"
                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
                    )}
                  >
                    {metric}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer
              config={exerciseHistoryChartConfig}
              className="h-[360px] w-full"
            >
              <LineChart
                data={selectedExercise.history}
                margin={{ left: 12, right: 16, top: 8, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  fontSize={12}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  fontSize={12}
                  width={40}
                />
                <ChartTooltip
                  cursor={{ stroke: "#a3a3a3", strokeWidth: 1 }}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={
                    selectedMetric === "weight"
                      ? "var(--color-weight)"
                      : "var(--color-reps)"
                  }
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#ffffff", strokeWidth: 2 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-neutral-200 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
            <div>
              <CardTitle className="text-[16px] font-semibold text-neutral-950">
                {selectedExercise.workoutTitle}
              </CardTitle>
              <div className="mt-1 text-[13px] text-neutral-500">
                Current workout sets
              </div>
            </div>
            <div className="text-[13px] text-neutral-500">
              {selectedExercise.workoutDateLabel}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-24">Set</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Reps</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedExercise.currentSets.map((setRow) => (
                    <TableRow key={`${selectedExercise.entryId}-${setRow.set}`}>
                      <TableCell className="font-medium">{setRow.set}</TableCell>
                      <TableCell>{setRow.weight}</TableCell>
                      <TableCell>{setRow.reps}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function ProgramsPeriodPicker({
  onConfirm,
}: {
  onConfirm?: (selection: HabitPeriodSelection) => void
}) {
  const pickerProps = useProgramsPeriodPickerState(undefined, onConfirm)

  return <HabitPeriodPicker {...pickerProps} />
}

export function ProgramTypeDialog({
  value,
  onValueChange,
  triggerClassName,
}: {
  value: "calendar" | "fixed"
  onValueChange: (value: "calendar" | "fixed") => void
  triggerClassName?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [selectedType, setSelectedType] = React.useState<"calendar" | "fixed">(value)

  React.useEffect(() => {
    if (open) {
      setSelectedType(value)
    }
  }, [open, value])

  const options = [
    {
      id: "calendar" as const,
      title: "Calendar",
      description:
        "Schedule workouts on specific dates. Ideal for clients needing daily structure.",
      icon: CalendarDays,
      cardClassName: "bg-linear-to-br from-amber-50 to-orange-50",
      mockupClassName:
        "bg-white shadow-[0_18px_44px_rgba(15,23,42,0.14)] border border-neutral-200",
    },
    {
      id: "fixed" as const,
      title: "Fixed",
      description:
        "Create fixed programs clients can follow at their own pace with no dates.",
      icon: LayoutGrid,
      cardClassName: "bg-linear-to-br from-sky-50 to-indigo-50",
      mockupClassName:
        "bg-linear-to-br from-sky-900 via-sky-700 to-cyan-500 text-white shadow-[0_18px_44px_rgba(14,116,144,0.28)]",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline" className={triggerClassName}>
          <LayoutGrid className="size-4" />
          Program Type
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden rounded-xl border-neutral-200 p-0 shadow-xl sm:max-w-[820px]"
      >
        <DialogHeader className="border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold text-neutral-950">
              <LayoutGrid className="size-4 text-neutral-500" />
              Program Type
            </DialogTitle>
            <DialogClose asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-10 rounded-md border-brand-200 text-neutral-500 shadow-none hover:bg-neutral-50 hover:text-neutral-900"
              >
                <X className="size-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
          {options.map((option) => {
            const Icon = option.icon
            const isSelected = selectedType === option.id

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedType(option.id)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-all",
                  isSelected
                    ? "border-brand-500 bg-brand-50/30"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
                )}
              >
                <div
                  className={cn(
                    "relative mb-4 h-64 overflow-hidden rounded-2xl border border-white/60 p-5",
                    option.cardClassName
                  )}
                >
                  <div
                    className={cn(
                      "absolute left-1/2 top-5 h-48 w-44 -translate-x-1/2 rounded-[1.65rem] p-3",
                      option.mockupClassName
                    )}
                  >
                    {option.id === "calendar" ? (
                      <div className="space-y-3 text-neutral-900">
                        <div className="flex items-center justify-between text-[10px] font-medium text-neutral-500">
                          <span>Current Week</span>
                          <span className="text-brand-600">View All</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-[9px] text-neutral-400">
                          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                            <div key={`${option.id}-${day}-${index}`} className="rounded-md bg-neutral-100 py-1">
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="rounded-2xl bg-linear-to-br from-fuchsia-200 via-rose-200 to-orange-100 p-3 text-white shadow-sm">
                          <div className="h-16 rounded-xl bg-black/10" />
                          <div className="mt-3 text-[11px] font-semibold">Glutes & Hamstrings Blast</div>
                          <div className="mt-2 flex items-center gap-2 text-[8px] font-medium uppercase tracking-wide text-white/80">
                            <span className="rounded-full bg-white/20 px-2 py-1">11 Exercises</span>
                            <span className="rounded-full bg-white/20 px-2 py-1">Not Started</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="ml-auto h-3 w-14 rounded-full bg-white/20" />
                        <div className="rounded-2xl bg-black/20 p-4 backdrop-blur-[2px]">
                          <div className="h-16 rounded-xl bg-white/10" />
                          <div className="mt-4 text-[16px] font-semibold">Push / Pull / Legs</div>
                          <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-wide text-white/80">
                            <span>3 Workouts</span>
                            <span className="rounded-full bg-white/15 px-2 py-1">New</span>
                          </div>
                        </div>
                        <div className="ml-10 rounded-2xl bg-white/70 p-3 text-[11px] text-neutral-700 shadow-sm">
                          Running Program
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Icon
                    className={cn(
                      "mt-0.5 size-4",
                      isSelected ? "text-brand-600" : "text-neutral-500"
                    )}
                  />
                  <div>
                    <div
                      className={cn(
                        "text-[14px] font-semibold",
                        isSelected ? "text-brand-600" : "text-neutral-900"
                      )}
                    >
                      {option.title}
                    </div>
                    <div className="mt-2 text-[13px] leading-6 text-neutral-600">
                      {option.description}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <DialogFooter className="border-t border-neutral-200 px-6 py-4 sm:justify-between">
          <DialogClose asChild>
            <Button variant="ghost" className="px-0 text-neutral-700 shadow-none">
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={() => {
              onValueChange(selectedType)
              setOpen(false)
            }}
          >
            Switch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const addProgramTabTriggerClassName =
  "relative top-[2px] -mb-[6px] h-auto flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 py-2 text-[13px] font-normal text-neutral-500 shadow-none after:hidden hover:text-neutral-700 data-[state=active]:border-brand-500 data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none"

export function AddProgramDialog({
  triggerClassName,
  trigger,
}: {
  triggerClassName?: string
  trigger?: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("new")
  const [programName, setProgramName] = React.useState("")
  const [programDescription, setProgramDescription] = React.useState("")
  const [selectedProgramId, setSelectedProgramId] = React.useState("full-body")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" className={triggerClassName}>
            <Plus className="size-4" />
            Program
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[680px] rounded-sm p-0">
        <DialogHeader className="border-b border-neutral-200 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold">
            <Dumbbell className="size-4 text-neutral-500" />
            Add Program
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0">
          <div className="border-b border-neutral-200 px-6">
            <TabsList className="h-auto gap-6 rounded-none bg-transparent p-0">
              <TabsTrigger value="new" className={addProgramTabTriggerClassName}>
                New Program
              </TabsTrigger>
              <TabsTrigger value="library" className={addProgramTabTriggerClassName}>
                Program Library
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="new" className="mt-0 space-y-0">
            <div className="space-y-5 px-6 py-5">
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-neutral-700">
                  Program Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={programName}
                  onChange={(event) => setProgramName(event.target.value)}
                  placeholder="Name of the program e.g. Full Body Workout"
                  className="h-10 rounded-sm border-neutral-200 bg-white shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-neutral-700">
                  Program Description
                </Label>
                <textarea
                  value={programDescription}
                  onChange={(event) => setProgramDescription(event.target.value)}
                  placeholder="Enter any additional info"
                  className="min-h-[120px] w-full rounded-sm border border-neutral-200 bg-white px-3 py-2.5 text-[14px] text-neutral-900 shadow-none outline-none placeholder:text-neutral-400 focus:border-neutral-300"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="library" className="mt-0 space-y-0">
            <div className="space-y-5 px-6 py-5">
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                <div className="grid grid-cols-[minmax(0,1fr)_120px] items-center border-b border-neutral-200 px-4 py-3 text-[13px] font-medium text-neutral-700">
                  <div>Program</div>
                  <div className="flex items-center justify-end gap-3">
                    <Search className="size-4 text-neutral-400" />
                    <span>Tags</span>
                    <Filter className="size-4 text-neutral-400" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProgramId("full-body")}
                  className={cn(
                    "grid w-full grid-cols-[minmax(0,1fr)_120px] items-center px-4 py-4 text-left transition-colors",
                    selectedProgramId === "full-body"
                      ? "bg-brand-50"
                      : "bg-white hover:bg-neutral-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-4 items-center justify-center rounded-full border-2",
                        selectedProgramId === "full-body"
                          ? "border-brand-600"
                          : "border-neutral-300"
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          selectedProgramId === "full-body"
                            ? "bg-brand-600"
                            : "bg-transparent"
                        )}
                      />
                    </span>
                    <span className="text-[15px] font-medium text-neutral-950">
                      Full Body (Sample)
                    </span>
                  </div>
                  <div className="text-right text-[13px] text-neutral-500">Starter</div>
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="border-t border-neutral-200 px-6 py-4 sm:justify-between">
          <DialogClose asChild>
            <Button variant="ghost" className="px-0 text-neutral-700 shadow-none">
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={() => setOpen(false)}
            disabled={
              activeTab === "new" ? programName.trim().length === 0 : !selectedProgramId
            }
          >
            {activeTab === "new" ? "Add Program" : "Import Program"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type FixedProgramBuilderExercise = {
  id: string
  name: string
  note: string
  fields: string[]
  values: string[]
}

type FixedProgramBuilderSection = {
  id: string
  title: string
  note: string
  tone?: "dark" | "light"
  exercises: FixedProgramBuilderExercise[]
}

type FixedProgramBuilderWorkout = {
  id: string
  label: string
  intro: string
  sections: FixedProgramBuilderSection[]
}

type FixedProgramEditorProgram = {
  id: string
  title: string
  description: string
  workouts: string[]
  editorWorkouts: FixedProgramBuilderWorkout[]
}

const fixedProgramExerciseLibrary = [
  "Barbell Bench Press",
  "Bodyweight Half Squat",
  "Bodyweight Squat",
  "Dumbbell Standing Biceps Curl",
  "Push-up",
  "Run",
  "Run on Treadmill",
  "Squat",
  "Walking",
  "Walking on Treadmill",
  "Arm Circles",
  "Bar Biceps Curl",
]

const fixedPrograms: FixedProgramEditorProgram[] = [
  {
    id: "empty-program",
    title: "aa",
    description: "aaa",
    workouts: [],
    editorWorkouts: [],
  },
  {
    id: "full-body-sample",
    title: "Full Body (Sample)",
    workouts: ["Chest & Shoulder", "Back", "Arms", "Legs"],
    description:
      "This 4-day program will help intermediate and advanced trainees gain size and strength. Rest-pause sets, drop sets, and creative unilateral work are included.",
    editorWorkouts: [
      {
        id: "chest-shoulder",
        label: "Chest & Shoulder",
        intro:
          "Start your week with a chest workout that includes a variety of exercises. This workout is designed to target all areas of your chest, including the upper, lower, and middle portions.",
        sections: [
          {
            id: "warmup",
            title: "Warmup",
            tone: "dark",
            note:
              "Start your workout with a warmup to get your blood flowing and your muscles ready for the workout.",
            exercises: [
              {
                id: "jumping-jack",
                name: "Jumping Jack",
                note: "Add a custom note for this exercise",
                fields: ["Sets", "Time", "(Optional)", "(Optional)", "(Optional)"],
                values: ["1", "30", "", "", ""],
              },
              {
                id: "arm-circles",
                name: "Arm Circles",
                note: "Add a custom note for this exercise",
                fields: ["Sets", "Time", "(Optional)", "(Optional)", "(Optional)"],
                values: ["1", "30", "", "", ""],
              },
            ],
          },
        ],
      },
      {
        id: "back",
        label: "Back",
        intro:
          "This back session balances vertical and horizontal pulling with enough warmup volume to keep the shoulders healthy.",
        sections: [],
      },
      {
        id: "arms",
        label: "Arms",
        intro:
          "Use this arm day to focus on controlled reps, elbow-friendly tempos and consistent pump work.",
        sections: [],
      },
      {
        id: "legs",
        label: "Legs",
        intro:
          "A lower body session focused on squat patterns, hinge work and stable progression from week to week.",
        sections: [],
      },
    ],
  },
]

export function getFixedProgramEditorProgram(
  programId: string,
  title: string
): FixedProgramEditorProgram {
  const existingProgram = fixedPrograms.find((program) => program.id === programId)

  if (existingProgram) {
    return existingProgram
  }

  return {
    id: programId,
    title,
    description: `Build and organize the ${title} program with custom workouts and exercises.`,
    workouts: [],
    editorWorkouts: [],
  }
}

function createFixedBuilderExercise(exerciseName: string): FixedProgramBuilderExercise {
  return {
    id: `${exerciseName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    name: exerciseName,
    note: "Add a custom note for this exercise",
    fields: ["Sets", "Reps", "Rest", "(Optional)", "(Optional)"],
    values: ["3", "10", "01:30", "", ""],
  }
}

function createFixedBuilderSection(
  exerciseName: string
): FixedProgramBuilderSection {
  return {
    id: `main-block-${Math.random().toString(36).slice(2, 8)}`,
    title: "Main Block",
    tone: "light",
    note: "Drag more exercises here or add a custom note for this block.",
    exercises: [createFixedBuilderExercise(exerciseName)],
  }
}

function createFixedBuilderWorkout(
  exerciseName: string
): FixedProgramBuilderWorkout {
  return {
    id: `workout-${Math.random().toString(36).slice(2, 8)}`,
    label: "Workout 1",
    intro:
      "Build your workout by dragging exercises from the left panel into this program.",
    sections: [createFixedBuilderSection(exerciseName)],
  }
}

function cloneFixedProgramBuilderWorkouts(
  workouts: FixedProgramBuilderWorkout[]
): FixedProgramBuilderWorkout[] {
  return workouts.map((workout) => ({
    ...workout,
    sections: workout.sections.map((section) => ({
      ...section,
      exercises: section.exercises.map((exercise) => ({
        ...exercise,
        fields: [...exercise.fields],
        values: [...exercise.values],
      })),
    })),
  }))
}

function AddWorkoutDialog({
  trigger,
}: {
  trigger: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("new")
  const [workoutName, setWorkoutName] = React.useState("")
  const [workoutDescription, setWorkoutDescription] = React.useState("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[700px] rounded-sm p-0">
        <DialogHeader className="border-b border-neutral-200 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold">
            <Dumbbell className="size-4 text-neutral-500" />
            Add Workout
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0">
          <div className="border-b border-neutral-200 px-6">
            <TabsList className="h-auto gap-8 rounded-none bg-transparent p-0">
              <TabsTrigger value="new" className={addProgramTabTriggerClassName}>
                New Workout
              </TabsTrigger>
              <TabsTrigger value="library" className={addProgramTabTriggerClassName}>
                Workout Library
              </TabsTrigger>
              <TabsTrigger value="ai" className={addProgramTabTriggerClassName}>
                <span className="inline-flex items-center gap-1">
                  HubFit AI
                  <Sparkles className="size-3 text-neutral-500" />
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="new" className="mt-0 space-y-0">
            <div className="space-y-5 px-6 py-5">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_60px]">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-neutral-700">
                      Workout Name <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      value={workoutName}
                      onChange={(event) => setWorkoutName(event.target.value)}
                      placeholder="Name of the workout e.g. Chest"
                      className="h-10 rounded-sm border-neutral-200 bg-white shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-neutral-700">
                      Workout Description
                    </Label>
                    <textarea
                      value={workoutDescription}
                      onChange={(event) => setWorkoutDescription(event.target.value)}
                      placeholder="Enter any additional info"
                      className="min-h-[96px] w-full rounded-sm border border-neutral-200 bg-white px-3 py-2.5 text-[14px] text-neutral-900 shadow-none outline-none placeholder:text-neutral-400 focus:border-neutral-300"
                    />
                  </div>
                </div>

                <div className="h-[56px] rounded-xl bg-linear-to-br from-brand-500 to-brand-700" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="library" className="mt-0 space-y-0">
            <div className="space-y-4 px-6 py-5">
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                <div className="grid grid-cols-[minmax(0,1fr)_150px] items-center border-b border-neutral-200 px-4 py-3 text-[13px] font-medium text-neutral-700">
                  <div>Workout</div>
                  <div className="flex items-center justify-end gap-3">
                    <Search className="size-4 text-neutral-400" />
                    <span>Tags</span>
                  </div>
                </div>
                <div className="px-4 py-4 text-[15px] text-neutral-950">
                  Full Body (Sample)
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="mt-0 space-y-0">
            <div className="space-y-5 px-6 py-5">
              <div className="space-y-2">
                <Label className="text-[13px] font-medium text-neutral-700">
                  Workout Prompt <span className="text-rose-500">*</span>
                </Label>
                <textarea
                  placeholder="Describe the workout you want to generate."
                  className="min-h-[120px] w-full rounded-sm border border-neutral-200 bg-white px-3 py-2.5 text-[14px] text-neutral-900 shadow-none outline-none placeholder:text-neutral-400 focus:border-neutral-300"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="border-t border-neutral-200 px-6 py-4 sm:justify-between">
          <DialogClose asChild>
            <Button variant="ghost" className="px-0 text-neutral-700 shadow-none">
              Close
            </Button>
          </DialogClose>
          <Button onClick={() => setOpen(false)}>
            {activeTab === "library" ? "Import Workout" : "Add Workout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function FixedProgramEditorBuilder({
  program,
  isActive = true,
  footer,
}: {
  program: FixedProgramEditorProgram
  isActive?: boolean
  footer?: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const [editorWorkouts, setEditorWorkouts] = React.useState(() =>
    cloneFixedProgramBuilderWorkouts(program.editorWorkouts)
  )
  const [activeWorkoutId, setActiveWorkoutId] = React.useState(
    program.editorWorkouts[0]?.id ?? ""
  )
  const [draggedExerciseName, setDraggedExerciseName] = React.useState<string | null>(
    null
  )
  const [isCanvasDragOver, setIsCanvasDragOver] = React.useState(false)

  React.useEffect(() => {
    if (!isActive) {
      return
    }

    const nextWorkouts = cloneFixedProgramBuilderWorkouts(program.editorWorkouts)
    setEditorWorkouts(nextWorkouts)
    setActiveWorkoutId(nextWorkouts[0]?.id ?? "")
    setDraggedExerciseName(null)
    setIsCanvasDragOver(false)
  }, [isActive, program.id, program.editorWorkouts])

  const activeWorkout =
    editorWorkouts.find((workout) => workout.id === activeWorkoutId) ?? editorWorkouts[0]

  const appendExerciseToProgram = React.useCallback(
    (exerciseName: string) => {
      const nextExercise = createFixedBuilderExercise(exerciseName)

      setEditorWorkouts((previousWorkouts) => {
        if (previousWorkouts.length === 0) {
          const firstWorkout = createFixedBuilderWorkout(exerciseName)
          setActiveWorkoutId(firstWorkout.id)
          return [firstWorkout]
        }

        return previousWorkouts.map((workout, workoutIndex) => {
          if (workout.id !== activeWorkoutId && !(workoutIndex === 0 && !activeWorkoutId)) {
            return workout
          }

          const targetSectionIndex = workout.sections.findIndex(
            (section) => section.tone !== "dark"
          )

          const sections =
            workout.sections.length === 0
              ? [createFixedBuilderSection(exerciseName)]
              : targetSectionIndex === -1
                ? [...workout.sections, createFixedBuilderSection(exerciseName)]
                : workout.sections.map((section, sectionIndex) =>
                    sectionIndex === targetSectionIndex
                      ? {
                          ...section,
                          exercises: [...section.exercises, nextExercise],
                        }
                      : section
                  )

          return {
            ...workout,
            sections,
          }
        })
      })
    },
    [activeWorkoutId]
  )

  const handleLibraryDragStart = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>, exerciseName: string) => {
      event.dataTransfer.effectAllowed = "copy"
      event.dataTransfer.setData("text/plain", exerciseName)
      setDraggedExerciseName(exerciseName)
    },
    []
  )

  const handleCanvasDragOver = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = "copy"
      setIsCanvasDragOver(true)
    },
    []
  )

  const handleCanvasDragLeave = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        setIsCanvasDragOver(false)
      }
    },
    []
  )

  const handleCanvasDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const droppedExercise =
        event.dataTransfer.getData("text/plain") || draggedExerciseName

      if (droppedExercise) {
        appendExerciseToProgram(droppedExercise)
      }

      setDraggedExerciseName(null)
      setIsCanvasDragOver(false)
    },
    [appendExerciseToProgram, draggedExerciseName]
  )

  return (
    <>
      <div className="grid min-h-0 flex-1 grid-cols-[320px_minmax(0,1fr)] overflow-hidden">
          <div className="flex min-h-0 overflow-hidden border-r border-neutral-200 bg-white">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="space-y-3 border-b border-neutral-200 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[15px] font-medium text-neutral-900">
                    5710 EXERCISES
                  </div>
                  <div className="inline-flex rounded-md border border-neutral-200 bg-white p-0.5 shadow-none">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-sm px-3 text-[13px] text-neutral-700 shadow-none"
                    >
                      <List className="size-3.5" />
                      List
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-sm px-3 text-[13px] text-neutral-500 shadow-none"
                    >
                      <LayoutGrid className="size-3.5" />
                      Grid
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                      placeholder="Search exercise"
                      className="h-10 rounded-sm border-neutral-200 bg-white pl-9 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-10 rounded-sm border-neutral-200 bg-white text-neutral-500 shadow-none hover:bg-neutral-50 hover:text-neutral-700"
                  >
                    <Filter className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-sm border-neutral-200 bg-white px-4 text-neutral-700 shadow-none hover:bg-neutral-50"
                  >
                    New
                  </Button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                <div className="space-y-3">
                  {fixedProgramExerciseLibrary.map((exercise) => (
                    <div
                      key={`${program.id}-${exercise}`}
                      draggable
                      onDragStart={(event) => handleLibraryDragStart(event, exercise)}
                      onDragEnd={() => {
                        setDraggedExerciseName(null)
                        setIsCanvasDragOver(false)
                      }}
                      className={cn(
                        "flex cursor-grab items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(17,24,39,0.04)] transition-colors active:cursor-grabbing",
                        draggedExerciseName === exercise && "border-brand-300 bg-brand-50/40"
                      )}
                    >
                      <div className="min-w-0 truncate text-[15px] font-medium text-neutral-900">
                        {exercise}
                      </div>
                      <IconDots className="size-4 shrink-0 text-neutral-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-white">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="border-b border-neutral-200 px-5 py-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-[16px] font-semibold text-neutral-950">
                    {program.title}
                  </div>
                  <AddWorkoutDialog
                    trigger={
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 rounded-sm border-neutral-200 bg-white px-4 text-neutral-700 shadow-none hover:bg-neutral-50"
                      >
                        Add Workout
                      </Button>
                    }
                  />
                </div>
                <textarea
                  defaultValue={program.description}
                  className="min-h-[56px] w-full rounded-sm border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-neutral-700 shadow-none outline-none focus:border-neutral-300"
                />
              </div>

              {editorWorkouts.length > 0 ? (
                <>
                  <div className="border-b border-neutral-200 px-5">
                    <Tabs value={activeWorkoutId} onValueChange={setActiveWorkoutId} className="gap-0">
                      <TabsList className="h-auto gap-8 rounded-none bg-transparent p-0">
                        {editorWorkouts.map((workout) => (
                          <TabsTrigger
                            key={workout.id}
                            value={workout.id}
                            className={addProgramTabTriggerClassName}
                          >
                            {workout.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>

                  <div
                    className={cn(
                      "min-h-0 flex-1 overflow-y-auto px-5 py-4 transition-colors",
                      isCanvasDragOver && "bg-brand-50/20"
                    )}
                    onDragOver={handleCanvasDragOver}
                    onDragLeave={handleCanvasDragLeave}
                    onDrop={handleCanvasDrop}
                  >
                    {activeWorkout ? (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="size-11 rounded-xl bg-linear-to-br from-brand-500 to-brand-700" />
                          <textarea
                            defaultValue={activeWorkout.intro}
                            className="min-h-[56px] flex-1 rounded-sm border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-neutral-700 shadow-none outline-none focus:border-neutral-300"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-10 rounded-sm border-neutral-200 bg-white text-neutral-500 shadow-none hover:bg-neutral-50 hover:text-neutral-700"
                          >
                            <IconDots className="size-4" />
                          </Button>
                        </div>

                        {activeWorkout.sections.map((section) => (
                          <div
                            key={section.id}
                            className="rounded-2xl border border-neutral-200 bg-brand-50/35 p-3"
                          >
                            <div
                              className={cn(
                                "flex items-center justify-between rounded-xl px-4 py-3 text-[14px] font-semibold",
                                section.tone === "dark"
                                  ? "bg-[#071b2f] text-white"
                                  : "bg-white text-neutral-950"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <ChevronDown className="size-4" />
                                {section.title}
                              </div>
                              <IconDots className="size-4 text-current/70" />
                            </div>

                            <div className="mt-3 rounded-xl bg-white p-3 shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
                              <div className="rounded-lg bg-neutral-100 px-4 py-3 text-[14px] text-neutral-700">
                                {section.note}
                              </div>

                              <div className="mt-3 space-y-3">
                                {section.exercises.map((exercise, exerciseIndex) => (
                                  <React.Fragment key={exercise.id}>
                                    <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
                                      <div className="mb-3 flex items-center gap-3">
                                        <div className="size-7 rounded-lg border border-neutral-200 bg-neutral-50" />
                                        <Input
                                          defaultValue={exercise.name}
                                          className="h-10 rounded-sm border-neutral-200 bg-white shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                                        />
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          className="size-8 rounded-sm border-neutral-200 bg-white text-neutral-500 shadow-none hover:bg-neutral-50 hover:text-neutral-700"
                                        >
                                          <RefreshCw className="size-3.5" />
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="icon"
                                          className="size-8 rounded-sm border-neutral-200 bg-white text-neutral-500 shadow-none hover:bg-neutral-50 hover:text-neutral-700"
                                        >
                                          <IconDots className="size-4" />
                                        </Button>
                                      </div>

                                      <textarea
                                        defaultValue={exercise.note}
                                        className="min-h-[42px] w-full rounded-sm border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-neutral-500 shadow-none outline-none focus:border-neutral-300"
                                      />

                                      <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200">
                                        <div className="grid grid-cols-5 bg-white text-[13px] text-neutral-400">
                                          {exercise.fields.map((field) => (
                                            <div
                                              key={`${exercise.id}-${field}`}
                                              className="border-r border-neutral-200 px-3 py-3 last:border-r-0"
                                            >
                                              {field}
                                            </div>
                                          ))}
                                        </div>
                                        <div className="grid grid-cols-5 border-t border-neutral-200 bg-white text-[14px] text-neutral-800">
                                          {exercise.values.map((value, valueIndex) => (
                                            <div
                                              key={`${exercise.id}-${valueIndex}`}
                                              className="border-r border-neutral-200 px-3 py-3 last:border-r-0"
                                            >
                                              {value}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>

                                    {exerciseIndex < section.exercises.length - 1 ? (
                                      <div className="flex justify-center py-1 text-neutral-500">
                                        <Plus className="size-4 rotate-45" />
                                      </div>
                                    ) : null}
                                  </React.Fragment>
                                ))}
                              </div>

                              <div className="mt-4 flex justify-end">
                                <Button className="h-10 rounded-sm bg-[#071b2f] px-4 text-white shadow-none hover:bg-[#0b2740]">
                                  Add Exercise
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </>
              ) : (
                <div
                  className={cn(
                    "flex min-h-0 flex-1 items-center justify-center px-8 py-10 transition-colors",
                    isCanvasDragOver && "bg-brand-50/20"
                  )}
                  onDragOver={handleCanvasDragOver}
                  onDragLeave={handleCanvasDragLeave}
                  onDrop={handleCanvasDrop}
                >
                  <div className="flex max-w-[360px] flex-col items-center text-center">
                    <div
                      className={cn(
                        "flex w-full flex-col items-center rounded-2xl border border-dashed border-neutral-200 px-8 py-10",
                        isCanvasDragOver && "border-brand-400 bg-brand-50/35"
                      )}
                    >
                      <div className="flex size-10 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-neutral-700">
                        <Dumbbell className="size-5" />
                      </div>
                      <div className="mt-4 text-[15px] leading-7 text-neutral-700">
                        Drag an exercise here or click the button below to add your first workout.
                      </div>
                      <AddWorkoutDialog
                        trigger={
                          <Button className="mt-4 h-12 rounded-sm bg-[#071b2f] px-5 text-white shadow-none hover:bg-[#0b2740]">
                            Add Your First Workout
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>
      {footer}
    </>
  )
}

export function FixedProgramEditorDialog({
  program,
  trigger,
}: {
  program: FixedProgramEditorProgram
  trigger: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex h-[88vh] max-h-[88vh] w-[min(1120px,calc(100vw-2rem))] max-w-[1120px] flex-col gap-0 overflow-hidden rounded-sm p-0">
        <FixedProgramEditorBuilder
          program={program}
          isActive={open}
          footer={
            <DialogFooter className="border-t border-neutral-200 px-5 py-3 sm:justify-between">
              <DialogClose asChild>
                <Button variant="ghost" className="px-0 text-neutral-700 shadow-none">
                  Close
                </Button>
              </DialogClose>
              <Button>Save Changes</Button>
            </DialogFooter>
          }
        />
      </DialogContent>
    </Dialog>
  )
}

export function FixedProgramDetailView({
  program,
  onBack,
}: {
  program: FixedProgramEditorProgram
  onBack: () => void
}) {
  return (
    <div className="min-w-0 bg-neutral-50">
      <div className="border-b border-neutral-200 bg-neutral-50">
        <div className="flex min-h-10 flex-col gap-2.5 px-4 py-2.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="size-8 rounded-sm text-neutral-500 shadow-none hover:bg-neutral-100 hover:text-neutral-700"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <div className="text-[24px] font-semibold text-neutral-950">{program.title}</div>
          </div>

          <Button className="shrink-0 border-transparent bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700">
            Save Changes
          </Button>
        </div>
      </div>

      <div className="min-h-0 p-4">
        <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
          <FixedProgramEditorBuilder program={program} />
        </div>
      </div>
    </div>
  )
}

export function FixedProgramsTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
        <div className="text-[15px] font-medium text-neutral-900">Program</div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-sm text-neutral-400 shadow-none hover:bg-neutral-100 hover:text-neutral-700"
        >
          <Search className="size-4" />
        </Button>
      </div>

      <div>
        {fixedPrograms.map((program) => (
          <FixedProgramEditorDialog
            key={program.id}
            program={program}
            trigger={
              <button
                type="button"
                className="flex w-full items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-neutral-50"
              >
                <div className="min-w-0 space-y-3">
                  <div className="text-[15px] font-medium text-neutral-950">
                    {program.title}
                  </div>

                  {program.workouts.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {program.workouts.map((workout, index) => (
                        <React.Fragment key={`${program.id}-${workout}`}>
                          <Badge className="rounded-sm border border-blue-200 bg-blue-50 px-2 py-0.5 text-[12px] font-medium text-blue-700 shadow-none hover:bg-blue-50">
                            {workout}
                          </Badge>
                          {index < program.workouts.length - 1 ? (
                            <span className="text-[13px] text-neutral-400">/</span>
                          ) : null}
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <Badge className="rounded-sm border border-rose-200 bg-white px-2 py-0.5 text-[12px] font-medium text-rose-600 shadow-none hover:bg-white">
                      No Workouts
                    </Badge>
                  )}
                </div>

                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-sm border border-neutral-200 bg-white text-neutral-500 shadow-none">
                  <IconDots className="size-4" />
                </span>
              </button>
            }
          />
        ))}
      </div>
    </div>
  )
}

export function ProgramsOverviewActions({
  programType,
}: {
  programType: "calendar" | "fixed"
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleProgramTypeChange = React.useCallback(
    (nextProgramType: "calendar" | "fixed") => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("tab", "programs")
      params.set("programTab", "calendar")
      params.set("programType", nextProgramType)
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  return (
    <>
      <ProgramTypeDialog
        value={programType}
        onValueChange={handleProgramTypeChange}
        triggerClassName="rounded-sm border-neutral-200 bg-white text-neutral-700 shadow-none hover:bg-neutral-50 hover:text-neutral-900"
      />
      {programType === "calendar" ? (
        <ImportCalendarDialog
          triggerClassName="border-transparent bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700"
          triggerLabel="Import Program"
          dialogTitle="Import Program"
        />
      ) : (
        <AddProgramDialog triggerClassName="border-transparent bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700" />
      )}
    </>
  )
}

export function ImportCalendarDialog({
  triggerClassName,
  triggerLabel = "Import Program",
  dialogTitle = "Import Program",
}: {
  triggerClassName?: string
  triggerLabel?: string
  dialogTitle?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [selectedProgramId, setSelectedProgramId] = React.useState("beginner-3m")
  const [startDate, setStartDate] = React.useState("2026-03-19")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className={triggerClassName}>
          <CalendarDays className="size-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px] rounded-sm p-0">
        <DialogHeader className="border-b border-neutral-200 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold">
            <CalendarDays className="size-4 text-neutral-500" />
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 px-6 py-5">
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <div className="grid grid-cols-[minmax(0,1fr)_180px] items-center border-b border-neutral-200 px-4 py-3 text-[13px] font-medium text-neutral-700">
              <div>Program</div>
              <div className="flex items-center justify-between gap-3">
                <Search className="size-4 text-neutral-400" />
                <span>Tag</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedProgramId("beginner-3m")}
              className={cn(
                "grid w-full grid-cols-[minmax(0,1fr)_180px] items-center px-4 py-4 text-left transition-colors",
                selectedProgramId === "beginner-3m"
                  ? "bg-brand-50"
                  : "bg-white hover:bg-neutral-50"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-4 items-center justify-center rounded-full border-2",
                    selectedProgramId === "beginner-3m"
                      ? "border-brand-600"
                      : "border-neutral-300"
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      selectedProgramId === "beginner-3m"
                        ? "bg-brand-600"
                        : "bg-transparent"
                    )}
                  />
                </span>
                <span className="text-[15px] font-medium text-neutral-950">
                  3 Month Beginner Program (Sample)
                </span>
              </div>
              <div className="text-[13px] text-neutral-500">Starter</div>
            </button>
          </div>

          <div className="space-y-2">
            <Label className="text-[13px] font-medium text-neutral-700">
              Start Date
            </Label>
            <div className="relative max-w-[170px]">
              <Input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="h-10 rounded-sm border-neutral-200 bg-white pr-10 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
              />
              <CalendarIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-neutral-400" />
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-neutral-200 px-6 py-4 sm:justify-between">
          <DialogClose asChild>
            <Button variant="ghost" className="px-0 text-neutral-700 shadow-none">
              Close
            </Button>
          </DialogClose>
          <Button onClick={() => setOpen(false)}>Import Program</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ExerciseHistoryPanel() {
  const exerciseEntries = React.useMemo(() => getWorkoutExerciseEntries(programWorkouts), [])

  return <ExerciseExplorer exercises={exerciseEntries} />
}

function CompletedWorkoutsCalendarGrid({
  onSelectWorkout,
}: {
  onSelectWorkout?: (workoutId: string) => void
}) {
  const visibleMonth = React.useMemo(() => getHistoryVisibleMonth(), [])
  const visibleDates = React.useMemo(
    () => buildHistoryMonthDates(visibleMonth),
    [visibleMonth]
  )
  const selectedDateKey = React.useMemo(
    () =>
      [...programWorkouts]
        .sort((left, right) => right.dateKey.localeCompare(left.dateKey))[0]?.dateKey ?? "",
    []
  )

  return (
    <div className="overflow-hidden border-b border-neutral-200 bg-neutral-50">
      <div className="overflow-x-auto">
        <div className="min-w-[1100px]">
          <div className="grid grid-cols-7 border-b border-neutral-200 bg-neutral-50">
            {historyWeekdayLabels.map((label, index) => (
              <div
                key={label}
                className={cn(
                  "px-3 py-2 text-center text-xs font-medium text-neutral-500",
                  index !== historyWeekdayLabels.length - 1 && "border-r border-neutral-200"
                )}
              >
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 bg-neutral-50">
            {visibleDates.map((date, index) => {
              const dateKey = toHistoryDateKey(date)
              const outsideCurrentMonth = date.getMonth() !== visibleMonth.getMonth()
              const isSelected = dateKey === selectedDateKey
              const workouts = programWorkouts.filter((workout) => workout.dateKey === dateKey)

              return (
                <div
                  key={dateKey}
                  className={cn(
                    "relative h-44 overflow-y-auto p-2 align-top",
                    outsideCurrentMonth ? "bg-neutral-50/60" : "bg-neutral-50",
                    isSelected && "bg-brand-50",
                    index % 7 !== 6 && "border-r border-neutral-200",
                    index < visibleDates.length - 7 && "border-b border-neutral-200",
                    isSelected &&
                      "after:absolute after:inset-x-0 after:top-0 after:h-0.5 after:bg-brand-500"
                  )}
                >
                  <div className="flex items-start justify-end">
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

                  <div className="mt-3 space-y-2">
                    {workouts.map((workout) => (
                      <ProgramWorkoutCard
                        key={workout.id}
                        workout={workout}
                        compact
                        onClick={
                          onSelectWorkout ? () => onSelectWorkout(workout.id) : undefined
                        }
                      />
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

export function CompletedWorkoutsPanel() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <CompletedWorkoutsCalendarGrid
        onSelectWorkout={(workoutId) =>
          router.push(
            `${pathname}?programTab=completed-workouts&workoutId=${workoutId}`
          )
        }
      />
  )
}

export function WorkoutDetailView({
  workoutId,
}: {
  workoutId: string
}) {
  const pathname = usePathname()
  const workout = React.useMemo(() => getWorkoutById(workoutId), [workoutId])
  const pickerProps = useProgramsPeriodPickerState()
  const [detailSection, setDetailSection] = React.useState<
    "summary" | "exercises" | "analysis"
  >("summary")

  if (!workout) {
    return null
  }

  const workoutExercises = getWorkoutExerciseEntries([workout])
  const {
    selectedMetric,
    setSelectedMetric,
    exerciseSearch,
    setExerciseSearch,
    filteredExercises,
    selectedExercise,
    selectedExerciseId,
    setSelectedExerciseId,
  } = useExerciseExplorerState(workoutExercises)
  const totalSets = workout.exercises.reduce(
    (count, exercise) => count + exercise.currentSets.length,
    0
  )
  const hardestSet = workout.exercises
    .flatMap((exercise) =>
      exercise.currentSets.map((setRow) => ({
        exerciseName: exercise.name,
        weight: setRow.weight,
        reps: setRow.reps,
        score: setRow.weight * setRow.reps,
      }))
    )
    .sort((left, right) => right.score - left.score)[0]

  if (!selectedExercise) {
    return null
  }

  return (
    <div className="min-w-0">
      <div className="border-b border-neutral-200 bg-neutral-50">
        <div className="flex min-h-10 flex-col gap-2.5 px-4 py-2.5 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-8 rounded-sm text-neutral-500 shadow-none hover:bg-neutral-100 hover:text-neutral-700"
            >
              <a href={`${pathname}?programTab=completed-workouts`}>
                <ChevronLeft className="size-4" />
              </a>
            </Button>
            <div>
              <div className="text-[15px] font-semibold text-neutral-950">
                {workout.title}
              </div>
              <div className="text-[13px] text-neutral-500">{workout.dateLabel}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-50 p-4">
        <div className="mb-4 flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex rounded-sm border border-neutral-200 bg-white p-0.5 shadow-none">
            {([
              { value: "summary", label: "Summary" },
              { value: "exercises", label: "Exercises" },
              { value: "analysis", label: "Analysis" },
            ] as const).map((section) => (
              <Button
                key={section.value}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setDetailSection(section.value)}
                className={cn(
                  "min-w-28 rounded-sm px-4 text-[13px] font-medium shadow-none",
                  detailSection === section.value
                    ? "bg-neutral-100 text-neutral-950"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
                )}
              >
                {section.label}
              </Button>
            ))}
          </div>

          {detailSection === "analysis" ? (
            <div className="flex items-center justify-end">
              <HabitPeriodPicker {...pickerProps} />
            </div>
          ) : null}
        </div>

        {detailSection === "summary" ? (
          <div className="space-y-4">
            <Card className="rounded-xl border-neutral-200 shadow-none">
              <CardContent className="p-5">
                <div className="text-[13px] font-medium text-neutral-500">
                  Total Volume
                </div>
                <div className="mt-2 text-[40px] leading-none font-semibold text-neutral-950">
                  {workout.volume}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="rounded-xl border-neutral-200 shadow-none">
                <CardContent className="p-5">
                  <div className="text-[13px] font-medium text-neutral-500">
                    Duration
                  </div>
                  <div className="mt-3 text-[28px] font-semibold text-neutral-950">
                    {workout.duration}
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-xl border-neutral-200 shadow-none">
                <CardContent className="p-5">
                  <div className="text-[13px] font-medium text-neutral-500">
                    Sets
                  </div>
                  <div className="mt-3 text-[28px] font-semibold text-neutral-950">
                    {totalSets}
                    <span className="ml-2 text-[18px] font-medium text-neutral-400">
                      / {workout.exercises.length} exercises
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <div className="px-1 text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-400">
                Achievements
              </div>
              <Card className="rounded-xl border-neutral-200 shadow-none">
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <div className="text-[13px] font-medium text-neutral-500">
                      Hardest set
                    </div>
                    <div className="mt-1 text-[18px] font-semibold text-neutral-950">
                      {hardestSet?.exerciseName ?? "No data"}
                    </div>
                  </div>
                  <div className="rounded-full bg-neutral-100 px-4 py-2 text-[15px] font-semibold text-neutral-950">
                    {hardestSet ? `${hardestSet.weight} x ${hardestSet.reps}` : "-"}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <div className="px-1 text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-400">
                Notes
              </div>
              <Card className="rounded-xl border-neutral-200 shadow-none">
                <CardContent className="p-5 text-[15px] text-neutral-400">
                  No notes
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}

        {detailSection === "exercises" ? (
          <div className="space-y-4">
            {workout.exercises.map((exercise) => {
              const exerciseVolume = exercise.currentSets.reduce(
                (total, setRow) => total + setRow.weight * setRow.reps,
                0
              )

              return (
                <Card
                  key={exercise.id}
                  className="overflow-hidden rounded-[24px] border-neutral-200 shadow-none"
                >
                  <CardContent className="p-0">
                    <div className="border-b border-neutral-200 px-5 py-4">
                      <div className="text-[17px] font-semibold text-neutral-950">
                        {exercise.name}
                      </div>
                      <div className="mt-1 text-[13px] text-neutral-400">
                        {exercise.currentSets.length} sets - Volume {exerciseVolume} kg
                      </div>
                    </div>
                    {exercise.currentSets.map((setRow) => (
                      <div
                        key={`${exercise.id}-${setRow.set}`}
                        className="grid grid-cols-[40px_minmax(0,1fr)] items-center border-b border-neutral-200 px-5 py-5 last:border-b-0"
                      >
                        <div className="text-[15px] text-neutral-400">{setRow.set}</div>
                        <div className="text-[18px] font-semibold text-neutral-950">
                          {setRow.weight} kg x {setRow.reps}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : null}

        {detailSection === "analysis" ? (
          <div className="grid gap-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 xl:grid-cols-[300px_minmax(0,1fr)]">
            <div className="border-r border-neutral-200 bg-white p-3">
              <div className="relative">
                <Input
                  value={exerciseSearch}
                  onChange={(event) => setExerciseSearch(event.target.value)}
                  placeholder="Search exercise"
                  className="h-10 rounded-sm border-neutral-200 bg-white pl-10 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                />
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
              </div>

              <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                {filteredExercises.map((exercise) => (
                  <button
                    key={exercise.entryId}
                    type="button"
                    onClick={() => setSelectedExerciseId(exercise.entryId)}
                    className={cn(
                      "flex w-full items-center justify-between border-b border-neutral-200 px-4 py-4 text-left last:border-b-0",
                      exercise.entryId === selectedExerciseId
                        ? "bg-brand-50 text-brand-700"
                        : "bg-white text-neutral-800 hover:bg-neutral-50"
                    )}
                  >
                    <span className="text-[15px] font-medium">{exercise.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="min-w-0 space-y-4 bg-neutral-50 p-3">
              <Card className="rounded-xl border-neutral-200 shadow-none">
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <CardTitle className="text-[16px] font-semibold text-neutral-950">
                        {selectedExercise.name}
                      </CardTitle>
                      <div className="mt-1 text-[13px] text-neutral-500">
                        {selectedExercise.workoutTitle} - {selectedExercise.workoutDateLabel}
                      </div>
                    </div>

                    <div className="inline-flex rounded-sm border border-neutral-200 bg-white p-0.5 shadow-none">
                      {(["weight", "reps"] as const).map((metric) => (
                        <Button
                          key={metric}
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedMetric(metric)}
                          className={cn(
                            "rounded-sm px-4 text-[13px] font-medium capitalize shadow-none",
                            selectedMetric === metric
                              ? "bg-neutral-100 text-neutral-950"
                              : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
                          )}
                        >
                          {metric}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ChartContainer
                    config={exerciseHistoryChartConfig}
                    className="h-[360px] w-full"
                  >
                    <LineChart
                      data={selectedExercise.history}
                      margin={{ left: 12, right: 16, top: 8, bottom: 0 }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={8}
                        fontSize={12}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickMargin={8}
                        fontSize={12}
                        width={40}
                      />
                      <ChartTooltip
                        cursor={{ stroke: "#a3a3a3", strokeWidth: 1 }}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <Line
                        type="monotone"
                        dataKey={selectedMetric}
                        stroke={
                          selectedMetric === "weight"
                            ? "var(--color-weight)"
                            : "var(--color-reps)"
                        }
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#ffffff", strokeWidth: 2 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="rounded-xl border-neutral-200 shadow-none">
                <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
                  <div>
                    <CardTitle className="text-[16px] font-semibold text-neutral-950">
                      {selectedExercise.workoutTitle}
                    </CardTitle>
                    <div className="mt-1 text-[13px] text-neutral-500">
                      Current workout sets
                    </div>
                  </div>
                  <div className="text-[13px] text-neutral-500">
                    {selectedExercise.workoutDateLabel}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                    <Table>
                      <TableHeader className="bg-muted">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="w-24">Set</TableHead>
                          <TableHead>Weight</TableHead>
                          <TableHead>Reps</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedExercise.currentSets.map((setRow) => (
                          <TableRow key={`${selectedExercise.entryId}-${setRow.set}`}>
                            <TableCell className="font-medium">{setRow.set}</TableCell>
                            <TableCell>{setRow.weight}</TableCell>
                            <TableCell>{setRow.reps}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
