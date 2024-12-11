import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Garantia } from '@/types'

const garantiaSchema = z.object({
  ordem_servico_id: z.string().uuid('ID da ordem de serviço inválido'),
  data_inicio: z.string(),
  data_fim: z.string(),
  termos: z.string().min(10, 'Descreva os termos da garantia'),
  status: z.enum(['ATIVA', 'VENCIDA', 'CANCELADA'] as const),
})

type GarantiaFormData = z.infer<typeof garantiaSchema>

interface GarantiaFormProps {
  ordemServicoId: string
  garantia?: Garantia
  onSubmit: (data: GarantiaFormData) => Promise<void>
}

export function GarantiaForm({ ordemServicoId, garantia, onSubmit }: GarantiaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GarantiaFormData>({
    resolver: zodResolver(garantiaSchema),
    defaultValues: {
      ...garantia,
      ordem_servico_id: ordemServicoId,
      data_inicio: new Date().toISOString().split('T')[0],
      data_fim: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 dias padrão
      status: 'ATIVA',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('ordem_servico_id')} value={ordemServicoId} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="data_inicio" className="block text-sm font-medium text-gray-700">
            Data de Início
          </label>
          <input
            type="date"
            id="data_inicio"
            {...register('data_inicio')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.data_inicio && (
            <p className="mt-1 text-sm text-red-600">{errors.data_inicio.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="data_fim" className="block text-sm font-medium text-gray-700">
            Data de Término
          </label>
          <input
            type="date"
            id="data_fim"
            {...register('data_fim')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.data_fim && (
            <p className="mt-1 text-sm text-red-600">{errors.data_fim.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="termos" className="block text-sm font-medium text-gray-700">
          Termos da Garantia
        </label>
        <textarea
          id="termos"
          {...register('termos')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Descreva os termos e condições da garantia..."
        />
        {errors.termos && (
          <p className="mt-1 text-sm text-red-600">{errors.termos.message}</p>
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
          <option value="ATIVA">Ativa</option>
          <option value="VENCIDA">Vencida</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Salvando...' : 'Gerar Garantia'}
      </button>
    </form>
  )
}
