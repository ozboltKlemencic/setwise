export type ClientNutritionTab = "nutrition" | "nutrition-logger"

const nutritionPlanRouteIdMap = {
  "training-day": "454354j534543",
  "rest-day": "6384gk2209482",
} as const

const nutritionPlanRouteIdEntries = Object.entries(nutritionPlanRouteIdMap)

function resolveNutritionPlanRouteIdValue(mealPlanId: string) {
  const matchedRouteId =
    nutritionPlanRouteIdMap[
      mealPlanId as keyof typeof nutritionPlanRouteIdMap
    ]

  return matchedRouteId ?? mealPlanId
}

export function resolveNutritionPlanIdFromRouteId(routeId: string) {
  if (routeId in nutritionPlanRouteIdMap) {
    return routeId as keyof typeof nutritionPlanRouteIdMap
  }

  const matchedEntry = nutritionPlanRouteIdEntries.find(
    ([, mappedRouteId]) => mappedRouteId === routeId
  )

  return matchedEntry?.[0] ?? routeId
}

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
  return getNutritionPlanDetailHref(
    mealPlanId,
    `${clientBasePath}/nutrition`
  )
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
  const editorHref = `/beta-coach-wise/nutrition/edit/${resolveNutritionPlanRouteIdValue(mealPlanId)}`

  if (!backTo) {
    return editorHref
  }

  return `${editorHref}?backTo=${encodeURIComponent(backTo)}`
}

export function getNutritionPlanDetailHref(
  mealPlanId: string,
  backTo?: string
) {
  const detailHref = `/beta-coach-wise/nutrition/${resolveNutritionPlanRouteIdValue(mealPlanId)}`

  if (!backTo) {
    return detailHref
  }

  return `${detailHref}?backTo=${encodeURIComponent(backTo)}`
}

export function getNutritionCreateMealPlanHref(backTo?: string) {
  const createHref = "/beta-coach-wise/nutrition/create/meal-plan"

  if (!backTo) {
    return createHref
  }

  return `${createHref}?backTo=${encodeURIComponent(backTo)}`
}

export function getNutritionCreateMacroPlanHref(backTo?: string) {
  const createHref = "/beta-coach-wise/nutrition/create/macro-plan-iifym"

  if (!backTo) {
    return createHref
  }

  return `${createHref}?backTo=${encodeURIComponent(backTo)}`
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
