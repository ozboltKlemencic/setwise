import type { ReactNode } from "react"
import {
  IconCalendarEvent,
  IconChartBar,
  IconClipboardCheck,
  IconPlus,
} from "@tabler/icons-react"

import {
  AssignedCheckinDetailView,
  AssignedCheckinsPanel,
  CreateAssignedCheckinDialog,
  SubmittedCheckinPhotosCompareDialog,
  SubmittedCheckinsCompareDialog,
  SubmittedCheckinsPanel,
} from "@/components/coachWise/clients/client-checkins-panel"
import {
  SubtabsNav,
  SubtabsNavActionButton,
} from "@/components/coachWise/clients/subtabs-nav"
import { Tabs, TabsContent } from "@/components/ui/tabs"

import {
  getSingleSearchParam,
  resolveClientDetailContext,
  type ClientDetailPageProps,
} from "../_lib/client-detail-page"

type CheckinsSearchParams = {
  assignedCheckin?: string | string[]
  checkinTab?: string | string[]
}

function SectionBody({ children }: { children: ReactNode }) {
  return <div className="space-y-4 bg-neutral-50">{children}</div>
}

export default async function Page({
  params,
  searchParams,
}: ClientDetailPageProps<CheckinsSearchParams>) {
  const { client } = await resolveClientDetailContext(params)
  const resolvedSearchParams = await searchParams
  const assignedCheckinId = getSingleSearchParam(
    resolvedSearchParams.assignedCheckin
  )
  const activeCheckinTab = getSingleSearchParam(resolvedSearchParams.checkinTab)
  const resolvedCheckinTab =
    activeCheckinTab === "assigned" ? "assigned" : "submitted"

  if (assignedCheckinId) {
    return (
      <section className="min-w-0 bg-neutral-50">
        <AssignedCheckinDetailView checkinId={assignedCheckinId} />
      </section>
    )
  }

  return (
    <section className="min-w-0 bg-neutral-50">
      <Tabs value={resolvedCheckinTab} className="gap-0">
        <SubtabsNav
          items={[
            {
              icon: <IconClipboardCheck className="size-4" />,
              label: "Oddani",
              value: "submitted",
              href: "?checkinTab=submitted",
            },
            {
              icon: <IconCalendarEvent className="size-4" />,
              label: "Dodeljeni",
              value: "assigned",
              href: "?checkinTab=assigned",
            },
          ]}
          actions={
            resolvedCheckinTab === "assigned" ? (
              <CreateAssignedCheckinDialog
                trigger={
                  <SubtabsNavActionButton
                    variant="primary"
                    icon={<IconPlus className="size-4" />}
                    label="Nov check-in"
                  />
                }
              />
            ) : (
              <>
                <SubmittedCheckinPhotosCompareDialog
                  triggerIcon="photo"
                  triggerLabel="Primerjaj slike"
                  trigger={
                    <SubtabsNavActionButton
                      variant="secondary"
                      icon={<IconClipboardCheck className="size-4" />}
                      label="Primerjaj slike"
                    />
                  }
                />
                <SubmittedCheckinsCompareDialog
                  trigger={
                    <SubtabsNavActionButton
                      variant="secondary"
                      icon={<IconChartBar className="size-4" />}
                      label="Compare"
                    />
                  }
                />
              </>
            )
          }
        />

        <TabsContent value="submitted" className="mt-0 space-y-0">
          <SectionBody>
            <SubmittedCheckinsPanel clientName={client.header} />
          </SectionBody>
        </TabsContent>

        <TabsContent value="assigned" className="mt-0 space-y-0">
          <SectionBody>
            <AssignedCheckinsPanel />
          </SectionBody>
        </TabsContent>
      </Tabs>
    </section>
  )
}
