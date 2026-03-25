import { IconCalendarEvent, IconChartBar, IconClipboardCheck, IconPlus } from "@tabler/icons-react"

import {
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

import { SectionBody } from "./section-body"

type CheckinsPageContentProps = {
  clientName: string
  activeTab: "submitted" | "assigned"
}

export function CheckinsPageContent({
  clientName,
  activeTab,
}: CheckinsPageContentProps) {
  return (
    <Tabs value={activeTab} className="gap-0">
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
          activeTab === "assigned" ? (
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
          <SubmittedCheckinsPanel clientName={clientName} />
        </SectionBody>
      </TabsContent>

      <TabsContent value="assigned" className="mt-0 space-y-0">
        <SectionBody>
          <AssignedCheckinsPanel />
        </SectionBody>
      </TabsContent>
    </Tabs>
  )
}
