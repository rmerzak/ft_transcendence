import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({
  weight: ['100', '200', '300', '400',  '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: "--font-inter",
})


export const metadata: Metadata = {
  title: 'Ping Pong',
  description: 'Ping Pong created by a group of 1337 hackers',
  icons: {
    icon: '/logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  )
}
