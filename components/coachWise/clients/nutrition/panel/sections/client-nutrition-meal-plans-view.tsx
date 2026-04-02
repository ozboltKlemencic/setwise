"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Beef, UtensilsCrossed } from "lucide-react"
import { toast } from "sonner"

import { ClientQuickActionCard } from "@/components/coachWise/clients/info/client-quick-action-card"
import { buildMealPlanBuilderSnapshotFromSections } from "@/components/coachWise/clients/nutrition/meal-plan-builder-data"
import { cloneStoredNutritionMacroPlanBuilderSnapshot } from "@/components/coachWise/clients/nutrition/macro-plan-builder-data"
import {
  getNutritionPreset,
  nutritionMealPlanSections,
} from "@/components/coachWise/clients/nutrition/panel/legacy/client-nutrition-panel.legacy"
import { NutritionSectionTitle } from "@/components/coachWise/clients/nutrition/panel/components"
import { buildCoachWiseHref } from "@/components/coachWise/sidebar/route-utils"
import { NutritionPlansTable, type NutritionPlansTableRow } from "@/components/coachWise/tables/nutrition-plans-table"
import { useStoredNutritionMealPlans } from "@/hooks/nutrition"
import { buildNextDuplicatedMealPlanTitle, buildNutritionBackHrefWithStorageScope, mergeNutritionMealPlans } from "@/lib/nutrition/nutrition-panel.utils"
import { getNutritionCreateMacroPlanHref, getNutritionCreateMealPlanHref, getNutritionPlanDetailHref, getNutritionPlanEditorHref } from "@/lib/handlers/nutrition.handlers"
import { removeStoredNutritionMealPlan, upsertStoredNutritionMealPlan, type StoredNutritionMealPlan } from "@/lib/handlers/nutrition-plan-storage"
import type { ClientNutritionMealPlansViewProps, NutritionMealPlan } from "@/types"

