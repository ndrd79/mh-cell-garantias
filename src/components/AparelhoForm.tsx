import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Aparelho, TipoAparelho } from '@/types'

const aparelhoSchema = z.object({
  cliente_id: z.string().uuid('ID do cliente inválido'),
  tipo: z.enum(['CELULAR', 'COMPUTADOR'] as const),
  marca: z.string().min(2, 'Marca deve ter pelo menos 2 caracteres'),
  modelo: z.string().min(2, 'Modelo deve ter pelo menos 2 caracteres'),
  numero_serie: z.string().min(4, 'Número de série deve ter pelo menos 4 caracteres'),
})

type AparelhoFormData = z.infer<typeof aparelhoSchema>

interface AparelhoFormProps {
  clienteId: string
  aparelho?: Aparelho
  onSubmit: (data: AparelhoFormData) => Promise<void>
}

export function AparelhoForm({ clienteId, aparelho, onSubmit }: AparelhoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AparelhoFormData>({
    resolver: zodResolver(aparelhoSchema),
    defaultValues: {
      ...aparelho,
      cliente_id: clienteId,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('cliente_id')} value={clienteId} />

      <div>
        <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
          Tipo de Aparelho
        </label>
        <select
          id="tipo"
          {...register('tipo')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="CELULAR">Celular</option>
          <option value="COMPUTADOR">Computador</option>
        </select>
        {errors.tipo && (
          <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="marca" className="block text-sm font-medium text-gray-700">
          Marca
        </label>
        <input
          type="text"
          id="marca"
          {...register('marca')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.marca && (
          <p className="mt-1 text-sm text-red-600">{errors.marca.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="modelo" className="block text-sm font-medium text-gray-700">
          Modelo
        </label>
        <input
          type="text"
          id="modelo"
          {...register('modelo')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.modelo && (
          <p className="mt-1 text-sm text-red-600">{errors.modelo.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="numero_serie" className="block text-sm font-medium text-gray-700">
          Número de Série
        </label>
        <input
          type="text"
          id="numero_serie"
          {...register('numero_serie')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.numero_serie && (
          <p className="mt-1 text-sm text-red-600">{errors.numero_serie.message}</p>
        )}
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
