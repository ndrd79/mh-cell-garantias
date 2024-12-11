import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { OrdemServico, StatusOrdem } from '@/types'

const ordemServicoSchema = z.object({
  cliente_id: z.string().uuid('ID do cliente inválido'),
  aparelho_id: z.string().uuid('ID do aparelho inválido'),
  problema_relatado: z.string().min(10, 'Descreva o problema com mais detalhes'),
  diagnostico: z.string().min(10, 'Diagnóstico deve ser mais detalhado'),
  servico_realizado: z.string().optional(),
  valor: z.number().min(0, 'Valor não pode ser negativo'),
  status: z.enum(['AGUARDANDO', 'EM_ANALISE', 'APROVADO', 'EM_MANUTENCAO', 'CONCLUIDO', 'ENTREGUE'] as const),
  data_entrada: z.string(),
  data_saida: z.string().nullable(),
})

export type OrdemServicoFormData = z.infer<typeof ordemServicoSchema>

interface OrdemServicoFormProps {
  clienteId: string
  aparelhoId: string
  ordem?: OrdemServico
  onSubmit: (data: OrdemServicoFormData) => Promise<void>
}

export function OrdemServicoForm({ clienteId, aparelhoId, ordem, onSubmit }: OrdemServicoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrdemServicoFormData>({
    resolver: zodResolver(ordemServicoSchema),
    defaultValues: {
      ...ordem,
      cliente_id: clienteId,
      aparelho_id: aparelhoId,
      data_entrada: new Date().toISOString().split('T')[0],
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('cliente_id')} value={clienteId} />
      <input type="hidden" {...register('aparelho_id')} value={aparelhoId} />

      <div>
        <label htmlFor="problema_relatado" className="block text-sm font-medium text-gray-700">
          Problema Relatado
        </label>
        <textarea
          id="problema_relatado"
          {...register('problema_relatado')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.problema_relatado && (
          <p className="mt-1 text-sm text-red-600">{errors.problema_relatado.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="diagnostico" className="block text-sm font-medium text-gray-700">
          Diagnóstico
        </label>
        <textarea
          id="diagnostico"
          {...register('diagnostico')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.diagnostico && (
          <p className="mt-1 text-sm text-red-600">{errors.diagnostico.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="servico_realizado" className="block text-sm font-medium text-gray-700">
          Serviço Realizado
        </label>
        <textarea
          id="servico_realizado"
          {...register('servico_realizado')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.servico_realizado && (
          <p className="mt-1 text-sm text-red-600">{errors.servico_realizado.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="valor" className="block text-sm font-medium text-gray-700">
          Valor (R$)
        </label>
        <input
          type="number"
          step="0.01"
          id="valor"
          {...register('valor', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.valor && (
          <p className="mt-1 text-sm text-red-600">{errors.valor.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="AGUARDANDO">Aguardando</option>
          <option value="EM_ANALISE">Em Análise</option>
          <option value="APROVADO">Aprovado</option>
          <option value="EM_MANUTENCAO">Em Manutenção</option>
          <option value="CONCLUIDO">Concluído</option>
          <option value="ENTREGUE">Entregue</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="data_entrada" className="block text-sm font-medium text-gray-700">
            Data de Entrada
          </label>
          <input
            type="date"
            id="data_entrada"
            {...register('data_entrada')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.data_entrada && (
            <p className="mt-1 text-sm text-red-600">{errors.data_entrada.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="data_saida" className="block text-sm font-medium text-gray-700">
            Data de Saída
          </label>
          <input
            type="date"
            id="data_saida"
            {...register('data_saida')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.data_saida && (
            <p className="mt-1 text-sm text-red-600">{errors.data_saida.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  )
}
