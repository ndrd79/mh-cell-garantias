export type TipoAparelho = 'CELULAR' | 'COMPUTADOR'

export type Aparelho = {
  id: string
  cliente_id: string
  tipo: TipoAparelho
  marca: string
  modelo: string
  numero_serie: string
  created_at: string
  updated_at: string
}

export type StatusOrdem = 'AGUARDANDO' | 'EM_ANALISE' | 'APROVADO' | 'EM_MANUTENCAO' | 'CONCLUIDO' | 'ENTREGUE'

export type OrdemServico = {
  id: string
  cliente_id: string
  aparelho_id: string
  problema_relatado: string
  diagnostico: string
  servico_realizado?: string
  valor: number
  status: StatusOrdem
  data_entrada: string
  data_saida: string | null
  created_at: string
  updated_at: string
  cliente?: Cliente
  aparelho?: Aparelho
}

export type StatusGarantia = 'ATIVA' | 'VENCIDA' | 'CANCELADA'

export type Garantia = {
  id: string
  ordem_servico_id: string
  data_inicio: string
  data_fim: string
  termos: string
  status: StatusGarantia
  created_at: string
  updated_at: string
  ordem_servico?: OrdemServico
}

export type TipoFoto = 'ANTES' | 'DEPOIS'

export type FotoServico = {
  id: string
  ordem_servico_id: string
  tipo: TipoFoto
  url: string
  created_at: string
}

export type NovoCliente = {
  nome: string
  cpf: string
  rg: string
  telefone: string
  telefone_alternativo: string | null
  email: string
  endereco: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  data_nascimento: string
  observacoes: string | null
}

export type Cliente = NovoCliente & {
  id: string
  created_at: string
  updated_at: string
}
