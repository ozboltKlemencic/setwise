"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Apple,
  Check,
  ChefHat,
  CopyPlus,
  Drumstick,
  Droplets,
  Flame,
  GripVertical,
  Minus,
  Pencil,
  Plus,
  Search,
  Trash2,
  UtensilsCrossed,
  Wheat,
} from "lucide-react"

import { CoachWiseConfirmationDialog } from "@/components/coachWise/confirmation-dialog"
import { NutritionBuilderNav } from "@/components/coachWise/clients/nutrition/nutrition-builder-nav"
import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { SecondaryActionButton } from "@/components/coachWise/secondary-action-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type BuilderFood = {
  id: number
  name: string
  cal: number
  p: number
  c: number
  f: number
  unit: "g" | "piece" | "ml" | "slice"
  step: number
  defaultQty: number
}

type BuilderTemplateItem = {
  foodId: number
  qty: number
}

type BuilderMealTemplate = {
  id: string
  name: string
  items: BuilderTemplateItem[]
  isCustom?: boolean
}

type BuilderMealItem = {
  id: number
  foodId: number
  qty: number
}

type BuilderMeal = {
  id: number
  name: string
  items: BuilderMealItem[]
}

const FOOD_DB: BuilderFood[] = [
  { id: 1, name: "Chicken breast", cal: 165, p: 31, c: 0, f: 3.6, unit: "g", step: 50, defaultQty: 150 },
  { id: 2, name: "Cooked rice", cal: 130, p: 2.7, c: 28, f: 0.3, unit: "g", step: 50, defaultQty: 200 },
  { id: 3, name: "Broccoli", cal: 34, p: 2.8, c: 7, f: 0.4, unit: "g", step: 50, defaultQty: 150 },
  { id: 4, name: "Eggs", cal: 155, p: 13, c: 1.1, f: 11, unit: "piece", step: 1, defaultQty: 3 },
  { id: 5, name: "Oats", cal: 389, p: 17, c: 66, f: 7, unit: "g", step: 10, defaultQty: 80 },
  { id: 6, name: "Banana", cal: 89, p: 1.1, c: 23, f: 0.3, unit: "piece", step: 1, defaultQty: 1 },
  { id: 7, name: "Whey protein", cal: 120, p: 24, c: 3, f: 1.5, unit: "g", step: 5, defaultQty: 30 },
  { id: 8, name: "Tuna", cal: 116, p: 26, c: 0, f: 1, unit: "g", step: 50, defaultQty: 100 },
  { id: 9, name: "Sweet potato", cal: 86, p: 1.6, c: 20, f: 0.1, unit: "g", step: 50, defaultQty: 200 },
  { id: 10, name: "Cottage cheese", cal: 98, p: 11, c: 3.4, f: 4.3, unit: "g", step: 50, defaultQty: 200 },
  { id: 11, name: "Avocado", cal: 160, p: 2, c: 9, f: 15, unit: "piece", step: 1, defaultQty: 1 },
  { id: 12, name: "Almonds", cal: 579, p: 21, c: 22, f: 50, unit: "g", step: 5, defaultQty: 30 },
  { id: 13, name: "Salmon", cal: 208, p: 20, c: 0, f: 13, unit: "g", step: 50, defaultQty: 150 },
  { id: 14, name: "Spinach", cal: 23, p: 2.9, c: 3.6, f: 0.4, unit: "g", step: 50, defaultQty: 100 },
  { id: 15, name: "Greek yogurt", cal: 59, p: 10, c: 3.6, f: 0.7, unit: "g", step: 50, defaultQty: 200 },
  { id: 16, name: "Wholegrain bread", cal: 247, p: 13, c: 41, f: 3.4, unit: "slice", step: 1, defaultQty: 2 },
  { id: 17, name: "Olive oil", cal: 884, p: 0, c: 0, f: 100, unit: "ml", step: 5, defaultQty: 10 },
  { id: 18, name: "Turkey fillet", cal: 135, p: 30, c: 0, f: 1, unit: "g", step: 50, defaultQty: 150 },
  { id: 19, name: "Quinoa", cal: 120, p: 4.4, c: 21, f: 1.9, unit: "g", step: 50, defaultQty: 150 },
  { id: 20, name: "Strawberries", cal: 32, p: 0.7, c: 7.7, f: 0.3, unit: "g", step: 50, defaultQty: 150 },
]

