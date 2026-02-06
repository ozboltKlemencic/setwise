import { ParticleText } from "@/components/ui/particle-text"
import ButtonRotatingGradient from "./ui/buttons/ButtonRotatingGradient"
import { Instagram, Linkedin } from "lucide-react"

// Footer navigation links data
const FOOTER_LINKS = [
  {
    title: "Products",
    links: [
      { label: "SetWise", href: "/" },
      { label: "CoachWise", href: "/coachwise" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "#" },
      { label: "Our team", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Community", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "#" },
      { label: "Terms of use", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
]

export default function FooterSection() {
  return (
    <div className="w-full pt-10 flex flex-col justify-start items-start">
      {/* Main Footer Content */}
      <div className="self-stretch h-auto flex flex-col md:flex-row justify-between items-stretch pr-0  pt-0">
        <div className="h-auto max-w-[450px] p-4 md:p-8 pb-0 flex flex-col justify-start items-start gap-8 ">
          {/* Brand Section */}
          <div className="w-full flex flex-col justify-start items-start gap-4">
            <div>
              <div className="text-[#49423D] text-xl font-semibold leading-6 font-sans">SetWise</div>
              <p className="text-[rgba(73,66,61,0.70)] text-sm font-medium leading-[18px] font-sans mt-1">
                Your fitness journey, simplified. Setwise is a fitness app that helps you track your workouts and stay motivated.
              </p>
            </div>
            {/* Email Signup */}
            <div className="flex flex-col gap-2 w-full max-w-sm mt-2">
              <label htmlFor="footer-email" className="text-xs font-medium text-neutral-600 pb-0.5">
                Join the waitlist
              </label>
              <div className="flex gap-2 w-full">
                <input
                  type="email"
                  id="footer-email"
                  placeholder="you@example.com"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200/80 bg-white text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                />
                <button
                  className="relative overflow-hidden rounded-xl p-[1.5px] bg-gradient-to-r from-blue-600/80 to-blue-500  transition-all duration-300  active:scale-95"
                >
                  <span className="relative flex items-center justify-center rounded-[10px] px-5 py-2.5 text-sm font-medium text-white transition-colors">
                    Join
                  </span>
                  <div className="absolute top-0 left-0 w-2/5 translate-y-1/3 -translate-x-1/2 h-full bg-white/30 blur-md rounded-full"></div>
                  <div className="absolute top-0 right-0 w-2/5 -translate-y-1/3 translate-x-1/2 h-full bg-white/30 blur-md rounded-full"></div>
                </button>
              </div>
            </div>
            <div className="mt-2">
              {/* Social Media Icons */}
              <label htmlFor="footer-email" className="text-xs font-medium text-neutral-600 ">
                Follow us
              </label>
              <div className="flex justify-start items-start gap-4 pt-1">
                {/* Twitter/X Icon */}
                <Instagram className="size-5 text-neutral-500" />
                {/* LinkedIn Icon */}
                <Linkedin className="size-5 text-neutral-500" />



              </div>
            </div>
          </div>

        </div>

        {/* Navigation Links */}
        <div className="self-stretch p-4 md:p-8 flex flex-col sm:flex-row flex-wrap justify-start sm:justify-between items-start gap-6 md:gap-8">
          {FOOTER_LINKS.map((column) => (
            <div key={column.title} className="flex flex-col justify-start items-start gap-3 flex-1 min-w-[120px]">
              <div className="self-stretch text-neutral-700 text-sm font-medium leading-5 font-sans">
                {column.title}
              </div>
              <div className="flex flex-col justify-end items-start gap-2">
                {column.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-neutral-500 text-sm font-normal leading-5 font-sans cursor-pointer duration-300 hover:text-neutral-900 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Particle Text Section */}
      <div className="w-full relative overflow-hidden">
        {/* SetWise text made of particles */}
        <div className="relative flex justify-center items-center  w-full h-[180px] md:h-[300px]">
          <ParticleText text="SetWise" className="w-full h-full" />
        </div>
      </div>
    </div>
  )
}
