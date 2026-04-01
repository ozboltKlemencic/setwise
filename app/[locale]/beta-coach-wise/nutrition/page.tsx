"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Pencil, Search, Trash2 } from "lucide-react"
import {
  IconApple,
  IconBottle,
  IconChefHat,
  IconClipboardList,
  IconPlus,
} from "@tabler/icons-react"

import clientData from "@/app/[locale]/beta-coach-wise/data.json"
import {
  CreateFoodDialog,
  type CreateFoodDialogValue,
} from "@/components/coachWise/clients/nutrition/create-food-dialog"
import { CoachWiseConfirmationDialog } from "@/components/coachWise/confirmation-dialog"
import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { SecondaryActionButton } from "@/components/coachWise/secondary-action-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  NutritionCaloriesDonut,
  NutritionPlansTable,
  buildNutritionPlanSegments,
  type NutritionPlansTableSegment,
} from "@/components/coachWise/tables/nutrition-plans-table"
import {
  getNutritionCreateMacroPlanHref,
  getNutritionCreateMealPlanHref,
  getNutritionPlanDetailHref,
  getNutritionPlanEditorHref,
} from "@/lib/handlers/nutrition.handlers"
import {
  NUTRITION_LIBRARY_UPDATED_EVENT,
  readStoredNutritionCustomFoods,
  readStoredNutritionMealTemplates,
  removeStoredNutritionCustomFood,
  removeStoredNutritionMealTemplate,
  upsertStoredNutritionCustomFood,
  upsertStoredNutritionMealTemplate,
  type StoredNutritionCustomFood,
  type StoredNutritionMealTemplate,
} from "@/lib/handlers/nutrition-library-storage"
import {
  NUTRITION_MEAL_PLANS_UPDATED_EVENT,
  GLOBAL_NUTRITION_MEAL_PLANS_STORAGE_SCOPE,
  readStoredNutritionMealPlanEntries,
  removeStoredNutritionMealPlan,
  resolveNutritionMealPlanStorageScopeFromPath,
  upsertStoredNutritionMealPlan,
  type StoredNutritionMealPlanEntry,
  type StoredNutritionMealPlan,
} from "@/lib/handlers/nutrition-plan-storage"
import {
  deriveNutritionFoodCategory,
  formatNutritionFoodUnitShortLabel,
  type NutritionLibraryFood,
} from "@/lib/nutrition/nutrition-library-catalog"
import { cn } from "@/lib/utils"

type MealPlanTab = "plans" | "meals" | "food"

type MealPlanRow = {
  id: string
  title: string
  subtitle: string
  type: string
  calories: number
  protein: number
  carbs: number
  fats: number
  clients: number[]
  segments?: NutritionPlansTableSegment[]
  storageScopeId?: string
}

type MealRow = {
  id: string
  name: string
  subtitle: string
  calories: number
  protein: number
  carbs: number
  fats: number
  foods: string[]
}

type FoodRow = {
  id: number
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  category: string
  unit: NutritionLibraryFood["unit"]
}

type MealDialogValues = {
  name: string
  subtitle: string
}

type FoodDialogValues = {
  name: string
  category: string
}

const mealPlanTabs: Array<{
  value: MealPlanTab
  label: string
  icon: React.ComponentType<{ className?: string }>
}> = [
    { value: "plans", label: "Plans", icon: IconClipboardList },
    { value: "meals", label: "Meals", icon: IconChefHat },
    { value: "food", label: "Food", icon: IconApple },
  ]

const initialMealPlanRows: MealPlanRow[] = [
  {
    id: "lean-gain",
    title: "Lean Gain Plan",
    subtitle: "Structured meal plan focused on a steady calorie surplus.",
    type: "Meal Plan",
    calories: 2100,
    protein: 190,
    carbs: 230,
    fats: 55,
    clients: [1],
  },
  {
    id: "recomp",
    title: "Recomp Plan",
    subtitle: "Macro targets set to support body recomposition.",
    type: "Macros Plan",
    calories: 2000,
    protein: 170,
    carbs: 165,
    fats: 73,
    clients: [2, 3, 4, 5],
  },
  {
    id: "cut-phase",
    title: "Cut Phase Spring",
    subtitle: "Slightly lower calories with tighter food structure.",
    type: "Meal Plan",
    calories: 1640,
    protein: 155,
    carbs: 110,
    fats: 48,
    clients: [6, 7],
  },
  {
    id: "maintenance",
    title: "Maintenance Template",
    subtitle: "Balanced macro targets for stable energy and recovery.",
    type: "Macros Plan",
    calories: 2000,
    protein: 165,
    carbs: 205,
    fats: 62,
    clients: [1, 4, 8, 9, 10],
  },
]

const initialMealRows: MealRow[] = [
  {
    id: "oats-breakfast",
    name: "Protein Oats Breakfast",
    subtitle: "Balanced breakfast bowl for steady energy and an easy protein start.",
    calories: 520,
    protein: 42,
    carbs: 55,
    fats: 12,
    foods: ["Oats 80g", "Whey isolate 30g", "Banana 1pc", "Almond butter 15g"],
  },
  {
    id: "chicken-bowl",
    name: "Chicken Rice Bowl",
    subtitle: "Simple high-carb lunch built around lean protein and fast recovery.",
    calories: 690,
    protein: 48,
    carbs: 79,
    fats: 18,
    foods: ["Chicken breast 180g", "White rice 250g", "Olive oil 10g", "Cucumber 100g"],
  },
  {
    id: "salmon-dinner",
    name: "Salmon & Potatoes",
    subtitle: "Higher-fat evening meal with omega-3 rich fish and slow carbs.",
    calories: 740,
    protein: 45,
    carbs: 58,
    fats: 31,
    foods: ["Salmon 180g", "Potatoes 300g", "Green beans 120g"],
  },
  {
    id: "smoothie",
    name: "Blueberry Recovery Smoothie",
    subtitle: "Quick snack option with fruit carbs and an easy protein top-up.",
    calories: 330,
    protein: 27,
    carbs: 36,
    fats: 8,
    foods: ["Blueberries 100g", "Greek yogurt 200g", "Whey isolate 20g", "Honey 10g"],
  },
]

