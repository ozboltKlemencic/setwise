import { MealPlanEditPageView } from "@/components/coachWise/clients/nutrition/client-nutrition-panel"

import { resolveClientDetailContext } from "@/lib/handlers/client-detail.handlers"
import { getClientNutritionMealPlansHref } from "@/lib/handlers/nutrition.handlers"

type Props = {
  params: Promise<{ locale: string; id: string; mealPlanId: string }>
}

export default async function Page({ params }: Props) {
  const { locale, id, mealPlanId } = await params
  const { client, clientBasePath } = await resolveClientDetailContext({
    locale,
    id,
  })

  return (
    <section className="min-w-0 bg-neutral-50">
      <MealPlanEditPageView
        mealPlanId={mealPlanId}
        phase={client.phase}
        backHref={getClientNutritionMealPlansHref(clientBasePath)}
      />
    </section>
  )
}
