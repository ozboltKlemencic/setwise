import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { ParticleText } from "@/components/ui/particle-text"
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

export default function FooterSection() {
  const t = useTranslations('Footer')
  const tFeatures = useTranslations('FeaturesSidebar')
  const tGuides = useTranslations('Guides.Sidebar')

  // Footer navigation columns data with translations
  const FOOTER_COLUMNS = [
    {
      sections: [
        {
          title: t('sections.features'),
          links: [
            { label: tFeatures('intro.title'), href: "/features" },
            { label: tFeatures('quickLogging.title'), href: "/features/quick-logging" },
            { label: tFeatures('templates.title'), href: "/features/templates-programs" },
            { label: tFeatures('progressAnalytics.title'), href: "/features/progress-analytics" },
            { label: tFeatures('advancedMetrics.title'), href: "/features/advanced-metrics" },
            { label: tFeatures('offlineSync.title'), href: "/features/offline-sync" },
          ],
        },
      ],
    },
    {
      sections: [
        {
          title: t('sections.guides'),

          links: [
            { label: tGuides('intro.title'), href: "/guides" },
            { label: tGuides('installation.title'), href: "/guides/installation" },
            { label: tGuides('createWorkout.title'), href: "/guides/create-workout" },
          ],

        },
      ],
    },
    {
      sections: [
        {
          title: t('sections.products'),
          links: [
            { label: t('links.setwise'), href: "/" },
            { label: t('links.coachwise'), href: "/products/coachwise" },
          ],
        },
        {
          title: t('sections.tools'),
          links: [
            { label: t('links.bmrCalculator'), href: "/tools/bmr-calculator" },
            { label: t('links.bodyFatCalculator'), href: "/tools/body-fat-calculator" },
          ],
        },
        {
          title: t('sections.resources'),
          links: [
            { label: t('links.community'), href: "/community" },
            { label: t('links.changelog'), href: "/changelog" },
            { label: t('links.support'), href: "/support" },
            { label: t('sections.guides'), href: "/guides" },
            { label: t('sections.faq'), href: "/faq" },
          ],
        },
      ],
    },
    {
      sections: [
        {
          title: t('sections.company'),
          links: [
            { label: t('links.aboutUs'), href: "/about" },
            { label: t('links.ourTeam'), href: "/our-team" },
            { label: t('links.contact'), href: "/contact" },
          ],
        },
        {
          title: t('sections.legal'),
          links: [
            { label: t('links.privacyPolicy'), href: "/privacy-policy" },
            { label: t('links.termsOfUse'), href: "/terms-of-use" },
            { label: t('links.cookies'), href: "/cookies" },
          ],
        },
      ],
    },
  ]

  return (
    <div className="w-full pt-(--space-10) flex bg-background flex-col justify-start items-start">
      {/* Main Footer Content */}
      <div className="self-stretch h-auto flex flex-col md:flex-row justify-between items-stretch pr-0 gap-y-(--space-8) pt-0">
        {/* Brand col */}
        <div className="h-auto w-full md:min-w-[380px] max-w-[380px] md:mr-(--space-16) p-(--space-4) md:p-(--space-8) pb-0 flex flex-col justify-start items-start gap-y-(--space-3)">
          {/* Brand & Description */}
          <div className="flex flex-col gap-(--space-3)">
            <div className="flex items-center gap-(--space-2)">
              <img src="/setwise-logo.png" alt="SetWise" className="size-6 rounded-sm" />
              <span className="text-footnote font-bold text-surface-800 dark:text-surface-800 font-sans">SetWise</span>
            </div>

            <p className="text-surface-500 dark:text-surface-500 text-footnote font-normal leading-relaxed font-sans">
              {t('description')}
            </p>
          </div>



          {/* Social Links Section */}
          <div className="flex flex-col gap-y-(--space-2)">
            <div className="text-surface-700  text-footnote font-medium font-sans">
              {t('followUs')}
            </div>
            <div className="flex items-center md:gap-x-(--space-3) gap-x-(--space-4)">
              <a href="#" target="_blank" className="text-surface-500  hover:text-surface-800 transition-colors duration-(--duration-fast) ease-(--ease-apple)">
                <Instagram className="size-3.5 md:size-4 font-thin" />
              </a>
              <a href="#" target="_blank" className="text-surface-500  hover:text-surface-800 0 transition-colors duration-(--duration-fast) ease-(--ease-apple)">
                <Linkedin className="size-3.5 md:size-4 font-thin" />
              </a>
              <a href="#" target="_blank" className="text-surface-500  hover:text-surface-800 0 transition-colors duration-(--duration-fast) ease-(--ease-apple)">
                <Facebook className="size-3.5 md:size-4 font-thin" />
              </a>
              <a href="#" target="_blank" className="size-3.5 md:size-4 text-surface-500 hover:text-surface-800  flex items-center justify-center transition-colors duration-(--duration-fast) ease-(--ease-apple)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-tiktok" viewBox="0 0 16 16">
                  <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                </svg>
              </a>
              <a href="#" target="_blank" className="text-surface-500 hover:text-surface-800 transition-colors duration-(--duration-fast) ease-(--ease-apple)">
                <Youtube className="size-3.5 md:size-4 font-thin" />
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="self-stretch p-(--space-4) md:p-(--space-8) flex flex-row flex-wrap justify-start sm:justify-between items-start gap-(--space-6) md:gap-(--space-8)">
          {FOOTER_COLUMNS.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col justify-start items-start gap-(--space-8) flex-1 min-w-[120px]">
              {column.sections.map((section) => (
                <div key={section.title} className="flex flex-col justify-start items-start gap-(--space-3) w-full">
                  {/* Column title — strong contrast */}
                  <div className="self-stretch text-surface-700 text-footnote font-medium font-sans">
                    {section.title}
                  </div>
                  <div className="flex flex-col justify-end items-start gap-(--space-2)">
                    {section.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href as any}
                        className="text-surface-500 text-footnote font-normal font-sans cursor-pointer hover:text-surface-900 transition-colors duration-(--duration-fast) ease-(--ease-apple)"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Particle Text Section */}
      <div className="w-full relative overflow-hidden">
        {/* SetWise text made of particles */}
        <div className="relative flex justify-center items-center w-full h-[180px] md:h-[300px]">
          <ParticleText text="SetWise" className="w-full h-full" />
        </div>
      </div>
    </div>
  )
}
