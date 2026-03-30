"use client"

import * as React from "react"

import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { SecondaryActionButton } from "@/components/coachWise/secondary-action-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type MealPlanGoalPresetId = "cut" | "maintain" | "bulk"
export type MealPlanGoalKey = "calories" | "protein" | "carbs" | "fat"

export type MealPlanGoalMetricSettings = {
  enabled: boolean
  value: number
}

export type MealPlanGoalSettings = {
  presetId: MealPlanGoalPresetId | null
  calories: MealPlanGoalMetricSettings
  protein: MealPlanGoalMetricSettings
  carbs: MealPlanGoalMetricSettings
  fat: MealPlanGoalMetricSettings
}

type MealPlanGoalPreset = {
  id: MealPlanGoalPresetId
  label: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

const mealPlanGoalPresets: MealPlanGoalPreset[] = [
  { id: "cut", label: "Cut", calories: 1800, protein: 160, carbs: 150, fat: 60 },
  { id: "maintain", label: "Maintain", calories: 2500, protein: 180, carbs: 250, fat: 80 },
  { id: "bulk", label: "Bulk", calories: 3200, protein: 200, carbs: 380, fat: 95 },
]

type GoalTone = {
  rowClassName: string
  toggleClassName: string
  dotClassName: string
}

const goalToneByKey: Record<MealPlanGoalKey, GoalTone> = {
  calories: {
    rowClassName: "border-orange-200 bg-orange-50/55",
    toggleClassName: "border-orange-400/70 bg-orange-500",
    dotClassName: "bg-orange-500",
  },
  protein: {
    rowClassName: "border-emerald-200 bg-emerald-50/55",
    toggleClassName: "border-emerald-400/70 bg-emerald-500",
    dotClassName: "bg-emerald-500",
  },
  carbs: {
    rowClassName: "border-sky-200 bg-sky-50/55",
    toggleClassName: "border-sky-400/70 bg-sky-500",
    dotClassName: "bg-sky-500",
  },
  fat: {
    rowClassName: "border-yellow-200 bg-yellow-50/55",
    toggleClassName: "border-yellow-400/70 bg-yellow-500",
    dotClassName: "bg-yellow-500",
  },
}

const goalLabelByKey: Record<MealPlanGoalKey, { label: string; unit: string }> = {
  calories: { label: "Kalorije", unit: "kcal" },
  protein: { label: "Protein", unit: "g" },
  carbs: { label: "Ogljikovi hidrati", unit: "g" },
  fat: { label: "Mascobe", unit: "g" },
}

function cloneGoalSettings(settings: MealPlanGoalSettings): MealPlanGoalSettings {
  return {
    presetId: settings.presetId,
    calories: { ...settings.calories },
    protein: { ...settings.protein },
    carbs: { ...settings.carbs },
    fat: { ...settings.fat },
  }
}

export function createMealPlanGoalSettingsFromPreset(
  presetId: MealPlanGoalPresetId
): MealPlanGoalSettings {
  const preset = mealPlanGoalPresets.find((item) => item.id === presetId)

  if (!preset) {
    throw new Error(`Unknown meal plan goal preset: ${presetId}`)
  }

  return {
    presetId,
    calories: { enabled: true, value: preset.calories },
    protein: { enabled: true, value: preset.protein },
    carbs: { enabled: true, value: preset.carbs },
    fat: { enabled: true, value: preset.fat },
  }
}

export function createDefaultMealPlanGoalSettings(): MealPlanGoalSettings {
  const maintainPreset = createMealPlanGoalSettingsFromPreset("maintain")

  return {
    presetId: null,
    calories: { ...maintainPreset.calories, enabled: false },
    protein: { ...maintainPreset.protein, enabled: false },
    carbs: { ...maintainPreset.carbs, enabled: false },
    fat: { ...maintainPreset.fat, enabled: false },
  }
}

function GoalToggle({
  checked,
  onClick,
  className,
}: {
  checked: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-5.5 w-10 shrink-0 items-center rounded-full border bg-neutral-100 px-0.5 transition-colors",
        checked ? className : "border-neutral-200 bg-neutral-100",
      )}
      aria-pressed={checked}
    >
      <span
        className={cn(
          "size-3.5 rounded-full bg-neutral-50 shadow-sm transition-transform",
          checked ? "translate-x-[18px]" : "translate-x-0"
        )}
      />
      <span className="sr-only">{checked ? "Disable goal" : "Enable goal"}</span>
    </button>
  )
}

