import {
  ClientNutritionLoggerView,
  ClientNutritionMealPlansView,
  MealPlanDetailView,
} from "@/components/coachWise/clients/nutrition/client-nutrition-panel"

import {
  getSingleSearchParam,
  resolveClientDetailContext,
  type ClientDetailPageProps,
} from "@/lib/handlers/client-detail.handlers"
import { resolveClientNutritionTab } from "@/lib/handlers/nutrition.handlers"

type NutritionSearchParams = {
  mealPlanId?: string | string[]
  nutritionTab?: string | string[]
}

export default async function Page({
  params,
  searchParams,
}: ClientDetailPageProps<NutritionSearchParams>) {
  const { client } = await resolveClientDetailContext(params)
  const resolvedSearchParams = await searchParams
  const mealPlanId = getSingleSearchParam(resolvedSearchParams.mealPlanId)
  const resolvedNutritionTab = resolveClientNutritionTab(
    getSingleSearchParam(resolvedSearchParams.nutritionTab)
  )

  if (mealPlanId) {
    return (
      <section className="min-w-0 bg-neutral-50">
        <MealPlanDetailView mealPlanId={mealPlanId} phase={client.phase} />
      </section>
    )
  }

  return (
    <section className="min-w-0 bg-neutral-50">
      {resolvedNutritionTab === "nutrition-logger" ? (
        <ClientNutritionLoggerView phase={client.phase} />
      ) : (
        <ClientNutritionMealPlansView phase={client.phase} />
      )}
    </section>
  )
}
