"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Flame,
  Lock,
  LockOpen,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"

import { buildStoredNutritionMacroPlanFromBuilderState } from "@/components/coachWise/clients/nutrition/macro-plan-builder-data"
import type { NutritionBuilderClientOption } from "@/components/coachWise/clients/nutrition/nutrition-builder-client-options"
import { NutritionBuilderClientPicker } from "@/components/coachWise/clients/nutrition/nutrition-builder-client-picker"
import { NutritionBuilderNav } from "@/components/coachWise/clients/nutrition/nutrition-builder-nav"
import { OverflowActionsMenu } from "@/components/coachWise/overflow-actions-menu"
import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { SecondaryActionButton } from "@/components/coachWise/secondary-action-button"
import { buildCoachWiseHref } from "@/components/coachWise/sidebar/route-utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getNutritionCreateMealPlanFromTargetsHref } from "@/lib/handlers/nutrition.handlers"
import {
  GLOBAL_NUTRITION_MEAL_PLANS_STORAGE_SCOPE,
  resolveNutritionMealPlanStorageScopeFromPath,
  upsertStoredNutritionMealPlan,
  type StoredNutritionMacroPlanBuilderSnapshot,
} from "@/lib/handlers/nutrition-plan-storage"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type MacroKey = "p" | "c" | "f"

type MacroBuilderPreset = {
  id: string
  name: string
  p: number
  c: number
  f: number
}

const defaultMacroPresets: MacroBuilderPreset[] = [
  { id: "default-0", name: "High Protein", p: 40, c: 35, f: 25 },
  { id: "default-1", name: "Balanced", p: 33, c: 33, f: 33 },
  { id: "default-2", name: "Low Carb", p: 40, c: 20, f: 40 },
  { id: "default-3", name: "High Carb", p: 30, c: 50, f: 20 },
]

const macroMeta = {
  p: {
    label: "Protein",
    accent: "bg-emerald-500",
    surface: "border-emerald-200 bg-emerald-50/60",
    text: "text-emerald-700",
    ring: "#22c55e",
  },
  c: {
    label: "Carbs",
    accent: "bg-sky-500",
    surface: "border-sky-200 bg-sky-50/60",
    text: "text-sky-700",
    ring: "#3b82f6",
  },
  f: {
    label: "Fat",
    accent: "bg-amber-500",
    surface: "border-amber-200 bg-amber-50/60",
    text: "text-amber-700",
    ring: "#f59e0b",
  },
} satisfies Record<
  MacroKey,
  {
    label: string
    accent: string
    surface: string
    text: string
    ring: string
  }
>

function getPresetLabel(preset: Pick<MacroBuilderPreset, MacroKey>) {
  return `${preset.p}/${preset.c}/${preset.f}`
}

const macroRangeStyles = `
  .macro-range {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    border: 0;
    border-radius: 9999px;
    background:
      linear-gradient(
        to right,
        var(--macro-accent) 0%,
        var(--macro-accent) var(--macro-progress),
        #d4d4d8 var(--macro-progress),
        #d4d4d8 100%
      );
    outline: none;
  }

  .macro-range::-webkit-slider-runnable-track {
    height: 6px;
    border: 0;
    border-radius: 9999px;
    background: transparent;
  }

  .macro-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    margin-top: -5px;
    border: 0;
    border-radius: 9999px;
    background: var(--macro-accent);
    box-shadow: none;
  }

  .macro-range::-moz-range-track {
    height: 6px;
    border: 0;
    border-radius: 9999px;
    background: transparent;
  }

  .macro-range::-moz-range-progress {
    height: 6px;
    border: 0;
    border-radius: 9999px;
    background: var(--macro-accent);
  }

  .macro-range::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border: 0;
    border-radius: 9999px;
    background: var(--macro-accent);
    box-shadow: none;
  }
`

