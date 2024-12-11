import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
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
    } = await request.json()

    // Validações básicas
    if (!nome || !cpf || !rg || !telefone || !email || !endereco || !bairro || !cidade || !estado || !cep || !data_nascimento) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('clientes')
      .insert([
        {
          nome,
          cpf: cpf.replace(/\D/g, ''), // Remove caracteres não numéricos
          rg: rg.replace(/\D/g, ''),
          telefone: telefone.replace(/\D/g, ''),
          telefone_alternativo: telefone_alternativo?.replace(/\D/g, '') || null,
          email,
          endereco,
          bairro,
          cidade,
          estado: estado?.toUpperCase() || '',
          cep: cep.replace(/\D/g, ''),
          data_nascimento,
          observacoes: observacoes || null
        }
      ])
      .select()

    if (error) {
      console.error('Erro ao salvar cliente:', error)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'CPF ou Email já cadastrado' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Erro ao salvar cliente no banco de dados' },
        { status: 400 }
      )
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Erro ao processar requisição:', error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
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
