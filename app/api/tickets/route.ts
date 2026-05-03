import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('support_tickets')
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
  const { subject, client_name, status, priority, assigned_to, description, sla_hours, rating } = body

  if (!subject || !client_name) {
    return NextResponse.json({ error: 'Subject and client name are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('support_tickets')
    .insert([{ subject, client_name, status: status || 'new', priority: priority || 'medium', assigned_to: assigned_to || '', description: description || '', sla_hours: sla_hours || 24, rating: rating || null }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
