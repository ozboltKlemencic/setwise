"use client"

import * as React from "react"
import { ChevronDown, GripVertical, Minus, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { useProgramBuilder } from "@/hooks/programs/use-program-builder"
import {
  formatProgramBuilderRepRange,
  formatProgramBuilderTempo,
  PROGRAM_BUILDER_INTENSIFIERS,
  PROGRAM_BUILDER_MUSCLE_CLASSES,
} from "@/lib/programs/program-builder-data"
import { cn } from "@/lib/utils"
import type { ProgramBuilderExercise } from "@/types"

type ProgramBuilderExerciseCardProps = {
  builder: ReturnType<typeof useProgramBuilder>
  entry: ProgramBuilderExercise
  index: number
}

type SetOptionRowProps = {
  label: string
  onClear: () => void
  options: number[]
  selectedValue: number | null | undefined
  onSelect: (value: number) => void
  activeClassName: string
  idleClassName: string
}

function SetOptionRow({
  label,
  onClear,
  options,
  selectedValue,
  onSelect,
  activeClassName,
  idleClassName,
}: SetOptionRowProps) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
      <span className="w-[68px] shrink-0 text-[11px] text-neutral-500">{label}</span>
      <button
        type="button"
        onMouseDown={(event) => {
          event.preventDefault()
          onClear()
        }}
        className={cn(
          "rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors",
          selectedValue == null
            ? "border-neutral-300 bg-neutral-100 text-neutral-700"
            : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-700"
        )}
      >
        None
      </button>

      {options.map((value) => (
        <button
          key={value}
          type="button"
          onMouseDown={(event) => {
            event.preventDefault()
            onSelect(value)
          }}
          className={cn(
            "rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors",
            selectedValue === value ? activeClassName : idleClassName
          )}
        >
          {value}
        </button>
      ))}
    </div>
  )
}

function ProgramBuilderSetChip({
  builder,
  entry,
  setIndex,
}: {
  builder: ReturnType<typeof useProgramBuilder>
  entry: ProgramBuilderExercise
  setIndex: number
}) {
  const set = entry.sets[setIndex]
  const intensifier = set.int
  const isEditing = builder.editTarget?.uid === entry.uid && builder.editTarget.si === setIndex

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-400">
        Set {setIndex + 1}
      </span>

      {isEditing ? (
        <Input
          autoFocus
          value={builder.editValue}
          onChange={(event) => builder.setEditValue(event.target.value)}
          onBlur={builder.handleSetInputBlur}
          onKeyDown={builder.handleSetInputKeyDown}
          className="h-10 w-20 rounded-lg border-brand-300 bg-white text-center font-mono text-[14px] font-semibold shadow-none focus-visible:border-brand-400 focus-visible:ring-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => builder.openSetEditor(entry.uid, setIndex)}
          className="flex h-10 min-w-20 items-center justify-center rounded-lg border border-neutral-200 bg-white px-3 font-mono text-[14px] font-semibold text-neutral-800 transition-colors hover:border-brand-300 hover:bg-brand-50/35"
        >
          {formatProgramBuilderRepRange(set)}
        </button>
      )}

      {intensifier ? (
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault()
            builder.setIntensifier(entry.uid, setIndex, intensifier.type)
          }}
          className={cn(
            "rounded-md border px-2 py-0.5 text-[10px] font-semibold",
            PROGRAM_BUILDER_INTENSIFIERS[intensifier.type].className
          )}
        >
          {PROGRAM_BUILDER_INTENSIFIERS[intensifier.type].format(intensifier.params)}
        </button>
      ) : null}

      {set.tempo ? (
        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          {formatProgramBuilderTempo(set.tempo)}
        </span>
      ) : null}

      {typeof set.rpe === "number" ? (
        <span className="rounded-md border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
          RPE {set.rpe}
        </span>
      ) : null}

      {typeof set.rir === "number" ? (
        <span className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-2 py-0.5 text-[10px] font-semibold text-fuchsia-700">
          RIR {set.rir}
        </span>
      ) : null}
    </div>
  )
}

function ProgramBuilderSetAction({
  children,
  className,
  onMouseDown,
}: {
  children: React.ReactNode
  className?: string
  onMouseDown: React.MouseEventHandler<HTMLButtonElement>
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        aria-hidden="true"
        className="text-[10px] font-medium uppercase tracking-[0.08em] text-transparent select-none"
      >
        Set
      </span>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onMouseDown={onMouseDown}
        className={cn("h-10 w-10 rounded-lg shadow-none", className)}
      >
        {children}
      </Button>
    </div>
  )
}

