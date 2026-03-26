export type ClientNutritionTab = "nutrition" | "nutrition-logger"

export function resolveClientNutritionTab(
  value?: string
): ClientNutritionTab {
  return value === "nutrition-logger" ? "nutrition-logger" : "nutrition"
}

export function getClientNutritionHref(
  clientBasePath: string,
  tab: ClientNutritionTab = "nutrition"
) {
  if (tab === "nutrition-logger") {
    return `${clientBasePath}/nutrition?nutritionTab=nutrition-logger`
  }

  return `${clientBasePath}/nutrition`
}

export function getClientNutritionMealPlansHref(clientBasePath: string) {
  return getClientNutritionHref(clientBasePath, "nutrition")
}

export function getClientNutritionMealLoggerHref(clientBasePath: string) {
  return getClientNutritionHref(clientBasePath, "nutrition-logger")
}

export function getClientNutritionMealPlanDetailHref(
  clientBasePath: string,
  mealPlanId: string
) {
  return `${getClientNutritionMealPlansHref(clientBasePath)}?nutritionTab=nutrition&mealPlanId=${mealPlanId}`
}

export function getClientNutritionMealPlanEditHref(
  clientBasePath: string,
  mealPlanId: string
) {
  return getNutritionPlanEditorHref(
    mealPlanId,
    `${clientBasePath}/nutrition`
  )
}

export function getNutritionPlanEditorHref(
  mealPlanId: string,
  backTo?: string
) {
  const editorHref = `/beta-coach-wise/nutrition/edit/${mealPlanId}`

  if (!backTo) {
    return editorHref
  }

  return `${editorHref}?backTo=${encodeURIComponent(backTo)}`
}

export function resolveNutritionEditorBackHref(
  backTo: string | undefined,
  fallbackHref = "/beta-coach-wise/nutrition"
) {
  if (!backTo || !backTo.startsWith("/")) {
    return fallbackHref
  }

  return backTo
}

export function isClientNutritionMealPlanEditPath(pathname: string) {
  return /^\/beta-coach-wise\/clients\/[^/]+\/nutrition\/edit\/[^/?#]+$/.test(
    pathname
  )
}
