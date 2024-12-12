-- Forçar atualização do cache do schema
BEGIN;

-- Salvar dados existentes
CREATE TEMP TABLE temp_clientes AS SELECT * FROM clientes;

-- Dropar e recriar a tabela
DROP TABLE clientes CASCADE;

CREATE TABLE clientes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome TEXT NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    rg VARCHAR(20) NOT NULL,
    telefone TEXT NOT NULL,
    telefone_alternativo TEXT,
    email TEXT NOT NULL UNIQUE,
    endereco TEXT NOT NULL,
    cidade TEXT NOT NULL,
    estado CHAR(2) NOT NULL,
    data_nascimento DATE NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Restaurar dados
INSERT INTO clientes 
SELECT * FROM temp_clientes;

-- Limpar tabela temporária
DROP TABLE temp_clientes;

COMMIT;
