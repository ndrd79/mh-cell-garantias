-- Adicionar colunas cidade e estado
ALTER TABLE clientes
ADD COLUMN IF NOT EXISTS cidade VARCHAR(100),
ADD COLUMN IF NOT EXISTS estado CHAR(2);

-- Atualizar as colunas para NOT NULL
ALTER TABLE clientes
ALTER COLUMN cidade SET NOT NULL,
ALTER COLUMN estado SET NOT NULL;
