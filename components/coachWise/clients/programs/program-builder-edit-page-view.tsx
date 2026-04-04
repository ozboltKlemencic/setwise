"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { ProgramBuilderPageView } from "@/components/coachWise/clients/programs/program-builder-page"
import {
  ensureStoredProgramPlans,
  PROGRAM_PLANS_UPDATED_EVENT,
  readStoredProgramPlans,
  resolveProgramPlanStorageScopeFromPath,
} from "@/lib/handlers/program-plan-storage"
import {
  buildProgramBuilderInitialProgramFromStoredPlan,
  createInitialStoredProgramPlans,
} from "@/lib/programs/program-plan-storage.utils"
import type { StoredProgramPlan } from "@/types"

type ProgramBuilderEditPageViewProps = {
  programPlanId: string
  backHref: string
}

function ProgramBuilderEditPageViewComponent({
  programPlanId,
  backHref,
}: ProgramBuilderEditPageViewProps) {
  const pathname = usePathname()
  const storageScopeId = React.useMemo(
    () =>
      resolveProgramPlanStorageScopeFromPath(backHref) ??
      resolveProgramPlanStorageScopeFromPath(pathname),
    [backHref, pathname]
  )
  const seedPlans = React.useMemo<StoredProgramPlan[]>(
    () => createInitialStoredProgramPlans(),
    []
  )
  const [hasLoaded, setHasLoaded] = React.useState(false)
  const [storedPlan, setStoredPlan] = React.useState(
    seedPlans.find((plan) => plan.id === programPlanId) ?? null
  )

  React.useEffect(() => {
    if (!storageScopeId) {
      setHasLoaded(true)
      return
    }

    const syncStoredPlan = () => {
      const plans = ensureStoredProgramPlans(storageScopeId, seedPlans)
      setStoredPlan(plans.find((plan) => plan.id === programPlanId) ?? null)
      setHasLoaded(true)
    }

    syncStoredPlan()

    const handleProgramsUpdated = (event: Event) => {
      const updatedStorageScopeId = (
        event as CustomEvent<{ storageScopeId?: string }>
      ).detail?.storageScopeId

      if (updatedStorageScopeId !== storageScopeId) {
        return
      }

      const plans = readStoredProgramPlans(storageScopeId)
      setStoredPlan(plans.find((plan) => plan.id === programPlanId) ?? null)
      setHasLoaded(true)
    }

    window.addEventListener(PROGRAM_PLANS_UPDATED_EVENT, handleProgramsUpdated)
    return () => {
      window.removeEventListener(
        PROGRAM_PLANS_UPDATED_EVENT,
        handleProgramsUpdated
      )
    }
  }, [programPlanId, seedPlans, storageScopeId])

  if (!hasLoaded) {
    return null
  }

  if (!storedPlan) {
    return (
      <div className="px-2 pt-2 text-sm text-neutral-500">
        Program not found.
      </div>
    )
  }

  return (
    <ProgramBuilderPageView
      initialProgram={buildProgramBuilderInitialProgramFromStoredPlan(storedPlan)}
      initialSnapshot={storedPlan.builderSnapshot}
      initialAssignedClientIds={storedPlan.assignedClientIds}
      createdAt={storedPlan.createdAt}
      backHref={backHref}
      isEditMode
    />
  )
}

export const ProgramBuilderEditPageView = React.memo(
  ProgramBuilderEditPageViewComponent
)
