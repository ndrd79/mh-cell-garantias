import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MH Cell - Sistema de Garantias',
  description: 'Sistema de gerenciamento de garantias para MH Cell',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-100 min-h-screen`}>
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <span className="text-xl font-semibold">MH Cell</span>
              </div>
              <div className="flex space-x-4">
                <a href="/" className="hover:bg-blue-700 px-3 py-2 rounded-md">Início</a>
                <a href="/clientes" className="hover:bg-blue-700 px-3 py-2 rounded-md">Clientes</a>
                <a href="/ordens" className="hover:bg-blue-700 px-3 py-2 rounded-md">Ordens</a>
                <a href="/garantias" className="hover:bg-blue-700 px-3 py-2 rounded-md">Garantias</a>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  )
}
