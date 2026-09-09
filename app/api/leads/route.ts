import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // Public, unauthenticated endpoint — rate limit by IP to blunt spam/abuse.
  const ip = getClientIp(request)
  const { limited, retryAfterSeconds } = rateLimit(`leads:${ip}`, {
    max: 5,
    windowMs: 60 * 60 * 1000, // 5 submissions per IP per hour
  })
  if (limited) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    )
  }

  const supabase = await createClient()

  const body = await request.json()
  const { name, email, app_idea, budget_range, project_type, source } = body

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('leads')
    .insert([{ name, email, app_idea, budget_range, project_type, source: source || 'website' }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data.id })
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
