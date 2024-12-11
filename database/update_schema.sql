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
