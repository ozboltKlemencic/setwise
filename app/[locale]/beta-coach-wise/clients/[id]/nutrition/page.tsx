import {
  ClientNutritionPanel,
  MealPlanDetailView,
} from "@/components/coachWise/clients/client-nutrition-panel"

import {
  getSingleSearchParam,
  resolveClientDetailContext,
  type ClientDetailPageProps,
} from "../_lib/client-detail-page"

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
  const activeNutritionTab = getSingleSearchParam(
    resolvedSearchParams.nutritionTab
  )
  const resolvedNutritionTab =
    activeNutritionTab === "nutrition-logger"
      ? "nutrition-logger"
      : "meal-plans"

  if (mealPlanId) {
    return (
      <section className="min-w-0 bg-neutral-50">
        <MealPlanDetailView mealPlanId={mealPlanId} phase={client.phase} />
      </section>
    )
  }

  return (
    <section className="min-w-0 bg-neutral-50">
      <ClientNutritionPanel
        phase={client.phase}
        initialSubTab={resolvedNutritionTab}
      />
    </section>
  )
}
