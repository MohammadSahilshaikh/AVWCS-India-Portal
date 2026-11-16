import type { Metadata } from 'next'
import { Inter, Noto_Sans_Devanagari } from 'next/font/google'
import './globals.css'
import { LangProvider } from '@/components/ui/LangContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-noto',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://avwcs-india.vercel.app'),
  title: {
    default: 'AVWCS India | Automated Vacuum Waste Collection System',
    template: '%s | AVWCS India',
  },
  description: 'Feasibility study for Automated Vacuum Waste Collection System (AVWCS) in Indian smart cities — IIT Research Portal. Truck-free, sealed underground waste collection for planned townships and campuses.',
  keywords: ['AVWCS', 'vacuum waste', 'smart city India', 'pneumatic waste collection', 'SWM Rules 2026'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AVWCS India | Automated Vacuum Waste Collection System',
    description: 'Feasibility study, interactive system explorer, simulator, and phased pilot roadmap for Indian smart cities.',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoDevanagari.variable}`}>
      <body>
        <LangProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  )
}
