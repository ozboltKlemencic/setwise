"use client"

import * as React from "react"
import { Link2, Upload } from "lucide-react"

import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { SecondaryActionButton } from "@/components/coachWise/secondary-action-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  PROGRAM_BUILDER_EXERCISE_EQUIPMENT_OPTIONS,
  PROGRAM_BUILDER_MUSCLE_CLASSES,
  PROGRAM_BUILDER_MUSCLE_FILTERS,
} from "@/lib/programs/program-builder-data"
import type {
  ProgramBuilderExerciseEquipment,
  ProgramBuilderExerciseLibraryItem,
  ProgramBuilderExerciseType,
  ProgramBuilderMuscle,
} from "@/types"

type ProgramBuilderCreateExerciseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialName: string
  onCreate: (
    input: Pick<ProgramBuilderExerciseLibraryItem, "name" | "muscle" | "type"> & {
      instructions?: string | null
      equipment?: ProgramBuilderExerciseEquipment | null
      youtubeUrl?: string | null
      mediaFileName?: string | null
    }
  ) => void
}

const muscleOptions = PROGRAM_BUILDER_MUSCLE_FILTERS.filter(
  (muscle): muscle is ProgramBuilderMuscle => muscle !== "All"
)

function ProgramBuilderFieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label className="text-[12px] font-medium text-neutral-700">
      {children}
      {required ? <span className="ml-1 text-rose-500">*</span> : null}
    </label>
  )
}

export const ProgramBuilderCreateExerciseDialog = React.memo(
  function ProgramBuilderCreateExerciseDialog({
    open,
    onOpenChange,
    initialName,
    onCreate,
  }: ProgramBuilderCreateExerciseDialogProps) {
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const [name, setName] = React.useState(initialName)
    const [instructions, setInstructions] = React.useState("")
    const [muscle, setMuscle] = React.useState<ProgramBuilderMuscle>("Chest")
    const [equipment, setEquipment] = React.useState<ProgramBuilderExerciseEquipment | null>(null)
    const [type, setType] = React.useState<ProgramBuilderExerciseType>("compound_medium")
    const [youtubeUrl, setYoutubeUrl] = React.useState("")
    const [mediaFileName, setMediaFileName] = React.useState("")

    React.useEffect(() => {
      if (!open) {
        return
      }

      setName(initialName)
      setInstructions("")
      setMuscle("Chest")
      setEquipment(null)
      setType("compound_medium")
      setYoutubeUrl("")
      setMediaFileName("")
    }, [initialName, open])

    const handleCreate = React.useCallback(() => {
      const trimmedName = name.trim()
      if (!trimmedName) {
        return
      }

      onCreate({
        name: trimmedName,
        instructions: instructions.trim() || null,
        equipment,
        muscle,
        type,
        youtubeUrl: youtubeUrl.trim() || null,
        mediaFileName: mediaFileName || null,
      })
      onOpenChange(false)
    }, [
      equipment,
      instructions,
      mediaFileName,
      muscle,
      name,
      onCreate,
      onOpenChange,
      type,
      youtubeUrl,
    ])

    const handleUploadClick = React.useCallback(() => {
      fileInputRef.current?.click()
    }, [])

    const handleFileChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        setMediaFileName(file?.name ?? "")
      },
      []
    )

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="gap-0 overflow-hidden rounded-[20px] border-neutral-200 bg-white p-0 shadow-2xl shadow-black/12 sm:max-w-[860px]"
        >
          <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_310px]">
            <div className="pt-4 pb-5">
              <DialogHeader className="gap-0 px-6 pt-4 pb-2 text-left">
                <DialogTitle className="text-[17px] font-semibold text-neutral-950">
                  Add Exercise
                </DialogTitle>
                <DialogDescription className="mt-1 text-[13px] leading-5 text-neutral-500">
                  Add an exercise name, instructions, and its main muscle group.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 px-6 pt-3">
                <div className="space-y-2">
                  <ProgramBuilderFieldLabel required>Name</ProgramBuilderFieldLabel>
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Name of the exercise e.g. Squat"
                    className="h-10 rounded-sm border-neutral-100 bg-neutral-50 shadow-none focus-visible:border-brand-500 focus-visible:ring-0"
                  />
                </div>

                <div className="space-y-2">
                  <ProgramBuilderFieldLabel>Primary muscle group</ProgramBuilderFieldLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {muscleOptions.map((option) => {
                      const isActive = muscle === option

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setMuscle(option)}
                          className={cn(
                            "rounded-lg border px-3 py-2 text-center text-[13px] font-medium transition-colors",
                            isActive
                              ? PROGRAM_BUILDER_MUSCLE_CLASSES[option]
                              : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-brand-300 hover:bg-brand-50/20"
                          )}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <ProgramBuilderFieldLabel>Technical cues</ProgramBuilderFieldLabel>
                  <textarea
                    value={instructions}
                    onChange={(event) => setInstructions(event.target.value)}
                    placeholder="Explain the form, tempo, and critical cues..."
                    className="min-h-[116px] w-full resize-none rounded-sm border border-neutral-100 bg-neutral-50 px-3 py-2.5 text-[13px] text-neutral-950 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col px-6 pt-6 pb-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                Media
              </div>

              <div className="mt-3 flex min-h-full flex-col">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*,image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className={cn(
                        "flex min-h-[156px] w-full flex-col items-center justify-center rounded-sm border border-dashed px-4 text-center transition-colors",
                        mediaFileName
                          ? "border-brand-300 bg-brand-50/35"
                          : "border-neutral-200 bg-neutral-50 hover:border-brand-300 hover:bg-brand-50/20"
                      )}
                    >
                      <div className="mb-2 flex size-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500">
                        <Upload className="size-4" />
                      </div>
                      <div className="text-[13px] font-medium text-neutral-700">
                        {mediaFileName ? "Uploaded media" : "Upload media"}
                      </div>
                      <div className="mt-1 text-[12px] text-neutral-500">
                        {mediaFileName
                          ? mediaFileName
                          : "Click to choose a file from your computer."}
                      </div>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <ProgramBuilderFieldLabel>YouTube link</ProgramBuilderFieldLabel>
                    <div className="relative">
                      <Link2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                      <Input
                        value={youtubeUrl}
                        onChange={(event) => setYoutubeUrl(event.target.value)}
                        placeholder="Enter YouTube link"
                        className="h-10 rounded-sm border-neutral-100 bg-neutral-50 pl-9 shadow-none focus-visible:border-brand-500 focus-visible:ring-0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <ProgramBuilderFieldLabel>Equipment</ProgramBuilderFieldLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {PROGRAM_BUILDER_EXERCISE_EQUIPMENT_OPTIONS.map((option) => {
                        const isActive = equipment === option.value

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              setEquipment((currentValue) =>
                                currentValue === option.value ? null : option.value
                              )
                            }
                            className={cn(
                              "rounded-lg border px-3 py-2 text-center text-[13px] font-medium transition-colors",
                              isActive
                                ? "border-brand-500 bg-brand-50/35 text-neutral-950"
                                : "border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-brand-300 hover:bg-brand-50/20"
                            )}
                          >
                            {option.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <PrimaryActionButton
                    label="Add Exercise"
                    onClick={handleCreate}
                    disabled={!name.trim()}
                    className="h-11 w-full justify-center rounded-lg px-5 text-[14px] font-medium disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <SecondaryActionButton
                    label="Close"
                    onClick={() => onOpenChange(false)}
                    className="h-auto w-full justify-center border-transparent bg-transparent px-0 py-1 text-[13px] font-medium text-neutral-500 shadow-none hover:bg-transparent hover:text-neutral-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
)
