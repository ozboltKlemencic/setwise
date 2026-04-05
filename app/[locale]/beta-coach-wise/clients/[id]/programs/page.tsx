import type { ReactNode } from "react"
import {
  IconCalendarEvent,
  IconChartBar,
  IconClipboardCheck,
} from "@tabler/icons-react"

import { ClientProgramsOverview } from "@/components/coachWise/clients/programs/client-programs-overview"
import { SubtabsNav } from "@/components/coachWise/clients/shared/subtabs-nav"
import { ProgramProgressPanel } from "@/components/coachWise/programs/program-progress-panel"
import {
  CompletedWorkoutsPanel,
  ProgramsPeriodPicker,
  WorkoutDetailView,
} from "@/components/coachWise/programs/exercise-history-panel"
import { Tabs, TabsContent } from "@/components/ui/tabs"

import {
  getSingleSearchParam,
  resolveClientDetailContext,
  type ClientDetailPageProps,
} from "@/lib/handlers/client-detail.handlers"

type ProgramsSearchParams = {
  programTab?: string | string[]
  workoutId?: string | string[]
}

function SectionBody({ children }: { children: ReactNode }) {
  return <div className="space-y-4 bg-neutral-50">{children}</div>
}

export default async function Page({
  params,
  searchParams,
}: ClientDetailPageProps<ProgramsSearchParams>) {
  const { clientBasePath } = await resolveClientDetailContext(params)
  const resolvedSearchParams = await searchParams
  const workoutId = getSingleSearchParam(resolvedSearchParams.workoutId)
  const activeProgramTab = getSingleSearchParam(resolvedSearchParams.programTab)
  const resolvedProgramTab =
    activeProgramTab === "exercise-history" ||
      activeProgramTab === "completed-workouts"
      ? activeProgramTab
      : "calendar"

  if (workoutId) {
    return (
      <section className="min-w-0 bg-neutral-50">
        <WorkoutDetailView workoutId={workoutId} />
      </section>
    )
  }

  return (
    <section className="min-w-0 bg-neutral-50">
      <Tabs value={resolvedProgramTab} className="gap-0">
        <SubtabsNav
          items={[
            {
              icon: <IconCalendarEvent className="size-4" />,
              label: "Overview",
              value: "calendar",
              href: `${clientBasePath}/programs?programTab=calendar`,
            },
            {
              icon: <IconChartBar className="size-4" />,
              label: "Progress",
              value: "exercise-history",
              href: `${clientBasePath}/programs?programTab=exercise-history`,
            },
            {
              icon: <IconClipboardCheck className="size-4" />,
              label: "History",
              value: "completed-workouts",
              href: `${clientBasePath}/programs?programTab=completed-workouts`,
            },
          ]}
          actions={
            resolvedProgramTab === "completed-workouts" ? (
              <ProgramsPeriodPicker />
            ) : null
          }
        />

        <TabsContent value="calendar" className="mt-0 space-y-0">
          <SectionBody>
            <ClientProgramsOverview clientBasePath={clientBasePath} />
          </SectionBody>
        </TabsContent>

        <TabsContent value="exercise-history" className="mt-0 space-y-0">
          <SectionBody>
            <ProgramProgressPanel />
          </SectionBody>
        </TabsContent>

        <TabsContent value="completed-workouts" className="mt-0 space-y-0">
          <SectionBody>
            <CompletedWorkoutsPanel />
          </SectionBody>
        </TabsContent>
      </Tabs>
    </section>
  )
}
