import { Geist_Mono, Noto_Sans, Playfair_Display } from "next/font/google"
import { Metadata } from "next"

import Providers from "./providers"
import { cn } from "@/lib/utils"

import "./globals.css"

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
})

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "WDPRO",
  description: "WDPRO",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        notoSans.variable,
        playfairDisplayHeading.variable
      )}
    >
      <body>
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  )
}
