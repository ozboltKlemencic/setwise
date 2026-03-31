import { MealPlanBuilderPageView } from "@/components/coachWise/clients/nutrition/meal-plan-builder"
import { createDefaultMealPlanBuilderSnapshot } from "@/components/coachWise/clients/nutrition/meal-plan-builder-data"
import { routing } from "@/i18n/routing"
import {
  getSingleSearchParam,
  type ClientDetailSearchParams,
} from "@/lib/handlers/client-detail.handlers"
import { resolveNutritionEditorBackHref } from "@/lib/handlers/nutrition.handlers"

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<ClientDetailSearchParams>
}

export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`
  const backHref = resolveNutritionEditorBackHref(
    getSingleSearchParam(resolvedSearchParams.backTo),
    `${localePrefix}/beta-coach-wise/nutrition`
  )
  const parseGoalValue = (value?: string | string[]) => {
    const nextValue = Number.parseInt(getSingleSearchParam(value) ?? "", 10)
    return Number.isFinite(nextValue) && nextValue > 0 ? nextValue : undefined
  }
  const initialSnapshot = createDefaultMealPlanBuilderSnapshot(undefined, {
    calories: parseGoalValue(resolvedSearchParams.goalCalories),
    protein: parseGoalValue(resolvedSearchParams.goalProtein),
    carbs: parseGoalValue(resolvedSearchParams.goalCarbs),
    fat: parseGoalValue(resolvedSearchParams.goalFat),
  })

  return (
    <section className="min-w-0 bg-neutral-50 p-0 m-0">
      <MealPlanBuilderPageView
        backHref={backHref}
        initialSnapshot={initialSnapshot}
      />
    </section>
  )
}
