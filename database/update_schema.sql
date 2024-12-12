-- Adicionar coluna bairro se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'clientes'
        AND column_name = 'bairro'
    ) THEN
        ALTER TABLE clientes ADD COLUMN bairro VARCHAR(100) NOT NULL;
    END IF;
END $$;

-- Remover colunas não utilizadas da tabela clientes
ALTER TABLE clientes
DROP COLUMN IF EXISTS bairro,
DROP COLUMN IF EXISTS cep;

-- Adicionar colunas que faltam (se necessário)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'clientes'
        AND column_name = 'cpf'
    ) THEN
        ALTER TABLE clientes ADD COLUMN cpf VARCHAR(14) NOT NULL UNIQUE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'clientes'
        AND column_name = 'rg'
    ) THEN
        ALTER TABLE clientes ADD COLUMN rg VARCHAR(20) NOT NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'clientes'
        AND column_name = 'telefone_alternativo'
    ) THEN
        ALTER TABLE clientes ADD COLUMN telefone_alternativo VARCHAR(20);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'clientes'
        AND column_name = 'data_nascimento'
    ) THEN
        ALTER TABLE clientes ADD COLUMN data_nascimento DATE NOT NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'clientes'
        AND column_name = 'observacoes'
    ) THEN
        ALTER TABLE clientes ADD COLUMN observacoes TEXT;
    END IF;
END $$;

-- Habilitar a extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    endereco TEXT NOT NULL,
    cidade TEXT NOT NULL,
    estado CHAR(2) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    rg VARCHAR(20) NOT NULL,
    telefone_alternativo VARCHAR(20),
    data_nascimento DATE NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de aparelhos
CREATE TABLE IF NOT EXISTS aparelhos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('CELULAR', 'COMPUTADOR')),
    marca TEXT NOT NULL,
    modelo TEXT NOT NULL,
    numero_serie TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de ordens de serviço
CREATE TABLE IF NOT EXISTS ordens_servico (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
    aparelho_id UUID REFERENCES aparelhos(id) ON DELETE CASCADE,
    problema_relatado TEXT NOT NULL,
    diagnostico TEXT NOT NULL,
    servico_realizado TEXT,
    valor DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('AGUARDANDO', 'EM_ANALISE', 'APROVADO', 'EM_MANUTENCAO', 'CONCLUIDO', 'ENTREGUE')),
    data_entrada DATE NOT NULL,
    data_saida DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de garantias
CREATE TABLE IF NOT EXISTS garantias (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ordem_servico_id UUID REFERENCES ordens_servico(id) ON DELETE CASCADE,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    termos TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('ATIVA', 'VENCIDA', 'CANCELADA')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela de fotos de serviço
CREATE TABLE IF NOT EXISTS fotos_servico (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ordem_servico_id UUID REFERENCES ordens_servico(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('ANTES', 'DEPOIS')),
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
