"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  IconCheckbox,
  IconClipboardList,
  IconDots,
  IconFlag3,
  IconPlus,
  IconUserCheck,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type FormsTab = "onboarding" | "check-in" | "habbits"

type OnboardingFlowRow = {
  id: string
  name: string
  status: "Draft" | "Active" | "Archived"
  updatedAt: string
}

type CheckInRow = {
  id: string
  name: string
  frequency: string
  nextDue: string
}

type HabbitsRow = {
  id: string
  name: string
  frequency: string
  goal: string
}

const formsTabs: Array<{
  value: FormsTab
  label: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  { value: "onboarding", label: "Onboarding", icon: IconUserCheck },
  { value: "check-in", label: "Check in", icon: IconCheckbox },
  { value: "habbits", label: "Habbits", icon: IconClipboardList },
]

const onboardingFlowRows: OnboardingFlowRow[] = [
  { id: "welcome-flow", name: "Welcome Flow", status: "Active", updatedAt: "18.03.2026" },
  { id: "client-intake", name: "Client Intake", status: "Draft", updatedAt: "15.03.2026" },
  { id: "goal-mapping", name: "Goal Mapping", status: "Archived", updatedAt: "02.03.2026" },
  { id: "lifestyle-form", name: "Lifestyle Form", status: "Active", updatedAt: "27.02.2026" },
]

const checkInRows: CheckInRow[] = [
  { id: "weekly", name: "Tedenski check-in", frequency: "Vsako nedeljo", nextDue: "22.03.2026" },
  { id: "daily", name: "Dnevni check-in", frequency: "Vsak dan", nextDue: "18.03.2026" },
  { id: "energy", name: "Energy check-in", frequency: "2x tedensko", nextDue: "20.03.2026" },
  { id: "recovery", name: "Recovery pulse", frequency: "Petek", nextDue: "21.03.2026" },
]

const habbitsRows: HabbitsRow[] = [
  { id: "steps", name: "Daily Steps", frequency: "Daily", goal: "10000 korakov" },
  { id: "water", name: "Water Intake", frequency: "Daily", goal: "2.5 L" },
  { id: "sleep", name: "Sleep Duration", frequency: "Daily", goal: "8 ur" },
  { id: "mobility", name: "Mobility", frequency: "3x tedensko", goal: "15 min" },
]

const profileTabTriggerClassName =
  "h-full flex-none gap-1.5 rounded-none border-0 border-b-2 border-transparent bg-transparent px-3.5 py-2 text-[13.5px] font-normal text-neutral-500 after:hidden hover:text-neutral-700 data-[state=active]:border-(--brand-500) data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none [&_svg]:size-3.5 [&_svg]:text-neutral-400 data-[state=active]:[&_svg]:text-(--brand-600)"

function PlannerTextarea({
  placeholder,
  className,
}: {
  placeholder: string
  className?: string
}) {
  return (
    <textarea
      placeholder={placeholder}
      className={cn(
        "w-full rounded-sm border border-neutral-200 px-3 py-3 text-[14px] text-neutral-900 shadow-none outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-300",
        className,
      )}
    />
  )
}

function getStatusBadgeClassName(status: OnboardingFlowRow["status"]) {
  if (status === "Active") return "border-emerald-200 bg-emerald-50 text-emerald-700"
  if (status === "Draft") return "border-amber-200 bg-amber-50 text-amber-700"
  return "border-neutral-200 bg-neutral-100 text-neutral-700"
}

function AddOnboardingDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-9 rounded-sm bg-brand-500 px-3 text-[14px] font-medium text-white shadow-none hover:bg-brand-600">
          <IconPlus className="size-4" />+ Onboarding
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px] rounded-sm border border-neutral-200 bg-white p-0 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold text-neutral-950">
            <IconUserCheck className="size-4.5 text-neutral-700" />
            Add Onboarding
          </DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="size-8 rounded-sm p-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
            >
              <span className="text-lg leading-none">x</span>
            </Button>
          </DialogClose>
        </div>
        <div className="space-y-5 px-6 py-5">
          <div className="space-y-2">
            <label className="text-[14px] font-medium text-neutral-800">
              Flow Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Name of the flow e.g. New Client Intake"
              className="h-11 rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[14px] font-medium text-neutral-800">Description</label>
            <PlannerTextarea
              placeholder="Enter any additional info"
              className="min-h-[120px] rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="h-9 rounded-sm px-3 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Close
            </Button>
          </DialogClose>
          <Button className="h-9 rounded-sm bg-brand-500 px-4 text-[14px] font-medium text-white shadow-none hover:bg-brand-600">
            Add Onboarding
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AddCheckInDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-9 rounded-sm bg-brand-500 px-3 text-[14px] font-medium text-white shadow-none hover:bg-brand-600">
          <IconPlus className="size-4" />+ Check in
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px] rounded-sm border border-neutral-200 bg-white p-0 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold text-neutral-950">
            <IconCheckbox className="size-4.5 text-neutral-700" />
            Add Check in
          </DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="size-8 rounded-sm p-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
            >
              <span className="text-lg leading-none">x</span>
            </Button>
          </DialogClose>
        </div>
        <div className="space-y-5 px-6 py-5">
          <div className="space-y-2">
            <label className="text-[14px] font-medium text-neutral-800">
              Check in Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Name of the check in e.g. Weekly Check in"
              className="h-11 rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[14px] font-medium text-neutral-800">Description</label>
            <PlannerTextarea
              placeholder="Enter any additional info"
              className="min-h-[120px] rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="h-9 rounded-sm px-3 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Close
            </Button>
          </DialogClose>
          <Button className="h-9 rounded-sm bg-brand-500 px-4 text-[14px] font-medium text-white shadow-none hover:bg-brand-600">
            Add Check in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AddHabbitsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-9 rounded-sm bg-brand-500 px-3 text-[14px] font-medium text-white shadow-none hover:bg-brand-600">
          <IconPlus className="size-4" />+ Habbits
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px] rounded-sm border border-neutral-200 bg-white p-0 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold text-neutral-950">
            <IconFlag3 className="size-4.5 text-neutral-700" />
            Add Habbits
          </DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="size-8 rounded-sm p-0 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
            >
              <span className="text-lg leading-none">x</span>
            </Button>
          </DialogClose>
        </div>
        <div className="space-y-5 px-6 py-5">
          <div className="space-y-2">
            <label className="text-[14px] font-medium text-neutral-800">
              Habit Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Name of the habit e.g. Daily Steps"
              className="h-11 rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[14px] font-medium text-neutral-800">Description</label>
            <PlannerTextarea
              placeholder="Enter any additional info"
              className="min-h-[120px] rounded-sm border-neutral-200 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="h-9 rounded-sm px-3 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Close
            </Button>
          </DialogClose>
          <Button className="h-9 rounded-sm bg-brand-500 px-4 text-[14px] font-medium text-white shadow-none hover:bg-brand-600">
            Add Habbits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function OnboardingTable() {
  return (
    <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
      <table className="w-full border-collapse">
        <thead className="bg-muted/60">
          <tr className="border-b border-neutral-200">
            <th className="px-5 py-4 text-left text-[14px] font-medium text-neutral-950">
              Onboarding
            </th>
            <th className="w-[220px] px-5 py-4 text-left text-[14px] font-medium text-neutral-950">
              Status
            </th>
            <th className="w-[220px] px-5 py-4 text-left text-[14px] font-medium text-neutral-950">
              Updated
            </th>
            <th className="w-[56px] px-4 py-4 text-right text-[14px] font-medium text-neutral-950" />
          </tr>
        </thead>
        <tbody>
          {onboardingFlowRows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50/60"
            >
              <td className="px-5 py-5 text-[16px] font-medium text-neutral-950">{row.name}</td>
              <td className="px-5 py-5">
                <Badge
                  variant="outline"
                  className={cn(
                    "h-7 rounded-sm border px-2.5 text-[13px] font-medium",
                    getStatusBadgeClassName(row.status),
                  )}
                >
                  {row.status}
                </Badge>
              </td>
              <td className="px-5 py-5 text-[15px] text-neutral-700">{row.updatedAt}</td>
              <td className="px-4 py-5 text-right">
                <Button
                  variant="ghost"
                  className="size-8 rounded-sm border border-neutral-200 bg-white p-0 text-neutral-500 shadow-none hover:bg-neutral-100 hover:text-neutral-700"
                >
                  <IconDots className="size-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CheckInTable() {
  return (
    <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
      <table className="w-full border-collapse">
        <thead className="bg-muted/60">
          <tr className="border-b border-neutral-200">
            <th className="px-5 py-4 text-left text-[14px] font-medium text-neutral-950">
              Check in
            </th>
            <th className="w-[240px] px-5 py-4 text-left text-[14px] font-medium text-neutral-950">
              Frequency
            </th>
            <th className="w-[220px] px-5 py-4 text-left text-[14px] font-medium text-neutral-950">
              Next due
            </th>
            <th className="w-[56px] px-4 py-4 text-right text-[14px] font-medium text-neutral-950" />
          </tr>
        </thead>
        <tbody>
          {checkInRows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50/60"
            >
              <td className="px-5 py-5 text-[16px] font-medium text-neutral-950">{row.name}</td>
              <td className="px-5 py-5 text-[15px] text-neutral-700">{row.frequency}</td>
              <td className="px-5 py-5 text-[15px] text-neutral-700">{row.nextDue}</td>
              <td className="px-4 py-5 text-right">
                <Button
                  variant="ghost"
                  className="size-8 rounded-sm border border-neutral-200 bg-white p-0 text-neutral-500 shadow-none hover:bg-neutral-100 hover:text-neutral-700"
                >
                  <IconDots className="size-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function HabbitsTable() {
  return (
    <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
      <table className="w-full border-collapse">
        <thead className="bg-muted/60">
          <tr className="border-b border-neutral-200">
            <th className="px-5 py-4 text-left text-[14px] font-medium text-neutral-950">
              Habbits
            </th>
            <th className="w-[220px] px-5 py-4 text-left text-[14px] font-medium text-neutral-950">
              Frequency
            </th>
            <th className="w-[220px] px-5 py-4 text-left text-[14px] font-medium text-neutral-950">
              Goal
            </th>
            <th className="w-[56px] px-4 py-4 text-right text-[14px] font-medium text-neutral-950" />
          </tr>
        </thead>
        <tbody>
          {habbitsRows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50/60"
            >
              <td className="px-5 py-5 text-[16px] font-medium text-neutral-950">{row.name}</td>
              <td className="px-5 py-5 text-[15px] text-neutral-700">{row.frequency}</td>
              <td className="px-5 py-5 text-[15px] text-neutral-700">{row.goal}</td>
              <td className="px-4 py-5 text-right">
                <Button
                  variant="ghost"
                  className="size-8 rounded-sm border border-neutral-200 bg-white p-0 text-neutral-500 shadow-none hover:bg-neutral-100 hover:text-neutral-700"
                >
                  <IconDots className="size-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FormsPageContent() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = (searchParams.get("tab") as FormsTab) || "onboarding"

  const setTab = React.useCallback(
    (value: FormsTab) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("tab", value)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  const tabsAction = (() => {
    if (activeTab === "onboarding") return <AddOnboardingDialog />
    if (activeTab === "check-in") return <AddCheckInDialog />
    return <AddHabbitsDialog />
  })()

  return (
    <section className="min-w-0 bg-neutral-50">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setTab(value as FormsTab)}
        className="min-w-0 w-full gap-0"
      >
        <div className="border-b border-neutral-200 bg-neutral-50">
          <div className="flex min-w-0 items-center justify-between gap-4 px-4">
            <div className="min-w-0 flex-1 overflow-x-auto">
              <TabsList
                variant="line"
                className="w-max min-w-full justify-start gap-0 rounded-none bg-transparent p-0"
              >
                {formsTabs.map(({ value, label, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className={profileTabTriggerClassName}
                  >
                    <Icon className="size-4" />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {tabsAction}
          </div>
        </div>

        <TabsContent value="onboarding" className="mt-0 p-4">
          <OnboardingTable />
        </TabsContent>
        <TabsContent value="check-in" className="mt-0 p-4">
          <CheckInTable />
        </TabsContent>
        <TabsContent value="habbits" className="mt-0 p-4">
          <HabbitsTable />
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default function FormsPage() {
  return (
    <React.Suspense fallback={<section className="min-w-0 bg-neutral-50" />}>
      <FormsPageContent />
    </React.Suspense>
  )
}