function ClientNutritionMealPlansViewComponent({ phase }: ClientNutritionMealPlansViewProps) {
  const router = useRouter()
  const pathname = usePathname()
  const preset = React.useMemo(() => getNutritionPreset(phase), [phase])
  const { clientId, storedMealPlanEntries, storedMealPlans } = useStoredNutritionMealPlans(pathname)
  const [hiddenMealPlanIds, setHiddenMealPlanIds] = React.useState<string[]>([])
  const allMealPlans = React.useMemo(() => mergeNutritionMealPlans(preset.mealPlans, storedMealPlans), [preset.mealPlans, storedMealPlans])
  const mealPlans = React.useMemo(() => allMealPlans.filter((plan) => !hiddenMealPlanIds.includes(plan.id)), [allMealPlans, hiddenMealPlanIds])
  const storedMealPlanEntriesById = React.useMemo(
    () => new Map(storedMealPlanEntries.map((entry) => [entry.plan.id, entry] as const)),
    [storedMealPlanEntries]
  )

  const handleOpenMealPlan = React.useCallback((row: NutritionPlansTableRow) => {
    router.push(buildCoachWiseHref(pathname, getNutritionPlanDetailHref(row.id, buildNutritionBackHrefWithStorageScope(pathname, row.storageScopeId))))
  }, [pathname, router])

  const handleOpenMealPlanEditor = React.useCallback((row: NutritionPlansTableRow) => {
    router.push(buildCoachWiseHref(pathname, getNutritionPlanEditorHref(row.id, buildNutritionBackHrefWithStorageScope(pathname, row.storageScopeId))))
  }, [pathname, router])

  const handleCopyMealPlan = React.useCallback((plan: NutritionMealPlan) => {
    const sourceEntry = storedMealPlanEntriesById.get(plan.id)
    const targetStorageScopeId = sourceEntry?.storageScopeId ?? clientId
    if (!targetStorageScopeId) {
      toast.error("Could not duplicate meal plan", { description: `For ${plan.title}.` })
      return
    }

    const sourceStoredMealPlan = sourceEntry?.plan
    const sourceSections =
      sourceStoredMealPlan?.sections ?? nutritionMealPlanSections[plan.id] ?? []
    const nextTitle = buildNextDuplicatedMealPlanTitle(plan.title, allMealPlans.map((mealPlan) => mealPlan.title))
    const duplicatedPlan: StoredNutritionMealPlan = {
      id: globalThis.crypto?.randomUUID?.() ?? `custom-meal-plan-${Date.now()}-${Math.round(Math.random() * 10000)}`,
      title: nextTitle,
      subtitle: plan.subtitle,
      type: plan.type,
      calories: plan.calories,
      macros: plan.macros,
      schedule: plan.schedule,
      segments: plan.segments.map((segment) => ({ ...segment })),
      sections: sourceSections.map((section) => ({ ...section, options: section.options.map((option) => ({ ...option })) })),
      createdAt: new Date().toISOString(),
      builderSnapshot: sourceStoredMealPlan?.macroBuilderSnapshot ? undefined : buildMealPlanBuilderSnapshotFromSections({ planName: nextTitle, sections: sourceSections, builderSnapshot: sourceStoredMealPlan?.builderSnapshot }),
      macroBuilderSnapshot: sourceStoredMealPlan?.macroBuilderSnapshot ? cloneStoredNutritionMacroPlanBuilderSnapshot(sourceStoredMealPlan.macroBuilderSnapshot, { planName: nextTitle }) : undefined,
    }

    upsertStoredNutritionMealPlan(targetStorageScopeId, duplicatedPlan)
    toast.success(plan.type.toLowerCase().includes("macro") ? "Macro plan duplicated" : "Meal plan duplicated", { description: `Created ${nextTitle}.` })
  }, [allMealPlans, clientId, storedMealPlanEntriesById])

  const handleDeleteMealPlan = React.useCallback((plan: NutritionMealPlan) => {
    setHiddenMealPlanIds((currentIds) => (currentIds.includes(plan.id) ? currentIds : [...currentIds, plan.id]))
    const sourceEntry = storedMealPlanEntriesById.get(plan.id)
    if (sourceEntry) {
      removeStoredNutritionMealPlan(sourceEntry.storageScopeId, plan.id)
    }
    toast.success("Meal plan deleted", { description: `For ${plan.title}.` })
  }, [storedMealPlanEntriesById])

  const tableRows = React.useMemo<NutritionPlansTableRow[]>(
    () => mealPlans.map((plan) => ({ id: plan.id, title: plan.title, subtitle: plan.subtitle, type: plan.type, calories: plan.calories, segments: plan.segments, storageScopeId: storedMealPlanEntriesById.get(plan.id)?.storageScopeId })),
    [mealPlans, storedMealPlanEntriesById]
  )

  const findMealPlanByRow = React.useCallback(
    (row: NutritionPlansTableRow) => mealPlans.find((entry) => entry.id === row.id),
    [mealPlans]
  )

  return (
    <div className="bg-neutral-50 px-4 py-4">
      <div className="mb-5">
        <NutritionSectionTitle title="Create plans" />
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-stretch">
          <ClientQuickActionCard sectionLabel="Nutrition" title="New Meal Plan" description="Build a meal plan from scratch or start from a template." icon={<UtensilsCrossed className="size-4" />} tone="nutrition" href={buildCoachWiseHref(pathname, getNutritionCreateMealPlanHref(pathname))} size="compact" className="md:w-[21rem]" />
          <ClientQuickActionCard sectionLabel="Nutrition" title="Macro Plan (IIFYM)" description="Set macro targets for a more flexible nutrition approach." icon={<Beef className="size-4" />} tone="programs" href={buildCoachWiseHref(pathname, getNutritionCreateMacroPlanHref(pathname))} size="compact" className="md:w-[21rem]" />
        </div>
      </div>

      <div>
        <NutritionSectionTitle title="Existing plans" />
        <NutritionPlansTable
          rows={tableRows}
          onOpenRow={handleOpenMealPlan}
          onEditRow={handleOpenMealPlanEditor}
          onDuplicateRow={(row) => {
            const plan = findMealPlanByRow(row)
            if (plan) handleCopyMealPlan(plan)
          }}
          onDeleteRow={(row) => {
            const plan = findMealPlanByRow(row)
            if (plan) handleDeleteMealPlan(plan)
          }}
        />
      </div>
    </div>
  )
}

export const ClientNutritionMealPlansView = React.memo(ClientNutritionMealPlansViewComponent)
