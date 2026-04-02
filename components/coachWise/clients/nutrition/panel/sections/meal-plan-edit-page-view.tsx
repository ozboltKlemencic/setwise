"use client"

import * as React from "react"

import { nutritionBuilderClientOptions } from "@/components/coachWise/clients/nutrition/nutrition-builder-client-options"
import { SharedMacroPlanBuilderPageView, SharedMealPlanBuilderEditPageView } from "@/components/coachWise/clients/nutrition/panel/sections/shared-builder-views"
import { buildMealPlanBuilderSnapshotFromSections } from "@/components/coachWise/clients/nutrition/meal-plan-builder-data"
import { useNutritionMealPlanWorkspace } from "@/hooks/nutrition"
import type { MealPlanEditPageViewProps } from "@/types"

function MealPlanEditPageViewComponent({
  mealPlanId,
  phase,
  backHref,
}: MealPlanEditPageViewProps) {
  const { hasLoadedStoredMealPlans, mealPlan, storedMealPlan, sections } =
    useNutritionMealPlanWorkspace({
      mealPlanId,
      phase,
      pathHint: backHref,
    })

  if (!mealPlan && !hasLoadedStoredMealPlans) return null
  if (!mealPlan) return <div className="px-2 pt-2 text-sm text-neutral-500">Meal plan not found.</div>

  if (storedMealPlan?.macroBuilderSnapshot) {
    return (
      <SharedMacroPlanBuilderPageView
        backHref={backHref}
        mealPlanId={mealPlan.id}
        initialSnapshot={storedMealPlan.macroBuilderSnapshot}
        createdAt={storedMealPlan.createdAt}
        clientOptions={nutritionBuilderClientOptions}
        initialAssignedClientIds={storedMealPlan.assignedClientIds}
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
      clientOptions={nutritionBuilderClientOptions}
      initialAssignedClientIds={storedMealPlan?.assignedClientIds}
    />
  )
}

export const MealPlanEditPageView = React.memo(MealPlanEditPageViewComponent)
