export type StoredNutritionMacroSegment = {
  macro: "protein" | "carbs" | "fats"
  value: number
  fill: string
}

export type StoredNutritionMealPlanOption = {
  id: string
  label: string
  title: string
  calories: number
  carbs: number
  protein: number
  fats: number
  description: string
  image: string
}

export type StoredNutritionMealPlanSection = {
  id: string
  label: string
  options: StoredNutritionMealPlanOption[]
}

export type StoredNutritionMealPlan = {
  id: string
  title: string
  subtitle: string
  type: string
  calories: number
  macros: string
  schedule: string
  segments: StoredNutritionMacroSegment[]
  sections: StoredNutritionMealPlanSection[]
  createdAt: string
}

const NUTRITION_MEAL_PLAN_STORAGE_KEY_PREFIX =
  "coachwise:nutrition:meal-plans:"

export const NUTRITION_MEAL_PLANS_UPDATED_EVENT =
  "coachwise:nutrition-meal-plans-updated"

export function resolveNutritionClientIdFromPath(path?: string | null) {
  if (!path) {
    return null
  }

  const clientMatch = path.match(/\/clients\/([^/?#]+)\/nutrition(?:\/|$|\?)/)
  return clientMatch?.[1] ?? null
}

function getNutritionMealPlanStorageKey(clientId: string) {
  return `${NUTRITION_MEAL_PLAN_STORAGE_KEY_PREFIX}${clientId}`
}

function isStoredNutritionMealPlan(value: unknown): value is StoredNutritionMealPlan {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as Partial<StoredNutritionMealPlan>
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.subtitle === "string" &&
    typeof candidate.type === "string" &&
    typeof candidate.calories === "number" &&
    typeof candidate.macros === "string" &&
    typeof candidate.schedule === "string" &&
    Array.isArray(candidate.segments) &&
    Array.isArray(candidate.sections)
  )
}

function dispatchNutritionMealPlansUpdated(clientId: string) {
  if (typeof window === "undefined") {
    return
  }

  window.dispatchEvent(
    new CustomEvent(NUTRITION_MEAL_PLANS_UPDATED_EVENT, {
      detail: { clientId },
    })
  )
}

export function readStoredNutritionMealPlans(clientId: string) {
  if (typeof window === "undefined") {
    return [] as StoredNutritionMealPlan[]
  }

  try {
    const rawValue = window.localStorage.getItem(
      getNutritionMealPlanStorageKey(clientId)
    )

    if (!rawValue) {
      return []
    }

    const parsedValue = JSON.parse(rawValue)

    if (!Array.isArray(parsedValue)) {
      return []
    }

    return parsedValue.filter(isStoredNutritionMealPlan)
  } catch {
    return []
  }
}

export function writeStoredNutritionMealPlans(
  clientId: string,
  mealPlans: StoredNutritionMealPlan[]
) {
  if (typeof window === "undefined") {
    return
  }

  const storageKey = getNutritionMealPlanStorageKey(clientId)

  if (!mealPlans.length) {
    window.localStorage.removeItem(storageKey)
    dispatchNutritionMealPlansUpdated(clientId)
    return
  }

  window.localStorage.setItem(storageKey, JSON.stringify(mealPlans))
  dispatchNutritionMealPlansUpdated(clientId)
}

export function upsertStoredNutritionMealPlan(
  clientId: string,
  mealPlan: StoredNutritionMealPlan
) {
  const currentMealPlans = readStoredNutritionMealPlans(clientId)
  const nextMealPlans = [
    mealPlan,
    ...currentMealPlans.filter((currentMealPlan) => currentMealPlan.id !== mealPlan.id),
  ]

  writeStoredNutritionMealPlans(clientId, nextMealPlans)
}

export function removeStoredNutritionMealPlan(clientId: string, mealPlanId: string) {
  const currentMealPlans = readStoredNutritionMealPlans(clientId)
  const nextMealPlans = currentMealPlans.filter(
    (mealPlan) => mealPlan.id !== mealPlanId
  )

  if (nextMealPlans.length === currentMealPlans.length) {
    return
  }

  writeStoredNutritionMealPlans(clientId, nextMealPlans)
}
