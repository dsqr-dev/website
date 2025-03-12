import { Inter, JetBrains_Mono } from "next/font/google"
import type { Metadata } from "next";

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})


export const metadata: Metadata = {
  title: "dsqr",
  description: "coding, developer life and open source.",
  openGraph: {
    title: "dsqr",
    description: "coding, developer life and open source.",
    url: "https://dsqr.dev",
    siteName: "dsqr",
  },
  twitter: {
    card: "summary_large_image",
    site: "@0xdsqr",
    creator: "@0xdsqr",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-mono antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
