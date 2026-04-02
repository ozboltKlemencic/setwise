"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { buildNutritionMealPlanDetailModel, NutritionMealPlanDetailPage } from "@/components/coachWise/clients/nutrition/nutrition-meal-plan-detail-page"
import { buildCoachWiseHref } from "@/components/coachWise/sidebar/route-utils"
import { useNutritionMealPlanWorkspace } from "@/hooks/nutrition"
import { getNutritionPlanEditorHref } from "@/lib/handlers/nutrition.handlers"
import type { MealPlanDetailViewProps } from "@/types"

function MealPlanDetailViewComponent({
  mealPlanId,
  phase,
  backHref,
}: MealPlanDetailViewProps) {
  const pathname = usePathname()
  const { hasLoadedStoredMealPlans, mealPlan, storedMealPlan, sections } =
    useNutritionMealPlanWorkspace({
      mealPlanId,
      phase,
      pathHint: backHref ?? pathname,
    })

  const detail = React.useMemo(
    () =>
      mealPlan
        ? buildNutritionMealPlanDetailModel({
            mealPlan,
            sections,
            builderSnapshot: storedMealPlan?.builderSnapshot,
          })
        : null,
    [mealPlan, sections, storedMealPlan?.builderSnapshot]
  )

  if (!mealPlan && !hasLoadedStoredMealPlans) return null
  if (!mealPlan) return <div className="px-2 pt-2 text-sm text-neutral-500">Meal plan not found.</div>
  if (!detail) return null

  const resolvedBackHref = backHref ?? `${pathname}?nutritionTab=nutrition`
  const editHref = buildCoachWiseHref(pathname, getNutritionPlanEditorHref(mealPlan.id, resolvedBackHref))

  return (
    <NutritionMealPlanDetailPage
      title={mealPlan.title}
      backHref={resolvedBackHref}
      editHref={editHref}
      detail={detail}
    />
  )
}

export const MealPlanDetailView = React.memo(MealPlanDetailViewComponent)