const MEAL_TEMPLATES: BuilderMealTemplate[] = [
  { id: "t1", name: "Breakfast A - Oat Bowl", items: [{ foodId: 5, qty: 80 }, { foodId: 7, qty: 30 }, { foodId: 6, qty: 1 }, { foodId: 12, qty: 20 }] },
  { id: "t2", name: "Lunch - Chicken & Rice", items: [{ foodId: 1, qty: 200 }, { foodId: 2, qty: 250 }, { foodId: 3, qty: 150 }, { foodId: 17, qty: 10 }] },
  { id: "t3", name: "Breakfast B - Eggs & Toast", items: [{ foodId: 4, qty: 3 }, { foodId: 16, qty: 2 }, { foodId: 11, qty: 1 }, { foodId: 14, qty: 50 }] },
  { id: "t4", name: "Dinner - Salmon", items: [{ foodId: 13, qty: 180 }, { foodId: 9, qty: 200 }, { foodId: 14, qty: 100 }, { foodId: 17, qty: 10 }] },
]

const RECENT_FOOD_IDS = [1, 2, 5, 4, 7, 3, 15, 8, 13, 6]

function calcNutrition(foodId: number, qty: number) {
  const food = FOOD_DB.find((item) => item.id === foodId)

  if (!food) {
    return { cal: 0, p: 0, c: 0, f: 0 }
  }

  const isCountable = food.unit === "piece" || food.unit === "slice"
  const multiplier = isCountable ? qty : qty / 100

  return {
    cal: Math.round(food.cal * multiplier),
    p: +(food.p * multiplier).toFixed(1),
    c: +(food.c * multiplier).toFixed(1),
    f: +(food.f * multiplier).toFixed(1),
  }
}

function formatFoodUnitLabel(unit: BuilderFood["unit"]) {
  switch (unit) {
    case "piece":
      return "pc"
    case "slice":
      return "sl"
    default:
      return unit
  }
}

function formatBuilderDate() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date())
}

function getTemplateTotals(template: BuilderMealTemplate) {
  return template.items.reduce(
    (accumulator, item) => {
      const nutrition = calcNutrition(item.foodId, item.qty)
      return {
        cal: accumulator.cal + nutrition.cal,
        p: accumulator.p + nutrition.p,
        c: accumulator.c + nutrition.c,
        f: accumulator.f + nutrition.f,
      }
    },
    { cal: 0, p: 0, c: 0, f: 0 }
  )
}

function getMealTotals(meal: BuilderMeal) {
  return meal.items.reduce(
    (accumulator, item) => {
      const nutrition = calcNutrition(item.foodId, item.qty)
      return {
        cal: accumulator.cal + nutrition.cal,
        p: accumulator.p + nutrition.p,
        c: accumulator.c + nutrition.c,
        f: accumulator.f + nutrition.f,
      }
    },
    { cal: 0, p: 0, c: 0, f: 0 }
  )
}

function BuilderSectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-2 text-[12px] font-medium uppercase tracking-[0.12em] text-neutral-400">
      {title}
    </div>
  )
}

function BuilderMetricCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string
  value: string
  icon: React.ReactNode
  tone: {
    container: string
    badge: string
    icon: string
  }
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-3 py-3 shadow-none",
        tone.container
      )}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl border",
            tone.badge
          )}
        >
          <span className={tone.icon}>{icon}</span>
        </div>
        <div className="min-w-0">
          <div className="text-[18px] leading-none font-semibold text-neutral-950">
            {value}
          </div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-neutral-500">
            {label}
          </div>
        </div>
      </div>
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
        <Minus className="size-3.5" />
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
        <Plus className="size-3.5" />
      </Button>
    </div>
  )
}

