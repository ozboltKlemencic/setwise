import { redirect } from "next/navigation"
import {
  ClientNutritionMealPlansView,
} from "@/components/coachWise/clients/nutrition/client-nutrition-panel"
import { routing } from "@/i18n/routing"

import {
  getSingleSearchParam,
  resolveClientDetailContext,
  type ClientDetailPageProps,
} from "@/lib/handlers/client-detail.handlers"
import { getNutritionPlanDetailHref } from "@/lib/handlers/nutrition.handlers"

type NutritionSearchParams = {
  mealPlanId?: string | string[]
}

export default async function Page({
  params,
  searchParams,
}: ClientDetailPageProps<NutritionSearchParams>) {
  const { locale, client, clientBasePath } = await resolveClientDetailContext(params)
  const resolvedSearchParams = await searchParams
  const mealPlanId = getSingleSearchParam(resolvedSearchParams.mealPlanId)

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
    <section className="min-w-0 ">
      <ClientNutritionMealPlansView phase={client.phase} />
    </section>
  )
}
