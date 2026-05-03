import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('pipeline_deals')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { client_name, company, email, project_type, package_name, deal_value, stage, notes } = body

  if (!client_name) {
    return NextResponse.json({ error: 'Client name is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('pipeline_deals')
    .insert([{ client_name, company: company || '', email: email || '', project_type: project_type || 'mobile_app', package_name: package_name || '', deal_value: deal_value || 0, stage: stage || 'contacted', notes: notes || '' }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
