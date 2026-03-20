"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  IconCalendarEvent,
  IconBarbell,
  IconChevronLeft,
  IconChevronRight,
  IconClipboardList,
  IconFilter,
  IconLayoutGrid,
  IconPlus,
  IconRectangle,
  IconSettings,
  IconPencil,
  IconTag,
  IconUser,
} from "@tabler/icons-react"
import { IconDots } from "@tabler/icons-react"
import { ImageIcon, Search, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FixedProgramEditorDialog,
  getFixedProgramEditorProgram,
} from "@/components/coachWise/programs/exercise-history-panel"
import { cn } from "@/lib/utils"

const profileTabTriggerClassName =
  "h-full flex-none gap-1.5 rounded-none border-0 border-b-2 border-transparent bg-transparent px-3.5 py-2 text-[13.5px] font-normal text-neutral-500 after:hidden hover:text-neutral-700 data-[state=active]:border-(--brand-500) data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none [&_svg]:size-3.5 [&_svg]:text-neutral-400 data-[state=active]:[&_svg]:text-(--brand-600)"

const mainTabs = [
  {
    value: "programs",
    label: "Programs",
    icon: <IconClipboardList className="size-4" />,
    description: "Urejanje aktivnih programov, faz in progresije za stranke.",
  },
  {
    value: "templates",
    label: "Templates",
    icon: <IconLayoutGrid className="size-4" />,
    description: "Shranjeni template programi za hitrejso pripravo novih planov.",
  },
  {
    value: "exercises",
    label: "Exercises",
    icon: <IconBarbell className="size-4" />,
    description: "Kniznica vaj, variacij in opomb za gradnjo programov.",
  },
] as const

const programRows = [
  {
    id: "full-body-sample",
    name: "Full Body (Sample)",
    type: "Fixed",
  },
  {
    id: "beginner-calendar",
    name: "3 Month Beginner Program (Sample)",
    type: "Calendar",
  },
  {
    id: "upper-lower",
    name: "Upper / Lower Split",
    type: "Fixed",
  },
  {
    id: "hypertrophy-block",
    name: "Hypertrophy Block - Spring",
    type: "Calendar",
  },
] as const

type ProgramRow = (typeof programRows)[number]

type CalendarProgramWorkoutCard = {
  title: string
  exercises: number
}

type CalendarProgramDay = {
  dayNumber: number
  workout: CalendarProgramWorkoutCard | null
}

type CalendarProgramMonth = {
  label: string
  startWeek: number
  days: CalendarProgramDay[]
}

type CalendarProgramDetail = {
  id: string
  title: string
  months: CalendarProgramMonth[]
}

function createCalendarProgramMonth({
  startDay,
  startWeek,
  workoutPattern,
}: {
  startDay: number
  startWeek: number
  workoutPattern: Record<number, CalendarProgramWorkoutCard>
}): CalendarProgramMonth {
  return {
    label: `Month ${Math.ceil(startWeek / 4)} of 3`,
    startWeek,
    days: Array.from({ length: 28 }, (_, index) => ({
      dayNumber: startDay + index,
      workout: workoutPattern[index] ?? null,
    })),
  }
}

