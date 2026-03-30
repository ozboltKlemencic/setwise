"use client"

import * as React from "react"

import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { Button } from "@/components/ui/button"
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
        "flex h-7 w-10 shrink-0 items-center rounded-full border bg-neutral-100 px-1 transition-colors",
        checked ? className : "border-neutral-200 bg-neutral-100",
      )}
      aria-pressed={checked}
    >
      <span
        className={cn(
          "size-5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-3" : "translate-x-0"
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
        className="gap-0 overflow-hidden rounded-[28px] border-neutral-200 bg-white p-0 shadow-2xl shadow-black/10 sm:max-w-[440px]"
      >
        <DialogHeader className="gap-0 px-7 pt-7 pb-5 text-left">
          <DialogTitle className="text-[17px] font-semibold text-neutral-950">
            Nastavi cilje
          </DialogTitle>
          <DialogDescription className="mt-1 text-[13px] leading-5 text-neutral-500">
            Izberi katere cilje zelis slediti za ta meal plan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-7 pb-7">
          <div className="grid grid-cols-3 gap-2.5">
            {mealPlanGoalPresets.map((preset) => {
              const isActive = draftValue.presetId === preset.id

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetClick(preset.id)}
                  className={cn(
                    "rounded-2xl border px-3 py-3 text-center transition-colors",
                    isActive
                      ? "border-brand-300 bg-brand-50/60 text-brand-700"
                      : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300 hover:bg-neutral-50"
                  )}
                >
                  <div className="text-[14px] font-semibold">{preset.label}</div>
                  <div className="mt-1 text-[12px] text-neutral-400">
                    {preset.calories} kcal
                  </div>
                </button>
              )
            })}
          </div>

          <div className="space-y-3">
            {(["calories", "protein", "carbs", "fat"] as MealPlanGoalKey[]).map((key) => {
              const tone = goalToneByKey[key]
              const labels = goalLabelByKey[key]
              const metric = draftValue[key]

              return (
                <div
                  key={key}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition-colors",
                    metric.enabled
                      ? tone.rowClassName
                      : "border-neutral-200 bg-white"
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

                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        metric.enabled ? tone.dotClassName : "bg-neutral-300"
                      )}
                    />
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
                    value={metric.value}
                    onChange={(event) => {
                      const nextValue = Number(event.target.value)
                      if (!Number.isNaN(nextValue) && nextValue >= 0) {
                        updateMetric(key, { value: nextValue })
                      }
                    }}
                    className={cn(
                      "h-10 w-[8.5rem] rounded-xl border bg-white text-[14px] font-semibold shadow-none focus-visible:ring-0",
                      metric.enabled
                        ? "border-neutral-200 text-neutral-950 focus-visible:border-neutral-300"
                        : "border-neutral-200 bg-neutral-50 text-neutral-300"
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

          <DialogFooter className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 rounded-2xl border-neutral-200 bg-white text-[14px] font-semibold text-neutral-500 shadow-none hover:bg-neutral-50 hover:text-neutral-800"
            >
              Preklici
            </Button>
            <PrimaryActionButton
              label="Shrani cilje"
              onClick={() => {
                onSave(draftValue)
                onOpenChange(false)
              }}
              className="h-11 rounded-2xl text-[14px] font-semibold"
            />
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
