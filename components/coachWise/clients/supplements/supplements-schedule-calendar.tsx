"use client"

import { useState } from "react"
import {
  IconCheck,
  IconDots,
  IconPill,
  IconPlus,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type SupplementScheduleEvent = {
  id: string
  date: string
  title: string
  slot: string
  completed?: boolean
  cadence?: string
  tone?: "default" | "warning"
}

const weekdayLabels = ["Po", "To", "Sr", "Ce", "Pe", "So", "Ne"] as const

const referenceDate = new Date(2026, 2, 19)

const supplementScheduleEvents: SupplementScheduleEvent[] = [
  {
    id: "2026-03-16-whey",
    date: "2026-03-16",
    title: "Whey Protein",
    slot: "Zjutraj",
    completed: true,
  },
  {
    id: "2026-03-16-omega",
    date: "2026-03-16",
    title: "Omega 3",
    slot: "Dopoldne",
  },
  {
    id: "2026-03-16-b12",
    date: "2026-03-16",
    title: "Vitamin B12",
    slot: "Zjutraj",
    cadence: "1x na 2 tedna",
    tone: "warning",
  },
  {
    id: "2026-03-17-creatine",
    date: "2026-03-17",
    title: "Kreatin",
    slot: "Zjutraj",
    completed: true,
  },
  {
    id: "2026-03-18-electrolytes",
    date: "2026-03-18",
    title: "Elektroliti",
    slot: "Dopoldne",
  },
  {
    id: "2026-03-18-magnesium",
    date: "2026-03-18",
    title: "Magnezij",
    slot: "Vecer",
  },
  {
    id: "2026-03-19-whey",
    date: "2026-03-19",
    title: "Whey Protein",
    slot: "Zjutraj",
    completed: true,
  },
  {
    id: "2026-03-19-vitamin-d3",
    date: "2026-03-19",
    title: "Vitamin D3",
    slot: "Dopoldne",
  },
  {
    id: "2026-03-19-probiotic",
    date: "2026-03-19",
    title: "Probiotik",
    slot: "Zjutraj",
    cadence: "1x na 2 tedna",
    tone: "warning",
  },
  {
    id: "2026-03-20-electrolytes",
    date: "2026-03-20",
    title: "Elektroliti",
    slot: "Po treningu",
  },
  {
    id: "2026-03-20-glycine",
    date: "2026-03-20",
    title: "Glicin",
    slot: "Vecer",
  },
  {
    id: "2026-03-21-omega",
    date: "2026-03-21",
    title: "Omega 3",
    slot: "Dopoldne",
  },
  {
    id: "2026-03-22-magnesium",
    date: "2026-03-22",
    title: "Magnezij",
    slot: "Vecer",
  },
]

const supplementLibrary = [
  {
    id: "whey-protein",
    title: "Whey Protein",
    note: "Hiter protein za jutranji ali po-trening obrok.",
  },
  {
    id: "kreatin",
    title: "Kreatin",
    note: "Dnevna osnova za moc, volumen in boljso ponovljivost.",
  },
  {
    id: "omega-3",
    title: "Omega 3",
    note: "Podpora zdravju, regeneraciji in osnovnemu well-beingu.",
  },
  {
    id: "vitamin-d3",
    title: "Vitamin D3",
    note: "Smiselna jutranja rutina za stabilen dnevni stack.",
  },
  {
    id: "elektroliti",
    title: "Elektroliti",
    note: "Najbolj smiselni na trening dneve ali pri vec potenja.",
  },
  {
    id: "magnezij",
    title: "Magnezij",
    note: "Vecerni recovery support in bolj miren zakljucek dneva.",
  },
  {
    id: "glicin",
    title: "Glicin",
    note: "Dober dodatek za vecerni ritem in spanec.",
  },
]

function addDays(date: Date, amount: number) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + amount)
  return nextDate
}

function startOfWeek(date: Date) {
  const day = date.getDay()
  const offset = day === 0 ? -6 : 1 - day
  return addDays(date, offset)
}

function buildWeekDates(date: Date) {
  const weekStart = startOfWeek(date)
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getEventsForDate(date: Date) {
  const dateKey = toDateKey(date)
  return supplementScheduleEvents.filter((event) => event.date === dateKey)
}

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat("sl-SI", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date)
}

