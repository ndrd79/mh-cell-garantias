'use client'

import { useState, useEffect } from 'react'
import { ClienteForm } from '@/components/ClienteForm'
import { supabase } from '@/lib/supabase'
import { Cliente } from '@/types'
import { FiEdit2, FiTrash2, FiPhone, FiMail, FiMapPin, FiUser } from 'react-icons/fi'

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)

  useEffect(() => {
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
      if (selectedCliente) {
        const { error } = await supabase
          .from('clientes')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedCliente.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('clientes').insert([data])
        if (error) throw error
      }

      setShowForm(false)
      setSelectedCliente(null)
      loadClientes()
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
      alert('Erro ao salvar cliente. Tente novamente.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return

    try {
      const { error } = await supabase.from('clientes').delete().eq('id', id)
      if (error) throw error

      loadClientes()
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
      alert('Erro ao excluir cliente. Tente novamente.')
    }
  }

  function handleEdit(cliente: Cliente) {
    setSelectedCliente(cliente)
    setShowForm(true)
  }

  function formatCPF(cpf: string) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  function formatPhone(phone: string) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  function formatCEP(cep: string) {
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <button
          onClick={() => {
            setSelectedCliente(null)
            setShowForm(!showForm)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancelar' : 'Novo Cliente'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {selectedCliente ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <ClienteForm cliente={selectedCliente} onSubmit={handleSubmit} />
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando clientes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientes.map((cliente) => (
            <div
              key={cliente.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{cliente.nome}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(cliente)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Editar"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(cliente.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Excluir"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-gray-600">
                <p className="flex items-center">
                  <FiUser className="mr-2" />
                  CPF: {formatCPF(cliente.cpf)}
                </p>
                <p className="flex items-center">
                  <FiPhone className="mr-2" />
                  {formatPhone(cliente.telefone)}
                  {cliente.telefone_alternativo && (
                    <span className="ml-2">/ {formatPhone(cliente.telefone_alternativo)}</span>
                  )}
                </p>
                <p className="flex items-center">
                  <FiMail className="mr-2" />
                  {cliente.email}
                </p>
                <p className="flex items-center">
                  <FiMapPin className="mr-2" />
                  {cliente.endereco}, {cliente.bairro}
                  <br />
                  {cliente.cidade} - {cliente.estado}
                  <br />
                  CEP: {formatCEP(cliente.cep)}
                </p>
              </div>
            </div>
          ))}

          {clientes.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              Nenhum cliente cadastrado.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
