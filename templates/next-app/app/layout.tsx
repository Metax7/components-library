import { Geist } from "next/font/google"
import { Metadata } from "next"

import Providers from "./providers"
import { cn } from "@/lib/utils"

import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
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
      className={cn("antialiased", geist.variable)}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
