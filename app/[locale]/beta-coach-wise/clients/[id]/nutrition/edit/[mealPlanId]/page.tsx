import { redirect } from "next/navigation"

import { routing } from "@/i18n/routing"
import { resolveClientDetailContext } from "@/lib/handlers/client-detail.handlers"
import { getNutritionPlanEditorHref } from "@/lib/handlers/nutrition.handlers"

type Props = {
  params: Promise<{ locale: string; id: string; mealPlanId: string }>
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params
  const { clientBasePath } = await resolveClientDetailContext(
    { locale: resolvedParams.locale, id: resolvedParams.id }
  )
  const localePrefix =
    resolvedParams.locale === routing.defaultLocale
      ? ""
      : `/${resolvedParams.locale}`

  redirect(
    `${localePrefix}${getNutritionPlanEditorHref(
      resolvedParams.mealPlanId,
      `${clientBasePath}/nutrition`
    )}`
  )
}
