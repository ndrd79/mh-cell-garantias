'use client'

import { useState } from 'react'
import { ClienteForm } from '@/components/ClienteForm'
import { supabase } from '@/lib/supabase'
import { Cliente } from '@/types'

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // Carregar clientes ao montar o componente
  useState(() => {
    loadClientes()
  }, [])

  async function loadClientes() {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nome')

      if (error) throw error
      setClientes(data || [])
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      alert('Erro ao carregar clientes. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(data: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { error } = await supabase.from('clientes').insert([data])
      if (error) throw error

      setShowForm(false)
      loadClientes()
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
      alert('Erro ao salvar cliente. Tente novamente.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : 'Novo Cliente'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Novo Cliente</h2>
          <ClienteForm onSubmit={handleSubmit} />
        </div>
      )}

      {isLoading ? (
        <div className="text-center">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientes.map((cliente) => (
            <div
              key={cliente.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{cliente.nome}</h3>
              <p className="text-gray-600 mb-1">📱 {cliente.telefone}</p>
              <p className="text-gray-600 mb-1">📧 {cliente.email}</p>
              <p className="text-gray-600">📍 {cliente.endereco}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