function FoodLibraryRow({
  food,
  selected,
  onToggle,
  onAdd,
  onDragStart,
  onDragEnd,
}: {
  food: BuilderFood
  selected: boolean
  onToggle: () => void
  onAdd: (qty: number) => void
  onDragStart: (qty: number) => void
  onDragEnd: () => void
}) {
  const [qty, setQty] = React.useState(food.defaultQty)

  return (
    <div
      draggable
      onDragStart={() => onDragStart(qty)}
      onDragEnd={onDragEnd}
      className="flex w-full items-stretch gap-2 rounded-md border border-neutral-200 bg-white py-3 pr-3 pl-2 transition-colors hover:bg-neutral-50"
    >
      <div className="flex w-5 shrink-0 items-center justify-center text-neutral-300">
        <GripVertical className="size-3.5" />
      </div>

      <div className="min-w-0 flex-1 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium text-neutral-950">
              {food.name}
            </div>
            <div className="mt-0.5 text-[11.5px] leading-5 text-neutral-500">
              {food.cal} kcal / 100
              {food.unit}
              {" · "}P{food.p} C{food.c} F{food.f}
            </div>
          </div>

          <button
            type="button"
            onClick={onToggle}
            className={cn(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border text-[11px] font-semibold transition-colors",
              selected
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-neutral-300  text-transparent"
            )}
          >
            <Check className="size-3" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <BuilderQuantityStepper
            value={qty}
            unit={food.unit}
            widthClassName="w-[4.75rem]"
            onChange={setQty}
            onDecrease={() =>
              setQty((current) => Math.max(food.step, current - food.step))
            }
            onIncrease={() => setQty((current) => current + food.step)}
          />
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => onAdd(qty)}
            className="size-7 rounded-md border-neutral-200 text-brand-600 shadow-none hover:bg-brand-50"
          >
            <CopyPlus className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function TemplateLibraryCard({
  template,
  onApply,
  onDelete,
}: {
  template: BuilderMealTemplate
  onApply: () => void
  onDelete: () => void
}) {
  const totals = getTemplateTotals(template)

  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="text-[13px] font-medium text-neutral-950">
            {template.name}
          </div>
          <div className="text-[11.5px] text-neutral-500">
            {totals.cal} kcal · P{totals.p.toFixed(0)}g · C{totals.c.toFixed(0)}g
            {" · "}F{totals.f.toFixed(0)}g
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
          const food = FOOD_DB.find((entry) => entry.id === item.foodId)
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

      <div className="mt-3">
        <SecondaryActionButton
          label="Add to current meal"
          onClick={onApply}
          className="w-full justify-center"
        />
      </div>
    </div>
  )
}