const calendarProgramDetails: CalendarProgramDetail[] = [
  {
    id: "beginner-calendar",
    title: "3 Month Beginner Program (Sample)",
    months: [
      createCalendarProgramMonth({
        startDay: 1,
        startWeek: 1,
        workoutPattern: {
          0: { title: "Chest & Shoulder", exercises: 6 },
          1: { title: "Back", exercises: 9 },
          3: { title: "Arms", exercises: 6 },
          4: { title: "Legs", exercises: 11 },
          7: { title: "Chest & Shoulder", exercises: 6 },
          8: { title: "Back", exercises: 9 },
          10: { title: "Arms", exercises: 6 },
          11: { title: "Legs", exercises: 11 },
          14: { title: "Chest & Shoulder", exercises: 6 },
          15: { title: "Back", exercises: 9 },
          17: { title: "Arms", exercises: 6 },
          18: { title: "Legs", exercises: 11 },
          21: { title: "Chest & Shoulder", exercises: 6 },
          22: { title: "Back", exercises: 9 },
          24: { title: "Arms", exercises: 6 },
          25: { title: "Legs", exercises: 11 },
        },
      }),
      createCalendarProgramMonth({
        startDay: 29,
        startWeek: 5,
        workoutPattern: {
          0: { title: "Chest & Shoulder", exercises: 6 },
          1: { title: "Back", exercises: 9 },
          3: { title: "Arms", exercises: 6 },
          4: { title: "Legs", exercises: 11 },
          7: { title: "Chest & Shoulder", exercises: 6 },
          8: { title: "Back", exercises: 9 },
          10: { title: "Arms", exercises: 6 },
          11: { title: "Legs", exercises: 11 },
          14: { title: "Chest & Shoulder", exercises: 6 },
          15: { title: "Back", exercises: 9 },
          17: { title: "Arms", exercises: 6 },
          18: { title: "Legs", exercises: 11 },
          21: { title: "Chest & Shoulder", exercises: 6 },
          22: { title: "Back", exercises: 9 },
          24: { title: "Arms", exercises: 6 },
          25: { title: "Legs", exercises: 11 },
        },
      }),
      createCalendarProgramMonth({
        startDay: 57,
        startWeek: 9,
        workoutPattern: {
          0: { title: "Chest & Shoulder", exercises: 6 },
          1: { title: "Back", exercises: 9 },
          2: { title: "Conditioning", exercises: 4 },
          4: { title: "Arms", exercises: 6 },
          5: { title: "Legs", exercises: 11 },
          7: { title: "Chest & Shoulder", exercises: 6 },
          8: { title: "Back", exercises: 9 },
          10: { title: "Arms", exercises: 6 },
          11: { title: "Legs", exercises: 11 },
          14: { title: "Chest & Shoulder", exercises: 6 },
          15: { title: "Back", exercises: 9 },
          17: { title: "Arms", exercises: 6 },
          18: { title: "Legs", exercises: 11 },
          21: { title: "Chest & Shoulder", exercises: 6 },
          22: { title: "Back", exercises: 9 },
          24: { title: "Arms", exercises: 6 },
          25: { title: "Legs", exercises: 11 },
        },
      }),
    ],
  },
  {
    id: "hypertrophy-block",
    title: "Hypertrophy Block - Spring",
    months: [
      createCalendarProgramMonth({
        startDay: 1,
        startWeek: 1,
        workoutPattern: {
          0: { title: "Push Day", exercises: 8 },
          1: { title: "Pull Day", exercises: 8 },
          3: { title: "Leg Day", exercises: 10 },
          5: { title: "Upper Pump", exercises: 7 },
          7: { title: "Push Day", exercises: 8 },
          8: { title: "Pull Day", exercises: 8 },
          10: { title: "Leg Day", exercises: 10 },
          12: { title: "Upper Pump", exercises: 7 },
          14: { title: "Push Day", exercises: 8 },
          15: { title: "Pull Day", exercises: 8 },
          17: { title: "Leg Day", exercises: 10 },
          19: { title: "Upper Pump", exercises: 7 },
          21: { title: "Push Day", exercises: 8 },
          22: { title: "Pull Day", exercises: 8 },
          24: { title: "Leg Day", exercises: 10 },
          26: { title: "Upper Pump", exercises: 7 },
        },
      }),
      createCalendarProgramMonth({
        startDay: 29,
        startWeek: 5,
        workoutPattern: {
          0: { title: "Push Day", exercises: 8 },
          1: { title: "Pull Day", exercises: 8 },
          3: { title: "Leg Day", exercises: 10 },
          5: { title: "Upper Pump", exercises: 7 },
          7: { title: "Push Day", exercises: 8 },
          8: { title: "Pull Day", exercises: 8 },
          10: { title: "Leg Day", exercises: 10 },
          12: { title: "Upper Pump", exercises: 7 },
          14: { title: "Push Day", exercises: 8 },
          15: { title: "Pull Day", exercises: 8 },
          17: { title: "Leg Day", exercises: 10 },
          19: { title: "Upper Pump", exercises: 7 },
          21: { title: "Push Day", exercises: 8 },
          22: { title: "Pull Day", exercises: 8 },
          24: { title: "Leg Day", exercises: 10 },
          26: { title: "Upper Pump", exercises: 7 },
        },
      }),
      createCalendarProgramMonth({
        startDay: 57,
        startWeek: 9,
        workoutPattern: {
          0: { title: "Push Day", exercises: 8 },
          1: { title: "Pull Day", exercises: 8 },
          3: { title: "Leg Day", exercises: 10 },
          5: { title: "Upper Pump", exercises: 7 },
          7: { title: "Push Day", exercises: 8 },
          8: { title: "Pull Day", exercises: 8 },
          10: { title: "Leg Day", exercises: 10 },
          12: { title: "Upper Pump", exercises: 7 },
          14: { title: "Push Day", exercises: 8 },
          15: { title: "Pull Day", exercises: 8 },
          17: { title: "Leg Day", exercises: 10 },
          19: { title: "Upper Pump", exercises: 7 },
          21: { title: "Push Day", exercises: 8 },
          22: { title: "Pull Day", exercises: 8 },
          24: { title: "Leg Day", exercises: 10 },
          26: { title: "Upper Pump", exercises: 7 },
        },
      }),
    ],
  },
] satisfies CalendarProgramDetail[]

