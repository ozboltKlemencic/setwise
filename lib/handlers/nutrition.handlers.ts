export type ClientNutritionTab = "meal-plans" | "nutrition-logger"

export function resolveClientNutritionTab(
  value?: string
): ClientNutritionTab {
  return value === "nutrition-logger" ? "nutrition-logger" : "meal-plans"
}

export function getClientNutritionHref(
  clientBasePath: string,
  tab: ClientNutritionTab = "meal-plans"
) {
  if (tab === "nutrition-logger") {
    return `${clientBasePath}/nutrition?nutritionTab=nutrition-logger`
  }

  return `${clientBasePath}/nutrition`
}

export function getClientNutritionMealPlansHref(clientBasePath: string) {
  return getClientNutritionHref(clientBasePath, "meal-plans")
}

export function getClientNutritionMealLoggerHref(clientBasePath: string) {
  return getClientNutritionHref(clientBasePath, "nutrition-logger")
}

export function getClientNutritionMealPlanDetailHref(
  clientBasePath: string,
  mealPlanId: string
) {
  return `${getClientNutritionMealPlansHref(clientBasePath)}?nutritionTab=meal-plans&mealPlanId=${mealPlanId}`
}

export function getClientNutritionMealPlanEditHref(
  clientBasePath: string,
  mealPlanId: string
) {
  return `${clientBasePath}/nutrition/edit/${mealPlanId}`
}

export function isClientNutritionMealPlanEditPath(pathname: string) {
  return /^\/beta-coach-wise\/clients\/[^/]+\/nutrition\/edit\/[^/?#]+$/.test(
    pathname
  )
}
