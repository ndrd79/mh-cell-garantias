'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Garantia, OrdemServico } from '@/types'
import { GarantiaForm } from '@/components/GarantiaForm'

export default function GarantiasPage() {
  const [garantias, setGarantias] = useState<Garantia[]>([])
  const [ordensDisponiveis, setOrdensDisponiveis] = useState<OrdemServico[]>([])
  const [selectedOrdem, setSelectedOrdem] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setIsLoading(true)
      
      // Carregar garantias com dados relacionados
      const { data: garantiasData, error: garantiasError } = await supabase
        .from('garantias')
        .select(\`
          *,
          ordem_servico:ordens_servico(
            *,
            cliente:clientes(*),
            aparelho:aparelhos(*)
          )
        \`)
        .order('created_at', { ascending: false })
      
      if (garantiasError) throw garantiasError
      setGarantias(garantiasData || [])

      // Carregar ordens sem garantia
      const { data: ordensData, error: ordensError } = await supabase
        .from('ordens_servico')
        .select(\`
          *,
          cliente:clientes(*),
          aparelho:aparelhos(*)
        \`)
        .eq('status', 'CONCLUIDO')
        .not('id', 'in', `(${garantiasData?.map(g => g.ordem_servico_id).join(',') || 'null'})`)
      
      if (ordensError) throw ordensError
      setOrdensDisponiveis(ordensData || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      alert('Erro ao carregar dados. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGarantiaSubmit(data: Omit<Garantia, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { error } = await supabase
        .from('garantias')
        .insert([data])

      if (error) throw error

      loadData()
      setShowForm(false)
      setSelectedOrdem('')
    } catch (error) {
      console.error('Erro ao salvar garantia:', error)
      alert('Erro ao salvar garantia. Tente novamente.')
    }
  }

  function calcularDiasRestantes(dataFim: string) {
    const hoje = new Date()
    const fim = new Date(dataFim)
    const diff = fim.getTime() - hoje.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Garantias</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Nova Garantia
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Nova Garantia</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Selecione a Ordem de Serviço
            </label>
            <select
              value={selectedOrdem}
              onChange={(e) => setSelectedOrdem(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              {ordensDisponiveis.map((ordem) => (
                <option key={ordem.id} value={ordem.id}>
                  {ordem.cliente?.nome} - {ordem.aparelho?.marca} {ordem.aparelho?.modelo}
                </option>
              ))}
            </select>
          </div>

          {selectedOrdem && (
            <GarantiaForm
              ordemServicoId={selectedOrdem}
              onSubmit={handleGarantiaSubmit}
            />
          )}
        </div>
      )}

      {isLoading ? (
        <div className="text-center">Carregando...</div>
      ) : (
        <div className="space-y-6">
          {garantias.map((garantia) => {
            const diasRestantes = calcularDiasRestantes(garantia.data_fim)
            const ordem = garantia.ordem_servico as any

            return (
              <div
                key={garantia.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {ordem.cliente?.nome}
                    </h3>
                    <p className="text-gray-600">
                      {ordem.aparelho?.tipo} - {ordem.aparelho?.marca}{' '}
                      {ordem.aparelho?.modelo}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                      ${
                        garantia.status === 'ATIVA'
                          ? 'bg-green-100 text-green-800'
                          : garantia.status === 'VENCIDA'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    `}
                  >
                    {garantia.status}
                  </span>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-gray-700">Termos da Garantia</h4>
                  <p className="text-gray-600">{garantia.termos}</p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-gray-600">
                    <span>Início: {new Date(garantia.data_inicio).toLocaleDateString()}</span>
                    <span className="ml-4">
                      Término: {new Date(garantia.data_fim).toLocaleDateString()}
                    </span>
                  </div>
                  {garantia.status === 'ATIVA' && (
                    <div
                      className={`text-sm font-medium ${
                        diasRestantes > 30
                          ? 'text-green-600'
                          : diasRestantes > 7
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {diasRestantes} dias restantes
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-gray-700">Serviço Realizado</h4>
                  <p className="text-gray-600">{ordem.servico_realizado}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
