"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  Beef,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Droplets,
  Flame,
  GripVertical,
  Info,
  MoreVertical,
  NotebookPen,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Sparkles,
  Trash2,
  UtensilsCrossed,
  Filter,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
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
import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { SecondaryActionButton } from "@/components/coachWise/secondary-action-button"
import {
  buildMealPlanBuilderSnapshotFromSections,
} from "@/components/coachWise/clients/nutrition/meal-plan-builder-data"
import {
  cloneStoredNutritionMacroPlanBuilderSnapshot,
} from "@/components/coachWise/clients/nutrition/macro-plan-builder-data"
import {
  NutritionPlansTable,
  type NutritionPlansTableRow,
} from "@/components/coachWise/tables/nutrition-plans-table"
import {
  MacroPlanBuilderPageView as SharedMacroPlanBuilderPageView,
} from "@/components/coachWise/clients/nutrition/macro-plan-builder"
import {
  MealPlanBuilderEditPageView as SharedMealPlanBuilderEditPageView,
} from "@/components/coachWise/clients/nutrition/meal-plan-builder"
import {
  subtabsNavActionButtonClassNames,
} from "@/components/coachWise/clients/shared/subtabs-nav"
import { CoachWiseConfirmationDialog } from "@/components/coachWise/confirmation-dialog"
import { ClientQuickActionCard } from "@/components/coachWise/clients/info/client-quick-action-card"
import { buildCoachWiseHref } from "@/components/coachWise/sidebar/route-utils"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getNutritionCreateMacroPlanHref,
  getNutritionCreateMealPlanHref,
  getNutritionPlanDetailHref,
  getNutritionPlanEditorHref,
} from "@/lib/handlers/nutrition.handlers"
import {
  NUTRITION_MEAL_PLANS_UPDATED_EVENT,
  readStoredNutritionMealPlans,
  removeStoredNutritionMealPlan,
  resolveNutritionClientIdFromPath,
  upsertStoredNutritionMealPlan,
  type StoredNutritionMealPlan,
} from "@/lib/handlers/nutrition-plan-storage"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type NutritionMacroSegment = {
  macro: "protein" | "carbs" | "fats"
  value: number
  fill: string
}

type NutritionMealPlan = {
  id: string
  title: string
  subtitle: string
  type: string
  calories: number
  macros: string
  schedule: string
  segments: NutritionMacroSegment[]
}

type NutritionLogEntry = {
  id: string
  day: string
  calories: string
  protein: string
  hydration: string
  note: string
  status: string
}

type NutritionPreset = {
  dailyTarget: string
  macroTarget: string
  mealCadence: string
  coachNote: string
  planCoverage: string
  loggerStats: {
    loggedDays: string
    proteinTarget: string
    hydrationAverage: string
    consistency: string
  }
  loggerNote: string
  loggerChecklist: string[]
  mealPlans: NutritionMealPlan[]
  loggerEntries: NutritionLogEntry[]
  iifymTargets: NutritionIifymTargets
  iifymEntries: NutritionIifymEntry[]
}

type NutritionPlanType = "meal" | "macros"

type NutritionPlanTemplate = {
  id: string
  title: string
  subtitle: string
  type: NutritionPlanType
}

type SmartMacroPreset = {
  id: string
  title: string
  carbsPct: number
  proteinPct: number
  fatsPct: number
  helper: string
}

type SmartGeneratedMeal = {
  id: string
  slot: string
  title: string
  calories: number
  carbs: number
  protein: number
  fats: number
  ingredients: number
  image: string
}

type NutritionIifymTargets = {
  calories: number
  protein: number
  carbs: number
  fats: number
  fiber: number
}

type NutritionIifymEntry = {
  id: string
  date: string
  dayShort: string
  dayNumber: string
  loggedMeals: number
  calories: number
  protein: number
  carbs: number
  fats: number
  fiber: number
  sugar: number
  sodium: number
  potassium: number
  saturatedFat: number
  polyunsaturatedFat: number
  monounsaturatedFat: number
}

type NutritionMealPlanOption = {
  id: string
  label: string
  title: string
  calories: number
  carbs: number
  protein: number
  fats: number
  description: string
  image: string
}

type NutritionMealPlanSection = {
  id: string
  label: string
  options: NutritionMealPlanOption[]
}

type NutritionRecipeLibraryItem = {
  id: string
  title: string
  mealType: string
  calories: number
  carbs: number
  protein: number
  fats: number
  image: string
}

const primaryActionButtonClassName =
  subtabsNavActionButtonClassNames.primary

const createNutritionTabTriggerClassName =
  "relative top-[2px] -mb-[6px] h-auto flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 py-2 text-[13px] font-normal text-neutral-500 shadow-none after:hidden hover:text-neutral-700 data-[state=active]:border-brand-500 data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none"

function NutritionSectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-3 text-[13px] font-medium text-neutral-500">{title}</div>
  )
}

function mergeNutritionMealPlans(
  presetMealPlans: NutritionMealPlan[],
  storedMealPlans: StoredNutritionMealPlan[]
) {
  const mergedMealPlans = new Map<string, NutritionMealPlan>()

  storedMealPlans.forEach((mealPlan) => {
    mergedMealPlans.set(mealPlan.id, mealPlan)
  })

  presetMealPlans.forEach((mealPlan) => {
    if (!mergedMealPlans.has(mealPlan.id)) {
      mergedMealPlans.set(mealPlan.id, mealPlan)
    }
  })

  return Array.from(mergedMealPlans.values())
}

function normalizeDuplicatedMealPlanTitleBase(title: string) {
  return title.replace(/\s*-\s*copy\s+\d+$/i, "").trim()
}

function buildNextDuplicatedMealPlanTitle(
  sourceTitle: string,
  existingTitles: string[]
) {
  const baseTitle = normalizeDuplicatedMealPlanTitleBase(sourceTitle)
  const duplicatePattern = new RegExp(
    `^${baseTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*-\\s*copy\\s+(\\d+)$`,
    "i"
  )

  const highestCopyIndex = existingTitles.reduce((highestIndex, title) => {
    const normalizedTitle = title.trim()

    if (normalizedTitle.toLowerCase() === baseTitle.toLowerCase()) {
      return Math.max(highestIndex, 0)
    }

    const match = normalizedTitle.match(duplicatePattern)
    if (!match) {
      return highestIndex
    }

    const nextIndex = Number.parseInt(match[1] ?? "0", 10)
    return Number.isFinite(nextIndex) ? Math.max(highestIndex, nextIndex) : highestIndex
  }, 0)

  return `${baseTitle} - copy ${highestCopyIndex + 1}`
}

function useStoredNutritionMealPlans(pathHint?: string) {
  const clientId = React.useMemo(
    () => resolveNutritionClientIdFromPath(pathHint),
    [pathHint]
  )
  const [storedMealPlans, setStoredMealPlans] = React.useState<StoredNutritionMealPlan[]>(
    []
  )
  const [hasLoadedStoredMealPlans, setHasLoadedStoredMealPlans] = React.useState(
    false
  )

  React.useEffect(() => {
    if (!clientId) {
      setStoredMealPlans([])
      setHasLoadedStoredMealPlans(true)
      return
    }

    setHasLoadedStoredMealPlans(false)

    const syncStoredMealPlans = () => {
      setStoredMealPlans(readStoredNutritionMealPlans(clientId))
      setHasLoadedStoredMealPlans(true)
    }

    const handleStoredMealPlansUpdated = (event: Event) => {
      const updatedClientId = (
        event as CustomEvent<{ clientId?: string }>
      ).detail?.clientId

      if (updatedClientId && updatedClientId !== clientId) {
        return
      }

      syncStoredMealPlans()
    }

    syncStoredMealPlans()
    window.addEventListener("storage", syncStoredMealPlans)
    window.addEventListener(
      NUTRITION_MEAL_PLANS_UPDATED_EVENT,
      handleStoredMealPlansUpdated as EventListener
    )

    return () => {
      window.removeEventListener("storage", syncStoredMealPlans)
      window.removeEventListener(
        NUTRITION_MEAL_PLANS_UPDATED_EVENT,
        handleStoredMealPlansUpdated as EventListener
      )
    }
  }, [clientId])

  return {
    clientId,
    hasLoadedStoredMealPlans,
    storedMealPlans,
  }
}

const mealPlanDonutConfig = {
  protein: {
    label: "Protein",
    color: "#22c55e",
  },
  carbs: {
    label: "Carbs",
    color: "#3b82f6",
  },
  fats: {
    label: "Fats",
    color: "#f59e0b",
  },
} satisfies ChartConfig

const iifymChartConfig = {
  calories: {
    label: "Calories",
    color: "#f59e0b",
  },
  protein: {
    label: "Protein",
    color: "#a78bfa",
  },
  carbs: {
    label: "Carbs",
    color: "#3b82f6",
  },
  fats: {
    label: "Fats",
    color: "#22d3ee",
  },
  fiber: {
    label: "Fiber",
    color: "#fb7185",
  },
} satisfies ChartConfig

const iifymSeries = [
  {
    key: "calories",
    label: "Calories",
    color: iifymChartConfig.calories.color,
    axisId: "calories",
  },
  {
    key: "protein",
    label: "Protein",
    color: iifymChartConfig.protein.color,
    axisId: "macros",
  },
  {
    key: "carbs",
    label: "Carbs",
    color: iifymChartConfig.carbs.color,
    axisId: "macros",
  },
  {
    key: "fats",
    label: "Fats",
    color: iifymChartConfig.fats.color,
    axisId: "macros",
  },
  {
    key: "fiber",
    label: "Fiber",
    color: iifymChartConfig.fiber.color,
    axisId: "macros",
  },
] as const

const smartMacroPresets: SmartMacroPreset[] = [
  {
    id: "balanced",
    title: "Balanced",
    carbsPct: 40,
    proteinPct: 30,
    fatsPct: 30,
    helper: "C:40%  P:30%  F:30%",
  },
  {
    id: "high-protein",
    title: "High Protein",
    carbsPct: 30,
    proteinPct: 40,
    fatsPct: 30,
    helper: "C:30%  P:40%  F:30%",
  },
  {
    id: "low-carb",
    title: "Low Carb",
    carbsPct: 20,
    proteinPct: 40,
    fatsPct: 40,
    helper: "C:20%  P:40%  F:40%",
  },
  {
    id: "keto",
    title: "Keto",
    carbsPct: 5,
    proteinPct: 25,
    fatsPct: 70,
    helper: "C:5%  P:25%  F:70%",
  },
  {
    id: "low-fat",
    title: "Low Fat",
    carbsPct: 55,
    proteinPct: 25,
    fatsPct: 20,
    helper: "C:55%  P:25%  F:20%",
  },
  {
    id: "custom",
    title: "Custom",
    carbsPct: 34,
    proteinPct: 33,
    fatsPct: 33,
    helper: "Your own %",
  },
]

const smartPlannerRestrictions = [
  "Keto",
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Paleo",
]

const smartMealPool: SmartGeneratedMeal[] = [
  {
    id: "breakfast-toast",
    slot: "Breakfast",
    title: "Almond Butter Banana Breakfast Toast",
    calories: 387,
    carbs: 56,
    protein: 9,
    fats: 14,
    ingredients: 3,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "lunch-chicken",
    slot: "Lunch",
    title: "BBQ Chicken Thigh Brown Rice Green Beans Lunch",
    calories: 638,
    carbs: 60,
    protein: 44,
    fats: 24,
    ingredients: 4,
    image:
      "https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "snack-smoothie",
    slot: "Snack",
    title: "Smoothie with spinach, banana, and protein powder",
    calories: 271,
    carbs: 31,
    protein: 28,
    fats: 4,
    ingredients: 4,
    image:
      "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "dinner-beef",
    slot: "Dinner",
    title: "Beef and Broccoli",
    calories: 662,
    carbs: 73,
    protein: 42,
    fats: 23,
    ingredients: 7,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "snack-yogurt",
    slot: "Snack",
    title: "Greek Yogurt Berry Crunch Bowl",
    calories: 318,
    carbs: 34,
    protein: 24,
    fats: 9,
    ingredients: 5,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "dinner-salmon",
    slot: "Dinner",
    title: "Salmon, Quinoa and Roasted Vegetables",
    calories: 584,
    carbs: 42,
    protein: 39,
    fats: 21,
    ingredients: 6,
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80",
  },
]

const nutritionWeekdayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
})

const nutritionMonthDayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
})

const iifymBasePattern = [
  {
    date: "2026-03-09",
    loggedMeals: 4,
    caloriesRatio: 0.96,
    proteinRatio: 0.98,
    carbsRatio: 0.94,
    fatsRatio: 0.95,
    fiberRatio: 0.83,
  },
  {
    date: "2026-03-10",
    loggedMeals: 4,
    caloriesRatio: 0.91,
    proteinRatio: 0.94,
    carbsRatio: 0.88,
    fatsRatio: 0.92,
    fiberRatio: 0.79,
  },
  {
    date: "2026-03-11",
    loggedMeals: 3,
    caloriesRatio: 1.02,
    proteinRatio: 0.99,
    carbsRatio: 1.04,
    fatsRatio: 0.9,
    fiberRatio: 0.86,
  },
  {
    date: "2026-03-12",
    loggedMeals: 4,
    caloriesRatio: 0.98,
    proteinRatio: 1.01,
    carbsRatio: 0.97,
    fatsRatio: 0.96,
    fiberRatio: 0.88,
  },
  {
    date: "2026-03-13",
    loggedMeals: 3,
    caloriesRatio: 1.04,
    proteinRatio: 1.03,
    carbsRatio: 1.08,
    fatsRatio: 0.94,
    fiberRatio: 0.85,
  },
  {
    date: "2026-03-14",
    loggedMeals: 2,
    caloriesRatio: 0.93,
    proteinRatio: 0.89,
    carbsRatio: 0.87,
    fatsRatio: 0.98,
    fiberRatio: 0.76,
  },
  {
    date: "2026-03-15",
    loggedMeals: 2,
    caloriesRatio: 0.9,
    proteinRatio: 0.86,
    carbsRatio: 0.83,
    fatsRatio: 1.02,
    fiberRatio: 0.74,
  },
  {
    date: "2026-03-16",
    loggedMeals: 4,
    caloriesRatio: 0.99,
    proteinRatio: 1,
    carbsRatio: 0.96,
    fatsRatio: 0.95,
    fiberRatio: 0.84,
  },
  {
    date: "2026-03-17",
    loggedMeals: 4,
    caloriesRatio: 0.95,
    proteinRatio: 0.97,
    carbsRatio: 0.91,
    fatsRatio: 0.94,
    fiberRatio: 0.82,
  },
  {
    date: "2026-03-18",
    loggedMeals: 4,
    caloriesRatio: 1.01,
    proteinRatio: 1.02,
    carbsRatio: 0.99,
    fatsRatio: 0.92,
    fiberRatio: 0.86,
  },
  {
    date: "2026-03-19",
    loggedMeals: 3,
    caloriesRatio: 0.97,
    proteinRatio: 0.95,
    carbsRatio: 0.94,
    fatsRatio: 0.96,
    fiberRatio: 0.8,
  },
  {
    date: "2026-03-20",
    loggedMeals: 4,
    caloriesRatio: 1.03,
    proteinRatio: 1.01,
    carbsRatio: 1.06,
    fatsRatio: 0.97,
    fiberRatio: 0.88,
  },
  {
    date: "2026-03-21",
    loggedMeals: 2,
    caloriesRatio: 0.92,
    proteinRatio: 0.88,
    carbsRatio: 0.86,
    fatsRatio: 1.01,
    fiberRatio: 0.75,
  },
  {
    date: "2026-03-22",
    loggedMeals: 3,
    caloriesRatio: 0.94,
    proteinRatio: 0.9,
    carbsRatio: 0.89,
    fatsRatio: 0.99,
    fiberRatio: 0.78,
  },
] as const

