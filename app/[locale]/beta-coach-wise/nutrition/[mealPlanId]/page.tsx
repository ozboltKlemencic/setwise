import { notFound } from "next/navigation"

import { MealPlanDetailView } from "@/components/coachWise/clients/nutrition/client-nutrition-panel"
import { routing } from "@/i18n/routing"
import {
  getSingleSearchParam,
  type ClientDetailSearchParams,
} from "@/lib/handlers/client-detail.handlers"
import {
  resolveNutritionEditorBackHref,
  resolveNutritionPlanIdFromRouteId,
} from "@/lib/handlers/nutrition.handlers"

type Props = {
  params: Promise<{ locale: string; mealPlanId: string }>
  searchParams: Promise<ClientDetailSearchParams>
}

export default async function Page({ params, searchParams }: Props) {
  const { locale, mealPlanId } = await params
  const resolvedSearchParams = await searchParams
  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`
  const backHref = resolveNutritionEditorBackHref(
    getSingleSearchParam(resolvedSearchParams.backTo),
    `${localePrefix}/beta-coach-wise/nutrition`
  )
  const resolvedMealPlanId = resolveNutritionPlanIdFromRouteId(mealPlanId)

  if (!resolvedMealPlanId) {
    notFound()
  }

  return (
    <section className="min-w-0 bg-neutral-50">
      <MealPlanDetailView
        mealPlanId={resolvedMealPlanId}
        backHref={backHref}
      />
    </section>
  )
}
