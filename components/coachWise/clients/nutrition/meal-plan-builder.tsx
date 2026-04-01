"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Apple,
  ChefHat,
  GripVertical,
  Minus,
  Pencil,
  Plus,
  Search,
  Target,
  Trash2,
  UtensilsCrossed,
} from "lucide-react"

import { CoachWiseConfirmationDialog } from "@/components/coachWise/confirmation-dialog"
import {
  buildStoredNutritionMealPlanFromBuilderState,
  calcBuilderNutrition,
  createDefaultMealPlanBuilderSnapshot,
  formatFoodUnitLabel,
  getBuilderMealTotals,
  getBuilderPlanTotals,
  getBuilderTemplateTotals,
  RECENT_BUILDER_FOOD_IDS,
  type BuilderFood,
  type BuilderMeal,
  type BuilderMealItem,
  type BuilderMealTemplate,
} from "@/components/coachWise/clients/nutrition/meal-plan-builder-data"
import {
  type NutritionBuilderClientOption,
} from "@/components/coachWise/clients/nutrition/nutrition-builder-client-options"
import {
  NutritionBuilderClientPicker,
} from "@/components/coachWise/clients/nutrition/nutrition-builder-client-picker"
import {
  CreateFoodDialog,
  type CreateFoodDialogValue,
} from "@/components/coachWise/clients/nutrition/create-food-dialog"
import {
  MealPlanGoalsDialog,
  type MealPlanGoalSettings,
} from "@/components/coachWise/clients/nutrition/meal-plan-goals-dialog"
import { NutritionBuilderNav } from "@/components/coachWise/clients/nutrition/nutrition-builder-nav"
import { OverflowActionsMenu } from "@/components/coachWise/overflow-actions-menu"
import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { SecondaryActionButton } from "@/components/coachWise/secondary-action-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  readStoredNutritionCustomFoods,
  readStoredNutritionMealTemplates,
  removeStoredNutritionMealTemplate,
  upsertStoredNutritionCustomFood,
  upsertStoredNutritionMealTemplate,
} from "@/lib/handlers/nutrition-library-storage"
import {
  GLOBAL_NUTRITION_MEAL_PLANS_STORAGE_SCOPE,
  resolveNutritionMealPlanStorageScopeFromPath,
  upsertStoredNutritionMealPlan,
  type StoredNutritionMealPlanBuilderSnapshot,
  type StoredNutritionMealPlan,
} from "@/lib/handlers/nutrition-plan-storage"
import { isGlobalNutritionBuilderBackHref } from "@/lib/handlers/nutrition.handlers"
import { DEFAULT_NUTRITION_LIBRARY_FOODS } from "@/lib/nutrition/nutrition-library-catalog"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type FoodCardTone = "protein" | "carbs" | "fat"

const foodGripToneClasses: Record<FoodCardTone, string> = {
  protein:
    "border-emerald-100/80 bg-emerald-50/40 text-emerald-600",
  carbs:
    "border-sky-100/80 bg-sky-50/40 text-sky-600",
  fat:
    "border-yellow-100/90 bg-yellow-50/45 text-yellow-700",
}

function getFoodCardTone(food: BuilderFood): FoodCardTone {
  const macroRanking = [
    { key: "protein" as const, value: food.p },
    { key: "carbs" as const, value: food.c },
    { key: "fat" as const, value: food.f },
  ].sort((left, right) => right.value - left.value)

  return macroRanking[0].key
}

function createBuilderFoodIndex(foods: BuilderFood[]) {
  return new Map(foods.map((food) => [food.id, { ...food }]))
}

function mergeBuilderFoods(
  ...foodCollections: Array<BuilderFood[] | undefined>
) {
  const mergedFoods = createBuilderFoodIndex(
    DEFAULT_NUTRITION_LIBRARY_FOODS as BuilderFood[]
  )

  foodCollections.forEach((foods) => {
    foods?.forEach((food) => {
      mergedFoods.set(food.id, { ...food })
    })
  })

  return Array.from(mergedFoods.values()).sort((left, right) => left.id - right.id)
}

function BuilderSectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-2 text-[12px] font-medium uppercase tracking-[0.12em] text-neutral-400">
      {title}
    </div>
  )
}

export function MealPlanBuilderPageView({
  backHref,
  initialSnapshot,
  clientOptions,
  initialAssignedClientIds,
}: {
  backHref: string
  initialSnapshot?: StoredNutritionMealPlanBuilderSnapshot
  clientOptions?: NutritionBuilderClientOption[]
  initialAssignedClientIds?: string[]
}) {
  const resolvedInitialSnapshot = React.useMemo(
    () => initialSnapshot ?? createDefaultMealPlanBuilderSnapshot(),
    [initialSnapshot]
  )

  return (
    <MealPlanBuilderScreen
      backHref={backHref}
      initialSnapshot={resolvedInitialSnapshot}
      clientOptions={clientOptions}
      initialAssignedClientIds={initialAssignedClientIds}
      mode="create"
    />
  )
}

export function MealPlanBuilderEditPageView({
  backHref,
  mealPlanId,
  initialSnapshot,
  createdAt,
  clientOptions,
  initialAssignedClientIds,
}: {
  backHref: string
  mealPlanId: string
  initialSnapshot: StoredNutritionMealPlanBuilderSnapshot
  createdAt?: string
  clientOptions?: NutritionBuilderClientOption[]
  initialAssignedClientIds?: string[]
}) {
  return (
    <MealPlanBuilderScreen
      backHref={backHref}
      initialSnapshot={initialSnapshot}
      mode="edit"
      mealPlanId={mealPlanId}
      createdAt={createdAt}
      clientOptions={clientOptions}
      initialAssignedClientIds={initialAssignedClientIds}
    />
  )
}

function BuilderInsertPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none flex h-8 items-center justify-center rounded-lg border border-dashed border-brand-300 bg-brand-50/35 text-brand-500",
        className
      )}
    >
      <Plus className="size-3" />
    </div>
  )
}

function BuilderGoalSummaryMetric({
  label,
  currentValue,
  goalValue,
  unit,
  progressClassName,
}: {
  label: string
  currentValue: number
  goalValue?: number
  unit: string
  progressClassName: string
}) {
  const roundedCurrentValue = Math.round(currentValue)
  const hasGoal = typeof goalValue === "number" && goalValue > 0
  const difference = hasGoal ? roundedCurrentValue - goalValue : null
  const isOverGoal = Boolean(hasGoal && difference !== null && difference > 0)
  const progressWidth = hasGoal
    ? Math.min((roundedCurrentValue / goalValue) * 100, 100)
    : 0

  return (
    <div
      className={cn(
        "relative min-h-[78px] border-b border-neutral-200 px-4 py-3 md:border-r md:border-b-0",
        isOverGoal ? "bg-rose-50/50" : "bg-white"
      )}
    >
      <div className="flex items-end gap-1.5">
        <div
          className={cn(
            "text-[17px] leading-none font-semibold",
            isOverGoal ? "text-rose-600" : "text-neutral-950"
          )}
        >
          {roundedCurrentValue}
        </div>
        <div className="text-[13px] leading-none font-medium text-neutral-300">
          {hasGoal ? `/ ${goalValue}${unit}` : unit}
        </div>
      </div>

      <div className="mt-2 text-[11px] uppercase tracking-[0.12em] text-neutral-400">
        {label}
      </div>

      {hasGoal && difference !== null ? (
        <div
          className={cn(
            "absolute right-4 bottom-3 text-[12px] font-medium",
            isOverGoal ? "text-rose-600" : "text-neutral-500"
          )}
        >
          {difference > 0 ? `+${difference}` : difference}
        </div>
      ) : null}

      {hasGoal ? (
        <div className="absolute right-0 bottom-0 left-0 h-[3px]">
          <div
            className={cn(
              "h-full",
              isOverGoal ? "bg-rose-500" : progressClassName
            )}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      ) : null}
    </div>
  )
}