const templateRows = [
  {
    id: "leg-day",
    name: "Leg Day",
    exercises: 10,
    tags: ["Strength"],
    tone: "from-pink-400 via-fuchsia-500 to-rose-500",
  },
  {
    id: "pull-day",
    name: "Pull Day",
    exercises: 8,
    tags: ["Pull"],
    tone: "from-amber-500 via-orange-500 to-red-500",
  },
  {
    id: "push-day",
    name: "Push Day",
    exercises: 8,
    tags: ["Push"],
    tone: "from-violet-500 via-purple-500 to-fuchsia-500",
  },
  {
    id: "legs",
    name: "Legs",
    exercises: 9,
    tags: ["Lower"],
    tone: "from-sky-500 via-blue-500 to-cyan-500",
  },
  {
    id: "arms",
    name: "Arms",
    exercises: 6,
    tags: ["Accessory"],
    tone: "from-cyan-500 via-sky-500 to-blue-600",
  },
  {
    id: "back",
    name: "Back",
    exercises: 7,
    tags: ["Pull"],
    tone: "from-teal-500 via-cyan-500 to-sky-600",
  },
] as const

const exerciseRows = [
  {
    id: "barbell-bench-press",
    name: "Barbell Bench Press",
    focus: "Chest",
    custom: false,
  },
  {
    id: "bodyweight-half-squat",
    name: "Bodyweight Half Squat",
    focus: "Quadriceps",
    custom: false,
  },
  {
    id: "bodyweight-squat",
    name: "Bodyweight Squat",
    focus: "Quadriceps",
    custom: false,
  },
  {
    id: "dumbbell-standing-biceps-curl",
    name: "Dumbbell Standing Biceps Curl",
    focus: "Biceps",
    custom: false,
  },
  {
    id: "push-up",
    name: "Push-up",
    focus: "Chest",
    custom: false,
  },
  {
    id: "run",
    name: "Run",
    focus: "Quadriceps",
    custom: false,
  },
  {
    id: "run-on-treadmill",
    name: "Run on Treadmill",
    focus: "Quadriceps",
    custom: false,
  },
  {
    id: "squat",
    name: "Squat",
    focus: "Quadriceps",
    custom: false,
  },
  {
    id: "walking",
    name: "Walking",
    focus: "Quadriceps",
    custom: false,
  },
  {
    id: "walking-on-treadmill",
    name: "Walking on Treadmill",
    focus: "Other",
    custom: false,
  },
  {
    id: "arm-circles",
    name: "Arm Circles",
    focus: "Shoulders",
    custom: true,
  },
] as const

