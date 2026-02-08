import type React from "react"
import { Inter, Instrument_Serif } from "next/font/google"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  display: "swap",
  preload: true,
})

// Root layout must include html/body for Next.js 404 handling
// The [locale] layout overrides these for localized pages
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sl" suppressHydrationWarning className={`${inter.variable} ${instrumentSerif.variable} antialiased`}>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