const initialFoodRows: FoodRow[] = [
  { id: "chicken-breast", name: "Chicken breast", calories: 165, protein: 31, carbs: 0, fats: 3.6, category: "Protein", custom: false },
  { id: "white-rice", name: "White rice", calories: 130, protein: 2.7, carbs: 28, fats: 0.3, category: "Carbs", custom: false },
  { id: "olive-oil", name: "Olive oil", calories: 884, protein: 0, carbs: 0, fats: 100, category: "Fats", custom: false },
  { id: "banana", name: "Banana", calories: 89, protein: 1.1, carbs: 23, fats: 0.3, category: "Fruit", custom: false },
  { id: "whey-isolate", name: "Whey isolate", calories: 120, protein: 24, carbs: 3, fats: 1.5, category: "Supplements", custom: true },
  { id: "rice-cream", name: "Cream of rice", calories: 366, protein: 6, carbs: 81, fats: 1.2, category: "Carbs", custom: true },
]

const profileTabTriggerClassName =
  "h-full flex-none gap-1.5 rounded-none border-0 border-b-2 border-transparent bg-transparent px-3.5 py-2 text-[13.5px] font-normal text-neutral-500 after:hidden hover:text-neutral-700 data-[state=active]:border-(--brand-500) data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none [&_svg]:size-3.5 [&_svg]:text-neutral-400 data-[state=active]:[&_svg]:text-(--brand-600)"

const nutritionPageTableWrapperClassName =
  "overflow-hidden rounded-sm border border-neutral-200 bg-neutral-50"

const nutritionPageRowActionButtonClassName =
  "size-6 cursor-pointer rounded-md border-neutral-200/60 bg-neutral-100/85 text-muted-foreground shadow-none transition-colors hover:border-neutral-300/80 hover:bg-neutral-200/60 hover:text-foreground"

const nutritionPageRowDeleteActionButtonClassName =
  "border-rose-200/70 bg-rose-50/70 text-rose-500 hover:border-rose-300/80 hover:bg-rose-100/70 hover:text-rose-600"

function normalizeDuplicatedPlanTitleBase(title: string) {
  return title.replace(/\s*-\s*copy\s+\d+$/i, "").trim()
}