function BuilderQuantityField({
  value,
  unit,
  widthClassName = "w-20",
  className,
  onChange,
}: {
  value: number
  unit: BuilderFood["unit"]
  widthClassName?: string
  className?: string
  onChange: (nextValue: number) => void
}) {
  return (
    <div
      className={cn(
        "flex h-7 items-center justify-center rounded-md border border-neutral-200 bg-white px-1.5 shadow-none",
        widthClassName,
        className
      )}
    >
      <Input
        value={value}
        onChange={(event) => {
          const nextValue = Number(event.target.value)
          if (!Number.isNaN(nextValue) && nextValue >= 0) {
            onChange(nextValue)
          }
        }}
        className="h-full w-9 border-0 bg-transparent p-0 text-center text-[12px] shadow-none focus-visible:ring-0"
      />
      <span className="ml-0.5 shrink-0 text-[11px] text-neutral-400">
        {formatFoodUnitLabel(unit)}
      </span>
    </div>
  )
}

function BuilderQuantityStepper({
  value,
  unit,
  widthClassName = "w-[4.75rem]",
  onChange,
  onDecrease,
  onIncrease,
}: {
  value: number
  unit: BuilderFood["unit"]
  widthClassName?: string
  onChange: (nextValue: number) => void
  onDecrease: () => void
  onIncrease: () => void
}) {
  return (
    <div className="flex shrink-0 items-center">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={onDecrease}
        className="size-7 rounded-r-none border-neutral-200 border-r-0 px-0 text-neutral-600 shadow-none hover:bg-neutral-50"
      >
        <Minus className="size-3" />
      </Button>
      <BuilderQuantityField
        value={value}
        unit={unit}
        widthClassName={widthClassName}
        className="rounded-none"
        onChange={onChange}
      />
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={onIncrease}
        className="size-7 rounded-l-none border-neutral-200 border-l-0 px-0 text-neutral-600 shadow-none hover:bg-neutral-50"
      >
        <Plus className="size-3" />
      </Button>
    </div>
  )
}

