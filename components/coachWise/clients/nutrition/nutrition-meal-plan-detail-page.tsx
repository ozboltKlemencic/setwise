"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  Pencil,
} from "lucide-react"

import {
  calcBuilderNutrition,
  formatFoodUnitLabel,
  getBuilderMealTotals,
  getBuilderPlanTotals,
} from "@/components/coachWise/clients/nutrition/meal-plan-builder-data"
import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  type StoredNutritionMacroPlanBuilderSnapshot,
  type StoredNutritionMealPlanBuilderSnapshot,
} from "@/lib/handlers/nutrition-plan-storage"

type NutritionMealPlanDetailSourcePlan = {
  id: string
  title: string
  type?: string
  calories: number
  macros: string
  segments?: Array<{
    macro: "protein" | "carbs" | "fats"
    value: number
  }>
}

type NutritionMealPlanDetailSourceOption = {
  id: string
  label: string
  title: string
  calories: number
  carbs: number
  protein: number
  fats: number
  description: string
}

type NutritionMealPlanDetailSourceSection = {
  id: string
  label: string
  options: NutritionMealPlanDetailSourceOption[]
}

type NutritionMealPlanDetailMetric = {
  current: number
  goal?: number
}

type NutritionMealPlanDetailIngredient = {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  badgeLabel?: string
  description?: string
}

type NutritionMealPlanDetailMeal = {
  id: string
  label: string
  title: string
  calories: number
  protein: number
  carbs: number
  fats: number
  ingredients: NutritionMealPlanDetailIngredient[]
}

type NutritionMealPlanDetailModel = {
  planType: "meal" | "macro"
  metrics: {
    calories: NutritionMealPlanDetailMetric
    protein: NutritionMealPlanDetailMetric
    carbs: NutritionMealPlanDetailMetric
    fat: NutritionMealPlanDetailMetric
  }
  meals: NutritionMealPlanDetailMeal[]
  macroDistribution: Array<{
    key: "protein" | "carbs" | "fat"
    label: string
    value: number
    segmentClassName: string
  }>
}

function parsePlanMacroValues(macros: string) {
  const match = macros.match(/(\d+(?:\.\d+)?)P\s*\/\s*(\d+(?:\.\d+)?)C\s*\/\s*(\d+(?:\.\d+)?)F/i)

  if (!match) {
    return {
      protein: 0,
      carbs: 0,
      fats: 0,
    }
  }

  return {
    protein: Number.parseFloat(match[1] ?? "0"),
    carbs: Number.parseFloat(match[2] ?? "0"),
    fats: Number.parseFloat(match[3] ?? "0"),
  }
}

function formatNutritionNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

function buildMealsFromBuilderSnapshot(
  builderSnapshot: StoredNutritionMealPlanBuilderSnapshot
): NutritionMealPlanDetailMeal[] {
  const foodsById = new Map(builderSnapshot.foods.map((food) => [food.id, food]))

  return builderSnapshot.meals.map((meal) => {
    const ingredients = meal.items
      .map((item) => {
        const food = foodsById.get(item.foodId)

        if (!food) {
          return null
        }

        const nutrition = calcBuilderNutrition(builderSnapshot.foods, item.foodId, item.qty)

        return {
          id: `${meal.id}-${item.id}`,
          name: food.name,
          calories: Math.round(nutrition.cal),
          protein: nutrition.p,
          carbs: nutrition.c,
          fats: nutrition.f,
          badgeLabel: `${formatNutritionNumber(item.qty)} ${formatFoodUnitLabel(food.unit)}`,
        } satisfies NutritionMealPlanDetailIngredient
      })
      .filter(Boolean) as NutritionMealPlanDetailIngredient[]

    const totals = getBuilderMealTotals(builderSnapshot.foods, meal)

    return {
      id: String(meal.id),
      label: meal.name,
      title:
        ingredients.length > 0
          ? ingredients.map((ingredient) => ingredient.name).join(" + ")
          : meal.name,
      calories: Math.round(totals.cal),
      protein: totals.p,
      carbs: totals.c,
      fats: totals.f,
      ingredients,
    }
  })
}

function buildMealsFromSections(
  sections: NutritionMealPlanDetailSourceSection[]
): NutritionMealPlanDetailMeal[] {
  return sections.map((section) => {
    const primaryOption = section.options[0]

    return {
      id: section.id,
      label: section.label,
      title: primaryOption?.title ?? section.label,
      calories: primaryOption?.calories ?? 0,
      protein: primaryOption?.protein ?? 0,
      carbs: primaryOption?.carbs ?? 0,
      fats: primaryOption?.fats ?? 0,
      ingredients: section.options.map((option) => ({
        id: option.id,
        name: option.title,
        calories: option.calories,
        protein: option.protein,
        carbs: option.carbs,
        fats: option.fats,
        badgeLabel: option.label,
        description: option.description,
      })),
    }
  })
}

