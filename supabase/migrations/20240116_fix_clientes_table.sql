-- Fazer backup dos dados existentes
CREATE TABLE IF NOT EXISTS clientes_backup AS SELECT * FROM clientes;

-- Dropar a tabela atual
DROP TABLE IF EXISTS clientes CASCADE;

-- Recriar a tabela com a estrutura correta
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

-- Restaurar os dados do backup (se houver)
INSERT INTO clientes (
    id, nome, cpf, rg, telefone, telefone_alternativo, 
    email, endereco, cidade, estado, data_nascimento, 
    observacoes, created_at, updated_at
)
SELECT 
    id, nome, cpf, rg, telefone, telefone_alternativo, 
    email, endereco, cidade, estado, data_nascimento, 
    observacoes, created_at, updated_at
FROM clientes_backup;

-- Dropar a tabela de backup
DROP TABLE IF EXISTS clientes_backup;
