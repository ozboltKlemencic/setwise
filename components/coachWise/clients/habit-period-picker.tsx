"use client"

import * as React from "react"
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type HabitPeriod = "week" | "month" | "year" | "custom"

export type HabitPeriodSelection = {
  period: HabitPeriod
  value: Date
  range: DateRange
}

export function getWeekStart(date: Date) {
  const nextDate = new Date(date)
  const day = nextDate.getDay()
  const diff = day === 0 ? -6 : 1 - day

  nextDate.setDate(nextDate.getDate() + diff)
  nextDate.setHours(0, 0, 0, 0)

  return nextDate
}

export function getWeekEnd(date: Date) {
  const nextDate = getWeekStart(date)
  nextDate.setDate(nextDate.getDate() + 6)
  nextDate.setHours(0, 0, 0, 0)

  return nextDate
}

export function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function getMonthEnd(date: Date) {
  const nextDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  nextDate.setHours(23, 59, 59, 999)

  return nextDate
}

export function getYearStart(date: Date) {
  return new Date(date.getFullYear(), 0, 1)
}

export function getNextMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1)
}

function formatHabitMonth(date: Date | undefined) {
  if (!date) {
    return "Izberi mesec"
  }

  return date.toLocaleDateString("sl-SI", {
    month: "long",
    year: "numeric",
  })
}

