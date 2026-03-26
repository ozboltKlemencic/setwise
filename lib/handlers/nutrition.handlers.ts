export type ClientNutritionTab = "meal-plans" | "nutrition-logger"

export function resolveClientNutritionTab(
  value?: string
): ClientNutritionTab {
  return value === "nutrition-logger" ? "nutrition-logger" : "meal-plans"
}
