import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ErrorBoundary } from '@/components/features'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Model Arena - Compare AI Models Across Leaderboards',
  description:
    'Compare AI models side-by-side across multiple leaderboards: Chatbot Arena, ArtificialAnalysis, LiveCodeBench, and SWE-bench.',
  keywords: [
    'AI',
    'LLM',
    'models',
    'benchmark',
    'leaderboard',
    'Chatbot Arena',
    'ArtificialAnalysis',
    'LiveCodeBench',
    'SWE-bench',
  ],
  openGraph: {
    title: 'Model Arena - Compare AI Models',
    description: 'Compare AI models across multiple leaderboards in one view.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <NuqsAdapter>
          <ErrorBoundary>{children}</ErrorBoundary>
        </NuqsAdapter>
      </body>
    </html>
  )
}
