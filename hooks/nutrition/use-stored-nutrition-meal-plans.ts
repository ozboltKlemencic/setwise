"use client"

import * as React from "react"

import {
  NUTRITION_MEAL_PLANS_UPDATED_EVENT,
  readStoredNutritionMealPlanEntries,
  resolveNutritionMealPlanStorageScopeFromPath,
  type StoredNutritionMealPlanEntry,
} from "@/lib/handlers/nutrition-plan-storage"

export function useStoredNutritionMealPlans(pathHint?: string) {
  const clientId = React.useMemo(
    () => resolveNutritionMealPlanStorageScopeFromPath(pathHint),
    [pathHint]
  )
  const [storedMealPlanEntries, setStoredMealPlanEntries] = React.useState<
    StoredNutritionMealPlanEntry[]
  >([])
  const [hasLoadedStoredMealPlans, setHasLoadedStoredMealPlans] =
    React.useState(false)

  React.useEffect(() => {
    if (!clientId) {
      setStoredMealPlanEntries([])
      setHasLoadedStoredMealPlans(true)
      return
    }

    setHasLoadedStoredMealPlans(false)

    const syncStoredMealPlans = () => {
      setStoredMealPlanEntries(readStoredNutritionMealPlanEntries(clientId))
      setHasLoadedStoredMealPlans(true)
    }

    const handleStoredMealPlansUpdated = (event: Event) => {
      const updatedClientId = (
        event as CustomEvent<{ clientId?: string }>
      ).detail?.clientId

      if (!updatedClientId || updatedClientId === clientId) {
        syncStoredMealPlans()
      }
    }

    syncStoredMealPlans()
    window.addEventListener("storage", syncStoredMealPlans)
    window.addEventListener(
      NUTRITION_MEAL_PLANS_UPDATED_EVENT,
      handleStoredMealPlansUpdated as EventListener
    )

    return () => {
      window.removeEventListener("storage", syncStoredMealPlans)
      window.removeEventListener(
        NUTRITION_MEAL_PLANS_UPDATED_EVENT,
        handleStoredMealPlansUpdated as EventListener
      )
    }
  }, [clientId])

  return {
    clientId,
    hasLoadedStoredMealPlans,
    storedMealPlanEntries,
    storedMealPlans: storedMealPlanEntries.map((entry) => entry.plan),
  }
}
