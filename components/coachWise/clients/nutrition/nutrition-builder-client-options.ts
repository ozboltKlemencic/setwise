import clientData from "@/app/[locale]/beta-coach-wise/data.json"

export type NutritionBuilderClientOption = {
  id: string
  name: string
  avatar?: string
}

export const nutritionBuilderClientOptions: NutritionBuilderClientOption[] =
  clientData.map((client) => ({
    id: String(client.id),
    name: client.header,
    avatar: client.avatar,
  }))
