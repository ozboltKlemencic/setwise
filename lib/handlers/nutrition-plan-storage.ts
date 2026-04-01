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

export type StoredNutritionMealPlanBuilderFoodUnit =
  | "g"
  | "piece"
  | "ml"
  | "slice"

export type StoredNutritionMealPlanBuilderFood = {
  id: number
  name: string
  cal: number
  p: number
  c: number
  f: number
  unit: StoredNutritionMealPlanBuilderFoodUnit
  step: number
  defaultQty: number
}

export type StoredNutritionMealPlanBuilderMealItem = {
  id: number
  foodId: number
  qty: number
}

export type StoredNutritionMealPlanBuilderMeal = {
  id: number
  name: string
  items: StoredNutritionMealPlanBuilderMealItem[]
}

export type StoredNutritionMealPlanGoalMetricSettings = {
  enabled: boolean
  value: number
}

export type StoredNutritionMealPlanGoalSettings = {
  presetId: "cut" | "maintain" | "bulk" | null
  calories: StoredNutritionMealPlanGoalMetricSettings
  protein: StoredNutritionMealPlanGoalMetricSettings
  carbs: StoredNutritionMealPlanGoalMetricSettings
  fat: StoredNutritionMealPlanGoalMetricSettings
}

export type StoredNutritionMealPlanBuilderSnapshot = {
  planName: string
  foods: StoredNutritionMealPlanBuilderFood[]
  meals: StoredNutritionMealPlanBuilderMeal[]
  mealPlanGoals: StoredNutritionMealPlanGoalSettings
}

export type StoredNutritionMacroPlanBuilderSnapshot = {
  planName: string
  calories: number
  macros: {
    p: number
    c: number
    f: number
  }
  presets: Array<{
    id: string
    name: string
    p: number
    c: number
    f: number
  }>
  selectedPresetId: string | null
  lockedMacroKey: "p" | "c" | "f" | null
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
  assignedClientIds?: string[]
  builderSnapshot?: StoredNutritionMealPlanBuilderSnapshot
  macroBuilderSnapshot?: StoredNutritionMacroPlanBuilderSnapshot
}

const NUTRITION_MEAL_PLAN_STORAGE_KEY_PREFIX =
  "coachwise:nutrition:meal-plans:"

export const NUTRITION_MEAL_PLANS_UPDATED_EVENT =
  "coachwise:nutrition-meal-plans-updated"

export const GLOBAL_NUTRITION_MEAL_PLANS_STORAGE_SCOPE = "global-nutrition"

export type StoredNutritionMealPlanEntry = {
  storageScopeId: string
  plan: StoredNutritionMealPlan
}

function readStorageScopeFromPathQuery(path?: string | null) {
  if (!path || !path.includes("?")) {
    return null
  }

  const query = path.split("?")[1] ?? ""
  const searchParams = new URLSearchParams(query)
  const storageScopeId = searchParams.get("storageScope")

  return storageScopeId?.trim() || null
}

export function resolveNutritionClientIdFromPath(path?: string | null) {
  if (!path) {
    return null
  }

  const clientMatch = path.match(/\/clients\/([^/?#]+)\/nutrition(?:\/|$|\?)/)
  return clientMatch?.[1] ?? null
}

export function resolveNutritionMealPlanStorageScopeFromPath(
  path?: string | null
) {
  const storageScopeFromQuery = readStorageScopeFromPathQuery(path)

  if (storageScopeFromQuery) {
    return storageScopeFromQuery
  }

  const clientId = resolveNutritionClientIdFromPath(path)

  if (clientId) {
    return clientId
  }

  if (!path) {
    return null
  }

  if (
    /(?:^|\/)(?:[a-z]{2}\/)?beta-coach-wise\/nutrition(?:\/|$|\?)/i.test(path)
  ) {
    return GLOBAL_NUTRITION_MEAL_PLANS_STORAGE_SCOPE
  }

  return null
}

function getNutritionMealPlanStorageKey(clientId: string) {
  return `${NUTRITION_MEAL_PLAN_STORAGE_KEY_PREFIX}${clientId}`
}

export function listStoredNutritionMealPlanScopes() {
  if (typeof window === "undefined") {
    return [] as string[]
  }

  const scopes = new Set<string>()

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)

    if (!key?.startsWith(NUTRITION_MEAL_PLAN_STORAGE_KEY_PREFIX)) {
      continue
    }

    scopes.add(key.slice(NUTRITION_MEAL_PLAN_STORAGE_KEY_PREFIX.length))
  }

  return Array.from(scopes)
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
    (typeof candidate.assignedClientIds === "undefined" ||
      (Array.isArray(candidate.assignedClientIds) &&
        candidate.assignedClientIds.every(
          (assignedClientId) => typeof assignedClientId === "string"
        ))) &&
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

export function readStoredNutritionMealPlanEntries(
  storageScopeId: string
): StoredNutritionMealPlanEntry[] {
  if (storageScopeId === GLOBAL_NUTRITION_MEAL_PLANS_STORAGE_SCOPE) {
    return listStoredNutritionMealPlanScopes()
      .flatMap((scopeId) =>
        readStoredNutritionMealPlans(scopeId).map((plan) => ({
          storageScopeId: scopeId,
          plan,
        }))
      )
      .sort((left, right) => {
        const leftCreatedAt = left.plan.createdAt ?? ""
        const rightCreatedAt = right.plan.createdAt ?? ""
        return rightCreatedAt.localeCompare(leftCreatedAt)
      })
  }

  const ownEntries = readStoredNutritionMealPlans(storageScopeId).map((plan) => ({
    storageScopeId,
    plan,
  }))
  const assignedEntries = listStoredNutritionMealPlanScopes()
    .filter((scopeId) => scopeId !== storageScopeId)
    .flatMap((scopeId) =>
      readStoredNutritionMealPlans(scopeId)
        .filter((plan) => plan.assignedClientIds?.includes(storageScopeId))
        .map((plan) => ({
          storageScopeId: scopeId,
          plan,
        }))
    )

  const dedupedEntries = new Map<string, StoredNutritionMealPlanEntry>()

  ;[...ownEntries, ...assignedEntries].forEach((entry) => {
    if (!dedupedEntries.has(entry.plan.id)) {
      dedupedEntries.set(entry.plan.id, entry)
    }
  })

  return Array.from(dedupedEntries.values()).sort((left, right) => {
    const leftCreatedAt = left.plan.createdAt ?? ""
    const rightCreatedAt = right.plan.createdAt ?? ""
    return rightCreatedAt.localeCompare(leftCreatedAt)
  })
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
