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

export type CreateFoodUnit = "g" | "ml" | "piece" | "slice"

export type CreateFoodDialogValue = {
  name: string
  cal: number
  p: number
  c: number
  f: number
  unit: CreateFoodUnit
}

const createFoodUnitOptions: Array<{
  value: CreateFoodUnit
  label: string
  description: string
}> = [
    { value: "g", label: "100 g", description: "Default" },
    { value: "ml", label: "100 ml", description: "Liquids" },
    { value: "piece", label: "Piece", description: "Eggs / banana" },
    { value: "slice", label: "Slice", description: "Bread" },
  ]

const createFoodMacroFields: Array<{
  key: "cal" | "p" | "c" | "f"
  label: string
  unit: string
  toneClassName: string
  inputClassName: string
  labelClassName: string
}> = [
    {
      key: "cal",
      label: "Calories",
      unit: "kcal",
      toneClassName: "border-orange-200 bg-orange-50/55",
      inputClassName: "focus-visible:border-orange-400",
      labelClassName: "text-orange-700",
    },
    {
      key: "p",
      label: "Protein",
      unit: "g",
      toneClassName: "border-emerald-200 bg-emerald-50/55",
      inputClassName: "focus-visible:border-emerald-400",
      labelClassName: "text-emerald-700",
    },
    {
      key: "c",
      label: "Carbs",
      unit: "g",
      toneClassName: "border-sky-200 bg-sky-50/55",
      inputClassName: "focus-visible:border-sky-400",
      labelClassName: "text-sky-700",
    },
    {
      key: "f",
      label: "Fat",
      unit: "g",
      toneClassName: "border-yellow-200 bg-yellow-50/55",
      inputClassName: "focus-visible:border-yellow-400",
      labelClassName: "text-yellow-700",
    },
  ]

function suggestCreateFoodUnit(name: string): CreateFoodUnit {
  const normalizedName = name.trim().toLowerCase()

  if (/egg|eggs|jajc|banana|banan/.test(normalizedName)) {
    return "piece"
  }

  return "g"
}

function createInitialDraft(name: string): CreateFoodDialogValue {
  const nextName = name.trim()

  return {
    name: nextName,
    cal: 0,
    p: 0,
    c: 0,
    f: 0,
    unit: suggestCreateFoodUnit(nextName),
  }
}

function getCreateFoodMetricLabel(unit: CreateFoodUnit) {
  switch (unit) {
    case "g":
      return "Values per 100 g"
    case "ml":
      return "Values per 100 ml"
    case "piece":
      return "Values per piece"
    case "slice":
      return "Values per slice"
    default:
      return "Values per serving"
  }
}

export function CreateFoodDialog({
  open,
  onOpenChange,
  initialName,
  onCreate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialName: string
  onCreate: (value: CreateFoodDialogValue) => void
}) {
  const nameInputRef = React.useRef<HTMLInputElement>(null)
  const [draftValue, setDraftValue] = React.useState<CreateFoodDialogValue>(() =>
    createInitialDraft(initialName)
  )

  React.useEffect(() => {
    if (!open) {
      return
    }

    setDraftValue(createInitialDraft(initialName))
  }, [initialName, open])

  React.useEffect(() => {
    if (!open) {
      return
    }

    window.setTimeout(() => {
      nameInputRef.current?.focus()
      nameInputRef.current?.select()
    }, 10)
  }, [open])

  const canCreate = draftValue.name.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-[20px] border-neutral-200 bg-white p-0 shadow-2xl shadow-black/12 sm:max-w-[440px]"
      >
        <DialogHeader className="w-full gap-0 px-7 pt-6 pb-1 text-left">
          <DialogTitle className="text-[17px] font-semibold text-neutral-950">
            Create food
          </DialogTitle>
          <DialogDescription className="mt-1 max-w-[320px] text-[13px] leading-5 text-neutral-500">
            Add a food name and its macro values.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault()

            if (!canCreate) {
              return
            }

            onCreate({
              ...draftValue,
              name: draftValue.name.trim(),
            })
          }}
        >
          <div className="w-full space-y-4 px-7 pt-4 pb-5">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium capitalize text-neutral-700">
                Food name
              </label>
              <Input
                ref={nameInputRef}
                value={draftValue.name}
                onChange={(event) =>
                  setDraftValue((currentValue) => ({
                    ...currentValue,
                    name: event.target.value,
                  }))
                }
                placeholder="e.g. Bread"
                className="h-10 rounded-sm border-neutral-100 bg-neutral-50 shadow-none focus-visible:border-brand-500 focus-visible:ring-0"
              />
            </div>

            <div className="space-y-2.5">
              <div className="text-[12px] font-medium capitalize text-neutral-700">
                Unit
              </div>
              <div className="grid grid-cols-4 gap-2">
                {createFoodUnitOptions.map((option) => {
                  const isActive = draftValue.unit === option.value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setDraftValue((currentValue) => ({
                          ...currentValue,
                          unit: option.value,
                        }))
                      }
                      className={cn(
                        "rounded-lg border px-2 py-2 text-center transition-colors",
                        isActive
                          ? "border-brand-500 bg-brand-50/35 text-neutral-950"
                          : "border-neutral-200 bg-neutral-50 text-neutral-900 hover:border-brand-300 hover:bg-brand-50/20"
                      )}
                    >
                      <div className="text-[12px] font-semibold">{option.label}</div>
                      <div className="mt-0.5 text-[10px] text-neutral-400">
                        {option.description}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="text-[12px] font-medium text-neutral-700">
                {getCreateFoodMetricLabel(draftValue.unit)}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {createFoodMacroFields.map((field) => (
                  <div
                    key={field.key}
                    className={cn(
                      "rounded-lg border px-3 py-3",
                      field.toneClassName
                    )}
                  >
                    <div
                      className={cn(
                        "mb-2 text-[12px] font-medium",
                        field.labelClassName
                      )}
                    >
                      {field.label}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        step={field.key === "cal" ? "1" : "0.1"}
                        value={draftValue[field.key]}
                        onChange={(event) => {
                          const nextValue = Number(event.target.value)

                          setDraftValue((currentValue) => ({
                            ...currentValue,
                            [field.key]: Number.isFinite(nextValue) && nextValue >= 0
                              ? nextValue
                              : 0,
                          }))
                        }}
                        className={cn(
                          "h-10 rounded-sm border-neutral-200 bg-white shadow-none focus-visible:ring-0",
                          field.inputClassName
                        )}
                      />
                      <span className="shrink-0 text-[13px] text-neutral-400">
                        {field.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="w-full border-t border-neutral-200 bg-neutral-100/80 px-7 py-4 sm:justify-start">
            <div className="grid w-full grid-cols-2 gap-3">
              <SecondaryActionButton
                label="Cancel"
                onClick={() => onOpenChange(false)}
                className="h-11 w-full justify-center rounded-lg border-neutral-200 bg-white text-[15px] font-medium text-neutral-500"
              />
              <PrimaryActionButton
                type="submit"
                label="Create food"
                disabled={!canCreate}
                className="h-11 w-full justify-center rounded-lg text-[15px] font-medium disabled:pointer-events-none disabled:opacity-50"
              />
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
