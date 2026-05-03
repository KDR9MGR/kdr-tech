import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('projects')
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
  const { title, client_name, project_type, package_name, revenue, paid_amount, status, country, flag_emoji, start_date, end_date, notes } = body

  if (!title || !client_name) {
    return NextResponse.json({ error: 'Title and client name are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([{ title, client_name, project_type, package_name, revenue: revenue || 0, paid_amount: paid_amount || 0, status: status || 'active', country, flag_emoji, start_date: start_date || null, end_date: end_date || null, notes }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
