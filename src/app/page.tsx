export default function Home() {
  return (
    <div className="space-y-6">
      <header className="bg-white shadow">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">MH Cell - Sistema de Garantias</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Clientes</h2>
            <p className="text-gray-600 mb-4">Gerencie os dados dos seus clientes</p>
            <a href="/clientes" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Gerenciar Clientes →
            </a>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ordens de Serviço</h2>
            <p className="text-gray-600 mb-4">Controle as ordens de serviço</p>
            <a href="/ordens" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Gerenciar Ordens →
            </a>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Garantias</h2>
            <p className="text-gray-600 mb-4">Acompanhe as garantias ativas</p>
            <a href="/garantias" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Gerenciar Garantias →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
