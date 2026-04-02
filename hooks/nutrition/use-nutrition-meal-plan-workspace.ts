"use client"

import * as React from "react"
import {
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { toast } from "sonner"

import {
  getNutritionPreset,
  nutritionMealPlanSections,
} from "@/components/coachWise/clients/nutrition/panel/legacy/client-nutrition-panel.legacy"
import { mergeNutritionMealPlans, parseMealPlanMacros } from "@/lib/nutrition/nutrition-panel.utils"
import type { NutritionMealPlanSection } from "@/types"
import { useStoredNutritionMealPlans } from "./use-stored-nutrition-meal-plans"

type UseNutritionMealPlanWorkspaceProps = {
  mealPlanId: string
  phase?: string
  pathHint?: string
}

export function useNutritionMealPlanWorkspace({
  mealPlanId,
  phase,
  pathHint,
}: UseNutritionMealPlanWorkspaceProps) {
  const preset = React.useMemo(() => getNutritionPreset(phase), [phase])
  const { hasLoadedStoredMealPlans, storedMealPlans } =
    useStoredNutritionMealPlans(pathHint)
  const availableMealPlans = React.useMemo(
    () => mergeNutritionMealPlans(preset.mealPlans, storedMealPlans),
    [preset.mealPlans, storedMealPlans]
  )
  const storedMealPlan = React.useMemo(
    () => storedMealPlans.find((plan) => plan.id === mealPlanId),
    [mealPlanId, storedMealPlans]
  )
  const mealPlan = React.useMemo(
    () => availableMealPlans.find((plan) => plan.id === mealPlanId),
    [availableMealPlans, mealPlanId]
  )
  const baseSections = React.useMemo<NutritionMealPlanSection[]>(
    () =>
      storedMealPlan?.sections ??
      (mealPlan ? nutritionMealPlanSections[mealPlan.id] ?? [] : []),
    [mealPlan, storedMealPlan]
  )
  const macros = React.useMemo(
    () => parseMealPlanMacros(mealPlan?.macros ?? ""),
    [mealPlan]
  )
  const [sections, setSections] = React.useState(baseSections)
  const reorderToastTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  React.useEffect(() => {
    setSections(baseSections)
  }, [baseSections])

  React.useEffect(
    () => () => {
      if (reorderToastTimeoutRef.current) {
        clearTimeout(reorderToastTimeoutRef.current)
      }
    },
    []
  )

  const scheduleSavedToast = React.useCallback((delay = 0) => {
    if (reorderToastTimeoutRef.current) {
      clearTimeout(reorderToastTimeoutRef.current)
    }

    reorderToastTimeoutRef.current = setTimeout(() => {
      toast.success("Changes saved", { id: "nutrition-meal-plan-order-saved" })
    }, delay)
  }, [])

  const handleSectionDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (active && over && active.id !== over.id) {
        setSections((currentSections) => {
          const oldIndex = currentSections.findIndex((section) => section.id === active.id)
          const newIndex = currentSections.findIndex((section) => section.id === over.id)
          return arrayMove(currentSections, oldIndex, newIndex)
        })
        scheduleSavedToast(650)
      }
    },
    [scheduleSavedToast]
  )

  const handleRenameSection = React.useCallback(
    (sectionId: string, nextLabel: string) => {
      setSections((currentSections) =>
        currentSections.map((section) =>
          section.id === sectionId ? { ...section, label: nextLabel } : section
        )
      )
      scheduleSavedToast()
    },
    [scheduleSavedToast]
  )

  const handleDeleteSection = React.useCallback(
    (sectionId: string) => {
      setSections((currentSections) =>
        currentSections.filter((section) => section.id !== sectionId)
      )
      scheduleSavedToast()
    },
    [scheduleSavedToast]
  )

  return {
    hasLoadedStoredMealPlans,
    macros,
    mealPlan,
    storedMealPlan,
    sections,
    sensors,
    handleDeleteSection,
    handleRenameSection,
    handleSectionDragEnd,
  }
}
