-- Forçar atualização do cache do schema para ordens e aparelhos
BEGIN;

-- Salvar dados existentes
CREATE TEMP TABLE temp_ordens AS SELECT * FROM ordens_servico;
CREATE TEMP TABLE temp_aparelhos AS SELECT * FROM aparelhos;

-- Dropar e recriar as tabelas
DROP TABLE ordens_servico CASCADE;
DROP TABLE aparelhos CASCADE;

-- Recriar tabela de aparelhos
CREATE TABLE aparelhos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('CELULAR', 'COMPUTADOR')),
    marca TEXT NOT NULL,
    modelo TEXT NOT NULL,
    numero_serie TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Recriar tabela de ordens
CREATE TABLE ordens_servico (
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

-- Restaurar dados dos aparelhos primeiro
INSERT INTO aparelhos 
SELECT * FROM temp_aparelhos;

-- Depois restaurar dados das ordens
INSERT INTO ordens_servico 
SELECT * FROM temp_ordens;

-- Limpar tabelas temporárias
DROP TABLE temp_ordens;
DROP TABLE temp_aparelhos;

-- Recriar triggers
CREATE TRIGGER update_aparelhos_updated_at
    BEFORE UPDATE ON aparelhos
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_ordens_servico_updated_at
    BEFORE UPDATE ON ordens_servico
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Recriar políticas de segurança
ALTER TABLE aparelhos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordens_servico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir todas operações em aparelhos" ON aparelhos
    FOR ALL USING (true);

CREATE POLICY "Permitir todas operações em ordens_servico" ON ordens_servico
    FOR ALL USING (true);

COMMIT;
