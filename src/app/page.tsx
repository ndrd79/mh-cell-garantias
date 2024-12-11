export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          MH Cell - Sistema de Garantias
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Clientes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Clientes</h2>
            <a href="/clientes" className="text-blue-600 hover:underline">
              Gerenciar Clientes →
            </a>
          </div>

          {/* Card Ordens de Serviço */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Ordens de Serviço</h2>
            <a href="/ordens" className="text-blue-600 hover:underline">
              Gerenciar Ordens →
            </a>
          </div>

          {/* Card Garantias */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Garantias</h2>
            <a href="/garantias" className="text-blue-600 hover:underline">
              Gerenciar Garantias →
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
