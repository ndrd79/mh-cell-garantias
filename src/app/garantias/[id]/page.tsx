'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Garantia } from '@/types'
import { GarantiaPDF } from '@/components/GarantiaPDF'

export default function GarantiaPage({ params }: { params: { id: string } }) {
  const [garantia, setGarantia] = useState<Garantia & { ordem_servico: any } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadGarantia()
  }, [])

  async function loadGarantia() {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('garantias')
        .select(\`
          *,
          ordem_servico:ordens_servico(
            *,
            cliente:clientes(*),
            aparelho:aparelhos(*)
          )
        \`)
        .eq('id', params.id)
        .single()

      if (error) throw error
      setGarantia(data)
    } catch (error) {
      console.error('Erro ao carregar garantia:', error)
      alert('Erro ao carregar garantia. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  function handlePrint() {
    window.print()
  }

  if (isLoading) {
    return <div className="text-center p-8">Carregando...</div>
  }

  if (!garantia) {
    return <div className="text-center p-8">Garantia não encontrada</div>
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto p-8 print:hidden">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Certificado de Garantia</h1>
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Imprimir
          </button>
        </div>
      </div>

      <GarantiaPDF garantia={garantia} />
    </div>
  )
}