export function buildNutritionMealPlanDetailModel({
  mealPlan,
  sections,
  builderSnapshot,
  macroBuilderSnapshot,
}: {
  mealPlan: NutritionMealPlanDetailSourcePlan
  sections: NutritionMealPlanDetailSourceSection[]
  builderSnapshot?: StoredNutritionMealPlanBuilderSnapshot
  macroBuilderSnapshot?: StoredNutritionMacroPlanBuilderSnapshot
}): NutritionMealPlanDetailModel {
  const fallbackMacros = parsePlanMacroValues(mealPlan.macros)
  const isMacroPlan = mealPlan.type?.toLowerCase().includes("macro") ?? false
  const meals = builderSnapshot
    ? buildMealsFromBuilderSnapshot(builderSnapshot)
    : buildMealsFromSections(sections)

  const currentTotals = builderSnapshot
    ? getBuilderPlanTotals(builderSnapshot.foods, builderSnapshot.meals)
    : {
      cal: mealPlan.calories,
      p: fallbackMacros.protein,
      c: fallbackMacros.carbs,
      f: fallbackMacros.fats,
    }

  const goalSettings = builderSnapshot?.mealPlanGoals
  const macroDistribution = macroBuilderSnapshot
    ? [
      {
        key: "protein" as const,
        label: "P",
        value: macroBuilderSnapshot.macros.p,
        segmentClassName: "bg-emerald-600",
      },
      {
        key: "carbs" as const,
        label: "C",
        value: macroBuilderSnapshot.macros.c,
        segmentClassName: "bg-sky-600",
      },
      {
        key: "fat" as const,
        label: "F",
        value: macroBuilderSnapshot.macros.f,
        segmentClassName: "bg-orange-500",
      },
    ]
    : [
      {
        key: "protein" as const,
        label: "P",
        value:
          mealPlan.segments?.find((segment) => segment.macro === "protein")?.value ??
          0,
        segmentClassName: "bg-emerald-600",
      },
      {
        key: "carbs" as const,
        label: "C",
        value:
          mealPlan.segments?.find((segment) => segment.macro === "carbs")?.value ??
          0,
        segmentClassName: "bg-sky-600",
      },
      {
        key: "fat" as const,
        label: "F",
        value:
          mealPlan.segments?.find((segment) => segment.macro === "fats")?.value ??
          0,
        segmentClassName: "bg-orange-500",
      },
    ]

  return {
    planType: isMacroPlan ? "macro" : "meal",
    metrics: {
      calories: {
        current: currentTotals.cal,
        goal: goalSettings?.calories.enabled ? goalSettings.calories.value : undefined,
      },
      protein: {
        current: currentTotals.p,
        goal: goalSettings?.protein.enabled ? goalSettings.protein.value : undefined,
      },
      carbs: {
        current: currentTotals.c,
        goal: goalSettings?.carbs.enabled ? goalSettings.carbs.value : undefined,
      },
      fat: {
        current: currentTotals.f,
        goal: goalSettings?.fat.enabled ? goalSettings.fat.value : undefined,
      },
    },
    meals,
    macroDistribution,
  }
}

function NutritionMealPlanDetailNav({
  title,
  backHref,
  editHref,
}: {
  title: string
  backHref: string
  editHref: string
}) {
  const router = useRouter()

  return (
    <div className="sticky top-(--header-height) z-10 bg-neutral-50">
      <div className="flex h-12 items-center justify-between gap-x-3 border-b border-neutral-200 px-2">
        <div className="flex h-full min-w-0 items-center gap-x-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => router.push(backHref)}
            className="size-7 self-center rounded-sm text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Back</span>
          </Button>

          <div className="flex h-full min-w-0 items-center">
            <div className="inline-flex h-8 max-w-full items-center text-left text-[15px] leading-none font-semibold text-neutral-950">
              <span className="truncate">{title}</span>
            </div>
          </div>
        </div>

        <PrimaryActionButton
          label="Edit Plan"
          icon={Pencil}
          href={editHref}
          className="h-8 self-center leading-none"
        />
      </div>
    </div>
  )
}

function NutritionDetailMetricCard({
  label,
  unit,
  current,
  goal,
  progressClassName,
}: {
  label: string
  unit: string
  current: number
  goal?: number
  progressClassName: string
}) {
  const roundedCurrent = Math.round(current)
  const hasGoal = typeof goal === "number" && goal > 0
  const difference = hasGoal ? roundedCurrent - goal : null
  const isOverGoal = Boolean(hasGoal && difference !== null && difference > 0)
  const progressWidth = hasGoal
    ? Math.min(100, (roundedCurrent / goal) * 100)
    : 100

  return (
    <div
      className={cn(
        "relative min-h-[86px] px-4 py-3",
        isOverGoal ? "bg-rose-50/35" : "bg-white"
      )}
    >
      <div className="flex items-end gap-1.5">
        <div
          className={cn(
            "text-[17px] leading-none font-semibold",
            isOverGoal ? "text-rose-600" : "text-neutral-950"
          )}
        >
          {roundedCurrent}
        </div>
        <div className="text-[13px] leading-none font-medium text-neutral-300">
          {hasGoal ? `/ ${goal}${unit}` : unit}
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

      <div className="absolute right-0 bottom-0 left-0 h-[3px]">
        <div
          className={cn(
            "h-full transition-all duration-500",
            isOverGoal ? "bg-rose-500" : progressClassName
          )}
          style={{ width: `${progressWidth}%` }}
        />
      </div>
    </div>
  )
}

