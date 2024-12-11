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

    const { data, error } = await supabase
      .from('clientes')
      .insert([
        {
          nome,
          cpf,
          rg,
          telefone,
          telefone_alternativo,
          email,
          endereco,
          bairro,
          cidade,
          estado: estado.toUpperCase(),
          cep,
          data_nascimento,
          observacoes
        }
      ])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
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
