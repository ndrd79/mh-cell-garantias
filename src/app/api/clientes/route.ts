import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

function formatCPF(cpf: string): string {
  const numbers = cpf.replace(/\D/g, '')
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function formatCEP(cep: string): string {
  return cep.replace(/\D/g, '')
}

function formatTelefone(telefone: string): string {
  const numbers = telefone.replace(/\D/g, '')
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    console.log('Iniciando cadastro de cliente')
    const data = await request.json()
    console.log('Dados recebidos:', data)

    const {
      nome,
      cpf,
      rg,
      telefone,
      telefone_alternativo,
      email,
      endereco,
      bairro,
      cidade,
      estado,
      cep,
      data_nascimento,
      observacoes
    } = data

    // Validações básicas
    if (!nome || !cpf || !rg || !telefone || !email || !endereco || !bairro || !cidade || !estado || !cep || !data_nascimento) {
      console.error('Campos obrigatórios faltando:', {
        nome: !nome,
        cpf: !cpf,
        rg: !rg,
        telefone: !telefone,
        email: !email,
        endereco: !endereco,
        bairro: !bairro,
        cidade: !cidade,
        estado: !estado,
        cep: !cep,
        data_nascimento: !data_nascimento
      })
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      )
    }

    // Formata os dados antes de salvar
    const formattedData = {
      nome: nome.trim(),
      cpf: formatCPF(cpf),
      rg: rg.replace(/\D/g, ''),
      telefone: formatTelefone(telefone),
      telefone_alternativo: telefone_alternativo ? formatTelefone(telefone_alternativo) : null,
      email: email.toLowerCase().trim(),
      endereco: endereco.trim(),
      bairro: bairro.trim(),
      cidade: cidade.trim(),
      estado: estado.toUpperCase().trim(),
      cep: formatCEP(cep),
      data_nascimento,
      observacoes: observacoes?.trim() || null
    }

    console.log('Dados formatados:', formattedData)

    const { data: savedData, error } = await supabase
      .from('clientes')
      .insert([formattedData])
      .select()

    if (error) {
      console.error('Erro ao salvar cliente:', error)
      
      if (error.code === '23505') {
        if (error.message.includes('cpf')) {
          return NextResponse.json(
            { error: 'CPF já cadastrado' },
            { status: 400 }
          )
        }
        if (error.message.includes('email')) {
          return NextResponse.json(
            { error: 'Email já cadastrado' },
            { status: 400 }
          )
        }
        return NextResponse.json(
          { error: 'CPF ou Email já cadastrado' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: 'Erro ao salvar cliente no banco de dados: ' + error.message },
        { status: 400 }
      )
    }

    console.log('Cliente salvo com sucesso:', savedData)
    return NextResponse.json(savedData[0])
  } catch (error) {
    console.error('Erro ao processar requisição:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao processar a requisição' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nome')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    )
  }
}
