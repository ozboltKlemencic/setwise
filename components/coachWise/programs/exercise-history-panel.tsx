"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  CalendarDays,
  CalendarIcon,
  ChevronLeft,
  Search,
  TrendingDown,
  TrendingUp,
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
          <div className="text-[16px] font-semibold text-neutral-950">
            {workout.title}
          </div>
          <div className="mt-2 text-[13px] text-neutral-500">{workout.dateLabel}</div>
        </div>
        <div className="text-neutral-300">{">"}</div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_1fr_auto] items-end gap-3">
        <div className="border-r border-neutral-200 pr-3">
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400">
            Duration
          </div>
          <div className="mt-1 text-[14px] font-semibold text-neutral-950">
            {workout.duration}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400">
            Volume
          </div>
          <div className="mt-1 text-[14px] font-semibold text-neutral-950">
            {workout.volume}
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "rounded-md px-2.5 py-1 text-[12px] font-medium",
            getTrendBadgeClassName(workout.trend)
          )}
        >
          {workout.trend === "up" ? (
            <TrendingUp className="mr-1 size-3.5" />
          ) : workout.trend === "down" ? (
            <TrendingDown className="mr-1 size-3.5" />
          ) : null}
          {workout.changeLabel}
        </Badge>
      </div>
    </>
  )

  const className = cn(
    "w-full rounded-2xl border text-left shadow-[0_1px_2px_rgba(17,24,39,0.05)] transition-colors",
    compact ? "px-4 py-3" : "px-5 py-4",
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

export function ImportCalendarDialog({
  triggerClassName,
}: {
  triggerClassName?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [selectedProgramId, setSelectedProgramId] = React.useState("beginner-3m")
  const [startDate, setStartDate] = React.useState("2026-03-19")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className={triggerClassName}>
          <CalendarDays className="size-4" />
          Import Calendar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px] rounded-sm p-0">
        <DialogHeader className="border-b border-neutral-200 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold">
            <CalendarDays className="size-4 text-neutral-500" />
            Import Calendar
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

export function CompletedWorkoutsPanel() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-5">
      <ProgramWorkoutsList
        centered
        onSelectWorkout={(workoutId) =>
          router.push(
            `${pathname}?tab=programs&programTab=completed-workouts&workoutId=${workoutId}`
          )
        }
      />
    </div>
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
              <a href={`${pathname}?tab=programs&programTab=completed-workouts`}>
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
