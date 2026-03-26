"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  ChevronLeft,
  Flame,
  Lock,
  LockOpen,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react"

import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { SecondaryActionButton } from "@/components/coachWise/secondary-action-button"
import { buildCoachWiseHref } from "@/components/coachWise/sidebar/route-utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getNutritionCreateMealPlanHref } from "@/lib/handlers/nutrition.handlers"
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
          ? "border-brand-500 bg-brand-50/70"
          : "border-neutral-200 bg-white hover:bg-neutral-50",
        isChanged && "border-amber-300 bg-amber-50/60"
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
          className="h-7 rounded-sm border-neutral-200 px-2 text-[12px] font-medium shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
        />
      ) : (
        <div
          className="pr-4 text-[12.5px] font-medium text-neutral-950"
          onDoubleClick={(event) => {
            event.stopPropagation()
            onStartEditing()
          }}
        >
          {preset.name}
        </div>
      )}

      <div className="mt-0.5 text-[11px] text-neutral-500">
        {getPresetLabel(preset)}
      </div>

      {canDelete ? (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={(event) => {
            event.stopPropagation()
            onDelete()
          }}
          className="absolute top-1.5 right-1.5 size-5 rounded-md border-neutral-200 bg-white/90 text-neutral-400 opacity-0 shadow-none transition-opacity hover:bg-neutral-50 hover:text-rose-500 group-hover:opacity-100"
        >
          <Trash2 className="size-3" />
          <span className="sr-only">Delete preset</span>
        </Button>
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
    <Card
      className={cn(
        "rounded-xl border shadow-none",
        locked ? meta.surface : "border-neutral-200 bg-white"
      )}
    >
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={onToggleLock}
            className={cn(
              "size-8 rounded-md shadow-none",
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

          <span className={cn("size-2 rounded-full", meta.accent)} />
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-medium text-neutral-950">
              {meta.label}
            </div>
            <div className="text-[12px] text-neutral-500">
              {grams}g target
            </div>
          </div>

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
              className="h-8 w-[68px] rounded-sm border-neutral-200 px-2 text-center text-[14px] font-semibold shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingValue(true)}
              className={cn(
                "rounded-md bg-neutral-50 px-2 py-1 text-[18px] font-semibold transition-colors hover:bg-neutral-100",
                meta.text
              )}
            >
              {value}%
            </button>
          )}
        </div>

        <input
          type="range"
          min="5"
          max="60"
          value={value}
          onChange={(event) => onChangeValue(Number(event.target.value))}
          disabled={locked}
          className={cn("w-full cursor-pointer accent-current", locked && "opacity-45")}
          style={{ accentColor: meta.ring }}
        />

        <div className="flex items-center justify-between text-[11px] text-neutral-500">
          <span>5%</span>
          {locked ? (
            <Badge
              variant="outline"
              className="rounded-md border-neutral-300 bg-white px-2 py-0.5 text-[10px] font-medium text-neutral-600"
            >
              Locked
            </Badge>
          ) : (
            <span>Drag to rebalance</span>
          )}
          <span>60%</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function MacroPlanBuilderPageView({
  backHref,
}: {
  backHref: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const presetIdRef = React.useRef(defaultMacroPresets.length)
  const [planName, setPlanName] = React.useState("Macro Plan (IIFYM)")
  const [isEditingName, setIsEditingName] = React.useState(false)
  const [calories, setCalories] = React.useState(2000)
  const [macros, setMacros] = React.useState<Record<MacroKey, number>>({
    p: 40,
    c: 35,
    f: 25,
  })
  const [presets, setPresets] =
    React.useState<MacroBuilderPreset[]>(defaultMacroPresets)
  const [selectedPresetId, setSelectedPresetId] = React.useState<string | null>(
    defaultMacroPresets[0]?.id ?? null
  )
  const [lockedMacros, setLockedMacros] = React.useState<Set<MacroKey>>(
    () => new Set()
  )
  const [editingPresetId, setEditingPresetId] = React.useState<string | null>(
    null
  )
  const [editingPresetName, setEditingPresetName] = React.useState("")
  const [showCreatePresetInput, setShowCreatePresetInput] = React.useState(false)
  const [newPresetName, setNewPresetName] = React.useState("")

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
      const nextLockedMacros = new Set(currentLockedMacros)

      if (nextLockedMacros.has(macroKey)) {
        nextLockedMacros.delete(macroKey)
        return nextLockedMacros
      }

      if (nextLockedMacros.size >= 2) {
        return currentLockedMacros
      }

      nextLockedMacros.add(macroKey)
      return nextLockedMacros
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
    toast.success("Macro plan created", {
      description: `For ${nextPlanName}.`,
    })
    router.push(backHref)
  }, [backHref, canSave, planName, router])

  const mealPlanBuilderHref = buildCoachWiseHref(
    pathname,
    getNutritionCreateMealPlanHref(backHref)
  )

  return (
    <div className="min-w-0 bg-neutral-50">
      <div className="border-b border-neutral-200 bg-neutral-50">
        <div className="flex min-h-10 items-center justify-between gap-3 px-4 py-1.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => router.push(backHref)}
              className="size-8 rounded-sm text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
            >
              <ChevronLeft className="size-4" />
              <span className="sr-only">Back</span>
            </Button>

            <div className="min-w-0">
              {isEditingName ? (
                <Input
                  autoFocus
                  value={planName}
                  onChange={(event) => setPlanName(event.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      setIsEditingName(false)
                    }
                  }}
                  className="h-9 min-w-[240px] rounded-sm border-neutral-200 bg-white text-[15px] font-semibold shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="inline-flex max-w-full items-center gap-2 text-left text-[17px] font-semibold text-neutral-950"
                >
                  <span className="truncate">{planName}</span>
                  <Pencil className="size-3.5 text-neutral-400" />
                </button>
              )}
            </div>
          </div>

          <PrimaryActionButton
            label="Save Macro Plan"
            onClick={handleSavePlan}
            disabled={!canSave}
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1080px] space-y-4 px-4 py-4">
        <Card className="rounded-xl border-neutral-200 shadow-none">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Sparkles className="size-4.5" />
              </span>
              <div>
                <CardTitle className="text-[18px] font-semibold text-neutral-950">
                  Smart Macro Builder
                </CardTitle>
                <CardDescription className="text-[13px] text-neutral-500">
                  Build a flexible IIFYM setup with presets, locks, and live
                  macro balancing.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[13px] font-medium text-neutral-800">
                  Presets
                </div>
                <div className="text-[11px] text-neutral-500">
                  Lock up to 2 macros while adjusting the third
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
                  <div className="flex min-w-[120px] flex-col gap-1 rounded-xl border border-brand-300 bg-brand-50/50 px-3 py-2">
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
                    className="flex min-h-[58px] min-w-[58px] items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white text-neutral-400 transition-colors hover:border-brand-300 hover:text-brand-600"
                  >
                    <Plus className="size-4" />
                  </button>
                )}
              </div>

              {hasPresetChanged && selectedPreset && canSave ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/60 px-3 py-2.5">
                  <div className="text-[12px] text-amber-700">
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
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-neutral-800">
                Daily calories
              </label>
              <div className="relative max-w-[240px]">
                <Input
                  type="number"
                  value={calories}
                  onChange={(event) =>
                    setCalories(Number(event.target.value) || 0)
                  }
                  className="h-11 rounded-sm border-neutral-200 bg-white pr-16 pl-11 text-[18px] font-semibold shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                />
                <Flame className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[14px] text-neutral-400">
                  kcal
                </span>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
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
                  {lockedMacros.size === 1
                    ? "1 macro is locked. The other 2 rebalance automatically."
                    : "2 macros are locked. Only the remaining one rebalances."}
                </div>
                <SecondaryActionButton
                  label="Unlock all"
                  onClick={() => setLockedMacros(new Set())}
                />
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="rounded-xl border-neutral-200 shadow-none">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-[15px] font-semibold text-neutral-950">
              Daily Targets
            </CardTitle>
            <CardDescription className="text-[12.5px] text-neutral-500">
              Live gram targets update automatically as you rebalance calories and macro percentages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Calories", value: `${calories}`, tone: "border-neutral-200 bg-neutral-50/70" },
                { label: "Protein", value: `${grams.p}g`, tone: "border-emerald-200 bg-emerald-50/70" },
                { label: "Carbs", value: `${grams.c}g`, tone: "border-sky-200 bg-sky-50/70" },
                { label: "Fat", value: `${grams.f}g`, tone: "border-amber-200 bg-amber-50/70" },
              ].map((item) => (
                <div key={item.label} className={cn("rounded-xl border px-3 py-2.5", item.tone)}>
                  <div className="text-[18px] font-semibold text-neutral-950">
                    {item.value}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <SecondaryActionButton
            label="Create Meal Plan from Targets"
            href={mealPlanBuilderHref}
          />
          <PrimaryActionButton
            label="Save Macro Plan"
            onClick={handleSavePlan}
            disabled={!canSave}
          />
        </div>
      </div>
    </div>
  )
}
