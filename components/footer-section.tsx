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
        <div className="h-auto max-w-[380px] p-4 md:p-8 pb-0 flex flex-col justify-start items-start gap-6">
          {/* Brand & Description */}
          <div className="flex flex-col gap-3">
            <div className="text-neutral-800 text-xl font-semibold leading-6 font-sans">SetWise</div>
            <p className="text-neutral-500 text-sm font-normal leading-relaxed font-sans">
              Your fitness journey, simplified. Track workouts, stay motivated, and reach your goals.
            </p>
          </div>

          {/* Newsletter Section */}
          <div className="flex flex-col gap-y-2 w-full">
            <div className="text-neutral-700 text-sm font-medium leading-5 font-sans">
              Join the waitlist
            </div>
            <div className="flex gap-2 w-full">
              <input
                type="email"
                id="footer-email"
                placeholder="you@example.com"
                className="flex-1 px-4 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors duration-200">
                Join
              </button>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="flex flex-col gap-y-2">
            <div className="text-neutral-700 text-sm font-medium leading-5 font-sans">
              Follow us
            </div>
            <div className="flex items-center gap-x-3">
              <a href="#" className=" rounded-lg hover:bg-neutral-100 transition-colors duration-200">
                <Instagram className="size-5 text-neutral-500 hover:text-neutral-800 transition-colors duration-200" />
              </a>
              <a href="#" className=" rounded-lg hover:bg-neutral-100 transition-colors duration-200">
                <Linkedin className="size-5 text-neutral-500 hover:text-neutral-800 transition-colors duration-200" />
              </a>
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
