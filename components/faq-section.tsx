"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "What analytics does SetWise provide?",
    answer:
      "Progress charts and filters per exercise and time range, so you can visualize strength trends, consistency, and performance changes at a glance.",
  },
  {
    question: "How is my data stored?",
    answer:
      "Your data is encrypted at rest and in transit. We believe your workout data belongs to you, so we offer full JSON/CSV exports at any time.",
  },
  {
    question: "Is SetWise fast to use during a workout?",
    answer:
      "Yes - logging is designed for speed. Most sets take seconds to record, with advanced options (RPE/RIR, tempo, notes) available when you need them.",
  },
  {
    question: "Can it handle my training style (strength, bodybuilding, powerbuilding)?",
    answer:
      "Yes. It supports straight sets, supersets, and advanced set types (e.g., drop sets, rest-pause, myo-reps), so it fits most programs.",
  },
  {
    question: "How does 'Paste Import' work - and what formats does it understand?",
    answer:
      "Paste any workout as plain text (from Notes, WhatsApp, Excel, or copied text). SetWise uses LLM-powered parsing to recognize exercises, sets, reps, and common set types - then converts it into a clean, structured workout you can log instantly. It's designed to handle different writing styles and messy formatting.",
  },
  {
    question: "Will this feel too advanced or complicated?",
    answer:
      "No. SetWise adapts to your style - keep it simple with weight/reps only, or toggle Advanced Tracking when you want details like RPE / RIR, tempo, ROM, and intensifiers.",
  },
  {
    question: "Can I see progress per exercise (not just overall)?",
    answer:
      "Yes - analytics are exercise-level, with filters for time ranges and key metrics so you can zoom in on any lift.",
  },
  {
    question: "Does it work offline in the gym?",
    answer:
      "Yes. You can log offline and sync later when you're back online.",
  },
]

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div className="w-full flex justify-center items-start">
      <div className="flex-1 px-4 md:px-12 py-10 md:py-16 lg:py-20 flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-12">
        {/* Left Column - Header */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center md:items-start gap-3 md:gap-4 lg:py-5">
          <div className="w-full flex flex-col justify-center text-center md:text-left text-[#49423D] font-semibold leading-tight md:leading-[44px] font-sans text-3xl md:text-4xl tracking-tight">
            Frequently Asked Questions
          </div>
          <div className="w-full text-center md:text-left text-[#605A57] text-sm md:text-base font-normal leading-6 md:leading-7 font-sans">
            Explore your data, build your dashboard,
            <br className="hidden md:block" />
            bring your team together.
          </div>
        </div>

        {/* Right Column - FAQ Items */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center">
          <div className="w-full flex flex-col">
            {faqData.map((item, index) => {
              const isOpen = openIndex === index

              return (
                <div key={index} className="w-full border-b border-[rgba(73,66,61,0.16)] overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-3 md:px-5 py-3 md:py-[18px] flex justify-between items-center gap-3 md:gap-5 text-left hover:bg-[rgba(73,66,61,0.02)] transition-colors duration-200 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <div className="flex-1 text-[#49423D] text-sm md:text-base font-medium leading-5 md:leading-6 font-sans">
                      {item.question}
                    </div>
                    <motion.div
                      className="flex justify-center items-center"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ChevronDownIcon className="w-5 h-5 md:w-6 md:h-6 text-[rgba(73,66,61,0.60)]" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                          opacity: { duration: 0.2, ease: "easeInOut" }
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 md:px-5 pb-3 md:pb-[18px] text-[#605A57] text-xs md:text-sm font-normal leading-5 md:leading-6 font-sans">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
