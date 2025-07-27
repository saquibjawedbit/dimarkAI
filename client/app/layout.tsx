import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from "../context/AuthContext"

export const metadata: Metadata = {
  title: 'DimarkAI',
  description: 'DimarkAI: Your AI-Powered Marketing Assistant',
  generator: 'DimarkAI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
