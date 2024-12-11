# MH Cell - Sistema de Garantias

Sistema de gerenciamento de garantias e serviços para assistência técnica de celulares e computadores.

## Funcionalidades

### Módulo de Clientes
- Cadastro de clientes
- Histórico de serviços por cliente
- Busca de clientes

### Módulo de Serviços
- Registro de ordem de serviço
- Acompanhamento do status do serviço
- Registro fotográfico (antes/depois)
- Emissão de garantia
- Histórico de manutenções

### Módulo de Garantias
- Geração de termo de garantia
- Controle de prazos
- Histórico de acionamentos

### Módulo de Relatórios
- Relatório de serviços
- Relatório de garantias ativas
- Relatório de clientes

## Tecnologias Utilizadas
- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase (Banco de dados e autenticação)
- Vercel (Deploy)

## Estrutura do Banco de Dados

### Tabela: clientes
- id (UUID)
- nome
- telefone
- email
- endereco
- created_at
- updated_at

### Tabela: aparelhos
- id (UUID)
- cliente_id (FK)
- tipo (enum: CELULAR, COMPUTADOR)
- marca
- modelo
- numero_serie
- created_at
- updated_at

### Tabela: ordens_servico
- id (UUID)
- cliente_id (FK)
- aparelho_id (FK)
- problema_relatado
- diagnostico
- servico_realizado
- valor
- status
- data_entrada
- data_saida
- created_at
- updated_at

### Tabela: garantias
- id (UUID)
- ordem_servico_id (FK)
- data_inicio
- data_fim
- termos
- status
- created_at
- updated_at

### Tabela: fotos_servico
- id (UUID)
- ordem_servico_id (FK)
- tipo (enum: ANTES, DEPOIS)
- url
- created_at

## Pontos de Restauração
O sistema mantém um histórico de alterações importantes no banco de dados, permitindo reverter operações em caso de necessidade.

## Como executar o projeto
1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente
4. Execute: `npm run dev`

## Deploy
O sistema está configurado para deploy automático na Vercel.
