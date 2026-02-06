import { ParticleText } from "@/components/ui/particle-text"
import ButtonRotatingGradient from "./ui/buttons/ButtonRotatingGradient"

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
            <div className="flex flex-col gap-2 w-full max-w-sm mt-3">
              <label htmlFor="footer-email" className="text-xs font-medium text-neutral-500">
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
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-start items-start gap-4">
            {/* Twitter/X Icon */}
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="w-6 h-6 left-0 top-0 absolute flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    fill="#49423D"
                  />
                </svg>
              </div>
            </div>

            {/* LinkedIn Icon */}
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="w-6 h-6 left-0 top-0 absolute flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"
                    fill="#49423D"
                  />
                </svg>
              </div>
            </div>

            {/* GitHub Icon */}
            <div className="w-6 h-6 relative overflow-hidden">
              <div className="w-6 h-6 left-0 top-0 absolute flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.300 24 12c0-6.627-5.374-12-12-12z"
                    fill="#49423D"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="self-stretch p-4 md:p-8 flex flex-col sm:flex-row flex-wrap justify-start sm:justify-between items-start gap-6 md:gap-8">
          {FOOTER_LINKS.map((column) => (
            <div key={column.title} className="flex flex-col justify-start items-start gap-3 flex-1 min-w-[120px]">
              <div className="self-stretch text-[rgba(73,66,61,0.50)] text-sm font-medium leading-5 font-sans">
                {column.title}
              </div>
              <div className="flex flex-col justify-end items-start gap-2">
                {column.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-[#49423D] text-sm font-normal leading-5 font-sans cursor-pointer hover:text-[#37322F] transition-colors"
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