function MealItemRow({
  item,
  onChangeQty,
  onRemove,
}: {
  item: BuilderMealItem
  onChangeQty: (nextQty: number) => void
  onRemove: () => void
}) {
  const food = FOOD_DB.find((entry) => entry.id === item.foodId)

  if (!food) {
    return null
  }

  const nutrition = calcNutrition(item.foodId, item.qty)

  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-500">
        <GripVertical className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium text-neutral-950">
          {food.name}
        </div>
        <div className="text-[11.5px] text-neutral-500">
          {nutrition.cal} kcal · P{nutrition.p}g · C{nutrition.c}g · F{nutrition.f}g
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

export function MealPlanBuilderPageView({
  backHref,
}: {
  backHref: string
}) {
  const router = useRouter()
  const initialPlanName = React.useMemo(
    () => `Meal Plan - ${formatBuilderDate()}`,
    []
  )
  const itemIdCounter = React.useRef(1)
  const templateIdCounter = React.useRef(100)
  const nameInputRef = React.useRef<HTMLInputElement>(null)
  const mealNameInputRef = React.useRef<HTMLInputElement>(null)
  const [planName, setPlanName] = React.useState(initialPlanName)
  const [isEditingName, setIsEditingName] = React.useState(false)
  const [meals, setMeals] = React.useState<BuilderMeal[]>([
    { id: 1, name: "Meal 1", items: [] },
  ])
  const [activeMealId, setActiveMealId] = React.useState(1)
  const [editingMealId, setEditingMealId] = React.useState<number | null>(null)
  const [editingMealName, setEditingMealName] = React.useState("")
  const [draggedMealId, setDraggedMealId] = React.useState<number | null>(null)
  const [dragOverMealTabId, setDragOverMealTabId] = React.useState<number | null>(
    null
  )
  const [leftTab, setLeftTab] = React.useState<"foods" | "templates">("foods")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [templateSearchQuery, setTemplateSearchQuery] = React.useState("")
  const [selectedFoods, setSelectedFoods] = React.useState<Set<number>>(
    () => new Set()
  )
  const [savedTemplates, setSavedTemplates] =
    React.useState<BuilderMealTemplate[]>(MEAL_TEMPLATES)
  const [showSaveTemplateForm, setShowSaveTemplateForm] = React.useState(false)
  const [newTemplateName, setNewTemplateName] = React.useState("")
  const [dragFoodPayload, setDragFoodPayload] = React.useState<{
    foodId: number
    qty: number
  } | null>(null)
  const [dragOverMealId, setDragOverMealId] = React.useState<number | null>(null)

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
  const filteredFoods = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return RECENT_FOOD_IDS.map((id) => FOOD_DB.find((food) => food.id === id)).filter(
        Boolean
      ) as BuilderFood[]
    }

    return FOOD_DB.filter((food) =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])
  const filteredTemplates = React.useMemo(() => {
    if (!templateSearchQuery.trim()) {
      return savedTemplates
    }

    return savedTemplates.filter((template) => {
      const matchesName = template.name
        .toLowerCase()
        .includes(templateSearchQuery.toLowerCase())
      const matchesFood = template.items.some((item) => {
        const food = FOOD_DB.find((entry) => entry.id === item.foodId)
        return food?.name.toLowerCase().includes(templateSearchQuery.toLowerCase())
      })

      return matchesName || matchesFood
    })
  }, [savedTemplates, templateSearchQuery])
  const planTotals = React.useMemo(
    () =>
      meals.reduce(
        (accumulator, meal) => {
          const totals = getMealTotals(meal)
          return {
            cal: accumulator.cal + totals.cal,
            p: accumulator.p + totals.p,
            c: accumulator.c + totals.c,
            f: accumulator.f + totals.f,
          }
        },
        { cal: 0, p: 0, c: 0, f: 0 }
      ),
    [meals]
  )
  const activeMealTotals = React.useMemo(
    () => (activeMeal ? getMealTotals(activeMeal) : null),
    [activeMeal]
  )

  const handleNavigateBack = React.useCallback(() => {
    router.push(backHref)
  }, [backHref, router])

  const handleSavePlan = React.useCallback(() => {
    const nextPlanName = planName.trim() || initialPlanName

    toast.success("Meal plan created", {
      description: `For ${nextPlanName}.`,
    })

    handleNavigateBack()
  }, [handleNavigateBack, initialPlanName, planName])

  const addFoodToMeal = React.useCallback(
    (foodId: number, mealId = activeMealId, qty?: number) => {
      const food = FOOD_DB.find((entry) => entry.id === foodId)

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
            ? { ...meal, items: [...meal.items, nextItem] }
            : meal
        )
      )
      setSelectedFoods((currentSelectedFoods) => {
        const nextSelectedFoods = new Set(currentSelectedFoods)
        nextSelectedFoods.delete(foodId)
        return nextSelectedFoods
      })
    },
    [activeMealId]
  )

  const addSelectedFoodsToMeal = React.useCallback(() => {
    selectedFoods.forEach((foodId) => addFoodToMeal(foodId))
    setSelectedFoods(new Set())
  }, [addFoodToMeal, selectedFoods])

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

  const saveCurrentMealAsTemplate = React.useCallback(() => {
    if (!activeMeal || !activeMeal.items.length) {
      return
    }

    const nextTemplate: BuilderMealTemplate = {
      id: `custom-${templateIdCounter.current++}`,
      name: newTemplateName.trim() || `${activeMeal.name} template`,
      isCustom: true,
      items: activeMeal.items.map((item) => ({
        foodId: item.foodId,
        qty: item.qty,
      })),
    }

    setSavedTemplates((currentTemplates) => [nextTemplate, ...currentTemplates])
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
  const reorderMeals = React.useCallback(
    (sourceMealId: number, targetMealId: number) => {
      if (sourceMealId === targetMealId) {
        return
      }

      setMeals((currentMeals) => {
        const sourceIndex = currentMeals.findIndex((meal) => meal.id === sourceMealId)
        const targetIndex = currentMeals.findIndex((meal) => meal.id === targetMealId)

        if (sourceIndex === -1 || targetIndex === -1) {
          return currentMeals
        }

        const nextMeals = [...currentMeals]
        const [movedMeal] = nextMeals.splice(sourceIndex, 1)

        nextMeals.splice(targetIndex, 0, movedMeal)

        return nextMeals
      })
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
    setDragOverMealTabId(null)
  }, [])
  const handleMealTabDragOver = React.useCallback(
    (event: React.DragEvent<HTMLButtonElement>, mealId: number) => {
      if (draggedMealId === null || draggedMealId === mealId) {
        return
      }

      event.preventDefault()
      setDragOverMealTabId(mealId)
    },
    [draggedMealId]
  )
  const handleMealTabDrop = React.useCallback(
    (event: React.DragEvent<HTMLButtonElement>, mealId: number) => {
      event.preventDefault()
      event.stopPropagation()

      const sourceMealId =
        draggedMealId ?? Number(event.dataTransfer.getData("text/plain"))

      if (!Number.isFinite(sourceMealId)) {
        setDragOverMealTabId(null)
        return
      }

      reorderMeals(sourceMealId, mealId)
      setDraggedMealId(null)
      setDragOverMealTabId(null)
    },
    [draggedMealId, reorderMeals]
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
      />

      <div className="relative xl:flex xl:items-start">
        <Card className="relative overflow-hidden gap-0 rounded-none border-0 border-r border-neutral-200 py-0 shadow-none xl:sticky m xl:top-[calc(var(--header-height)+3rem)] xl:left-0 xl:h-[calc(100dvh-var(--header-height)-3rem)] xl:w-[360px] xl:flex xl:flex-none xl:flex-col xl:self-start">
          {leftTab === "foods" && selectedFoods.size ? (
            <div className="absolute inset-x-0 top-0 z-20  px-2 py-2 backdrop-blur-[2px]">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50/85 px-3 py-2">
                <div className="text-[12px] font-medium text-brand-700">
                  {selectedFoods.size} selected
                </div>
                <SecondaryActionButton
                  label={`Add ${selectedFoods.size}`}
                  onClick={addSelectedFoodsToMeal}
                />
              </div>
            </div>
          ) : null}

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
                          selected={selectedFoods.has(food.id)}
                          onToggle={() =>
                            setSelectedFoods((currentSelectedFoods) => {
                              const nextSelectedFoods = new Set(currentSelectedFoods)
                              if (nextSelectedFoods.has(food.id)) {
                                nextSelectedFoods.delete(food.id)
                              } else {
                                nextSelectedFoods.add(food.id)
                              }
                              return nextSelectedFoods
                            })
                          }
                          onAdd={(qty) => addFoodToMeal(food.id, activeMealId, qty)}
                          onDragStart={(qty) => {
                            setDragFoodPayload({ foodId: food.id, qty })
                          }}
                          onDragEnd={() => {
                            setDragFoodPayload(null)
                            setDragOverMealId(null)
                          }}
                        />
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-[13px] text-neutral-500">
                        No foods found.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col">
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                  <Input
                    value={templateSearchQuery}
                    onChange={(event) => setTemplateSearchQuery(event.target.value)}
                    placeholder="Search meals or foods..."
                    className="h-10 rounded-sm border-neutral-200  pl-9 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                </div>

                {activeMeal?.items.length ? (
                  showSaveTemplateForm ? (
                    <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/70 p-3">
                      <div className="text-[13px] font-medium text-neutral-900">
                        Save current meal as template
                      </div>
                      <Input
                        value={newTemplateName}
                        onChange={(event) => setNewTemplateName(event.target.value)}
                        placeholder={`${activeMeal.name} template`}
                        className="h-9 rounded-sm border-neutral-200  shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
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
                  ) : (
                    <SecondaryActionButton
                      label={`Save "${activeMeal.name}" as template`}
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
                        <TemplateLibraryCard
                          key={template.id}
                          template={template}
                          onApply={() => addTemplateToMeal(template)}
                          onDelete={() =>
                            setSavedTemplates((currentTemplates) =>
                              currentTemplates.filter(
                                (currentTemplate) => currentTemplate.id !== template.id
                              )
                            )
                          }
                        />
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

        <div className="space-y-4 xl:min-w-0 xl:flex-1 xl:px-4 xl:pt-4">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Calories",
                value: `${planTotals.cal}`,
                icon: <Flame className="size-4" />,
                tone: {
                  container:
                    "border-orange-300/75 bg-linear-to-br from-orange-100 via-orange-50/65 to-white",
                  badge: "border-orange-300/75 bg-orange-100",
                  icon: "text-orange-700",
                },
              },
              {
                label: "Protein",
                value: `${planTotals.p.toFixed(0)}g`,
                icon: <Drumstick className="size-4" />,
                tone: {
                  container:
                    "border-emerald-200/65 bg-linear-to-br from-emerald-50/95 via-emerald-50/40 to-white",
                  badge: "border-emerald-200/65 bg-emerald-50/80",
                  icon: "text-emerald-600",
                },
              },
              {
                label: "Carbs",
                value: `${planTotals.c.toFixed(0)}g`,
                icon: <Wheat className="size-4" />,
                tone: {
                  container:
                    "border-sky-200/65 bg-linear-to-br from-sky-50/95 via-sky-50/40 to-white",
                  badge: "border-sky-200/65 bg-sky-50/80",
                  icon: "text-sky-600",
                },
              },
              {
                label: "Fat",
                value: `${planTotals.f.toFixed(0)}g`,
                icon: <Droplets className="size-4" />,
                tone: {
                  container:
                    "border-yellow-300/75 bg-linear-to-br from-yellow-100 via-amber-50/70 to-white",
                  badge: "border-yellow-300/75 bg-yellow-100",
                  icon: "text-amber-700",
                },
              },
            ].map((item) => (
              <BuilderMetricCard
                key={item.label}
                label={item.label}
                value={item.value}
                icon={item.icon}
                tone={item.tone}
              />
            ))}
          </div>

          <Card className="overflow-hidden rounded-xl border-neutral-200 bg-neutral-50 shadow-none">
            <div className="border-b border-neutral-200 bg-neutral-50 px-3 py-2.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {meals.map((meal) => (
                    <button
                      key={meal.id}
                      type="button"
                      onClick={() => setActiveMealId(meal.id)}
                      onDoubleClick={() => startEditingMealName(meal)}
                      onDragOver={(event) => handleMealTabDragOver(event, meal.id)}
                      onDrop={(event) => handleMealTabDrop(event, meal.id)}
                      className={cn(
                        "group relative isolate inline-flex min-w-[6.5rem] items-center justify-center gap-2 overflow-visible rounded-md border px-3 py-1.5 text-[13px] transition-colors",
                        dragOverMealTabId === meal.id && draggedMealId !== meal.id
                          ? "border-brand-300 ring-1 ring-brand-200"
                          : null,
                        editingMealId === meal.id
                          ? "border-brand-200 bg-brand-50/60 text-brand-700"
                          : meal.id === activeMealId
                            ? "border-brand-200 bg-brand-50/60 font-medium text-brand-700"
                            : "border-neutral-200 bg-neutral-100 text-neutral-500 hover:border-neutral-200 hover:text-neutral-800"
                      )}
                    >
                      {editingMealId !== meal.id ? (
                        <span className="pointer-events-none absolute inset-0 z-[1] rounded-md bg-neutral-50/90 opacity-0 transition-opacity group-hover:opacity-100" />
                      ) : null}
                      <span
                        draggable={editingMealId !== meal.id}
                        onDragStart={(event) => handleMealTabDragStart(event, meal.id)}
                        onDragEnd={handleMealTabDragEnd}
                        onClick={(event) => {
                          event.stopPropagation()
                        }}
                        className={cn(
                          "absolute top-1/2 -left-1 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-md border border-neutral-200/60 bg-neutral-100/85 text-muted-foreground shadow-none transition-[opacity,colors] hover:border-neutral-300/80 hover:bg-neutral-200/60 hover:text-foreground",
                          editingMealId === meal.id
                            ? "pointer-events-none opacity-0"
                            : "cursor-grab opacity-0 group-hover:opacity-100 active:cursor-grabbing"
                        )}
                        title="Drag to reorder meal"
                      >
                        <GripVertical className="size-3.5" />
                      </span>
                      <span
                        onClick={(event) => {
                          event.stopPropagation()
                          startEditingMealName(meal)
                        }}
                        className={cn(
                          "absolute top-1/2 left-5 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-md border border-neutral-200/60 bg-neutral-100/85 text-muted-foreground shadow-none transition-[opacity,colors] hover:border-neutral-300/80 hover:bg-neutral-200/60 hover:text-foreground",
                          editingMealId === meal.id
                            ? "pointer-events-none opacity-0"
                            : "opacity-0 group-hover:opacity-100"
                        )}
                      >
                        <Pencil className="size-3" />
                      </span>
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
                          className="h-6 min-w-[5.5rem] border-0 bg-transparent px-0 text-[13px] font-medium shadow-none focus-visible:ring-0"
                        />
                      ) : (
                        meal.name
                      )}
                      {editingMealId !== meal.id && meals.length > 1 ? (
                        <CoachWiseConfirmationDialog
                          title="Delete this meal?"
                          description={`${meal.name} will be removed from this meal plan. This action can't be undone.`}
                          confirmLabel="Delete meal"
                          variant="destructive"
                          onConfirm={() => removeMeal(meal.id)}
                          trigger={
                            <span
                              onClick={(event) => {
                                event.stopPropagation()
                              }}
                              className="absolute top-1/2 right-1 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-md border border-rose-200/70 bg-rose-50/70 text-rose-500 shadow-none transition-[opacity,colors] opacity-0 group-hover:opacity-100 hover:border-rose-300/80 hover:bg-rose-100/70 hover:text-rose-600"
                            >
                              <Trash2 className="size-3.5" />
                            </span>
                          }
                        />
                      ) : null}
                    </button>
                  ))}
                  <SecondaryActionButton
                    label="Add meal"
                    icon={Plus}
                    onClick={addMeal}
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
              className={cn(
                "space-y-4 bg-neutral-50 p-4 transition-colors",
                dragOverMealId === activeMeal?.id ? "bg-brand-50/30" : ""
              )}
              onDragOver={(event) => {
                event.preventDefault()
                setDragOverMealId(activeMeal?.id ?? null)
              }}
              onDragLeave={() => setDragOverMealId(null)}
              onDrop={(event) => {
                event.preventDefault()
                if (dragFoodPayload && activeMeal) {
                  addFoodToMeal(
                    dragFoodPayload.foodId,
                    activeMeal.id,
                    dragFoodPayload.qty
                  )
                }
                setDragFoodPayload(null)
                setDragOverMealId(null)
              }}
            >
              {dragFoodPayload ? (
                <div className="rounded-xl border border-dashed border-brand-300 bg-brand-50 px-4 py-3 text-[13px] text-brand-700">
                  Drop the selected food into this meal.
                </div>
              ) : null}

              {activeMeal?.items.length ? (
                <div className="space-y-2">
                  {activeMeal.items.map((item) => (
                    <MealItemRow
                      key={item.id}
                      item={item}
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
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-10 text-center">
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl border border-neutral-200  text-neutral-400">
                    <ChefHat className="size-5" />
                  </div>
                  <div className="text-[15px] font-medium text-neutral-900">
                    This meal is empty
                  </div>
                  <div className="mt-1 text-[13px] text-neutral-500">
                    Search foods on the left, apply a saved template, or drag a
                    food directly into this area.
                  </div>
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
                  const totals = getMealTotals(meal)

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
                          {meal.items.length} items · {totals.cal} kcal
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