function buildNextDuplicatedPlanTitle(sourceTitle: string, existingTitles: string[]) {
  const baseTitle = normalizeDuplicatedPlanTitleBase(sourceTitle)
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

function cloneStoredNutritionMealPlanForDuplicate(
  sourcePlan: StoredNutritionMealPlan,
  nextTitle: string
): StoredNutritionMealPlan {
  return {
    ...sourcePlan,
    id:
      globalThis.crypto?.randomUUID?.() ??
      `custom-nutrition-plan-${Date.now()}-${Math.round(Math.random() * 10000)}`,
    title: nextTitle,
    assignedClientIds: sourcePlan.assignedClientIds
      ? [...sourcePlan.assignedClientIds]
      : undefined,
    segments: sourcePlan.segments.map((segment) => ({ ...segment })),
    sections: sourcePlan.sections.map((section) => ({
      ...section,
      options: section.options.map((option) => ({ ...option })),
    })),
    createdAt: new Date().toISOString(),
    builderSnapshot: sourcePlan.builderSnapshot
      ? {
          planName: nextTitle,
          foods: sourcePlan.builderSnapshot.foods.map((food) => ({ ...food })),
          meals: sourcePlan.builderSnapshot.meals.map((meal) => ({
            ...meal,
            items: meal.items.map((item) => ({ ...item })),
          })),
          mealPlanGoals: {
            presetId: sourcePlan.builderSnapshot.mealPlanGoals.presetId,
            calories: { ...sourcePlan.builderSnapshot.mealPlanGoals.calories },
            protein: { ...sourcePlan.builderSnapshot.mealPlanGoals.protein },
            carbs: { ...sourcePlan.builderSnapshot.mealPlanGoals.carbs },
            fat: { ...sourcePlan.builderSnapshot.mealPlanGoals.fat },
          },
        }
      : undefined,
    macroBuilderSnapshot: sourcePlan.macroBuilderSnapshot
      ? {
          planName: nextTitle,
          calories: sourcePlan.macroBuilderSnapshot.calories,
          macros: { ...sourcePlan.macroBuilderSnapshot.macros },
          presets: sourcePlan.macroBuilderSnapshot.presets.map((preset) => ({
            ...preset,
          })),
          selectedPresetId: sourcePlan.macroBuilderSnapshot.selectedPresetId,
          lockedMacroKey: sourcePlan.macroBuilderSnapshot.lockedMacroKey,
        }
      : undefined,
  }
}

function mapStoredNutritionMealPlanToRow(
  plan: StoredNutritionMealPlan,
  storageScopeId: string
): MealPlanRow {
  return {
    id: plan.id,
    title: plan.title,
    subtitle: plan.subtitle,
    type: plan.type,
    calories: plan.calories,
    protein: 0,
    carbs: 0,
    fats: 0,
    clients:
      plan.assignedClientIds?.length
        ? plan.assignedClientIds
            .map((clientId) => Number.parseInt(clientId, 10))
            .filter((clientId) => Number.isFinite(clientId))
        : (() => {
            const numericScopeId = Number.parseInt(storageScopeId, 10)
            return Number.isFinite(numericScopeId) ? [numericScopeId] : []
          })(),
    segments: plan.segments.map((segment) => ({ ...segment })),
    storageScopeId,
  }
}

function buildBackToHrefWithStorageScope(
  backToHref: string,
  storageScopeId?: string
) {
  if (!storageScopeId || storageScopeId === GLOBAL_NUTRITION_MEAL_PLANS_STORAGE_SCOPE) {
    return backToHref
  }

  const [pathname, queryString = ""] = backToHref.split("?")
  const searchParams = new URLSearchParams(queryString)
  searchParams.set("storageScope", storageScopeId)
  const nextQuery = searchParams.toString()

  return nextQuery ? `${pathname}?${nextQuery}` : pathname
}

function mapMealTemplateToMealRow(
  template: StoredNutritionMealTemplate,
  foods: NutritionLibraryFood[]
): MealRow {
  const totals = template.items.reduce(
    (accumulator, item) => {
      const food = foods.find((entry) => entry.id === item.foodId)
      if (!food) {
        return accumulator
      }

      const multiplier =
        food.unit === "piece" || food.unit === "slice" ? item.qty : item.qty / 100

      return {
        calories: accumulator.calories + Math.round(food.cal * multiplier),
        protein: accumulator.protein + food.p * multiplier,
        carbs: accumulator.carbs + food.c * multiplier,
        fats: accumulator.fats + food.f * multiplier,
      }
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  )

  return {
    id: template.id,
    name: template.name,
    subtitle: template.subtitle,
    calories: totals.calories,
    protein: totals.protein,
    carbs: totals.carbs,
    fats: totals.fats,
    foods: template.items
      .map((item) => {
        const food = foods.find((entry) => entry.id === item.foodId)
        if (!food) {
          return null
        }

        return `${food.name} ${item.qty}${formatNutritionFoodUnitShortLabel(food.unit)}`
      })
      .filter(Boolean) as string[],
  }
}

function mapCustomFoodToRow(food: StoredNutritionCustomFood): FoodRow {
  return {
    id: food.id,
    name: food.name,
    calories: food.cal,
    protein: food.p,
    carbs: food.c,
    fats: food.f,
    category: deriveNutritionFoodCategory(food),
    unit: food.unit,
  }
}

function useStoredNutritionMealPlanEntries(pathHint?: string) {
  const storageScopeId = React.useMemo(
    () => resolveNutritionMealPlanStorageScopeFromPath(pathHint),
    [pathHint]
  )
  const [storedMealPlanEntries, setStoredMealPlanEntries] = React.useState<
    StoredNutritionMealPlanEntry[]
  >([])

  React.useEffect(() => {
    if (!storageScopeId) {
      setStoredMealPlanEntries([])
      return
    }

    const syncStoredMealPlans = () => {
      setStoredMealPlanEntries(readStoredNutritionMealPlanEntries(storageScopeId))
    }

    const handleStoredMealPlansUpdated = (event: Event) => {
      const updatedStorageScopeId = (
        event as CustomEvent<{ clientId?: string }>
      ).detail?.clientId

      if (updatedStorageScopeId && updatedStorageScopeId !== storageScopeId) {
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
  }, [storageScopeId])

  return {
    storageScopeId,
    storedMealPlanEntries,
  }
}

function useStoredNutritionMealTemplates() {
  const [templates, setTemplates] = React.useState<StoredNutritionMealTemplate[]>([])

  React.useEffect(() => {
    const syncTemplates = () => {
      setTemplates(readStoredNutritionMealTemplates())
    }

    const handleLibraryUpdated = (event: Event) => {
      const updatedKind = (event as CustomEvent<{ kind?: string }>).detail?.kind

      if (updatedKind && updatedKind !== "meal-templates") {
        return
      }

      syncTemplates()
    }

    syncTemplates()
    window.addEventListener("storage", syncTemplates)
    window.addEventListener(
      NUTRITION_LIBRARY_UPDATED_EVENT,
      handleLibraryUpdated as EventListener
    )

    return () => {
      window.removeEventListener("storage", syncTemplates)
      window.removeEventListener(
        NUTRITION_LIBRARY_UPDATED_EVENT,
        handleLibraryUpdated as EventListener
      )
    }
  }, [])

  return templates
}

function useStoredNutritionCustomFoods() {
  const [foods, setFoods] = React.useState<StoredNutritionCustomFood[]>([])

  React.useEffect(() => {
    const syncFoods = () => {
      setFoods(readStoredNutritionCustomFoods())
    }

    const handleLibraryUpdated = (event: Event) => {
      const updatedKind = (event as CustomEvent<{ kind?: string }>).detail?.kind

      if (updatedKind && updatedKind !== "custom-foods") {
        return
      }

      syncFoods()
    }

    syncFoods()
    window.addEventListener("storage", syncFoods)
    window.addEventListener(
      NUTRITION_LIBRARY_UPDATED_EVENT,
      handleLibraryUpdated as EventListener
    )

    return () => {
      window.removeEventListener("storage", syncFoods)
      window.removeEventListener(
        NUTRITION_LIBRARY_UPDATED_EVENT,
        handleLibraryUpdated as EventListener
      )
    }
  }, [])

  return foods
}

function NutritionPageTableActionButtons({
  itemLabel,
  onEdit,
  onDelete,
}: {
  itemLabel: string
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex w-[9rem] justify-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={onEdit}
        className={nutritionPageRowActionButtonClassName}
      >
        <Pencil className="size-3.5" />
        <span className="sr-only">Edit {itemLabel}</span>
      </Button>
      <CoachWiseConfirmationDialog
        title={`Are you sure you want to delete this ${itemLabel}?`}
        description={`This ${itemLabel} will be removed from the current list. This action can't be undone.`}
        confirmLabel={`Delete ${itemLabel}`}
        variant="destructive"
        onConfirm={onDelete}
        trigger={
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className={cn(
              nutritionPageRowActionButtonClassName,
              nutritionPageRowDeleteActionButtonClassName
            )}
          >
            <Trash2 className="size-3.5" />
            <span className="sr-only">Delete {itemLabel}</span>
          </Button>
        }
      />
    </div>
  )
}

function MealPlannerSearchBar({
  placeholder,
  action,
  inputWrapperClassName,
}: {
  placeholder: string
  action?: React.ReactNode
  inputWrapperClassName?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("relative w-full max-w-sm", inputWrapperClassName)}>
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

function MealTableFoodsCell({ foods }: { foods: string[] }) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = React.useState(false)

  React.useEffect(() => {
    const element = contentRef.current
    if (!element) return

    const updateOverflow = () => {
      setIsOverflowing(element.scrollHeight > element.clientHeight + 1)
    }

    updateOverflow()

    const resizeObserver = new ResizeObserver(updateOverflow)
    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [foods])

  return (
    <div className="relative max-w-[20rem]">
      <div
        ref={contentRef}
        className="flex max-h-[3.5rem] flex-wrap gap-2 overflow-hidden pr-10"
      >
        {foods.map((food) => (
          <Badge
            key={food}
            variant="outline"
            className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11.5px] font-normal text-neutral-700"
          >
            {food}
          </Badge>
        ))}
      </div>

      {isOverflowing ? (
        <div className="pointer-events-none absolute right-0 bottom-0 flex items-end bg-gradient-to-l from-white via-white to-transparent pl-6">
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 px-1.5 text-[12px] leading-none text-neutral-500">
            ...
          </span>
        </div>
      ) : null}
    </div>
  )
}

function PlannerTextarea({
  placeholder,
  className,
}: {
  placeholder: string
  className?: string
}) {
  return (
    <textarea
      placeholder={placeholder}
      className={cn(
        "w-full rounded-sm border border-neutral-200 px-3 py-3 text-[14px] text-neutral-900 shadow-none outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-300",
        className,
      )}
    />
  )
}

function AddPlanDialog({ backToHref }: { backToHref: string }) {
  return (
    <div className="flex items-center gap-2">
      <SecondaryActionButton
        label="Macro Plan (IIFYM)"
        icon={IconPlus}
        href={getNutritionCreateMacroPlanHref(backToHref)}
      />
      <PrimaryActionButton
        label="Meal Plan"
        icon={IconPlus}
        href={getNutritionCreateMealPlanHref(backToHref)}
      />
    </div>
  )
}

function AddMealDialog({
  trigger,
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  title = "Add Meal",
  submitLabel = "Add Meal",
}: {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialValues?: MealDialogValues
  onSubmit?: (values: MealDialogValues) => void
  title?: string
  submitLabel?: string
}) {
  const [activeTab, setActiveTab] = React.useState<"new" | "ai">("new")
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const [name, setName] = React.useState(initialValues?.name ?? "")
  const [subtitle, setSubtitle] = React.useState(initialValues?.subtitle ?? "")
  const isControlled = typeof open === "boolean"
  const resolvedOpen = isControlled ? open : uncontrolledOpen
  const handleOpenChange = onOpenChange ?? setUncontrolledOpen

  React.useEffect(() => {
    if (!resolvedOpen) {
      return
    }

    setActiveTab("new")
    setName(initialValues?.name ?? "")
    setSubtitle(initialValues?.subtitle ?? "")
  }, [initialValues, resolvedOpen])

  return (
    <Dialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-w-[840px] rounded-sm border border-neutral-200 bg-white p-0 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold text-neutral-950">
            <IconChefHat className="size-4.5 text-neutral-700" />
            {title}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="size-8 rounded-sm p-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
            >
              <span className="text-lg leading-none">×</span>
            </Button>
          </DialogClose>
        </div>
        <div className="px-6 pt-4">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "new" | "ai")}
            className="gap-0"
          >
            <TabsList variant="line" className="w-max gap-0 rounded-none bg-transparent p-0">
              <TabsTrigger value="new" className={profileTabTriggerClassName}>
                New Meal
              </TabsTrigger>
              <TabsTrigger value="ai" className={profileTabTriggerClassName}>
                Meal AI
              </TabsTrigger>
            </TabsList>
            <TabsContent value="new" className="mt-0 space-y-5 pb-5">
              <div className="grid gap-5 pt-5 md:grid-cols-[1fr_88px]">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[14px] font-medium text-neutral-800">
                      Meal Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Name of the meal e.g. Chicken Bowl"
                      className="h-11 rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-medium text-neutral-800">
                      Meal Description
                    </label>
                    <textarea
                      value={subtitle}
                      onChange={(event) => setSubtitle(event.target.value)}
                      placeholder="Enter any additional info"
                      className="min-h-[120px] w-full rounded-sm border border-neutral-200 px-3 py-3 text-[14px] text-neutral-900 shadow-none outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-300"
                    />
                  </div>
                </div>
                <div className="rounded-sm border border-neutral-200 bg-gradient-to-br from-sky-200 via-cyan-100 to-white" />
              </div>
            </TabsContent>
            <TabsContent value="ai" className="mt-0 pb-5">
              <div className="space-y-5 pt-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[14px] text-neutral-700">
                    Create a new meal or paste an existing one to format.
                  </p>
                  <Button
                    variant="outline"
                    className="h-8 rounded-sm border-neutral-200 px-3 text-[13px] font-medium text-neutral-700 shadow-none hover:bg-neutral-100"
                  >
                    Try Sample
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-medium text-neutral-800">Meal Name</label>
                  <Input
                    placeholder="e.g., High Protein Lunch Bowl"
                    className="h-11 rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-medium text-neutral-800">
                    Meal Description
                  </label>
                  <PlannerTextarea
                    placeholder="Tell me what you want to do with your meal..."
                    className="min-h-[150px] rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                </div>
                <div className="flex justify-center">
                  <Button
                    className="h-11 rounded-sm bg-neutral-100 px-5 text-[14px] font-medium text-neutral-400 shadow-none"
                    disabled
                  >
                    Create Meal
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="h-9 rounded-sm px-3 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Close
            </Button>
          </DialogClose>
          {activeTab === "new" ? (
            <Button
              className="h-9 rounded-sm bg-brand-500 px-4 text-[14px] font-medium text-white shadow-none hover:bg-brand-600"
              onClick={() => {
                onSubmit?.({
                  name: name.trim(),
                  subtitle: subtitle.trim(),
                })
                handleOpenChange(false)
              }}
              disabled={!name.trim()}
            >
              {submitLabel}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AddFoodDialog({
  trigger,
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  title = "Add Food",
  submitLabel = "Add Food",
}: {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialValues?: FoodDialogValues
  onSubmit?: (values: FoodDialogValues) => void
  title?: string
  submitLabel?: string
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const [name, setName] = React.useState(initialValues?.name ?? "")
  const [category, setCategory] = React.useState(initialValues?.category ?? "protein")
  const isControlled = typeof open === "boolean"
  const resolvedOpen = isControlled ? open : uncontrolledOpen
  const handleOpenChange = onOpenChange ?? setUncontrolledOpen

  React.useEffect(() => {
    if (!resolvedOpen) {
      return
    }

    setName(initialValues?.name ?? "")
    setCategory(initialValues?.category?.toLowerCase() ?? "protein")
  }, [initialValues, resolvedOpen])

  return (
    <Dialog open={resolvedOpen} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-w-[860px] rounded-sm border border-neutral-200 bg-white p-0 shadow-xl">
        <div className="grid md:grid-cols-[1.5fr_1fr]">
          <div className="border-r border-neutral-200 px-6 py-5">
            <div className="mb-5 flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold text-neutral-950">
                <IconApple className="size-4.5 text-neutral-700" />
                {title}
              </DialogTitle>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[14px] font-medium text-neutral-800">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Name of the food e.g. Greek Yogurt"
                  className="h-11 rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-medium text-neutral-800">
                  Instructions
                </label>
                <PlannerTextarea
                  placeholder="Enter any additional info"
                  className="min-h-[110px] rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[14px] font-medium text-neutral-800">Filters</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-10 rounded-sm border-neutral-200 shadow-none focus:ring-0">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="protein">Protein</SelectItem>
                      <SelectItem value="carbs">Carbs</SelectItem>
                      <SelectItem value="fats">Fats</SelectItem>
                      <SelectItem value="fruit">Fruit</SelectItem>
                      <SelectItem value="supplements">Supplements</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="h-10 rounded-sm border-neutral-200 shadow-none focus:ring-0">
                      <SelectValue placeholder="Select Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="generic">Generic</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="h-10 rounded-sm border-neutral-200 shadow-none focus:ring-0">
                      <SelectValue placeholder="Select Main Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="h-10 rounded-sm border-neutral-200 shadow-none focus:ring-0">
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grams">Grams</SelectItem>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-neutral-950">
                <IconBottle className="size-4.5 text-neutral-700" />
                Media
              </div>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="size-8 rounded-sm p-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                >
                  <span className="text-lg leading-none">×</span>
                </Button>
              </DialogClose>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[14px] font-medium text-neutral-800">
                  YouTube Link
                </label>
                <Input
                  placeholder="Enter YouTube link"
                  className="h-11 rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                />
              </div>
              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-neutral-200" />
                <span className="text-[13px] font-medium text-neutral-500">OR</span>
                <div className="h-px flex-1 bg-neutral-200" />
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-medium text-neutral-800">
                  Custom Video
                </label>
                <div className="flex min-h-[160px] flex-col items-center justify-center rounded-sm border border-dashed border-neutral-200 bg-neutral-50 px-6 py-8 text-center">
                  <IconBottle className="mb-3 size-7 text-neutral-400" />
                  <p className="text-[14px] text-neutral-600">
                    Click or drag file to this area to upload
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="h-9 rounded-sm px-3 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Close
            </Button>
          </DialogClose>
          <Button
            className="h-9 rounded-sm bg-brand-500 px-4 text-[14px] font-medium text-white shadow-none hover:bg-brand-600"
            onClick={() => {
              onSubmit?.({
                name: name.trim(),
                category: category.trim(),
              })
              handleOpenChange(false)
            }}
            disabled={!name.trim()}
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PlansTable({
  rows: sourceRows,
  onOpenRow,
  onEditRow,
  onDuplicateRow,
  onDeleteRow,
}: {
  rows: MealPlanRow[]
  onOpenRow: (row: MealPlanRow) => void
  onEditRow: (row: MealPlanRow) => void
  onDuplicateRow: (row: MealPlanRow) => void
  onDeleteRow: (row: MealPlanRow) => void
}) {
  const planClientsById = React.useMemo(
    () =>
      new Map(
        clientData.map((client) => [
          client.id,
          {
            id: String(client.id),
            name: client.header,
            avatar: client.avatar,
          },
        ])
      ),
    []
  )

  const tableRows = React.useMemo(
    () =>
      sourceRows.map((row) => ({
        id: row.id,
        title: row.title,
        subtitle: row.subtitle,
        type: row.type,
        calories: row.calories,
        segments:
          row.segments ??
          buildNutritionPlanSegments({
            protein: row.protein,
            carbs: row.carbs,
            fats: row.fats,
          }),
        clients: row.clients
          .map((clientId) => planClientsById.get(clientId))
          .filter((client): client is NonNullable<typeof client> => Boolean(client)),
      })),
    [planClientsById, sourceRows]
  )

  return (
    <div className="space-y-4">
      <MealPlannerSearchBar placeholder="Search plans" inputWrapperClassName="max-w-[17rem]" />
      <NutritionPlansTable
        rows={tableRows}
        onOpenRow={(row) => {
          const sourceRow = sourceRows.find((entry) => entry.id === row.id)
          if (!sourceRow) {
            return
          }

          onOpenRow(sourceRow)
        }}
        onEditRow={(row) => {
          const sourceRow = sourceRows.find((entry) => entry.id === row.id)
          if (!sourceRow) {
            return
          }

          onEditRow(sourceRow)
        }}
        onDuplicateRow={(row) => {
          const sourceRow = sourceRows.find((entry) => entry.id === row.id)
          if (sourceRow) {
            onDuplicateRow(sourceRow)
          }
        }}
        onDeleteRow={(row) => {
          const sourceRow = sourceRows.find((entry) => entry.id === row.id)
          if (sourceRow) {
            onDeleteRow(sourceRow)
          }
        }}
      />
    </div>
  )
}

function MealsTable({
  rows,
  onEditRow,
  onDeleteRow,
}: {
  rows: MealRow[]
  onEditRow: (row: MealRow) => void
  onDeleteRow: (row: MealRow) => void
}) {
  return (
    <div className="space-y-4">
      <MealPlannerSearchBar placeholder="Search meals" inputWrapperClassName="max-w-[17rem]" />
      <div className={nutritionPageTableWrapperClassName}>
        <Table>
          <TableHeader className="bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4 text-[13px] font-medium lg:pl-5">
                Meal
              </TableHead>
              <TableHead className="w-[380px] px-3.5 text-[13px] font-medium">
                Food
              </TableHead>
              <TableHead className="w-[152px] px-3.5 text-center text-[13px] font-medium">
                Calories
              </TableHead>
              <TableHead className="w-[9rem] px-3 pr-5 text-center text-[13px] font-medium">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer bg-white hover:bg-neutral-50/60"
              >
                <TableCell className="py-3 pl-4 lg:pl-5">
                  <div className="space-y-0.5">
                    <div className="text-[14px] font-medium text-neutral-950">
                      {row.name}
                    </div>
                    <div className="text-[12px] text-neutral-500">
                      {row.subtitle}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-3.5 py-3">
                  <MealTableFoodsCell foods={row.foods} />
                </TableCell>
                <TableCell className="px-3.5 py-3">
                  <div className="flex justify-center">
                    <NutritionCaloriesDonut
                      row={{
                        id: row.id,
                        title: row.name,
                        subtitle: "",
                        type: "Meal",
                        calories: row.calories,
                        segments: buildNutritionPlanSegments({
                          protein: row.protein,
                          carbs: row.carbs,
                          fats: row.fats,
                        }),
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="px-3 py-3 pr-5">
                  <NutritionPageTableActionButtons
                    itemLabel="meal"
                    onEdit={() => onEditRow(row)}
                    onDelete={() => onDeleteRow(row)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function FoodTable({
  rows,
  onEditRow,
  onDeleteRow,
}: {
  rows: FoodRow[]
  onEditRow: (row: FoodRow) => void
  onDeleteRow: (row: FoodRow) => void
}) {
  return (
    <div className="space-y-4">
      <MealPlannerSearchBar placeholder="Search food" inputWrapperClassName="max-w-[17rem]" />
      <div className={nutritionPageTableWrapperClassName}>
        <Table>
          <TableHeader className="bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4 text-[13px] font-medium lg:pl-5">
                Food
              </TableHead>
              <TableHead className="w-[220px] px-3.5 text-[13px] font-medium">
                Category
              </TableHead>
              <TableHead className="w-[9rem] px-3 pr-5 text-center text-[13px] font-medium">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer bg-white hover:bg-neutral-50/60"
              >
                <TableCell className="py-3 pl-4 lg:pl-5">
                  <div className="space-y-0.5">
                    <div className="text-[14px] font-medium text-neutral-950">
                      {row.name}
                    </div>
                    <div className="text-[12px] text-neutral-500">
                      <span>{row.calories} kcal</span>
                      <span className="px-1.5 text-neutral-300">-</span>
                      <span className="text-emerald-400">P{row.protein}g</span>
                      <span className="px-1.5 text-neutral-300">-</span>
                      <span className="text-sky-400">C{row.carbs}g</span>
                      <span className="px-1.5 text-neutral-300">-</span>
                      <span className="text-amber-400">F{row.fats}g</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-3.5 py-3 text-[14px] text-neutral-700">
                  {row.category}
                </TableCell>
                <TableCell className="px-3 py-3 pr-5">
                  <NutritionPageTableActionButtons
                    itemLabel="food"
                    onEdit={() => onEditRow(row)}
                    onDelete={() => onDeleteRow(row)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function MealPlaniPageContent() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = (searchParams.get("tab") as MealPlanTab) || "plans"
  const [planRows, setPlanRows] = React.useState(initialMealPlanRows)
  const [editingMeal, setEditingMeal] = React.useState<MealRow | null>(null)
  const [editingFood, setEditingFood] = React.useState<FoodRow | null>(null)
  const [isCreateFoodDialogOpen, setIsCreateFoodDialogOpen] = React.useState(false)
  const mealTemplates = useStoredNutritionMealTemplates()
  const customFoods = useStoredNutritionCustomFoods()
  const allLibraryFoods = React.useMemo(
    () => [
      ...DEFAULT_NUTRITION_LIBRARY_FOODS,
      ...customFoods.filter(
        (food) =>
          !DEFAULT_NUTRITION_LIBRARY_FOODS.some(
            (defaultFood) => defaultFood.id === food.id
          )
      ),
    ],
    [customFoods]
  )
  const mealRows = React.useMemo(
    () => mealTemplates.map((template) => mapMealTemplateToMealRow(template, allLibraryFoods)),
    [allLibraryFoods, mealTemplates]
  )
  const foodRows = React.useMemo(
    () => customFoods.map((food) => mapCustomFoodToRow(food)),
    [customFoods]
  )
  const plansBackToHref = React.useMemo(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", "plans")
    const query = params.toString()

    return query ? `${pathname}?${query}` : pathname
  }, [pathname, searchParams])
  const { storedMealPlanEntries } =
    useStoredNutritionMealPlanEntries(plansBackToHref)
  const storedPlanRows = React.useMemo(
    () =>
      storedMealPlanEntries.map(({ plan, storageScopeId }) =>
        mapStoredNutritionMealPlanToRow(plan, storageScopeId)
      ),
    [storedMealPlanEntries]
  )
  const allPlanRows = React.useMemo(() => {
    const storedPlanIds = new Set(storedPlanRows.map((row) => row.id))

    return [
      ...storedPlanRows,
      ...planRows.filter((row) => !storedPlanIds.has(row.id)),
    ]
  }, [planRows, storedPlanRows])
  const allPlanTitles = React.useMemo(
    () => allPlanRows.map((row) => row.title),
    [allPlanRows]
  )

  const setTab = React.useCallback(
    (value: MealPlanTab) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("tab", value)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  const handleOpenPlan = React.useCallback(
    (row: MealPlanRow) => {
      if (row.storageScopeId) {
        router.push(
          getNutritionPlanDetailHref(
            row.id,
            buildBackToHrefWithStorageScope(plansBackToHref, row.storageScopeId)
          )
        )
        return
      }

      router.push(
        row.type.toLowerCase().includes("macro")
          ? getNutritionCreateMacroPlanHref(plansBackToHref)
          : getNutritionCreateMealPlanHref(plansBackToHref)
      )
    },
    [plansBackToHref, router]
  )

  const handleEditPlan = React.useCallback(
    (row: MealPlanRow) => {
      if (row.storageScopeId) {
        router.push(
          getNutritionPlanEditorHref(
            row.id,
            buildBackToHrefWithStorageScope(plansBackToHref, row.storageScopeId)
          )
        )
        return
      }

      router.push(
        row.type.toLowerCase().includes("macro")
          ? getNutritionCreateMacroPlanHref(plansBackToHref)
          : getNutritionCreateMealPlanHref(plansBackToHref)
      )
    },
    [plansBackToHref, router]
  )

  const handleDuplicatePlan = React.useCallback(
    (row: MealPlanRow) => {
      if (row.storageScopeId) {
        const sourceEntry = storedMealPlanEntries.find(
          (entry) =>
            entry.plan.id === row.id && entry.storageScopeId === row.storageScopeId
        )
        const sourcePlan = sourceEntry?.plan

        if (!sourcePlan) {
          return
        }

        const nextTitle = buildNextDuplicatedPlanTitle(
          sourcePlan.title,
          allPlanTitles
        )

        upsertStoredNutritionMealPlan(
          row.storageScopeId,
          cloneStoredNutritionMealPlanForDuplicate(sourcePlan, nextTitle)
        )
        return
      }

      setPlanRows((currentRows) => {
        const nextTitle = buildNextDuplicatedPlanTitle(
          row.title,
          currentRows.map((entry) => entry.title)
        )

        return [
          {
            ...row,
            id: `${row.id}-copy-${Date.now()}`,
            title: nextTitle,
          },
          ...currentRows,
        ]
      })
    },
    [allPlanTitles, storedMealPlanEntries]
  )

  const handleDeletePlan = React.useCallback((row: MealPlanRow) => {
    if (row.storageScopeId) {
      removeStoredNutritionMealPlan(row.storageScopeId, row.id)
      return
    }

    setPlanRows((currentRows) => currentRows.filter((entry) => entry.id !== row.id))
  }, [])

  const handleCreateMeal = React.useCallback((values: MealDialogValues) => {
    upsertStoredNutritionMealTemplate({
      id: `template-${Date.now()}`,
      name: values.name,
      subtitle: values.subtitle || "Custom meal template created from the nutrition tab.",
      items: [],
      isCustom: true,
      createdAt: new Date().toISOString(),
    })
  }, [])

  const handleUpdateMeal = React.useCallback((values: MealDialogValues) => {
    if (!editingMeal) {
      return
    }

    const sourceTemplate = mealTemplates.find((template) => template.id === editingMeal.id)
    if (!sourceTemplate) {
      setEditingMeal(null)
      return
    }

    upsertStoredNutritionMealTemplate({
      ...sourceTemplate,
      name: values.name,
      subtitle: values.subtitle || sourceTemplate.subtitle,
    })
    setEditingMeal(null)
  }, [editingMeal, mealTemplates])

  const handleDeleteMeal = React.useCallback((row: MealRow) => {
    removeStoredNutritionMealTemplate(row.id)
  }, [])

  const handleCreateFood = React.useCallback((values: CreateFoodDialogValue) => {
    const nextFoodId =
      Math.max(
        0,
        ...DEFAULT_NUTRITION_LIBRARY_FOODS.map((food) => food.id),
        ...customFoods.map((food) => food.id)
      ) + 1

    upsertStoredNutritionCustomFood({
      id: nextFoodId,
      name: values.name,
      cal: values.cal,
      p: values.p,
      c: values.c,
      f: values.f,
      unit: values.unit,
      step: values.unit === "piece" || values.unit === "slice" ? 1 : 10,
      defaultQty: values.unit === "piece" || values.unit === "slice" ? 1 : 100,
      createdAt: new Date().toISOString(),
    })
    setIsCreateFoodDialogOpen(false)
  }, [customFoods])

  const handleUpdateFood = React.useCallback((values: CreateFoodDialogValue) => {
    if (!editingFood) {
      return
    }

    const sourceFood = customFoods.find((food) => food.id === editingFood.id)
    if (!sourceFood) {
      setEditingFood(null)
      return
    }

    upsertStoredNutritionCustomFood({
      ...sourceFood,
      name: values.name,
      cal: values.cal,
      p: values.p,
      c: values.c,
      f: values.f,
      unit: values.unit,
      step: values.unit === "piece" || values.unit === "slice" ? 1 : 10,
      defaultQty: values.unit === "piece" || values.unit === "slice" ? 1 : 100,
    })
    setEditingFood(null)
  }, [customFoods, editingFood])

  const handleDeleteFood = React.useCallback((row: FoodRow) => {
    removeStoredNutritionCustomFood(row.id)
  }, [])

  const tabsAction = (() => {
    if (activeTab === "plans") return <AddPlanDialog backToHref={plansBackToHref} />
    if (activeTab === "meals") {
      return (
        <AddMealDialog
          trigger={<PrimaryActionButton label="Meal" icon={IconPlus} />}
          onSubmit={handleCreateMeal}
        />
      )
    }
    return (
      <PrimaryActionButton
        label="Food"
        icon={IconPlus}
        onClick={() => setIsCreateFoodDialogOpen(true)}
      />
    )
  })()

  return (
    <section className="min-w-0 bg-neutral-50">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setTab(value as MealPlanTab)}
        className="min-w-0 w-full gap-0"
      >
        <div className="border-b border-neutral-200 bg-neutral-50">
          <div className="flex min-w-0 items-center justify-between gap-4 pl-0 pr-4">
            <div className="min-w-0 flex-1 overflow-x-auto">
              <TabsList
                variant="line"
                className="w-max min-w-full justify-start gap-0 rounded-none bg-transparent p-0"
              >
                {mealPlanTabs.map(({ value, label, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className={profileTabTriggerClassName}
                  >
                    <Icon className="size-4" />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {tabsAction}
          </div>
        </div>

        <TabsContent value="plans" className="mt-0 p-4">
          <PlansTable
            rows={allPlanRows}
            onOpenRow={handleOpenPlan}
            onEditRow={handleEditPlan}
            onDuplicateRow={handleDuplicatePlan}
            onDeleteRow={handleDeletePlan}
          />
        </TabsContent>
        <TabsContent value="meals" className="mt-0 p-4">
          <MealsTable
            rows={mealRows}
            onEditRow={setEditingMeal}
            onDeleteRow={handleDeleteMeal}
          />
        </TabsContent>
        <TabsContent value="food" className="mt-0 p-4">
          <FoodTable
            rows={foodRows}
            onEditRow={setEditingFood}
            onDeleteRow={handleDeleteFood}
          />
        </TabsContent>
      </Tabs>

      <AddMealDialog
        open={Boolean(editingMeal)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingMeal(null)
          }
        }}
        initialValues={
          editingMeal
            ? {
                name: editingMeal.name,
                subtitle: editingMeal.subtitle,
              }
            : undefined
        }
        onSubmit={handleUpdateMeal}
        title="Edit Meal"
        submitLabel="Update Meal"
      />

      <CreateFoodDialog
        open={isCreateFoodDialogOpen || Boolean(editingFood)}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateFoodDialogOpen(false)
            setEditingFood(null)
          }
        }}
        initialName={editingFood?.name ?? ""}
        initialValue={
          editingFood
            ? {
                name: editingFood.name,
                cal: editingFood.calories,
                p: editingFood.protein,
                c: editingFood.carbs,
                f: editingFood.fats,
                unit: editingFood.unit,
              }
            : undefined
        }
        title={editingFood ? "Edit food" : "Create food"}
        submitLabel={editingFood ? "Update food" : "Create food"}
        onCreate={editingFood ? handleUpdateFood : handleCreateFood}
      />
    </section>
  )
}

export default function MealPlaniPage() {
  return (
    <React.Suspense fallback={<section className="min-w-0 bg-neutral-50" />}>
      <MealPlaniPageContent />
    </React.Suspense>
  )
}
