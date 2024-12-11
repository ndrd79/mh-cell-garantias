import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Cliente, NovoCliente } from '@/types'

const clienteSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cpf: z
    .string()
    .min(11, 'CPF inválido')
    .max(14, 'CPF inválido')
    .transform(val => val.replace(/\D/g, '')),
  rg: z
    .string()
    .min(7, 'RG inválido')
    .transform(val => val.replace(/\D/g, '')),
  telefone: z
    .string()
    .min(10, 'Telefone inválido')
    .transform(val => val.replace(/\D/g, '')),
  telefone_alternativo: z
    .string()
    .transform(val => val.replace(/\D/g, ''))
    .optional(),
  email: z
    .string()
    .email('Email inválido')
    .transform(val => val.toLowerCase()),
  endereco: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  bairro: z.string().min(3, 'Bairro deve ter pelo menos 3 caracteres'),
  cidade: z.string().min(3, 'Cidade deve ter pelo menos 3 caracteres'),
  estado: z
    .string()
    .length(2, 'Use a sigla do estado (ex: SP)')
    .transform(val => val.toUpperCase()),
  cep: z
    .string()
    .length(8, 'CEP inválido')
    .transform(val => val.replace(/\D/g, '')),
  data_nascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  observacoes: z.string().optional(),
})

type ClienteFormData = z.infer<typeof clienteSchema>

interface ClienteFormProps {
  cliente?: Cliente | null
  onSubmit: (data: NovoCliente) => Promise<void>
}

export function ClienteForm({ cliente, onSubmit }: ClienteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: cliente ? {
      nome: cliente.nome,
      cpf: cliente.cpf,
      rg: cliente.rg,
      telefone: cliente.telefone,
      telefone_alternativo: cliente.telefone_alternativo,
      email: cliente.email,
      endereco: cliente.endereco,
      bairro: cliente.bairro,
      cidade: cliente.cidade,
      estado: cliente.estado,
      cep: cliente.cep,
      data_nascimento: cliente.data_nascimento,
      observacoes: cliente.observacoes
    } : undefined,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dados Pessoais */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Dados Pessoais</h3>
          
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome Completo *
            </label>
            <input
              type="text"
              id="nome"
              {...register('nome')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.nome && (
              <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                CPF *
              </label>
              <input
                type="text"
                id="cpf"
                {...register('cpf')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.cpf && (
                <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="rg" className="block text-sm font-medium text-gray-700">
                RG *
              </label>
              <input
                type="text"
                id="rg"
                {...register('rg')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.rg && (
                <p className="mt-1 text-sm text-red-600">{errors.rg.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="data_nascimento" className="block text-sm font-medium text-gray-700">
              Data de Nascimento *
            </label>
            <input
              type="date"
              id="data_nascimento"
              {...register('data_nascimento')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.data_nascimento && (
              <p className="mt-1 text-sm text-red-600">{errors.data_nascimento.message}</p>
            )}
          </div>
        </div>

        {/* Contato */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Contato</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                Telefone Principal *
              </label>
              <input
                type="tel"
                id="telefone"
                {...register('telefone')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.telefone && (
                <p className="mt-1 text-sm text-red-600">{errors.telefone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="telefone_alternativo" className="block text-sm font-medium text-gray-700">
                Telefone Alternativo
              </label>
              <input
                type="tel"
                id="telefone_alternativo"
                {...register('telefone_alternativo')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.telefone_alternativo && (
                <p className="mt-1 text-sm text-red-600">{errors.telefone_alternativo.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Endereço</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">
              Endereço *
            </label>
            <input
              type="text"
              id="endereco"
              {...register('endereco')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.endereco && (
              <p className="mt-1 text-sm text-red-600">{errors.endereco.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">
              Bairro *
            </label>
            <input
              type="text"
              id="bairro"
              {...register('bairro')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.bairro && (
              <p className="mt-1 text-sm text-red-600">{errors.bairro.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">
              Cidade *
            </label>
            <input
              type="text"
              id="cidade"
              {...register('cidade')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.cidade && (
              <p className="mt-1 text-sm text-red-600">{errors.cidade.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
              Estado *
            </label>
            <input
              type="text"
              id="estado"
              {...register('estado')}
              maxLength={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 uppercase"
            />
            {errors.estado && (
              <p className="mt-1 text-sm text-red-600">{errors.estado.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
              CEP *
            </label>
            <input
              type="text"
              id="cep"
              {...register('cep')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.cep && (
              <p className="mt-1 text-sm text-red-600">{errors.cep.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Observações */}
      <div>
        <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700">
          Observações
        </label>
        <textarea
          id="observacoes"
          {...register('observacoes')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.observacoes && (
          <p className="mt-1 text-sm text-red-600">{errors.observacoes.message}</p>
        )}
      </div>

      <div className="flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}
