-- Habilitar a extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de clientes
CREATE TABLE clientes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT NOT NULL,
    endereco TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de aparelhos
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

-- 3. Tabela de ordens de serviço
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

-- 4. Tabela de garantias
CREATE TABLE garantias (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ordem_servico_id UUID REFERENCES ordens_servico(id) ON DELETE CASCADE,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    termos TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('ATIVA', 'VENCIDA', 'CANCELADA')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar função para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar triggers para atualização automática do updated_at
CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_aparelhos_updated_at
    BEFORE UPDATE ON aparelhos
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_ordens_servico_updated_at
    BEFORE UPDATE ON ordens_servico
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_garantias_updated_at
    BEFORE UPDATE ON garantias
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Políticas de segurança (RLS)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE aparelhos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordens_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE garantias ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir todas as operações (para desenvolvimento)
CREATE POLICY "Permitir todas operações em clientes" ON clientes
    FOR ALL USING (true);

CREATE POLICY "Permitir todas operações em aparelhos" ON aparelhos
    FOR ALL USING (true);

CREATE POLICY "Permitir todas operações em ordens_servico" ON ordens_servico
    FOR ALL USING (true);

CREATE POLICY "Permitir todas operações em garantias" ON garantias
    FOR ALL USING (true);