function FoodLibraryRow({
  food,
  onAdd,
  onDragStart,
  onDragEnd,
}: {
  food: BuilderFood
  onAdd: (qty: number) => void
  onDragStart: (event: React.DragEvent<HTMLDivElement>, qty: number) => void
  onDragEnd: () => void
}) {
  const gripToneClasses = foodGripToneClasses[getFoodCardTone(food)]

  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, food.defaultQty)}
      onDragEnd={onDragEnd}
      className="flex w-full items-center gap-2 rounded-md border border-neutral-200 bg-white py-3 pr-3 pl-2 transition-colors hover:border-brand-400 hover:bg-brand-50/35"
    >
      <div
        className={cn(
          "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border hover:cursor-grab active:cursor-grabbing",
          gripToneClasses
        )}
      >
        <GripVertical className="size-3.5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium text-neutral-950">
              {food.name}
            </div>
            <div className="mt-0.5 text-[11.5px] leading-5 text-neutral-500">
              {food.cal} kcal / 100
              {food.unit}
              {"  -  "}P{food.p} C{food.c} F{food.f}
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => onAdd(food.defaultQty)}
            className="size-7 shrink-0 cursor-pointer rounded-md border-neutral-200/70 bg-neutral-50 text-neutral-700 shadow-none hover:bg-neutral-100"
          >
            <Plus className="size-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function TemplateLibraryCard({
  foods,
  template,
  onApply,
  onCreateMeal,
  onDelete,
}: {
  foods: BuilderFood[]
  template: BuilderMealTemplate
  onApply: () => void
  onCreateMeal: () => void
  onDelete: () => void
}) {
  const totals = getBuilderTemplateTotals(foods, template)

  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-[13px] font-medium text-neutral-950">
            {template.name}
          </div>
          <div className="text-[11.5px] text-neutral-500">
            {totals.cal} kcal  -  P{totals.p.toFixed(0)}g  -  C{totals.c.toFixed(0)}g
            {"  -  "}F{totals.f.toFixed(0)}g
          </div>
        </div>
        {template.isCustom ? (
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={onDelete}
            className="size-7 rounded-md border-rose-200 bg-rose-50 text-rose-500 shadow-none hover:bg-rose-100"
          >
            <Trash2 className="size-3.5" />
          </Button>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {template.items.map((item) => {
          const food = foods.find((entry) => entry.id === item.foodId)
          if (!food) {
            return null
          }

          return (
            <Badge
              key={`${template.id}-${item.foodId}`}
              variant="outline"
              className="rounded-md border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-normal text-neutral-600"
            >
              {food.name} {item.qty}
              {food.unit}
            </Badge>
          )
        })}
      </div>

      <div className="mt-3 space-y-2">
        <SecondaryActionButton
          label="Add to current meal"
          onClick={onApply}
          className="w-full justify-center"
        />
        <Button
          type="button"
          variant="outline"
          onClick={onCreateMeal}
          className="h-9 w-full justify-center gap-1.5 rounded-md border-brand-200 bg-brand-50/60 text-[13px] font-medium text-brand-700 shadow-none hover:bg-brand-100/70 hover:text-brand-700"
        >
          <Plus className="size-4" />
          Add to new meal
        </Button>
      </div>
    </div>
  )
}

function MealItemRow({
  foods,
  item,
  isDragging = false,
  onChangeQty,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
  onRemove,
}: {
  foods: BuilderFood[]
  item: BuilderMealItem
  isDragging?: boolean
  onChangeQty: (nextQty: number) => void
  onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void
  onRemove: () => void
}) {
  const food = foods.find((entry) => entry.id === item.foodId)

  if (!food) {
    return null
  }

  const nutrition = calcBuilderNutrition(foods, item.foodId, item.qty)
  const tone = getFoodCardTone(food)
  const gripToneClasses = foodGripToneClasses[tone]

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-3 transition-opacity",
        isDragging && "opacity-45"
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div
        className={cn(
          "flex size-9 shrink-0 cursor-grab items-center justify-center rounded-xl border active:cursor-grabbing",
          gripToneClasses
        )}
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <GripVertical className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium text-neutral-600">
          {food.name}
        </div>
        <div className="text-[11.5px] text-neutral-500">
          <span>{nutrition.cal} kcal</span>
          <span className="text-neutral-300">  -  </span>
          <span className="text-emerald-600">P{nutrition.p}g</span>
          <span className="text-neutral-300">  -  </span>
          <span className="text-sky-600">C{nutrition.c}g</span>
          <span className="text-neutral-300">  -  </span>
          <span className="text-yellow-600">F{nutrition.f}g</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <BuilderQuantityStepper
          value={item.qty}
          unit={food.unit}
          widthClassName="w-[4.75rem]"
          onChange={onChangeQty}
          onDecrease={() => onChangeQty(Math.max(food.step, item.qty - food.step))}
          onIncrease={() => onChangeQty(item.qty + food.step)}
        />
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={onRemove}
          className="size-7 rounded-md border-rose-200 bg-rose-50 text-rose-500 shadow-none hover:bg-rose-100"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

type MealPlanBuilderScreenProps = {
  backHref: string
  initialSnapshot: StoredNutritionMealPlanBuilderSnapshot
  mode: "create" | "edit"
  mealPlanId?: string
  createdAt?: string
  clientOptions?: NutritionBuilderClientOption[]
  initialAssignedClientIds?: string[]
}

function MealPlanBuilderScreen({
  backHref,
  initialSnapshot,
  mode,
  mealPlanId,
  createdAt,
  clientOptions = [],
  initialAssignedClientIds = [],
}: MealPlanBuilderScreenProps) {
  const router = useRouter()
  const pathname = usePathname()
  const storageScopeId = React.useMemo(
    () =>
      resolveNutritionMealPlanStorageScopeFromPath(backHref) ??
      resolveNutritionMealPlanStorageScopeFromPath(pathname),
    [backHref, pathname]
  )
  const initialCustomFoods = React.useMemo(
    () => readStoredNutritionCustomFoods().map((food) => ({ ...food })),
    []
  )
  const initialTemplateLibrary = React.useMemo(
    () =>
      readStoredNutritionMealTemplates().map((template) => ({
        ...template,
        items: template.items.map((item) => ({ ...item })),
      })),
    []
  )
  const initialPlanName = initialSnapshot.planName
  const itemIdCounter = React.useRef(
    Math.max(
      0,
      ...initialSnapshot.meals.flatMap((meal) => meal.items.map((item) => item.id))
    ) + 1
  )
  const foodIdCounter = React.useRef(
    Math.max(
      0,
      ...mergeBuilderFoods(initialSnapshot.foods, initialCustomFoods).map(
        (food) => food.id
      )
    ) + 1
  )
  const templateIdCounter = React.useRef(
    initialTemplateLibrary.reduce((highestId, template) => {
      const match = template.id.match(/(\d+)$/)
      const nextId = match ? Number.parseInt(match[1] ?? "0", 10) : 0
      return Number.isFinite(nextId) ? Math.max(highestId, nextId) : highestId
    }, 100) + 1
  )
  const nameInputRef = React.useRef<HTMLInputElement>(null)
  const mealNameInputRef = React.useRef<HTMLInputElement>(null)
  const deleteMealTriggerRefs = React.useRef<Record<number, HTMLButtonElement | null>>({})
  const deleteTemplateTriggerRefs = React.useRef<Record<string, HTMLButtonElement | null>>({})
  const [foods, setFoods] = React.useState<BuilderFood[]>(() =>
    mergeBuilderFoods(initialSnapshot.foods, initialCustomFoods)
  )
  const [planName, setPlanName] = React.useState(initialPlanName)
  const [isEditingName, setIsEditingName] = React.useState(false)
  const [meals, setMeals] = React.useState<BuilderMeal[]>(() =>
    initialSnapshot.meals.map((meal) => ({
      ...meal,
      items: meal.items.map((item) => ({ ...item })),
    }))
  )
  const [activeMealId, setActiveMealId] = React.useState(
    initialSnapshot.meals[0]?.id ?? 1
  )
  const [editingMealId, setEditingMealId] = React.useState<number | null>(null)
  const [editingMealName, setEditingMealName] = React.useState("")
  const [draggedMealId, setDraggedMealId] = React.useState<number | null>(null)
  const [dragInsertIndex, setDragInsertIndex] = React.useState<number | null>(null)
  const [draggedMealItemId, setDraggedMealItemId] = React.useState<number | null>(null)
  const [dragMealItemInsertIndex, setDragMealItemInsertIndex] = React.useState<number | null>(null)
  const [dragFoodInsertIndex, setDragFoodInsertIndex] = React.useState<number | null>(null)
  const [leftTab, setLeftTab] = React.useState<"foods" | "templates">("foods")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [templateSearchQuery, setTemplateSearchQuery] = React.useState("")
  const [savedTemplates, setSavedTemplates] =
    React.useState<BuilderMealTemplate[]>(() => initialTemplateLibrary)
  const [templatedMealIds, setTemplatedMealIds] = React.useState<Set<number>>(
    () => new Set()
  )
  const [showSaveTemplateForm, setShowSaveTemplateForm] = React.useState(false)
  const [isCreateFoodDialogOpen, setIsCreateFoodDialogOpen] = React.useState(false)
  const [newTemplateName, setNewTemplateName] = React.useState("")
  const [isGoalsDialogOpen, setIsGoalsDialogOpen] = React.useState(false)
  const [mealPlanGoals, setMealPlanGoals] = React.useState<MealPlanGoalSettings>(
    () => ({
      presetId: initialSnapshot.mealPlanGoals.presetId,
      calories: { ...initialSnapshot.mealPlanGoals.calories },
      protein: { ...initialSnapshot.mealPlanGoals.protein },
      carbs: { ...initialSnapshot.mealPlanGoals.carbs },
      fat: { ...initialSnapshot.mealPlanGoals.fat },
    })
  )
  const [dragFoodPayload, setDragFoodPayload] = React.useState<{
    foodId: number
    qty: number
  } | null>(null)
  const [dragOverMealId, setDragOverMealId] = React.useState<number | null>(null)
  const resolvedAssignedClientIds = React.useMemo(() => {
    if (initialAssignedClientIds.length > 0) {
      return initialAssignedClientIds
    }

    if (
      storageScopeId &&
      storageScopeId !== GLOBAL_NUTRITION_MEAL_PLANS_STORAGE_SCOPE &&
      /^\d+$/.test(storageScopeId)
    ) {
      return [storageScopeId]
    }

    return []
  }, [initialAssignedClientIds, storageScopeId])
  const [assignedClientIds, setAssignedClientIds] = React.useState<string[]>(
    () => resolvedAssignedClientIds
  )

  React.useEffect(() => {
    if (isEditingName) {
      nameInputRef.current?.focus()
      nameInputRef.current?.select()
    }
  }, [isEditingName])

  React.useEffect(() => {
    if (editingMealId !== null) {
      mealNameInputRef.current?.focus()
      mealNameInputRef.current?.select()
    }
  }, [editingMealId])

  const activeMeal = meals.find((meal) => meal.id === activeMealId) ?? meals[0]
  const showClientPicker =
    isGlobalNutritionBuilderBackHref(backHref) && clientOptions.length > 0
  const filteredFoods = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return RECENT_BUILDER_FOOD_IDS.map((id) => foods.find((food) => food.id === id)).filter(
        Boolean
      ) as BuilderFood[]
    }

    return foods.filter((food) =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [foods, searchQuery])
  const filteredTemplates = React.useMemo(() => {
    if (!templateSearchQuery.trim()) {
      return savedTemplates
    }

    return savedTemplates.filter((template) => {
      const matchesName = template.name
        .toLowerCase()
        .includes(templateSearchQuery.toLowerCase())
      const matchesFood = template.items.some((item) => {
        const food = foods.find((entry) => entry.id === item.foodId)
        return food?.name.toLowerCase().includes(templateSearchQuery.toLowerCase())
      })

      return matchesName || matchesFood
    })
  }, [foods, savedTemplates, templateSearchQuery])
  const planTotals = React.useMemo(
    () => getBuilderPlanTotals(foods, meals),
    [foods, meals]
  )
  const activeMealTotals = React.useMemo(
    () => (activeMeal ? getBuilderMealTotals(foods, activeMeal) : null),
    [activeMeal, foods]
  )
  const goalSummaryMetrics = React.useMemo(
    () => [
      {
        key: "calories",
        label: "Calories",
        currentValue: planTotals.cal,
        goalValue: mealPlanGoals.calories.enabled
          ? mealPlanGoals.calories.value
          : undefined,
        unit: "kcal",
        progressClassName: "bg-orange-500",
      },
      {
        key: "protein",
        label: "Protein",
        currentValue: planTotals.p,
        goalValue: mealPlanGoals.protein.enabled
          ? mealPlanGoals.protein.value
          : undefined,
        unit: "g",
        progressClassName: "bg-emerald-500",
      },
      {
        key: "carbs",
        label: "Carbs",
        currentValue: planTotals.c,
        goalValue: mealPlanGoals.carbs.enabled ? mealPlanGoals.carbs.value : undefined,
        unit: "g",
        progressClassName: "bg-sky-500",
      },
      {
        key: "fat",
        label: "Fat",
        currentValue: planTotals.f,
        goalValue: mealPlanGoals.fat.enabled ? mealPlanGoals.fat.value : undefined,
        unit: "g",
        progressClassName: "bg-yellow-500",
      },
    ],
    [mealPlanGoals, planTotals]
  )

  const handleNavigateBack = React.useCallback(() => {
    router.push(backHref)
  }, [backHref, router])

  const handleSavePlan = React.useCallback(() => {
    const nextPlanName = planName.trim() || initialPlanName
    const nextStoredMealPlan: StoredNutritionMealPlan =
      buildStoredNutritionMealPlanFromBuilderState({
        planId: mode === "edit" ? mealPlanId : undefined,
        planName: nextPlanName,
        meals,
        foods,
        mealPlanGoals,
        assignedClientIds,
        createdAt,
      })

    if (storageScopeId) {
      upsertStoredNutritionMealPlan(storageScopeId, nextStoredMealPlan)
    }

    toast.success(mode === "edit" ? "Meal plan updated" : "Meal plan created", {
      description: `For ${nextPlanName}.`,
    })

    handleNavigateBack()
  }, [
    handleNavigateBack,
    createdAt,
    foods,
    initialPlanName,
    mealPlanGoals,
    mealPlanId,
    meals,
    mode,
    planName,
    assignedClientIds,
    storageScopeId,
  ])
  const handleCreateFood = React.useCallback(() => {
    setIsCreateFoodDialogOpen(true)
  }, [])
  const handleCreateFoodSubmit = React.useCallback(
    (value: CreateFoodDialogValue) => {
      const nextFoodId = foodIdCounter.current++
      const nextDefaultQty =
        value.unit === "piece" || value.unit === "slice"
          ? 1
          : 100
      const nextStep =
        value.unit === "piece" || value.unit === "slice"
          ? 1
          : value.unit === "ml"
            ? 10
            : 10

      const nextFood: BuilderFood = {
        id: nextFoodId,
        name: value.name,
        cal: value.cal,
        p: value.p,
        c: value.c,
        f: value.f,
        unit: value.unit,
        step: nextStep,
        defaultQty: nextDefaultQty,
      }

      setFoods((currentFoods) => [...currentFoods, nextFood])
      upsertStoredNutritionCustomFood({
        ...nextFood,
        createdAt: new Date().toISOString(),
      })
      setSearchQuery(value.name)
      setIsCreateFoodDialogOpen(false)

      toast.success(`Created "${value.name}"`, {
        description:
          value.unit === "piece" || value.unit === "slice"
            ? `Saved with values per ${formatFoodUnitLabel(value.unit)}.`
            : `Saved with values per 100 ${value.unit}.`,
      })
    },
    []
  )

  const addFoodToMeal = React.useCallback(
    (
      foodId: number,
      mealId = activeMealId,
      qty?: number,
      insertIndex?: number
    ) => {
      const food = foods.find((entry) => entry.id === foodId)

      if (!food) {
        return
      }

      const nextItem: BuilderMealItem = {
        id: itemIdCounter.current++,
        foodId,
        qty: qty ?? food.defaultQty,
      }

      setMeals((currentMeals) =>
        currentMeals.map((meal) =>
          meal.id === mealId
            ? {
              ...meal,
              items: (() => {
                const nextItems = [...meal.items]
                const normalizedInsertIndex =
                  typeof insertIndex === "number"
                    ? Math.max(0, Math.min(insertIndex, nextItems.length))
                    : nextItems.length

                nextItems.splice(normalizedInsertIndex, 0, nextItem)

                return nextItems
              })(),
            }
            : meal
        )
      )
    },
    [activeMealId, foods]
  )

  const addTemplateToMeal = React.useCallback(
    (template: BuilderMealTemplate) => {
      const nextItems = template.items.map((item) => ({
        id: itemIdCounter.current++,
        foodId: item.foodId,
        qty: item.qty,
      }))

      setMeals((currentMeals) =>
        currentMeals.map((meal) =>
          meal.id === activeMealId
            ? { ...meal, items: [...meal.items, ...nextItems] }
            : meal
        )
      )

      toast.success("Template added", {
        description: `To ${activeMeal?.name ?? "current meal"}.`,
      })
    },
    [activeMeal?.name, activeMealId]
  )
  const createMealFromTemplate = React.useCallback(
    (template: BuilderMealTemplate) => {
      const nextMealId =
        meals.length > 0 ? Math.max(...meals.map((meal) => meal.id)) + 1 : 1
      const nextItems = template.items.map((item) => ({
        id: itemIdCounter.current++,
        foodId: item.foodId,
        qty: item.qty,
      }))

      setMeals((currentMeals) => [
        ...currentMeals,
        {
          id: nextMealId,
          name: template.name,
          items: nextItems,
        },
      ])
      setActiveMealId(nextMealId)

      toast.success("New meal created", {
        description: `From ${template.name}.`,
      })
    },
    [meals]
  )

  const saveCurrentMealAsTemplate = React.useCallback(() => {
    if (!activeMeal || !activeMeal.items.length) {
      return
    }

    const nextTemplate: BuilderMealTemplate = {
      id: `custom-template-${templateIdCounter.current++}`,
      name: newTemplateName.trim() || `${activeMeal.name} template`,
      subtitle: `Saved from ${activeMeal.name}.`,
      isCustom: true,
      items: activeMeal.items.map((item) => ({
        foodId: item.foodId,
        qty: item.qty,
      })),
    }

    setSavedTemplates((currentTemplates) => [nextTemplate, ...currentTemplates])
    upsertStoredNutritionMealTemplate({
      ...nextTemplate,
      createdAt: new Date().toISOString(),
    })
    setTemplatedMealIds((currentIds) => new Set(currentIds).add(activeMeal.id))
    setShowSaveTemplateForm(false)
    setNewTemplateName("")
    toast.success("Meal template saved", {
      description: `From ${activeMeal.name}.`,
    })
  }, [activeMeal, newTemplateName])

  const addMeal = React.useCallback(() => {
    const nextMealId =
      meals.length > 0 ? Math.max(...meals.map((meal) => meal.id)) + 1 : 1

    setMeals((currentMeals) => [
      ...currentMeals,
      { id: nextMealId, name: `Meal ${nextMealId}`, items: [] },
    ])
    setActiveMealId(nextMealId)
  }, [meals])

  const removeMeal = React.useCallback(
    (mealId: number) => {
      if (meals.length <= 1) {
        return
      }

      const nextMeals = meals.filter((meal) => meal.id !== mealId)
      setMeals(nextMeals)

      if (activeMealId === mealId) {
        setActiveMealId(nextMeals[0]?.id ?? 1)
      }
    },
    [activeMealId, meals]
  )
  const startEditingMealName = React.useCallback((meal: BuilderMeal) => {
    setActiveMealId(meal.id)
    setEditingMealId(meal.id)
    setEditingMealName(meal.name)
  }, [])
  const commitMealName = React.useCallback(() => {
    if (editingMealId === null) {
      return
    }

    const nextMealName = editingMealName.trim()

    if (nextMealName) {
      setMeals((currentMeals) =>
        currentMeals.map((meal) =>
          meal.id === editingMealId
            ? { ...meal, name: nextMealName }
            : meal
        )
      )
    }

    setEditingMealId(null)
    setEditingMealName("")
  }, [editingMealId, editingMealName])
  const cancelEditingMealName = React.useCallback(() => {
    setEditingMealId(null)
    setEditingMealName("")
  }, [])
  const reorderMeals = React.useCallback((sourceMealId: number, insertIndex: number) => {
    setMeals((currentMeals) => {
      const sourceIndex = currentMeals.findIndex((meal) => meal.id === sourceMealId)

      if (sourceIndex === -1) {
        return currentMeals
      }

      const nextMeals = [...currentMeals]
      const [movedMeal] = nextMeals.splice(sourceIndex, 1)
      const normalizedInsertIndex =
        sourceIndex < insertIndex ? insertIndex - 1 : insertIndex

      nextMeals.splice(normalizedInsertIndex, 0, movedMeal)

      return nextMeals
    })
  }, [])
  const reorderMealItems = React.useCallback(
    (mealId: number, sourceItemId: number, insertIndex: number) => {
      setMeals((currentMeals) =>
        currentMeals.map((meal) => {
          if (meal.id !== mealId) {
            return meal
          }

          const sourceIndex = meal.items.findIndex((item) => item.id === sourceItemId)

          if (sourceIndex === -1) {
            return meal
          }

          const nextItems = [...meal.items]
          const [movedItem] = nextItems.splice(sourceIndex, 1)
          const normalizedInsertIndex =
            sourceIndex < insertIndex ? insertIndex - 1 : insertIndex

          nextItems.splice(normalizedInsertIndex, 0, movedItem)

          return {
            ...meal,
            items: nextItems,
          }
        })
      )
    },
    []
  )
  const handleMealTabDragStart = React.useCallback(
    (event: React.DragEvent<HTMLSpanElement>, mealId: number) => {
      if (editingMealId !== null) {
        event.preventDefault()
        return
      }

      event.stopPropagation()
      event.dataTransfer.effectAllowed = "move"
      event.dataTransfer.setData("text/plain", String(mealId))
      setDraggedMealId(mealId)
    },
    [editingMealId]
  )
  const handleMealTabDragEnd = React.useCallback(() => {
    setDraggedMealId(null)
    setDragInsertIndex(null)
  }, [])
  const handleMealTabDragOver = React.useCallback(
    (
      event: React.DragEvent<HTMLButtonElement>,
      mealId: number,
      mealIndex: number
    ) => {
      if (draggedMealId === null || draggedMealId === mealId) {
        setDragInsertIndex(null)
        return
      }

      event.preventDefault()
      const bounds = event.currentTarget.getBoundingClientRect()
      const nextInsertIndex =
        event.clientX < bounds.left + bounds.width / 2 ? mealIndex : mealIndex + 1

      setDragInsertIndex(nextInsertIndex)
    },
    [draggedMealId]
  )
  const handleMealTabDrop = React.useCallback(
    (event: React.DragEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()

      const sourceMealId =
        draggedMealId ?? Number(event.dataTransfer.getData("text/plain"))

      if (!Number.isFinite(sourceMealId)) {
        setDragInsertIndex(null)
        return
      }

      if (dragInsertIndex !== null) {
        reorderMeals(sourceMealId, dragInsertIndex)
      }

      setDraggedMealId(null)
      setDragInsertIndex(null)
    },
    [dragInsertIndex, draggedMealId, reorderMeals]
  )
  const handleMealItemDragStart = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>, itemId: number) => {
      event.stopPropagation()
      event.dataTransfer.effectAllowed = "move"
      event.dataTransfer.dropEffect = "move"
      event.dataTransfer.setData("text/plain", String(itemId))
      setDraggedMealItemId(itemId)
      setDragMealItemInsertIndex(null)
    },
    []
  )
  const handleMealItemDragEnd = React.useCallback(() => {
    setDraggedMealItemId(null)
    setDragMealItemInsertIndex(null)
    setDragFoodInsertIndex(null)
  }, [])
  const handleMealItemDragOver = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>, itemIndex: number) => {
      if (draggedMealItemId === null) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      event.dataTransfer.dropEffect = "move"
      const bounds = event.currentTarget.getBoundingClientRect()
      const nextInsertIndex =
        event.clientY < bounds.top + bounds.height / 2 ? itemIndex : itemIndex + 1

      setDragMealItemInsertIndex(nextInsertIndex)
      setDragFoodInsertIndex(null)
    },
    [draggedMealItemId]
  )
  const handleMealItemListEndDragOver = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if ((draggedMealItemId === null && !dragFoodPayload) || !activeMeal) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      event.dataTransfer.dropEffect =
        draggedMealItemId !== null ? "move" : "copy"

      if (draggedMealItemId !== null) {
        setDragMealItemInsertIndex(activeMeal.items.length)
        setDragFoodInsertIndex(null)
        return
      }

      setDragFoodInsertIndex(activeMeal.items.length)
    },
    [activeMeal, dragFoodPayload, draggedMealItemId]
  )
  const handleMealItemListStartDragOver = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (draggedMealItemId === null) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      event.dataTransfer.dropEffect = "move"
      setDragMealItemInsertIndex(0)
      setDragFoodInsertIndex(null)
    },
    [draggedMealItemId]
  )
  const handleFoodInsertZoneDragOver = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>, insertIndex: number) => {
      if (!dragFoodPayload) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      event.dataTransfer.dropEffect = "copy"
      setDragFoodInsertIndex(insertIndex)
    },
    [dragFoodPayload]
  )
  const handleMealItemDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if ((draggedMealItemId === null && !dragFoodPayload) || !activeMeal) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      if (dragFoodPayload) {
        addFoodToMeal(
          dragFoodPayload.foodId,
          activeMeal.id,
          dragFoodPayload.qty,
          dragFoodInsertIndex ?? activeMeal.items.length
        )
        setDragFoodPayload(null)
        setDragFoodInsertIndex(null)
        setDragOverMealId(null)
        setDraggedMealItemId(null)
        setDragMealItemInsertIndex(null)
        return
      }

      const sourceItemId =
        draggedMealItemId ?? Number(event.dataTransfer.getData("text/plain"))

      if (!Number.isFinite(sourceItemId)) {
        setDraggedMealItemId(null)
        setDragMealItemInsertIndex(null)
        return
      }

      if (dragMealItemInsertIndex !== null) {
        reorderMealItems(activeMeal.id, sourceItemId, dragMealItemInsertIndex)
      }

      setDraggedMealItemId(null)
      setDragMealItemInsertIndex(null)
      setDragFoodInsertIndex(null)
    },
    [
      activeMeal,
      addFoodToMeal,
      dragFoodInsertIndex,
      dragFoodPayload,
      dragMealItemInsertIndex,
      draggedMealItemId,
      reorderMealItems,
    ]
  )
  const handleMealContentDragOver = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if ((draggedMealItemId === null && !dragFoodPayload) || !activeMeal) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      event.dataTransfer.dropEffect =
        draggedMealItemId !== null ? "move" : "copy"
      setDragOverMealId(activeMeal.id)

      if (draggedMealItemId !== null) {
        setDragMealItemInsertIndex(activeMeal.items.length)
        setDragFoodInsertIndex(null)
        return
      }

      setDragFoodInsertIndex(activeMeal.items.length)
    },
    [activeMeal, dragFoodPayload, draggedMealItemId]
  )
  const handleMealContentDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if ((draggedMealItemId === null && !dragFoodPayload) || !activeMeal) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      if (dragFoodPayload) {
        addFoodToMeal(
          dragFoodPayload.foodId,
          activeMeal.id,
          dragFoodPayload.qty,
          activeMeal.items.length
        )
        setDragFoodPayload(null)
        setDragFoodInsertIndex(null)
        setDragOverMealId(null)
        setDraggedMealItemId(null)
        setDragMealItemInsertIndex(null)
        return
      }

      const sourceItemId =
        draggedMealItemId ?? Number(event.dataTransfer.getData("text/plain"))

      if (!Number.isFinite(sourceItemId)) {
        setDraggedMealItemId(null)
        setDragMealItemInsertIndex(null)
        setDragFoodInsertIndex(null)
        setDragOverMealId(null)
        return
      }

      reorderMealItems(activeMeal.id, sourceItemId, activeMeal.items.length)
      setDraggedMealItemId(null)
      setDragMealItemInsertIndex(null)
      setDragFoodInsertIndex(null)
      setDragOverMealId(null)
    },
    [activeMeal, addFoodToMeal, dragFoodPayload, draggedMealItemId, reorderMealItems]
  )

  return (
    <div className="min-w-0 bg-neutral-50 p-0 m-0">
      <NutritionBuilderNav
        title={planName}
        isEditingTitle={isEditingName}
        inputValue={planName}
        inputRef={nameInputRef}
        onBack={handleNavigateBack}
        onStartEditing={() => setIsEditingName(true)}
        onTitleChange={setPlanName}
        onTitleBlur={() => setIsEditingName(false)}
        onTitleKeyDown={(event) => {
          if (event.key === "Enter") {
            setIsEditingName(false)
          }
        }}
        onSave={handleSavePlan}
        saveLabel="Save Plan"
        clientPicker={
          showClientPicker ? (
            <NutritionBuilderClientPicker
              clients={clientOptions}
              selectedClientIds={assignedClientIds}
              onSelectedClientIdsChange={setAssignedClientIds}
            />
          ) : null
        }
      />

      <div className="relative xl:flex xl:items-start">
        <Card className="relative overflow-hidden gap-0 rounded-none border-0 border-r border-neutral-200 py-0 shadow-none xl:sticky m xl:top-[calc(var(--header-height)+3rem)] xl:left-0 xl:h-[calc(100dvh-var(--header-height)-3rem)] xl:w-[360px] xl:flex xl:flex-none xl:flex-col xl:self-start">
          <div className="border-b border-neutral-200 bg-neutral-50 px-2 ">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setLeftTab("foods")}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 border-b-2 border-transparent bg-transparent px-3 py-2.5 text-[13px] transition-colors",
                  leftTab === "foods"
                    ? "border-brand-500 font-medium text-brand-600"
                    : "text-neutral-500 hover:text-neutral-800"
                )}
              >
                <Apple
                  className="size-3.5 text-neutral-400"
                />
                Foods
              </button>
              <button
                type="button"
                onClick={() => setLeftTab("templates")}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 border-b-2 border-transparent bg-transparent px-3 py-2.5 text-[13px] transition-colors",
                  leftTab === "templates"
                    ? "border-brand-500 font-medium text-brand-600"
                    : "text-neutral-500 hover:text-neutral-800"
                )}
              >
                <UtensilsCrossed
                  className="size-3.5 text-neutral-400"
                />
                Meals
              </button>
            </div>
          </div>

          <CardContent className="space-y-4 overflow-hidden bg-neutral-50 py-2 px-4 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col">
            {leftTab === "foods" ? (
              <div className="space-y-4 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col">
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                  <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search foods..."
                    className="h-10 rounded-sm border-neutral-200  pl-9 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                </div>

                <div className="space-y-2 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col">
                  <BuilderSectionTitle
                    title={searchQuery.trim() ? "Search results" : "Recently added"}
                  />
                  <div className="space-y-2 xl:-mr-2 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:[overflow-y:overlay] xl:pr-2 [scrollbar-color:var(--color-neutral-100)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-100 [&::-webkit-scrollbar-thumb:hover]:bg-neutral-200 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1">
                    {filteredFoods.length ? (
                      filteredFoods.map((food) => (
                        <FoodLibraryRow
                          key={food.id}
                          food={food}
                          onAdd={(qty) => addFoodToMeal(food.id, activeMealId, qty)}
                          onDragStart={(event, qty) => {
                            event.dataTransfer.effectAllowed = "copy"
                            event.dataTransfer.dropEffect = "copy"
                            event.dataTransfer.setData(
                              "application/x-setwise-food",
                              String(food.id)
                            )
                            setDragFoodPayload({ foodId: food.id, qty })
                            setDragFoodInsertIndex(null)
                          }}
                          onDragEnd={() => {
                            setDragFoodPayload(null)
                            setDragFoodInsertIndex(null)
                            setDragOverMealId(null)
                          }}
                        />
                      ))
                    ) : (
                      <div className="space-y-3">
                        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-100/70 px-4 py-6 text-center text-[13px] text-neutral-500">
                          No foods found.
                        </div>
                        <button
                          type="button"
                          onClick={handleCreateFood}
                          className="inline-flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-dashed border-brand-300 bg-brand-50/35 px-3 text-[13px] font-medium text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-50/55"
                        >
                          <Plus className="size-3.5" />
                          {searchQuery.trim()
                            ? `Create "${searchQuery.trim()}"`
                            : "Create food"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative space-y-4 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col">
                {showSaveTemplateForm ? (
                  <div className="absolute inset-x-0 top-0 z-20 rounded-xl border border-neutral-200 bg-neutral-50 p-3 shadow-lg shadow-neutral-900/5">
                    <div className="space-y-3">
                      <div className="text-[13px] font-medium text-neutral-900">
                        Save current meal as template
                      </div>
                      <Input
                        value={newTemplateName}
                        onChange={(event) => setNewTemplateName(event.target.value)}
                        placeholder={`${activeMeal?.name ?? "Meal"} template`}
                        className="h-9 rounded-sm border-neutral-200 bg-neutral-100 shadow-none focus-visible:border-brand-500 focus-visible:ring-0"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <SecondaryActionButton
                          label="Cancel"
                          onClick={() => {
                            setShowSaveTemplateForm(false)
                            setNewTemplateName("")
                          }}
                        />
                        <PrimaryActionButton
                          label="Save template"
                          onClick={saveCurrentMealAsTemplate}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                  <Input
                    value={templateSearchQuery}
                    onChange={(event) => setTemplateSearchQuery(event.target.value)}
                    placeholder="Search meals or foods..."
                    className="h-10 rounded-sm border-neutral-200  pl-9 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                </div>

                {activeMeal?.items.length && !templatedMealIds.has(activeMeal.id) ? (
                  showSaveTemplateForm ? null : (
                    <SecondaryActionButton
                      label={`Create "${activeMeal.name}" template`}
                      onClick={() => {
                        setShowSaveTemplateForm(true)
                        setNewTemplateName(activeMeal.name)
                      }}
                      className="w-full justify-center"
                    />
                  )
                ) : null}

                <div className="space-y-2 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col">
                  <BuilderSectionTitle title="Saved templates" />
                  <div className="space-y-2 xl:-mr-2 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:[overflow-y:overlay] xl:pr-2 [scrollbar-color:var(--color-neutral-100)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-100 [&::-webkit-scrollbar-thumb:hover]:bg-neutral-200 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1">
                    {filteredTemplates.length ? (
                      filteredTemplates.map((template) => (
                        <React.Fragment key={template.id}>
                          <TemplateLibraryCard
                            foods={foods}
                            template={template}
                            onApply={() => addTemplateToMeal(template)}
                            onCreateMeal={() => createMealFromTemplate(template)}
                            onDelete={() => {
                              deleteTemplateTriggerRefs.current[template.id]?.click()
                            }}
                          />
                          {template.isCustom ? (
                            <CoachWiseConfirmationDialog
                              title="Delete this template?"
                              description={`${template.name} will be removed from saved templates. This action can't be undone.`}
                              confirmLabel="Delete template"
                              variant="destructive"
                              onConfirm={() => {
                                setSavedTemplates((currentTemplates) =>
                                  currentTemplates.filter(
                                    (currentTemplate) => currentTemplate.id !== template.id
                                  )
                                )
                                removeStoredNutritionMealTemplate(template.id)
                              }}
                              trigger={
                                <button
                                  ref={(node) => {
                                    deleteTemplateTriggerRefs.current[template.id] = node
                                  }}
                                  type="button"
                                  tabIndex={-1}
                                  aria-hidden="true"
                                  className="sr-only"
                                />
                              }
                            />
                          ) : null}
                        </React.Fragment>
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-[13px] text-neutral-500">
                        No templates found.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="w-full xl:min-w-0 xl:flex-1 md:max-w-5xl xl:px-4 xl:pt-4">
          <div className="px-4">
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-none">
              <div className="grid grid-cols-1 md:grid-cols-[repeat(4,minmax(0,1fr))_3.5rem]">
                {goalSummaryMetrics.map((metric) => (
                  <BuilderGoalSummaryMetric
                    key={metric.key}
                    label={metric.label}
                    currentValue={metric.currentValue}
                    goalValue={metric.goalValue}
                    unit={metric.unit}
                    progressClassName={metric.progressClassName}
                  />
                ))}

                <div className="flex min-h-[78px] items-center justify-center border-t border-neutral-200 bg-white md:border-t-0 md:border-l">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setIsGoalsDialogOpen(true)}
                    className="size-8 rounded-md text-neutral-500 shadow-none hover:bg-neutral-100 hover:text-neutral-800"
                  >
                    <Target className="size-4" />
                    <span className="sr-only">Open meal plan goals</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <MealPlanGoalsDialog
            open={isGoalsDialogOpen}
            onOpenChange={setIsGoalsDialogOpen}
            value={mealPlanGoals}
            onSave={setMealPlanGoals}
          />
          <CreateFoodDialog
            open={isCreateFoodDialogOpen}
            onOpenChange={setIsCreateFoodDialogOpen}
            initialName={searchQuery.trim()}
            onCreate={handleCreateFoodSubmit}
          />

          <Card className="overflow-hidden rounded-xl gap-y-3 border-0 bg-neutral-50 shadow-none">
            <div className="bg-neutral-50 px-4 py-2.5">
              <div className="flex flex-wrap items-center justify-between gap-x-3">
                <div
                  className={cn(
                    "flex flex-wrap items-center gap-2",
                    dragInsertIndex !== null && draggedMealId !== null
                      ? "gap-[6px]"
                      : null
                  )}
                >
                  {meals.map((meal, mealIndex) => (
                    <React.Fragment key={meal.id}>
                      {dragInsertIndex === mealIndex && draggedMealId !== null ? (
                        <span className="pointer-events-none flex h-8 w-4 items-center justify-center rounded-md border border-dashed border-brand-300 bg-brand-50/70 text-brand-500">
                          <Plus className="size-2.5" />
                        </span>
                      ) : null}
                      <div className="group relative">
                        <button
                          type="button"
                          draggable={editingMealId !== meal.id}
                          onClick={() => setActiveMealId(meal.id)}
                          onDoubleClick={() => startEditingMealName(meal)}
                          onDragStart={(event) => handleMealTabDragStart(event, meal.id)}
                          onDragEnd={handleMealTabDragEnd}
                          onDragOver={(event) =>
                            handleMealTabDragOver(event, meal.id, mealIndex)
                          }
                          onDrop={handleMealTabDrop}
                          className={cn(
                            "relative isolate inline-flex min-w-[5.8rem] items-center justify-center gap-2 overflow-visible rounded-lg border px-3 py-1.5 text-[13px] transition-colors",
                            editingMealId !== meal.id ? "pr-8" : null,
                            editingMealId !== meal.id ? "cursor-grab active:cursor-grabbing" : null,
                            editingMealId === meal.id
                              ? "border-brand-200 bg-brand-50/60 text-brand-700"
                              : meal.id === activeMealId
                                ? "border-brand-200 bg-brand-50/60 font-medium text-brand-700"
                                : "border-neutral-200 bg-neutral-100 text-neutral-500 hover:border-neutral-200 hover:text-neutral-800"
                          )}
                        >
                          {editingMealId === meal.id ? (
                            <Input
                              ref={mealNameInputRef}
                              value={editingMealName}
                              onChange={(event) => setEditingMealName(event.target.value)}
                              onBlur={commitMealName}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  commitMealName()
                                }
                                if (event.key === "Escape") {
                                  cancelEditingMealName()
                                }
                              }}
                              onClick={(event) => event.stopPropagation()}
                              className="h-5! max-w-[7rem] border-0 bg-transparent px-0 text-[12px] font-medium shadow-none focus-visible:ring-0"
                            />
                          ) : (
                            meal.name
                          )}
                        </button>

                        {editingMealId !== meal.id ? (
                          <>
                            <OverflowActionsMenu
                              triggerLabel={`Open actions for ${meal.name}`}
                              items={[
                                {
                                  id: "edit",
                                  label: "Edit meal",
                                  icon: Pencil,
                                  onSelect: () => startEditingMealName(meal),
                                },
                                {
                                  id: "delete",
                                  label: "Delete meal",
                                  icon: Trash2,
                                  variant: "destructive",
                                  disabled: meals.length <= 1,
                                  onSelect: () => {
                                    if (meals.length <= 1) {
                                      return
                                    }

                                    deleteMealTriggerRefs.current[meal.id]?.click()
                                  },
                                },
                              ]}
                              triggerClassName="absolute top-1/2 right-1 z-10 -translate-y-1/2 cursor-pointer border-transparent bg-transparent opacity-100 shadow-none hover:border-transparent hover:bg-transparent hover:text-foreground data-[state=open]:border-transparent data-[state=open]:bg-transparent data-[state=open]:opacity-100"
                            />

                            <CoachWiseConfirmationDialog
                              title="Delete this meal?"
                              description={`${meal.name} will be removed from this meal plan. This action can't be undone.`}
                              confirmLabel="Delete meal"
                              variant="destructive"
                              onConfirm={() => removeMeal(meal.id)}
                              trigger={
                                <button
                                  ref={(node) => {
                                    deleteMealTriggerRefs.current[meal.id] = node
                                  }}
                                  type="button"
                                  tabIndex={-1}
                                  aria-hidden="true"
                                  className="sr-only"
                                />
                              }
                            />
                          </>
                        ) : null}
                      </div>
                    </React.Fragment>
                  ))}
                  {dragInsertIndex === meals.length && draggedMealId !== null ? (
                    <span className="pointer-events-none flex h-7 w-4 items-center justify-center rounded-md border border-dashed border-brand-300 bg-brand-50/70 text-brand-500">
                      <Plus className="size-2.5" />
                    </span>
                  ) : null}
                  <SecondaryActionButton
                    label="Add meal"
                    icon={Plus}
                    iconClassName="size-3"
                    onClick={addMeal}
                    className="h-8.5 rounded-lg border-dashed border-neutral-200 bg-neutral-50 px-3 text-[13px] font-medium text-neutral-600 hover:border-neutral-300 hover:bg-neutral-100/80 hover:text-neutral-800"
                  />
                </div>

                {activeMealTotals ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="rounded-md border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-700">
                      {activeMealTotals.cal} kcal
                    </Badge>
                    <Badge variant="outline" className="rounded-md border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                      P {activeMealTotals.p.toFixed(0)}g
                    </Badge>
                    <Badge variant="outline" className="rounded-md border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-700">
                      C {activeMealTotals.c.toFixed(0)}g
                    </Badge>
                    <Badge variant="outline" className="rounded-md border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">
                      F {activeMealTotals.f.toFixed(0)}g
                    </Badge>
                  </div>
                ) : null}
              </div>
            </div>

            <CardContent
              className="space-y-0 bg-neutral-50 px-4 pb-3 transition-colors"
              onDragOver={handleMealContentDragOver}
              onDragLeave={() => {
                if (!dragFoodPayload && draggedMealItemId === null) {
                  return
                }

                setDragOverMealId(null)
                setDragFoodInsertIndex(null)
              }}
              onDrop={handleMealContentDrop}
            >
              {activeMeal?.items.length ? (
                <div className="flex flex-col gap-2">
                  {draggedMealItemId !== null ? (
                    <div
                      className="min-h-2"
                      onDragOver={handleMealItemListStartDragOver}
                      onDrop={handleMealItemDrop}
                    >
                      {dragMealItemInsertIndex === 0 ? (
                        <BuilderInsertPlaceholder />
                      ) : null}
                    </div>
                  ) : dragFoodPayload ? (
                    <div
                      className="rounded-xl border border-dashed border-brand-300 bg-brand-50/35 px-4 py-3 text-[13px] font-medium text-brand-700"
                      onDragOver={(event) => handleFoodInsertZoneDragOver(event, 0)}
                      onDrop={handleMealItemDrop}
                    >
                      Drop to this meal
                    </div>
                  ) : null}
                  {activeMeal.items.map((item, itemIndex) => (
                    <div key={item.id} className="relative">
                      {dragFoodPayload && itemIndex > 0 ? (
                        dragFoodInsertIndex === itemIndex ? (
                          <div
                            className="mb-2"
                            onDragOver={(event) =>
                              handleFoodInsertZoneDragOver(event, itemIndex)
                            }
                            onDrop={handleMealItemDrop}
                          >
                            <BuilderInsertPlaceholder />
                          </div>
                        ) : (
                          <div
                            className="absolute inset-x-0 -top-2 z-10 h-3"
                            onDragOver={(event) =>
                              handleFoodInsertZoneDragOver(event, itemIndex)
                            }
                            onDrop={handleMealItemDrop}
                          />
                        )
                      ) : null}
                      {itemIndex > 0 && draggedMealItemId !== null ? (
                        dragMealItemInsertIndex === itemIndex ? (
                          <BuilderInsertPlaceholder className="mb-2" />
                        ) : null
                      ) : null}
                      <MealItemRow
                        foods={foods}
                        item={item}
                        isDragging={draggedMealItemId === item.id}
                        onDragStart={(event) => handleMealItemDragStart(event, item.id)}
                        onDragEnd={handleMealItemDragEnd}
                        onDragOver={(event) => handleMealItemDragOver(event, itemIndex)}
                        onDrop={handleMealItemDrop}
                        onChangeQty={(nextQty) =>
                          setMeals((currentMeals) =>
                            currentMeals.map((meal) =>
                              meal.id === activeMeal.id
                                ? {
                                  ...meal,
                                  items: meal.items.map((mealItem) =>
                                    mealItem.id === item.id
                                      ? { ...mealItem, qty: nextQty }
                                      : mealItem
                                  ),
                                }
                                : meal
                            )
                          )
                        }
                        onRemove={() =>
                          setMeals((currentMeals) =>
                            currentMeals.map((meal) =>
                              meal.id === activeMeal.id
                                ? {
                                  ...meal,
                                  items: meal.items.filter(
                                    (mealItem) => mealItem.id !== item.id
                                  ),
                                }
                                : meal
                            )
                          )
                        }
                      />
                    </div>
                  ))}
                  {draggedMealItemId !== null ? (
                    <div
                      className="min-h-2"
                      onDragOver={handleMealItemListEndDragOver}
                      onDrop={handleMealItemDrop}
                    >
                      {dragMealItemInsertIndex === activeMeal.items.length ? (
                        <BuilderInsertPlaceholder />
                      ) : null}
                    </div>
                  ) : dragFoodPayload ? (
                    <div
                      className="min-h-2"
                      onDragOver={(event) =>
                        handleFoodInsertZoneDragOver(event, activeMeal.items.length)
                      }
                      onDrop={handleMealItemDrop}
                    >
                      {dragFoodInsertIndex === activeMeal.items.length ? (
                        <BuilderInsertPlaceholder />
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div
                  className={cn(
                    "rounded-xl border border-dashed px-6 py-10 text-center",
                    dragFoodPayload
                      ? "border-brand-300 bg-brand-50 text-brand-700"
                      : "border-neutral-200 bg-neutral-50"
                  )}
                >
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl border border-neutral-200  text-neutral-400">
                    <ChefHat className="size-5" />
                  </div>
                  {dragFoodPayload ? (
                    <>
                      <div className="text-[15px] font-medium text-brand-700">
                        Drop the selected food into this meal.
                      </div>
                      <div className="mt-1 text-[13px] text-brand-600">
                        This will add the first item to the active meal.
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-[15px] font-medium text-neutral-900">
                        This meal is empty
                      </div>
                      <div className="mt-1 text-[13px] text-neutral-500">
                        Search foods on the left, apply a saved template, or drag a
                        food directly into this area.
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {false ? (
            <div className="space-y-2">
              <BuilderSectionTitle title="Other meals" />
              {meals
                .filter((meal) => meal.id !== activeMealId)
                .map((meal) => {
                  const totals = getBuilderMealTotals(foods, meal)

                  return (
                    <button
                      key={meal.id}
                      type="button"
                      onClick={() => setActiveMealId(meal.id)}
                      onDragOver={(event) => {
                        event.preventDefault()
                        setDragOverMealId(meal.id)
                      }}
                      onDragLeave={() => setDragOverMealId(null)}
                      onDrop={(event) => {
                        event.preventDefault()
                        if (dragFoodPayload) {
                          addFoodToMeal(
                            dragFoodPayload.foodId,
                            meal.id,
                            dragFoodPayload.qty
                          )
                        }
                        setDragFoodPayload(null)
                        setDragOverMealId(null)
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border  px-4 py-3 text-left shadow-none transition-colors",
                        dragOverMealId === meal.id
                          ? "border-brand-300 bg-brand-50/40"
                          : "border-neutral-200 hover:bg-neutral-50"
                      )}
                    >
                      <div>
                        <div className="text-[13px] font-medium text-neutral-950">
                          {meal.name}
                        </div>
                        <div className="text-[11.5px] text-neutral-500">
                          {meal.items.length} items  -  {totals.cal} kcal
                        </div>
                      </div>
                      {dragFoodPayload ? (
                        <div className="text-[12px] font-medium text-brand-600">
                          Drop here
                        </div>
                      ) : null}
                    </button>
                  )
                })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
