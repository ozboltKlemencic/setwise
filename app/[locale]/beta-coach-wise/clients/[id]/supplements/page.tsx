import type { ReactNode } from "react"
import { IconCalendarEvent, IconPill } from "@tabler/icons-react"

import { SupplementsScheduleCalendar } from "@/components/coachWise/clients/supplements/supplements-schedule-calendar"
import { SubtabsNav } from "@/components/coachWise/clients/shared/subtabs-nav"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"

function SectionBody({ children }: { children: ReactNode }) {
  return <div className="space-y-4 bg-neutral-50">{children}</div>
}

function SupplementsSectionTable({
  title,
  rows,
}: {
  title: string
  rows: {
    supplement: string
    timing: string
    dose: string
    purpose: string
  }[]
}) {
  return (
    <div className="space-y-2">
      <div className="px-1 text-[12px] font-medium text-neutral-500">{title}</div>
      <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4 lg:pl-5">Supplement</TableHead>
              <TableHead>Timing</TableHead>
              <TableHead>Dose</TableHead>
              <TableHead>Purpose</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={`${title}-${row.supplement}`}>
                <TableCell className="pl-4 font-medium text-neutral-950 lg:pl-5">
                  {row.supplement}
                </TableCell>
                <TableCell>{row.timing}</TableCell>
                <TableCell>{row.dose}</TableCell>
                <TableCell className="text-neutral-600">{row.purpose}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

const supplementSections = [
  {
    title: "Performance",
    rows: [
      {
        supplement: "Kreatin",
        timing: "Vsak dan z zajtrkom",
        dose: "5 g",
        purpose: "Podpora performansu in ponovljivosti v treningu.",
      },
      {
        supplement: "Elektroliti",
        timing: "Pred treningom",
        dose: "1 serving",
        purpose: "Boljssa hidracija in stabilna energija med sessionom.",
      },
    ],
  },
  {
    title: "Health",
    rows: [
      {
        supplement: "Omega 3",
        timing: "Kosilo",
        dose: "2 kapsuli",
        purpose: "Podpora splosnemu zdravju in regeneraciji.",
      },
      {
        supplement: "Vitamin D3",
        timing: "Zjutraj",
        dose: "2000 IU",
        purpose: "Podpora imunskemu sistemu in splosnemu well-beingu.",
      },
    ],
  },
  {
    title: "Recovery",
    rows: [
      {
        supplement: "Magnezij",
        timing: "Pred spanjem",
        dose: "300 mg",
        purpose: "Podpora vecernemu ritualu in boljssemu recoveryju.",
      },
      {
        supplement: "Glicin",
        timing: "Pred spanjem",
        dose: "3 g",
        purpose: "Pomoc pri umiritvi rutine in kvaliteti spanja.",
      },
    ],
  },
] as const

export default function Page() {
  return (
    <section className="min-w-0 bg-neutral-50">
      <Tabs defaultValue="stack" className="gap-0">
        <SubtabsNav
          items={[
            {
              icon: <IconPill className="size-4" />,
              label: "Stack",
              value: "stack",
            },
            {
              icon: <IconCalendarEvent className="size-4" />,
              label: "Schedule",
              value: "schedule",
            },
          ]}
        />

        <TabsContent value="stack" className="mt-0 space-y-0 m-2">
          <SectionBody>
            {supplementSections.map((section) => (
              <SupplementsSectionTable
                key={section.title}
                title={section.title}
                rows={[...section.rows]}
              />
            ))}
          </SectionBody>
        </TabsContent>

        <TabsContent value="schedule" className="mt-0 space-y-0 m-2">
          <SectionBody>
            <SupplementsScheduleCalendar />
          </SectionBody>
        </TabsContent>
      </Tabs>
    </section>
  )
}
