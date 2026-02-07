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
      <div className="flex-1 px-4 md:px-12 py-10 md:py-16 lg:py-20 flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-12">
        {/* Left Column - Header */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center md:items-start gap-3 md:gap-4 lg:py-5">
          <div className="w-full flex flex-col justify-center text-center md:text-left text-[#49423D] font-semibold leading-tight md:leading-[44px] font-sans text-3xl md:text-4xl tracking-tight">
            {t('title')}
          </div>
          <div className="w-full text-center md:text-left text-[#605A57] text-sm md:text-base font-normal leading-6 md:leading-7 font-sans">
            {t('subtitle')}
          </div>
        </div>

        {/* Right Column - FAQ Items */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center">
          <div className="w-full flex flex-col">
            {faqItems.map((item, index) => {
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