export const ProgramBuilderExerciseCard = React.memo(function ProgramBuilderExerciseCard({
  builder,
  entry,
  index,
}: ProgramBuilderExerciseCardProps) {
  const [showAdvancedOptions, setShowAdvancedOptions] = React.useState(false)
  const editorRef = React.useRef<HTMLDivElement | null>(null)
  const isEditingExercise = builder.editTarget?.uid === entry.uid
  const editingSet =
    isEditingExercise && builder.editTarget ? entry.sets[builder.editTarget.si] : null
  const editingIntensifier =
    editingSet?.int && builder.intensifierEditor?.uid === entry.uid
      ? PROGRAM_BUILDER_INTENSIFIERS[editingSet.int.type]
      : null
  const editingSetIndex = builder.editTarget?.si ?? 0
  const selectedRepRange = editingSet ? formatProgramBuilderRepRange(editingSet) : null
  const selectedTempo = editingSet?.tempo ? formatProgramBuilderTempo(editingSet.tempo) : null
  const selectedIntensifierType = editingSet?.int?.type ?? null

  React.useEffect(() => {
    setShowAdvancedOptions(false)
  }, [editingSetIndex, isEditingExercise])

  React.useEffect(() => {
    if (!isEditingExercise) {
      return
    }

    function handleDocumentMouseDown(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Node)) {
        return
      }

      if (editorRef.current?.contains(target)) {
        return
      }

      builder.closeSetEditor()
    }

    document.addEventListener("mousedown", handleDocumentMouseDown)

    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown)
    }
  }, [builder, isEditingExercise])

  return (
    <div
      draggable
      onDragStart={() => builder.setReorderExerciseIndex(index)}
      onDragEnd={() => {
        builder.setReorderExerciseIndex(null)
        builder.setDragOverIndex(null)
      }}
      className={cn(
        "rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(17,24,39,0.04)] transition-opacity",
        builder.reorderExerciseIndex === index && "opacity-40"
      )}
    >
      <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-400">
          <GripVertical className="size-3.5" />
        </div>

        <div className="min-w-0 flex-1 pl-1">
          <div className="flex min-w-0 items-center gap-2">
            <div className="truncate text-[14px] font-semibold text-neutral-950">{entry.name}</div>
            <span
              className={cn(
                "inline-flex shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
                PROGRAM_BUILDER_MUSCLE_CLASSES[entry.muscle]
              )}
            >
              {entry.muscle}
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onMouseDown={(event) => {
            event.preventDefault()
            builder.removeExercise(entry.uid)
          }}
          className="size-7 rounded-md border-rose-200 bg-rose-50 text-rose-600 shadow-none hover:bg-rose-100"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      <div className="flex flex-wrap items-start gap-2 px-4 py-4">
        {entry.sets.map((_, setIndex) => (
          <ProgramBuilderSetChip
            key={`${entry.uid}-${setIndex}`}
            builder={builder}
            entry={entry}
            setIndex={setIndex}
          />
        ))}

        <ProgramBuilderSetAction
          onMouseDown={(event) => {
            event.preventDefault()
            builder.addSet(entry.uid)
          }}
          className="border-dashed border-neutral-200 bg-transparent text-neutral-400 hover:border-neutral-800 hover:bg-transparent hover:text-neutral-950"
        >
          <Plus className="size-3" />
        </ProgramBuilderSetAction>

        {entry.sets.length > 1 ? (
          <ProgramBuilderSetAction
            onMouseDown={(event) => {
              event.preventDefault()
              builder.removeSet(entry.uid)
            }}
            className="border-dashed border-neutral-200 bg-transparent text-neutral-400 hover:border-neutral-800 hover:bg-transparent hover:text-neutral-950"
          >
            <Minus className="size-3" />
          </ProgramBuilderSetAction>
        ) : null}
      </div>

      {isEditingExercise ? (
        <div ref={editorRef} className="border-t border-neutral-200 px-4 py-3">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <span className="w-[68px] shrink-0 text-[11px] text-neutral-500">Range</span>
            {builder.myReps.map((range) => (
              <button
                key={`custom-${range}`}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault()
                  builder.applyQuickRepRange(range)
                }}
                className={cn(
                  "rounded-md border px-2.5 py-1 font-mono text-[11px] font-medium transition-colors",
                  selectedRepRange === range
                    ? "border-brand-200 bg-brand-50/65 text-brand-700"
                    : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-700"
                )}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault()
            }}
            onClick={() => setShowAdvancedOptions((currentState) => !currentState)}
            className="mt-3 inline-flex items-center gap-2 text-[12px] font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          >
            <span>More advanced options</span>
            <ChevronDown
              className={cn(
                "size-3.5 shrink-0 transition-transform",
                showAdvancedOptions && "rotate-180"
              )}
            />
          </button>

          {showAdvancedOptions ? (
            <>
              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
                <span className="w-[68px] shrink-0 text-[11px] text-neutral-500">Intensifier</span>
                <button
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault()
                    builder.setIntensifier(entry.uid, editingSetIndex, null)
                  }}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors",
                    selectedIntensifierType == null
                      ? "border-neutral-300 bg-neutral-100 text-neutral-700"
                      : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-700"
                  )}
                >
                  None
                </button>
                {Object.entries(PROGRAM_BUILDER_INTENSIFIERS).map(([type, definition]) => (
                  <button
                    key={type}
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault()
                      builder.setIntensifier(
                        entry.uid,
                        editingSetIndex,
                        type as keyof typeof PROGRAM_BUILDER_INTENSIFIERS
                      )
                    }}
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors",
                      selectedIntensifierType === type
                        ? definition.className
                        : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-700"
                    )}
                  >
                    {definition.short}
                  </button>
                ))}
                {editingSet?.int && editingIntensifier?.params.length
                  ? editingIntensifier.params.map((parameter) => {
                    const currentValue = editingSet.int?.params[parameter.key] ?? 0

                    return (
                      <div
                        key={parameter.key}
                        className="flex h-7 items-stretch overflow-hidden rounded-md border border-neutral-200 bg-neutral-100"
                      >
                        <span className="flex items-center px-2.5 text-[11px] text-neutral-500">
                          {parameter.label}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onMouseDown={(event) => {
                            event.preventDefault()
                            builder.updateIntensifierParam(
                              entry.uid,
                              editingSetIndex,
                              parameter.key,
                              Math.max(parameter.min, currentValue - parameter.step)
                            )
                          }}
                          className="h-full w-7 rounded-none border-0 border-l border-neutral-200 bg-neutral-50 text-neutral-800 shadow-none hover:bg-neutral-100 cursor-pointer"
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="flex min-w-10 items-center justify-center px-2 text-center font-mono text-[12px] font-semibold text-neutral-900">
                          {currentValue}
                          {parameter.unit ?? ""}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onMouseDown={(event) => {
                            event.preventDefault()
                            builder.updateIntensifierParam(
                              entry.uid,
                              editingSetIndex,
                              parameter.key,
                              Math.min(parameter.max, currentValue + parameter.step)
                            )
                          }}
                          className="h-full w-7 rounded-none border-0 border-l border-neutral-200 bg-neutral-50 text-neutral-800 shadow-none hover:bg-neutral-100 cursor-pointer"
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>
                    )
                  })
                  : null}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
                <span className="w-[68px] shrink-0 text-[11px] text-neutral-500">Tempo</span>
                <button
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault()
                    builder.setTempo(entry.uid, editingSetIndex, null)
                  }}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors",
                    selectedTempo == null
                      ? "border-neutral-300 bg-neutral-100 text-neutral-700"
                      : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-700"
                  )}
                >
                  None
                </button>
                {builder.myTempos.map((tempo) => (
                  <button
                    key={tempo}
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault()
                      builder.setTempo(entry.uid, editingSetIndex, tempo)
                    }}
                    className={cn(
                      "rounded-md border px-2.5 py-1 font-mono text-[11px] font-medium transition-colors",
                      selectedTempo === tempo
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-700"
                    )}
                  >
                    {tempo}
                  </button>
                ))}
              </div>

              <SetOptionRow
                label="RPE"
                onClear={() => builder.setRpe(entry.uid, editingSetIndex, null)}
                options={builder.rpeOptions}
                selectedValue={editingSet?.rpe}
                onSelect={(value) => builder.setRpe(entry.uid, editingSetIndex, value)}
                activeClassName="border-violet-300 bg-violet-50 text-violet-700"
                idleClassName="border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-700"
              />

              <SetOptionRow
                label="RIR"
                onClear={() => builder.setRir(entry.uid, editingSetIndex, null)}
                options={builder.rirOptions}
                selectedValue={editingSet?.rir}
                onSelect={(value) => builder.setRir(entry.uid, editingSetIndex, value)}
                activeClassName="border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700"
                idleClassName="border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-700"
              />
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  )
})
