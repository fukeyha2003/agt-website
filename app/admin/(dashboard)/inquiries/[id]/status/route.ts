import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/app/lib/supabase/admin'

const VALID = ['new', 'contacted', 'quotation_sent', 'negotiation', 'won', 'lost']

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { status } = await request.json()

  if (!VALID.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('quote_requests').update({ status }).eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}