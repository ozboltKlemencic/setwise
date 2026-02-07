import { useTranslations } from "next-intl"
import { ParticleText } from "@/components/ui/particle-text"
import ButtonRotatingGradient from "./ui/buttons/ButtonRotatingGradient"
import { Instagram, Linkedin } from "lucide-react"

export default function FooterSection() {
  const t = useTranslations('Footer')

  // Footer navigation links data with translations
  const FOOTER_LINKS = [
    {
      title: t('sections.products'),
      links: [
        { label: t('links.setwise'), href: "/" },
        { label: t('links.coachwise'), href: "/coachwise" },
      ],
    },
    {
      title: t('sections.company'),
      links: [
        { label: t('links.aboutUs'), href: "#" },
        { label: t('links.ourTeam'), href: "#" },
        { label: t('links.contact'), href: "#" },
      ],
    },
    {
      title: t('sections.resources'),
      links: [
        { label: t('links.community'), href: "#" },
        { label: t('links.documentation'), href: "#" },
        { label: t('links.changelog'), href: "#" },
        { label: t('links.support'), href: "#" },
      ],
    },
    {
      title: t('sections.legal'),
      links: [
        { label: t('links.privacyPolicy'), href: "#" },
        { label: t('links.termsOfUse'), href: "#" },
        { label: t('links.cookies'), href: "#" },
      ],
    },
  ]

  return (
    <div className="w-full pt-10 flex flex-col justify-start items-start">
      {/* Main Footer Content */}
      <div className="self-stretch h-auto flex flex-col md:flex-row justify-between items-stretch pr-0  pt-0">
        <div className="h-auto max-w-[380px] p-4 md:p-8 pb-0 flex flex-col justify-start items-start gap-6">
          {/* Brand & Description */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2  ">
              <img src="/setwise-logo.png" alt="SetWise" className="size-6 rounded-sm" />
              <span className="text-lg font-bold text-neutral-700 font-sans">SetWise</span>
            </div>

            <p className="text-neutral-500 text-sm font-normal leading-relaxed font-sans">
              {t('description')}
            </p>
          </div>

          {/* Newsletter Section */}
          <div className="flex flex-col gap-y-2 w-full">
            <div className="text-neutral-700 text-sm font-medium leading-5 font-sans">
              {t('joinWaitlist')}
            </div>
            <div className="flex gap-2 w-full">
              <input
                type="email"
                id="footer-email"
                placeholder={t('emailPlaceholder')}
                className="flex-1 px-4 py-2 h-10 rounded-lg border border-neutral-200 bg-white text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button className="px-5 py-2 h-10 min-w-[100px] whitespace-nowrap rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors duration-200">
                {t('join')}
              </button>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="flex flex-col gap-y-2">
            <div className="text-neutral-700 text-sm font-medium leading-5 font-sans">
              {t('followUs')}
            </div>
            <div className="flex items-center gap-x-3">
              <a href="#" className="  ">
                <Instagram className="md:size-4 size-3 font-thin text-neutral-500  hover:text-neutral-800 transition-colors duration-200" />
              </a>
              <a href="#" className="  h">
                <Linkedin className="md:size-4 size-3 font-thin text-neutral-500 hover:text-neutral-800 transition-colors duration-200" />
              </a>
              <a href="#" className=" md:size-4 size-3 text-neutral-500 hover:text-neutral-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-tiktok" viewBox="0 0 16 16">
                  <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                </svg>
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

