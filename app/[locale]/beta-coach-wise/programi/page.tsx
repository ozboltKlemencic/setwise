"use client"

import {
  IconBarbell,
  IconClipboardList,
  IconLayoutGrid,
} from "@tabler/icons-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const profileTabTriggerClassName =
  "h-full flex-none gap-1.5 rounded-none border-0 border-b-2 border-transparent bg-transparent px-3.5 py-2 text-[13.5px] font-normal text-neutral-500 after:hidden hover:text-neutral-700 data-[state=active]:border-(--brand-500) data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none [&_svg]:size-3.5 [&_svg]:text-neutral-400 data-[state=active]:[&_svg]:text-(--brand-600)"

const mainTabs = [
  {
    value: "programs",
    label: "Programs",
    icon: <IconClipboardList className="size-4" />,
    description: "Urejanje aktivnih programov, faz in progresije za stranke.",
  },
  {
    value: "templates",
    label: "Templates",
    icon: <IconLayoutGrid className="size-4" />,
    description: "Shranjeni template programi za hitrejso pripravo novih planov.",
  },
  {
    value: "exercises",
    label: "Exercises",
    icon: <IconBarbell className="size-4" />,
    description: "Kniznica vaj, variacij in opomb za gradnjo programov.",
  },
] as const

function ProgramSection({
  heading,
  description,
}: {
  heading: string
  description: string
}) {
  return (
    <div className="bg-neutral-50 p-4">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-sm border-neutral-200 bg-white shadow-none">
          <CardHeader className="space-y-1 px-5 py-4">
            <CardTitle className="text-[15px] font-semibold text-neutral-900">
              {heading}
            </CardTitle>
            <CardDescription className="text-[13px] text-neutral-500">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 px-5 pb-5 sm:grid-cols-3">
            <div className="rounded-sm border border-neutral-200 bg-neutral-50 p-4">
              <div className="text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-400">
                Status
              </div>
              <div className="mt-2 text-[20px] font-semibold text-neutral-900">
                Active
              </div>
            </div>
            <div className="rounded-sm border border-neutral-200 bg-neutral-50 p-4">
              <div className="text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-400">
                Items
              </div>
              <div className="mt-2 text-[20px] font-semibold text-neutral-900">
                12
              </div>
            </div>
            <div className="rounded-sm border border-neutral-200 bg-neutral-50 p-4">
              <div className="text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-400">
                Updated
              </div>
              <div className="mt-2 text-[20px] font-semibold text-neutral-900">
                Today
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-sm border-neutral-200 bg-white shadow-none">
          <CardHeader className="space-y-1 px-5 py-4">
            <CardTitle className="text-[15px] font-semibold text-neutral-900">
              Overview
            </CardTitle>
            <CardDescription className="text-[13px] text-neutral-500">
              Hiter pregled izbranega taba.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 text-[14px] leading-6 text-neutral-600">
            Ta pogled je pripravljen za nadaljnjo vsebino. Glavni cilj tukaj je
            enak glavni nav vzorec kot drugje v aplikaciji, da ostane UI
            konsistenten in predvidljiv po celotni aplikaciji.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ProgramiPage() {
  return (
    <section className="min-w-0 bg-neutral-50">
      <Tabs defaultValue="programs" className="min-w-0 w-full gap-0">
        <div className="border-b border-neutral-200 bg-neutral-50">
          <div className="flex min-w-0 items-center">
            <div className="min-w-0 flex-1 overflow-x-auto">
              <TabsList
                variant="line"
                className="w-max min-w-full justify-start gap-0 rounded-none bg-transparent p-0"
              >
                {mainTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={profileTabTriggerClassName}
                  >
                    {tab.icon}
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
        </div>

        {mainTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-0 space-y-0">
            <ProgramSection heading={tab.label} description={tab.description} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
