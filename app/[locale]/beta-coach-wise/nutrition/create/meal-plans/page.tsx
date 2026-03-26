import { redirect } from "next/navigation"

import { routing } from "@/i18n/routing"
import {
  getSingleSearchParam,
  type ClientDetailSearchParams,
} from "@/lib/handlers/client-detail.handlers"
import { getNutritionCreateMealPlanHref } from "@/lib/handlers/nutrition.handlers"

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<ClientDetailSearchParams>
}

export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`
  const backTo = getSingleSearchParam(resolvedSearchParams.backTo)

  redirect(
    `${localePrefix}${getNutritionCreateMealPlanHref(backTo)}`
  )
}
