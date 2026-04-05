"use client"

import * as React from "react"
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Info,
  ListFilter,
  Minus,
  Sparkles,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  formatProgramBuilderTempo,
  PROGRAM_BUILDER_INTENSIFIERS,
  PROGRAM_BUILDER_MUSCLE_CLASSES,
} from "@/lib/programs/program-builder-data"
import { cn } from "@/lib/utils"
import type { ProgramBuilderMuscle } from "@/types"

type ProgressionVerdict = "progressing" | "flat" | "needs-attention"
type DayStatus = "done" | "missed" | "rest"
type SortMode = "priority" | "order"
type IntensifierType = keyof typeof PROGRAM_BUILDER_INTENSIFIERS

type ProgramProgressSet = {
  id: string
  target: string
  weight: number
  reps: number
  dW: number
  dR: number
  tempo?: Parameters<typeof formatProgramBuilderTempo>[0]
  rpe?: number
  rir?: number
  intensifier?: {
    type: IntensifierType
    params: Record<string, number>
  }
  note?: string
}

type ProgramProgressExercise = {
  id: string
  name: string
  muscle: ProgramBuilderMuscle
  progression: ProgressionVerdict
  weeksStuck?: number
  clues?: string
  sets: ProgramProgressSet[]
}

type ProgramProgressDay = {
  id: string
  shortLabel: string
  longLabel: string
  title: string
  status: DayStatus
  lastSameLabel?: string
  exercises: ProgramProgressExercise[]
}

type ProgramProgressWeek = {
  id: number
  label: string
  dateRange: string
  volumeChange: number
  coachSummary: string
  days: ProgramProgressDay[]
}

type ExerciseHistoryPoint = {
  week: string
  weight: number
  reps: number
  progression: ProgressionVerdict
}

type DayVolumePoint = {
  week: string
  tonnage: number
  status: Exclude<DayStatus, "rest">
  progressionRate: number
}

type WeeklyAlert = {
  id: string
  tone: "warning" | "negative"
  title: string
  detail: string
}

const PROGRESSION_META: Record<
  ProgressionVerdict,
  {
    label: string
    icon: React.ComponentType<{ className?: string }>
    badgeClassName: string
    accentClassName: string
    dotClassName: string
    chartColor: string
  }
> = {
  progressing: {
    label: "Progressing",
    icon: TrendingUp,
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
    accentClassName: "border-l-emerald-400",
    dotClassName: "bg-emerald-500",
    chartColor: "#10b981",
  },
  flat: {
    label: "Flat",
    icon: Minus,
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-700",
    accentClassName: "border-l-amber-400",
    dotClassName: "bg-amber-400",
    chartColor: "#f59e0b",
  },
  "needs-attention": {
    label: "Needs attention",
    icon: TrendingDown,
    badgeClassName: "border-rose-200 bg-rose-50 text-rose-700",
    accentClassName: "border-l-rose-400",
    dotClassName: "bg-rose-500",
    chartColor: "#f43f5e",
  },
}

const DAY_STATUS_META: Record<
  DayStatus,
  {
    label: string
    icon: React.ComponentType<{ className?: string }>
    iconClassName: string
    chipClassName: string
  }