function NutritionMealDetailCard({
  meal,
}: {
  meal: NutritionMealPlanDetailMeal
}) {
  return (
    <Card className="overflow-hidden gap-0 rounded-xl border-neutral-200 bg-transparent py-0 shadow-none">
      <div className="flex w-full items-center justify-between gap-4 border-b border-neutral-200 bg-neutral-100/70 px-4 py-3 text-left">
        <div className="flex min-w-0 items-center gap-3">
          <span className="truncate text-[15px] font-semibold text-neutral-950">
            {meal.label}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 text-[12px] text-neutral-500 md:flex">
            <span className="inline-flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              {Math.round(meal.protein)}g P
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-sky-500" />
              {Math.round(meal.carbs)}g C
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-amber-500" />
              {Math.round(meal.fats)}g F
            </span>
            <span>{Math.round(meal.calories)} kcal</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 px-4 py-4">
        {meal.ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className={cn(
              "flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white/60 px-4 py-4"
            )}
          >
            <div className="min-w-0 space-y-1">
              <div className="truncate text-[14px] font-semibold text-neutral-900">
                {ingredient.name}
              </div>
              <div className="flex flex-wrap items-center gap-x-1 text-[12px] text-neutral-500">
                <span>{ingredient.calories} kcal</span>
                <span className="px-1.5 text-neutral-300">-</span>
                <span className="text-emerald-500/80">
                  P{formatNutritionNumber(ingredient.protein)}g
                </span>
                <span className="px-1.5 text-neutral-300">-</span>
                <span className="text-sky-500/80">
                  C{formatNutritionNumber(ingredient.carbs)}g
                </span>
                <span className="px-1.5 text-neutral-300">-</span>
                <span className="text-amber-500/80">
                  F{formatNutritionNumber(ingredient.fats)}g
                </span>
              </div>
              {ingredient.description ? (
                <div className="text-[12px] leading-5 text-neutral-500">
                  {ingredient.description}
                </div>
              ) : null}
            </div>

            {ingredient.badgeLabel ? (
              <div className="shrink-0 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-[13px] font-semibold text-neutral-900">
                {ingredient.badgeLabel}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  )
}

function NutritionMacroDistributionCard({
  segments,
}: {
  segments: NutritionMealPlanDetailModel["macroDistribution"]
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-neutral-950">
        Macro Distribution
      </h2>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="flex h-10 w-full overflow-hidden rounded-xl">
          {segments.map((segment) => (
            <div
              key={segment.key}
              className={cn(
                "flex min-w-0 items-center justify-center px-3 text-center text-[12px] font-semibold text-white",
                segment.segmentClassName
              )}
              style={{ width: `${segment.value}%` }}
            >
              <span className="truncate">
                {segment.label}: {Math.round(segment.value)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function NutritionMealPlanDetailPage({
  title,
  backHref,
  editHref,
  detail,
}: {
  title: string
  backHref: string
  editHref: string
  detail: NutritionMealPlanDetailModel
}) {
  return (
    <div className="min-w-0 bg-neutral-50">
      <NutritionMealPlanDetailNav
        title={title}
        backHref={backHref}
        editHref={editHref}
      />

      <div className="mx-auto max-w-[1040px] space-y-6 px-4 py-5">
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <div className="grid md:grid-cols-4">
            <div className="border-b border-neutral-200 md:border-r md:border-b-0">
              <NutritionDetailMetricCard
                label="Calories"
                current={detail.metrics.calories.current}
                goal={detail.metrics.calories.goal}
                unit="kcal"
                progressClassName="bg-orange-500"
              />
            </div>
            <div className="border-b border-neutral-200 md:border-r md:border-b-0">
              <NutritionDetailMetricCard
                label="Protein"
                current={detail.metrics.protein.current}
                goal={detail.metrics.protein.goal}
                unit="g"
                progressClassName="bg-emerald-500"
              />
            </div>
            <div className="border-b border-neutral-200 md:border-r md:border-b-0">
              <NutritionDetailMetricCard
                label="Carbs"
                current={detail.metrics.carbs.current}
                goal={detail.metrics.carbs.goal}
                unit="g"
                progressClassName="bg-sky-500"
              />
            </div>
            <NutritionDetailMetricCard
              label="Fat"
              current={detail.metrics.fat.current}
              goal={detail.metrics.fat.goal}
              unit="g"
              progressClassName="bg-amber-500"
            />
          </div>
        </div>

        {detail.planType === "macro" ? (
          <NutritionMacroDistributionCard segments={detail.macroDistribution} />
        ) : (
          <div className="space-y-4">
            <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-neutral-950">
              Scheduled Meals
            </h2>

            <div className="space-y-4">
              {detail.meals.map((meal) => (
                <NutritionMealDetailCard
                  key={meal.id}
                  meal={meal}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
