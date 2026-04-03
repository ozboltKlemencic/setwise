"use client"

import * as React from "react"
import { Clapperboard, Dumbbell, Link2, Upload } from "lucide-react"

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
import {
  PROGRAM_BUILDER_MUSCLE_CLASSES,
  PROGRAM_BUILDER_MUSCLE_FILTERS,
} from "@/lib/programs/program-builder-data"
import type {
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
        muscle,
        type,
        youtubeUrl: youtubeUrl.trim() || null,
        mediaFileName: mediaFileName || null,
      })
      onOpenChange(false)
    }, [
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
          <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_300px]">
            <div className="border-b border-neutral-200 md:border-r md:border-b-0">
              <DialogHeader className="gap-0 border-b border-neutral-200 px-6 py-4 text-left">
                <DialogTitle className="text-[17px] font-semibold text-neutral-950">
                  Add Exercise
                </DialogTitle>
                <DialogDescription className="mt-1 text-[13px] leading-5 text-neutral-500">
                  Add an exercise name, instructions, and its main muscle group.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 px-6 py-5">
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
                  <ProgramBuilderFieldLabel>Instructions</ProgramBuilderFieldLabel>
                  <textarea
                    value={instructions}
                    onChange={(event) => setInstructions(event.target.value)}
                    placeholder="Enter any additional info"
                    className="min-h-[96px] w-full resize-none rounded-sm border border-neutral-100 bg-neutral-50 px-3 py-2.5 text-[13px] text-neutral-950 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand-500"
                  />
                </div>

                <div className="space-y-2">
                  <ProgramBuilderFieldLabel>Muscle group</ProgramBuilderFieldLabel>
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
              </div>
            </div>

            <div className="flex flex-col">
              <div className="border-b border-neutral-200 px-6 py-4">
                <div className="text-[17px] font-semibold text-neutral-950">Media</div>
              </div>

              <div className="space-y-4 px-6 py-5">
                <div className="space-y-2">
                  <ProgramBuilderFieldLabel>YouTube Link</ProgramBuilderFieldLabel>
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

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-neutral-200" />
                  <span className="text-[11px] font-medium tracking-[0.12em] text-neutral-400 uppercase">
                    Or
                  </span>
                  <div className="h-px flex-1 bg-neutral-200" />
                </div>

                <div className="space-y-2">
                  <ProgramBuilderFieldLabel>Custom Video</ProgramBuilderFieldLabel>
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
                      "flex min-h-[124px] w-full flex-col items-center justify-center rounded-sm border border-dashed px-4 text-center transition-colors",
                      mediaFileName
                        ? "border-brand-300 bg-brand-50/35"
                        : "border-neutral-200 bg-neutral-50 hover:border-brand-300 hover:bg-brand-50/20"
                    )}
                  >
                    <div className="mb-2 flex size-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500">
                      <Upload className="size-4" />
                    </div>
                    <div className="text-[12px] text-neutral-600">
                      {mediaFileName ? mediaFileName : "Click or drag file to this area to upload"}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-neutral-200 bg-neutral-100/80 px-6 py-4 sm:justify-start">
            <div className="grid w-full grid-cols-2 gap-3">
              <SecondaryActionButton
                label="Close"
                onClick={() => onOpenChange(false)}
                className="h-11 w-full justify-center rounded-lg border-neutral-200 bg-white text-[15px] font-medium text-neutral-500"
              />
              <PrimaryActionButton
                label="Add Exercise"
                onClick={handleCreate}
                disabled={!name.trim()}
                className="h-11 w-full justify-center rounded-lg text-[15px] font-medium disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
)