function MacroPresetChip({
  preset,
  isActive,
  isChanged,
  isEditing,
  canDelete,
  editingName,
  onSelect,
  onStartEditing,
  onEditingNameChange,
  onCommitEditing,
  onCancelEditing,
  onDelete,
}: {
  preset: MacroBuilderPreset
  isActive: boolean
  isChanged: boolean
  isEditing: boolean
  canDelete: boolean
  editingName: string
  onSelect: () => void
  onStartEditing: () => void
  onEditingNameChange: (nextValue: string) => void
  onCommitEditing: () => void
  onCancelEditing: () => void
  onDelete: () => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onSelect()
        }
      }}
      className={cn(
        "group relative min-w-[104px] rounded-xl border px-3 py-2 text-left transition-colors",
        isActive
          ? "border-brand-300 bg-brand-50/60 text-brand-700"
          : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100",
        isChanged && "border-amber-300 bg-amber-50/60 text-amber-800"
      )}
    >
      {isEditing ? (
        <Input
          autoFocus
          value={editingName}
          onChange={(event) => onEditingNameChange(event.target.value)}
          onBlur={onCommitEditing}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onCommitEditing()
            }
            if (event.key === "Escape") {
              onCancelEditing()
            }
          }}
          onClick={(event) => event.stopPropagation()}
          className="h-7 rounded-sm border-neutral-200 bg-white px-2 text-[12px] font-medium shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
        />
      ) : (
        <div
          className="pr-7 text-[12.5px] font-medium"
          onDoubleClick={(event) => {
            event.stopPropagation()
            onStartEditing()
          }}
        >
          {preset.name}
        </div>
      )}

      <div className={cn("mt-0.5 text-[11px]", isActive ? "text-brand-500" : "text-neutral-500")}>
        {getPresetLabel(preset)}
      </div>

      {!isEditing ? (
        <OverflowActionsMenu
          triggerLabel={`Open actions for ${preset.name}`}
          items={[
            {
              id: "edit",
              label: "Edit preset",
              icon: Pencil,
              onSelect: onStartEditing,
            },
            {
              id: "delete",
              label: "Delete preset",
              icon: Trash2,
              variant: "destructive",
              disabled: !canDelete,
              onSelect: () => {
                if (!canDelete) {
                  return
                }

                onDelete()
              },
            },
          ]}
          triggerClassName="absolute top-1/2 right-1 z-10 -translate-y-1/2 cursor-pointer border-transparent bg-transparent opacity-100 shadow-none hover:border-transparent hover:bg-transparent hover:text-foreground data-[state=open]:border-transparent data-[state=open]:bg-transparent data-[state=open]:opacity-100"
        />
      ) : null}
    </div>
  )
}

