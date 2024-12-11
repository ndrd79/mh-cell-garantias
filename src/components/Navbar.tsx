import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900"
            >
              <span className="font-bold text-xl">MH Cell</span>
            </Link>
          </div>

          <div className="flex space-x-4">
            <Link
              href="/clientes"
              className="inline-flex items-center px-3 py-2 text-gray-700 hover:text-gray-900"
            >
              Clientes
            </Link>
            <Link
              href="/ordens"
              className="inline-flex items-center px-3 py-2 text-gray-700 hover:text-gray-900"
            >
              Ordens de Serviço
            </Link>
            <Link
              href="/garantias"
              className="inline-flex items-center px-3 py-2 text-gray-700 hover:text-gray-900"
            >
              Garantias
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
