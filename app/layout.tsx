import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'USA-Calc — Free Online Calculators for Finance, Salary, Tax & More',
    template: '%s | USA-Calc',
  },
  description:
    'Free online calculators and tools for finance, salary, tax, mortgage, health and more. Fast, accurate, and easy to use.',
  metadataBase: new URL('https://www.usa-calc.com'),
  openGraph: {
    siteName: 'USA-Calc',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    site: '@calchive',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // verification: { google: 'add-later' },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6916421107498737"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
