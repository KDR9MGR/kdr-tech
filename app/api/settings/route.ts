import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const settings: Record<string, string> = {}
  for (const row of data) {
    settings[row.key] = row.value
  }

  return NextResponse.json(settings)
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const updates = Object.entries(body).map(([key, value]) =>
    supabase
      .from('site_settings')
      .upsert({ key, value: String(value), updated_at: new Date().toISOString() }, { onConflict: 'key' })
  )

  const results = await Promise.all(updates)
  const firstError = results.find(r => r.error)

  if (firstError?.error) {
    return NextResponse.json({ error: firstError.error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