> = {
  done: {
    label: "Completed",
    icon: Check,
    iconClassName: "border border-emerald-200 bg-emerald-50 text-emerald-700",
    chipClassName: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  missed: {
    label: "Missed",
    icon: XCircle,
    iconClassName: "border border-rose-200 bg-rose-50 text-rose-700",
    chipClassName: "border-rose-200 bg-rose-50 text-rose-700",
  },
  rest: {
    label: "Rest",
    icon: Minus,
    iconClassName: "border border-neutral-200 bg-neutral-100 text-neutral-500",
    chipClassName: "border-neutral-200 bg-neutral-100 text-neutral-600",
  },
}

const DAY_VOLUME_BAR_COLORS = {
  done: "#93c5fd",
  missed: "#fecdd3",
}

function createSet(
  id: string,
  target: string,
  weight: number,
  reps: number,
  dW: number,
  dR: number,
  extras?: Partial<
    Omit<ProgramProgressSet, "id" | "target" | "weight" | "reps" | "dW" | "dR">
  >
): ProgramProgressSet {
  return {
    id,
    target,
    weight,
    reps,
    dW,
    dR,
    ...extras,
  }
}

function createExercise(
  id: string,
  name: string,
  muscle: ProgramBuilderMuscle,
  progression: ProgressionVerdict,
  sets: ProgramProgressSet[],
  extras?: Partial<
    Omit<ProgramProgressExercise, "id" | "name" | "muscle" | "progression" | "sets">
  >
): ProgramProgressExercise {
  return {
    id,
    name,
    muscle,
    progression,
    sets,
    ...extras,
  }
}

function createDay(
  id: string,
  shortLabel: string,
  longLabel: string,
  title: string,
  status: DayStatus,
  exercises: ProgramProgressExercise[] = [],
  extras?: Partial<
    Omit<
      ProgramProgressDay,
      "id" | "shortLabel" | "longLabel" | "title" | "status" | "exercises"
    >
  >
): ProgramProgressDay {
  return {
    id,
    shortLabel,
    longLabel,
    title,
    status,
    exercises,
    ...extras,
  }
}

const PROGRAM_PROGRESS_WEEK_14: ProgramProgressWeek = {
  id: 14,
  label: "Week 14",
  dateRange: "Mar 31 - Apr 6",
  volumeChange: 4.2,
  coachSummary:
    "Squat and Overhead Press are trending up, but Bench Press has now stalled for three weeks. Lateral Raise dropped off after shoulder irritation, so this week is a good place to reduce isolation volume and push harder on compounds.",
  days: [
    createDay("mon", "Mon", "Monday", "Push A", "done", [
      createExercise(
        "bench-press",
        "Bench Press",
        "Chest",
        "flat",
        [
          createSet("bench-1", "6-8", 95, 8, 0, 0, {
            rpe: 8,
            tempo: { ecc: 3, pause1: 1, con: 1, pause2: 0 },
          }),
          createSet("bench-2", "6-8", 95, 7, 0, -1, { rpe: 9 }),
          createSet("bench-3", "8-10", 87.5, 9, 0, 1, {
            intensifier: { type: "drop", params: { drops: 3 } },
            note: "Drop set was smoother than last week.",
          }),
        ],
        {
          clues:
            "Brace hard through the unrack and drive your feet before each press.",
          weeksStuck: 3,
        }
      ),
      createExercise(
        "ohp",
        "Overhead Press",
        "Shoulders",
        "progressing",
        [
          createSet("ohp-1", "8-10", 57.5, 10, 2.5, 0, { rpe: 8 }),
          createSet("ohp-2", "8-10", 57.5, 8, 2.5, -1, {
            intensifier: { type: "rp", params: { rest: 15 } },
          }),
          createSet("ohp-3", "8-10", 55, 9, 0, 1),
        ],
        {
          clues: "Keep ribs stacked and finish with biceps next to ears.",
        }
      ),
      createExercise(
        "incline-db",
        "Incline Dumbbell Press",
        "Chest",
        "progressing",
        [
          createSet("idb-1", "8-12", 30, 11, 2, 0),
          createSet("idb-2", "8-12", 30, 10, 2, -1),
          createSet("idb-3", "10-12", 28, 12, 0, 1, { rir: 1 }),
        ],
        {
          clues:
            "Let the elbows track slightly under the dumbbells instead of flaring.",
        }
      ),
      createExercise(
        "lateral-raise",
        "Lateral Raise",
        "Shoulders",
        "needs-attention",
        [
          createSet("lat-1", "12-15", 9, 13, -1, 1),
          createSet("lat-2", "12-15", 9, 12, -1, 0),
          createSet("lat-3", "15-20", 8, 16, -1, 1, {
            intensifier: { type: "myo", params: { miniSets: 4, reps: 3 } },
            note: "Shoulder felt better after dropping load slightly.",
          }),
        ],
        {
          clues: "Lead with elbows and stop just below shoulder height.",
        }
      ),
    ], { lastSameLabel: "vs Mar 24" }),
    createDay("tue", "Tue", "Tuesday", "Rest Day", "rest"),
    createDay("wed", "Wed", "Wednesday", "Pull A", "done", [
      createExercise(
        "barbell-row",
        "Barbell Row",
        "Back",
        "progressing",
        [
          createSet("row-1", "6-8", 90, 8, 2.5, 0),
          createSet("row-2", "6-8", 90, 7, 2.5, -1),
          createSet("row-3", "8-10", 85, 9, 0, 1, {
            tempo: { ecc: 2, pause1: 0, con: 1, pause2: 0 },
          }),
        ],
        {
          clues: "Keep torso locked and pull elbows toward the hips.",
        }
      ),
      createExercise(
        "lat-pulldown",
        "Lat Pulldown",
        "Back",
        "progressing",
        [
          createSet("pulldown-1", "8-12", 72.5, 11, 2.5, 0),
          createSet("pulldown-2", "8-12", 72.5, 9, 2.5, -1),
          createSet("pulldown-3", "10-12", 67.5, 12, 0, 1),
        ],
        {
          clues:
            "Start by driving shoulder blades down before bending the elbows.",
        }
      ),
      createExercise(
        "face-pull",
        "Face Pull",
        "Shoulders",
        "flat",
        [
          createSet("fp-1", "15-20", 25, 18, 0, 0),
          createSet("fp-2", "15-20", 25, 17, 0, 0),
          createSet("fp-3", "15-20", 22.5, 20, 0, 1, { rir: 2 }),
        ],
        {
          clues: "Finish with thumbs behind ears and keep neck relaxed.",
        }
      ),
      createExercise(
        "db-curl",
        "Dumbbell Curl",
        "Arms",
        "progressing",
        [
          createSet("curl-1", "10-12", 14, 12, 1, 0),
          createSet("curl-2", "10-12", 14, 11, 1, -1),
          createSet("curl-3", "12-15", 12, 14, 0, 1, { rpe: 8 }),
        ],
        {
          clues: "Keep shoulders quiet and finish with full supination.",
        }
      ),
    ], { lastSameLabel: "vs Mar 26" }),
    createDay("thu", "Thu", "Thursday", "Rest Day", "rest"),
    createDay("fri", "Fri", "Friday", "Legs", "done", [
      createExercise(
        "squat",
        "Back Squat",
        "Legs",
        "progressing",
        [
          createSet("sq-1", "5-6", 120, 6, 5, 0, { rpe: 9 }),
          createSet("sq-2", "5-6", 120, 5, 5, -1),
          createSet("sq-3", "6-8", 115, 7, 2.5, 0),
          createSet("sq-4", "8-10", 110, 8, 0, 1, { rir: 1 }),
        ],
        {
          clues:
            "Take a full breath before descent and keep knees pushing out.",
        }
      ),
      createExercise(
        "rdl",
        "Romanian Deadlift",
        "Legs",
        "progressing",
        [
          createSet("rdl-1", "8-10", 100, 10, 5, 0),
          createSet("rdl-2", "8-10", 100, 8, 5, -1),
          createSet("rdl-3", "10-12", 95, 10, 0, 0, {
            intensifier: { type: "rp", params: { rest: 15 } },
          }),
        ],
        {
          clues: "Push hips back and keep lats on the whole time.",
        }
      ),
      createExercise(
        "leg-press",
        "Leg Press",
        "Legs",
        "flat",
        [
          createSet("lp-1", "10-12", 200, 12, 0, 0),
          createSet("lp-2", "10-12", 200, 11, 0, 0),
          createSet("lp-3", "12-15", 180, 13, 0, 1, {
            intensifier: { type: "drop", params: { drops: 2 } },
          }),
        ],
        {
          clues:
            "Stay controlled in the bottom and avoid locking out hard.",
        }
      ),
      createExercise(
        "leg-curl",
        "Leg Curl",
        "Legs",
        "progressing",
        [
          createSet("lc-1", "10-12", 55, 13, 2.5, 0),
          createSet("lc-2", "10-12", 55, 11, 2.5, -1),
          createSet("lc-3", "12-15", 50, 14, 0, 1),
        ],
        {
          clues: "Drive heels to glutes and pause for a beat at the top.",
        }
      ),
    ], { lastSameLabel: "vs Mar 28" }),
    createDay("sat", "Sat", "Saturday", "Upper B", "missed", [], {
      lastSameLabel: "vs Mar 30",
    }),
    createDay("sun", "Sun", "Sunday", "Rest Day", "rest"),
  ],
}

const PROGRAM_PROGRESS_WEEK_13: ProgramProgressWeek = {
  id: 13,
  label: "Week 13",
  dateRange: "Mar 24 - Mar 30",
  volumeChange: 1.8,
  coachSummary:
    "A mostly solid week with one missed Upper B session. Bench stayed flat again, but Pull A and Legs continued to move forward. Priority for next block is getting Saturday adherence back up.",
  days: [
    createDay("mon", "Mon", "Monday", "Push A", "done", [
      createExercise(
        "bench-press",
        "Bench Press",
        "Chest",
        "flat",
        [
          createSet("bench-1", "6-8", 95, 8, 0, 0),
          createSet("bench-2", "6-8", 95, 8, 0, 0),
          createSet("bench-3", "8-10", 87.5, 8, 0, 0, {
            intensifier: { type: "drop", params: { drops: 3 } },
          }),
        ],
        {
          clues:
            "Brace hard through the unrack and drive your feet before each press.",
          weeksStuck: 2,
        }
      ),
      createExercise("ohp", "Overhead Press", "Shoulders", "progressing", [
        createSet("ohp-1", "8-10", 55, 10, 0, 1),
        createSet("ohp-2", "8-10", 55, 9, 0, 1),
        createSet("ohp-3", "8-10", 55, 8, 2.5, -1),
      ]),
      createExercise("incline-db", "Incline Dumbbell Press", "Chest", "progressing", [
        createSet("idb-1", "8-12", 28, 12, 2, 0),
        createSet("idb-2", "8-12", 28, 11, 2, -1),
        createSet("idb-3", "10-12", 26, 12, 0, 0),
      ]),
      createExercise("lateral-raise", "Lateral Raise", "Shoulders", "flat", [
        createSet("lat-1", "12-15", 10, 12, 0, 0),
        createSet("lat-2", "12-15", 10, 12, 0, 0),
        createSet("lat-3", "15-20", 8, 15, 0, 0),
      ]),
    ], { lastSameLabel: "vs Mar 17" }),
    createDay("tue", "Tue", "Tuesday", "Rest Day", "rest"),
    createDay("wed", "Wed", "Wednesday", "Pull A", "done", [
      createExercise("barbell-row", "Barbell Row", "Back", "progressing", [
        createSet("row-1", "6-8", 87.5, 8, 2.5, 0),
        createSet("row-2", "6-8", 87.5, 8, 2.5, 1),
        createSet("row-3", "8-10", 85, 8, 2.5, 0),
      ]),
      createExercise("lat-pulldown", "Lat Pulldown", "Back", "progressing", [
        createSet("pulldown-1", "8-12", 70, 10, 2.5, 0),
        createSet("pulldown-2", "8-12", 70, 9, 2.5, -1),
        createSet("pulldown-3", "10-12", 65, 11, 0, 0),
      ]),
      createExercise("face-pull", "Face Pull", "Shoulders", "flat", [
        createSet("fp-1", "15-20", 25, 17, 0, 0),
        createSet("fp-2", "15-20", 25, 16, 0, 0),
        createSet("fp-3", "15-20", 22.5, 18, 0, 0),
      ]),
      createExercise("db-curl", "Dumbbell Curl", "Arms", "progressing", [
        createSet("curl-1", "10-12", 13, 14, 1, 0),
        createSet("curl-2", "10-12", 13, 12, 1, -1),
        createSet("curl-3", "12-15", 12, 13, 0, 0),
      ]),
    ], { lastSameLabel: "vs Mar 19" }),
    createDay("thu", "Thu", "Thursday", "Rest Day", "rest"),
    createDay("fri", "Fri", "Friday", "Legs", "done", [
      createExercise("squat", "Back Squat", "Legs", "progressing", [
        createSet("sq-1", "5-6", 115, 6, 2.5, 0),
        createSet("sq-2", "5-6", 115, 6, 2.5, 0),
        createSet("sq-3", "6-8", 112.5, 7, 2.5, 0),
        createSet("sq-4", "8-10", 110, 7, 5, -1),
      ]),
      createExercise("rdl", "Romanian Deadlift", "Legs", "progressing", [
        createSet("rdl-1", "8-10", 95, 10, 5, -1),
        createSet("rdl-2", "8-10", 95, 9, 5, -1),
        createSet("rdl-3", "10-12", 90, 10, 2.5, 0),
      ]),
      createExercise("leg-press", "Leg Press", "Legs", "flat", [
        createSet("lp-1", "10-12", 190, 12, 0, 0),
        createSet("lp-2", "10-12", 190, 11, 0, 0),
        createSet("lp-3", "12-15", 175, 12, 0, 0),
      ]),
      createExercise("leg-curl", "Leg Curl", "Legs", "progressing", [
        createSet("lc-1", "10-12", 52.5, 13, 2.5, 0),
        createSet("lc-2", "10-12", 52.5, 12, 2.5, 0),
        createSet("lc-3", "12-15", 47.5, 13, 0, 0),
      ]),
    ], { lastSameLabel: "vs Mar 21" }),
    createDay("sat", "Sat", "Saturday", "Upper B", "done", [
      createExercise("incline-bench", "Incline Bench", "Chest", "progressing", [
        createSet("ib-1", "8-10", 77.5, 10, 2.5, 0),
        createSet("ib-2", "8-10", 77.5, 8, 2.5, -1),
        createSet("ib-3", "10-12", 72.5, 10, 2.5, 0),
      ]),
      createExercise("cable-row", "Cable Row", "Back", "progressing", [
        createSet("cr-1", "10-12", 62.5, 14, 2.5, 1),
        createSet("cr-2", "10-12", 62.5, 12, 2.5, 0),
        createSet("cr-3", "12-15", 60, 13, 0, 0),
      ]),
      createExercise("db-shoulder-press", "DB Shoulder Press", "Shoulders", "flat", [
        createSet("sp-1", "8-10", 24, 10, 0, 0),
        createSet("sp-2", "8-10", 24, 9, 0, 0),
        createSet("sp-3", "10-12", 22, 10, 0, 0),
      ]),
    ], { lastSameLabel: "vs Mar 22" }),
    createDay("sun", "Sun", "Sunday", "Rest Day", "rest"),
  ],
}

const PROGRAM_PROGRESS_WEEK_12: ProgramProgressWeek = {
  id: 12,
  label: "Week 12",
  dateRange: "Mar 17 - Mar 23",
  volumeChange: 3.1,
  coachSummary:
    "Progress was still moving well here, especially on Pull A and Legs. This is the last week Bench felt fresh before it started flattening out.",
  days: [
    createDay("mon", "Mon", "Monday", "Push A", "done", [
      createExercise("bench-press", "Bench Press", "Chest", "flat", [
        createSet("bench-1", "6-8", 95, 8, 2.5, 0),
        createSet("bench-2", "6-8", 95, 8, 2.5, 0),
        createSet("bench-3", "8-10", 92.5, 8, 2.5, -1),
      ]),
      createExercise("ohp", "Overhead Press", "Shoulders", "progressing", [
        createSet("ohp-1", "8-10", 55, 9, 2.5, 0),
        createSet("ohp-2", "8-10", 55, 8, 2.5, -1),
        createSet("ohp-3", "8-10", 52.5, 9, 0, 1),
      ]),
      createExercise("incline-db", "Incline Dumbbell Press", "Chest", "progressing", [
        createSet("idb-1", "8-12", 28, 11, 2, 0),
        createSet("idb-2", "8-12", 28, 10, 2, 0),
        createSet("idb-3", "10-12", 26, 11, 0, 0),
      ]),
    ]),
    createDay("tue", "Tue", "Tuesday", "Rest Day", "rest"),
    createDay("wed", "Wed", "Wednesday", "Pull A", "done", [
      createExercise("barbell-row", "Barbell Row", "Back", "progressing", [
        createSet("row-1", "6-8", 85, 8, 2.5, 0),
        createSet("row-2", "6-8", 85, 8, 2.5, 0),
        createSet("row-3", "8-10", 82.5, 9, 2.5, 1),
      ]),
      createExercise("lat-pulldown", "Lat Pulldown", "Back", "progressing", [
        createSet("pulldown-1", "8-12", 67.5, 10, 2.5, 0),
        createSet("pulldown-2", "8-12", 67.5, 9, 2.5, 0),
        createSet("pulldown-3", "10-12", 62.5, 11, 2.5, 0),
      ]),
    ]),
    createDay("thu", "Thu", "Thursday", "Rest Day", "rest"),
    createDay("fri", "Fri", "Friday", "Legs", "done", [
      createExercise("squat", "Back Squat", "Legs", "progressing", [
        createSet("sq-1", "5-6", 112.5, 6, 2.5, 0),
        createSet("sq-2", "5-6", 112.5, 6, 2.5, 0),
        createSet("sq-3", "6-8", 110, 7, 2.5, 0),
      ]),
      createExercise("rdl", "Romanian Deadlift", "Legs", "progressing", [
        createSet("rdl-1", "8-10", 90, 10, 2.5, 0),
        createSet("rdl-2", "8-10", 90, 9, 2.5, 0),
        createSet("rdl-3", "10-12", 85, 10, 2.5, 0),
      ]),
    ]),
    createDay("sat", "Sat", "Saturday", "Upper B", "done", [
      createExercise("incline-bench", "Incline Bench", "Chest", "progressing", [
        createSet("ib-1", "8-10", 75, 10, 2.5, 0),
        createSet("ib-2", "8-10", 75, 9, 2.5, 0),
        createSet("ib-3", "10-12", 72.5, 10, 2.5, 0),
      ]),
    ]),
    createDay("sun", "Sun", "Sunday", "Rest Day", "rest"),
  ],
}

const PROGRAM_PROGRESS_WEEK_11: ProgramProgressWeek = {
  id: 11,
  label: "Week 11",
  dateRange: "Mar 10 - Mar 16",
  volumeChange: 2.4,
  coachSummary:
    "Good output overall, but Pull A was missed, which dragged adherence down. Lower body still improved despite the missed midweek session.",
  days: [
    createDay("mon", "Mon", "Monday", "Push A", "done", [
      createExercise("bench-press", "Bench Press", "Chest", "progressing", [
        createSet("bench-1", "6-8", 92.5, 8, 2.5, 0),
        createSet("bench-2", "6-8", 92.5, 8, 2.5, 0),
        createSet("bench-3", "8-10", 90, 8, 2.5, 0),
      ]),
      createExercise("ohp", "Overhead Press", "Shoulders", "flat", [
        createSet("ohp-1", "8-10", 52.5, 9, 0, 0),
        createSet("ohp-2", "8-10", 52.5, 8, 0, 0),
      ]),
    ]),
    createDay("tue", "Tue", "Tuesday", "Rest Day", "rest"),
    createDay("wed", "Wed", "Wednesday", "Pull A", "missed"),
    createDay("thu", "Thu", "Thursday", "Rest Day", "rest"),
    createDay("fri", "Fri", "Friday", "Legs", "done", [
      createExercise("squat", "Back Squat", "Legs", "progressing", [
        createSet("sq-1", "5-6", 110, 6, 2.5, 0),
        createSet("sq-2", "5-6", 110, 6, 2.5, 0),
        createSet("sq-3", "6-8", 107.5, 7, 2.5, 0),
      ]),
      createExercise("rdl", "Romanian Deadlift", "Legs", "flat", [
        createSet("rdl-1", "8-10", 87.5, 10, 0, 0),
        createSet("rdl-2", "8-10", 87.5, 9, 0, 0),
      ]),
    ]),
    createDay("sat", "Sat", "Saturday", "Upper B", "done", [
      createExercise("incline-bench", "Incline Bench", "Chest", "progressing", [
        createSet("ib-1", "8-10", 72.5, 10, 2.5, 0),
        createSet("ib-2", "8-10", 72.5, 9, 2.5, 0),
      ]),
    ]),
    createDay("sun", "Sun", "Sunday", "Rest Day", "rest"),
  ],
}

const PROGRAM_PROGRESS_WEEK_10: ProgramProgressWeek = {
  id: 10,
  label: "Week 10",
  dateRange: "Mar 3 - Mar 9",
  volumeChange: -0.6,
  coachSummary:
    "A fatigue-heavy week. Pressing patterns dipped and the overall volume was slightly down. The following week bounced back, so this looks more like a short recovery dip than a program issue.",
  days: [
    createDay("mon", "Mon", "Monday", "Push A", "done", [
      createExercise("bench-press", "Bench Press", "Chest", "needs-attention", [
        createSet("bench-1", "6-8", 90, 8, -2.5, 0),
        createSet("bench-2", "6-8", 90, 7, -2.5, -1),
        createSet("bench-3", "8-10", 87.5, 8, 0, 0),
      ]),
      createExercise("ohp", "Overhead Press", "Shoulders", "needs-attention", [
        createSet("ohp-1", "8-10", 50, 9, -2.5, 0),
        createSet("ohp-2", "8-10", 50, 8, -2.5, -1),
      ]),
    ]),
    createDay("tue", "Tue", "Tuesday", "Rest Day", "rest"),
    createDay("wed", "Wed", "Wednesday", "Pull A", "done", [
      createExercise("barbell-row", "Barbell Row", "Back", "progressing", [
        createSet("row-1", "6-8", 82.5, 8, 2.5, 0),
        createSet("row-2", "6-8", 82.5, 7, 2.5, -1),
      ]),
    ]),
    createDay("thu", "Thu", "Thursday", "Rest Day", "rest"),
    createDay("fri", "Fri", "Friday", "Legs", "done", [
      createExercise("squat", "Back Squat", "Legs", "flat", [
        createSet("sq-1", "5-6", 107.5, 6, 0, 0),
        createSet("sq-2", "5-6", 107.5, 5, 0, -1),
      ]),
    ]),
    createDay("sat", "Sat", "Saturday", "Upper B", "done", [
      createExercise("incline-bench", "Incline Bench", "Chest", "progressing", [
        createSet("ib-1", "8-10", 70, 10, 2.5, 0),
        createSet("ib-2", "8-10", 70, 9, 2.5, 0),
      ]),
    ]),
    createDay("sun", "Sun", "Sunday", "Rest Day", "rest"),
  ],
}

const PROGRAM_PROGRESS_WEEKS: ProgramProgressWeek[] = [
  PROGRAM_PROGRESS_WEEK_14,
  PROGRAM_PROGRESS_WEEK_13,
  PROGRAM_PROGRESS_WEEK_12,
  PROGRAM_PROGRESS_WEEK_11,
  PROGRAM_PROGRESS_WEEK_10,
]

function getWorkDays(week: ProgramProgressWeek) {
  return week.days.filter((day) => day.status !== "rest")
}

function getWeekExerciseEntries(week: ProgramProgressWeek) {
  return getWorkDays(week)
    .filter((day) => day.status === "done")
    .flatMap((day) => day.exercises)
}

function getDayStats(day: ProgramProgressDay) {
  const exerciseCount = day.exercises.length
  const setCount = day.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0
  )
  const tonnage = day.exercises.reduce(
    (total, exercise) =>
      total +
      exercise.sets.reduce(
        (exerciseTotal, set) => exerciseTotal + set.weight * set.reps,
        0
      ),
    0
  )

  return {
    exerciseCount,
    setCount,
    tonnage,
  }
}

