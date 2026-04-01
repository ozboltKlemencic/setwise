import type {
  StoredNutritionMacroSegment,
  StoredNutritionMealPlan,
  StoredNutritionMealPlanBuilderSnapshot,
  StoredNutritionMealPlanOption,
  StoredNutritionMealPlanSection,
} from "@/lib/handlers/nutrition-plan-storage"
import {
  cloneNutritionLibraryFoods,
  cloneNutritionMealTemplates,
  DEFAULT_NUTRITION_LIBRARY_FOODS,
  DEFAULT_NUTRITION_MEAL_TEMPLATES,
  type NutritionLibraryMealTemplate,
} from "@/lib/nutrition/nutrition-library-catalog"

export type BuilderFood = StoredNutritionMealPlanBuilderSnapshot["foods"][number]
export type BuilderMealItem =
  StoredNutritionMealPlanBuilderSnapshot["meals"][number]["items"][number]
export type BuilderMeal = StoredNutritionMealPlanBuilderSnapshot["meals"][number]
export type BuilderMealPlanGoalSettings =
  StoredNutritionMealPlanBuilderSnapshot["mealPlanGoals"]

export type BuilderMealPlanGoalTargets = {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
}

export type BuilderTemplateItem = {
  foodId: number
  qty: number
}

export type BuilderMealTemplate = NutritionLibraryMealTemplate

type BuilderMealPlanSectionLike = {
  label: string
  options: Array<{
    title: string
    calories: number
    carbs: number
    protein: number
    fats: number
    description: string
  }>
}

export const DEFAULT_BUILDER_FOODS: BuilderFood[] =
  cloneNutritionLibraryFoods(DEFAULT_NUTRITION_LIBRARY_FOODS)

export const DEFAULT_BUILDER_MEAL_TEMPLATES: BuilderMealTemplate[] =
  cloneNutritionMealTemplates(DEFAULT_NUTRITION_MEAL_TEMPLATES)

export const RECENT_BUILDER_FOOD_IDS = [1, 2, 5, 4, 7, 3, 15, 8, 13, 6]

const fallbackMealImages = [
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80",
]

function cloneFoods(foods: BuilderFood[]) {
  return foods.map((food) => ({ ...food }))
}

function cloneMeals(meals: BuilderMeal[]) {
  return meals.map((meal) => ({
    ...meal,
    items: meal.items.map((item) => ({ ...item })),
  }))
}

function createDefaultMealPlanGoalSettingsSnapshot(): BuilderMealPlanGoalSettings {
  return {
    presetId: null,
    calories: { enabled: false, value: 2500 },
    protein: { enabled: false, value: 180 },
    carbs: { enabled: false, value: 250 },
    fat: { enabled: false, value: 80 },
  }
}

export function createMealPlanGoalSettingsFromTargets(
  targets?: BuilderMealPlanGoalTargets
): BuilderMealPlanGoalSettings {
  const nextSettings = createDefaultMealPlanGoalSettingsSnapshot()

  if (!targets) {
    return nextSettings
  }

  if (typeof targets.calories === "number" && targets.calories > 0) {
    nextSettings.calories = {
      enabled: true,
      value: Math.round(targets.calories),
    }
  }

  if (typeof targets.protein === "number" && targets.protein > 0) {
    nextSettings.protein = {
      enabled: true,
      value: Math.round(targets.protein),
    }
  }

  if (typeof targets.carbs === "number" && targets.carbs > 0) {
    nextSettings.carbs = {
      enabled: true,
      value: Math.round(targets.carbs),
    }
  }

  if (typeof targets.fat === "number" && targets.fat > 0) {
    nextSettings.fat = {
      enabled: true,
      value: Math.round(targets.fat),
    }
  }

  return nextSettings
}

export function formatBuilderDate() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date())
}

export function createDefaultMealPlanBuilderSnapshot(
  planName = `Meal Plan - ${formatBuilderDate()}`,
  goalTargets?: BuilderMealPlanGoalTargets
): StoredNutritionMealPlanBuilderSnapshot {
  return {
    planName,
    foods: cloneFoods(DEFAULT_BUILDER_FOODS),
    meals: [{ id: 1, name: "Meal 1", items: [] }],
    mealPlanGoals: createMealPlanGoalSettingsFromTargets(goalTargets),
  }
}

export function formatFoodUnitLabel(unit: BuilderFood["unit"]) {
  switch (unit) {
    case "piece":
      return "pc"
    case "slice":
      return "sl"
    default:
      return unit
  }
}

export function calcBuilderNutrition(
  foods: BuilderFood[],
  foodId: number,
  qty: number
) {
  const food = foods.find((item) => item.id === foodId)

  if (!food) {
    return { cal: 0, p: 0, c: 0, f: 0 }
  }

  const isCountable = food.unit === "piece" || food.unit === "slice"
  const multiplier = isCountable ? qty : qty / 100

  return {
    cal: Math.round(food.cal * multiplier),
    p: +(food.p * multiplier).toFixed(1),
    c: +(food.c * multiplier).toFixed(1),
    f: +(food.f * multiplier).toFixed(1),
  }
}