function ProgramsSearchBar({
  placeholder,
  action,
}: {
  placeholder: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
        <Input
          placeholder={placeholder}
          className="h-9 rounded-sm border-neutral-200 bg-white pl-9 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
        />
      </div>
      {action}
    </div>
  )
}

function ProgramTypeBadge({ type }: { type: "Fixed" | "Calendar" }) {
  return (
    <Badge
      className="rounded-sm border border-neutral-200 bg-white px-2 py-0.5 text-[12px] font-medium text-neutral-700 shadow-none hover:bg-white"
    >
      {type === "Fixed" ? (
        <IconRectangle className="mr-1 size-3.5 text-neutral-500" />
      ) : (
        <IconCalendarEvent className="mr-1 size-3.5 text-neutral-500" />
      )}
      {type}
    </Badge>
  )
}

function AddExerciseDialog({ trigger }: { trigger: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-sm border-neutral-200 p-0 sm:max-w-4xl">
        <div className="grid grid-cols-[minmax(0,1fr)_300px]">
          <div className="border-r border-neutral-200">
            <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-4">
              <IconBarbell className="size-4 text-neutral-700" />
              <DialogTitle className="text-[15px] font-semibold text-neutral-950">
                Add Exercise
              </DialogTitle>
            </div>

            <div className="space-y-5 px-4 py-4">
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-neutral-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Name of the exercise e.g. Squat"
                  className="h-9 rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-neutral-700">
                  Instructions
                </label>
                <textarea
                  placeholder="Enter any additional info"
                  className="min-h-[84px] w-full rounded-sm border border-neutral-200 bg-white px-3 py-2 text-[14px] text-neutral-900 shadow-none outline-none placeholder:text-neutral-400 focus:border-neutral-300"
                />
              </div>

              <div className="space-y-3">
                <div className="text-[13px] font-medium text-neutral-700">
                  Filters
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Select defaultValue="equipment">
                    <SelectTrigger className="h-9 w-full rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0">
                      <SelectValue placeholder="Select Equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equipment">Select Equipment</SelectItem>
                      <SelectItem value="barbell">Barbell</SelectItem>
                      <SelectItem value="dumbbell">Dumbbell</SelectItem>
                      <SelectItem value="bodyweight">Bodyweight</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="level">
                    <SelectTrigger className="h-9 w-full rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0">
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="level">Select Level</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="muscle">
                    <SelectTrigger className="h-9 w-full rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0">
                      <SelectValue placeholder="Select Main Muscle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="muscle">Select Main Muscle</SelectItem>
                      <SelectItem value="chest">Chest</SelectItem>
                      <SelectItem value="back">Back</SelectItem>
                      <SelectItem value="legs">Legs</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="type">
                    <SelectTrigger className="h-9 w-full rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="type">Select Type</SelectItem>
                      <SelectItem value="strength">Strength</SelectItem>
                      <SelectItem value="cardio">Cardio</SelectItem>
                      <SelectItem value="stretching">Stretching</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-4">
              <ImageIcon className="size-4 text-neutral-700" />
              <div className="text-[15px] font-semibold text-neutral-950">
                Media
              </div>
            </div>

            <div className="space-y-5 px-4 py-4">
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-neutral-700">
                  YouTube Link
                </label>
                <Input
                  placeholder="Enter YouTube link"
                  className="h-9 rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                />
              </div>

              <div className="flex items-center gap-3 text-[13px] font-medium text-neutral-500">
                <div className="h-px flex-1 bg-neutral-200" />
                <span>OR</span>
                <div className="h-px flex-1 bg-neutral-200" />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-neutral-700">
                  Custom Video
                </label>
                <button
                  type="button"
                  className="flex h-[116px] w-full flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-neutral-200 bg-neutral-50 text-center text-neutral-500 transition-colors hover:border-neutral-300 hover:bg-white"
                >
                  <div className="flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700">
                    <Upload className="size-4" />
                  </div>
                  <div className="text-[14px]">
                    Click or drag file to this area to upload
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="items-center justify-between border-t border-neutral-200 px-4 py-4 sm:flex-row sm:justify-between">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="h-9 px-0 text-[15px] font-normal text-neutral-700 hover:bg-transparent hover:text-neutral-900"
            >
              Close
            </Button>
          </DialogClose>
          <Button className="h-9 rounded-sm border-transparent bg-linear-to-r from-brand-500 to-brand-600 px-4 text-white shadow-none hover:from-brand-600 hover:to-brand-700">
            Add Exercise
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CalendarProgramWorkoutCard({
  workout,
}: {
  workout: CalendarProgramWorkoutCard
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-3 py-3 shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-sky-500 via-blue-500 to-cyan-500 text-white">
            <IconBarbell className="size-4" />
          </div>
          <div className="truncate text-[14px] font-semibold text-neutral-950">
            {workout.title}
          </div>
        </div>
        <IconDots className="size-4 shrink-0 text-neutral-300" />
      </div>

      <Badge className="mt-3 rounded-sm border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-neutral-500 shadow-none hover:bg-white">
        {workout.exercises} Exercises
      </Badge>
    </div>
  )
}

function ProgramCalendarDetailView({
  program,
  onBack,
}: {
  program: CalendarProgramDetail
  onBack: () => void
}) {
  const [visibleMonthIndex, setVisibleMonthIndex] = React.useState(0)
  const activeMonth = program.months[visibleMonthIndex]

  return (
    <div className="space-y-4 bg-neutral-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="size-9 rounded-sm text-neutral-500 shadow-none hover:bg-white hover:text-neutral-900"
          >
            <IconChevronLeft className="size-4" />
          </Button>
          <div className="text-[28px] font-semibold text-neutral-950">
            {program.title}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 rounded-sm border-neutral-200 bg-white text-neutral-600 shadow-none hover:bg-neutral-50"
          >
            <IconPencil className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 rounded-sm border-neutral-200 bg-white text-neutral-600 shadow-none hover:bg-neutral-50"
          >
            <IconTag className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 rounded-sm border-neutral-200 bg-white text-neutral-600 shadow-none hover:bg-neutral-50"
          >
            <IconSettings className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-sm border-neutral-200 bg-white px-3 text-[14px] font-medium text-neutral-700 shadow-none hover:bg-neutral-50"
          >
            Periodise Planner
          </Button>
          <Button className="h-9 rounded-sm border-transparent bg-linear-to-r from-brand-500 to-brand-600 px-4 text-white shadow-none hover:from-brand-600 hover:to-brand-700">
            Add Week
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center rounded-sm border border-neutral-200 bg-white shadow-none">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              setVisibleMonthIndex((currentIndex) => Math.max(currentIndex - 1, 0))
            }
            disabled={visibleMonthIndex === 0}
            className="size-9 rounded-none rounded-l-sm text-neutral-500 shadow-none hover:bg-neutral-50 disabled:opacity-40"
          >
            <IconChevronLeft className="size-4" />
          </Button>
          <div className="border-x border-neutral-200 px-4 py-2 text-[14px] font-medium text-neutral-900">
            {activeMonth.label}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              setVisibleMonthIndex((currentIndex) =>
                Math.min(currentIndex + 1, program.months.length - 1)
              )
            }
            disabled={visibleMonthIndex === program.months.length - 1}
            className="size-9 rounded-none rounded-r-sm text-neutral-500 shadow-none hover:bg-neutral-50 disabled:opacity-40"
          >
            <IconChevronRight className="size-4" />
          </Button>
        </div>

        <div className="inline-flex h-10 items-stretch rounded-sm border border-neutral-200 bg-white p-0.5">
          <button
            type="button"
            className="inline-flex min-w-16 items-center justify-center rounded-sm px-3 text-[13px] font-medium text-neutral-500"
          >
            Week
          </button>
          <button
            type="button"
            className="inline-flex min-w-16 items-center justify-center rounded-sm border border-brand-500 bg-brand-500/10 px-3 text-[13px] font-medium text-brand-600"
          >
            Month
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
        <div className="grid grid-cols-[40px_repeat(7,minmax(0,1fr))] bg-neutral-50">
          {Array.from({ length: 4 }).map((_, weekIndex) => (
            <React.Fragment key={`week-${activeMonth.startWeek + weekIndex}`}>
              <div className="border-r border-neutral-200 px-2 py-3">
                <div className="flex h-full items-start justify-center">
                  <span className="-rotate-90 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-300">
                    WEEK {activeMonth.startWeek + weekIndex}
                  </span>
                </div>
              </div>

              {activeMonth.days
                .slice(weekIndex * 7, weekIndex * 7 + 7)
                .map((day, dayIndex) => (
                  <div
                    key={`day-${day.dayNumber}`}
                    className={cn(
                      "min-h-[188px] border-r border-neutral-200 p-3",
                      weekIndex !== 3 && "border-b border-neutral-200",
                      dayIndex === 6 && "border-r-0"
                    )}
                  >
                    <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400">
                      DAY {day.dayNumber}
                    </div>

                    <div className="mt-3">
                      {day.workout ? (
                        <CalendarProgramWorkoutCard workout={day.workout} />
                      ) : null}
                    </div>
                  </div>
                ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProgramsTable({
  onOpenCalendarProgram,
}: {
  onOpenCalendarProgram: (programId: ProgramRow["id"]) => void
}) {
  return (
    <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
      <div className="grid grid-cols-[minmax(0,1fr)_180px_56px] items-center border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-[13px] font-medium text-neutral-900">
        <div>Program</div>
        <div>Type</div>
        <div />
      </div>

      {programRows.map((program) => {
        const isFixedProgram = program.type === "Fixed"
        const rowClassName = `grid grid-cols-[minmax(0,1fr)_180px_56px] items-center border-b border-neutral-200 px-5 py-4 text-left last:border-b-0 ${
          isFixedProgram
            ? "w-full cursor-pointer transition-colors hover:bg-neutral-50"
            : ""
        }`

        const rowContent = isFixedProgram ? (
          <button type="button" className={rowClassName}>
            <div className="min-w-0">
              <div className="truncate text-[15px] font-medium text-neutral-950">
                {program.name}
              </div>
            </div>
            <div>
              <ProgramTypeBadge type={program.type} />
            </div>
            <div className="flex justify-end">
              <span className="inline-flex size-8 items-center justify-center rounded-sm border border-neutral-200 bg-white text-neutral-500 shadow-none transition-colors group-hover:bg-neutral-50 group-hover:text-neutral-700">
                <IconDots className="size-4" />
              </span>
            </div>
          </button>
        ) : (
          <button
            type="button"
            className={`${rowClassName} w-full cursor-pointer transition-colors hover:bg-neutral-50`}
            onClick={() => onOpenCalendarProgram(program.id)}
          >
            <div className="min-w-0">
              <div className="truncate text-[15px] font-medium text-neutral-950">
                {program.name}
              </div>
            </div>
            <div>
              <ProgramTypeBadge type={program.type} />
            </div>
            <div className="flex justify-end">
              <span className="inline-flex size-8 items-center justify-center rounded-sm border border-neutral-200 bg-white text-neutral-500 shadow-none">
                <IconDots className="size-4" />
              </span>
            </div>
          </button>
        )

        if (!isFixedProgram) {
          return <React.Fragment key={program.id}>{rowContent}</React.Fragment>
        }

        return (
          <FixedProgramEditorDialog
            key={program.id}
            program={getFixedProgramEditorProgram(program.id, program.name)}
            trigger={rowContent}
          />
        )
      })}
    </div>
  )
}

function TemplatesTable() {
  return (
    <div className="space-y-4">
      <ProgramsSearchBar placeholder="Isci template..." />

      <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
      <div className="grid grid-cols-[minmax(0,1fr)_120px_220px_56px] items-center border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-[13px] font-medium text-neutral-900">
        <div>Workout</div>
        <div className="flex items-center gap-2">
          <Search className="size-3.5 text-neutral-400" />
          <span>Exercises</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Tags</span>
          <IconFilter className="size-3.5 text-neutral-400" />
        </div>
        <div />
      </div>

      {templateRows.map((template) => (
        <div
          key={template.id}
          className="grid grid-cols-[minmax(0,1fr)_120px_220px_56px] items-center border-b border-neutral-200 px-5 py-3.5 last:border-b-0"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex size-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${template.tone} text-[11px] font-semibold text-white`}
            >
              {template.name
                .split(" ")
                .slice(0, 2)
                .map((part) => part[0])
                .join("")}
            </div>
            <div className="min-w-0 truncate text-[15px] font-medium text-neutral-950">
              {template.name}
            </div>
          </div>
          <div className="text-[15px] text-neutral-900">{template.exercises}</div>
          <div className="flex flex-wrap items-center gap-2">
            {template.tags.map((tag) => (
              <Badge
                key={`${template.id}-${tag}`}
                className="rounded-sm border border-blue-200 bg-blue-50 px-2 py-0.5 text-[12px] font-medium text-blue-700 shadow-none hover:bg-blue-50"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8 rounded-sm border-neutral-200 bg-white text-neutral-500 shadow-none hover:bg-neutral-50 hover:text-neutral-700"
            >
              <IconDots className="size-4" />
            </Button>
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}

function ExercisesTable() {
  return (
    <div className="space-y-4">
      <ProgramsSearchBar
        placeholder="Search exercise"
        action={
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 shrink-0 rounded-sm border-neutral-200 bg-white text-neutral-500 shadow-none hover:bg-neutral-50 hover:text-neutral-700"
          >
            <IconFilter className="size-4" />
          </Button>
        }
      />

      <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
        <div className="grid grid-cols-[minmax(0,1fr)_240px_120px] items-center border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-[13px] font-medium text-neutral-900">
          <div>Name ({exerciseRows.length})</div>
          <div>Primary Focus</div>
          <div>Custom</div>
        </div>

        {exerciseRows.map((exercise) => (
          <div
            key={exercise.id}
            className="grid grid-cols-[minmax(0,1fr)_240px_120px] items-center border-b border-neutral-200 px-5 py-3.5 last:border-b-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-neutral-500">
                <IconBarbell className="size-4" />
              </div>
              <div className="min-w-0 truncate text-[15px] font-medium text-neutral-950">
                {exercise.name}
              </div>
            </div>
            <div className="text-[14px] text-neutral-900">{exercise.focus}</div>
            <div className="flex items-center justify-start">
              <AddExerciseDialog
                trigger={
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-sm text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-brand-500"
                  >
                    <IconUser
                      className={`size-4 ${
                        exercise.custom ? "text-brand-500" : "text-neutral-300"
                      }`}
                    />
                  </button>
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProgramSection({
  heading,
  description,
  action,
  children,
}: {
  heading: string
  description: string
  action?: React.ReactNode
  children?: React.ReactNode
}) {
  if (children) {
    return <div className="bg-neutral-50 p-4">{children}</div>
  }

  return (
    <div className="bg-neutral-50 p-4">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-sm border-neutral-200 bg-white shadow-none">
          <CardHeader className="space-y-1 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-[15px] font-semibold text-neutral-900">
                  {heading}
                </CardTitle>
                <CardDescription className="text-[13px] text-neutral-500">
                  {description}
                </CardDescription>
              </div>
              {action}
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {children ?? (
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-sm border border-neutral-200 bg-neutral-50 p-4">
                  <div className="text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-400">
                    Status
                  </div>
                  <div className="mt-2 text-[20px] font-semibold text-neutral-900">
                    Active
                  </div>
                </div>
                <div className="rounded-sm border border-neutral-200 bg-neutral-50 p-4">
                  <div className="text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-400">
                    Items
                  </div>
                  <div className="mt-2 text-[20px] font-semibold text-neutral-900">
                    12
                  </div>
                </div>
                <div className="rounded-sm border border-neutral-200 bg-neutral-50 p-4">
                  <div className="text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-400">
                    Updated
                  </div>
                  <div className="mt-2 text-[20px] font-semibold text-neutral-900">
                    Today
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-sm border-neutral-200 bg-white shadow-none">
          <CardHeader className="space-y-1 px-5 py-4">
            <CardTitle className="text-[15px] font-semibold text-neutral-900">
              Overview
            </CardTitle>
            <CardDescription className="text-[13px] text-neutral-500">
              Hiter pregled izbranega taba.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 text-[14px] leading-6 text-neutral-600">
            Ta pogled je pripravljen za nadaljnjo vsebino. Glavni cilj tukaj je
            enak glavni nav vzorec kot drugje v aplikaciji, da ostane UI
            konsistenten in predvidljiv po celotni aplikaciji.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ProgramiPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeTab =
    mainTabs.find((tab) => tab.value === searchParams.get("tab"))?.value ??
    "programs"

  const selectedCalendarProgram =
    activeTab === "programs"
      ? calendarProgramDetails.find(
          (program) => program.id === searchParams.get("programId")
        ) ?? null
      : null

  function pushSearchParams(
    updater: (params: URLSearchParams) => void
  ) {
    const nextParams = new URLSearchParams(searchParams.toString())
    updater(nextParams)

    const nextQueryString = nextParams.toString()
    router.push(
      nextQueryString ? `${pathname}?${nextQueryString}` : pathname
    )
  }

  function handleTabChange(nextTab: string) {
    pushSearchParams((params) => {
      params.set("tab", nextTab)
      params.delete("programId")
    })
  }

  function handleOpenCalendarProgram(programId: ProgramRow["id"]) {
    pushSearchParams((params) => {
      params.set("tab", "programs")
      params.set("programId", programId)
    })
  }

  function handleCloseCalendarProgram() {
    pushSearchParams((params) => {
      params.delete("programId")
    })
  }

  return (
    <section className="min-w-0 bg-neutral-50">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="min-w-0 w-full gap-0"
      >
        <div className="border-b border-neutral-200 bg-neutral-50">
          <div className="flex min-w-0 items-center justify-between gap-4 px-4">
            <div className="min-w-0 flex-1 overflow-x-auto">
              <TabsList
                variant="line"
                className="w-max min-w-full justify-start gap-0 rounded-none bg-transparent p-0"
              >
                {mainTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={profileTabTriggerClassName}
                  >
                    {tab.icon}
                    {tab.label}
                  </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            {!selectedCalendarProgram ? (
              <Button className="shrink-0 border-transparent bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700">
                <IconPlus className="size-4" />
                Program
              </Button>
            ) : null}
          </div>
        </div>

        {mainTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-0 space-y-0">
            {tab.value === "programs" && selectedCalendarProgram ? (
              <ProgramCalendarDetailView
                program={selectedCalendarProgram}
                onBack={handleCloseCalendarProgram}
              />
            ) : (
              <ProgramSection
                heading={tab.label}
                description={tab.description}
              >
                {tab.value === "programs" ? (
                  <ProgramsTable
                    onOpenCalendarProgram={handleOpenCalendarProgram}
                  />
                ) : tab.value === "templates" ? (
                  <TemplatesTable />
                ) : tab.value === "exercises" ? (
                  <ExercisesTable />
                ) : undefined}
              </ProgramSection>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
