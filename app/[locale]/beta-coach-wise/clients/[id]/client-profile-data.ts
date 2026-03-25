import data from "../../data.json"

export type CoachWiseClientProfile = (typeof data)[number]

export function getCoachWiseClientById(clientId: number) {
  return data.find((item) => item.id === clientId)
}

export function getClientWhatsappLink(name: string) {
  const message = `Pozdrav ${name}, javljam se glede tvojega check-ina.`

  return `https://wa.me/?text=${encodeURIComponent(message)}`
}
