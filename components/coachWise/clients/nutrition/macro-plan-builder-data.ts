import type {
  StoredNutritionMacroPlanBuilderSnapshot,
  StoredNutritionMealPlan,
  StoredNutritionMealPlanOption,
  StoredNutritionMealPlanSection,
} from "@/lib/handlers/nutrition-plan-storage"

export type MacroKey = "p" | "c" | "f"

export type MacroBuilderPreset = {
  id: string
  name: string
  p: number
  c: number
  f: number
}

export const DEFAULT_MACRO_BUILDER_PRESETS: MacroBuilderPreset[] = [
  { id: "default-0", name: "High Protein", p: 40, c: 35, f: 25 },
  { id: "default-1", name: "Balanced", p: 33, c: 33, f: 33 },
  { id: "default-2", name: "Low Carb", p: 40, c: 20, f: 40 },
  { id: "default-3", name: "High Carb", p: 30, c: 50, f: 20 },
]

const macroPlanPreviewImage =
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80"

export function calcMacroPlanGrams(
  calories: number,
  macros: Record<MacroKey, number>
) {
  return {
    p: Math.round((calories * macros.p) / 100 / 4),
    c: Math.round((calories * macros.c) / 100 / 4),
    f: Math.round((calories * macros.f) / 100 / 9),
  }
}

function buildStoredNutritionMacroPlanSections({
  planName,
  calories,
  grams,
}: {
  planName: string
  calories: number
  grams: ReturnType<typeof calcMacroPlanGrams>
}): StoredNutritionMealPlanSection[] {
  const option: StoredNutritionMealPlanOption = {
    id: "macro-targets-option-1",
    label: "Targets",
    title: planName,
    calories,
    carbs: grams.c,
    protein: grams.p,
    fats: grams.f,
    description: `Daily targets: ${calories} kcal, ${grams.p}g protein, ${grams.c}g carbs, ${grams.f}g fat.`,
    image: macroPlanPreviewImage,
  }

  return [
    {
      id: "macro-targets",
      label: "Daily Targets",
      options: [option],
    },
  ]
}

function buildStoredNutritionMacroPlanSegments(
  macros: Record<MacroKey, number>
): StoredNutritionMealPlan["segments"] {
  return [
    {
      macro: "protein",
      value: macros.p,
      fill: "var(--color-protein)",
    },
    {
      macro: "carbs",
      value: macros.c,
      fill: "var(--color-carbs)",
    },
    {
      macro: "fats",
      value: macros.f,
      fill: "var(--color-fats)",
    },
  ]
}

export function cloneStoredNutritionMacroPlanBuilderSnapshot(
  snapshot: StoredNutritionMacroPlanBuilderSnapshot,
  overrides?: Partial<StoredNutritionMacroPlanBuilderSnapshot>
): StoredNutritionMacroPlanBuilderSnapshot {
  const nextMacros = { ...(overrides?.macros ?? snapshot.macros) }
  const nextPresets = (overrides?.presets ?? snapshot.presets).map((preset) => ({
    ...preset,
  }))

  return {
    planName: snapshot.planName,
    calories: snapshot.calories,
    macros: nextMacros,
    presets: nextPresets,
    selectedPresetId: snapshot.selectedPresetId,
    lockedMacroKey: snapshot.lockedMacroKey,
    ...overrides,
  }
}

export function buildStoredNutritionMacroPlanFromBuilderState({
  planId,
  planName,
  calories,
  macros,
  presets,
  selectedPresetId,
  lockedMacroKey,
  assignedClientIds,
  createdAt,
}: {
  planId?: string
  planName: string
  calories: number
  macros: Record<MacroKey, number>
  presets: MacroBuilderPreset[]
  selectedPresetId: string | null
  lockedMacroKey: MacroKey | null
  assignedClientIds?: string[]
  createdAt?: string
}): StoredNutritionMealPlan {
  const grams = calcMacroPlanGrams(calories, macros)

  return {
    id:
      planId ??
      globalThis.crypto?.randomUUID?.() ??
      `custom-macro-plan-${Date.now()}`,
    title: planName,
    subtitle: `Macro targets set to ${calories} kcal with ${grams.p}g protein, ${grams.c}g carbs, and ${grams.f}g fat.`,
    type: "Macro Plan",
    calories,
    macros: `${grams.p}P / ${grams.c}C / ${grams.f}F`,
    schedule: "Flexible targets",
    segments: buildStoredNutritionMacroPlanSegments(macros),
    sections: buildStoredNutritionMacroPlanSections({
      planName,
      calories,
      grams,
    }),
    createdAt: createdAt ?? new Date().toISOString(),
    assignedClientIds:
      assignedClientIds?.length
        ? Array.from(new Set(assignedClientIds))
        : undefined,
    macroBuilderSnapshot: {
      planName,
      calories,
      macros: { ...macros },
      presets: presets.map((preset) => ({ ...preset })),
      selectedPresetId,
      lockedMacroKey,
    },
  }
}
