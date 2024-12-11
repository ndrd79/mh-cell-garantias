import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      .update({
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
        observacoes,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
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

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { error } = await supabase.from('clientes').delete().eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Cliente excluído com sucesso' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    )
  }
}