export function getBuilderMealTotals(foods: BuilderFood[], meal: BuilderMeal) {
  return meal.items.reduce(
    (accumulator, item) => {
      const nutrition = calcBuilderNutrition(foods, item.foodId, item.qty)
      return {
        cal: accumulator.cal + nutrition.cal,
        p: accumulator.p + nutrition.p,
        c: accumulator.c + nutrition.c,
        f: accumulator.f + nutrition.f,
      }
    },
    { cal: 0, p: 0, c: 0, f: 0 }
  )
}

export function getBuilderPlanTotals(foods: BuilderFood[], meals: BuilderMeal[]) {
  return meals.reduce(
    (accumulator, meal) => {
      const totals = getBuilderMealTotals(foods, meal)
      return {
        cal: accumulator.cal + totals.cal,
        p: accumulator.p + totals.p,
        c: accumulator.c + totals.c,
        f: accumulator.f + totals.f,
      }
    },
    { cal: 0, p: 0, c: 0, f: 0 }
  )
}

export function getBuilderTemplateTotals(
  foods: BuilderFood[],
  template: BuilderMealTemplate
) {
  return template.items.reduce(
    (accumulator, item) => {
      const nutrition = calcBuilderNutrition(foods, item.foodId, item.qty)
      return {
        cal: accumulator.cal + nutrition.cal,
        p: accumulator.p + nutrition.p,
        c: accumulator.c + nutrition.c,
        f: accumulator.f + nutrition.f,
      }
    },
    { cal: 0, p: 0, c: 0, f: 0 }
  )
}

function formatStoredFoodQuantity(qty: number, unit: BuilderFood["unit"]) {
  return `${qty} ${formatFoodUnitLabel(unit)}`
}

export function buildStoredNutritionMealPlanSegments(totals: {
  p: number
  c: number
  f: number
}): StoredNutritionMacroSegment[] {
  const proteinCalories = totals.p * 4
  const carbsCalories = totals.c * 4
  const fatsCalories = totals.f * 9
  const totalMacroCalories =
    proteinCalories + carbsCalories + fatsCalories || 1

  const proteinPercent = Math.round((proteinCalories / totalMacroCalories) * 100)
  const carbsPercent = Math.round((carbsCalories / totalMacroCalories) * 100)

  return [
    {
      macro: "protein",
      value: proteinPercent,
      fill: "var(--color-protein)",
    },
    {
      macro: "carbs",
      value: carbsPercent,
      fill: "var(--color-carbs)",
    },
    {
      macro: "fats",
      value: Math.max(0, 100 - proteinPercent - carbsPercent),
      fill: "var(--color-fats)",
    },
  ]
}

export function buildStoredNutritionMealPlanSections(
  meals: BuilderMeal[],
  foods: BuilderFood[]
): StoredNutritionMealPlanSection[] {
  return meals.map((meal, mealIndex) => {
    const mealTotals = getBuilderMealTotals(foods, meal)
    const mealFoodNames = meal.items
      .map((item) => foods.find((food) => food.id === item.foodId)?.name)
      .filter(Boolean) as string[]
    const title =
      mealFoodNames.length > 0
        ? mealFoodNames.join(" + ")
        : `${meal.name} foods`
    const description =
      meal.items.length > 0
        ? meal.items
            .map((item) => {
              const food = foods.find((entry) => entry.id === item.foodId)

              if (!food) {
                return null
              }

              return `${food.name} ${formatStoredFoodQuantity(item.qty, food.unit)}`
            })
            .filter(Boolean)
            .join(", ")
        : "No foods added yet."

    const option: StoredNutritionMealPlanOption = {
      id: `section-${meal.id}-option-1`,
      label: "Option 1",
      title,
      calories: mealTotals.cal,
      carbs: Math.round(mealTotals.c),
      protein: Math.round(mealTotals.p),
      fats: Math.round(mealTotals.f),
      description,
      image: fallbackMealImages[mealIndex % fallbackMealImages.length],
    }

    return {
      id: `section-${meal.id}`,
      label: meal.name,
      options: [option],
    }
  })
}

export function buildStoredNutritionMealPlanFromBuilderState({
  planId,
  planName,
  meals,
  foods,
  mealPlanGoals,
  assignedClientIds,
  createdAt,
}: {
  planId?: string
  planName: string
  meals: BuilderMeal[]
  foods: BuilderFood[]
  mealPlanGoals: BuilderMealPlanGoalSettings
  assignedClientIds?: string[]
  createdAt?: string
}): StoredNutritionMealPlan {
  const planTotals = getBuilderPlanTotals(foods, meals)
  const totalFoodCount = meals.reduce(
    (totalCount, meal) => totalCount + meal.items.length,
    0
  )

  return {
    id: planId ?? `custom-meal-plan-${Date.now()}`,
    title: planName,
    subtitle: `Custom plan with ${meals.length} meals and ${totalFoodCount} foods.`,
    type: "Meal Plan",
    calories: planTotals.cal,
    macros: `${Math.round(planTotals.p)}P / ${Math.round(planTotals.c)}C / ${Math.round(planTotals.f)}F`,
    schedule: `${meals.length} meal${meals.length === 1 ? "" : "s"}`,
    segments: buildStoredNutritionMealPlanSegments(planTotals),
    sections: buildStoredNutritionMealPlanSections(meals, foods),
    createdAt: createdAt ?? new Date().toISOString(),
    assignedClientIds:
      assignedClientIds?.length
        ? Array.from(new Set(assignedClientIds))
        : undefined,
    builderSnapshot: {
      planName,
      foods: cloneFoods(foods),
      meals: cloneMeals(meals),
      mealPlanGoals: {
        presetId: mealPlanGoals.presetId,
        calories: { ...mealPlanGoals.calories },
        protein: { ...mealPlanGoals.protein },
        carbs: { ...mealPlanGoals.carbs },
        fat: { ...mealPlanGoals.fat },
      },
    },
  }
}