function MacroSliderCard({
  macroKey,
  value,
  grams,
  locked,
  onToggleLock,
  onChangeValue,
}: {
  macroKey: MacroKey
  value: number
  grams: number
  locked: boolean
  onToggleLock: () => void
  onChangeValue: (nextValue: number) => void
}) {
  const meta = macroMeta[macroKey]
  const [isEditingValue, setIsEditingValue] = React.useState(false)
  const [draftValue, setDraftValue] = React.useState(String(value))
  const sliderProgress = `${((value - 5) / 55) * 100}%`

  React.useEffect(() => {
    if (!isEditingValue) {
      setDraftValue(String(value))
    }
  }, [isEditingValue, value])

  const commitDraftValue = React.useCallback(() => {
    const parsedValue = Number.parseInt(draftValue, 10)

    if (!Number.isNaN(parsedValue)) {
      onChangeValue(parsedValue)
    }

    setIsEditingValue(false)
  }, [draftValue, onChangeValue])

  return (
    <div className="space-y-2.5 py-1">
      <div className="flex items-center gap-2.5">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={onToggleLock}
          className={cn(
            "size-7 rounded-md shadow-none",
            locked
              ? "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50"
              : "border-neutral-200 bg-neutral-50 text-neutral-500 hover:bg-white"
          )}
        >
          {locked ? <Lock className="size-3.5" /> : <LockOpen className="size-3.5" />}
          <span className="sr-only">
            {locked ? "Unlock macro" : "Lock macro"}
          </span>
        </Button>

        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-medium text-neutral-950">
            {meta.label}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditingValue ? (
            <Input
              autoFocus
              type="number"
              min="5"
              max="60"
              value={draftValue}
              onChange={(event) => setDraftValue(event.target.value)}
              onBlur={commitDraftValue}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  commitDraftValue()
                }

                if (event.key === "Escape") {
                  setDraftValue(String(value))
                  setIsEditingValue(false)
                }
              }}
              onFocus={(event) => event.target.select()}
              className="h-7 w-[66px] rounded-sm border-neutral-200 px-2 text-center text-[14px] font-semibold shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingValue(true)}
              className={cn(
                "rounded-md bg-neutral-50 px-2 py-0.5 text-[18px] font-semibold transition-colors hover:bg-neutral-100",
                meta.text
              )}
            >
              {value}%
            </button>
          )}
          <span className="text-[12px] font-medium text-neutral-500">
            {grams}g
          </span>
        </div>
      </div>

      <input
        type="range"
        min="5"
        max="60"
        value={value}
        onChange={(event) => onChangeValue(Number(event.target.value))}
        disabled={locked}
        className={cn("macro-range w-full cursor-pointer", locked && "opacity-45")}
        style={
          {
            "--macro-accent": meta.ring,
            "--macro-progress": sliderProgress,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

export function MacroPlanBuilderPageView({
  backHref,
  mealPlanId,
  initialSnapshot,
  createdAt,
  clientOptions,
  initialAssignedClientIds,
}: {
  backHref: string
  mealPlanId?: string
  initialSnapshot?: StoredNutritionMacroPlanBuilderSnapshot | null
  createdAt?: string
  clientOptions?: NutritionBuilderClientOption[]
  initialAssignedClientIds?: string[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const storageScopeId = React.useMemo(
    () =>
      resolveNutritionMealPlanStorageScopeFromPath(backHref) ??
      resolveNutritionMealPlanStorageScopeFromPath(pathname),
    [backHref, pathname]
  )
  const initialPresets =
    initialSnapshot?.presets?.length
      ? initialSnapshot.presets.map((preset) => ({ ...preset }))
      : defaultMacroPresets.map((preset) => ({ ...preset }))
  const presetIdRef = React.useRef(initialPresets.length)
  const [planName, setPlanName] = React.useState(
    initialSnapshot?.planName || "Macro Plan (IIFYM)"
  )
  const [isEditingName, setIsEditingName] = React.useState(false)
  const [calories, setCalories] = React.useState(
    initialSnapshot?.calories ?? 2000
  )
  const [macros, setMacros] = React.useState<Record<MacroKey, number>>({
    p: initialSnapshot?.macros.p ?? 40,
    c: initialSnapshot?.macros.c ?? 35,
    f: initialSnapshot?.macros.f ?? 25,
  })
  const [presets, setPresets] =
    React.useState<MacroBuilderPreset[]>(initialPresets)
  const [selectedPresetId, setSelectedPresetId] = React.useState<string | null>(
    initialSnapshot?.selectedPresetId ?? initialPresets[0]?.id ?? null
  )
  const [lockedMacros, setLockedMacros] = React.useState<Set<MacroKey>>(
    () =>
      initialSnapshot?.lockedMacroKey
        ? new Set<MacroKey>([initialSnapshot.lockedMacroKey])
        : new Set()
  )
  const [editingPresetId, setEditingPresetId] = React.useState<string | null>(
    null
  )
  const [editingPresetName, setEditingPresetName] = React.useState("")
  const [showCreatePresetInput, setShowCreatePresetInput] = React.useState(false)
  const [newPresetName, setNewPresetName] = React.useState("")
  const [assignedClientIds, setAssignedClientIds] = React.useState<string[]>(
    () => initialAssignedClientIds ?? []
  )

  const selectedPreset = React.useMemo(
    () => presets.find((preset) => preset.id === selectedPresetId) ?? null,
    [presets, selectedPresetId]
  )
  const totalPercent = macros.p + macros.c + macros.f
  const canSave = totalPercent === 100
  const hasPresetChanged =
    !!selectedPreset &&
    (selectedPreset.p !== macros.p ||
      selectedPreset.c !== macros.c ||
      selectedPreset.f !== macros.f)
  const showClientPicker =
    storageScopeId === GLOBAL_NUTRITION_MEAL_PLANS_STORAGE_SCOPE &&
    Boolean(clientOptions?.length)

  const grams = React.useMemo(
    () => ({
      p: Math.round((calories * macros.p) / 100 / 4),
      c: Math.round((calories * macros.c) / 100 / 4),
      f: Math.round((calories * macros.f) / 100 / 9),
    }),
    [calories, macros]
  )

  const applyPreset = React.useCallback((preset: MacroBuilderPreset) => {
    setMacros({ p: preset.p, c: preset.c, f: preset.f })
    setSelectedPresetId(preset.id)
  }, [])

  const toggleLock = React.useCallback((macroKey: MacroKey) => {
    setLockedMacros((currentLockedMacros) => {
      if (currentLockedMacros.has(macroKey)) {
        return new Set()
      }

      return new Set([macroKey])
    })
  }, [])

  const updateMacroValue = React.useCallback(
    (macroKey: MacroKey, nextValue: number) => {
      setMacros((currentMacros) => {
        const otherKeys = (["p", "c", "f"] as MacroKey[]).filter(
          (key) => key !== macroKey && !lockedMacros.has(key)
        )
        const clampedValue = Math.max(5, Math.min(60, nextValue))

        if (!otherKeys.length) {
          return { ...currentMacros, [macroKey]: clampedValue }
        }

        const previousValue = currentMacros[macroKey]
        const delta = clampedValue - previousValue

        if (otherKeys.length === 2) {
          const [firstKey, secondKey] = otherKeys
          const firstValue = currentMacros[firstKey]
          const secondValue = currentMacros[secondKey]
          const totalOther = firstValue + secondValue

          if (totalOther <= 0) {
            return { ...currentMacros, [macroKey]: clampedValue }
          }

          let nextFirstValue = Math.round(
            firstValue - delta * (firstValue / totalOther)
          )
          let nextSecondValue = Math.round(
            secondValue - delta * (secondValue / totalOther)
          )

          nextFirstValue = Math.max(5, Math.min(60, nextFirstValue))
          nextSecondValue = Math.max(5, Math.min(60, nextSecondValue))

          const remainder =
            100 - clampedValue - nextFirstValue - nextSecondValue
          nextSecondValue = Math.max(
            5,
            Math.min(60, nextSecondValue + remainder)
          )

          return {
            ...currentMacros,
            [macroKey]: clampedValue,
            [firstKey]: nextFirstValue,
            [secondKey]: nextSecondValue,
          }
        }

        const [otherKey] = otherKeys
        const lockedTotal = (["p", "c", "f"] as MacroKey[])
          .filter((key) => key !== macroKey && lockedMacros.has(key))
          .reduce((sum, key) => sum + currentMacros[key], 0)

        const nextOtherValue = Math.max(
          5,
          Math.min(60, 100 - clampedValue - lockedTotal)
        )
        const nextCurrentValue = 100 - nextOtherValue - lockedTotal

        return {
          ...currentMacros,
          [macroKey]: nextCurrentValue,
          [otherKey]: nextOtherValue,
        }
      })
    },
    [lockedMacros]
  )

  const handleSaveCurrentPreset = React.useCallback(() => {
    if (!selectedPreset || !canSave) {
      return
    }

    setPresets((currentPresets) =>
      currentPresets.map((preset) =>
        preset.id === selectedPreset.id ? { ...preset, ...macros } : preset
      )
    )

    toast.success("Preset updated", {
      description: `For ${selectedPreset.name}.`,
    })
  }, [canSave, macros, selectedPreset])

  const handleCreatePreset = React.useCallback(() => {
    if (!newPresetName.trim() || !canSave) {
      return
    }

    const nextPreset: MacroBuilderPreset = {
      id: `custom-${presetIdRef.current++}`,
      name: newPresetName.trim(),
      ...macros,
    }

    setPresets((currentPresets) => [...currentPresets, nextPreset])
    setSelectedPresetId(nextPreset.id)
    setShowCreatePresetInput(false)
    setNewPresetName("")

    toast.success("Preset created", {
      description: `For ${nextPreset.name}.`,
    })
  }, [canSave, macros, newPresetName])

  const handleDeletePreset = React.useCallback((presetId: string) => {
    setPresets((currentPresets) => {
      if (currentPresets.length <= 1) {
        return currentPresets
      }

      const nextPresets = currentPresets.filter(
        (preset) => preset.id !== presetId
      )

      if (selectedPresetId === presetId) {
        setSelectedPresetId(nextPresets[0]?.id ?? null)
      }

      return nextPresets
    })
  }, [selectedPresetId])

  const handleSavePlan = React.useCallback(() => {
    if (!canSave) {
      return
    }

    const nextPlanName = planName.trim() || "Macro Plan (IIFYM)"
    if (storageScopeId) {
      upsertStoredNutritionMealPlan(
        storageScopeId,
        buildStoredNutritionMacroPlanFromBuilderState({
          planId: mealPlanId,
          planName: nextPlanName,
          calories,
          macros,
          presets,
          selectedPresetId,
          lockedMacroKey: Array.from(lockedMacros)[0] ?? null,
          assignedClientIds,
          createdAt,
        })
      )
    }

    toast.success(mealPlanId ? "Macro plan updated" : "Macro plan created", {
      description: `For ${nextPlanName}.`,
    })
    router.push(backHref)
  }, [
    backHref,
    calories,
    canSave,
    createdAt,
    assignedClientIds,
    lockedMacros,
    macros,
    mealPlanId,
    planName,
    presets,
    router,
    selectedPresetId,
    storageScopeId,
  ])

  const mealPlanBuilderHref = buildCoachWiseHref(
    pathname,
    getNutritionCreateMealPlanFromTargetsHref(backHref, {
      calories,
      protein: grams.p,
      carbs: grams.c,
      fat: grams.f,
      clientIds: assignedClientIds,
    })
  )

  return (
    <div className="min-w-0 bg-neutral-50">
      <style>{macroRangeStyles}</style>
      <NutritionBuilderNav
        title={planName}
        isEditingTitle={isEditingName}
        inputValue={planName}
        onBack={() => router.push(backHref)}
        onStartEditing={() => setIsEditingName(true)}
        onTitleChange={setPlanName}
        onTitleBlur={() => setIsEditingName(false)}
        onTitleKeyDown={(event) => {
          if (event.key === "Enter") {
            setIsEditingName(false)
          }
        }}
        onSave={handleSavePlan}
        saveLabel="Save Macro Plan"
        saveDisabled={!canSave}
        clientPicker={
          showClientPicker && clientOptions ? (
            <NutritionBuilderClientPicker
              clients={clientOptions}
              selectedClientIds={assignedClientIds}
              onSelectedClientIdsChange={setAssignedClientIds}
            />
          ) : null
        }
        secondaryAction={{
          label: "Create Meal Plan from Targets",
          href: mealPlanBuilderHref,
        }}
      />

      <div className="sticky top-[calc(var(--header-height)+3rem+0.75rem)] z-20 mx-auto h-0 max-w-md px-4">
        {hasPresetChanged && selectedPreset && canSave && !showCreatePresetInput ? (
          <div className="absolute inset-x-4 top-0">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50/95 px-3 py-2.5 shadow-sm backdrop-blur-sm">
              <div className="text-[12px] text-neutral-700">
                <span className="font-medium">{selectedPreset.name}</span>
                {" updated to "}
                <span className="font-medium">{getPresetLabel(macros)}</span>
              </div>
              <div className="flex items-center gap-2">
                <SecondaryActionButton
                  label="Save as new"
                  onClick={() => {
                    setShowCreatePresetInput(true)
                    setNewPresetName("")
                  }}
                />
                <PrimaryActionButton
                  label="Update preset"
                  onClick={handleSaveCurrentPreset}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mx-auto max-w-md space-y-4 px-4 py-4">
        <div className="space-y-1.5 px-4">
          <div className="text-[12px] font-medium uppercase tracking-[0.12em] text-neutral-500">
            Daily Targets
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Calories",
                value: `${calories}`,
                tone: "border-neutral-200 bg-neutral-50/70"
              },
              { label: "Protein", value: `${grams.p}g`, tone: "border-emerald-200 bg-emerald-50/70" },
              { label: "Carbs", value: `${grams.c}g`, tone: "border-sky-200 bg-sky-50/70" },
              { label: "Fat", value: `${grams.f}g`, tone: "border-amber-200 bg-amber-50/70" },
            ].map((item) => (
              <div key={item.label} className={cn("rounded-xl border px-3 py-2.5", item.tone)}>
                <div className={cn("text-[18px] font-semibold text-neutral-950")}>
                  {item.value}
                </div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5 rounded-xl bg-neutral-50/90 p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[13px] font-medium text-neutral-800">
                Presets
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <MacroPresetChip
                  key={preset.id}
                  preset={preset}
                  isActive={selectedPresetId === preset.id && !hasPresetChanged}
                  isChanged={selectedPresetId === preset.id && hasPresetChanged}
                  isEditing={editingPresetId === preset.id}
                  canDelete={presets.length > 1}
                  editingName={editingPresetName}
                  onSelect={() => applyPreset(preset)}
                  onStartEditing={() => {
                    setEditingPresetId(preset.id)
                    setEditingPresetName(preset.name)
                  }}
                  onEditingNameChange={setEditingPresetName}
                  onCommitEditing={() => {
                    if (editingPresetName.trim()) {
                      setPresets((currentPresets) =>
                        currentPresets.map((currentPreset) =>
                          currentPreset.id === preset.id
                            ? { ...currentPreset, name: editingPresetName.trim() }
                            : currentPreset
                        )
                      )
                    }
                    setEditingPresetId(null)
                  }}
                  onCancelEditing={() => setEditingPresetId(null)}
                  onDelete={() => handleDeletePreset(preset.id)}
                />
              ))}

              {showCreatePresetInput ? (
                <div className="flex min-w-[120px] flex-col gap-1 rounded-xl border border-brand-300 bg-brand-50/60 px-3 py-2">
                  <Input
                    autoFocus
                    value={newPresetName}
                    onChange={(event) => setNewPresetName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleCreatePreset()
                      }
                      if (event.key === "Escape") {
                        setShowCreatePresetInput(false)
                        setNewPresetName("")
                      }
                    }}
                    onBlur={() => {
                      if (!newPresetName.trim()) {
                        setShowCreatePresetInput(false)
                      }
                    }}
                    placeholder="Preset name"
                    className="h-7 rounded-sm border-neutral-200 bg-white px-2 text-[12px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                  <div className="text-[11px] text-neutral-500">
                    {getPresetLabel(macros)}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCreatePresetInput(true)}
                  className="flex min-h-[58px] min-w-[58px] items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 text-neutral-400 transition-colors hover:border-brand-300 hover:bg-brand-50/40 hover:text-brand-600"
                >
                  <Plus className="size-4" />
                </button>
              )}
            </div>

          </div>

          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-neutral-800">
              Daily calories
            </label>
            <div className="relative rounded-xl border border-neutral-200 bg-neutral-100/70 px-4 py-3">
              <Input
                type="number"
                value={calories}
                onChange={(event) =>
                  setCalories(Number(event.target.value) || 0)
                }
                className="h-12 border-0 bg-transparent px-10 text-center text-[22px]! font-semibold shadow-none focus-visible:ring-0"
              />
              <Flame className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-neutral-400" />
              <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[14px] text-neutral-400">
                kcal
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {(Object.keys(macros) as MacroKey[]).map((macroKey) => (
              <MacroSliderCard
                key={macroKey}
                macroKey={macroKey}
                value={macros[macroKey]}
                grams={grams[macroKey]}
                locked={lockedMacros.has(macroKey)}
                onToggleLock={() => toggleLock(macroKey)}
                onChangeValue={(nextValue) =>
                  updateMacroValue(macroKey, nextValue)
                }
              />
            ))}
          </div>

          {totalPercent !== 100 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-700">
              Macro total is {totalPercent}%. It needs to equal 100% before
              you can save the plan.
            </div>
          ) : null}

          {lockedMacros.size ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50/60 px-4 py-3">
              <div className="text-[12px] text-brand-700">
                1 macro is locked. The other 2 rebalance automatically.
              </div>
              <SecondaryActionButton
                label="Unlock all"
                onClick={() => setLockedMacros(new Set())}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
