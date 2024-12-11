'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { OrdemServico, Cliente, Aparelho } from '@/types'
import { AparelhoForm } from '@/components/AparelhoForm'
import { OrdemServicoForm, OrdemServicoFormData } from '@/components/OrdemServicoForm'

export default function OrdensPage() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [aparelhos, setAparelhos] = useState<Aparelho[]>([])
  const [selectedCliente, setSelectedCliente] = useState<string>('')
  const [selectedAparelho, setSelectedAparelho] = useState<string>('')
  const [showAparelhoForm, setShowAparelhoForm] = useState(false)
  const [showOrdemForm, setShowOrdemForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setIsLoading(true)
      
      // Carregar clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes')
        .select('*')
        .order('nome')
      
      if (clientesError) throw clientesError
      setClientes(clientesData || [])

      // Carregar aparelhos
      const { data: aparelhosData, error: aparelhosError } = await supabase
        .from('aparelhos')
        .select('*')
      
      if (aparelhosError) throw aparelhosError
      setAparelhos(aparelhosData || [])

      // Carregar ordens
      const { data: ordensData, error: ordensError } = await supabase
        .from('ordens_servico')
        .select('*, cliente:clientes(*), aparelho:aparelhos(*)')
        .order('created_at', { ascending: false })
      
      if (ordensError) throw ordensError
      setOrdens(ordensData || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      alert('Erro ao carregar dados. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAparelhoSubmit(data: Omit<Aparelho, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data: aparelho, error } = await supabase
        .from('aparelhos')
        .insert([data])
        .select()
        .single()

      if (error) throw error

      setAparelhos([...aparelhos, aparelho])
      setSelectedAparelho(aparelho.id)
      setShowAparelhoForm(false)
      setShowOrdemForm(true)
    } catch (error) {
      console.error('Erro ao salvar aparelho:', error)
      alert('Erro ao salvar aparelho. Tente novamente.')
    }
  }

  async function handleOrdemSubmit(data: OrdemServicoFormData) {
    try {
      setIsLoading(true)
      const { error } = await supabase
        .from('ordens_servico')
        .insert({
          ...data,
          data_saida: data.data_saida || null,
          servico_realizado: data.servico_realizado || null
        })

      if (error) throw error

      loadData()
      setShowOrdemForm(false)
      setSelectedCliente('')
      setSelectedAparelho('')
    } catch (error) {
      console.error('Erro ao criar ordem de serviço:', error)
      alert('Erro ao criar ordem de serviço. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAparelhos = aparelhos.filter(
    (aparelho) => aparelho.cliente_id === selectedCliente
  )

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ordens de Serviço</h1>
        <button
          onClick={() => {
            setSelectedCliente('')
            setSelectedAparelho('')
            setShowAparelhoForm(false)
            setShowOrdemForm(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Nova Ordem
        </button>
      </div>

      {showOrdemForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Nova Ordem de Serviço</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Selecione o Cliente
            </label>
            <select
              value={selectedCliente}
              onChange={(e) => setSelectedCliente(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>

          {selectedCliente && (
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Selecione o Aparelho
                </label>
                <button
                  onClick={() => setShowAparelhoForm(true)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Novo Aparelho
                </button>
              </div>
              <select
                value={selectedAparelho}
                onChange={(e) => setSelectedAparelho(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecione...</option>
                {filteredAparelhos.map((aparelho) => (
                  <option key={aparelho.id} value={aparelho.id}>
                    {aparelho.tipo} - {aparelho.marca} {aparelho.modelo}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showAparelhoForm && selectedCliente && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Novo Aparelho</h3>
              <AparelhoForm
                clienteId={selectedCliente}
                onSubmit={handleAparelhoSubmit}
              />
            </div>
          )}

          {selectedCliente && selectedAparelho && !showAparelhoForm && (
            <OrdemServicoForm
              clienteId={selectedCliente}
              aparelhoId={selectedAparelho}
              onSubmit={handleOrdemSubmit}
            />
          )}
        </div>
      )}

      {isLoading ? (
        <div className="text-center">Carregando...</div>
      ) : (
        <div className="space-y-6">
          {ordens.map((ordem) => (
            <div
              key={ordem.id}
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
                      ordem.status === 'CONCLUIDO' || ordem.status === 'ENTREGUE'
                        ? 'bg-green-100 text-green-800'
                        : ordem.status === 'EM_MANUTENCAO'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }
                  `}
                >
                  {ordem.status.replace('_', ' ')}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Problema Relatado</h4>
                  <p className="text-gray-600">{ordem.problema_relatado}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Diagnóstico</h4>
                  <p className="text-gray-600">{ordem.diagnostico}</p>
                </div>
              </div>

              {ordem.servico_realizado && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700">Serviço Realizado</h4>
                  <p className="text-gray-600">{ordem.servico_realizado}</p>
                </div>
              )}

              <div className="mt-4 flex justify-between items-center">
                <div className="text-gray-600">
                  <span>Entrada: {new Date(ordem.data_entrada).toLocaleDateString()}</span>
                  {ordem.data_saida && (
                    <span className="ml-4">
                      Saída: {new Date(ordem.data_saida).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="text-lg font-semibold">
                  R$ {ordem.valor.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