function getWeekVerdict(week: ProgramProgressWeek) {
  const workDays = getWorkDays(week)
  const doneDays = workDays.filter((day) => day.status === "done")
  const exercises = getWeekExerciseEntries(week)
  const progressingCount = exercises.filter(
    (exercise) => exercise.progression === "progressing"
  ).length
  const needsAttentionCount = exercises.filter(
    (exercise) => exercise.progression === "needs-attention"
  ).length
  const adherence = workDays.length > 0 ? doneDays.length / workDays.length : 0
  const progressRate =
    exercises.length > 0 ? progressingCount / exercises.length : 0

  if (adherence >= 1 && progressRate >= 0.5) {
    return {
      label: "On Track",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    }
  }

  if (needsAttentionCount >= 2 || adherence < 0.75) {
    return {
      label: "Needs Attention",
      className: "border-rose-200 bg-rose-50 text-rose-700",
    }
  }

  return {
    label: "Solid",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  }
}

function getWeekAlerts(week: ProgramProgressWeek): WeeklyAlert[] {
  const workDays = getWorkDays(week)
  const missedDays = workDays.filter((day) => day.status === "missed")
  const stuckExercises = getWeekExerciseEntries(week).filter(
    (exercise) => (exercise.weeksStuck ?? 0) >= 2
  )
  const regressedExercises = getWeekExerciseEntries(week).filter(
    (exercise) => exercise.progression === "needs-attention"
  )
  const alerts: WeeklyAlert[] = []

  if (missedDays.length > 0) {
    alerts.push({
      id: "missed-day",
      tone: "negative",
      title: missedDays.length === 1 ? "Missed workout" : "Missed workouts",
      detail:
        missedDays.length === 1
          ? missedDays[0]?.title ?? "One planned workout was missed."
          : `${missedDays.length} planned workouts were missed this week.`,
    })
  }

  if (stuckExercises[0]) {
    alerts.push({
      id: "stuck-exercise",
      tone: "warning",
      title: "Plateau",
      detail: `${stuckExercises[0].name} has been flat for ${stuckExercises[0].weeksStuck} weeks.`,
    })
  }

  if (regressedExercises[0]) {
    alerts.push({
      id: "regression",
      tone: "negative",
      title: "Regression",
      detail: `${regressedExercises[0].name} is trending down this week.`,
    })
  }

  return alerts
}

