import { Garantia } from '@/types'

interface GarantiaPDFProps {
  garantia: Garantia & {
    ordem_servico: any // Tipo expandido com relações
  }
}

export function GarantiaPDF({ garantia }: GarantiaPDFProps) {
  const ordem = garantia.ordem_servico

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 print:p-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">MH Cell</h1>
        <p className="text-gray-600">Assistência Técnica Especializada</p>
      </div>

      <h2 className="text-xl font-bold text-center mb-6">
        CERTIFICADO DE GARANTIA
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Dados do Cliente</h3>
          <p>Nome: {ordem.cliente?.nome}</p>
          <p>Telefone: {ordem.cliente?.telefone}</p>
          <p>Email: {ordem.cliente?.email}</p>
        </div>

        <div>
          <h3 className="font-semibold">Dados do Aparelho</h3>
          <p>Tipo: {ordem.aparelho?.tipo}</p>
          <p>Marca: {ordem.aparelho?.marca}</p>
          <p>Modelo: {ordem.aparelho?.modelo}</p>
          <p>Número de Série: {ordem.aparelho?.numero_serie}</p>
        </div>

        <div>
          <h3 className="font-semibold">Serviço Realizado</h3>
          <p>{ordem.servico_realizado}</p>
        </div>

        <div>
          <h3 className="font-semibold">Período de Garantia</h3>
          <p>
            De {new Date(garantia.data_inicio).toLocaleDateString()} até{' '}
            {new Date(garantia.data_fim).toLocaleDateString()}
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Termos e Condições</h3>
          <p className="whitespace-pre-line">{garantia.termos}</p>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex justify-between">
            <div className="text-center">
              <div className="border-t border-black w-48 mt-8 pt-2">
                Assinatura do Cliente
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-black w-48 mt-8 pt-2">
                MH Cell
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 mt-8">
          <p>Este documento é parte integrante da Ordem de Serviço Nº {ordem.id}</p>
          <p>Emitido em: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}
