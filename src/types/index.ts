export type Cliente = {
  id: string
  nome: string
  telefone: string
  email: string
  endereco: string
  created_at: string
  updated_at: string
}

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
  servico_realizado: string
  valor: number
  status: StatusOrdem
  data_entrada: string
  data_saida: string | null
  created_at: string
  updated_at: string
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
}

export type TipoFoto = 'ANTES' | 'DEPOIS'

export type FotoServico = {
  id: string
  ordem_servico_id: string
  tipo: TipoFoto
  url: string
  created_at: string
}
