import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/team - Get all team members (public - only visible ones)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams

    // Check if user is authenticated (admin)
    const { data: { user } } = await supabase.auth.getUser()

    let query = supabase
      .from('team_members')
      .select('*')
      .order('order_index', { ascending: true })

    // If not admin, only show visible members
    if (!user) {
      query = query.eq('visible', true)
    }

    // Optional filters
    const featured = searchParams.get('featured')
    const department = searchParams.get('department')

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    if (department) {
      query = query.eq('department', department)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/team - Create new team member (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Generate slug from full_name if not provided
    if (!body.slug && body.full_name) {
      body.slug = body.full_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    const { data, error } = await supabase
      .from('team_members')
      .insert(body)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
