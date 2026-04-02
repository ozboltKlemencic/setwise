import type {
  NutritionMealPlan,
  NutritionPlanMacros,
} from "@/types"
import { GLOBAL_NUTRITION_MEAL_PLANS_STORAGE_SCOPE } from "@/lib/handlers/nutrition-plan-storage"

export function mergeNutritionMealPlans(
  presetMealPlans: NutritionMealPlan[],
  storedMealPlans: NutritionMealPlan[]
) {
  const mergedMealPlans = new Map<string, NutritionMealPlan>()

  storedMealPlans.forEach((mealPlan) => {
    mergedMealPlans.set(mealPlan.id, mealPlan)
  })

  presetMealPlans.forEach((mealPlan) => {
    if (!mergedMealPlans.has(mealPlan.id)) {
      mergedMealPlans.set(mealPlan.id, mealPlan)
    }
  })

  return Array.from(mergedMealPlans.values())
}

export function normalizeDuplicatedMealPlanTitleBase(title: string) {
  return title.replace(/\s*-\s*copy\s+\d+$/i, "").trim()
}

export function buildNextDuplicatedMealPlanTitle(
  sourceTitle: string,
  existingTitles: string[]
) {
  const baseTitle = normalizeDuplicatedMealPlanTitleBase(sourceTitle)
  const duplicatePattern = new RegExp(
    `^${baseTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*-\\s*copy\\s+(\\d+)$`,
    "i"
  )

  const highestCopyIndex = existingTitles.reduce((highestIndex, title) => {
    const normalizedTitle = title.trim()

    if (normalizedTitle.toLowerCase() === baseTitle.toLowerCase()) {
      return Math.max(highestIndex, 0)
    }

    const match = normalizedTitle.match(duplicatePattern)
    if (!match) {
      return highestIndex
    }

    const nextIndex = Number.parseInt(match[1] ?? "0", 10)
    return Number.isFinite(nextIndex)
      ? Math.max(highestIndex, nextIndex)
      : highestIndex
  }, 0)

  return `${baseTitle} - copy ${highestCopyIndex + 1}`
}

export function buildNutritionBackHrefWithStorageScope(
  backHref: string,
  storageScopeId?: string
) {
  if (
    !storageScopeId ||
    storageScopeId === GLOBAL_NUTRITION_MEAL_PLANS_STORAGE_SCOPE
  ) {
    return backHref
  }

  const [pathname, queryString = ""] = backHref.split("?")
  const searchParams = new URLSearchParams(queryString)
  searchParams.set("storageScope", storageScopeId)
  const nextQuery = searchParams.toString()

  return nextQuery ? `${pathname}?${nextQuery}` : pathname
}

export function parseMealPlanMacros(macros: string): NutritionPlanMacros {
  const match = macros.match(/(\d+)P\s*\/\s*(\d+)C\s*\/\s*(\d+)F/i)

  if (!match) {
    return {
      protein: 0,
      carbs: 0,
      fats: 0,
    }
  }

  return {
    protein: Number.parseInt(match[1] ?? "0", 10),
    carbs: Number.parseInt(match[2] ?? "0", 10),
    fats: Number.parseInt(match[3] ?? "0", 10),
  }
}
