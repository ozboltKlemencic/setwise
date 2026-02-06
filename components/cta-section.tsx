import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Iphone } from "./ui/mobileDevices/Phone"

export default function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="w-full relative group flex flex-col justify-center items-center gap-2 overflow-hidden">
      {/* Content */}
      <div
        ref={containerRef}
        className="self-stretch flex-col md:flex-row min-h-[380px] md:min-h-[500px] px-4 md:px-24 py-10 md:py-12 border-t border-b border-[rgba(55,50,47,0.12)] flex justify-center md:justify-start items-center gap-6 relative z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="w-full h-full relative bg-blue-500/10 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]">

            {Array.from({ length: 300 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-4 w-full rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.1)] outline-offset-[-0.25px]"
                style={{
                  top: `${i * 16 - 120}px`,
                  left: "-100%",
                  width: "300%",
                }}
              ></div>
            ))}
          </div>
        </div>
        <div className="w-full md:max-w-[586px] pb-20 md:pb-0 md:w-1/2 px-4 md:px-6 py-5 md:py-8 overflow-hidden rounded-lg flex flex-col justify-start items-center md:items-start gap-4 md:gap-6 relative z-20">
          <div className="self-stretch flex flex-col justify-start items-center md:items-start gap-2 md:gap-3">
            <div className="self-stretch text-center md:text-left flex justify-center flex-col text-[#49423D] text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[56px] font-sans tracking-tight">
              Make your next session count.
            </div>
            <div className="self-stretch text-center md:text-left text-[#605A57] text-sm md:text-base leading-6 md:leading-7 font-sans font-medium">
              Log smarter, compare sets, and see progress clearly. Download now and train with purpose.
            </div>
          </div>
          <div className="w-full max-w-[497px] flex flex-col justify-start items-center md:items-start gap-12">
            <div className="flex justify-start items-center gap-4">
              <div className="h-10 px-8 md:px-12 py-[6px] relative bg-[#37322F] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#2A2520] transition-colors">
                <div className="w-44 h-[41px] absolute left-0 top-0 bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgba(0,0,0,0.10)] mix-blend-multiply"></div>
                <div className="flex flex-col justify-center text-white text-xs md:text-[13px] font-medium leading-5 font-sans">
                  Start session
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* iPhone - hidden on mobile */}
        <motion.div
          initial={{ y: "-80%" }}
          animate={{ y: isHovered ? "-35%" : isInView ? "25%" : "-50%" }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-[250px] md:w-[334px] absolute md:top-[-4rem] top-[40%] right-12 md:right-[6rem] transform-gpu will-change-transform "
        >
          <Iphone src="/home.png" />
        </motion.div>
      </div>
    </div>
  )
}
