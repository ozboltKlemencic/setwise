const steps = [
  {
    title: "1. Dodaj stranko",
    description:
      "Vse se zacne pri pregledu strank, kjer hitro odpres profil in pripravis osnovo za sodelovanje.",
  },
  {
    title: "2. Poslji vprasalnike",
    description:
      "Uporabi onboarding, check-in in habbits obrazce za zbiranje podatkov ter sprotno spremljanje napredka.",
  },
  {
    title: "3. Pripravi plan",
    description:
      "Na enem mestu sestavis programe, meal plane in suplementacijo glede na cilje posamezne stranke.",
  },
]

export default function HowItWorksPage() {
  return (
    <section className="space-y-4 px-4 lg:px-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Kako deluje?
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Coach Wise ti pomaga voditi celoten proces dela s stranko od prvega
          vpogleda do rednega spremljanja napredka.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <article
            key={step.title}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-base font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
