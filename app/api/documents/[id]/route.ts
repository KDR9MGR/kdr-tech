import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { DOCUMENTS_BUCKET, extractDocumentStoragePath } from '@/lib/documents-storage'

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await props.params

  // Get the document to find the file path in storage
  const { data: document, error: fetchError } = await supabase
    .from('documents')
    .select('file_url')
    .eq('id', id)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  // Extract the storage path from the stored file_url and delete the
  // underlying object too, not just the database row.
  const filePath = extractDocumentStoragePath(document.file_url)
  if (filePath) {
    await supabase.storage.from(DOCUMENTS_BUCKET).remove([filePath])
  }

  // Delete from database
  const { error: deleteError } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