export function SupplementsScheduleCalendar() {
  const [selectedDayForDialog, setSelectedDayForDialog] = useState<Date | null>(
    null
  )
  const visibleDates = buildWeekDates(referenceDate)

  return (
    <Dialog
      open={Boolean(selectedDayForDialog)}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedDayForDialog(null)
        }
      }}
    >
      <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-7 border-b border-neutral-200 bg-neutral-50">
              {weekdayLabels.map((label, index) => (
                <div
                  key={label}
                  className={cn(
                    "px-3 py-2 text-center text-xs font-medium text-neutral-500",
                    index !== weekdayLabels.length - 1 && "border-r border-neutral-200"
                  )}
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 bg-neutral-50">
              {visibleDates.map((date, index) => {
                const isSelected = toDateKey(date) === toDateKey(referenceDate)
                const events = getEventsForDate(date)

                return (
                  <div
                    key={toDateKey(date)}
                    className={cn(
                      "relative min-h-[34rem] p-2.5 align-top",
                      isSelected ? "bg-brand-50" : "bg-neutral-50",
                      index % 7 !== 6 && "border-r border-neutral-200",
                      isSelected &&
                        "after:absolute after:inset-x-0 after:top-0 after:h-0.5 after:bg-brand-500"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className={cn(
                          "mt-1 size-2 rounded-full",
                          isSelected ? "bg-brand-500" : "bg-transparent"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium text-neutral-700",
                          isSelected && "text-brand-600"
                        )}
                      >
                        {date.getDate()}
                      </span>
                    </div>

                    <div className="mt-6 space-y-2.5">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "rounded-lg border bg-white p-2.5 shadow-[0_1px_2px_rgba(17,24,39,0.05)]",
                            event.tone === "warning"
                              ? "border-orange-300/70"
                              : "border-neutral-200"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <div
                              className={cn(
                                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md text-white",
                                event.tone === "warning"
                                  ? "bg-orange-500/90"
                                  : "bg-brand-500"
                              )}
                            >
                              <IconPill className="size-3" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start gap-2">
                                <div className="truncate text-[11px] font-semibold text-neutral-900">
                                  {event.title}
                                </div>
                                <IconDots className="ml-auto size-3.5 shrink-0 text-neutral-300" />
                              </div>

                              <div className="mt-1 space-y-0.5 text-[10px] text-neutral-500">
                                <div>{event.slot}</div>
                                {event.cadence ? (
                                  <div className="text-orange-700/85">
                                    {event.cadence}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          <div className="mt-2 flex justify-end">
                            {event.completed ? (
                              <span className="inline-flex size-4 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <IconCheck className="size-3" />
                              </span>
                            ) : (
                              <span className="size-4" />
                            )}
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => setSelectedDayForDialog(date)}
                        className="flex w-full items-center gap-2 rounded-lg border border-dashed border-brand-500/70 bg-white px-3 py-3 text-left text-sm font-medium text-brand-600 transition hover:bg-brand-50/50"
                      >
                        <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
                          <IconPlus className="size-3.5" />
                        </span>
                        <span>Supplement</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <DialogContent className="gap-0 overflow-hidden rounded-sm border-neutral-200 bg-white p-0 shadow-2xl shadow-black/10 sm:max-w-[680px]">
        <div className="border-b border-neutral-200 px-5 py-4">
          <DialogTitle className="flex items-center gap-2 text-[18px] font-semibold text-neutral-950">
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
              <IconPill className="size-4" />
            </span>
            Dodaj supplement
          </DialogTitle>
          <p className="mt-2 text-sm text-neutral-500">
            {selectedDayForDialog
              ? `Izberi dodatek za ${formatDayLabel(selectedDayForDialog)}.`
              : "Izberi dodatek za izbran dan."}
          </p>
        </div>

        <div className="max-h-[70vh] space-y-2 overflow-y-auto px-5 py-4">
          {supplementLibrary.map((supplement) => (
            <button
              key={supplement.id}
              type="button"
              className="flex w-full items-start gap-3 rounded-sm border border-neutral-200 bg-white px-4 py-3 text-left transition hover:border-brand-500/40 hover:bg-brand-50/30"
            >
              <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
                <IconPill className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-neutral-950">
                  {supplement.title}
                </span>
                <span className="mt-1 block text-sm text-neutral-500">
                  {supplement.note}
                </span>
              </span>
              <span className="inline-flex items-center rounded-sm border border-neutral-200 px-2 py-1 text-xs font-medium text-neutral-600">
                Dodaj
              </span>
            </button>
          ))}
        </div>

        <DialogFooter className="border-t border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="justify-start px-0 text-neutral-600 hover:bg-transparent hover:text-neutral-900"
            >
              Zapri
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