function getExerciseTrendHistory(
  weeks: ProgramProgressWeek[],
  exerciseId: string
): ExerciseHistoryPoint[] {
  return [...weeks]
    .reverse()
    .map((week) => {
      for (const day of week.days) {
        const exercise = day.exercises.find((entry) => entry.id === exerciseId)
        if (!exercise) {
          continue
        }

        const topSet = [...exercise.sets].sort(
          (left, right) => right.weight * right.reps - left.weight * left.reps
        )[0]

        if (!topSet) {
          continue
        }

        return {
          week: `W${week.id}`,
          weight: topSet.weight,
          reps: topSet.reps,
          progression: exercise.progression,
        }
      }

      return null
    })
    .filter((point): point is ExerciseHistoryPoint => Boolean(point))
}

function getDayVolumeHistory(
  weeks: ProgramProgressWeek[],
  dayId: string
): DayVolumePoint[] {
  return [...weeks]
    .reverse()
    .map((week) => {
      const day = week.days.find((entry) => entry.id === dayId)
      if (!day || day.status === "rest") {
        return null
      }

      const doneExercises = day.status === "done" ? day.exercises : []
      const tonnage = doneExercises.reduce(
        (total, exercise) =>
          total +
          exercise.sets.reduce(
            (exerciseTotal, set) => exerciseTotal + set.weight * set.reps,
            0
          ),
        0
      )
      const progressingCount = doneExercises.filter(
        (exercise) => exercise.progression === "progressing"
      ).length

      return {
        week: `W${week.id}`,
        tonnage,
        status: day.status,
        progressionRate:
          doneExercises.length > 0 ? progressingCount / doneExercises.length : 0,
      }
    })
    .filter((point): point is DayVolumePoint => Boolean(point))
}