function parseBuilderUnit(
  value: string
): BuilderFood["unit"] | null {
  if (value === "g" || value === "ml") {
    return value
  }

  if (value === "pc") {
    return "piece"
  }

  if (value === "sl") {
    return "slice"
  }

  return null
}

function createSyntheticMealFood({
  foods,
  nextFoodId,
  name,
  calories,
  protein,
  carbs,
  fats,
}: {
  foods: BuilderFood[]
  nextFoodId: number
  name: string
  calories: number
  protein: number
  carbs: number
  fats: number
}) {
  const nextFood: BuilderFood = {
    id: nextFoodId,
    name,
    cal: calories,
    p: protein,
    c: carbs,
    f: fats,
    unit: "piece",
    step: 1,
    defaultQty: 1,
  }

  foods.push(nextFood)
  return nextFood
}

function parseMealItemsFromDescription({
  description,
  foods,
  nextItemId,
}: {
  description: string
  foods: BuilderFood[]
  nextItemId: { current: number }
}) {
  const descriptionParts = description
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)

  const nextItems: BuilderMealItem[] = []

  descriptionParts.forEach((part) => {
    const match = part.match(/^(.*)\s+(\d+(?:\.\d+)?)\s+(g|ml|pc|sl)$/i)

    if (!match) {
      return
    }

    const [, rawName, rawQty, rawUnit] = match
    const normalizedName = rawName.trim().toLowerCase()
    const unit = parseBuilderUnit(rawUnit.toLowerCase())
    const qty = Number(rawQty)

    if (!unit || !Number.isFinite(qty)) {
      return
    }

    const food = foods.find(
      (entry) =>
        entry.name.trim().toLowerCase() === normalizedName &&
        entry.unit === unit
    )

    if (!food) {
      return
    }

    nextItems.push({
      id: nextItemId.current++,
      foodId: food.id,
      qty,
    })
  })

  return nextItems
}

export function buildMealPlanBuilderSnapshotFromSections({
  planName,
  sections,
  builderSnapshot,
}: {
  planName: string
  sections: BuilderMealPlanSectionLike[]
  builderSnapshot?: StoredNutritionMealPlanBuilderSnapshot | null
}): StoredNutritionMealPlanBuilderSnapshot {
  if (builderSnapshot) {
    return {
      planName: builderSnapshot.planName || planName,
      foods: cloneFoods(builderSnapshot.foods),
      meals: cloneMeals(builderSnapshot.meals),
      mealPlanGoals: {
        presetId: builderSnapshot.mealPlanGoals.presetId,
        calories: { ...builderSnapshot.mealPlanGoals.calories },
        protein: { ...builderSnapshot.mealPlanGoals.protein },
        carbs: { ...builderSnapshot.mealPlanGoals.carbs },
        fat: { ...builderSnapshot.mealPlanGoals.fat },
      },
    }
  }

  const foods = cloneFoods(DEFAULT_BUILDER_FOODS)
  const nextFoodId = {
    current: Math.max(0, ...foods.map((food) => food.id)) + 1,
  }
  const nextItemId = { current: 1 }
  const meals =
    sections.length > 0
      ? sections.map((section, sectionIndex) => {
          const primaryOption = section.options[0]
          const parsedItems = primaryOption
            ? parseMealItemsFromDescription({
                description: primaryOption.description,
                foods,
                nextItemId,
              })
            : []

          if (!parsedItems.length && primaryOption) {
            const syntheticFood = createSyntheticMealFood({
              foods,
              nextFoodId: nextFoodId.current++,
              name: primaryOption.title,
              calories: primaryOption.calories,
              protein: primaryOption.protein,
              carbs: primaryOption.carbs,
              fats: primaryOption.fats,
            })

            parsedItems.push({
              id: nextItemId.current++,
              foodId: syntheticFood.id,
              qty: 1,
            })
          }

          return {
            id: sectionIndex + 1,
            name: section.label || `Meal ${sectionIndex + 1}`,
            items: parsedItems,
          }
        })
      : [{ id: 1, name: "Meal 1", items: [] }]

  return {
    planName,
    foods,
    meals,
    mealPlanGoals: createDefaultMealPlanGoalSettingsSnapshot(),
  }
}
