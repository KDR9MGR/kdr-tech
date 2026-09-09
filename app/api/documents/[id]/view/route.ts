import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { DOCUMENTS_BUCKET, extractDocumentStoragePath } from '@/lib/documents-storage'

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

  // The `documents` bucket is private, so document.file_url (a "public
  // style" URL string kept only to encode the storage path — see
  // lib/documents-storage.ts) is no longer directly fetchable. Derive the
  // path and mint our own short-lived signed URL server-side. This also
  // closes the SSRF surface the old host-allowlist check was guarding
  // against: we're no longer fetching a client-supplied URL at all, only
  // one we constructed ourselves from a known bucket + derived path.
  const filePath = extractDocumentStoragePath(document.file_url)
  if (!filePath) {
    return NextResponse.json({ error: 'Could not resolve document storage path' }, { status: 400 })
  }

  const { data: signed, error: signError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUrl(filePath, 60)

  if (signError || !signed) {
    return NextResponse.json({ error: 'Failed to access document content' }, { status: 500 })
  }

  try {
    const response = await fetch(signed.signedUrl)
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
