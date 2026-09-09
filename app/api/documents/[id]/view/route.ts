import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // For viewing documents, we can allow authenticated users
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await props.params

  const { data: document, error: fetchError } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  // SSRF guard: this route fetches a server-controlled-looking but
  // actually client-supplied URL (set at upload time in
  // app/admin/documents/page.tsx) and reflects the response back to the
  // caller. Restrict it to our own Supabase storage host so it can't be
  // used to make the server fetch internal/metadata URLs.
  let fileUrl: URL
  try {
    fileUrl = new URL(document.file_url)
  } catch {
    return NextResponse.json({ error: 'Invalid file URL' }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const allowedHost = supabaseUrl ? new URL(supabaseUrl).hostname : null

  if (!allowedHost || fileUrl.hostname !== allowedHost) {
    return NextResponse.json({ error: 'Document source not allowed' }, { status: 400 })
  }

  try {
    const response = await fetch(fileUrl.toString())
    const content = await response.text()

    // Return the content with the correct content type
    return new NextResponse(content, {
      headers: {
        'Content-Type': document.file_type || 'text/html',
        'Content-Disposition': 'inline',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch document content' }, { status: 500 })
  }
}
