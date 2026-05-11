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

  try {
    const response = await fetch(document.file_url)
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
