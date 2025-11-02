import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BuilderOS - The AI that makes you look like a senior developer',
  description: 'Never write commit messages again. Track your progress. Build better, faster.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

