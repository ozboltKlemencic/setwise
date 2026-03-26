import { redirect } from "next/navigation"
import {
  ClientNutritionLoggerView,
  ClientNutritionMealPlansView,
} from "@/components/coachWise/clients/nutrition/client-nutrition-panel"
import { routing } from "@/i18n/routing"

import {
  getSingleSearchParam,
  resolveClientDetailContext,
  type ClientDetailPageProps,
} from "@/lib/handlers/client-detail.handlers"
import {
  getNutritionPlanDetailHref,
  resolveClientNutritionTab,
} from "@/lib/handlers/nutrition.handlers"

type NutritionSearchParams = {
  mealPlanId?: string | string[]
  nutritionTab?: string | string[]
}

export default async function Page({
  params,
  searchParams,
}: ClientDetailPageProps<NutritionSearchParams>) {
  const { locale, client, clientBasePath } = await resolveClientDetailContext(params)
  const resolvedSearchParams = await searchParams
  const mealPlanId = getSingleSearchParam(resolvedSearchParams.mealPlanId)
  const resolvedNutritionTab = resolveClientNutritionTab(
    getSingleSearchParam(resolvedSearchParams.nutritionTab)
  )

  if (mealPlanId) {
    const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`

    redirect(
      `${localePrefix}${getNutritionPlanDetailHref(
        mealPlanId,
        `${clientBasePath}/nutrition`
      )}`
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