function formatSignedNumber(value: number, suffix = "") {
  if (value > 0) {
    return `+${value}${suffix}`
  }

  if (value < 0) {
    return `${value}${suffix}`
  }

  return `0${suffix}`
}

function formatDelta(weightDelta: number, repsDelta: number) {
  const parts: string[] = []

  if (weightDelta !== 0) {
    parts.push(`${formatSignedNumber(weightDelta, "kg")}`)
  }

  if (repsDelta !== 0) {
    parts.push(`${formatSignedNumber(repsDelta, " rep")}`)
  }

  return parts.length > 0 ? parts.join(" • ") : "No change"
}

function getDeltaClassName(weightDelta: number, repsDelta: number) {
  if (weightDelta > 0 || (weightDelta === 0 && repsDelta > 0)) {
    return "text-emerald-700"
  }

  if (weightDelta < 0 || (weightDelta === 0 && repsDelta < 0)) {
    return "text-rose-700"
  }

  return "text-neutral-500"
}

function formatTonnage(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k kg`
  }

  return `${value} kg`
}

function programProgressionOrder(value: ProgressionVerdict) {
  switch (value) {
    case "needs-attention":
      return 0
    case "flat":
      return 1
    case "progressing":
    default:
      return 2
  }
}

function ExerciseTrendTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: ExerciseHistoryPoint }>
}) {
  if (!active || !payload?.[0]) {
    return null
  }

  const point = payload[0].payload

  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[12px] shadow-lg">
      <div className="font-medium text-neutral-950">{point.week}</div>
      <div className="mt-1 text-neutral-500">
        {point.weight}kg x {point.reps}
      </div>
    </div>
  )
}

function DayVolumeTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: DayVolumePoint }>
}) {
  if (!active || !payload?.[0]) {
    return null
  }

  const point = payload[0].payload

  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[12px] shadow-lg">
      <div className="font-medium text-neutral-950">{point.week}</div>
      <div className="mt-1 text-neutral-500">
        {point.status === "missed" ? "Missed workout" : formatTonnage(point.tonnage)}
      </div>
    </div>
  )
}

function WeeklySummaryCard({
  title,
  value,
  hint,
  icon: Icon,
  accentClassName,
}: {
  title: string
  value: string
  hint: string
  icon: React.ComponentType<{ className?: string }>
  accentClassName: string
}) {
  return (
    <Card className="overflow-hidden rounded-xl border-neutral-200 bg-white py-0 shadow-none">
      <CardContent className="p-0">
        <div className={cn("h-1 w-full", accentClassName)} />
        <div className="flex items-start justify-between gap-3 px-5 py-4">
          <div>
            <div className="text-[12px] font-medium uppercase tracking-[0.12em] text-neutral-400">
              {title}
            </div>
            <div className="mt-2 text-[28px] leading-none font-semibold text-neutral-950">
              {value}
            </div>
            <div className="mt-2 text-[13px] text-neutral-500">{hint}</div>
          </div>
          <div className="rounded-full border border-neutral-200 bg-neutral-50 p-2.5">
            <Icon className="size-4 text-neutral-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DayRailItem({
  day,
  active,
  onSelect,
}: {
  day: ProgramProgressDay
  active: boolean
  onSelect: () => void
}) {
  const statusMeta = DAY_STATUS_META[day.status]
  const StatusIcon = statusMeta.icon

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border px-3 py-3 text-left transition-colors",
        active
          ? "border-brand-300 bg-brand-50/40"
          : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full",
            statusMeta.iconClassName
          )}
        >
          <StatusIcon className="size-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "text-[13px] font-medium",
              active ? "text-neutral-950" : "text-neutral-700"
            )}
          >
            {day.shortLabel} • {day.title}
          </div>

          {day.status === "done" ? (
            <div className="mt-2 flex items-center gap-1.5">
              {day.exercises.map((exercise) => (
                <span
                  key={exercise.id}
                  className={cn(
                    "inline-flex h-2.5 w-2.5 rounded-[3px]",
                    PROGRESSION_META[exercise.progression].dotClassName
                  )}
                />
              ))}
            </div>
          ) : (
            <div className="mt-2 text-[12px] text-neutral-400">
              {statusMeta.label}
            </div>
          )}
        </div>
      </div>
    </button>
  )
}

function ProgramProgressSetChip({
  label,
  className,
}: {
  label: string
  className: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-md border px-2 text-[10px] font-semibold",
        className
      )}
    >
      {label}
    </span>
  )
}

function ProgressExerciseCard({
  exercise,
  open,
  showChart,
  onToggle,
  onToggleChart,
  history,
}: {
  exercise: ProgramProgressExercise
  open: boolean
  showChart: boolean
  onToggle: () => void
  onToggleChart: () => void
  history: ExerciseHistoryPoint[]
}) {
  const progressionMeta = PROGRESSION_META[exercise.progression]
  const ProgressionIcon = progressionMeta.icon

  return (
    <Card className="overflow-hidden rounded-2xl border-neutral-200 bg-white py-0 shadow-none">
      <CardContent className="p-0">
        <div
          className={cn(
            "border-l-[3px] border-neutral-200 transition-colors",
            progressionMeta.accentClassName
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-4">
            <button
              type="button"
              onClick={onToggle}
              className="min-w-0 flex-1 text-left"
            >
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-[18px] font-semibold text-neutral-950">
                  {exercise.name}
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[11px] font-semibold shadow-none",
                    PROGRAM_BUILDER_MUSCLE_CLASSES[exercise.muscle]
                  )}
                >
                  {exercise.muscle}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[11px] font-semibold shadow-none",
                    progressionMeta.badgeClassName
                  )}
                >
                  <ProgressionIcon className="mr-1 size-3.5" />
                  {progressionMeta.label}
                </Badge>
                {exercise.weeksStuck ? (
                  <Badge
                    variant="outline"
                    className="rounded-md border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 shadow-none"
                  >
                    {exercise.weeksStuck}w plateau
                  </Badge>
                ) : null}
              </div>

              {exercise.clues ? (
                <div className="mt-2 text-[13px] leading-6 text-neutral-500">
                  {exercise.clues}
                </div>
              ) : null}
            </button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={onToggleChart}
                className={cn(
                  "rounded-lg shadow-none",
                  showChart && "border-brand-200 bg-brand-50 text-brand-700"
                )}
              >
                <BarChart3 className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="rounded-lg px-2 text-[12px] font-medium text-neutral-500 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
              >
                {open ? "Collapse" : "Expand"}
              </Button>
            </div>
          </div>

          {showChart && history.length > 1 ? (
            <div className="border-b border-neutral-200 bg-neutral-50/70 px-5 py-3">
              <div className="mb-2 text-[12px] font-medium text-neutral-500">
                Top set trend
              </div>
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={history}
                    margin={{ left: -20, right: 8, top: 6, bottom: 0 }}
                  >
                    <CartesianGrid
                      vertical={false}
                      stroke="#e5e5e5"
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey="week"
                      axisLine={false}
                      tickLine={false}
                      tickMargin={8}
                      fontSize={11}
                      stroke="#a3a3a3"
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickMargin={8}
                      width={38}
                      fontSize={11}
                      stroke="#a3a3a3"
                    />
                    <Tooltip content={<ExerciseTrendTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke={progressionMeta.chartColor}
                      strokeWidth={2.25}
                      dot={{ r: 3.5, fill: "#ffffff", strokeWidth: 2 }}
                      activeDot={{ r: 4.5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : null}

          {open ? (
            <div className="space-y-2 px-5 py-4">
              {exercise.sets.map((set, index) => (
                <div
                  key={set.id}
                  className="rounded-xl border border-neutral-200 bg-neutral-50/80 px-3.5 py-3"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                          Set {index + 1}
                        </span>
                        <span className="text-[16px] font-semibold text-neutral-950">
                          {set.weight}kg × {set.reps}
                        </span>
                        <Badge
                          variant="outline"
                          className="rounded-md border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-neutral-600 shadow-none"
                        >
                          Target {set.target}
                        </Badge>
                      </div>

                      {set.note ? (
                        <div className="mt-2 text-[13px] text-neutral-500 italic">
                          “{set.note}”
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
                      <span
                        className={cn(
                          "text-[12px] font-semibold",
                          getDeltaClassName(set.dW, set.dR)
                        )}
                      >
                        {formatDelta(set.dW, set.dR)}
                      </span>

                      {set.intensifier ? (
                        <ProgramProgressSetChip
                          label={PROGRAM_BUILDER_INTENSIFIERS[set.intensifier.type].format(
                            set.intensifier.params
                          )}
                          className={PROGRAM_BUILDER_INTENSIFIERS[set.intensifier.type].className}
                        />
                      ) : null}

                      {set.tempo ? (
                        <ProgramProgressSetChip
                          label={formatProgramBuilderTempo(set.tempo)}
                          className="border-emerald-200 bg-emerald-50 text-emerald-700"
                        />
                      ) : null}

                      {typeof set.rpe === "number" ? (
                        <ProgramProgressSetChip
                          label={`RPE ${set.rpe}`}
                          className="border-violet-200 bg-violet-50 text-violet-700"
                        />
                      ) : null}

                      {typeof set.rir === "number" ? (
                        <ProgramProgressSetChip
                          label={`RIR ${set.rir}`}
                          className="border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

function DayPlaceholder({
  title,
  description,
  icon: Icon,
  iconClassName,
}: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  iconClassName: string
}) {
  return (
    <Card className="rounded-2xl border-dashed border-neutral-200 bg-white py-0 shadow-none">
      <CardContent className="flex min-h-[360px] flex-col items-center justify-center px-6 py-10 text-center">
        <div
          className={cn(
            "inline-flex size-14 items-center justify-center rounded-full border",
            iconClassName
          )}
        >
          <Icon className="size-6" />
        </div>
        <div className="mt-5 text-[22px] font-semibold text-neutral-950">
          {title}
        </div>
        <div className="mt-2 max-w-md text-[14px] leading-6 text-neutral-500">
          {description}
        </div>
      </CardContent>
    </Card>
  )
}

export function ProgramProgressPanel() {
  const [weekIndex, setWeekIndex] = React.useState(0)
  const [selectedDayId, setSelectedDayId] = React.useState("mon")
  const [summaryExpanded, setSummaryExpanded] = React.useState(false)
  const [sortMode, setSortMode] = React.useState<SortMode>("priority")
  const [showDayTrend, setShowDayTrend] = React.useState(false)
  const [openExerciseIds, setOpenExerciseIds] = React.useState<Set<string>>(
    new Set()
  )
  const [visibleCharts, setVisibleCharts] = React.useState<Set<string>>(
    new Set()
  )

  const activeWeek = PROGRAM_PROGRESS_WEEKS[weekIndex]
  const selectedDay =
    activeWeek.days.find((day) => day.id === selectedDayId) ?? activeWeek.days[0]
  const weekVerdict = React.useMemo(() => getWeekVerdict(activeWeek), [activeWeek])
  const weekAlerts = React.useMemo(() => getWeekAlerts(activeWeek), [activeWeek])
  const workDays = React.useMemo(() => getWorkDays(activeWeek), [activeWeek])
  const doneWorkDays = React.useMemo(
    () => workDays.filter((day) => day.status === "done"),
    [workDays]
  )
  const weekExercises = React.useMemo(
    () => getWeekExerciseEntries(activeWeek),
    [activeWeek]
  )
  const progressingExercises = React.useMemo(
    () =>
      weekExercises.filter((exercise) => exercise.progression === "progressing"),
    [weekExercises]
  )
  const adherenceValue = `${doneWorkDays.length}/${workDays.length}`
  const dayStats = React.useMemo(() => getDayStats(selectedDay), [selectedDay])
  const sortedExercises = React.useMemo(() => {
    const base = [...selectedDay.exercises]
    if (sortMode === "priority") {
      return base.sort(
        (left, right) =>
          programProgressionOrder(left.progression) -
          programProgressionOrder(right.progression)
      )
    }
    return base
  }, [selectedDay.exercises, sortMode])
  const allOpen =
    sortedExercises.length > 0 &&
    sortedExercises.every((exercise) => openExerciseIds.has(exercise.id))
  const dayVolumeHistory = React.useMemo(
    () => getDayVolumeHistory(PROGRAM_PROGRESS_WEEKS, selectedDay.id),
    [selectedDay.id]
  )

  React.useEffect(() => {
    setSummaryExpanded(false)
  }, [weekIndex])

  React.useEffect(() => {
    setOpenExerciseIds(
      sortedExercises[0] ? new Set<string>([sortedExercises[0].id]) : new Set()
    )
    setVisibleCharts(new Set())
  }, [weekIndex, selectedDay.id, sortMode, sortedExercises])

  const changeWeek = React.useCallback((direction: -1 | 1) => {
    setWeekIndex((currentIndex) => {
      const nextIndex = currentIndex + direction
      if (nextIndex < 0 || nextIndex >= PROGRAM_PROGRESS_WEEKS.length) {
        return currentIndex
      }
      return nextIndex
    })
  }, [])

  const toggleExercise = React.useCallback((exerciseId: string) => {
    setOpenExerciseIds((current) => {
      const next = new Set(current)
      if (next.has(exerciseId)) {
        next.delete(exerciseId)
      } else {
        next.add(exerciseId)
      }
      return next
    })
  }, [])

  const toggleExerciseChart = React.useCallback((exerciseId: string) => {
    setVisibleCharts((current) => {
      const next = new Set(current)
      if (next.has(exerciseId)) {
        next.delete(exerciseId)
      } else {
        next.add(exerciseId)
      }
      return next
    })
  }, [])

  const toggleAllExercises = React.useCallback(() => {
    setOpenExerciseIds(
      allOpen ? new Set() : new Set(sortedExercises.map((exercise) => exercise.id))
    )
  }, [allOpen, sortedExercises])

  return (
    <div className="min-w-0 bg-neutral-50">
      <div className="relative xl:flex xl:items-start">
        <Card className="relative overflow-hidden gap-0 rounded-none border-0 border-r border-neutral-200 bg-transparent py-0 shadow-none xl:sticky xl:top-[calc(var(--header-height)+3rem)] xl:left-0 xl:h-[calc(100dvh-var(--header-height)-3rem)] xl:w-[320px] xl:flex xl:flex-none xl:flex-col xl:self-start">
          <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-4">
            <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => changeWeek(1)}
              disabled={weekIndex >= PROGRAM_PROGRESS_WEEKS.length - 1}
              className="rounded-lg bg-white shadow-none"
            >
              <ChevronLeft className="size-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 min-w-0 flex-1 justify-between rounded-lg bg-white px-3 shadow-none"
                >
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-neutral-400" />
                    <div className="text-left">
                      <div className="text-[13px] font-semibold text-neutral-950">
                        {activeWeek.label}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {activeWeek.dateRange}
                      </div>
                    </div>
                  </div>
                  <ChevronsUpDown className="size-4 text-neutral-400" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="w-[320px] rounded-xl border-neutral-200 p-2"
              >
                <DropdownMenuLabel className="px-2 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                  Weeks
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-neutral-200/70" />

                {PROGRAM_PROGRESS_WEEKS.map((week, index) => {
                  const verdict = getWeekVerdict(week)
                  const summary = `${getWorkDays(week).filter((day) => day.status === "done").length}/${getWorkDays(week).length} adherence`

                  return (
                    <DropdownMenuItem
                      key={week.id}
                      onSelect={() => setWeekIndex(index)}
                      className={cn(
                        "mt-1 flex cursor-pointer items-start justify-between rounded-lg px-3 py-3 focus:bg-neutral-50",
                        index === weekIndex &&
                          "bg-brand-50 text-brand-700 focus:bg-brand-50"
                      )}
                    >
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold">
                          {week.label}
                        </div>
                        <div className="mt-0.5 text-[12px] text-neutral-500">
                          {week.dateRange}
                        </div>
                        <div className="mt-1 text-[12px] text-neutral-400">
                          {summary}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold shadow-none",
                          verdict.className
                        )}
                      >
                        {verdict.label}
                      </Badge>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => changeWeek(-1)}
              disabled={weekIndex <= 0}
              className="rounded-lg bg-white shadow-none"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 text-[12px] text-neutral-500">
            <Badge
              variant="outline"
              className={cn(
                "rounded-md px-2.5 py-1 text-[12px] font-semibold shadow-none",
                weekVerdict.className
              )}
            >
              {weekVerdict.label}
            </Badge>
            <div className="text-[13px] text-neutral-500">
              Volume {formatSignedNumber(Number(activeWeek.volumeChange.toFixed(1)), "%")}
            </div>
          </div>
          </div>

          <CardContent className="space-y-3 overflow-hidden bg-neutral-50 px-4 py-3 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col">
            <div className="space-y-2 xl:-mr-2 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:[overflow-y:overlay] xl:pr-2 [scrollbar-color:var(--color-neutral-200)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1">
              {activeWeek.days.map((day) => (
                <DayRailItem
                  key={day.id}
                  day={day}
                  active={day.id === selectedDay.id}
                  onSelect={() => setSelectedDayId(day.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="min-w-0 space-y-4 px-4 py-4 xl:flex-1">
          <div className="grid gap-4 lg:grid-cols-3">
            <WeeklySummaryCard
              title="Adherence"
              value={adherenceValue}
              hint="Completed work days"
              icon={Check}
              accentClassName="bg-emerald-400"
            />
            <WeeklySummaryCard
              title="Progressing"
              value={`${progressingExercises.length}/${weekExercises.length || 0}`}
              hint="Exercises trending up"
              icon={Sparkles}
              accentClassName="bg-brand-500"
            />
            <WeeklySummaryCard
              title="Weekly Volume"
              value={formatSignedNumber(Number(activeWeek.volumeChange.toFixed(1)), "%")}
              hint="Compared with previous week"
              icon={BarChart3}
              accentClassName={
                activeWeek.volumeChange >= 0 ? "bg-sky-400" : "bg-rose-400"
              }
            />
          </div>

          {weekAlerts.length > 0 || activeWeek.coachSummary ? (
            <Card className="rounded-2xl border-neutral-200 bg-white py-0 shadow-none">
              <CardContent className="px-5 py-4">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    {weekAlerts.map((alert) => (
                      <Badge
                        key={alert.id}
                        variant="outline"
                        className={cn(
                          "rounded-md px-2.5 py-1 text-[12px] font-semibold shadow-none",
                          alert.tone === "warning"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-rose-200 bg-rose-50 text-rose-700"
                        )}
                      >
                        {alert.tone === "warning" ? (
                          <AlertTriangle className="mr-1 size-3.5" />
                        ) : (
                          <TrendingDown className="mr-1 size-3.5" />
                        )}
                        {alert.title}: {alert.detail}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSummaryExpanded((current) => !current)}
                    className="w-fit rounded-lg px-0 text-[13px] font-medium text-neutral-500 shadow-none hover:bg-transparent hover:text-neutral-900"
                  >
                    <Info className="mr-1.5 size-4" />
                    {summaryExpanded ? "Hide summary" : "Show summary"}
                  </Button>
                </div>

                {summaryExpanded ? (
                  <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[14px] leading-6 text-neutral-600">
                    {activeWeek.coachSummary}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
          <div className="flex flex-col gap-3 border-b border-neutral-200 pb-3 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-[28px] leading-none font-semibold text-neutral-950">
                  {selectedDay.title}
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[11px] font-semibold shadow-none",
                    DAY_STATUS_META[selectedDay.status].chipClassName
                  )}
                >
                  {DAY_STATUS_META[selectedDay.status].label}
                </Badge>
              </div>
              <div className="mt-2 text-[14px] text-neutral-500">
                <span>{selectedDay.longLabel}</span>
                {selectedDay.lastSameLabel ? ` - ${selectedDay.lastSameLabel}` : ""}
                {selectedDay.status === "done"
                  ? ` - ${dayStats.exerciseCount} exercises - ${dayStats.setCount} sets - ${formatTonnage(dayStats.tonnage)}`
                  : null}
              </div>
              <div className="hidden text-[14px] text-neutral-500">
                {selectedDay.longLabel}
                {selectedDay.lastSameLabel ? ` • ${selectedDay.lastSameLabel}` : ""}
                {selectedDay.status === "done"
                  ? ` • ${dayStats.exerciseCount} exercises • ${dayStats.setCount} sets • ${formatTonnage(dayStats.tonnage)}`
                  : null}
              </div>
            </div>

            {selectedDay.status === "done" ? (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDayTrend((current) => !current)}
                  className={cn(
                    "rounded-lg shadow-none",
                    showDayTrend && "border-brand-200 bg-brand-50 text-brand-700"
                  )}
                >
                  <BarChart3 className="size-4" />
                  Volume Trend
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-lg shadow-none"
                    >
                      <ListFilter className="size-4" />
                      {sortMode === "priority" ? "Priority order" : "Workout order"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-44 rounded-xl border-neutral-200 p-1"
                  >
                    <DropdownMenuItem
                      onSelect={() => setSortMode("priority")}
                      className={cn(
                        "rounded-md px-3 py-2 text-[13px] focus:bg-neutral-50",
                        sortMode === "priority" &&
                          "bg-brand-50 text-brand-700 focus:bg-brand-50"
                      )}
                    >
                      Priority order
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setSortMode("order")}
                      className={cn(
                        "rounded-md px-3 py-2 text-[13px] focus:bg-neutral-50",
                        sortMode === "order" &&
                          "bg-brand-50 text-brand-700 focus:bg-brand-50"
                      )}
                    >
                      Workout order
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={toggleAllExercises}
                  className="rounded-lg text-neutral-500 shadow-none hover:bg-white hover:text-neutral-900"
                >
                  {allOpen ? "Collapse all" : "Expand all"}
                </Button>
              </div>
            ) : null}
          </div>

          {selectedDay.status === "done" && showDayTrend ? (
            <Card className="rounded-2xl border-neutral-200 bg-white py-0 shadow-none">
              <CardHeader className="border-b border-neutral-200 px-5 py-4">
                <CardTitle className="text-[16px] font-semibold text-neutral-950">
                  {selectedDay.title} volume trend
                </CardTitle>
                <CardDescription className="text-[13px] text-neutral-500">
                  Weekly tonnage and completion for this workout slot.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 py-4">
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dayVolumeHistory}
                      margin={{ left: -20, right: 8, top: 8, bottom: 0 }}
                    >
                      <CartesianGrid
                        vertical={false}
                        stroke="#e5e5e5"
                        strokeDasharray="3 3"
                      />
                      <XAxis
                        dataKey="week"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={8}
                        fontSize={11}
                        stroke="#a3a3a3"
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickMargin={8}
                        width={42}
                        fontSize={11}
                        stroke="#a3a3a3"
                        tickFormatter={(value) =>
                          value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`
                        }
                      />
                      <Tooltip content={<DayVolumeTooltip />} />
                      <Bar dataKey="tonnage" radius={[6, 6, 0, 0]} maxBarSize={36}>
                        {dayVolumeHistory.map((point) => (
                          <Cell
                            key={`${point.week}-${point.status}`}
                            fill={DAY_VOLUME_BAR_COLORS[point.status]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {selectedDay.status === "rest" ? (
            <DayPlaceholder
              title="Rest day"
              description="No exercises are scheduled here. Use this day to recover and come into the next session fresher."
              icon={Minus}
              iconClassName="border-neutral-200 bg-neutral-100 text-neutral-500"
            />
          ) : null}

          {selectedDay.status === "missed" ? (
            <DayPlaceholder
              title="Workout missed"
              description="This session was not completed. The next comparison week will stay a bit noisier until adherence is back up."
              icon={XCircle}
              iconClassName="border-rose-200 bg-rose-50 text-rose-700"
            />
          ) : null}

          {selectedDay.status === "done" ? (
            <div className="space-y-4">
              {sortedExercises.map((exercise) => (
                <ProgressExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  open={openExerciseIds.has(exercise.id)}
                  showChart={visibleCharts.has(exercise.id)}
                  onToggle={() => toggleExercise(exercise.id)}
                  onToggleChart={() => toggleExerciseChart(exercise.id)}
                  history={getExerciseTrendHistory(PROGRAM_PROGRESS_WEEKS, exercise.id)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