export function MealPlanGoalsDialog({
  open,
  onOpenChange,
  value,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: MealPlanGoalSettings
  onSave: (nextValue: MealPlanGoalSettings) => void
}) {
  const [draftValue, setDraftValue] = React.useState<MealPlanGoalSettings>(() =>
    cloneGoalSettings(value)
  )

  React.useEffect(() => {
    if (open) {
      setDraftValue(cloneGoalSettings(value))
    }
  }, [open, value])

  const updateMetric = React.useCallback(
    (
      key: MealPlanGoalKey,
      updater:
        | Partial<MealPlanGoalMetricSettings>
        | ((current: MealPlanGoalMetricSettings) => MealPlanGoalMetricSettings)
    ) => {
      setDraftValue((currentValue) => {
        const nextMetricValue =
          typeof updater === "function"
            ? updater(currentValue[key])
            : { ...currentValue[key], ...updater }

        return {
          ...currentValue,
          presetId: null,
          [key]: nextMetricValue,
        }
      })
    },
    []
  )

  const handlePresetClick = React.useCallback((presetId: MealPlanGoalPresetId) => {
    setDraftValue(createMealPlanGoalSettingsFromPreset(presetId))
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-[20px] border-neutral-200 bg-neutral-50 p-0 shadow-2xl shadow-black/12 sm:max-w-[440px]"
      >
        <DialogHeader className="w-full gap-0 px-7 pt-6 pb-1 text-left">
          <DialogTitle className="text-[17px] font-semibold text-neutral-950">
            Nastavi cilje
          </DialogTitle>
          <DialogDescription className="mt-1 max-w-[280px] text-[13px] leading-5 text-neutral-500">
            Izberi katere cilje zelis slediti za ta meal plan.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full space-y-5 px-7 pt-4 pb-5">
          <div className="grid grid-cols-3 gap-2.5">
            {mealPlanGoalPresets.map((preset) => {
              const isActive = draftValue.presetId === preset.id

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetClick(preset.id)}
                  className={cn(
                    "rounded-lg border px-2.5 py-2.5 text-center transition-colors",
                    isActive
                      ? "border-brand-500 bg-brand-50/35 text-neutral-950"
                      : "border-neutral-200 bg-white/30 text-neutral-900 hover:border-brand-300 hover:bg-brand-50/20"
                  )}
                >
                  <div className="text-[13px] font-semibold">{preset.label}</div>
                  <div className="mt-0.5 text-[11px] text-neutral-400">
                    {preset.calories} kcal
                  </div>
                </button>
              )
            })}
          </div>

          <div className="space-y-2.5">
            {(["calories", "protein", "carbs", "fat"] as MealPlanGoalKey[]).map((key) => {
              const tone = goalToneByKey[key]
              const labels = goalLabelByKey[key]
              const metric = draftValue[key]

              return (
                <div
                  key={key}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-3.5 py-3 transition-colors",
                    metric.enabled
                      ? tone.rowClassName
                      : "border-neutral-100 bg-neutral-50"
                  )}
                >
                  <GoalToggle
                    checked={metric.enabled}
                    onClick={() =>
                      updateMetric(key, (currentMetric) => ({
                        ...currentMetric,
                        enabled: !currentMetric.enabled,
                      }))
                    }
                    className={tone.toggleClassName}
                  />

                  <div className="flex min-w-0 flex-1 items-center">
                    <span
                      className={cn(
                        "truncate text-[14px] font-medium",
                        metric.enabled ? "text-neutral-950" : "text-neutral-400"
                      )}
                    >
                      {labels.label}
                    </span>
                  </div>

                  <Input
                    type="number"
                    min="0"
                    disabled={!metric.enabled}
                    value={metric.enabled ? metric.value : ""}
                    placeholder="-"
                    onChange={(event) => {
                      const nextValue = Number(event.target.value)
                      if (!Number.isNaN(nextValue) && nextValue >= 0) {
                        updateMetric(key, { value: nextValue })
                      }
                    }}
                    className={cn(
                      "h-10 w-[8.5rem] rounded-lg border bg-white/30 text-[14px] font-semibold shadow-none focus-visible:ring-0",
                      metric.enabled
                        ? "border-neutral-200 text-neutral-950 focus-visible:border-neutral-300"
                        : "border-transparent bg-transparent text-neutral-300 shadow-none"
                    )}
                  />
                  <span
                    className={cn(
                      "w-8 shrink-0 text-[13px]",
                      metric.enabled ? "text-neutral-400" : "text-neutral-300"
                    )}
                  >
                    {labels.unit}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <DialogFooter className="grid w-full grid-cols-2 gap-3 border-t border-neutral-200/70 bg-neutral-100/60 px-7 py-4 sm:grid-cols-2">
          <SecondaryActionButton
            label="Preklici"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-lg bg-neutral-50 justify-center text-[14px] font-semibold"
          />
          <PrimaryActionButton
            label="Shrani cilje"
            onClick={() => {
              onSave(draftValue)
              onOpenChange(false)
            }}
            className="h-11 rounded-lg  justify-center text-[14px] font-semibold"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
