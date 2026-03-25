import { WorkoutDetailView } from "@/components/coachWise/programs/exercise-history-panel"

import { ProgramsPageContent } from "../_components/programs-page-content"
import {
  getSingleSearchParam,
  resolveClientDetailContext,
  type ClientDetailPageProps,
} from "../_lib/client-detail-page"

type ProgramsSearchParams = {
  programTab?: string | string[]
  programType?: string | string[]
  workoutId?: string | string[]
}

export default async function Page({
  params,
  searchParams,
}: ClientDetailPageProps<ProgramsSearchParams>) {
  const { clientBasePath } = await resolveClientDetailContext(params)
  const resolvedSearchParams = await searchParams
  const workoutId = getSingleSearchParam(resolvedSearchParams.workoutId)
  const activeProgramTab = getSingleSearchParam(resolvedSearchParams.programTab)
  const activeProgramType = getSingleSearchParam(resolvedSearchParams.programType)
  const resolvedProgramTab =
    activeProgramTab === "exercise-history" ||
    activeProgramTab === "completed-workouts"
      ? activeProgramTab
      : "calendar"
  const resolvedProgramType = activeProgramType === "fixed" ? "fixed" : "calendar"

  if (workoutId) {
    return (
      <section className="min-w-0 bg-neutral-50">
        <WorkoutDetailView workoutId={workoutId} />
      </section>
    )
  }

  return (
    <section className="min-w-0 bg-neutral-50">
      <ProgramsPageContent
        clientBasePath={clientBasePath}
        activeTab={resolvedProgramTab}
        programType={resolvedProgramType}
      />
    </section>
  )
}