function buildIifymEntries(
  targets: NutritionIifymTargets
): NutritionIifymEntry[] {
  return iifymBasePattern.map((item, index) => {
    const currentDate = new Date(`${item.date}T00:00:00`)
    const calories = Math.round(targets.calories * item.caloriesRatio)
    const protein = Math.round(targets.protein * item.proteinRatio)
    const carbs = Math.round(targets.carbs * item.carbsRatio)
    const fats = Math.round(targets.fats * item.fatsRatio)
    const fiber = Math.round(targets.fiber * item.fiberRatio)

    return {
      id: `iifym-${index}`,
      date: item.date,
      dayShort: nutritionWeekdayFormatter.format(currentDate).slice(0, 2),
      dayNumber: String(currentDate.getDate()),
      loggedMeals: item.loggedMeals,
      calories,
      protein,
      carbs,
      fats,
      fiber,
      sugar: Math.round(carbs * 0.23),
      sodium: 1800 + index * 45,
      potassium: 2800 + index * 70,
      saturatedFat: Math.round(fats * 0.31),
      polyunsaturatedFat: Math.round(fats * 0.27),
      monounsaturatedFat: Math.round(fats * 0.34),
    }
  })
}

function chunkNutritionWeeks(entries: NutritionIifymEntry[]) {
  const chunks: NutritionIifymEntry[][] = []

  for (let index = 0; index < entries.length; index += 7) {
    chunks.push(entries.slice(index, index + 7))
  }

  return chunks
}

function formatNutritionWeekRange(entries: NutritionIifymEntry[]) {
  if (!entries.length) {
    return ""
  }

  const first = new Date(`${entries[0].date}T00:00:00`)
  const last = new Date(`${entries[entries.length - 1].date}T00:00:00`)

  return `${nutritionMonthDayFormatter.format(first)} - ${nutritionMonthDayFormatter.format(last)}`
}

function formatMacroCellValue(value: number, unit: string) {
  if (unit === "kcal" || unit === "mg") {
    return `${Math.round(value).toLocaleString()}`
  }

  return `${Math.round(value)}`
}