function formatHabitWeekRange(range: DateRange | undefined) {
  if (!range?.from) {
    return "Izberi obdobje"
  }

  if (!range.to) {
    return range.from.toLocaleDateString("sl-SI", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const sameYear = range.from.getFullYear() === range.to.getFullYear()

  return `${range.from.toLocaleDateString("sl-SI", {
    day: "2-digit",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  })} - ${range.to.toLocaleDateString("sl-SI", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`
}

function getHabitPickerLabel(
  period: HabitPeriod,
  date: Date,
  weekRange?: DateRange,
  customRange?: DateRange
) {
  if (period === "week") {
    return `Teden \u00b7 ${formatHabitWeekRange(weekRange)}`
  }

  if (period === "custom") {
    return `Custom \u00b7 ${formatHabitWeekRange(customRange)}`
  }

  if (period === "year") {
    return `Leto \u00b7 ${date.getFullYear()}`
  }

  return `Mesec \u00b7 ${formatHabitMonth(date)}`
}

function cloneDateRange(range: DateRange): DateRange {
  return {
    from: range.from ? new Date(range.from) : undefined,
    to: range.to ? new Date(range.to) : undefined,
  }
}

function buildConfirmedSelection(
  period: HabitPeriod,
  value: Date,
  range: DateRange
): HabitPeriodSelection {
  return {
    period,
    value: new Date(value),
    range: cloneDateRange(range),
  }
}

const habitMonthOptions = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Maj",
  "Jun",
  "Jul",
  "Avg",
  "Sep",
  "Okt",
  "Nov",
  "Dec",
]

type HabitPeriodPickerProps = {
  period: HabitPeriod
  onPeriodChange: (value: HabitPeriod) => void
  value: Date
  onChange: (value: Date) => void
  weekRange: DateRange | undefined
  onWeekRangeChange: (value: DateRange | undefined) => void
  customRange: DateRange | undefined
  onCustomRangeChange: (value: DateRange | undefined) => void
  availableYears: number[]
  onConfirm?: (selection: HabitPeriodSelection) => void
}

export function HabitPeriodPicker({
  period,
  onPeriodChange,
  value,
  onChange,
  weekRange,
  onWeekRangeChange,
  customRange,
  onCustomRangeChange,
  availableYears,
  onConfirm,
}: HabitPeriodPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [viewMonth, setViewMonth] = React.useState<Date>(
    weekRange?.from ?? customRange?.from ?? value
  )
  const [draftWeekRange, setDraftWeekRange] = React.useState<DateRange | undefined>(
    weekRange
  )
  const [draftCustomRange, setDraftCustomRange] = React.useState<DateRange | undefined>(
    customRange
  )
  const [draftMonth, setDraftMonth] = React.useState<Date>(getMonthStart(value))
  const [draftYear, setDraftYear] = React.useState<number>(value.getFullYear())
  const [leftCustomMonth, setLeftCustomMonth] = React.useState<Date>(
    getMonthStart(customRange?.from ?? value)
  )
  const [rightCustomMonth, setRightCustomMonth] = React.useState<Date>(
    getMonthStart(customRange?.to ?? getNextMonth(customRange?.from ?? value))
  )
  const label = getHabitPickerLabel(period, value, weekRange, customRange)
  const triggerWidth = `clamp(11rem, ${Math.max(label.length + 8, 20)}ch, 24rem)`

  React.useEffect(() => {
    if (period === "week") {
      setViewMonth(getMonthStart(weekRange?.from ?? value))
      return
    }

    if (period === "custom") {
      setViewMonth(customRange?.from ?? value)
      return
    }

    setViewMonth(value)
  }, [customRange?.from, period, value, weekRange?.from])

  React.useEffect(() => {
    if (period === "year" && open) {
      setDraftYear(value.getFullYear())
    }

    if (period === "week" && open) {
      setDraftWeekRange(weekRange)
      setViewMonth(getMonthStart(weekRange?.from ?? value))
    }

    if (period === "month" && open) {
      setDraftMonth(getMonthStart(value))
    }

    if (period === "custom" && open) {
      setDraftCustomRange(customRange)
      const nextLeftMonth = getMonthStart(customRange?.from ?? value)
      const nextRightMonth = getMonthStart(
        customRange?.to ?? getNextMonth(customRange?.from ?? value)
      )

      setLeftCustomMonth(nextLeftMonth)
      setRightCustomMonth(
        nextRightMonth < nextLeftMonth ? nextLeftMonth : nextRightMonth
      )
    }
  }, [customRange, open, period, value, weekRange])

  const minAvailableMonth = React.useMemo(
    () => new Date(Math.min(...availableYears), 0, 1),
    [availableYears]
  )
  const maxAvailableMonth = React.useMemo(
    () => new Date(Math.max(...availableYears), 11, 1),
    [availableYears]
  )
  const canGoToPreviousMonth = draftMonth > minAvailableMonth
  const canGoToNextMonth = draftMonth < maxAvailableMonth
  const canGoToPreviousLeftCustomMonth = leftCustomMonth > minAvailableMonth
  const canGoToNextLeftCustomMonth = leftCustomMonth < maxAvailableMonth
  const canGoToPreviousRightCustomMonth = rightCustomMonth > minAvailableMonth
  const canGoToNextRightCustomMonth = rightCustomMonth < maxAvailableMonth

  const handleDraftMonthOffset = React.useCallback((offset: number) => {
    setDraftMonth((currentDraftMonth) =>
      getMonthStart(
        new Date(
          currentDraftMonth.getFullYear(),
          currentDraftMonth.getMonth() + offset,
          1
        )
      )
    )
  }, [])

  const handleWeekDaySelect = React.useCallback(
    (
      anchorDate: Date | undefined,
      event?: {
        currentTarget: EventTarget | null
      }
    ) => {
      if (!anchorDate) {
        return
      }

      const fullWeekRange = {
        from: getWeekStart(anchorDate),
        to: getWeekEnd(anchorDate),
      }

      const leftDisplayedMonth = getMonthStart(viewMonth)
      const rightDisplayedMonth = getNextMonth(leftDisplayedMonth)
      const rightDisplayedMonthEnd = getMonthEnd(rightDisplayedMonth)

      setDraftWeekRange(fullWeekRange)

      if (
        fullWeekRange.from < leftDisplayedMonth ||
        fullWeekRange.to > rightDisplayedMonthEnd
      ) {
        setViewMonth(getMonthStart(fullWeekRange.from))
      }

      const target =
        event?.currentTarget instanceof HTMLElement ? event.currentTarget : null

      if (target) {
        requestAnimationFrame(() => {
          target.blur()
        })
      }
    },
    [viewMonth]
  )

  const handleLeftCustomMonthChange = React.useCallback((nextMonth: Date) => {
    const normalizedMonth = getMonthStart(nextMonth)

    setLeftCustomMonth(normalizedMonth)
    setRightCustomMonth((currentRightMonth) =>
      normalizedMonth > currentRightMonth ? normalizedMonth : currentRightMonth
    )
  }, [])

  const handleRightCustomMonthChange = React.useCallback((nextMonth: Date) => {
    const normalizedMonth = getMonthStart(nextMonth)

    setRightCustomMonth(normalizedMonth)
    setLeftCustomMonth((currentLeftMonth) =>
      normalizedMonth < currentLeftMonth ? normalizedMonth : currentLeftMonth
    )
  }, [])

  const handleLeftCustomMonthOffset = React.useCallback(
    (offset: number) => {
      handleLeftCustomMonthChange(
        new Date(
          leftCustomMonth.getFullYear(),
          leftCustomMonth.getMonth() + offset,
          1
        )
      )
    },
    [handleLeftCustomMonthChange, leftCustomMonth]
  )

  const handleRightCustomMonthOffset = React.useCallback(
    (offset: number) => {
      handleRightCustomMonthChange(
        new Date(
          rightCustomMonth.getFullYear(),
          rightCustomMonth.getMonth() + offset,
          1
        )
      )
    },
    [handleRightCustomMonthChange, rightCustomMonth]
  )

  const canConfirmWeek = Boolean(draftWeekRange?.from && draftWeekRange?.to)
  const canConfirmCustom = Boolean(draftCustomRange?.from && draftCustomRange?.to)

  const emitConfirm = React.useCallback(
    (selection: HabitPeriodSelection) => {
      onConfirm?.(buildConfirmedSelection(selection.period, selection.value, selection.range))
      setOpen(false)
    },
    [onConfirm]
  )

  return (
    <div className="relative max-w-full shrink-0" style={{ width: triggerWidth }}>
      <Input
        readOnly
        title={label}
        value={label}
        className="h-9 cursor-pointer rounded-sm border-neutral-200/80 pr-12 text-[13px] font-medium text-neutral-800 capitalize shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
        onClick={() => setOpen(true)}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center gap-0.5 rounded-sm text-neutral-400 shadow-none hover:bg-neutral-100 hover:text-neutral-600"
          >
            <CalendarDays className="size-4" />
            <ChevronDown className="size-3.5" />
            <span className="sr-only">Izberi obdobje</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className={cn(
            "rounded-sm border-neutral-200/80 p-0 shadow-lg shadow-black/5",
            period === "week" || period === "custom"
              ? "w-auto max-w-[calc(100vw-24px)] overflow-hidden"
              : "w-[280px] overflow-hidden"
          )}
        >
          <div className="border-b border-neutral-200 p-2">
            <div className="inline-flex w-full overflow-hidden rounded-sm border border-neutral-200 bg-white">
              {([
                { value: "week", label: "Teden" },
                { value: "month", label: "Mesec" },
                { value: "year", label: "Leto" },
                { value: "custom", label: "Custom" },
              ] as const).map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant="ghost"
                  className={cn(
                    "flex-1 rounded-none px-3 text-[13px] text-neutral-600 shadow-none hover:bg-neutral-50",
                    period === option.value && "bg-brand-50 text-brand-700"
                  )}
                  onClick={() => onPeriodChange(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {period === "year" ? (
            <div>
              <div className="grid grid-cols-2 gap-2 p-3">
                {availableYears.map((year) => {
                  const isActive = draftYear === year

                  return (
                    <Button
                      key={year}
                      type="button"
                      variant="outline"
                      className={cn(
                        "rounded-sm border-neutral-200 text-[13px] shadow-none hover:bg-neutral-50",
                        isActive && "border-brand-300 bg-brand-50 text-brand-700"
                      )}
                      onClick={() => {
                        setDraftYear(year)
                      }}
                    >
                      {year}
                    </Button>
                  )
                })}
              </div>
              <div className="flex justify-end border-t border-neutral-200 px-3 py-2">
                <Button
                  type="button"
                  size="sm"
                  className="rounded-sm bg-linear-to-r from-brand-500 to-brand-600 px-3 text-white shadow-none hover:from-brand-600 hover:to-brand-700"
                  onClick={() => {
                    const nextValue = new Date(draftYear, 0, 1)
                    const nextRange = {
                      from: getYearStart(nextValue),
                      to: getMonthEnd(new Date(draftYear, 11, 1)),
                    }

                    onChange(nextValue)
                    emitConfirm(
                      buildConfirmedSelection("year", nextValue, nextRange)
                    )
                  }}
                >
                  Potrdi
                </Button>
              </div>
            </div>
          ) : period === "week" ? (
            <div>
              <Calendar
                mode="range"
                month={viewMonth}
                selected={draftWeekRange}
                numberOfMonths={2}
                startMonth={new Date(Math.min(...availableYears), 0, 1)}
                endMonth={new Date(Math.max(...availableYears), 11, 1)}
                modifiersClassNames={{
                  outside: "text-neutral-400",
                }}
                modifiersStyles={{
                  outside: {
                    opacity: 0.7,
                  },
                }}
                onMonthChange={setViewMonth}
                onSelect={(_range, anchorDate, _modifiers, event) => {
                  handleWeekDaySelect(anchorDate, event)
                }}
              />
              <div className="flex justify-end border-t border-neutral-200 px-3 py-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={!canConfirmWeek}
                  className="rounded-sm bg-linear-to-r from-brand-500 to-brand-600 px-3 text-white shadow-none hover:from-brand-600 hover:to-brand-700 disabled:opacity-45"
                  onClick={() => {
                    if (!draftWeekRange?.from || !draftWeekRange?.to) {
                      return
                    }

                    onWeekRangeChange(draftWeekRange)
                    onChange(draftWeekRange.from)
                    emitConfirm(
                      buildConfirmedSelection(
                        "week",
                        draftWeekRange.from,
                        draftWeekRange
                      )
                    )
                  }}
                >
                  Potrdi
                </Button>
              </div>
            </div>
          ) : period === "custom" ? (
            <div>
              <div className="grid gap-0 border-b border-neutral-200 md:grid-cols-2">
                <div className="border-neutral-200 md:border-r">
                  <div className="flex items-center justify-center px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={!canGoToPreviousLeftCustomMonth}
                        className="size-8 rounded-sm text-neutral-600 shadow-none hover:bg-neutral-100 disabled:opacity-35"
                        onClick={() => handleLeftCustomMonthOffset(-1)}
                      >
                        <ChevronLeft className="size-4" />
                        <span className="sr-only">Prejsnji mesec</span>
                      </Button>
                      <Select
                        value={String(leftCustomMonth.getMonth())}
                        onValueChange={(month) => {
                          handleLeftCustomMonthChange(
                            new Date(leftCustomMonth.getFullYear(), Number(month), 1)
                          )
                        }}
                      >
                        <SelectTrigger className="h-9 min-w-[5.25rem] rounded-sm border-neutral-200 bg-white px-3 text-[13px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-sm border-neutral-200 shadow-lg shadow-black/5">
                          {habitMonthOptions.map((monthLabel, index) => (
                            <SelectItem key={monthLabel} value={String(index)}>
                              {monthLabel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={String(leftCustomMonth.getFullYear())}
                        onValueChange={(year) => {
                          handleLeftCustomMonthChange(
                            new Date(Number(year), leftCustomMonth.getMonth(), 1)
                          )
                        }}
                      >
                        <SelectTrigger className="h-9 min-w-[5.5rem] rounded-sm border-neutral-200 bg-white px-3 text-[13px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-sm border-neutral-200 shadow-lg shadow-black/5">
                          {availableYears.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={!canGoToNextLeftCustomMonth}
                        className="size-8 rounded-sm text-neutral-600 shadow-none hover:bg-neutral-100 disabled:opacity-35"
                        onClick={() => handleLeftCustomMonthOffset(1)}
                      >
                        <ChevronRight className="size-4" />
                        <span className="sr-only">Naslednji mesec</span>
                      </Button>
                    </div>
                  </div>
                  <Calendar
                    mode="range"
                    month={leftCustomMonth}
                    selected={draftCustomRange}
                    classNames={{
                      month_caption: "hidden",
                      nav: "hidden",
                    }}
                    startMonth={new Date(Math.min(...availableYears), 0, 1)}
                    endMonth={new Date(Math.max(...availableYears), 11, 1)}
                    modifiersClassNames={{
                      outside: "text-neutral-400",
                    }}
                    modifiersStyles={{
                      outside: {
                        opacity: 0.7,
                      },
                    }}
                    onMonthChange={handleLeftCustomMonthChange}
                    onSelect={(range) => {
                      setDraftCustomRange(range)
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-center px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={!canGoToPreviousRightCustomMonth}
                        className="size-8 rounded-sm text-neutral-600 shadow-none hover:bg-neutral-100 disabled:opacity-35"
                        onClick={() => handleRightCustomMonthOffset(-1)}
                      >
                        <ChevronLeft className="size-4" />
                        <span className="sr-only">Prejsnji mesec</span>
                      </Button>
                      <Select
                        value={String(rightCustomMonth.getMonth())}
                        onValueChange={(month) => {
                          handleRightCustomMonthChange(
                            new Date(
                              rightCustomMonth.getFullYear(),
                              Number(month),
                              1
                            )
                          )
                        }}
                      >
                        <SelectTrigger className="h-9 min-w-[5.25rem] rounded-sm border-neutral-200 bg-white px-3 text-[13px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-sm border-neutral-200 shadow-lg shadow-black/5">
                          {habitMonthOptions.map((monthLabel, index) => (
                            <SelectItem key={monthLabel} value={String(index)}>
                              {monthLabel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={String(rightCustomMonth.getFullYear())}
                        onValueChange={(year) => {
                          handleRightCustomMonthChange(
                            new Date(Number(year), rightCustomMonth.getMonth(), 1)
                          )
                        }}
                      >
                        <SelectTrigger className="h-9 min-w-[5.5rem] rounded-sm border-neutral-200 bg-white px-3 text-[13px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-sm border-neutral-200 shadow-lg shadow-black/5">
                          {availableYears.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={!canGoToNextRightCustomMonth}
                        className="size-8 rounded-sm text-neutral-600 shadow-none hover:bg-neutral-100 disabled:opacity-35"
                        onClick={() => handleRightCustomMonthOffset(1)}
                      >
                        <ChevronRight className="size-4" />
                        <span className="sr-only">Naslednji mesec</span>
                      </Button>
                    </div>
                  </div>
                  <Calendar
                    mode="range"
                    month={rightCustomMonth}
                    selected={draftCustomRange}
                    classNames={{
                      month_caption: "hidden",
                      nav: "hidden",
                    }}
                    startMonth={new Date(Math.min(...availableYears), 0, 1)}
                    endMonth={new Date(Math.max(...availableYears), 11, 1)}
                    modifiersClassNames={{
                      outside: "text-neutral-400",
                    }}
                    modifiersStyles={{
                      outside: {
                        opacity: 0.7,
                      },
                    }}
                    onMonthChange={handleRightCustomMonthChange}
                    onSelect={(range) => {
                      setDraftCustomRange(range)
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end border-t border-neutral-200 px-3 py-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={!canConfirmCustom}
                  className="rounded-sm bg-linear-to-r from-brand-500 to-brand-600 px-3 text-white shadow-none hover:from-brand-600 hover:to-brand-700 disabled:opacity-45"
                  onClick={() => {
                    if (!draftCustomRange?.from || !draftCustomRange?.to) {
                      return
                    }

                    onCustomRangeChange(draftCustomRange)
                    onChange(draftCustomRange.from)
                    emitConfirm(
                      buildConfirmedSelection(
                        "custom",
                        draftCustomRange.from,
                        draftCustomRange
                      )
                    )
                  }}
                >
                  Potrdi
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-center px-3 py-3">
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={!canGoToPreviousMonth}
                    className="size-8 rounded-sm text-neutral-600 shadow-none hover:bg-neutral-100 disabled:opacity-35"
                    onClick={() => handleDraftMonthOffset(-1)}
                  >
                    <ChevronLeft className="size-4" />
                    <span className="sr-only">Prejsnji mesec</span>
                  </Button>
                  <Select
                    value={String(draftMonth.getMonth())}
                    onValueChange={(month) => {
                      setDraftMonth(
                        getMonthStart(
                          new Date(draftMonth.getFullYear(), Number(month), 1)
                        )
                      )
                    }}
                  >
                    <SelectTrigger className="h-9 min-w-[5.25rem] rounded-sm border-neutral-200 bg-white px-3 text-[13px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-sm border-neutral-200 shadow-lg shadow-black/5">
                      {habitMonthOptions.map((monthLabel, index) => (
                        <SelectItem key={monthLabel} value={String(index)}>
                          {monthLabel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={String(draftMonth.getFullYear())}
                    onValueChange={(year) => {
                      setDraftMonth(
                        getMonthStart(
                          new Date(Number(year), draftMonth.getMonth(), 1)
                        )
                      )
                    }}
                  >
                    <SelectTrigger className="h-9 min-w-[5.5rem] rounded-sm border-neutral-200 bg-white px-3 text-[13px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-sm border-neutral-200 shadow-lg shadow-black/5">
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={!canGoToNextMonth}
                    className="size-8 rounded-sm text-neutral-600 shadow-none hover:bg-neutral-100 disabled:opacity-35"
                    onClick={() => handleDraftMonthOffset(1)}
                  >
                    <ChevronRight className="size-4" />
                    <span className="sr-only">Naslednji mesec</span>
                  </Button>
                </div>
              </div>
              <div className="flex justify-end border-t border-neutral-200 px-3 py-2">
                <Button
                  type="button"
                  size="sm"
                  className="rounded-sm bg-linear-to-r from-brand-500 to-brand-600 px-3 text-white shadow-none hover:from-brand-600 hover:to-brand-700"
                  onClick={() => {
                    const nextValue = getMonthStart(draftMonth)
                    const nextRange = {
                      from: getMonthStart(draftMonth),
                      to: getMonthEnd(draftMonth),
                    }

                    onChange(nextValue)
                    emitConfirm(
                      buildConfirmedSelection("month", nextValue, nextRange)
                    )
                  }}
                >
                  Potrdi
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
