"use client"

import * as React from "react"
import { Dumbbell } from "lucide-react"
import { toast } from "sonner"

import { ClientQuickActionCard } from "@/components/coachWise/clients/info/client-quick-action-card"
import { NutritionSectionTitle } from "@/components/coachWise/clients/nutrition/panel/components"
import {
  ProgramPresetCard,
} from "@/components/coachWise/clients/programs/program-preset-card"
import {
  ProgramPlansTable,
  type ProgramPlansTableRow,
} from "@/components/coachWise/tables/program-plans-table"
import {
  ensureStoredProgramPlans,
  PROGRAM_PLANS_UPDATED_EVENT,
  readStoredProgramPlans,
  removeStoredProgramPlan,
  resolveProgramPlanStorageScopeFromPath,
  upsertStoredProgramPlan,
} from "@/lib/handlers/program-plan-storage"
import { getClientProgramBuilderHref } from "@/lib/handlers/programs.handlers"
import {
  cloneStoredProgramPlan,
  createInitialStoredProgramPlans,
} from "@/lib/programs/program-plan-storage.utils"
import {
  formatProgramPresetSummary,
  programBuilderPresets,
} from "@/lib/programs/program-builder.utils"
import type { StoredProgramPlan } from "@/types"

function buildNextDuplicatedProgramTitle(title: string, existingTitles: string[]) {
  let nextIndex = 1
  let nextTitle = `${title} - copy ${nextIndex}`

  while (existingTitles.includes(nextTitle)) {
    nextIndex += 1
    nextTitle = `${title} - copy ${nextIndex}`
  }

  return nextTitle
}

type ClientProgramsOverviewProps = {
  clientBasePath: string
}

function ClientProgramsOverviewComponent({
  clientBasePath,
}: ClientProgramsOverviewProps) {
  const overviewHref = `${clientBasePath}/programs?programTab=calendar`
  const storageScopeId = React.useMemo(
    () => resolveProgramPlanStorageScopeFromPath(overviewHref),
    [overviewHref]
  )

  const initialRows = React.useMemo<StoredProgramPlan[]>(
    () => createInitialStoredProgramPlans(),
    []
  )
  const [rows, setRows] = React.useState<StoredProgramPlan[]>(initialRows)

  React.useEffect(() => {
    if (!storageScopeId) {
      return
    }

    const syncRows = () => {
      setRows(ensureStoredProgramPlans(storageScopeId, initialRows))
    }

    syncRows()

    const handleProgramsUpdated = (event: Event) => {
      const updatedStorageScopeId = (
        event as CustomEvent<{ storageScopeId?: string }>
      ).detail?.storageScopeId

      if (updatedStorageScopeId !== storageScopeId) {
        return
      }

      setRows(readStoredProgramPlans(storageScopeId))
    }

    window.addEventListener(PROGRAM_PLANS_UPDATED_EVENT, handleProgramsUpdated)
    return () => {
      window.removeEventListener(
        PROGRAM_PLANS_UPDATED_EVENT,
        handleProgramsUpdated
      )
    }
  }, [initialRows, storageScopeId])

  const handleDuplicateRow = React.useCallback((row: ProgramPlansTableRow) => {
    if (!storageScopeId) {
      return
    }

    const nextTitle = buildNextDuplicatedProgramTitle(
      row.title,
      rows.map((entry) => entry.title)
    )
    const duplicatedProgram = cloneStoredProgramPlan(row, {
      id:
        globalThis.crypto?.randomUUID?.() ??
        `program-${Date.now()}-${Math.round(Math.random() * 10000)}`,
      title: nextTitle,
      createdAt: new Date().toISOString(),
      program: {
        ...row.program,
        id:
          globalThis.crypto?.randomUUID?.() ??
          `program-editor-${Date.now()}-${Math.round(Math.random() * 10000)}`,
        title: nextTitle,
      },
    })

    upsertStoredProgramPlan(storageScopeId, duplicatedProgram)
    toast.success("Program duplicated", { description: `Created ${nextTitle}.` })
  }, [rows, storageScopeId])

  const handleDeleteRow = React.useCallback((row: ProgramPlansTableRow) => {
    if (!storageScopeId) {
      return
    }

    removeStoredProgramPlan(storageScopeId, row.id)
    toast.success("Program deleted", { description: `Removed ${row.title}.` })
  }, [storageScopeId])

  return (
    <div className="bg-neutral-50 px-4 py-4">
      <div className="mb-5">
        <NutritionSectionTitle title="Create programs" />
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-stretch">
          <ClientQuickActionCard
            href={getClientProgramBuilderHref(clientBasePath, {
              backTo: overviewHref,
            })}
            sectionLabel="Programs"
            title="New Program"
            description="Build a fixed training program from scratch or start from a template."
            icon={<Dumbbell className="size-4" />}
            tone="programs"
            size="compact"
            className="md:w-[21rem]"
          />
        </div>

          <div className="mt-5">
            <NutritionSectionTitle title="Templates" />
          <div className="flex flex-wrap gap-3">
            {programBuilderPresets.map((preset) => (
              <ProgramPresetCard
                key={preset.id}
                href={getClientProgramBuilderHref(clientBasePath, {
                  backTo: overviewHref,
                  presetId: preset.id,
                })}
                title={preset.title}
                description={formatProgramPresetSummary(preset)}
                className="md:w-[14.25rem]"
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <NutritionSectionTitle title="Existing programs" />
        <ProgramPlansTable
          rows={rows}
          onDuplicateRow={handleDuplicateRow}
          onDeleteRow={handleDeleteRow}
        />
      </div>
    </div>
  )
}

export const ClientProgramsOverview = React.memo(ClientProgramsOverviewComponent)