const nutritionMealPlanSections: Record<string, NutritionMealPlanSection[]> = {
  "training-day": [
    {
      id: "breakfast",
      label: "Breakfast",
      options: [
        {
          id: "oatmeal-fruits",
          label: "Option 1",
          title: "Oatmeal with Fruits",
          calories: 389,
          carbs: 60,
          protein: 27,
          fats: 5,
          description:
            "Hearty oatmeal with protein and fresh fruit for long-lasting energy.",
          image:
            "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=900&q=80",
        },
        {
          id: "eggs-toast",
          label: "Option 2",
          title: "Eggs, Sourdough and Berries",
          calories: 412,
          carbs: 36,
          protein: 31,
          fats: 14,
          description:
            "Higher protein breakfast for slower mornings and better satiety.",
          image:
            "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
    {
      id: "lunch",
      label: "Lunch",
      options: [
        {
          id: "chicken-salad",
          label: "Option 1",
          title: "Grilled Chicken Salad",
          calories: 374,
          carbs: 10,
          protein: 44,
          fats: 18,
          description:
            "Crisp greens topped with juicy grilled chicken and a light olive oil dressing.",
          image:
            "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=900&q=80",
        },
        {
          id: "rice-bowl",
          label: "Option 2",
          title: "Chicken Rice Bowl",
          calories: 468,
          carbs: 49,
          protein: 39,
          fats: 11,
          description:
            "Balanced lunch with easy carbs for the second half of the day.",
          image:
            "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
    {
      id: "dinner",
      label: "Dinner",
      options: [
        {
          id: "fish-veggies",
          label: "Option 1",
          title: "Fish and Steamed Veggies",
          calories: 335,
          carbs: 15,
          protein: 45,
          fats: 11,
          description:
            "Lean dinner option focused on recovery, micronutrients and easy digestion.",
          image:
            "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80",
        },
        {
          id: "beef-potatoes",
          label: "Option 2",
          title: "Lean Beef with Potatoes",
          calories: 441,
          carbs: 37,
          protein: 42,
          fats: 14,
          description:
            "Heavier dinner alternative for days with bigger training output.",
          image:
            "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
  ],
  "rest-day": [
    {
      id: "breakfast",
      label: "Breakfast",
      options: [
        {
          id: "yogurt-bowl",
          label: "Option 1",
          title: "Greek Yogurt Berry Bowl",
          calories: 321,
          carbs: 29,
          protein: 28,
          fats: 10,
          description:
            "Light breakfast with stable energy and a solid protein base.",
          image:
            "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
        },
        {
          id: "omelette-avocado",
          label: "Option 2",
          title: "Veggie Omelette with Avocado",
          calories: 348,
          carbs: 14,
          protein: 30,
          fats: 19,
          description:
            "Lower-carb option with more fats to improve satiety on easier days.",
          image:
            "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
    {
      id: "lunch",
      label: "Lunch",
      options: [
        {
          id: "salmon-quinoa",
          label: "Option 1",
          title: "Salmon, Quinoa and Greens",
          calories: 398,
          carbs: 24,
          protein: 38,
          fats: 16,
          description:
            "Recovery-oriented meal with omega-3 fats and moderate carbohydrates.",
          image:
            "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80",
        },
        {
          id: "turkey-wrap",
          label: "Option 2",
          title: "Turkey Wrap with Salad",
          calories: 356,
          carbs: 31,
          protein: 34,
          fats: 9,
          description:
            "Portable rest-day option when routine needs to stay simple.",
          image:
            "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
    {
      id: "dinner",
      label: "Dinner",
      options: [
        {
          id: "beef-broccoli",
          label: "Option 1",
          title: "Beef and Broccoli",
          calories: 327,
          carbs: 18,
          protein: 37,
          fats: 12,
          description:
            "Simple high-protein dinner with fiber and low prep effort.",
          image:
            "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
        },
        {
          id: "tofu-stirfry",
          label: "Option 2",
          title: "Tofu Stir Fry",
          calories: 304,
          carbs: 22,
          protein: 25,
          fats: 13,
          description:
            "Plant-forward dinner alternative with steady digestion and volume.",
          image:
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
  ],
}

const nutritionRecipeLibrary: NutritionRecipeLibraryItem[] = [
  {
    id: "recipe-chicken-broccoli",
    title: "Grilled Chicken Breast with Brown Rice and Broccoli",
    mealType: "Lunch",
    calories: 649,
    carbs: 49,
    protein: 52,
    fats: 28,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "recipe-overnight-oats",
    title: "Overnight oats with peanut butter and banana",
    mealType: "Breakfast",
    calories: 476,
    carbs: 60,
    protein: 16,
    fats: 19,
    image:
      "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "recipe-avocado-toast",
    title: "Avocado toast with a boiled egg",
    mealType: "Breakfast",
    calories: 261,
    carbs: 18,
    protein: 9,
    fats: 16,
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "recipe-yogurt-granola",
    title: "Greek Yogurt with Honey and Granola",
    mealType: "Snack",
    calories: 282,
    carbs: 45,
    protein: 18,
    fats: 3,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "recipe-scrambled-eggs",
    title: "Scrambled eggs with spinach and tomatoes",
    mealType: "Breakfast",
    calories: 358,
    carbs: 4,
    protein: 21,
    fats: 29,
    image:
      "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "recipe-protein-shake",
    title: "Protein shake and banana",
    mealType: "Snack",
    calories: 262,
    carbs: 30,
    protein: 27,
    fats: 4,
    image:
      "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "recipe-fruit-smoothie",
    title: "Fruit and protein smoothie",
    mealType: "Snack",
    calories: 296,
    carbs: 38,
    protein: 28,
    fats: 4,
    image:
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=900&q=80",
  },
]

function parseMealPlanMacros(macros: string) {
  const match = macros.match(/(\d+)P\s*\/\s*(\d+)C\s*\/\s*(\d+)F/i)

  if (!match) {
    return {
      protein: 0,
      carbs: 0,
      fats: 0,
    }
  }

  return {
    protein: Number.parseInt(match[1] ?? "0", 10),
    carbs: Number.parseInt(match[2] ?? "0", 10),
    fats: Number.parseInt(match[3] ?? "0", 10),
  }
}

function getNutritionPreset(phase?: string): NutritionPreset {
  switch (phase) {
    case "Bulk":
      {
        const bulkIifymTargets: NutritionIifymTargets = {
          calories: 3150,
          protein: 190,
          carbs: 390,
          fats: 80,
          fiber: 38,
        }

        return {
          dailyTarget: "3150 kcal",
          macroTarget: "190P / 390C / 80F",
          mealCadence: "5 meals / day",
          coachNote:
            "The focus is on higher intake around training, enough protein, and stable appetite through the week.",
          planCoverage: "2 active plans",
          loggerStats: {
            loggedDays: "12 / 14",
            proteinTarget: "95%",
            hydrationAverage: "2.9 L",
            consistency: "Very good",
          },
          loggerNote:
            "Logging is consistent enough for coaching decisions. The biggest deviations happen with weekend snacks.",
          loggerChecklist: [
            "increase vegetables in the last meal",
            "keep carbs before training",
            "keep weekend meals on the same rhythm",
          ],
          mealPlans: [
            {
              id: "training-day",
              title: "Training Day Meal",
              subtitle: "More carbs around training and 1 recovery meal after the workout.",
              type: "Meal Plan",
              calories: 2100,
              macros: "185P / 250C / 50F",
              schedule: "4 meals",
              segments: [
                { macro: "protein", value: 32, fill: "var(--color-protein)" },
                { macro: "carbs", value: 48, fill: "var(--color-carbs)" },
                { macro: "fats", value: 20, fill: "var(--color-fats)" },
              ],
            },
            {
              id: "rest-day",
              title: "Rest Day Meal",
              subtitle: "A bit fewer carbs, more satiety, and steadier energy.",
              type: "Meal Plan",
              calories: 1640,
              macros: "190P / 145C / 52F",
              schedule: "4 meals",
              segments: [
                { macro: "protein", value: 39, fill: "var(--color-protein)" },
                { macro: "carbs", value: 31, fill: "var(--color-carbs)" },
                { macro: "fats", value: 30, fill: "var(--color-fats)" },
              ],
            },
          ],
          loggerEntries: [
            {
              id: "bulk-18",
              day: "Tue, 18 Mar",
              calories: "3020 kcal",
              protein: "188 g",
              hydration: "3.0 L",
              note: "Good training day, appetite steady.",
              status: "On target",
            },
            {
              id: "bulk-17",
              day: "Mon, 17 Mar",
              calories: "2870 kcal",
              protein: "180 g",
              hydration: "2.7 L",
              note: "A bit fewer carbs in the evening.",
              status: "Slightly low",
            },
            {
              id: "bulk-16",
              day: "Sun, 16 Mar",
              calories: "3190 kcal",
              protein: "195 g",
              hydration: "3.1 L",
              note: "Weekend rhythm stayed under control.",
              status: "On target",
            },
          ],
          iifymTargets: bulkIifymTargets,
          iifymEntries: buildIifymEntries(bulkIifymTargets),
        }
      }
    case "Cut":
      {
        const cutIifymTargets: NutritionIifymTargets = {
          calories: 2150,
          protein: 185,
          carbs: 190,
          fats: 65,
          fiber: 30,
        }

        return {
          dailyTarget: "2150 kcal",
          macroTarget: "185P / 190C / 65F",
          mealCadence: "4 meals / day",
          coachNote:
            "The deficit stays moderate. The priority is satiety, high protein, and solid training output.",
          planCoverage: "2 active plans",
          loggerStats: {
            loggedDays: "11 / 14",
            proteinTarget: "92%",
            hydrationAverage: "2.4 L",
            consistency: "Good",
          },
          loggerNote:
            "The logger is good enough for decisions. The biggest deviations happen with evening snacks and weekends.",
          loggerChecklist: [
            "keep protein above 180 g",
            "prep 1 anchor meal ahead of time on weekends",
            "increase water to 2.7 L on harder training days",
          ],
          mealPlans: [
            {
              id: "training-day",
              title: "Training Day Meal",
              subtitle: "More food around training while the deficit stays under control.",
              type: "Meal Plan",
              calories: 1600,
              macros: "180P / 145C / 42F",
              schedule: "4 meals",
              segments: [
                { macro: "protein", value: 40, fill: "var(--color-protein)" },
                { macro: "carbs", value: 37, fill: "var(--color-carbs)" },
                { macro: "fats", value: 23, fill: "var(--color-fats)" },
              ],
            },
            {
              id: "rest-day",
              title: "Rest Day Meal",
              subtitle: "Lower carbs, more satiety, and solid recovery during the deficit.",
              type: "Meal Plan",
              calories: 1004,
              macros: "155P / 68C / 36F",
              schedule: "3 meals",
              segments: [
                { macro: "protein", value: 46, fill: "var(--color-protein)" },
                { macro: "carbs", value: 24, fill: "var(--color-carbs)" },
                { macro: "fats", value: 30, fill: "var(--color-fats)" },
              ],
            },
          ],
          loggerEntries: [
            {
              id: "cut-18",
              day: "Tue, 18 Mar",
              calories: "2115 kcal",
              protein: "186 g",
              hydration: "2.5 L",
              note: "Good day, without major deviations.",
              status: "On target",
            },
            {
              id: "cut-17",
              day: "Mon, 17 Mar",
              calories: "2260 kcal",
              protein: "174 g",
              hydration: "2.2 L",
              note: "An evening snack pushed intake higher.",
              status: "Above target",
            },
            {
              id: "cut-16",
              day: "Sun, 16 Mar",
              calories: "2050 kcal",
              protein: "182 g",
              hydration: "2.6 L",
              note: "The weekend was more stable than before.",
              status: "On target",
            },
          ],
          iifymTargets: cutIifymTargets,
          iifymEntries: buildIifymEntries(cutIifymTargets),
        }
      }
    default:
      {
        const maintenanceIifymTargets: NutritionIifymTargets = {
          calories: 2450,
          protein: 180,
          carbs: 250,
          fats: 70,
          fiber: 34,
        }

        return {
          dailyTarget: "2450 kcal",
          macroTarget: "180P / 250C / 70F",
          mealCadence: "4 meals / day",
          coachNote:
            "The maintenance plan keeps physique stable. The focus is on routine, hydration, and good recovery.",
          planCoverage: "2 active plans",
          loggerStats: {
            loggedDays: "10 / 14",
            proteinTarget: "89%",
            hydrationAverage: "2.6 L",
            consistency: "Stable",
          },
          loggerNote:
            "The biggest benefit comes from a more consistent breakfast and less improvisation in the last meal.",
          loggerChecklist: [
            "make breakfast more predictable",
            "keep 4 anchor meals through the week",
            "increase water intake on more active days",
          ],
          mealPlans: [
            {
              id: "training-day",
              title: "Training Day Meal",
              subtitle: "A balanced plan for performance and good recovery.",
              type: "Meal Plan",
              calories: 1840,
              macros: "175P / 185C / 52F",
              schedule: "4 meals",
              segments: [
                { macro: "protein", value: 38, fill: "var(--color-protein)" },
                { macro: "carbs", value: 39, fill: "var(--color-carbs)" },
                { macro: "fats", value: 23, fill: "var(--color-fats)" },
              ],
            },
            {
              id: "rest-day",
              title: "Rest Day Meal",
              subtitle: "A slightly more satiety-focused plan for less active days.",
              type: "Meal Plan",
              calories: 1260,
              macros: "165P / 102C / 40F",
              schedule: "3 meals",
              segments: [
                { macro: "protein", value: 44, fill: "var(--color-protein)" },
                { macro: "carbs", value: 28, fill: "var(--color-carbs)" },
                { macro: "fats", value: 28, fill: "var(--color-fats)" },
              ],
            },
          ],
          loggerEntries: [
            {
              id: "maint-18",
              day: "Tue, 18 Mar",
              calories: "2420 kcal",
              protein: "178 g",
              hydration: "2.7 L",
              note: "Rhythm is stable and energy is good.",
              status: "On target",
            },
            {
              id: "maint-17",
              day: "Mon, 17 Mar",
              calories: "2360 kcal",
              protein: "171 g",
              hydration: "2.5 L",
              note: "Less appetite in the second part of the day.",
              status: "Slightly low",
            },
            {
              id: "maint-16",
              day: "Sun, 16 Mar",
              calories: "2510 kcal",
              protein: "183 g",
              hydration: "2.6 L",
              note: "A good weekend without major swings.",
              status: "On target",
            },
          ],
          iifymTargets: maintenanceIifymTargets,
          iifymEntries: buildIifymEntries(maintenanceIifymTargets),
        }
      }
  }
}

function NutritionCaloriesDonut({ plan }: { plan: NutritionMealPlan }) {
  return (
    <ChartContainer
      config={mealPlanDonutConfig}
      className="mx-auto aspect-square size-[48px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={plan.segments}
          dataKey="value"
          nameKey="macro"
          innerRadius={14}
          outerRadius={20}
          strokeWidth={2}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-neutral-950 text-[9px] font-semibold"
                    >
                      {plan.calories}
                    </tspan>
                  </text>
                )
              }

              return null
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

function NutritionLoggerStatusBadge({ status }: { status: string }) {
  const isPositive = status === "On target"

  return (
    <Badge
      variant="outline"
      className={
        isPositive
          ? "rounded-full border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[12px] font-normal text-emerald-700"
          : "rounded-full border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[12px] font-normal text-amber-700"
      }
    >
      {status}
    </Badge>
  )
}

function NutritionIifymTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{
    color?: string
    payload?: Record<string, string | number>
  }>
}) {
  if (!active || !payload?.length) {
    return null
  }

  const point = payload[0]?.payload

  if (!point) {
    return null
  }

  const items = [
    ...iifymSeries.map((series) => ({
      label: series.label,
      value: `${point[`raw${series.label}`]} ${series.key === "calories" ? "kcal" : "g"
        }`,
      color: series.color,
    })),
  ]

  return (
    <div className="min-w-[180px] rounded-lg border border-neutral-200 bg-white px-3 py-2.5 shadow-lg shadow-black/5">
      <div className="mb-2 text-[12px] font-medium text-neutral-500">
        {point.dayLabel}
      </div>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-4 text-[12px]"
          >
            <span className="inline-flex items-center gap-2 text-neutral-600">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </span>
            <span className="font-medium text-neutral-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CreateNutritionPlanDialog({
  triggerClassName,
  libraryPlans,
  trigger,
}: {
  triggerClassName?: string
  libraryPlans: NutritionMealPlan[]
  trigger?: React.ReactNode
}) {
  const templateItems = React.useMemo<NutritionPlanTemplate[]>(
    () => [
      ...libraryPlans.map((plan) => ({
        id: plan.id,
        title: plan.title,
        subtitle: plan.subtitle,
        type: (plan.type.toLowerCase().includes("macro")
          ? "macros"
          : "meal") as NutritionPlanType,
      })),
      {
        id: "balanced-macros",
        title: "Balanced Macros Plan",
        subtitle: "Set daily macro targets by total intake or by meal.",
        type: "macros",
      },
    ],
    [libraryPlans]
  )
  const featuredTemplate = templateItems[0]
  const [open, setOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("new")
  const [planName, setPlanName] = React.useState("")
  const [planDescription, setPlanDescription] = React.useState("")
  const [planType, setPlanType] = React.useState<NutritionPlanType>("meal")
  const [selectedTemplateId, setSelectedTemplateId] = React.useState(
    featuredTemplate?.id ?? ""
  )

  const resetDialog = React.useCallback(() => {
    setActiveTab("new")
    setPlanName("")
    setPlanDescription("")
    setPlanType("meal")
    setSelectedTemplateId(featuredTemplate?.id ?? "")
  }, [featuredTemplate?.id])

  const applyTemplate = React.useCallback((template: NutritionPlanTemplate) => {
    setSelectedTemplateId(template.id)
    setPlanName(template.title)
    setPlanDescription(template.subtitle)
    setPlanType(template.type)
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
        {trigger ?? (
          <Button type="button" size="sm" className={triggerClassName}>
            <Plus className="size-4" />
            Add Meal Plan
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="gap-0 overflow-hidden rounded-sm border-neutral-200 bg-white p-0 shadow-2xl shadow-black/10 sm:max-w-[700px]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0">
          <div className="pt-4">
            <div className="px-5">
              <DialogTitle className="flex items-center gap-2 text-[18px] font-semibold text-neutral-950">
                <Droplets className="size-4 text-neutral-500" />
                Add Nutrition Plan
              </DialogTitle>
            </div>

            <div className="mt-3 border-b border-neutral-200 px-5">
              <TabsList
                variant="line"
                className="h-auto w-full justify-start gap-6 rounded-none bg-transparent p-0"
              >
                <TabsTrigger
                  value="new"
                  className={createNutritionTabTriggerClassName}
                >
                  New Plan
                </TabsTrigger>
                <TabsTrigger
                  value="library"
                  className={createNutritionTabTriggerClassName}
                >
                  Nutrition Library
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="new" className="mt-0 space-y-0">
            <div className="space-y-5 px-5 py-5">
              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-neutral-800">
                  Plan Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={planName}
                  onChange={(event) => setPlanName(event.target.value)}
                  placeholder="Name of the plan e.g. 2000kcal Plan"
                  className="h-10 rounded-sm border-neutral-200 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-neutral-800">
                  Plan Description
                </label>
                <textarea
                  value={planDescription}
                  onChange={(event) => setPlanDescription(event.target.value)}
                  maxLength={1000}
                  placeholder="Enter any additional info"
                  className="min-h-[92px] w-full resize-none rounded-sm border border-neutral-200 bg-white px-3 py-2 text-[14px] text-neutral-700 shadow-none outline-none placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-0"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-neutral-800">
                  Plan Type <span className="text-rose-500">*</span>
                </label>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    {
                      id: "meal" as const,
                      title: "Meal Plan",
                      description:
                        "Build meals with recipes, ingredients, and instructions.",
                      icon: UtensilsCrossed,
                    },
                    {
                      id: "macros" as const,
                      title: "Macros Plan",
                      description:
                        "Set daily macro targets (total or by meal) for nutritional goals.",
                      icon: Beef,
                    },
                  ].map((option) => {
                    const Icon = option.icon
                    const isActive = planType === option.id

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setPlanType(option.id)}
                        className={cn(
                          "flex items-start justify-between gap-3 rounded-sm border px-4 py-4 text-left transition-colors",
                          isActive
                            ? "border-brand-500 bg-brand-50/40"
                            : "border-neutral-200 bg-white hover:bg-neutral-50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-sm border",
                              isActive
                                ? "border-brand-200 bg-brand-50"
                                : "border-neutral-200 bg-neutral-50"
                            )}
                          >
                            <Icon
                              className={cn(
                                "size-4",
                                isActive ? "text-brand-600" : "text-neutral-500"
                              )}
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="text-[15px] font-medium text-neutral-950">
                              {option.title}
                            </div>
                            <div className="text-[13px] leading-5 text-neutral-500">
                              {option.description}
                            </div>
                          </div>
                        </div>
                        <div
                          className={cn(
                            "mt-1 size-4 rounded-full border",
                            isActive
                              ? "border-brand-500 bg-brand-500 ring-2 ring-brand-100"
                              : "border-neutral-300 bg-white"
                          )}
                        />
                      </button>
                    )
                  })}
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
                disabled={!planName.trim()}
                onClick={() => setOpen(false)}
                className="rounded-sm bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700 disabled:opacity-45"
              >
                Add Plan
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="library" className="mt-0 min-h-0 overflow-y-auto space-y-0">
            <div className="grid gap-3 px-5 py-5 sm:grid-cols-2">
              {templateItems.map((template) => {
                const isActive = template.id === selectedTemplateId

                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className={cn(
                      "rounded-sm border px-4 py-4 text-left transition-colors",
                      isActive
                        ? "border-brand-500 bg-brand-50/40"
                        : "border-neutral-200 bg-white hover:bg-neutral-50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-[15px] font-medium text-neutral-950">
                          {template.title}
                        </div>
                        <div className="text-[13px] leading-5 text-neutral-500">
                          {template.subtitle}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="rounded-md border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-normal text-neutral-600"
                      >
                        {template.type === "meal" ? "Meal Plan" : "Macros Plan"}
                      </Badge>
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
                disabled={!selectedTemplateId}
                onClick={() => {
                  const template = templateItems.find(
                    (item) => item.id === selectedTemplateId
                  )

                  if (template) {
                    applyTemplate(template)
                  }
                }}
                className="rounded-sm bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700 disabled:opacity-45"
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

function buildGeneratedMeals(mealCount: number, generationIndex: number) {
  const rotatedMeals = smartMealPool.map(
    (_, index, meals) => meals[(index + generationIndex) % meals.length]
  )

  return rotatedMeals.slice(0, mealCount)
}

function SmartMacroOptionCard({
  preset,
  isActive,
  onSelect,
}: {
  preset: SmartMacroPreset
  isActive: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "rounded-sm border px-3 py-3 text-left transition-colors",
        isActive
          ? "border-brand-500 bg-brand-50/40"
          : "border-neutral-200 bg-white hover:bg-neutral-50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[15px] font-medium text-neutral-950">
            {preset.title}
          </div>
          <div className="mt-1 text-[12px] text-neutral-500">{preset.helper}</div>
        </div>
        <div
          className={cn(
            "mt-1 size-4 rounded-full border",
            isActive
              ? "border-brand-500 bg-brand-500 ring-2 ring-brand-100"
              : "border-neutral-300 bg-white"
          )}
        />
      </div>
      <div className="mt-3 flex h-0.5 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="bg-blue-500"
          style={{ width: `${preset.carbsPct}%` }}
        />
        <div
          className="bg-violet-400"
          style={{ width: `${preset.proteinPct}%` }}
        />
        <div
          className="bg-cyan-400"
          style={{ width: `${preset.fatsPct}%` }}
        />
      </div>
    </button>
  )
}

function SmartMealPlannerDialog({
  triggerClassName,
  trigger,
}: {
  triggerClassName?: string
  trigger?: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const [generated, setGenerated] = React.useState(false)
  const [calorieGoal, setCalorieGoal] = React.useState("2000")
  const [selectedMacroId, setSelectedMacroId] = React.useState("balanced")
  const [mealCount, setMealCount] = React.useState(4)
  const [alternatives, setAlternatives] = React.useState(1)
  const [restrictions, setRestrictions] = React.useState<string[]>([])
  const [planName, setPlanName] = React.useState("Balanced Plan")
  const [generationIndex, setGenerationIndex] = React.useState(0)

  const selectedMacroPreset =
    smartMacroPresets.find((preset) => preset.id === selectedMacroId) ??
    smartMacroPresets[0]
  const calorieGoalValue = Number.parseInt(calorieGoal || "0", 10) || 0
  const generatedMeals = React.useMemo(
    () => buildGeneratedMeals(mealCount, generationIndex),
    [generationIndex, mealCount]
  )
  const totals = React.useMemo(
    () =>
      generatedMeals.reduce(
        (accumulator, meal) => ({
          calories: accumulator.calories + meal.calories,
          carbs: accumulator.carbs + meal.carbs,
          protein: accumulator.protein + meal.protein,
          fats: accumulator.fats + meal.fats,
        }),
        { calories: 0, carbs: 0, protein: 0, fats: 0 }
      ),
    [generatedMeals]
  )
  const targets = React.useMemo(
    () => ({
      calories: calorieGoalValue,
      carbs: Math.round((calorieGoalValue * selectedMacroPreset.carbsPct) / 400),
      protein: Math.round(
        (calorieGoalValue * selectedMacroPreset.proteinPct) / 400
      ),
      fats: Math.round((calorieGoalValue * selectedMacroPreset.fatsPct) / 900),
    }),
    [calorieGoalValue, selectedMacroPreset]
  )

  const resetDialog = React.useCallback(() => {
    setGenerated(false)
    setCalorieGoal("2000")
    setSelectedMacroId("balanced")
    setMealCount(4)
    setAlternatives(1)
    setRestrictions([])
    setPlanName("Balanced Plan")
    setGenerationIndex(0)
  }, [])

  const handleGenerate = React.useCallback(() => {
    setPlanName(`${selectedMacroPreset.title} Plan`)
    setGenerated(true)
    setGenerationIndex((current) => current + 1)
  }, [selectedMacroPreset.title])

  const handleRegenerate = React.useCallback(() => {
    setGenerationIndex((current) => current + 1)
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
        {trigger ?? (
          <Button
            variant="outline"
            size="sm"
            className={triggerClassName}
          >
            <Sparkles className="size-4 text-brand-600" />
            Smart Meal Planner
            <Badge className="ml-1 rounded-full border-0 bg-violet-100 px-1.5 py-0 text-[10px] font-semibold tracking-wide text-violet-700 shadow-none">
              NEW
            </Badge>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="gap-0 overflow-hidden rounded-sm border-neutral-200 bg-white p-0 shadow-2xl shadow-black/10 sm:max-w-[980px]">
        <div className="px-5 pt-4">
          <DialogTitle className="flex items-center gap-3 text-[18px] font-semibold text-neutral-950">
            <span className="flex size-7 items-center justify-center rounded-sm bg-brand-50 text-brand-600">
              <Sparkles className="size-4" />
            </span>
            Smart Meal Planner
          </DialogTitle>
        </div>

        {!generated ? (
          <>
            <div className="space-y-6 px-5 py-5">
              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-neutral-800">
                  Calorie goal <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    value={calorieGoal}
                    onChange={(event) => setCalorieGoal(event.target.value)}
                    className="h-11 rounded-sm border-neutral-200 bg-white pr-16 pl-11 text-[18px] font-semibold shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                  <Flame className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                  <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[14px] text-neutral-400">
                    kcal
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="block text-[13px] font-medium text-neutral-800">
                    Macro split <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-3 text-[13px] text-neutral-500">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-blue-500" />
                      Carbs {targets.carbs}g
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-violet-400" />
                      Protein {targets.protein}g
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-cyan-400" />
                      Fats {targets.fats}g
                    </span>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {smartMacroPresets.map((preset) => (
                    <SmartMacroOptionCard
                      key={preset.id}
                      preset={preset}
                      isActive={selectedMacroId === preset.id}
                      onSelect={() => setSelectedMacroId(preset.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-neutral-800">
                  Total meals <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {[3, 4, 5, 6].map((count) => (
                    <Button
                      key={count}
                      type="button"
                      variant="outline"
                      onClick={() => setMealCount(count)}
                      className={cn(
                        "rounded-full border-neutral-200 bg-white px-4 text-neutral-600 shadow-none hover:bg-neutral-50",
                        mealCount === count &&
                        "border-brand-500 bg-brand-50 text-brand-700"
                      )}
                    >
                      {count} Meals
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-neutral-800">
                  Alternatives per meal
                </label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((count) => (
                    <Button
                      key={count}
                      type="button"
                      variant="outline"
                      onClick={() => setAlternatives(count)}
                      className={cn(
                        "rounded-full border-neutral-200 bg-white px-4 text-neutral-600 shadow-none hover:bg-neutral-50",
                        alternatives === count &&
                        "border-brand-500 bg-brand-50 text-brand-700"
                      )}
                    >
                      {count} {count === 1 ? "option" : "options"}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-neutral-800">
                  Dietary restrictions
                </label>
                <div className="flex flex-wrap gap-2">
                  {smartPlannerRestrictions.map((restriction) => {
                    const isActive = restrictions.includes(restriction)

                    return (
                      <Button
                        key={restriction}
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setRestrictions((current) =>
                            isActive
                              ? current.filter((item) => item !== restriction)
                              : [...current, restriction]
                          )
                        }
                        className={cn(
                          "rounded-full border-neutral-200 bg-white px-4 text-neutral-600 shadow-none hover:bg-neutral-50",
                          isActive &&
                          "border-brand-500 bg-brand-50 text-brand-700"
                        )}
                      >
                        {restriction}
                      </Button>
                    )
                  })}
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
                onClick={handleGenerate}
                className="rounded-sm bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700"
              >
                Generate Plan
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-5 px-5 py-5">
              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-neutral-800">
                  Plan name
                </label>
                <Input
                  value={planName}
                  onChange={(event) => setPlanName(event.target.value)}
                  className="h-11 rounded-sm border-neutral-200 bg-white text-[18px] font-medium shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                />
              </div>

              <div className="grid gap-3 xl:grid-cols-4">
                {[
                  {
                    label: "Calories",
                    value: `${totals.calories}`,
                    target: `${targets.calories}kcal`,
                    delta: totals.calories - targets.calories,
                    accent: "bg-amber-500",
                    bar: "bg-amber-500",
                  },
                  {
                    label: "Protein",
                    value: `${totals.protein}`,
                    target: `${targets.protein}g`,
                    delta: totals.protein - targets.protein,
                    accent: "bg-violet-400",
                    bar: "bg-violet-400",
                  },
                  {
                    label: "Carbs",
                    value: `${totals.carbs}`,
                    target: `${targets.carbs}g`,
                    delta: totals.carbs - targets.carbs,
                    accent: "bg-blue-500",
                    bar: "bg-blue-500",
                  },
                  {
                    label: "Fats",
                    value: `${totals.fats}`,
                    target: `${targets.fats}g`,
                    delta: totals.fats - targets.fats,
                    accent: "bg-cyan-400",
                    bar: "bg-cyan-400",
                  },
                ].map((item) => (
                  <Card key={item.label} className="rounded-xl border-neutral-200 shadow-none">
                    <CardHeader className="space-y-0 pb-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-[13px] text-neutral-500">
                          <span className={cn("size-2 rounded-full", item.accent)} />
                          {item.label}
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[11px] font-medium",
                            item.delta <= 0
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          )}
                        >
                          {item.delta > 0 ? `+${item.delta}` : item.delta}
                          {item.label === "Calories" ? "kcal" : "g"}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      <div className="flex items-end justify-between gap-3">
                        <div className="text-[16px] font-semibold text-neutral-950">
                          {item.value}
                          <span className="ml-1 text-[13px] font-normal text-neutral-400">
                            {item.label === "Calories" ? "kcal" : "g"}
                          </span>
                        </div>
                        <div className="text-[13px] text-neutral-400">
                          / {item.target}
                        </div>
                      </div>
                      <div className="h-1 rounded-full bg-neutral-100">
                        <div
                          className={cn("h-1 rounded-full", item.bar)}
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(
                                (Number(item.value) / Math.max(1, Number.parseInt(item.target, 10))) *
                                100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[24px] font-semibold text-neutral-950">
                    Generated Meals ({generatedMeals.length})
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRegenerate}
                    className="rounded-sm border-neutral-200 text-neutral-700 shadow-none hover:bg-neutral-50"
                  >
                    <RefreshCcw className="size-4" />
                    Regenerate
                  </Button>
                </div>

                <div className="grid gap-3 xl:grid-cols-4">
                  {generatedMeals.map((meal) => (
                    <Card
                      key={`${meal.id}-${generationIndex}`}
                      className="overflow-hidden rounded-xl border-neutral-200 shadow-none"
                    >
                      <div className="relative aspect-[1.18] overflow-hidden border-b border-neutral-200">
                        <img
                          src={meal.image}
                          alt={meal.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute left-3 bottom-3 rounded-md bg-black/60 px-2 py-1 text-[12px] font-medium text-white">
                          {meal.slot}
                        </div>
                      </div>
                      <CardContent className="space-y-3 p-3.5">
                        <div className="min-h-[56px] text-[15px] font-medium leading-6 text-neutral-950">
                          {meal.title}
                        </div>
                        <div className="text-[13px] text-neutral-500">
                          {meal.calories} kcal
                        </div>
                        <div className="h-px bg-neutral-200" />
                        <div className="grid grid-cols-3 gap-2 text-[12px] font-medium">
                          <div className="text-blue-500">{meal.carbs}g C</div>
                          <div className="text-violet-500">{meal.protein}g P</div>
                          <div className="text-cyan-500">{meal.fats}g F</div>
                        </div>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-[13px] text-neutral-500 hover:text-neutral-700"
                        >
                          {meal.ingredients} ingredients
                          <ChevronDown className="size-3.5" />
                        </button>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full rounded-sm border-neutral-200 text-neutral-700 shadow-none hover:bg-neutral-50"
                        >
                          <RefreshCcw className="size-4" />
                          Swap
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setGenerated(false)}
                className="rounded-sm px-2 text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-sm bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700"
              >
                Save Plan
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function NutritionRecipeCaloriesDonut({
  calories,
}: {
  calories: number
}) {
  const chartData = [
    { name: "Carbs", value: 34, fill: "var(--color-carbs)" },
    { name: "Protein", value: 31, fill: "var(--color-protein)" },
    { name: "Fats", value: 35, fill: "var(--color-fats)" },
  ]

  return (
    <ChartContainer config={mealPlanDonutConfig} className="size-12">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          innerRadius={16}
          outerRadius={24}
          strokeWidth={3}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-neutral-950 text-[9px] font-semibold"
                    >
                      {calories}
                    </tspan>
                  </text>
                )
              }

              return null
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

function AddMealDialog({
  trigger,
  open: openProp,
  onOpenChange,
}: {
  trigger?: React.ReactElement | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = openProp ?? internalOpen
  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (openProp === undefined) {
        setInternalOpen(nextOpen)
      }

      onOpenChange?.(nextOpen)
    },
    [onOpenChange, openProp]
  )
  const [activeTab, setActiveTab] = React.useState<
    "library" | "recipes" | "meal-ai" | "create"
  >("recipes")
  const [mealTypeFilter, setMealTypeFilter] = React.useState("All")
  const [sortBy, setSortBy] = React.useState("Popular")
  const [recipeSearch, setRecipeSearch] = React.useState("")
  const [mealAiDescription, setMealAiDescription] = React.useState("")
  const [mealAiAllergies, setMealAiAllergies] = React.useState("")
  const [mealAiType, setMealAiType] = React.useState("Breakfast")
  const [createMealName, setCreateMealName] = React.useState("")
  const [createMealDescription, setCreateMealDescription] = React.useState("")

  const resetDialog = React.useCallback(() => {
    setActiveTab("recipes")
    setMealTypeFilter("All")
    setSortBy("Popular")
    setRecipeSearch("")
    setMealAiDescription("")
    setMealAiAllergies("")
    setMealAiType("Breakfast")
    setCreateMealName("")
    setCreateMealDescription("")
  }, [])

  React.useEffect(() => {
    if (!open) {
      resetDialog()
    }
  }, [open, resetDialog])

  const filteredRecipes = React.useMemo(() => {
    return nutritionRecipeLibrary.filter((recipe) => {
      const matchesSearch = recipe.title
        .toLowerCase()
        .includes(recipeSearch.toLowerCase())
      const matchesType =
        mealTypeFilter === "All" || recipe.mealType === mealTypeFilter

      return matchesSearch && matchesType
    })
  }, [mealTypeFilter, recipeSearch])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger !== null ? (
        <DialogTrigger asChild>
          {trigger ?? (
            <Button type="button" size="sm" className={primaryActionButtonClassName}>
              <Plus className="size-4" />
              Add Meal
            </Button>
          )}
        </DialogTrigger>
      ) : null}

      <DialogContent className="flex max-h-[85vh] w-[min(92vw,820px)] flex-col gap-0 overflow-hidden rounded-sm border-neutral-200 bg-white p-0 shadow-2xl shadow-black/10 sm:max-w-[820px]">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as typeof activeTab)}
          className="flex min-h-0 flex-1 flex-col gap-0"
        >
          <div className="pt-4">
            <div className="px-5">
              <DialogTitle className="flex items-center gap-2 text-[18px] font-semibold text-neutral-950">
                <Droplets className="size-4 text-neutral-500" />
                Add Meal
              </DialogTitle>
            </div>

            <div className="mt-3 border-b border-neutral-200 px-5">
              <TabsList
                variant="line"
                className="h-auto w-full justify-start gap-6 rounded-none bg-transparent p-0"
              >
                <TabsTrigger value="library" className={createNutritionTabTriggerClassName}>
                  Your Library
                </TabsTrigger>
                <TabsTrigger value="recipes" className={createNutritionTabTriggerClassName}>
                  HubFit Recipes
                </TabsTrigger>
                <TabsTrigger value="meal-ai" className={createNutritionTabTriggerClassName}>
                  Meal AI
                </TabsTrigger>
                <TabsTrigger value="create" className={createNutritionTabTriggerClassName}>
                  Create New
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="library" className="mt-0 space-y-0">
            <div className="space-y-4 px-5 py-5">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    value=""
                    readOnly
                    placeholder="Search meal"
                    className="h-10 rounded-sm border-neutral-200 bg-white pl-10 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                </div>
                <Button variant="outline" size="icon-sm" className="size-10 rounded-sm border-neutral-200 text-neutral-500 shadow-none hover:bg-neutral-50">
                  <Search className="size-4" />
                </Button>
                <Button variant="outline" size="icon-sm" className="size-10 rounded-sm border-neutral-200 text-neutral-500 shadow-none hover:bg-neutral-50">
                  <Filter className="size-4" />
                </Button>
              </div>

              <div className="flex min-h-[430px] flex-col items-center justify-center rounded-sm border border-neutral-200 bg-white px-6 py-12 text-center">
                <div className="flex size-16 items-center justify-center rounded-sm border border-dashed border-neutral-200 bg-neutral-50 text-neutral-300">
                  <UtensilsCrossed className="size-8" />
                </div>
                <div className="mt-8 text-[18px] font-semibold text-neutral-950">
                  Your meal library is empty
                </div>
                <div className="mt-2 max-w-sm text-[14px] text-neutral-500">
                  Create your first meal in your meal library to get started.
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recipes" className="mt-0 min-h-0 overflow-y-auto space-y-0">
            <div className="space-y-4 px-5 py-5">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    value={recipeSearch}
                    onChange={(event) => setRecipeSearch(event.target.value)}
                    placeholder="Search recipes..."
                    className="h-12 rounded-sm border-neutral-200 bg-white pl-11 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                  <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-neutral-400" />
                </div>
                <Button variant="outline" className="h-12 rounded-sm border-neutral-200 text-neutral-600 shadow-none hover:bg-neutral-50">
                  <Filter className="size-4" />
                  Filters
                </Button>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-12 min-w-[120px] rounded-sm border-neutral-200 bg-white shadow-none focus-visible:border-neutral-300 focus-visible:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-md border-neutral-200/70 shadow-lg shadow-black/5">
                    <SelectItem value="Popular">Popular</SelectItem>
                    <SelectItem value="Newest">Newest</SelectItem>
                    <SelectItem value="Calories">Calories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-2">
                {["Breakfast", "Lunch", "Dinner", "Snack", "Side", "Dessert", "All"].map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant="outline"
                    onClick={() => setMealTypeFilter(type)}
                    className={cn(
                      "rounded-full border-neutral-200 bg-white px-4 text-neutral-600 shadow-none hover:bg-neutral-50",
                      mealTypeFilter === type &&
                      "border-brand-500 bg-brand-50 text-brand-700"
                    )}
                  >
                    {type}
                  </Button>
                ))}
              </div>

              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                {filteredRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="grid grid-cols-[48px_minmax(0,1fr)_58px] items-center gap-4 border-b border-neutral-200 px-4 py-3 last:border-b-0"
                  >
                    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="h-12 w-12 object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[15px] font-medium text-neutral-950">
                        {recipe.title}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        <Badge variant="outline" className="rounded-sm border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                          {recipe.carbs}g C
                        </Badge>
                        <Badge variant="outline" className="rounded-sm border-violet-200 bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600">
                          {recipe.protein}g P
                        </Badge>
                        <Badge variant="outline" className="rounded-sm border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[11px] font-medium text-cyan-600">
                          {recipe.fats}g F
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <NutritionRecipeCaloriesDonut calories={recipe.calories} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="meal-ai" className="mt-0 min-h-0 overflow-y-auto space-y-0">
            <div className="space-y-5 px-5 py-5">
              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-neutral-800">
                  Meal <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={mealAiDescription}
                  onChange={(event) => setMealAiDescription(event.target.value)}
                  placeholder="Description of the meal you want e.g. 30 grams of chicken with lettuce"
                  className="min-h-[82px] w-full resize-none rounded-sm border border-neutral-200 bg-white px-3 py-2 text-[14px] text-neutral-700 shadow-none outline-none placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-0"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-neutral-800">
                  Allergies
                </label>
                <Input
                  value={mealAiAllergies}
                  onChange={(event) => setMealAiAllergies(event.target.value)}
                  placeholder="Enter in any allergies e.g. nuts / vegan"
                  className="h-10 rounded-sm border-neutral-200 bg-white shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-neutral-800">
                  Meal Type <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 overflow-hidden rounded-sm border border-neutral-200 bg-white md:grid-cols-4">
                  {["Breakfast", "Lunch", "Dinner", "Snacks"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setMealAiType(type)}
                      className={cn(
                        "flex items-center justify-center gap-2 border-r border-neutral-200 px-4 py-3 text-[14px] text-neutral-700 last:border-r-0 hover:bg-neutral-50",
                        mealAiType === type && "bg-brand-50 text-brand-700"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <DialogClose asChild>
                <Button type="button" variant="ghost" className="rounded-sm px-2 text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-900">
                  Close
                </Button>
              </DialogClose>
              <Button type="button" className="rounded-sm bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700">
                Generate Meal
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="create" className="mt-0 min-h-0 overflow-y-auto space-y-0">
            <div className="space-y-5 px-5 py-5">
              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-neutral-800">
                  Meal Name <span className="text-rose-500">*</span>
                </label>
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_56px]">
                  <Input
                    value={createMealName}
                    onChange={(event) => setCreateMealName(event.target.value)}
                    placeholder="Name of the meal e.g. Breakfast"
                    className="h-10 rounded-sm border-neutral-200 bg-white shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                  <div className="relative flex size-14 items-center justify-center overflow-hidden rounded-sm border border-neutral-200 bg-sky-50">
                    <UtensilsCrossed className="size-6 text-neutral-500" />
                    <span className="absolute right-1 bottom-1 flex size-5 items-center justify-center rounded-full bg-black text-white">
                      <Plus className="size-3" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-neutral-800">
                  Meal Description
                </label>
                <textarea
                  value={createMealDescription}
                  onChange={(event) => setCreateMealDescription(event.target.value)}
                  placeholder="Enter any additional info"
                  className="min-h-[92px] w-full resize-none rounded-sm border border-neutral-200 bg-white px-3 py-2 text-[14px] text-neutral-700 shadow-none outline-none placeholder:text-neutral-400 focus:border-neutral-300 focus:ring-0"
                />
              </div>
            </div>

            <DialogFooter className="border-t border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <DialogClose asChild>
                <Button type="button" variant="ghost" className="rounded-sm px-2 text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-900">
                  Close
                </Button>
              </DialogClose>
              <Button
                type="button"
                disabled={!createMealName.trim()}
                className="rounded-sm bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700 disabled:opacity-45"
              >
                Add Meal
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function RenameMealBlockDialog({
  open,
  onOpenChange,
  initialValue,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValue: string
  onConfirm: (nextValue: string) => void
}) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    if (open) {
      setValue(initialValue)
    }
  }, [initialValue, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-sm border-neutral-200 bg-white p-0 shadow-2xl shadow-black/10 sm:max-w-[560px]">
        <div className="space-y-5 px-5 py-5">
          <DialogTitle className="flex items-center gap-2 text-[18px] font-semibold text-neutral-950">
            <span className="flex size-5 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Info className="size-3.5" />
            </span>
            Confirmation
          </DialogTitle>

          <div className="pl-7 text-[15px] text-neutral-600">
            Are you sure you want to proceed with this action?
          </div>

          <div className="pl-7">
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="h-11 rounded-sm border-neutral-200 bg-white text-[14px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />
          </div>
        </div>

        <DialogFooter className="border-t border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="rounded-sm border-neutral-200 text-neutral-600 shadow-none hover:bg-neutral-50"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={!value.trim()}
            onClick={() => {
              onConfirm(value.trim())
              onOpenChange(false)
            }}
            className="rounded-sm bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700 disabled:opacity-45"
          >
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function MealSectionDragHandle({
  attributes,
  listeners,
}: {
  attributes: ReturnType<typeof useSortable>["attributes"]
  listeners: ReturnType<typeof useSortable>["listeners"]
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-7 cursor-grab text-neutral-400 shadow-none hover:bg-transparent hover:text-neutral-600 active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-3.5" />
      <span className="sr-only">Move meal block</span>
    </Button>
  )
}

function NutritionMealPlanSectionCard({
  section,
  onRenameSection,
  onDeleteSection,
  attributes,
  listeners,
  setNodeRef,
  transform,
  transition,
  isDragging,
}: {
  section: NutritionMealPlanSection
  onRenameSection?: (sectionId: string, nextLabel: string) => void
  onDeleteSection?: (sectionId: string) => void
  attributes?: ReturnType<typeof useSortable>["attributes"]
  listeners?: ReturnType<typeof useSortable>["listeners"]
  setNodeRef?: (node: HTMLElement | null) => void
  transform?: { x: number; y: number; scaleX: number; scaleY: number } | null
  transition?: string
  isDragging?: boolean
}) {
  const [selectedOptionId, setSelectedOptionId] = React.useState(
    section.options[0]?.id ?? ""
  )
  const [isRenameOpen, setIsRenameOpen] = React.useState(false)
  const [isAddAlternativeOpen, setIsAddAlternativeOpen] = React.useState(false)

  React.useEffect(() => {
    setSelectedOptionId(section.options[0]?.id ?? "")
  }, [section.id, section.options])

  const activeOption =
    section.options.find((option) => option.id === selectedOptionId) ??
    section.options[0]

  if (!activeOption) {
    return null
  }

  return (
    <>
      <Card
        ref={setNodeRef}
        className="rounded-xl border-neutral-200 shadow-none data-[dragging=true]:opacity-80"
        data-dragging={isDragging}
        style={{
          transform: transform ? CSS.Transform.toString(transform) : undefined,
          transition,
        }}
      >
        <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
          <div className="flex items-center gap-2">
            {attributes && listeners ? (
              <MealSectionDragHandle attributes={attributes} listeners={listeners} />
            ) : null}
            <CardTitle className="text-[16px] font-semibold text-neutral-950">
              {section.label}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                className="size-8 rounded-sm border-neutral-200 text-neutral-600 shadow-none hover:bg-neutral-50"
              >
                <MoreVertical className="size-4" />
                <span className="sr-only">Open meal block menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-52 rounded-xl border-neutral-200/70 bg-white p-1.5 shadow-lg shadow-black/5"
            >
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault()
                  setIsAddAlternativeOpen(true)
                }}
                className="cursor-pointer rounded-lg px-3 py-2.5 text-[14px] text-neutral-800 focus:bg-neutral-50"
              >
                <RefreshCcw className="mr-2 size-4 text-neutral-500" />
                Add Alternative
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault()
                  setIsRenameOpen(true)
                }}
                className="cursor-pointer rounded-lg px-3 py-2.5 text-[14px] text-neutral-800 focus:bg-neutral-50"
              >
                <NotebookPen className="mr-2 size-4 text-neutral-500" />
                Rename Block
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault()
                  onDeleteSection?.(section.id)
                }}
                className="cursor-pointer rounded-lg px-3 py-2.5 text-[14px] text-rose-600 focus:bg-rose-50 focus:text-rose-600"
              >
                <Trash2 className="mr-2 size-4" />
                Delete Block
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-3">
            {section.options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedOptionId(option.id)}
                className={cn(
                  "rounded-sm border px-3 py-1.5 text-[13px] transition-colors",
                  option.id === activeOption.id
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-[150px_minmax(0,1fr)]">
            <div className="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
              <img
                src={activeOption.image}
                alt={activeOption.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[24px] font-semibold leading-tight text-neutral-950">
                    {activeOption.title}
                  </div>
                  <div className="mt-2 text-[14px] text-neutral-500">
                    {activeOption.carbs}g C / {activeOption.protein}g P /{" "}
                    {activeOption.fats}g F
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-[15px] font-medium text-brand-700">
                  <Flame className="size-4" />
                  {activeOption.calories} kcal
                </div>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-[14px] leading-6 text-neutral-600">
                {activeOption.description}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <RenameMealBlockDialog
        open={isRenameOpen}
        onOpenChange={setIsRenameOpen}
        initialValue={section.label}
        onConfirm={(nextValue) => onRenameSection?.(section.id, nextValue)}
      />

      <AddMealDialog
        open={isAddAlternativeOpen}
        onOpenChange={setIsAddAlternativeOpen}
        trigger={null}
      />
    </>
  )
}

function SortableNutritionMealPlanSectionCard({
  section,
  onRenameSection,
  onDeleteSection,
}: {
  section: NutritionMealPlanSection
  onRenameSection?: (sectionId: string, nextLabel: string) => void
  onDeleteSection?: (sectionId: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: section.id,
    })

  return (
    <NutritionMealPlanSectionCard
      section={section}
      onRenameSection={onRenameSection}
      onDeleteSection={onDeleteSection}
      attributes={attributes}
      listeners={listeners}
      setNodeRef={setNodeRef}
      transform={transform}
      transition={transition}
      isDragging={isDragging}
    />
  )
}

type NutritionMealPlanWorkspaceProps = {
  mealPlanId: string
  phase?: string
  pathHint?: string
}

function useNutritionMealPlanWorkspace({
  mealPlanId,
  phase,
  pathHint,
}: NutritionMealPlanWorkspaceProps) {
  const preset = React.useMemo(() => getNutritionPreset(phase), [phase])
  const { hasLoadedStoredMealPlans, storedMealPlans } =
    useStoredNutritionMealPlans(pathHint)
  const availableMealPlans = React.useMemo(
    () => mergeNutritionMealPlans(preset.mealPlans, storedMealPlans),
    [preset.mealPlans, storedMealPlans]
  )
  const storedMealPlan = React.useMemo(
    () => storedMealPlans.find((plan) => plan.id === mealPlanId),
    [mealPlanId, storedMealPlans]
  )
  const mealPlan = React.useMemo(
    () => availableMealPlans.find((plan) => plan.id === mealPlanId),
    [availableMealPlans, mealPlanId]
  )
  const baseSections = React.useMemo(
    () =>
      storedMealPlan?.sections ??
      (mealPlan ? nutritionMealPlanSections[mealPlan.id] ?? [] : []),
    [mealPlan, storedMealPlan]
  )
  const macros = React.useMemo(
    () => parseMealPlanMacros(mealPlan?.macros ?? ""),
    [mealPlan]
  )
  const [sections, setSections] = React.useState(baseSections)
  const reorderToastTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  React.useEffect(() => {
    setSections(baseSections)
  }, [baseSections])

  React.useEffect(() => {
    return () => {
      if (reorderToastTimeoutRef.current) {
        clearTimeout(reorderToastTimeoutRef.current)
      }
    }
  }, [])

  const scheduleSavedToast = React.useCallback((delay = 0) => {
    if (reorderToastTimeoutRef.current) {
      clearTimeout(reorderToastTimeoutRef.current)
    }

    reorderToastTimeoutRef.current = setTimeout(() => {
      toast.success("Changes saved", {
        id: "nutrition-meal-plan-order-saved",
      })
    }, delay)
  }, [])

  const handleSectionDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (active && over && active.id !== over.id) {
        setSections((currentSections) => {
          const oldIndex = currentSections.findIndex(
            (section) => section.id === active.id
          )
          const newIndex = currentSections.findIndex(
            (section) => section.id === over.id
          )

          return arrayMove(currentSections, oldIndex, newIndex)
        })

        scheduleSavedToast(650)
      }
    },
    [scheduleSavedToast]
  )

  const handleRenameSection = React.useCallback(
    (sectionId: string, nextLabel: string) => {
      setSections((currentSections) =>
        currentSections.map((section) =>
          section.id === sectionId ? { ...section, label: nextLabel } : section
        )
      )
      scheduleSavedToast()
    },
    [scheduleSavedToast]
  )

  const handleDeleteSection = React.useCallback(
    (sectionId: string) => {
      setSections((currentSections) =>
        currentSections.filter((section) => section.id !== sectionId)
      )
      scheduleSavedToast()
    },
    [scheduleSavedToast]
  )

  return {
    hasLoadedStoredMealPlans,
    macros,
    mealPlan,
    storedMealPlan,
    sections,
    sensors,
    handleDeleteSection,
    handleRenameSection,
    handleSectionDragEnd,
  }
}

function NutritionMealPlanHeader({
  title,
  backHref,
  actions,
}: {
  title: string
  backHref: string
  actions?: React.ReactNode
}) {
  const router = useRouter()

  return (
    <div className="border-b border-neutral-200 bg-neutral-50">
      <div className="flex min-h-10 flex-col gap-2 px-4 py-1.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-8 rounded-sm text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
            onClick={() => router.push(backHref)}
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Back to nutrition</span>
          </Button>
          <div className="min-w-0">
            <div className="truncate text-[17px] font-semibold text-neutral-950">
              {title}
            </div>
          </div>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  )
}

function NutritionMealPlanWorkspace({
  mealPlan,
  macros,
  sections,
  sensors,
  onSectionDragEnd,
  onRenameSection,
  onDeleteSection,
}: {
  mealPlan: NutritionMealPlan
  macros: ReturnType<typeof parseMealPlanMacros>
  sections: NutritionMealPlanSection[]
  sensors: ReturnType<typeof useSensors>
  onSectionDragEnd: (event: DragEndEvent) => void
  onRenameSection: (sectionId: string, nextLabel: string) => void
  onDeleteSection: (sectionId: string) => void
}) {
  return (
    <>
      <Card className="rounded-xl border-neutral-200 shadow-none">
        <CardContent className="space-y-5 p-5">
          <div className="inline-flex items-center gap-2 text-[17px] font-semibold text-neutral-950">
            <Flame className="size-4.5 text-brand-600" />
            {mealPlan.calories} kcal
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                label: "Carbs",
                grams: macros.carbs,
                percent:
                  mealPlan.segments.find((segment) => segment.macro === "carbs")
                    ?.value ?? 0,
                barClassName: "bg-blue-500",
              },
              {
                label: "Protein",
                grams: macros.protein,
                percent:
                  mealPlan.segments.find((segment) => segment.macro === "protein")
                    ?.value ?? 0,
                barClassName: "bg-violet-400",
              },
              {
                label: "Fat",
                grams: macros.fats,
                percent:
                  mealPlan.segments.find((segment) => segment.macro === "fats")
                    ?.value ?? 0,
                barClassName: "bg-cyan-400",
              },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-[14px] font-medium text-neutral-900">
                  <span>{item.label}</span>
                  <span>{item.percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-100">
                  <div
                    className={cn("h-2 rounded-full", item.barClassName)}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <div className="text-[14px] text-neutral-500">
                  {item.grams}g
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={onSectionDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={sections.map((section) => section.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {sections.map((section) => (
              <SortableNutritionMealPlanSectionCard
                key={section.id}
                section={section}
                onRenameSection={onRenameSection}
                onDeleteSection={onDeleteSection}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  )
}

export function ClientNutritionMealPlansView({
  phase,
}: {
  phase?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const preset = React.useMemo(() => getNutritionPreset(phase), [phase])
  const { clientId, storedMealPlans } = useStoredNutritionMealPlans(pathname)
  const [hiddenMealPlanIds, setHiddenMealPlanIds] = React.useState<string[]>([])
  const allMealPlans = React.useMemo(
    () => mergeNutritionMealPlans(preset.mealPlans, storedMealPlans),
    [preset.mealPlans, storedMealPlans]
  )
  const mealPlans = React.useMemo(
    () => allMealPlans.filter((plan) => !hiddenMealPlanIds.includes(plan.id)),
    [allMealPlans, hiddenMealPlanIds]
  )

  const handleOpenMealPlan = React.useCallback(
    (mealPlanId: string) => {
      router.push(
        buildCoachWiseHref(
          pathname,
          getNutritionPlanDetailHref(mealPlanId, pathname)
        )
      )
    },
    [pathname, router]
  )

  const handleOpenMealPlanEditor = React.useCallback(
    (mealPlanId: string) => {
      router.push(
        buildCoachWiseHref(
          pathname,
          getNutritionPlanEditorHref(mealPlanId, pathname)
        )
      )
    },
    [pathname, router]
  )

  const handleCopyMealPlan = React.useCallback((plan: NutritionMealPlan) => {
    if (!clientId) {
      toast.error("Could not duplicate meal plan", {
        description: `For ${plan.title}.`,
      })
      return
    }

    const sourceStoredMealPlan = storedMealPlans.find(
      (storedPlan) => storedPlan.id === plan.id
    )
    const sourceSections =
      sourceStoredMealPlan?.sections ?? nutritionMealPlanSections[plan.id] ?? []
    const nextTitle = buildNextDuplicatedMealPlanTitle(
      plan.title,
      allMealPlans.map((mealPlan) => mealPlan.title)
    )

    const duplicatedPlan: StoredNutritionMealPlan = {
      id:
        globalThis.crypto?.randomUUID?.() ??
        `custom-meal-plan-${Date.now()}-${Math.round(Math.random() * 10000)}`,
      title: nextTitle,
      subtitle: plan.subtitle,
      type: plan.type,
      calories: plan.calories,
      macros: plan.macros,
      schedule: plan.schedule,
      segments: plan.segments.map((segment) => ({ ...segment })),
      sections: sourceSections.map((section) => ({
        ...section,
        options: section.options.map((option) => ({ ...option })),
      })),
      createdAt: new Date().toISOString(),
      builderSnapshot: sourceStoredMealPlan?.macroBuilderSnapshot
        ? undefined
        : buildMealPlanBuilderSnapshotFromSections({
            planName: nextTitle,
            sections: sourceSections,
            builderSnapshot: sourceStoredMealPlan?.builderSnapshot,
          }),
      macroBuilderSnapshot: sourceStoredMealPlan?.macroBuilderSnapshot
        ? cloneStoredNutritionMacroPlanBuilderSnapshot(
            sourceStoredMealPlan.macroBuilderSnapshot,
            {
              planName: nextTitle,
            }
          )
        : undefined,
    }

    upsertStoredNutritionMealPlan(clientId, duplicatedPlan)

    toast.success(
      plan.type.toLowerCase().includes("macro")
        ? "Macro plan duplicated"
        : "Meal plan duplicated",
      {
      description: `Created ${nextTitle}.`,
      }
    )
  }, [allMealPlans, clientId, storedMealPlans])

  const handleDeleteMealPlan = React.useCallback((plan: NutritionMealPlan) => {
    setHiddenMealPlanIds((currentIds) =>
      currentIds.includes(plan.id) ? currentIds : [...currentIds, plan.id]
    )

    if (clientId) {
      removeStoredNutritionMealPlan(clientId, plan.id)
    }

    toast.success("Meal plan deleted", {
      description: `For ${plan.title}.`,
    })
  }, [clientId])

  const tableRows = React.useMemo<NutritionPlansTableRow[]>(
    () =>
      mealPlans.map((plan) => ({
        id: plan.id,
        title: plan.title,
        subtitle: plan.subtitle,
        type: plan.type,
        calories: plan.calories,
        segments: plan.segments,
      })),
    [mealPlans]
  )

  return (
    <div className="bg-neutral-50 px-4 py-4">
      <div className="mb-5">
        <NutritionSectionTitle title="Create plans" />
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-stretch">
          <ClientQuickActionCard
            sectionLabel="Nutrition"
            title="New Meal Plan"
            description="Build a meal plan from scratch or start from a template."
            icon={<UtensilsCrossed className="size-4" />}
            tone="nutrition"
            href={buildCoachWiseHref(
              pathname,
              getNutritionCreateMealPlanHref(pathname)
            )}
            size="compact"
            className="md:w-[21rem]"
          />
          <ClientQuickActionCard
            sectionLabel="Nutrition"
            title="Macro Plan (IIFYM)"
            description="Set macro targets for a more flexible nutrition approach."
            icon={<Beef className="size-4" />}
            tone="programs"
            href={buildCoachWiseHref(
              pathname,
              getNutritionCreateMacroPlanHref(pathname)
            )}
            size="compact"
            className="md:w-[21rem]"
          />
        </div>
      </div>

      <div>
        <NutritionSectionTitle title="Existing plans" />
        <NutritionPlansTable
          rows={tableRows}
          onOpenRow={(row) => handleOpenMealPlan(row.id)}
          onEditRow={(row) => handleOpenMealPlanEditor(row.id)}
          onDuplicateRow={(row) => {
            const plan = mealPlans.find((entry) => entry.id === row.id)
            if (plan) {
              return handleCopyMealPlan(plan)
            }
          }}
          onDeleteRow={(row) => {
            const plan = mealPlans.find((entry) => entry.id === row.id)
            if (plan) {
              return handleDeleteMealPlan(plan)
            }
          }}
        />
      </div>
    </div>
  )
}

export function ClientNutritionLoggerView({
  phase,
}: {
  phase?: string
}) {
  const preset = React.useMemo(() => getNutritionPreset(phase), [phase])
  const iifymWeeks = React.useMemo(
    () => chunkNutritionWeeks(preset.iifymEntries),
    [preset.iifymEntries]
  )
  const [iifymWeekIndex, setIifymWeekIndex] = React.useState(
    Math.max(0, iifymWeeks.length - 1)
  )
  const [visibleIifymSeries, setVisibleIifymSeries] = React.useState<
    Record<(typeof iifymSeries)[number]["key"], boolean>
  >({
    calories: true,
    protein: true,
    carbs: true,
    fats: true,
    fiber: true,
  })

  React.useEffect(() => {
    setIifymWeekIndex(Math.max(0, iifymWeeks.length - 1))
  }, [iifymWeeks.length])

  const visibleIifymWeek = iifymWeeks[iifymWeekIndex] ?? []
  const iifymWeekLabel = React.useMemo(
    () => formatNutritionWeekRange(visibleIifymWeek),
    [visibleIifymWeek]
  )
  const loggedDaysCount = React.useMemo(
    () => visibleIifymWeek.filter((entry) => entry.loggedMeals > 0).length,
    [visibleIifymWeek]
  )
  const weeklyCompliance = Math.round(
    (loggedDaysCount / Math.max(1, visibleIifymWeek.length)) * 100
  )
  const iifymChartData = React.useMemo(
    () =>
      visibleIifymWeek.map((entry) => ({
        day: `${entry.dayNumber} ${new Date(`${entry.date}T00:00:00`).toLocaleString("en-US", { month: "short" })}`,
        dayLabel: nutritionMonthDayFormatter.format(
          new Date(`${entry.date}T00:00:00`)
        ),
        calories: entry.calories,
        protein: entry.protein,
        carbs: entry.carbs,
        fats: entry.fats,
        fiber: entry.fiber,
        rawCalories: entry.calories,
        rawProtein: entry.protein,
        rawCarbs: entry.carbs,
        rawFats: entry.fats,
        rawFiber: entry.fiber,
      })),
    [visibleIifymWeek]
  )
  const macroBreakdownRows = React.useMemo(
    () =>
      [
        {
          label: "Calories",
          unit: "kcal",
          values: visibleIifymWeek.map((entry) => entry.calories),
        },
        {
          label: "Protein",
          unit: "g",
          values: visibleIifymWeek.map((entry) => entry.protein),
        },
        {
          label: "Carbs",
          unit: "g",
          values: visibleIifymWeek.map((entry) => entry.carbs),
        },
        {
          label: "Fat",
          unit: "g",
          values: visibleIifymWeek.map((entry) => entry.fats),
        },
        {
          label: "Fiber",
          unit: "g",
          values: visibleIifymWeek.map((entry) => entry.fiber),
        },
        {
          label: "Sugar",
          unit: "g",
          values: visibleIifymWeek.map((entry) => entry.sugar),
        },
        {
          label: "Sodium",
          unit: "mg",
          values: visibleIifymWeek.map((entry) => entry.sodium),
        },
        {
          label: "Potassium",
          unit: "mg",
          values: visibleIifymWeek.map((entry) => entry.potassium),
        },
        {
          label: "Saturated Fat",
          unit: "g",
          values: visibleIifymWeek.map((entry) => entry.saturatedFat),
        },
        {
          label: "Polyunsaturated Fat",
          unit: "g",
          values: visibleIifymWeek.map((entry) => entry.polyunsaturatedFat),
        },
        {
          label: "Monounsaturated Fat",
          unit: "g",
          values: visibleIifymWeek.map((entry) => entry.monounsaturatedFat),
        },
      ].map((row) => {
        const total = row.values.reduce((sum, value) => sum + value, 0)

        return {
          label: row.label,
          unit: row.unit,
          avg: total / Math.max(1, row.values.length),
          total,
        }
      }),
    [visibleIifymWeek]
  )

  return (
    <div className="space-y-4 bg-neutral-50 px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-sm border border-neutral-200 bg-white px-3 py-2 text-[15px] font-medium text-neutral-900">
          Macros Target
          <Info className="size-4 text-neutral-400" />
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() =>
              setIifymWeekIndex((current) => Math.max(0, current - 1))
            }
            disabled={iifymWeekIndex === 0}
            className="rounded-sm border-neutral-200 text-neutral-700 shadow-none hover:bg-neutral-50 disabled:opacity-45"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <div className="inline-flex min-w-[178px] items-center justify-between gap-3 rounded-sm border border-neutral-200 bg-white px-3 py-2 text-[14px] font-medium text-neutral-900">
            <span>{iifymWeekLabel}</span>
            <CalendarDays className="size-4 text-neutral-400" />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() =>
              setIifymWeekIndex((current) =>
                Math.min(iifymWeeks.length - 1, current + 1)
              )
            }
            disabled={iifymWeekIndex >= iifymWeeks.length - 1}
            className="rounded-sm border-neutral-200 text-neutral-700 shadow-none hover:bg-neutral-50 disabled:opacity-45"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.45fr)_minmax(330px,0.55fr)]">
        <Card className="rounded-xl border-neutral-200 shadow-none">
          <CardContent className="space-y-4 p-5">
            <div className="flex flex-wrap items-center gap-2.5">
              {iifymSeries.map((series) => (
                <button
                  key={series.key}
                  type="button"
                  onClick={() =>
                    setVisibleIifymSeries((current) => ({
                      ...current,
                      [series.key]: !current[series.key],
                    }))
                  }
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] transition-colors",
                    visibleIifymSeries[series.key]
                      ? "border-neutral-200 bg-white text-neutral-700"
                      : "border-neutral-200 bg-neutral-100 text-neutral-400"
                  )}
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: series.color }}
                  />
                  {series.label}
                </button>
              ))}
            </div>

            <ChartContainer config={iifymChartConfig} className="h-[360px] w-full">
              <AreaChart
                accessibilityLayer
                data={iifymChartData}
                margin={{ left: 10, right: 16, top: 10, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="#e5e7eb" />
                <YAxis
                  yAxisId="calories"
                  hide
                  domain={[
                    0,
                    (dataMax: number) => Math.max(2400, Math.ceil(dataMax * 1.12)),
                  ]}
                />
                <YAxis
                  yAxisId="macros"
                  orientation="right"
                  hide
                  domain={[
                    0,
                    (dataMax: number) => Math.max(320, Math.ceil(dataMax * 1.18)),
                  ]}
                />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <ChartTooltip cursor={false} content={<NutritionIifymTooltip />} />
                <defs>
                  <linearGradient id="fillCalories" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={iifymChartConfig.calories.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={iifymChartConfig.calories.color} stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="fillProtein" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={iifymChartConfig.protein.color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={iifymChartConfig.protein.color} stopOpacity={0.04} />
                  </linearGradient>
                  <linearGradient id="fillCarbs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={iifymChartConfig.carbs.color} stopOpacity={0.24} />
                    <stop offset="95%" stopColor={iifymChartConfig.carbs.color} stopOpacity={0.04} />
                  </linearGradient>
                  <linearGradient id="fillFats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={iifymChartConfig.fats.color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={iifymChartConfig.fats.color} stopOpacity={0.04} />
                  </linearGradient>
                  <linearGradient id="fillFiber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={iifymChartConfig.fiber.color} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={iifymChartConfig.fiber.color} stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                {visibleIifymSeries.calories ? (
                  <Area
                    yAxisId="calories"
                    dataKey="calories"
                    type="natural"
                    stroke={iifymChartConfig.calories.color}
                    fill="url(#fillCalories)"
                    fillOpacity={1}
                    strokeWidth={2.5}
                  />
                ) : null}
                {visibleIifymSeries.protein ? (
                  <Area
                    yAxisId="macros"
                    dataKey="protein"
                    type="natural"
                    stroke={iifymChartConfig.protein.color}
                    fill="url(#fillProtein)"
                    fillOpacity={1}
                    strokeWidth={2}
                  />
                ) : null}
                {visibleIifymSeries.carbs ? (
                  <Area
                    yAxisId="macros"
                    dataKey="carbs"
                    type="natural"
                    stroke={iifymChartConfig.carbs.color}
                    fill="url(#fillCarbs)"
                    fillOpacity={1}
                    strokeWidth={2}
                  />
                ) : null}
                {visibleIifymSeries.fats ? (
                  <Area
                    yAxisId="macros"
                    dataKey="fats"
                    type="natural"
                    stroke={iifymChartConfig.fats.color}
                    fill="url(#fillFats)"
                    fillOpacity={1}
                    strokeWidth={2}
                  />
                ) : null}
                {visibleIifymSeries.fiber ? (
                  <Area
                    yAxisId="macros"
                    dataKey="fiber"
                    type="natural"
                    stroke={iifymChartConfig.fiber.color}
                    fill="url(#fillFiber)"
                    fillOpacity={1}
                    strokeWidth={1.75}
                  />
                ) : null}
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Card className="rounded-xl border-neutral-200 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-[16px] font-semibold text-neutral-950">
                  Logged Meals
                </CardTitle>
                <div className="text-[14px] font-medium text-brand-600">
                  {loggedDaysCount}/{visibleIifymWeek.length}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {visibleIifymWeek.map((entry) => (
                  <div
                    key={entry.id}
                    className="space-y-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-3 text-center"
                  >
                    <div className="text-[12px] font-medium text-neutral-500">
                      {entry.dayShort}
                    </div>
                    <div
                      className={cn(
                        "text-[18px] font-semibold",
                        entry.loggedMeals > 0
                          ? "text-neutral-950"
                          : "text-neutral-300"
                      )}
                    >
                      {entry.dayNumber}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {entry.loggedMeals}/{4}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-neutral-200 pt-4">
                <div className="inline-flex items-center gap-1.5 text-[14px] text-neutral-700">
                  Weekly Compliance
                  <Info className="size-3.5 text-neutral-400" />
                </div>
                <div className="flex items-center gap-2 text-[14px] font-medium">
                  <span className="text-neutral-500">
                    {loggedDaysCount}/{visibleIifymWeek.length}
                  </span>
                  <span
                    className={cn(
                      weeklyCompliance >= 85
                        ? "text-emerald-600"
                        : "text-rose-500"
                    )}
                  >
                    {weeklyCompliance}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-neutral-200 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-[16px] font-semibold text-neutral-950">
                Macros Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader className="bg-transparent">
                  <TableRow className="border-neutral-200 hover:bg-transparent">
                    <TableHead className="px-0 text-[13px] font-medium text-neutral-500">
                      Macro
                    </TableHead>
                    <TableHead className="text-right text-[13px] font-medium text-neutral-500">
                      Avg
                    </TableHead>
                    <TableHead className="pr-0 text-right text-[13px] font-medium text-neutral-500">
                      Total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {macroBreakdownRows.map((row) => (
                    <TableRow
                      key={row.label}
                      className="border-neutral-200 hover:bg-transparent"
                    >
                      <TableCell className="px-0 py-2 text-[14px] text-neutral-800">
                        {row.label}
                      </TableCell>
                      <TableCell className="py-2 text-right text-[14px] text-neutral-500">
                        {formatMacroCellValue(row.avg, row.unit)}
                      </TableCell>
                      <TableCell className="pr-0 py-2 text-right text-[14px] text-neutral-800">
                        {formatMacroCellValue(row.total, row.unit)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function CreateNutritionPlanAction({
  phase,
  triggerClassName,
  trigger,
}: {
  phase?: string
  triggerClassName?: string
  trigger?: React.ReactNode
}) {
  const preset = React.useMemo(() => getNutritionPreset(phase), [phase])

  return (
    <CreateNutritionPlanDialog
      triggerClassName={triggerClassName}
      libraryPlans={preset.mealPlans}
      trigger={trigger}
    />
  )
}

export function SmartMealPlannerAction({
  triggerClassName,
  trigger,
}: {
  triggerClassName?: string
  trigger?: React.ReactNode
}) {
  return (
    <SmartMealPlannerDialog
      triggerClassName={triggerClassName}
      trigger={trigger}
    />
  )
}

export function MealPlanDetailView({
  mealPlanId,
  phase,
  backHref,
}: {
  mealPlanId: string
  phase?: string
  backHref?: string
}) {
  const pathname = usePathname()
  const {
    hasLoadedStoredMealPlans,
    macros,
    mealPlan,
    sections,
    sensors,
    handleDeleteSection,
    handleRenameSection,
    handleSectionDragEnd,
  } = useNutritionMealPlanWorkspace({
    mealPlanId,
    phase,
    pathHint: backHref ?? pathname,
  })

  if (!mealPlan && !hasLoadedStoredMealPlans) {
    return null
  }

  if (!mealPlan) {
    return (
      <div className="px-2 pt-2 text-sm text-neutral-500">
        Meal plan not found.
      </div>
    )
  }

  const resolvedBackHref = backHref ?? `${pathname}?nutritionTab=nutrition`

  return (
    <div className="min-w-0 bg-neutral-50">
      <NutritionMealPlanHeader
        title={mealPlan.title}
        backHref={resolvedBackHref}
        actions={
          <PrimaryActionButton
            label="Edit Plan"
            icon={Pencil}
            href={buildCoachWiseHref(
              pathname,
              getNutritionPlanEditorHref(mealPlan.id, resolvedBackHref)
            )}
          />
        }
      />

      <div className="mx-auto max-w-[980px] space-y-4 px-4 py-4">
        <NutritionMealPlanWorkspace
          mealPlan={mealPlan}
          macros={macros}
          sections={sections}
          sensors={sensors}
          onSectionDragEnd={handleSectionDragEnd}
          onRenameSection={handleRenameSection}
          onDeleteSection={handleDeleteSection}
        />
      </div>
    </div>
  )
}

export function MealPlanEditPageView({
  mealPlanId,
  phase,
  backHref,
}: {
  mealPlanId: string
  phase?: string
  backHref: string
}) {
  const {
    hasLoadedStoredMealPlans,
    mealPlan,
    storedMealPlan,
    sections,
  } = useNutritionMealPlanWorkspace({
    mealPlanId,
    phase,
    pathHint: backHref,
  })

  if (!mealPlan && !hasLoadedStoredMealPlans) {
    return null
  }

  if (!mealPlan) {
    return (
      <div className="px-2 pt-2 text-sm text-neutral-500">
        Meal plan not found.
      </div>
    )
  }

  if (storedMealPlan?.macroBuilderSnapshot) {
    return (
      <SharedMacroPlanBuilderPageView
        backHref={backHref}
        mealPlanId={mealPlan.id}
        initialSnapshot={storedMealPlan.macroBuilderSnapshot}
        createdAt={storedMealPlan.createdAt}
      />
    )
  }

  const initialSnapshot = buildMealPlanBuilderSnapshotFromSections({
    planName: mealPlan.title,
    sections,
    builderSnapshot: storedMealPlan?.builderSnapshot,
  })

  return (
    <SharedMealPlanBuilderEditPageView
      backHref={backHref}
      mealPlanId={mealPlan.id}
      initialSnapshot={initialSnapshot}
      createdAt={storedMealPlan?.createdAt}
    />
  )
}

export function MacroPlanCreatePageView({
  backHref,
}: {
  backHref: string
}) {
  const router = useRouter()
  const [generated, setGenerated] = React.useState(false)
  const [calorieGoal, setCalorieGoal] = React.useState("2000")
  const [selectedMacroId, setSelectedMacroId] = React.useState("balanced")
  const [mealCount, setMealCount] = React.useState(4)
  const [alternatives, setAlternatives] = React.useState(1)
  const [restrictions, setRestrictions] = React.useState<string[]>([])
  const [planName, setPlanName] = React.useState("Balanced Plan")
  const [generationIndex, setGenerationIndex] = React.useState(0)
  const selectedMacroPreset =
    smartMacroPresets.find((preset) => preset.id === selectedMacroId) ??
    smartMacroPresets[0]
  const calorieGoalValue = Number.parseInt(calorieGoal || "0", 10) || 0
  const generatedMeals = React.useMemo(
    () => buildGeneratedMeals(mealCount, generationIndex),
    [generationIndex, mealCount]
  )
  const totals = React.useMemo(
    () =>
      generatedMeals.reduce(
        (accumulator, meal) => ({
          calories: accumulator.calories + meal.calories,
          carbs: accumulator.carbs + meal.carbs,
          protein: accumulator.protein + meal.protein,
          fats: accumulator.fats + meal.fats,
        }),
        { calories: 0, carbs: 0, protein: 0, fats: 0 }
      ),
    [generatedMeals]
  )
  const targets = React.useMemo(
    () => ({
      calories: calorieGoalValue,
      carbs: Math.round((calorieGoalValue * selectedMacroPreset.carbsPct) / 400),
      protein: Math.round(
        (calorieGoalValue * selectedMacroPreset.proteinPct) / 400
      ),
      fats: Math.round((calorieGoalValue * selectedMacroPreset.fatsPct) / 900),
    }),
    [calorieGoalValue, selectedMacroPreset]
  )

  const handleGenerate = React.useCallback(() => {
    setPlanName(`${selectedMacroPreset.title} Plan`)
    setGenerated(true)
    setGenerationIndex((current) => current + 1)
  }, [selectedMacroPreset.title])

  const handleRegenerate = React.useCallback(() => {
    setGenerationIndex((current) => current + 1)
  }, [])

  const handleSavePlan = React.useCallback(() => {
    const nextPlanName = planName.trim() || "Macro Plan (IIFYM)"

    toast.success("Macro plan created", {
      description: `For ${nextPlanName}.`,
    })

    router.push(backHref)
  }, [backHref, planName, router])

  return (
    <div className="min-w-0 bg-neutral-50">
      <NutritionMealPlanHeader
        title={generated ? planName.trim() || "Macro Plan (IIFYM)" : "Create Macro Plan (IIFYM)"}
        backHref={backHref}
      />

      <div className="mx-auto max-w-[1100px] px-4 py-4">
        <Card className="overflow-hidden rounded-xl border-neutral-200 shadow-none">
          <div className="border-b border-neutral-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Sparkles className="size-4.5" />
              </span>
              <div className="space-y-1">
                <div className="text-[18px] font-semibold text-neutral-950">
                  Smart Macro Planner
                </div>
                <div className="text-[13px] leading-5 text-neutral-500">
                  Generate a flexible IIFYM setup and review the meal structure
                  before saving it.
                </div>
              </div>
            </div>
          </div>

          {!generated ? (
            <>
              <div className="space-y-6 p-5">
                <div className="space-y-2">
                  <label className="block text-[13px] font-medium text-neutral-800">
                    Calorie goal <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      value={calorieGoal}
                      onChange={(event) => setCalorieGoal(event.target.value)}
                      className="h-11 rounded-sm border-neutral-200 bg-white pr-16 pl-11 text-[18px] font-semibold shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                    />
                    <Flame className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                    <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[14px] text-neutral-400">
                      kcal
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label className="block text-[13px] font-medium text-neutral-800">
                      Macro split <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex flex-wrap items-center gap-3 text-[13px] text-neutral-500">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-blue-500" />
                        Carbs {targets.carbs}g
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-violet-400" />
                        Protein {targets.protein}g
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-cyan-400" />
                        Fats {targets.fats}g
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    {smartMacroPresets.map((preset) => (
                      <SmartMacroOptionCard
                        key={preset.id}
                        preset={preset}
                        isActive={selectedMacroId === preset.id}
                        onSelect={() => setSelectedMacroId(preset.id)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[13px] font-medium text-neutral-800">
                    Total meals <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[3, 4, 5, 6].map((count) => (
                      <Button
                        key={count}
                        type="button"
                        variant="outline"
                        onClick={() => setMealCount(count)}
                        className={cn(
                          "rounded-full border-neutral-200 bg-white px-4 text-neutral-600 shadow-none hover:bg-neutral-50",
                          mealCount === count &&
                          "border-brand-500 bg-brand-50 text-brand-700"
                        )}
                      >
                        {count} Meals
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[13px] font-medium text-neutral-800">
                    Alternatives per meal
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((count) => (
                      <Button
                        key={count}
                        type="button"
                        variant="outline"
                        onClick={() => setAlternatives(count)}
                        className={cn(
                          "rounded-full border-neutral-200 bg-white px-4 text-neutral-600 shadow-none hover:bg-neutral-50",
                          alternatives === count &&
                          "border-brand-500 bg-brand-50 text-brand-700"
                        )}
                      >
                        {count} {count === 1 ? "option" : "options"}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[13px] font-medium text-neutral-800">
                    Dietary restrictions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {smartPlannerRestrictions.map((restriction) => {
                      const isActive = restrictions.includes(restriction)

                      return (
                        <Button
                          key={restriction}
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setRestrictions((current) =>
                              isActive
                                ? current.filter((item) => item !== restriction)
                                : [...current, restriction]
                            )
                          }
                          className={cn(
                            "rounded-full border-neutral-200 bg-white px-4 text-neutral-600 shadow-none hover:bg-neutral-50",
                            isActive &&
                            "border-brand-500 bg-brand-50 text-brand-700"
                          )}
                        >
                          {restriction}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-neutral-200 px-5 py-4">
                <SecondaryActionButton
                  label="Cancel"
                  onClick={() => router.push(backHref)}
                />
                <PrimaryActionButton
                  label="Generate Plan"
                  onClick={handleGenerate}
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-5 p-5">
                <div className="space-y-2">
                  <label className="block text-[13px] font-medium text-neutral-800">
                    Plan name
                  </label>
                  <Input
                    value={planName}
                    onChange={(event) => setPlanName(event.target.value)}
                    className="h-11 rounded-sm border-neutral-200 bg-white text-[18px] font-medium shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                </div>

                <div className="grid gap-3 xl:grid-cols-4">
                  {[
                    {
                      label: "Calories",
                      value: `${totals.calories}`,
                      target: `${targets.calories}kcal`,
                      delta: totals.calories - targets.calories,
                      accent: "bg-amber-500",
                      bar: "bg-amber-500",
                    },
                    {
                      label: "Protein",
                      value: `${totals.protein}`,
                      target: `${targets.protein}g`,
                      delta: totals.protein - targets.protein,
                      accent: "bg-violet-400",
                      bar: "bg-violet-400",
                    },
                    {
                      label: "Carbs",
                      value: `${totals.carbs}`,
                      target: `${targets.carbs}g`,
                      delta: totals.carbs - targets.carbs,
                      accent: "bg-blue-500",
                      bar: "bg-blue-500",
                    },
                    {
                      label: "Fats",
                      value: `${totals.fats}`,
                      target: `${targets.fats}g`,
                      delta: totals.fats - targets.fats,
                      accent: "bg-cyan-400",
                      bar: "bg-cyan-400",
                    },
                  ].map((item) => (
                    <Card
                      key={item.label}
                      className="rounded-xl border-neutral-200 shadow-none"
                    >
                      <CardHeader className="space-y-0 pb-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-[13px] text-neutral-500">
                            <span className={cn("size-2 rounded-full", item.accent)} />
                            {item.label}
                          </div>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[11px] font-medium",
                              item.delta <= 0
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-amber-50 text-amber-600"
                            )}
                          >
                            {item.delta > 0 ? `+${item.delta}` : item.delta}
                            {item.label === "Calories" ? "kcal" : "g"}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-0">
                        <div className="flex items-end justify-between gap-3">
                          <div className="text-[16px] font-semibold text-neutral-950">
                            {item.value}
                            <span className="ml-1 text-[13px] font-normal text-neutral-400">
                              {item.label === "Calories" ? "kcal" : "g"}
                            </span>
                          </div>
                          <div className="text-[13px] text-neutral-400">
                            / {item.target}
                          </div>
                        </div>
                        <div className="h-1 rounded-full bg-neutral-100">
                          <div
                            className={cn("h-1 rounded-full", item.bar)}
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round(
                                  (Number(item.value) /
                                    Math.max(
                                      1,
                                      Number.parseInt(item.target, 10)
                                    )) *
                                  100
                                )
                              )}%`,
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[24px] font-semibold text-neutral-950">
                      Generated Meals ({generatedMeals.length})
                    </div>
                    <SecondaryActionButton
                      label="Regenerate"
                      icon={RefreshCcw}
                      onClick={handleRegenerate}
                    />
                  </div>

                  <div className="grid gap-3 xl:grid-cols-4">
                    {generatedMeals.map((meal) => (
                      <Card
                        key={`${meal.id}-${generationIndex}`}
                        className="overflow-hidden rounded-xl border-neutral-200 shadow-none"
                      >
                        <div className="relative aspect-[1.18] overflow-hidden border-b border-neutral-200">
                          <img
                            src={meal.image}
                            alt={meal.title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute left-3 bottom-3 rounded-md bg-black/60 px-2 py-1 text-[12px] font-medium text-white">
                            {meal.slot}
                          </div>
                        </div>
                        <CardContent className="space-y-3 p-3.5">
                          <div className="min-h-[56px] text-[15px] font-medium leading-6 text-neutral-950">
                            {meal.title}
                          </div>
                          <div className="text-[13px] text-neutral-500">
                            {meal.calories} kcal
                          </div>
                          <div className="h-px bg-neutral-200" />
                          <div className="grid grid-cols-3 gap-2 text-[12px] font-medium">
                            <div className="text-blue-500">{meal.carbs}g C</div>
                            <div className="text-violet-500">{meal.protein}g P</div>
                            <div className="text-cyan-500">{meal.fats}g F</div>
                          </div>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-[13px] text-neutral-500 hover:text-neutral-700"
                          >
                            {meal.ingredients} ingredients
                            <ChevronDown className="size-3.5" />
                          </button>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full rounded-sm border-neutral-200 text-neutral-700 shadow-none hover:bg-neutral-50"
                          >
                            <RefreshCcw className="size-4" />
                            Swap
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-neutral-200 px-5 py-4">
                <SecondaryActionButton
                  label="Back"
                  onClick={() => setGenerated(false)}
                />
                <PrimaryActionButton
                  label="Save Plan"
                  onClick={handleSavePlan}
                />
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

export function ClientNutritionPanel({
  phase,
  initialSubTab = "nutrition",
}: {
  phase?: string
  initialSubTab?: "nutrition" | "nutrition-logger"
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = React.useState<
    "nutrition" | "nutrition-logger"
  >(initialSubTab)
  const preset = React.useMemo(() => getNutritionPreset(phase), [phase])
  const iifymWeeks = React.useMemo(
    () => chunkNutritionWeeks(preset.iifymEntries),
    [preset.iifymEntries]
  )
  const [iifymWeekIndex, setIifymWeekIndex] = React.useState(
    Math.max(0, iifymWeeks.length - 1)
  )
  const [visibleIifymSeries, setVisibleIifymSeries] = React.useState<
    Record<(typeof iifymSeries)[number]["key"], boolean>
  >({
    calories: true,
    protein: true,
    carbs: true,
    fats: true,
    fiber: true,
  })

  React.useEffect(() => {
    setIifymWeekIndex(Math.max(0, iifymWeeks.length - 1))
  }, [iifymWeeks.length])

  React.useEffect(() => {
    setActiveTab(initialSubTab)
  }, [initialSubTab])

  const visibleIifymWeek = iifymWeeks[iifymWeekIndex] ?? []
  const iifymWeekLabel = React.useMemo(
    () => formatNutritionWeekRange(visibleIifymWeek),
    [visibleIifymWeek]
  )
  const loggedDaysCount = React.useMemo(
    () => visibleIifymWeek.filter((entry) => entry.loggedMeals > 0).length,
    [visibleIifymWeek]
  )
  const weeklyCompliance = Math.round(
    (loggedDaysCount / Math.max(1, visibleIifymWeek.length)) * 100
  )
  const iifymChartData = React.useMemo(
    () =>
      visibleIifymWeek.map((entry) => ({
        day: `${entry.dayNumber} ${new Date(`${entry.date}T00:00:00`).toLocaleString("en-US", { month: "short" })}`,
        dayLabel: nutritionMonthDayFormatter.format(
          new Date(`${entry.date}T00:00:00`)
        ),
        calories: entry.calories,
        protein: entry.protein,
        carbs: entry.carbs,
        fats: entry.fats,
        fiber: entry.fiber,
        rawCalories: entry.calories,
        rawProtein: entry.protein,
        rawCarbs: entry.carbs,
        rawFats: entry.fats,
        rawFiber: entry.fiber,
      })),
    [visibleIifymWeek]
  )
  const macroBreakdownRows = React.useMemo(
    () => [
      { label: "Calories", unit: "kcal", values: visibleIifymWeek.map((entry) => entry.calories) },
      { label: "Protein", unit: "g", values: visibleIifymWeek.map((entry) => entry.protein) },
      { label: "Carbs", unit: "g", values: visibleIifymWeek.map((entry) => entry.carbs) },
      { label: "Fat", unit: "g", values: visibleIifymWeek.map((entry) => entry.fats) },
      { label: "Fiber", unit: "g", values: visibleIifymWeek.map((entry) => entry.fiber) },
      { label: "Sugar", unit: "g", values: visibleIifymWeek.map((entry) => entry.sugar) },
      { label: "Sodium", unit: "mg", values: visibleIifymWeek.map((entry) => entry.sodium) },
      { label: "Potassium", unit: "mg", values: visibleIifymWeek.map((entry) => entry.potassium) },
      {
        label: "Saturated Fat",
        unit: "g",
        values: visibleIifymWeek.map((entry) => entry.saturatedFat),
      },
      {
        label: "Polyunsaturated Fat",
        unit: "g",
        values: visibleIifymWeek.map((entry) => entry.polyunsaturatedFat),
      },
      {
        label: "Monounsaturated Fat",
        unit: "g",
        values: visibleIifymWeek.map((entry) => entry.monounsaturatedFat),
      },
    ].map((row) => {
      const total = row.values.reduce((sum, value) => sum + value, 0)

      return {
        label: row.label,
        unit: row.unit,
        avg: total / Math.max(1, row.values.length),
        total,
      }
    }),
    [visibleIifymWeek]
  )

  return (
    <>
      {activeTab === "nutrition" ? (
        <div className="bg-neutral-50 px-4 py-4">
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <div className="grid grid-cols-[minmax(0,1fr)_150px_120px_40px] items-center gap-4 border-b border-neutral-200 bg-muted px-4 py-3 lg:grid-cols-[minmax(0,1fr)_180px_140px_44px] lg:px-5">
              <div className="text-sm font-medium text-foreground">Plan</div>
              <div className="text-sm font-medium text-foreground">Type</div>
              <div className="text-center text-sm font-medium text-foreground">
                Calories
              </div>
              <div />
            </div>

            <div className="divide-y divide-neutral-200">
              {preset.mealPlans.map((plan) => (
                <div
                  key={plan.id}
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    router.push(
                      `${pathname}?nutritionTab=nutrition&mealPlanId=${plan.id}`
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      router.push(
                        `${pathname}?nutritionTab=nutrition&mealPlanId=${plan.id}`
                      )
                    }
                  }}
                  className="grid cursor-pointer grid-cols-[minmax(0,1fr)_150px_120px_40px] items-center gap-4 bg-white px-4 py-4 transition-colors hover:bg-neutral-50/60 lg:grid-cols-[minmax(0,1fr)_180px_140px_44px] lg:px-5"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="text-[15px] font-medium text-neutral-950">
                      {plan.title}
                    </div>
                    <div className="text-[13px] leading-5 text-neutral-500">
                      {plan.subtitle}
                    </div>
                  </div>

                  <div>
                    <Badge
                      variant="outline"
                      className="rounded-md border-neutral-200 bg-white px-2.5 py-1 text-[12px] font-normal text-neutral-700"
                    >
                      <UtensilsCrossed className="mr-1 size-3.5 text-neutral-500" />
                      {plan.type}
                    </Badge>
                  </div>

                  <div className="flex justify-center">
                    <NutritionCaloriesDonut plan={plan} />
                  </div>

                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={(event) => event.stopPropagation()}
                          className="size-6 cursor-pointer rounded-md border-neutral-200/45 bg-transparent text-muted-foreground shadow-none transition-colors hover:border-neutral-200/70 hover:bg-neutral-50/70 hover:text-foreground data-[state=open]:border-neutral-200/70 data-[state=open]:bg-neutral-50/80"
                        >
                          <MoreVertical className="size-3" />
                          <span className="sr-only">Open meal plan menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        onClick={(event) => event.stopPropagation()}
                        className="w-44 rounded-lg border-neutral-200/60 bg-white/95 p-1.5 shadow-lg shadow-black/5 backdrop-blur-sm"
                      >
                        <DropdownMenuItem
                          onSelect={() =>
                            router.push(
                              `${pathname}?nutritionTab=nutrition&mealPlanId=${plan.id}`
                            )
                          }
                          className="cursor-pointer rounded-md px-3 py-2 text-[13px] focus:bg-neutral-50"
                        >
                          Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-[13px] focus:bg-neutral-50">
                          Edit plan
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-[13px] focus:bg-neutral-50">
                          Duplicate plan
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-[13px] text-rose-600 focus:bg-rose-50 focus:text-rose-600">
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {activeTab === "nutrition-logger" ? (
        <div className="space-y-4 bg-neutral-50 px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-sm border border-neutral-200 bg-white px-3 py-2 text-[15px] font-medium text-neutral-900">
              Macros Target
              <Info className="size-4 text-neutral-400" />
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() =>
                  setIifymWeekIndex((current) => Math.max(0, current - 1))
                }
                disabled={iifymWeekIndex === 0}
                className="rounded-sm border-neutral-200 text-neutral-700 shadow-none hover:bg-neutral-50 disabled:opacity-45"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <div className="inline-flex min-w-[178px] items-center justify-between gap-3 rounded-sm border border-neutral-200 bg-white px-3 py-2 text-[14px] font-medium text-neutral-900">
                <span>{iifymWeekLabel}</span>
                <CalendarDays className="size-4 text-neutral-400" />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() =>
                  setIifymWeekIndex((current) =>
                    Math.min(iifymWeeks.length - 1, current + 1)
                  )
                }
                disabled={iifymWeekIndex >= iifymWeeks.length - 1}
                className="rounded-sm border-neutral-200 text-neutral-700 shadow-none hover:bg-neutral-50 disabled:opacity-45"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.45fr)_minmax(330px,0.55fr)]">
            <Card className="rounded-xl border-neutral-200 shadow-none">
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  {iifymSeries.map((series) => (
                    <button
                      key={series.key}
                      type="button"
                      onClick={() =>
                        setVisibleIifymSeries((current) => ({
                          ...current,
                          [series.key]: !current[series.key],
                        }))
                      }
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] transition-colors",
                        visibleIifymSeries[series.key]
                          ? "border-neutral-200 bg-white text-neutral-700"
                          : "border-neutral-200 bg-neutral-100 text-neutral-400"
                      )}
                    >
                      <span
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: series.color }}
                      />
                      {series.label}
                    </button>
                  ))}
                </div>

                <ChartContainer config={iifymChartConfig} className="h-[360px] w-full">
                  <AreaChart
                    accessibilityLayer
                    data={iifymChartData}
                    margin={{ left: 10, right: 16, top: 10, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} stroke="#e5e7eb" />
                    <YAxis
                      yAxisId="calories"
                      hide
                      domain={[
                        0,
                        (dataMax: number) => Math.max(2400, Math.ceil(dataMax * 1.12)),
                      ]}
                    />
                    <YAxis
                      yAxisId="macros"
                      orientation="right"
                      hide
                      domain={[
                        0,
                        (dataMax: number) => Math.max(320, Math.ceil(dataMax * 1.18)),
                      ]}
                    />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                    />
                    <ChartTooltip cursor={false} content={<NutritionIifymTooltip />} />
                    <defs>
                      <linearGradient id="fillCalories" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={iifymChartConfig.calories.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={iifymChartConfig.calories.color} stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="fillProtein" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={iifymChartConfig.protein.color} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={iifymChartConfig.protein.color} stopOpacity={0.04} />
                      </linearGradient>
                      <linearGradient id="fillCarbs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={iifymChartConfig.carbs.color} stopOpacity={0.24} />
                        <stop offset="95%" stopColor={iifymChartConfig.carbs.color} stopOpacity={0.04} />
                      </linearGradient>
                      <linearGradient id="fillFats" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={iifymChartConfig.fats.color} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={iifymChartConfig.fats.color} stopOpacity={0.04} />
                      </linearGradient>
                      <linearGradient id="fillFiber" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={iifymChartConfig.fiber.color} stopOpacity={0.18} />
                        <stop offset="95%" stopColor={iifymChartConfig.fiber.color} stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    {visibleIifymSeries.calories ? (
                      <Area
                        yAxisId="calories"
                        dataKey="calories"
                        type="natural"
                        stroke={iifymChartConfig.calories.color}
                        fill="url(#fillCalories)"
                        fillOpacity={1}
                        strokeWidth={2.5}
                      />
                    ) : null}
                    {visibleIifymSeries.protein ? (
                      <Area
                        yAxisId="macros"
                        dataKey="protein"
                        type="natural"
                        stroke={iifymChartConfig.protein.color}
                        fill="url(#fillProtein)"
                        fillOpacity={1}
                        strokeWidth={2}
                      />
                    ) : null}
                    {visibleIifymSeries.carbs ? (
                      <Area
                        yAxisId="macros"
                        dataKey="carbs"
                        type="natural"
                        stroke={iifymChartConfig.carbs.color}
                        fill="url(#fillCarbs)"
                        fillOpacity={1}
                        strokeWidth={2}
                      />
                    ) : null}
                    {visibleIifymSeries.fats ? (
                      <Area
                        yAxisId="macros"
                        dataKey="fats"
                        type="natural"
                        stroke={iifymChartConfig.fats.color}
                        fill="url(#fillFats)"
                        fillOpacity={1}
                        strokeWidth={2}
                      />
                    ) : null}
                    {visibleIifymSeries.fiber ? (
                      <Area
                        yAxisId="macros"
                        dataKey="fiber"
                        type="natural"
                        stroke={iifymChartConfig.fiber.color}
                        fill="url(#fillFiber)"
                        fillOpacity={1}
                        strokeWidth={1.75}
                      />
                    ) : null}
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Card className="rounded-xl border-neutral-200 shadow-none">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-[16px] font-semibold text-neutral-950">
                      Logged Meals
                    </CardTitle>
                    <div className="text-[14px] font-medium text-brand-600">
                      {loggedDaysCount}/{visibleIifymWeek.length}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-7 gap-2">
                    {visibleIifymWeek.map((entry) => (
                      <div
                        key={entry.id}
                        className="space-y-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-3 text-center"
                      >
                        <div className="text-[12px] font-medium text-neutral-500">
                          {entry.dayShort}
                        </div>
                        <div
                          className={cn(
                            "text-[18px] font-semibold",
                            entry.loggedMeals > 0
                              ? "text-neutral-950"
                              : "text-neutral-300"
                          )}
                        >
                          {entry.dayNumber}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {entry.loggedMeals}/{4}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-neutral-200 pt-4">
                    <div className="inline-flex items-center gap-1.5 text-[14px] text-neutral-700">
                      Weekly Compliance
                      <Info className="size-3.5 text-neutral-400" />
                    </div>
                    <div className="flex items-center gap-2 text-[14px] font-medium">
                      <span className="text-neutral-500">
                        {loggedDaysCount}/{visibleIifymWeek.length}
                      </span>
                      <span
                        className={cn(
                          weeklyCompliance >= 85
                            ? "text-emerald-600"
                            : "text-rose-500"
                        )}
                      >
                        {weeklyCompliance}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl border-neutral-200 shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-[16px] font-semibold text-neutral-950">
                    Macros Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Table>
                    <TableHeader className="bg-transparent">
                      <TableRow className="border-neutral-200 hover:bg-transparent">
                        <TableHead className="px-0 text-[13px] font-medium text-neutral-500">
                          Macro
                        </TableHead>
                        <TableHead className="text-right text-[13px] font-medium text-neutral-500">
                          Avg
                        </TableHead>
                        <TableHead className="pr-0 text-right text-[13px] font-medium text-neutral-500">
                          Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {macroBreakdownRows.map((row) => (
                        <TableRow
                          key={row.label}
                          className="border-neutral-200 hover:bg-transparent"
                        >
                          <TableCell className="px-0 py-2 text-[14px] text-neutral-800">
                            {row.label}
                          </TableCell>
                          <TableCell className="py-2 text-right text-[14px] text-neutral-500">
                            {formatMacroCellValue(row.avg, row.unit)}
                          </TableCell>
                          <TableCell className="pr-0 py-2 text-right text-[14px] text-neutral-800">
                            {formatMacroCellValue(row.total, row.unit)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
