"use client"

import * as React from "react"
import { GripVertical, Minus, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  formatProgramBuilderRepRange,
  formatProgramBuilderTempo,
  PROGRAM_BUILDER_INTENSIFIERS,
  PROGRAM_BUILDER_MUSCLE_CLASSES,
  PROGRAM_BUILDER_PATTERNS,
} from "@/lib/programs/program-builder-data"
import type { useProgramBuilder } from "@/hooks/programs/use-program-builder"
import type { ProgramBuilderExercise } from "@/types"

type ProgramBuilderExerciseCardProps = {
  builder: ReturnType<typeof useProgramBuilder>
  entry: ProgramBuilderExercise
  index: number
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

      {builder.useIntensifiers && intensifier ? (
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault()
            builder.intensifierEditor?.uid === entry.uid &&
            builder.intensifierEditor.si === setIndex
              ? builder.setIntensifier(entry.uid, setIndex, intensifier.type)
              : builder.setIntensifier(entry.uid, setIndex, intensifier.type)
          }}
          className={cn(
            "rounded-md border px-2 py-0.5 text-[10px] font-semibold",
            PROGRAM_BUILDER_INTENSIFIERS[intensifier.type].className
          )}
        >
          {PROGRAM_BUILDER_INTENSIFIERS[intensifier.type].format(intensifier.params)}
        </button>
      ) : null}

      {builder.useTempo && set.tempo ? (
        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          {formatProgramBuilderTempo(set.tempo)}
        </span>
      ) : null}
    </div>
  )
}

export const ProgramBuilderExerciseCard = React.memo(function ProgramBuilderExerciseCard({
  builder,
  entry,
  index,
}: ProgramBuilderExerciseCardProps) {
  const isEditingExercise = builder.editTarget?.uid === entry.uid
  const editingSet =
    isEditingExercise && builder.editTarget ? entry.sets[builder.editTarget.si] : null
  const editingIntensifier =
    editingSet?.int && builder.intensifierEditor?.uid === entry.uid
      ? PROGRAM_BUILDER_INTENSIFIERS[editingSet.int.type]
      : null

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

        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-semibold text-neutral-950">{entry.name}</div>
          <div className="mt-0.5">
            <span
              className={cn(
                "inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
                PROGRAM_BUILDER_MUSCLE_CLASSES[entry.muscle]
              )}
            >
              {entry.muscle}
            </span>
          </div>
        </div>

        <div className="hidden items-center gap-1 lg:flex">
          {PROGRAM_BUILDER_PATTERNS.map((pattern) => (
            <button
              key={pattern.id}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault()
                builder.applyPattern(entry.uid, pattern.id)
              }}
              className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-[10px] font-medium text-neutral-500 transition-colors hover:border-brand-300 hover:bg-brand-50/35 hover:text-brand-700"
            >
              {pattern.label}
            </button>
          ))}
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
          <X className="size-3.5" />
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-3 px-4 py-4">
        {entry.sets.map((_, setIndex) => (
          <ProgramBuilderSetChip
            key={`${entry.uid}-${setIndex}`}
            builder={builder}
            entry={entry}
            setIndex={setIndex}
          />
        ))}

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onMouseDown={(event) => {
              event.preventDefault()
              builder.addSet(entry.uid)
            }}
            className="size-7 rounded-md border-neutral-200 bg-white text-neutral-700 shadow-none hover:bg-neutral-50"
          >
            <Plus className="size-3.5" />
          </Button>
          {entry.sets.length > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onMouseDown={(event) => {
                event.preventDefault()
                builder.removeSet(entry.uid)
              }}
              className="size-7 rounded-md border-neutral-200 bg-white text-neutral-700 shadow-none hover:bg-neutral-50"
            >
              <Minus className="size-3.5" />
            </Button>
          ) : null}
        </div>
      </div>

      {isEditingExercise ? (
        <div className="border-t border-neutral-200 px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {builder.myReps.map((range) => (
              <button
                key={`custom-${range}`}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault()
                  builder.applyQuickRepRange(range)
                }}
                className="rounded-md border border-brand-200 bg-brand-50/65 px-2.5 py-1 font-mono text-[11px] font-semibold text-brand-700"
              >
                {range}
              </button>
            ))}
            {builder.otherRepRanges.map((range) => (
              <button
                key={`preset-${range}`}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault()
                  builder.applyQuickRepRange(range)
                }}
                className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 font-mono text-[11px] font-medium text-neutral-500 transition-colors hover:border-brand-300 hover:bg-brand-50/35 hover:text-brand-700"
              >
                {range}
              </button>
            ))}
          </div>

          {builder.useIntensifiers ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-neutral-500">Intensifier</span>
              <button
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault()
                  builder.setIntensifier(entry.uid, builder.editTarget?.si ?? 0, null)
                }}
                className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-500"
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
                      builder.editTarget?.si ?? 0,
                      type as keyof typeof PROGRAM_BUILDER_INTENSIFIERS
                    )
                  }}
                  className={cn("rounded-md border px-2.5 py-1 text-[11px] font-medium", definition.className)}
                >
                  {definition.short}
                </button>
              ))}
            </div>
          ) : null}

          {editingSet?.int && editingIntensifier?.params.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {editingIntensifier.params.map((parameter) => {
                const currentValue = editingSet.int?.params[parameter.key] ?? 0

                return (
                  <div
                    key={parameter.key}
                    className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5"
                  >
                    <span className="text-[11px] text-neutral-500">{parameter.label}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onMouseDown={(event) => {
                        event.preventDefault()
                        builder.updateIntensifierParam(
                          entry.uid,
                          builder.editTarget?.si ?? 0,
                          parameter.key,
                          Math.max(parameter.min, currentValue - parameter.step)
                        )
                      }}
                      className="size-6 rounded-md border-neutral-200 bg-white text-neutral-700 shadow-none hover:bg-neutral-50"
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="min-w-8 text-center font-mono text-[12px] font-semibold text-neutral-900">
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
                          builder.editTarget?.si ?? 0,
                          parameter.key,
                          Math.min(parameter.max, currentValue + parameter.step)
                        )
                      }}
                      className="size-6 rounded-md border-neutral-200 bg-white text-neutral-700 shadow-none hover:bg-neutral-50"
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                )
              })}
            </div>
          ) : null}

          {builder.useTempo ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-neutral-500">Tempo</span>
              <button
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault()
                  builder.setTempo(entry.uid, builder.editTarget?.si ?? 0, null)
                }}
                className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-500"
              >
                None
              </button>
              {builder.myTempos.map((tempo) => (
                <button
                  key={tempo}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault()
                    builder.setTempo(entry.uid, builder.editTarget?.si ?? 0, tempo)
                  }}
                  className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-[11px] font-medium text-emerald-700"
                >
                  {tempo}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
})
