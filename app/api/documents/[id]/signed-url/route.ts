import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { DOCUMENTS_BUCKET, extractDocumentStoragePath } from '@/lib/documents-storage'

// The `documents` bucket is private. Non-HTML files (images, PDFs, etc.)
// are opened/previewed directly by the browser rather than proxied through
// /view (which decodes as text and would corrupt binary content), so the
// admin UI fetches a short-lived signed URL from here first.
const SIGNED_URL_EXPIRY_SECONDS = 5 * 60

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await props.params

  const { data: document, error: fetchError } = await supabase
    .from('documents')
    .select('file_url')
    .eq('id', id)
    .single()

  if (fetchError || !document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  const filePath = extractDocumentStoragePath(document.file_url)
  if (!filePath) {
    return NextResponse.json({ error: 'Could not resolve document storage path' }, { status: 400 })
  }

  const { data: signed, error: signError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUrl(filePath, SIGNED_URL_EXPIRY_SECONDS)

  if (signError || !signed) {
    return NextResponse.json({ error: signError?.message || 'Failed to create signed URL' }, { status: 500 })
  }

  return NextResponse.json({ url: signed.signedUrl })
}
