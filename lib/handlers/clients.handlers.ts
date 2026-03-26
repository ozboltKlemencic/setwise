import data from "@/app/[locale]/beta-coach-wise/data.json"

export type CoachWiseClientProfile = (typeof data)[number]

export function getCoachWiseClientById(clientId: number) {
  return data.find((item) => item.id === clientId)
}

export function getClientWhatsappLink(name: string) {
  const message = `Pozdrav ${name}, javljam se glede tvojega check-ina.`

  return `https://wa.me/?text=${encodeURIComponent(message)}`
}

export function getClientContactEmail(clientHeader: string) {
  return `${clientHeader.toLowerCase().replaceAll(" ", ".")}@hubfit.io`
}

export function getClientContactPhone(clientId: number) {
  return `+386 40 ${String(120 + clientId).padStart(3, "0")} ${String(310 + clientId).padStart(3, "0")}`
}

export function getClientCoachingWeek(clientId: number) {
  return `Week ${((clientId + 10) % 13) + 1} of 13`
}

export function getClientWeeklyAvgWeight(clientId: number, phase?: string) {
  const baseWeight =
    phase === "Bulk" ? 74.0 : phase === "Cut" ? 71.8 : 76.5
  const offsets = [0.6, 0, -0.4]
  const offset = offsets[clientId % offsets.length] ?? 0

  return `${(baseWeight + offset).toFixed(1)} kg`
}

export function getClientNameParts(clientHeader: string) {
  const [firstName = "", ...lastNameParts] = clientHeader.split(" ")

  return {
    firstName,
    lastName: lastNameParts.join(" "),
  }
}

export function getClientGoalSummary(phase?: string) {
  switch (phase) {
    case "Bulk":
      return "Wants to improve strength numbers, stay consistent with food quality and keep recovery high through the week."
    case "Cut":
      return "Wants to go down from 95kg to 75kg while keeping training performance stable and energy predictable."
    default:
      return "Wants to maintain body composition, keep routine stable and improve overall daily energy."
  }
}

export function getClientInjurySummary(phase?: string) {
  if (phase === "Bulk") {
    return "Sensitive left shoulder after heavier pressing days, but no pain in daily movement. Extra warm-up remains important."
  }

  return "Occasional lower-back tightness after longer sitting blocks. Mobility before training keeps symptoms under control."
}

export function getClientTag(phase?: string) {
  switch (phase) {
    case "Bulk":
      return "Strength Focus"
    case "Cut":
      return "Fat Loss"
    default:
      return "In-Person"
  }
}
