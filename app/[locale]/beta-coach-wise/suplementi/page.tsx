import { IconDots } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SupplementTag = "Recovery" | "Performance" | "Health"

const supplements: Array<{
  id: string
  name: string
  tag: SupplementTag
  meaning: string
}> = [
  {
    id: "whey-isolate",
    name: "Whey Isolate",
    tag: "Recovery",
    meaning: "Hitrejse okrevanje po treningu in lazji vnos beljakovin.",
  },
  {
    id: "creatine",
    name: "Creatine Monohydrate",
    tag: "Performance",
    meaning: "Podpora moci, eksplozivnosti in daljse progresije pri treningu.",
  },
  {
    id: "omega-3",
    name: "Omega 3",
    tag: "Health",
    meaning: "Podpora srcno-zilnemu zdravju in uravnavanju vnetij.",
  },
  {
    id: "magnesium",
    name: "Magnesium Glycinate",
    tag: "Recovery",
    meaning: "Boljse spanje, sproscanje in manj utrujenosti po obremenitvah.",
  },
  {
    id: "vitamin-d3",
    name: "Vitamin D3",
    tag: "Health",
    meaning: "Podpora imunskemu sistemu, hormonskemu ravnovesju in pocutju.",
  },
  {
    id: "pre-workout",
    name: "Pre Workout",
    tag: "Performance",
    meaning: "Vec fokusa in energije pred zahtevnim treningom.",
  },
]

function getTagClassName(tag: SupplementTag) {
  if (tag === "Recovery") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700"
  }

  if (tag === "Performance") {
    return "border-sky-200 bg-sky-50 text-sky-700"
  }

  return "border-violet-200 bg-violet-50 text-violet-700"
}

export default function SuplementiPage() {
  return (
    <section className="bg-neutral-50 p-4">
      <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-muted/60">
            <tr className="border-b border-neutral-200">
              <th className="px-5 py-4 text-left text-[14px] font-medium text-neutral-950">
                Suplement
              </th>
              <th className="w-[180px] px-5 py-4 text-left text-[14px] font-medium text-neutral-950">
                Tag
              </th>
              <th className="px-5 py-4 text-left text-[14px] font-medium text-neutral-950">
                Pomen
              </th>
              <th className="w-[56px] px-4 py-4 text-right text-[14px] font-medium text-neutral-950" />
            </tr>
          </thead>
          <tbody>
            {supplements.map((supplement) => (
              <tr
                key={supplement.id}
                className="border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50/60"
              >
                <td className="px-5 py-5 text-[16px] font-medium text-neutral-950">
                  {supplement.name}
                </td>
                <td className="px-5 py-5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-7 rounded-sm border px-2.5 text-[13px] font-medium",
                      getTagClassName(supplement.tag),
                    )}
                  >
                    {supplement.tag}
                  </Badge>
                </td>
                <td className="px-5 py-5 text-[14px] text-neutral-700">
                  {supplement.meaning}
                </td>
                <td className="px-4 py-5 text-right">
                  <Button
                    variant="ghost"
                    className="size-8 rounded-sm border border-neutral-200 bg-white p-0 text-neutral-500 shadow-none hover:bg-neutral-100 hover:text-neutral-700"
                  >
                    <IconDots className="size-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
