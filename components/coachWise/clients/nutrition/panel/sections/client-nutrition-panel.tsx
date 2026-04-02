"use client"

import * as React from "react"

import type { ClientNutritionPanelProps } from "@/types"

const LazyClientNutritionMealPlansView = React.lazy(async () => ({
  default: (await import("./client-nutrition-meal-plans-view")).ClientNutritionMealPlansView,
}))

const LazyClientNutritionLoggerView = React.lazy(async () => ({
  default: (await import("../legacy/client-nutrition-panel.legacy")).ClientNutritionLoggerView,
}))

export function ClientNutritionPanel({
  phase,
  initialSubTab = "nutrition",
}: ClientNutritionPanelProps) {
  const [activeTab, setActiveTab] = React.useState(initialSubTab)

  React.useEffect(() => {
    setActiveTab(initialSubTab)
  }, [initialSubTab])

  return (
    <React.Suspense fallback={null}>
      {activeTab === "nutrition" ? <LazyClientNutritionMealPlansView phase={phase} /> : null}
      {activeTab === "nutrition-logger" ? <LazyClientNutritionLoggerView phase={phase} /> : null}
    </React.Suspense>
  )
}
