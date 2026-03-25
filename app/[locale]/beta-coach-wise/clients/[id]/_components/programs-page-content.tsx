import { IconCalendarEvent, IconChartBar, IconClipboardCheck } from "@tabler/icons-react"

import { SubtabsNav } from "@/components/coachWise/clients/subtabs-nav"
import {
  CompletedWorkoutsPanel,
  ExerciseHistoryPanel,
  FixedProgramsTable,
  ProgramsOverviewActions,
  ProgramsPeriodPicker,
} from "@/components/coachWise/programs/exercise-history-panel"
import { WorkoutCalendar } from "@/components/coachWise/programs/workout-calendar"
import { Tabs, TabsContent } from "@/components/ui/tabs"

import { SectionBody } from "./section-body"

type ProgramsPageContentProps = {
  clientBasePath: string
  activeTab: "calendar" | "exercise-history" | "completed-workouts"
  programType: "calendar" | "fixed"
}

export function ProgramsPageContent({
  clientBasePath,
  activeTab,
  programType,
}: ProgramsPageContentProps) {
  return (
    <Tabs value={activeTab} className="gap-0">
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
          activeTab === "calendar" ? (
            <ProgramsOverviewActions programType={programType} />
          ) : activeTab === "exercise-history" ||
            activeTab === "completed-workouts" ? (
            <ProgramsPeriodPicker />
          ) : null
        }
      />

      <TabsContent value="calendar" className="mt-0 space-y-0">
        <SectionBody>
          {programType === "fixed" ? <FixedProgramsTable /> : <WorkoutCalendar />}
        </SectionBody>
      </TabsContent>

      <TabsContent value="exercise-history" className="mt-0 space-y-0">
        <SectionBody>
          <ExerciseHistoryPanel />
        </SectionBody>
      </TabsContent>

      <TabsContent value="completed-workouts" className="mt-0 space-y-0">
        <SectionBody>
          <CompletedWorkoutsPanel />
        </SectionBody>
      </TabsContent>
    </Tabs>
  )
}
