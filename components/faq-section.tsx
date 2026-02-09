"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"

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
  const t = useTranslations('FAQ')

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  // Get FAQ items from translations
  const faqItems = t.raw('items') as Array<{ question: string; answer: string }>

  return (
    <div className="w-full flex justify-center items-start">
      <div className="flex-1 px-(--space-4) md:px-(--space-12) py-(--space-10) md:py-(--space-16) lg:py-(--space-20) flex flex-col lg:flex-row justify-start items-start gap-(--space-6) lg:gap-(--space-12)">

        {/* Left Column — Header */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center md:items-start gap-(--space-3) md:gap-(--space-4) lg:py-(--space-5)">
          {/* Title — Apple HIG responsive typography */}
          <h2 className="w-full text-center md:text-left text-surface-900 text-title-1 md:text-large-title font-semibold font-sans">
            {t('title')}
          </h2>
          {/* Subtitle — Apple HIG subheadline/callout */}
          <p className="w-full text-center md:text-left text-surface-600 text-subheadline md:text-callout font-normal font-sans">
            {t('subtitle')}
          </p>
        </div>

        {/* Right Column — FAQ Items */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center">
          <div className="w-full flex flex-col">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index

              return (
                <div key={index} className="w-full  overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-(--space-3) md:px-(--space-5) py-(--space-3) md:py-(--space-4) flex justify-between items-center gap-(--space-3) md:gap-(--space-5) text-left hover:bg-surface-200/70 dark:hover:bg-surface-200 transition-colors duration-(--duration-fast) ease-(--ease-apple) cursor-pointer rounded-2xl "
                    aria-expanded={isOpen}
                  >
                    {/* Question — Apple HIG headline style */}
                    <div className="flex-1 text-surface-900 text-subheadline md:text-callout font-medium font-sans">
                      {item.question}
                    </div>
                    <motion.div
                      className="flex justify-center items-center"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <ChevronDownIcon className="size-5 md:size-6 text-surface-500" />
                    </motion.div>

                  </button>
                  {index < faqItems.length - 1 && (
                    <div role="separator" className="h-px  bg-border mx-(--space-3)"></div>
                  )}
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
                        {/* Answer — Apple HIG footnote/subheadline */}
                        <div className="px-(--space-3) md:px-(--space-5) pb-(--space-3) md:pb-(--space-4) text-surface-600 text-footnote md:text-subheadline font-normal font-sans">
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
