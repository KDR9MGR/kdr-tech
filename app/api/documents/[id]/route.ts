import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get the document to find the file path in storage
  const { data: document, error: fetchError } = await supabase
    .from('documents')
    .select('file_url')
    .eq('id', id)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  // Extract path from public URL
  // Assuming public URL format: https://[project].supabase.co/storage/v1/object/public/documents/[path]
  const fileUrl = document.file_url
  const pathParts = fileUrl.split('/documents/')
  if (pathParts.length > 1) {
    const filePath = pathParts[1]
    // Delete from storage
    await supabase.storage.from('documents').remove([filePath])
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
