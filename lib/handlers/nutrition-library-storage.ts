import {
  cloneNutritionLibraryFoods,
  cloneNutritionMealTemplates,
  DEFAULT_NUTRITION_MEAL_TEMPLATES,
  type NutritionLibraryFood,
  type NutritionLibraryMealTemplate,
} from "@/lib/nutrition/nutrition-library-catalog"

export type StoredNutritionCustomFood = NutritionLibraryFood & {
  createdAt: string
}

export type StoredNutritionMealTemplate = NutritionLibraryMealTemplate & {
  createdAt?: string
}

const NUTRITION_LIBRARY_STORAGE_PREFIX = "coachwise:nutrition:library:"
const CUSTOM_FOODS_STORAGE_KEY = `${NUTRITION_LIBRARY_STORAGE_PREFIX}custom-foods`
const MEAL_TEMPLATES_STORAGE_KEY = `${NUTRITION_LIBRARY_STORAGE_PREFIX}meal-templates`

export const NUTRITION_LIBRARY_UPDATED_EVENT =
  "coachwise:nutrition-library-updated"

type NutritionLibraryKind = "custom-foods" | "meal-templates"

function dispatchNutritionLibraryUpdated(kind: NutritionLibraryKind) {
  if (typeof window === "undefined") {
    return
  }

  window.dispatchEvent(
    new CustomEvent(NUTRITION_LIBRARY_UPDATED_EVENT, {
      detail: { kind },
    })
  )
}

function isStoredNutritionCustomFood(value: unknown): value is StoredNutritionCustomFood {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as Partial<StoredNutritionCustomFood>
  return (
    typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    typeof candidate.cal === "number" &&
    typeof candidate.p === "number" &&
    typeof candidate.c === "number" &&
    typeof candidate.f === "number" &&
    typeof candidate.unit === "string" &&
    typeof candidate.step === "number" &&
    typeof candidate.defaultQty === "number" &&
    typeof candidate.createdAt === "string"
  )
}

function isStoredNutritionMealTemplate(value: unknown): value is StoredNutritionMealTemplate {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as Partial<StoredNutritionMealTemplate>
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.subtitle === "string" &&
    Array.isArray(candidate.items) &&
    candidate.items.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.foodId === "number" &&
        typeof item.qty === "number"
    )
  )
}

export function readStoredNutritionCustomFoods() {
  if (typeof window === "undefined") {
    return [] as StoredNutritionCustomFood[]
  }

  try {
    const rawValue = window.localStorage.getItem(CUSTOM_FOODS_STORAGE_KEY)

    if (!rawValue) {
      return [] as StoredNutritionCustomFood[]
    }

    const parsedValue = JSON.parse(rawValue)
    if (!Array.isArray(parsedValue)) {
      return [] as StoredNutritionCustomFood[]
    }

    return parsedValue.filter(isStoredNutritionCustomFood)
  } catch {
    return [] as StoredNutritionCustomFood[]
  }
}

export function writeStoredNutritionCustomFoods(
  foods: StoredNutritionCustomFood[]
) {
  if (typeof window === "undefined") {
    return
  }

  if (!foods.length) {
    window.localStorage.removeItem(CUSTOM_FOODS_STORAGE_KEY)
    dispatchNutritionLibraryUpdated("custom-foods")
    return
  }

  window.localStorage.setItem(CUSTOM_FOODS_STORAGE_KEY, JSON.stringify(foods))
  dispatchNutritionLibraryUpdated("custom-foods")
}

export function upsertStoredNutritionCustomFood(food: StoredNutritionCustomFood) {
  const currentFoods = readStoredNutritionCustomFoods()
  const nextFoods = [
    food,
    ...currentFoods.filter((currentFood) => currentFood.id !== food.id),
  ]

  writeStoredNutritionCustomFoods(nextFoods)
}

export function removeStoredNutritionCustomFood(foodId: number) {
  const currentFoods = readStoredNutritionCustomFoods()
  const nextFoods = currentFoods.filter((food) => food.id !== foodId)

  if (nextFoods.length === currentFoods.length) {
    return
  }

  writeStoredNutritionCustomFoods(nextFoods)
}

export function readStoredNutritionMealTemplates() {
  if (typeof window === "undefined") {
    return cloneNutritionMealTemplates(DEFAULT_NUTRITION_MEAL_TEMPLATES)
  }

  try {
    const rawValue = window.localStorage.getItem(MEAL_TEMPLATES_STORAGE_KEY)

    if (!rawValue) {
      return cloneNutritionMealTemplates(DEFAULT_NUTRITION_MEAL_TEMPLATES)
    }

    const parsedValue = JSON.parse(rawValue)
    if (!Array.isArray(parsedValue)) {
      return cloneNutritionMealTemplates(DEFAULT_NUTRITION_MEAL_TEMPLATES)
    }

    return cloneNutritionMealTemplates(
      parsedValue.filter(isStoredNutritionMealTemplate)
    )
  } catch {
    return cloneNutritionMealTemplates(DEFAULT_NUTRITION_MEAL_TEMPLATES)
  }
}

export function writeStoredNutritionMealTemplates(
  templates: StoredNutritionMealTemplate[]
) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(
    MEAL_TEMPLATES_STORAGE_KEY,
    JSON.stringify(cloneNutritionMealTemplates(templates))
  )
  dispatchNutritionLibraryUpdated("meal-templates")
}

export function upsertStoredNutritionMealTemplate(
  template: StoredNutritionMealTemplate
) {
  const currentTemplates = readStoredNutritionMealTemplates()
  const nextTemplates = [
    template,
    ...currentTemplates.filter(
      (currentTemplate) => currentTemplate.id !== template.id
    ),
  ]

  writeStoredNutritionMealTemplates(nextTemplates)
}

export function removeStoredNutritionMealTemplate(templateId: string) {
  const currentTemplates = readStoredNutritionMealTemplates()
  const nextTemplates = currentTemplates.filter(
    (template) => template.id !== templateId
  )

  if (nextTemplates.length === currentTemplates.length) {
    return
  }

  writeStoredNutritionMealTemplates(nextTemplates)
}

export function cloneStoredNutritionCustomFoods(
  foods: StoredNutritionCustomFood[]
) {
  return cloneNutritionLibraryFoods(foods)
}
