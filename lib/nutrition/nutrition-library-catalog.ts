export type NutritionLibraryFoodUnit = "g" | "piece" | "ml" | "slice"

export type NutritionLibraryFood = {
  id: number
  name: string
  cal: number
  p: number
  c: number
  f: number
  unit: NutritionLibraryFoodUnit
  step: number
  defaultQty: number
}

export type NutritionLibraryMealTemplateItem = {
  foodId: number
  qty: number
}

export type NutritionLibraryMealTemplate = {
  id: string
  name: string
  subtitle: string
  items: NutritionLibraryMealTemplateItem[]
  isCustom?: boolean
}

export const DEFAULT_NUTRITION_LIBRARY_FOODS: NutritionLibraryFood[] = [
  { id: 1, name: "Chicken breast", cal: 165, p: 31, c: 0, f: 3.6, unit: "g", step: 50, defaultQty: 150 },
  { id: 2, name: "Cooked rice", cal: 130, p: 2.7, c: 28, f: 0.3, unit: "g", step: 50, defaultQty: 200 },
  { id: 3, name: "Broccoli", cal: 34, p: 2.8, c: 7, f: 0.4, unit: "g", step: 50, defaultQty: 150 },
  { id: 4, name: "Eggs", cal: 155, p: 13, c: 1.1, f: 11, unit: "piece", step: 1, defaultQty: 3 },
  { id: 5, name: "Oats", cal: 389, p: 17, c: 66, f: 7, unit: "g", step: 10, defaultQty: 80 },
  { id: 6, name: "Banana", cal: 89, p: 1.1, c: 23, f: 0.3, unit: "piece", step: 1, defaultQty: 1 },
  { id: 7, name: "Whey protein", cal: 120, p: 24, c: 3, f: 1.5, unit: "g", step: 5, defaultQty: 30 },
  { id: 8, name: "Tuna", cal: 116, p: 26, c: 0, f: 1, unit: "g", step: 50, defaultQty: 100 },
  { id: 9, name: "Sweet potato", cal: 86, p: 1.6, c: 20, f: 0.1, unit: "g", step: 50, defaultQty: 200 },
  { id: 10, name: "Cottage cheese", cal: 98, p: 11, c: 3.4, f: 4.3, unit: "g", step: 50, defaultQty: 200 },
  { id: 11, name: "Avocado", cal: 160, p: 2, c: 9, f: 15, unit: "piece", step: 1, defaultQty: 1 },
  { id: 12, name: "Almonds", cal: 579, p: 21, c: 22, f: 50, unit: "g", step: 5, defaultQty: 30 },
  { id: 13, name: "Salmon", cal: 208, p: 20, c: 0, f: 13, unit: "g", step: 50, defaultQty: 150 },
  { id: 14, name: "Spinach", cal: 23, p: 2.9, c: 3.6, f: 0.4, unit: "g", step: 50, defaultQty: 100 },
  { id: 15, name: "Greek yogurt", cal: 59, p: 10, c: 3.6, f: 0.7, unit: "g", step: 50, defaultQty: 200 },
  { id: 16, name: "Wholegrain bread", cal: 247, p: 13, c: 41, f: 3.4, unit: "slice", step: 1, defaultQty: 2 },
  { id: 17, name: "Olive oil", cal: 884, p: 0, c: 0, f: 100, unit: "ml", step: 5, defaultQty: 10 },
  { id: 18, name: "Turkey fillet", cal: 135, p: 30, c: 0, f: 1, unit: "g", step: 50, defaultQty: 150 },
  { id: 19, name: "Quinoa", cal: 120, p: 4.4, c: 21, f: 1.9, unit: "g", step: 50, defaultQty: 150 },
  { id: 20, name: "Strawberries", cal: 32, p: 0.7, c: 7.7, f: 0.3, unit: "g", step: 50, defaultQty: 150 },
]

export const DEFAULT_NUTRITION_MEAL_TEMPLATES: NutritionLibraryMealTemplate[] = [
  {
    id: "template-oats-breakfast",
    name: "Protein Oats Breakfast",
    subtitle: "Balanced breakfast bowl for steady energy and an easy protein start.",
    items: [
      { foodId: 5, qty: 80 },
      { foodId: 7, qty: 30 },
      { foodId: 6, qty: 1 },
      { foodId: 12, qty: 15 },
    ],
  },
  {
    id: "template-chicken-bowl",
    name: "Chicken Rice Bowl",
    subtitle: "Simple high-carb lunch built around lean protein and fast recovery.",
    items: [
      { foodId: 1, qty: 180 },
      { foodId: 2, qty: 250 },
      { foodId: 17, qty: 10 },
      { foodId: 3, qty: 100 },
    ],
  },
  {
    id: "template-salmon-dinner",
    name: "Salmon & Potatoes",
    subtitle: "Higher-fat evening meal with omega-3 rich fish and slow carbs.",
    items: [
      { foodId: 13, qty: 180 },
      { foodId: 9, qty: 300 },
      { foodId: 3, qty: 120 },
    ],
  },
  {
    id: "template-yogurt-bowl",
    name: "Greek Yogurt Recovery Bowl",
    subtitle: "Quick recovery snack with fruit carbs and an easy protein top-up.",
    items: [
      { foodId: 15, qty: 200 },
      { foodId: 20, qty: 150 },
      { foodId: 7, qty: 20 },
      { foodId: 12, qty: 10 },
    ],
  },
]

export function cloneNutritionLibraryFoods(
  foods: NutritionLibraryFood[]
): NutritionLibraryFood[] {
  return foods.map((food) => ({ ...food }))
}

export function cloneNutritionMealTemplates(
  templates: NutritionLibraryMealTemplate[]
): NutritionLibraryMealTemplate[] {
  return templates.map((template) => ({
    ...template,
    items: template.items.map((item) => ({ ...item })),
  }))
}

export function deriveNutritionFoodCategory(values: {
  p: number
  c: number
  f: number
}) {
  const pairs = [
    { key: "Protein", value: values.p },
    { key: "Carbs", value: values.c },
    { key: "Fats", value: values.f },
  ]
  const dominant = [...pairs].sort((left, right) => right.value - left.value)[0]
  return dominant?.key ?? "Food"
}

export function formatNutritionFoodUnitShortLabel(
  unit: NutritionLibraryFoodUnit
) {
  switch (unit) {
    case "piece":
      return "pc"
    case "slice":
      return "sl"
    default:
      return unit
  }
}
